<script setup>
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

import { ref } from "vue";
import draggable from 'vuedraggable';

// Data Mata Uang
const currencies = ["IDR", "USD", "SGD", "EUR"];
const selectedCurrency = ref("IDR");
const isCurrencyOpen = ref(false);

// Data Pipeline
const pipelines = ["Sales Pipeline", "Marketing Pipeline", "Dev Pipeline"];
const selectedPipeline = ref("Sales Pipeline");
const isPipelineOpen = ref(false);

const boards = ref([
  { id: 1, title: 'New', count: 1000, total: 0, items: [{ id: 101, name: 'Deal A' }, { id: 102, name: 'Deal B' }] },
  { id: 2, title: 'Qualified', count: 1000, total: 0, items: [] },
  { id: 3, title: 'Advanced', count: 1000, total: 0, items: [] },
  { id: 4, title: 'Payment in Process', count: 1000, total: 0, items: [] },
  { id: 5, title: 'Won', count: 1000, total: 0, items: [] },
  { id: 6, title: 'Lost', count: 1000, total: 0, items: [] },
]);

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
  <!-- Action Bar -->
  <div class="bg-white rounded-lg shadow-sm h-147 p-4 border border-outline">
    <div class="flex items-center justify-between gap-4">
      <!-- Left Section: Filter + Search + Show -->
      <div class="flex items-center gap-3">
        <!-- Filter Icon -->
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

        <!-- Search Icon Button -->
        <button
          class="p-2 bg-outline hover:bg-outline/30 rounded-lg transition"
        >
          <Search :size="20" class="text-dark-base" />
        </button>

        <!-- Show Dropdown -->    
        <div class="flex items-center gap-2">
          <span class="text-sm text-dark-base">Show</span>
          <select
            v-model="itemsPerPage"
            class="px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
      <!-- Right Section: Action Buttons -->
      <div class="flex items-center gap-2">
        <div
          class="flex flex-wrap items-center justify-end gap-4 p-4 text-sm font-medium text-slate-600"
        >
          <div class="relative">
            <button
              @click="isCurrencyOpen = !isCurrencyOpen"
              class="flex items-center gap-1 hover:text-dark-base transition focus:outline-none"
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
              class="absolute right-0 mt-2 w-32 bg-white border border-outline rounded-lg shadow-lg z-10"
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

          <div class="hidden sm:block w-px h-5 bg-outline"></div>

          <div class="relative">
            <button
              @click="isPipelineOpen = !isPipelineOpen"
              class="flex items-center gap-1 hover:text-dark-base transition focus:outline-none"
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
              class="absolute right-0 mt-2 w-48 bg-white border border-outline rounded-lg shadow-lg z-10"
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
    
  </div>
</template>
