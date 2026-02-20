<script setup>
import { ref, onBeforeUnmount } from "vue"; // 1. Pastikan onBeforeUnmount sudah di-import
import CreateDealForm from "./forms/CreateDealForm.vue";
import {
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";

const currentPage = ref(1);
const totalDeals = ref(18600);
const itemsPerPage = ref(10);


// Data Mata Uang
const currencies = ["IDR", "USD", "SGD", "EUR"];
const selectedCurrency = ref("IDR");
const isCurrencyOpen = ref(false);

// Data Pipeline
const pipelines = ["Sales Pipeline", "Marketing Pipeline", "Dev Pipeline"];
const selectedPipeline = ref("Sales Pipeline");
const isPipelineOpen = ref(false);
const showCreateDealForm = ref(false);

//handled add deal form
const handleAddDeal = (dealData) => {
  // Logic untuk save deal data ke API atau state
  console.log("New deal:", dealData);
  // TODO: Implement API call
};
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm max-w-311.25 h-147 border border-outline flex flex-col overflow-hidden"
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

    <!-- select sama page total -->
    <div class="px-6 py-4 flex items-center">
      <!-- KIRI -->
      <label class="flex items-center gap-2 text-sm text-sub-text">
        <input
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-sub-text focus:ring-sub-text"
        />
        Select all filtered result
      </label>

      <!-- PUSH KANAN -->
      <div class="ml-auto flex items-center gap-3 text-sm text-sub-text">
        <button
          class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
          :disabled="currentPage === 1"
        >
          <ChevronLeft :size="18" class="text-sub-text" />
        </button>

        <span>Page</span>

        <input
          type="number"
          v-model="currentPage"
          min="1"
          class="w-12 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-sub-text"
        />

        <span>of {{ Math.ceil(totalDeals / itemsPerPage) }}</span>

        <button
          class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
        >
          <ChevronRight :size="18" class="text-sub-text" />
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
                />
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Company Name
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Info Company
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Associated with
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Type
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Created/Update
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Owner
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
            </tr>
          </thead>
          
        </table>
      </div>
    </div>
  </div>

  <!-- Create Deal Form -->
  <CreateDealForm
    :isOpen="showCreateDealForm"
    @close="showCreateDealForm = false"
    @submit="showCreateDealForm = false"
  />
</template>
