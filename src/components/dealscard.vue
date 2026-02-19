<script setup>
import { ref } from "vue";
import draggable from "vuedraggable";

import {
  ChevronDown,
  Download,
  Edit,
  LayoutGrid,
  List,
  Search,
  Filter,
} from "lucide-vue-next";

const totalDeals = ref(18600);
const itemsPerPage = ref(10);

const Draggable = draggable;

// Data Mata Uang
const currencies = ["IDR", "USD", "SGD", "EUR"];
const selectedCurrency = ref("IDR");
const isCurrencyOpen = ref(false);

// Data Pipeline
const pipelines = ["Sales Pipeline", "Marketing Pipeline", "Dev Pipeline"];
const selectedPipeline = ref("Sales Pipeline");
const isPipelineOpen = ref(false);
const isDragging = ref(false);

const pipeline = ref({
  new: [
    { id: 1, name: "Client A", value: 500000 },
    { id: 2, name: "Client B", value: 300000 },
    { id: 3, name: "Client C", value: 450000 },
    { id: 4, name: "Client D", value: 200000 },
    { id: 5, name: "Client E", value: 750000 },
  ],
  qualified: [],
  advanced: [],
  payment: [],
  won: [],
  lost: [],
});

const boards = ref([
  { id: 1, title: "New", items: pipeline.value.new },
  { id: 2, title: "Qualified", items: pipeline.value.qualified },
  { id: 3, title: "Advanced", items: pipeline.value.advanced },
  { id: 4, title: "Payment", items: pipeline.value.payment },
  { id: 5, title: "Won", items: pipeline.value.won },
  { id: 6, title: "Lost", items: pipeline.value.lost },
]);

// hapus item
const deleteDeal = (item) => {
  boards.value.forEach((b) => {
    b.items = b.items.filter((i) => i.id !== item.id);
  });
};

const density = ref("comfy"); // comfy | compact
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Deals</h1>
      <span class="text-sm text-sub-text"
        >{{ totalDeals.toLocaleString() }} Total Deals</span
      >
    </div>

    <!-- Action Button -->
    <div class="flex items-center gap-2">
      <!-- Add New -->
      <button
        class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
      >
        <span class="text-lg font-semibold">+</span>
        <span class="text-sm font-medium">Add New</span>
        <ChevronDown :size="16" />
      </button>

      <!-- Download -->
      <button
        class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
      >
        <Download :size="18" />
        <span class="text-sm font-medium">Download</span>
        <ChevronDown :size="16" />
      </button>

      <!-- Bulk Edit -->
      <button
        class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
      >
        <Edit :size="18" />
        <span class="text-sm font-medium">Bulk Edit</span>
      </button>

      <!-- Grid Mode -->
      <button
        title="Pipeline Mode"
        class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
      >
        <LayoutGrid :size="18" />
      </button>

      <!-- List Mode -->
      <button
        title="List Mode"
        class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
      >
        <List :size="18" :stroke-width="3" />
      </button>
    </div>
  </div>

  <!-- Placeholder for Deals Card -->
  <div
    class="bg-white rounded-lg shadow-sm max-w-7xl h-147 border border-outline flex flex-col overflow-hidden"
  >
    <!-- Action Bar -->
    <div class="p-4 border-b border-outline">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <!-- Filter Button -->
          <button
            class="p-2 border border-outline rounded-lg hover:bg-outline/30 transition"
          >
            <Filter :size="20" class="text-dark-base" />
          </button>

          <!-- Search Input -->
          <div class="relative">
            <input
              type="text"
              placeholder="Search by Name"
              class="pl-3 pr-4 py-2 bg-white border border-outline rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
            />
          </div>

          <!-- Search Button -->
          <button
            class="p-2 bg-outline hover:bg-outline/30 rounded-lg transition"
          >
            <Search :size="20" class="text-dark-base" />
          </button>

          <!-- Items Per Page -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-dark-base">Show</span>
            <select
              v-model="itemsPerPage"
              class="px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>

        <!-- Currency & Pipeline Filters -->
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

    <!-- Pipeline Boards -->
    <div class="relative h-full w-full">
      <!-- Scrollable Container with Gradient Edges -->
      <div class="overflow-x-auto bg-white p-6 custom-scrollbar">
        <!-- Boards Container -->
        <div class="flex h-118 flex-nowrap gap-4">
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
              @start="isDragging = true"
              @end="isDragging = false"
            >
              <template #item="{ element }">
                <div
                  class="bg-white p-4 rounded shadow-sm border border-gray-200 cursor-move hover:border-blue-500 transition"
                >
                  <p class="text-sm font-medium text-gray-700">
                    {{ element.name }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    ID: #{{ element.id }}
                  </p>
                </div>
              </template>
            </draggable>

            <!-- Board Footer with Total -->
            <div
              class="h-14 bg-white border-t-2 border-gray-300 flex items-center justify-center rounded-b-sm"
            >
              <span class="text-gray-800 text-sm font-bold font-['Montserrat']">
                TOTAL: Rp
                {{
                  board.items.reduce((t, i) => t + i.value, 0).toLocaleString()
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
      <!-- DANGER DELETE ZONE -->
      <div
        v-show="isDragging"
        class="absolute bottom-0 left-0 w-full h-40 z-50 pointer-events-none"
      >
        <!-- gradient -->
        <div
          class="absolute inset-0 bg-linear-to-t from-red-600/80 via-red-500/40 to-transparent"
        ></div>

        <!-- center content -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div
            class="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-red-500"
          >
            <!-- trash icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-7 h-7 text-red-600"
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
          </div>

          <p class="mt-2 text-white text-sm tracking-wide">
            Drop to <span class="font-bold">DELETE</span>
          </p>
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
