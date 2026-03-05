<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useStore } from "vuex";

import {
  Search,
  ChevronDown,
  Download,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  FilePlus,
  ChevronRight,
  RefreshCcw,
  FolderPlus,
  FileDown,
  FolderDown,
} from "lucide-vue-next";

import CreateCompanyForm from "./forms/CreateCompanyForm.vue";
import BulkAddCompanyForm from "./forms/BulkAddCompanyForm.vue";
import DetailForm from "./forms/DetailForm.vue";

// Sample data - replace with actual data from API
const store = useStore();
const currentPage = ref(1);
const totalCompanies = ref(18600);
const itemsPerPage = ref(10);
const showCreateCompanyForm = ref(false);
const showBulkAddForm = ref(false);
const showDetailForm = ref(false);
const showDropdown = ref(false);
const showDownloadDropdown = ref(false);
const selectedIds = ref([]);

// Hubungkan ke Vuex Store
// Pakai 'company' karena tadi kita daftarkan dengan nama itu di store/index.js
const companies = computed(() => store.getters["company/allcompany"]);
const isLoading = computed(() => store.getters["company/isLoading"]);
const error = computed(() => store.getters["company/error"]);

const toggleDownloadDropdown = () => {
  showDownloadDropdown.value = !showDownloadDropdown.value;
};

const downloadAll = () => {
  console.log("Download all data");
  showDownloadDropdown.value = false;
};

const handleDownload = () => {
  if (selectedIds.value.length) {
    console.log("Download selected:", selectedIds.value);
  } else {
    console.log("Download all data");
  }
  showDownloadDropdown.value = false;
};

const downloadLabel = computed(() => {
  return selectedIds.value.length
    ? `Download (${selectedIds.value.length})`
    : "Download";
});

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// auto close saat klik luar
const handleClickOutside = (e) => {
  if (
    !e.target.closest(".add-dropdown") &&
    !e.target.closest(".download-dropdown")
  ) {
    showDropdown.value = false;
    showDownloadDropdown.value = false;
  }
};

// Ambil data dari API saat halaman dibuka
onMounted(() => {
  store.dispatch("company/fetchAllcompany");
  document.addEventListener("click", handleClickOutside);
  console.log("DATA COMPANY:", companies.value);
});

onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);

const handleBulkAdd = () => {
  console.log("Bulk add clicked");
  showBulkAddForm.value = true;
};
</script>

<template>
  <!-- Action Bar -->
  <div class="bg-white rounded-lg shadow-sm h-147 p-4 border border-outline">
    <!-- Header with Title and Total -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-baseline gap-3">
  <h1 class="text-2xl font-bold text-dark-base">Companies</h1>
  <span class="text-sm text-sub-text">{{ totalCompanies.toLocaleString() }} Total Companies</span>
  
  <span v-if="isLoading" class="text-xs text-blue-500 animate-pulse ml-2">Loading data...</span>
</div>

      <!-- Right Section: Action Buttons -->
      <div class="flex items-center gap-2">
        <!-- Add New -->
        <div class="relative inline-block add-dropdown">
          <button
            type="button"
            @click="toggleDropdown"
            class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
          >
            <span class="text-lg font-semibold">+</span>
            <span class="text-sm font-medium">Add New</span>
            <ChevronDown
              :size="16"
              class="transition-transform duration-200"
              :class="{ 'rotate-180': showDropdown }"
            />
          </button>
          <!-- Dropdown Menu -->
          <div
            v-show="showDropdown"
            class="absolute right-0 text-sub-text mt-2 w-44 bg-white border border-outline rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95"
          >
            <button
              @click="
                showCreateCompanyForm = true;
                showDropdown = false;
              "
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FilePlus :size="18" />
              <span class="font-medium"> Single Company </span>
            </button>

            <button
              @click="
                handleBulkAdd();
                showDropdown = false;
              "
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FolderPlus :size="18" />
              <span class="font-medium"> Bulk Company </span>
            </button>
          </div>
        </div>

        <!-- Download -->
        <div class="relative inline-block download-dropdown">
          <!-- Button -->
          <button
            type="button"
            @click="toggleDownloadDropdown"
            class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
          >
            <Download :size="18" />
            <span class="text-sm font-medium">Download</span>
            <ChevronDown
              :size="16"
              class="transition-transform duration-200"
              :class="{ 'rotate-180': showDownloadDropdown }"
            />
          </button>

          <!-- DropdownMenu -->
          <div
            v-show="showDownloadDropdown"
            class="absolute text-sub-text right-0 mt-2 w-48 bg-white border border-outline rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95"
          >
            <button
              @click="downloadAll"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FolderDown :size="18" class="text-sub-text" />
              <span class="font-medium">Download All</span>
            </button>

            <button
              @click="handleDownload"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-t border-gray-50"
            >
              <FileDown :size="18" class="text-sub-text" />
              <span class="font-medium">{{ downloadLabel }}</span>
            </button>
          </div>
        </div>

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
              v-for="company in companies"
              :key="company.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="company.id"
                  v-model="selectedIds"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
                />
              </td>
              <td class="px-6 py-4 text-sm text-gray-800 font-medium">
                {{ company.company_name }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ company.email }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ company.website }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-700': company.status === 'Active',
                    'bg-gray-100 text-gray-700': company.status === 'Inactive',
                  }"
                >
                  {{ company.type }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ company.updated_at }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ company.company_owner }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Add Company Form -->
  <CreateCompanyForm
    :isOpen="showCreateCompanyForm"
    @close="showCreateCompanyForm = false"
    @submit="async (data) => {
      try {
        await store.dispatch('company/insertcompany', { formdata: data });
        showCreateCompanyForm = false;
        await nextTick();
        showDetailForm = true;
        console.log('Company added successfully, DetailForm should now be visible');
      } catch (error) {
        console.error('Error adding company:', error);
      }
    }"
  />

  <!-- Bulk Add Company Form -->
  <BulkAddCompanyForm
    :isOpen="showBulkAddForm"
    @close="showBulkAddForm = false"
    @submit="
      (file) => {
        console.log('File uploaded:', file);
        showBulkAddForm = false;
      }
    "
  />

  <!-- Detail Form -->
  <DetailForm
    :isOpen="showDetailForm"
    @close="showDetailForm = false"
    @back="
      showDetailForm = false;
      showCreateCompanyForm = true;
    "
    @submit="
      (data) => {
        console.log('Detail submitted:', data);
        showDetailForm = false;
      }
    "
  />
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
