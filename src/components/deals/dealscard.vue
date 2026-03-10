<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useStore } from "vuex";
import draggable from "vuedraggable";
import { ChevronDown, Search, Filter } from "lucide-vue-next";
import { alertService } from "@/services/alertService";

const store = useStore();

const emit = defineEmits(["viewDetail"]);

// Access sidebar state from Vuex
const isSidebarCollapsed = computed(
  () => store.getters["settingsfe/isSidebarCollapsed"],
);

// Data Mata Uang
const currencies = ["IDR", "USD", "SGD", "EUR"];
const selectedCurrency = ref("IDR");
const isCurrencyOpen = ref(false);

// Data Pipeline
const pipelines = ["Sales Pipeline", "Marketing Pipeline", "Dev Pipeline"];
const selectedPipeline = ref("Sales Pipeline");
const isPipelineOpen = ref(false);

const boardMeta = [
  { id: 1, key: "new", title: "New" },
  { id: 2, key: "qualified", title: "Qualified" },
  { id: 3, key: "advanced", title: "Advanced" },
  { id: 4, key: "payment", title: "Payment" },
  { id: 5, key: "won", title: "Won" },
  { id: 6, key: "lost", title: "Lost" },
];

const boards = ref([]);
const isSyncingStage = ref(false);

const allDeals = computed(() => store.getters["deals/filteredDeals"] || []);

const searchQuery = computed({
  get: () => store.state.deals.searchQuery,
  set: (value) => store.dispatch("deals/setSearchQuery", value),
});

const normalizeStage = (rawStage) => {
  const stage = String(rawStage || "new").toLowerCase();
  if (stage.includes("qual")) return "qualified";
  if (stage.includes("adv") || stage.includes("negot")) return "advanced";
  if (stage.includes("pay") || stage.includes("proposal")) return "payment";
  if (
    stage.includes("won") ||
    stage.includes("close_won") ||
    stage.includes("closed_won")
  )
    return "won";
  if (
    stage.includes("lost") ||
    stage.includes("close_lost") ||
    stage.includes("closed_lost")
  )
    return "lost";
  return "new";
};

const normalizeDeal = (deal) => ({
  id: deal.id,
  name: deal.name || deal.dealName || deal.deal_name || "Untitled Deal",
  stage: normalizeStage(deal.stage || deal.pipeline),
  jumlah: deal.jumlah || deal.amount_value || deal.amount || "-",
  tertanggal:
    deal.tertanggal ||
    deal.expectedCloseDate ||
    deal.expected_close_date ||
    "-",
  contact: deal.contact || deal.contact_name || "-",
  company: deal.company || deal.company_name || "-",
  updatedAt: deal.updatedAt || deal.updated_at || "-",
  owner: deal.owner || deal.owner_name || "-",
  value: Number(deal.value || deal.amount_value || deal.amount || 0),
});

const rebuildBoards = (rawDeals) => {
  const grouped = {
    new: [],
    qualified: [],
    advanced: [],
    payment: [],
    won: [],
    lost: [],
  };

  rawDeals.map(normalizeDeal).forEach((deal) => {
    grouped[deal.stage].push(deal);
  });

  boards.value = boardMeta.map((board) => ({
    ...board,
    items: grouped[board.key],
  }));
};

// Delete deal with confirmation
const deleteDeal = async (deal, event) => {
  // Prevent opening deal detail when clicking delete
  event.stopPropagation();

  const confirmed = await alertService.confirm(
    "Hapus Deal?",
    "Deal ini akan dihapus secara permanen. Lanjutkan?",
  );

  if (!confirmed) return;

  try {
    await store.dispatch("deals/deleteDeal", deal.id);
    alertService.success("Deal berhasil dihapus.");
    await store.dispatch("deals/fetchAllDeals").catch(() => {});
  } catch (err) {
    console.error("Delete deal error:", err);
    alertService.error("Gagal menghapus deal. Coba lagi.");
  }
};

