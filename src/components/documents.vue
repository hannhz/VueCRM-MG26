<script setup>
import { ref, computed, watch } from "vue";
import {
  RefreshCcw,
  Filter,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-vue-next";

//data
const documents = ref([
  {
    id: 1,
    name: "Company Profile 2026",
    owner: "Hanan Hafizhah",
    created: "12 Feb 2026",
    update: "15 Feb 2026",
  },
  {
    id: 2,
    name: "Marketing Strategy",
    owner: "Aulia Rahman",
    created: "10 Feb 2026",
    update: "18 Feb 2026",
  },
  {
    id: 3,
    name: "UI Design Guidelines",
    owner: "Rizky Pratama",
    created: "02 Feb 2026",
    update: "14 Feb 2026",
  },
  {
    id: 4,
    name: "Project Timeline",
    owner: "Siti Lestari",
    created: "01 Feb 2026",
    update: "16 Feb 2026",
  },
  {
    id: 5,
    name: "Financial Report",
    owner: "Budi Santoso",
    created: "22 Jan 2026",
    update: "12 Feb 2026",
  },
  {
    id: 6,
    name: "Product Roadmap",
    owner: "Kevin Wijaya",
    created: "18 Jan 2026",
    update: "11 Feb 2026",
  },
]);

//pagination

const itemsPerPage = ref(5);
const currentPage = ref(1);

const totalDocuments = computed(() => documents.value.length);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalDocuments.value / itemsPerPage.value)),
);

/* pastikan page valid */
watch(currentPage, (val) => {
  if (val < 1) currentPage.value = 1;
  if (val > totalPages.value) currentPage.value = totalPages.value;
});

/* reset page jika jumlah per page berubah */
watch(itemsPerPage, () => (currentPage.value = 1));

/* data yang tampil di tabel */
const companies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return documents.value.slice(start, end);
});

//checkbox select all

const selectedIds = ref([]);

const isAllSelected = computed({
  get() {
    return (
      companies.value.length > 0 &&
      companies.value.every((d) => selectedIds.value.includes(d.id))
    );
  },
  set(val) {
    if (val) {
      selectedIds.value = companies.value.map((d) => d.id);
    } else {
      selectedIds.value = [];
    }
  },
});

//action page

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
</script>

<template>
  <!-- Header with Title and Total -->
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Documents</h1>
      <span class="text-sm text-sub-text"
        >{{ totalDocuments.toLocaleString() }} Total Documents</span
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

  <!-- Document List -->
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
        <div class="relative inline-block add-dropdown">
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
          >
            <span class="text-lg font-semibold">+</span>
            <span class="text-sm font-medium">Add Documents</span>
          </button>
        </div>

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
          v-model="isAllSelected"
          class="h-4 w-4 rounded border-gray-300 text-sub-text focus:ring-sub-text"
        />
        Select all filtered result
      </label>

      <!-- PUSH KANAN -->
      <div class="ml-auto flex items-center gap-3 text-sm text-sub-text">
        <button
          @click="prevPage"
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

        <span>of {{ Math.ceil(totalDocuments / itemsPerPage) }}</span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
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
                  Document Title
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
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Created
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Update
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
              v-for="documents in companies"
              :key="documents.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="documents.id"
                  v-model="selectedIds"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
                />
              </td>
              <td class="px-6 py-4 text-sm text-gray-800 font-medium">
                {{ documents.name }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ documents.owner }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ documents.created }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ documents.update }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
