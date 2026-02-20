<script setup>
import { ref, onBeforeUnmount } from "vue"; // 1. Pastikan onBeforeUnmount sudah di-import
import CreateDealForm from "./forms/CreateDealForm.vue";
import {
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-vue-next";

const currentPage = ref(1);
const totalDeals = ref(18600);
const itemsPerPage = ref(10);

//data
const deals = ref([
  {
    id: 1,
    name: "TechFlow Solutions",
    stage: "qualified",
    jumlah: "Main Enterprise",
    tertanggal: "2023-10-20",
    contact: "John Doe",
    company: "meta tech",
    updatedAt: "2023-10-24",
    owner: "Alex Graham",
  },
]);

const selectedDeals = ref([]);

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
    <div class="pt-4 pr-4 pl-4">
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
          <!-- DELETE BUTTON (muncul saat ada selection) -->
          <button
            v-if="selectedDeals.length"
            @click="deleteSelected"
            class="flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-400 bg-red-50 text-red-700 font-semibold hover:bg-red-100 hover:border-red-500 transition"
          >
            <Trash2 :size="16" />
            DELETE ({{ selectedDeals.length }})
          </button>

          <!-- Divider -->
          <div
            v-if="selectedDeals.length"
            class="hidden sm:block w-px h-5 bg-outline"
          ></div>
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
                  @change="
                    (e) => {
                      selectedDeals = e.target.checked
                        ? deals.map((d) => d.id)
                        : [];
                    }
                  "
                  :checked="
                    selectedDeals.length === deals.length && deals.length > 0
                  "
                  class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
                />
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Deal Name
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Stage
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Jumlah/Tertanggal
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

          <!-- Table Body -->
          <tbody>
            <!-- Empty State -->
            <tr v-if="deals.length === 0">
              <td colspan="7" class="px-6 py-20 text-center text-sub-text">
                <div class="flex flex-col items-center gap-3">
                  <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    <Search :size="32" class="text-gray-400" />
                  </div>
                  <p class="text-lg font-medium">No deals found</p>
                  <p class="text-sm text-gray-400">
                    Start adding deals to see them here
                  </p>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="deal in deals"
              :key="deal.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="deal.id"
                  v-model="selectedDeals"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
                />
              </td>

              <td class="px-6 py-4 text-sm text-gray-800 font-medium">
                {{ deal.name }}
              </td>

              <td class="px-6 py-4 text-sm text-dark-base">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-700': deal.stage === 'qualified',
                    'bg-yellow-100 text-yellow-700': deal.stage === 'proposal',
                    'bg-red-100 text-red-700': deal.stage === 'lost',
                  }"
                >
                  {{ deal.stage }}
                </span>
              </td>

              <td class="px-6 py-4 text-sm text-dark-base">
                {{ deal.jumlah }} / {{ deal.tertanggal }}
              </td>

              <td class="px-6 py-4 text-sm text-dark-base">
                {{ deal.contact }} — {{ deal.company }}
              </td>

              <td class="px-6 py-4 text-sm text-dark-base">
                {{ deal.updatedAt }}
              </td>

              <td class="px-6 py-4 text-sm text-dark-base">
                {{ deal.owner }}
              </td>
            </tr>
          </tbody>
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