const handleBoardChange = async (event, targetBoard) => {
  if (!event || !event.added || !event.added.element) return;

  const movedDeal = event.added.element;
  const previousStage = movedDeal.stage;
  const nextStage = targetBoard.key;

  if (previousStage === nextStage) return;

  movedDeal.stage = nextStage;
  isSyncingStage.value = true;

  try {
    await store.dispatch("deals/updateDealStage", {
      dealId: movedDeal.id,
      newStage: nextStage,
    });
  } catch (error) {
    movedDeal.stage = previousStage;
    await store.dispatch("deals/fetchAllDeals").catch(() => {});
  } finally {
    isSyncingStage.value = false;
  }
};

const handleViewDetail = (deal) => {
  emit("viewDetail", deal);
};

const stageClass = (stage) => {
  if (stage === "new") return "bg-slate-100 text-slate-700";
  if (stage === "qualified") return "bg-green-100 text-green-700";
  if (stage === "advanced" || stage === "payment")
    return "bg-yellow-100 text-yellow-700";
  if (stage === "won") return "bg-emerald-100 text-emerald-700";
  if (stage === "lost") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
};

onMounted(async () => {
  try {
    await store.dispatch("deals/fetchAllDeals");
  } catch (error) {
    rebuildBoards([]);
  }
});

watch(
  allDeals,
  (deals) => {
    rebuildBoards(deals);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  isCurrencyOpen.value = false;
  isPipelineOpen.value = false;

  console.log("State dibersihkan, overlay dimatikan!");
});
</script>

