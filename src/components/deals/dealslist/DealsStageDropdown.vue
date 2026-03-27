<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { ChevronDown } from "lucide-vue-next";

const props = defineProps({
  deal: Object,
});

const store = useStore();
const isOpen = ref(false);
const isSyncing = ref(false);

const stageOptions = [
  { value: "prospect", label: "Prospect" },
  { value: "qualified", label: "Qualified" },
  { value: "offer", label: "Offer" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed_won", label: "Won" },
  { value: "closed_lost", label: "Lost" },
  { value: "closed_cancel", label: "Cancel" },
];

const currentLabel = computed(() => {
  return stageOptions.find(opt => opt.value === props.deal.stage)?.label || props.deal.stage;
});

const stageColor = (stage) => {
  if (stage === "prospect") return "bg-slate-100 text-slate-700";
  if (stage === "qualified") return "bg-blue-100 text-blue-700";
  if (stage === "offer") return "bg-indigo-100 text-indigo-700";
  if (stage === "negotiation") return "bg-yellow-100 text-yellow-700";
  if (stage === "closed_won") return "bg-emerald-100 text-emerald-700";
  if (stage === "closed_lost") return "bg-red-100 text-red-700";
  if (stage === "closed_cancel") return "bg-gray-100 text-gray-500";
  return "bg-slate-100 text-slate-700";
};

const handleSelect = async (newStage) => {
  if (newStage === props.deal.stage) {
    isOpen.value = false;
    return;
  }

  isSyncing.value = true;
  isOpen.value = false;

  try {
    await store.dispatch("deals/updateDealStage", {
      dealId: props.deal.id,
      newStage,
    });
  } catch (error) {
    console.error("Failed to update stage:", error);
  } finally {
    isSyncing.value = false;
  }
};
</script>

<template>
  <div class="relative w-full max-w-[140px]">
    <button
      @click.stop="isOpen = !isOpen"
      :disabled="isSyncing"
      class="w-full px-3 py-1.5 rounded-md text-[11px] font-bold inline-flex items-center justify-between gap-2 border border-transparent transition hover:border-outline/40 disabled:opacity-60"
      :class="[stageColor(deal.stage)]"
    >
      <span class="truncate">{{ currentLabel }}</span>
      <ChevronDown :size="14" :class="{ 'rotate-180': isOpen }" class="transition-transform duration-200" />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute top-full mt-1 left-0 w-44 bg-white border border-outline rounded-lg shadow-xl z-50 py-1 overflow-hidden"
      >
        <button
          v-for="opt in stageOptions"
          :key="opt.value"
          @click.stop="handleSelect(opt.value)"
          class="w-full text-left px-3 py-2 text-xs transition hover:bg-slate-50 flex items-center justify-between group"
          :class="deal.stage === opt.value ? 'font-bold text-sub-text bg-slate-50' : 'text-gray-600'"
        >
          <span>{{ opt.label }}</span>
          <span
            v-if="deal.stage === opt.value"
            class="text-sub-text text-[10px]"
          >✓</span>
        </button>
      </div>
    </Transition>
  </div>
</template>