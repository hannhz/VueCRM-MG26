<script setup>
import {
  Search,
  ChevronDown,
  Download,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
} from "lucide-vue-next";
import { ref } from "vue";

// Sample data - replace with actual data from API
const companies = ref([
  {
    id: 1,
    name: "TechFlow Solutions",
    email: "contact@techflow.io",
    company: "Main Enterprise",
    status: "Active",
    updatedAt: "2023-10-24",
    owner: "Alex Graham",
  },
  {
    id: 2,
    name: "Nexus Digital",
    email: "support@nexus.com",
    company: "Sub-Agency",
    status: "Inactive",
    updatedAt: "2023-10-22",
    owner: "Sarah Jenkins",
  },
  {
    id: 3,
    name: "Green Horizon Inc",
    email: "info@greenhorizon.com",
    company: "Eco Group",
    status: "Active",
    updatedAt: "2023-10-20",
    owner: "Michael Chen",
  },
  {
    id: 4,
    name: "Quantum Leap Ltd",
    email: "hello@quantum.co",
    company: "Research Division",
    status: "Active",
    updatedAt: "2023-10-18",
    owner: "Alex Graham",
  },
  {
    id: 5,
    name: "Stellar Softwares",
    email: "admin@stellar.net",
    company: "Global Tech",
    status: "Inactive",
    updatedAt: "2023-10-15",
    owner: "Jessica Alba",
  },
]);
const currentPage = ref(1);
const totalCompanies = ref(18600);
const itemsPerPage = ref(10);
</script>

<template>
  <!-- Header with Title and Total -->
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Companies</h1>
      <span class="text-sm text-sub-text"
        >{{ totalCompanies.toLocaleString() }} Total Companies</span
      >
    </div>

    <!-- Update Button -->
    <button
      class="flex items-center gap-2 px-4 py-2 border border-outline bg-white text-sub-text rounded-lg hover:bg-sub-text hover:text-white transition shadow-sm"
    >
      <span class="text-sm font-medium">Update</span>
      <RefreshCcw :size="18" />
    </button>
  </div>

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

        <!-- Delete -->
        <button
          class="p-2 bg-white border border-red text-red rounded-lg hover:bg-red hover:text-white transition"
        >
          <Trash2 :size="18" />
        </button>
      </div>
    </div>

    <!--- filter select n page -->
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

        <span>of {{ Math.ceil(totalCompanies / itemsPerPage) }}</span>

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
          <tbody>
            <!-- Empty State -->
            <tr v-if="companies.length === 0">
              <td colspan="7" class="px-6 py-20 text-center text-sub-text">
                <div class="flex flex-col items-center gap-3">
                  <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    <Search :size="32" class="text-gray-400" />
                  </div>
                  <p class="text-lg font-medium">No companies found</p>
                  <p class="text-sm text-gray-400">
                    Start adding companies to see them here
                  </p>
                </div>
              </td>
            </tr>

            <!-- Sample rows - will be populated with actual data -->
            <tr
              v-for="contact in companies"
              :key="contact.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
                />
              </td>
              <td class="px-6 py-4 text-sm text-gray-800 font-medium">
                {{ contact.name }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ contact.email }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ contact.company }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-700': contact.status === 'Active',
                    'bg-gray-100 text-gray-700': contact.status === 'Inactive',
                  }"
                >
                  {{ contact.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ contact.updatedAt }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ contact.owner }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
