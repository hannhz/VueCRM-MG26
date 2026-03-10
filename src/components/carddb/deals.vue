<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const showFilterMenu = ref(false);
const selectedRange = ref("yearly");
const filterMenuRef = ref(null);

const deals = computed(() => store.getters["deals/allDeals"] || []);
const isLoadingDeals = computed(() => store.getters["deals/isLoading"]);

const normalizePipelineKey = (deal) => {
  const raw = String(deal?.pipeline || deal?.stage || "new")
    .toLowerCase()
    .trim();

  if (raw === "new") return "new";
  if (raw === "qualified") return "qualified";
  if (raw === "advanced" || raw === "negotiation") return "advanced";
  if (raw === "payment" || raw === "proposal") return "payment";
  if (raw === "won" || raw === "closed_won") return "won";
  if (raw === "lost" || raw === "closed_lost") return "lost";
  return "new";
};

const rangeOptions = [
  { value: "yearly", label: "A Year" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
];

const selectedRangeLabel = computed(() => {
  return (
    rangeOptions.find((item) => item.value === selectedRange.value)?.label ||
    "A Year"
  );
});

const getDealTimestamp = (deal) => {
  const rawDate =
    deal?.created_at || deal?.updated_at || deal?.expected_close_date;
  if (!rawDate) return null;
  const parsed = new Date(rawDate).getTime();
  return Number.isFinite(parsed) ? parsed : null;
};

const filteredDeals = computed(() => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const rangeMap = {
    yearly: 365,
    monthly: 30,
    weekly: 7,
  };

  const maxAgeDays = rangeMap[selectedRange.value] || 365;
  const threshold = now - maxAgeDays * day;

  return deals.value.filter((deal) => {
    const ts = getDealTimestamp(deal);
    if (!ts) return false;
    return ts >= threshold;
  });
});

const pipelineItems = computed(() => {
  const counters = {
    new: 0,
    qualified: 0,
    advanced: 0,
    payment: 0,
    won: 0,
    lost: 0,
  };

  filteredDeals.value.forEach((deal) => {
    const key = normalizePipelineKey(deal);
    counters[key] += 1;
  });

  return [
    { key: "new", label: "New", total: counters.new },
    { key: "qualified", label: "Qualified", total: counters.qualified },
    { key: "advanced", label: "Advanced", total: counters.advanced },
    { key: "payment", label: "Payment", total: counters.payment },
    { key: "won", label: "Won", total: counters.won },
    { key: "lost", label: "Lost", total: counters.lost },
  ];
});

const maxPipelineTotal = computed(() => {
  return Math.max(...pipelineItems.value.map((item) => item.total), 0);
});

const getBarWidth = (total) => {
  if (isLoadingDeals.value) return "100%";
  if (maxPipelineTotal.value === 0) return "0%";
  return `${(total / maxPipelineTotal.value) * 100}%`;
};

const formatCount = (value) => {
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
};

const displayCount = (value) => {
  return isLoadingDeals.value ? "..." : formatCount(value);
};

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value;
};

const selectRange = (value) => {
  selectedRange.value = value;
  showFilterMenu.value = false;
};

const handleClickOutside = (event) => {
  if (!showFilterMenu.value) return;
  if (filterMenuRef.value && !filterMenuRef.value.contains(event.target)) {
    showFilterMenu.value = false;
  }
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await store.dispatch("deals/fetchAllDeals").catch(() => {});
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <!-- Deals Overview Card -->
  <div class="bg-white rounded-2xl w-full shadow-sm border border-outline p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-dark-base">Deals Overview</h2>
      <div ref="filterMenuRef" class="relative">
        <button
          @click="toggleFilterMenu"
          class="text-slate-400 hover:text-gray-700 px-2 py-1 rounded"
          title="Filter"
        >
          •••
        </button>

        <div
          v-if="showFilterMenu"
          class="absolute right-0 mt-2 w-40 bg-white border border-outline rounded-lg shadow-lg z-20 py-1"
        >
          <button
            v-for="option in rangeOptions"
            :key="option.value"
            @click="selectRange(option.value)"
            class="w-full text-left px-3 py-2 text-sm hover:bg-outline/20 transition"
            :class="
              option.value === selectedRange
                ? 'text-dark-base font-semibold'
                : 'text-sub-text'
            "
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sub Header -->
    <div class="flex justify-between text-sm text-sub-text font-medium mb-4">
      <span>Pipeline Summary ({{ selectedRangeLabel }})</span>
      <span>Total</span>
    </div>

    <!-- Pipeline Items -->
    <div class="space-y-3">
      <div
        v-for="item in pipelineItems"
        :key="item.key"
        class="grid grid-cols-[1fr_64px] items-center gap-4"
      >
        <div class="h-9 flex items-center">
          <div
            class="relative w-full h-9 rounded-md bg-outline/20 overflow-hidden"
          >
            <div
              class="h-full bg-outline/40 transition-all duration-500 ease-out"
              :style="{ width: getBarWidth(item.total) }"
            ></div>
            <span
              class="absolute inset-y-0 left-3 flex items-center text-sm font-medium text-dark-base"
            >
              {{ item.label }}
            </span>
          </div>
        </div>
        <span
          class="text-sm font-medium text-dark-base text-right tabular-nums"
          >{{ displayCount(item.total) }}</span
        >
      </div>
    </div>
  </div>
</template>