<template>
  <!-- Placeholder for Deals Card -->
  <div
    :class="[
      'bg-white rounded-lg shadow-sm h-147 border border-outline flex flex-col overflow-hidden',
      isSidebarCollapsed ? 'max-w-352' : 'max-w-310',
    ]"
  >
    <!-- Action Bar -->
    <div class="p-4 border-b border-outline">
      <div class="flex items-center gap-4 w-full">
        <!-- LEFT -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <!-- Filter -->
          <button
            class="p-2 border border-outline rounded-lg hover:bg-outline/30 transition"
          >
            <Filter :size="20" class="text-dark-base" />
          </button>

          <!-- Search -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by Name"
            class="pl-3 pr-4 py-2 bg-white border border-outline rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
          />

          <!-- Search Btn -->
          <button
            class="p-2 bg-outline hover:bg-outline/30 rounded-lg transition"
          >
            <Search :size="20" class="text-dark-base" />
          </button>

          <!-- Show -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-dark-base">Show</span>
            <select class="px-3 py-2 border border-outline rounded-lg text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>

        <!-- Currency n pipeline -->
        <div class="flex items-center gap-4 text-sm font-medium text-slate-600">
          <!-- Currency Dropdown -->
          <div class="relative">
            <button
              @click="isCurrencyOpen = !isCurrencyOpen"
              class="flex items-center gap-1 hover:text-dark-base transition"
            >
              <span
                >Currency:
                <span class="text-dark-base font-bold">{{
                  selectedCurrency
                }}</span></span
              >
              <ChevronDown
                :size="16"
                :class="{ 'rotate-180': isCurrencyOpen }"
                class="transition-transform"
              />
            </button>

            <div
              v-if="isCurrencyOpen"
              class="absolute right-0 mt-2 w-32 bg-white border border-outline rounded-lg shadow-lg z-20"
            >
              <ul class="py-1">
                <li
                  v-for="curr in currencies"
                  :key="curr"
                  @click="
                    selectedCurrency = curr;
                    isCurrencyOpen = false;
                  "
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-dark-base"
                >
                  {{ curr }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Divider -->
          <div class="hidden sm:block w-px h-5 bg-outline"></div>

          <!-- Pipeline Dropdown -->
          <div class="relative">
            <button
              @click="isPipelineOpen = !isPipelineOpen"
              class="flex items-center gap-1 hover:text-dark-base transition"
            >
              <span
                >Pipeline:
                <span class="text-dark-base font-bold">{{
                  selectedPipeline
                }}</span></span
              >
              <ChevronDown
                :size="16"
                :class="{ 'rotate-180': isPipelineOpen }"
                class="transition-transform"
              />
            </button>

            <div
              v-if="isPipelineOpen"
              class="absolute right-0 mt-2 w-48 bg-white border border-outline rounded-lg shadow-lg z-20"
            >
              <ul class="py-1">
                <li
                  v-for="pipe in pipelines"
                  :key="pipe"
                  @click="
                    selectedPipeline = pipe;
                    isPipelineOpen = false;
                  "
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-dark-base"
                >
                  {{ pipe }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div></div>

    <!-- Pipeline Boards -->
    <div class="relative h-full w-full overflow-hidden">
      <!-- Scrollable Container with Gradient Edges -->
      <div class="overflow-x-auto bg-white pt-6 custom-scrollbar w-full">
        <!-- Boards Container -->
        <div class="pr-6">
          <div class="flex h-118 flex-nowrap gap-4 overflow-x-auto pl-6">
            <!-- Individual Board -->
            <div
              v-for="board in boards"
              :key="board.id"
              class="w-72 shrink-0 flex flex-col bg-slate-100/60 rounded-sm border-2 border-gray-300 relative"
            >
              <!-- Board Header -->
              <div
                class="h-14 bg-white border-b-2 border-gray-300 flex items-center justify-between px-4 rounded-t-sm"
              >
                <span
                  class="text-gray-800 text-sm font-bold font-['Montserrat']"
                  >{{ board.title }}</span
                >
                <div class="bg-gray-800 px-2 py-0.5 rounded-sm">
                  <span class="text-white text-[10px] font-bold"
                    >{{ board.items.length }}
                  </span>
                </div>
              </div>

              <!-- Draggable Items -->
              <draggable
                v-model="board.items"
                group="deals"
                item-key="id"
                class="flex-1 p-3 space-y-3 overflow-y-auto"
                @change="(event) => handleBoardChange(event, board)"
              >
                <template #item="{ element }">
                  <div
                    @click="handleViewDetail(element)"
                    class="bg-white p-4 rounded shadow-sm border border-gray-200 cursor-pointer hover:border-blue-500 transition relative group"
                  >
                    <!-- Delete Button -->
                    <button
                      @click="deleteDeal(element, $event)"
                      class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus deal"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19 7L5 7M10 11V17M14 11V17M9 7V4H15V7M6 7H18L17 20H7L6 7Z"
                        />
                      </svg>
                    </button>

                    <p class="text-sm font-medium text-gray-800 truncate pr-8">
                      {{ element.name }}
                    </p>

                    <div class="mt-2">
                      <span
                        class="px-2 py-0.5 rounded-full text-[11px] font-medium capitalize"
                        :class="stageClass(element.stage)"
                      >
                        {{ board.title }}
                      </span>
                    </div>

                    <p class="text-xs text-gray-500 mt-2">
                      {{ element.jumlah }} / {{ element.tertanggal }}
                    </p>

                    <p class="text-xs text-gray-500 mt-1 truncate">
                      {{ element.contact }} - {{ element.company }}
                    </p>

                    <p class="text-xs text-gray-400 mt-1">
                      Updated: {{ element.updatedAt }}
                    </p>

                    <p class="text-xs text-gray-400 mt-1">
                      Owner: {{ element.owner }}
                    </p>
                  </div>
                </template>
              </draggable>

              <!-- Board Footer with Total -->
              <div
                class="h-14 bg-white border-t-2 border-gray-300 flex items-center justify-center rounded-b-sm"
              >
                <span
                  class="text-gray-800 text-sm font-bold font-['Montserrat']"
                >
                  TOTAL: Rp
                  {{
                    board.items
                      .reduce((t, i) => t + i.value, 0)
                      .toLocaleString()
                  }}
                </span>
              </div>
            </div>
            <!-- LEFT GRADIENT -->
            <div
              class="pointer-events-none absolute top-0 left-0 h-full w-9 bg-linear-to-r from-white to-transparent"
            ></div>
            <!-- RIGHT GRADIENT -->
            <div
              class="pointer-events-none absolute top-0 right-0 h-full w-9 bg-linear-to-l from-white to-transparent"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ghost-card {
  opacity: 0.35;
  transform: rotate(2deg);
}

.chosen-card {
  transform: scale(1.03);
}

.drag-card {
  transform: rotate(3deg);
}
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 999px;
}
</style>
