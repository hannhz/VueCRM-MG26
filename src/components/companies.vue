<!-- <script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useStore } from "vuex";

import CreateCompanyForm from "./forms/CreateCompanyForm.vue";
import BulkAddCompanyForm from "./forms/BulkAddCompanyForm.vue";
import DetailForm from "./forms/DetailForm.vue";
import DetailDataCompany from "./forms/DetailDataCompany.vue";
import { alertService } from "@/services/alertService";

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
  RefreshCw,
  FolderPlus,
  FileDown,
  FolderDown,
} from "lucide-vue-next";

// Hubungkan ke Vuex Store
const store = useStore();

// Pakai 'company' karena tadi kita daftarkan dengan nama itu di store/index.js
const companies = computed(() => store.getters["company/filteredCompanies"]);
const searchQuery = computed({
  get: () => store.state.company.searchQuery,
  set: (value) => store.dispatch("company/setSearchQuery", value),
});
const isLoading = computed(() => store.getters["company/isLoading"]);
const error = computed(() => store.getters["company/error"]);

// Sample data - replace with actual data from API
const currentPage = ref(1);
const totalCompanies = computed(() => companies.value.length); // Dynamically compute from actual data
const itemsPerPage = ref(10);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalCompanies.value / itemsPerPage.value)),
);
const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return companies.value.slice(start, start + itemsPerPage.value);
});
const showCreateCompanyForm = ref(false);
const showBulkAddForm = ref(false);
const showDetailForm = ref(false);
const showDetailDataCompany = ref(false);
const showDropdown = ref(false);
const showDownloadDropdown = ref(false);
const selectedIds = ref([]);
const selectedCompany = ref(null);
const isDetailDataSubmitting = ref(false);

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

const companiesStatusText = computed(() => {
  if (isLoading.value) {
    return "Searching company...";
  }
  if (error.value) {
    return `Error: ${error.value}`;
  }
  return `${totalCompanies.value.toLocaleString()} Total Companies`;
});

const companiesStatusClass = computed(() => {
  if (isLoading.value) {
    return "text-blue-600";
  }
  if (error.value) {
    return "text-red-600";
  }
  return "text-sub-text";
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

// Load data saat component mount
onMounted(() => {
  // Fetch data dari API
  store.dispatch("company/fetchAllcompany");
  // Add event listener untuk close dropdown saat klik luar
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);

const handleBulkAdd = () => {
  console.log("Bulk add clicked");
  showBulkAddForm.value = true;
};

watch([itemsPerPage, totalCompanies], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const openCompanyDetail = (company) => {
  selectedCompany.value = { ...company };
  showDetailDataCompany.value = true;
};

const closeDetailDataCompany = () => {
  showDetailDataCompany.value = false;
  selectedCompany.value = null;
};

const handleDetailDataCompanySubmit = async (payload) => {
  const companyId = selectedCompany.value?.id;

  if (!companyId) {
    alertService.error(
      "ID company tidak ditemukan. Coba buka ulang detail data.",
    );
    return;
  }

  if (!payload?.company?.company_name?.trim()) {
    alertService.error("Company Name wajib diisi.");
    return;
  }

  isDetailDataSubmitting.value = true;

  try {
    const formdata = {
      ...payload.company,
      updated_at: new Date().toISOString(),
    };

    await store.dispatch("company/updatecompany", {
      keyedit: companyId,
      formdata,
    });

    alertService.success("Detail company berhasil diperbarui.");
    closeDetailDataCompany();
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Gagal update company. Silakan coba lagi.";
    alertService.error(backendMessage);
  } finally {
    isDetailDataSubmitting.value = false;
  }
};

// Fetch data function untuk refresh
const fetchData = () => {
  store
    .dispatch("company/fetchAllcompany")
    .then(() => {
      console.log("Companies fetched successfully");
    })
    .catch((err) => {
      console.error("Failed to fetch companies:", err);
    });
};

// Delete selected companies
const handleDeleteCompanies = async () => {
  if (selectedIds.value.length === 0) {
    alertService.warning("Pilih minimal satu company untuk dihapus");
    return;
  }

  const confirmDelete = await alertService.confirm(
    "Hapus Company?",
    `${selectedIds.value.length} company akan dihapus secara permanen. Lanjutkan?`,
  );

  if (!confirmDelete) return;

  try {
    // Delete each selected company
    for (const id of selectedIds.value) {
      await store.dispatch("company/deletecompany", id);
    }
    // Clear selected IDs
    selectedIds.value = [];
    alertService.success("Company berhasil dihapus");
  } catch (error) {
    console.error("Error deleting companies:", error);
    const status = error?.response?.status;
    const backendMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message;
    alertService.error(
      `Gagal menghapus company. ${status ? `Status: ${status}. ` : ""}${backendMessage || "Silakan coba lagi."}`,
    );
  }
};
</script> -->

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import CreateCompanyForm from "./forms/CreateCompanyForm.vue";
import BulkAddCompanyForm from "./forms/BulkAddCompanyForm.vue";
import DetailForm from "./forms/DetailForm.vue";
import DetailDataCompany from "./forms/DetailDataCompany.vue";
import { alertService } from "@/services/alertService";
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
  RefreshCw,
  FolderPlus,
  FileDown,
  FolderDown,
} from "lucide-vue-next";

export default {
  components: {
    CreateCompanyForm,
    BulkAddCompanyForm,
    DetailForm,
    DetailDataCompany,
    Search,
    ChevronDown,
    Download,
    Edit,
    Trash2,
    Filter,
    ChevronLeft,
    FilePlus,
    ChevronRight,
    RefreshCw,
    FolderPlus,
    FileDown,
    FolderDown,
  },

  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      showCreateCompanyForm: false,
      showBulkAddForm: false,
      showDetailForm: false,
      showDetailDataCompany: false,
      showDropdown: false,
      showDownloadDropdown: false,
      selectedIds: [],
      selectedCompany: null,
      isDetailDataSubmitting: false,
    };
  },

  computed: {
    ...mapState({
      searchQuery: (state) => state.company.searchQuery,
    }),

    ...mapGetters({
      companies: "company/filteredCompanies",
      isLoading: "company/isLoading",
      error: "company/error",
    }),

    totalCompanies() {
      return this.companies.length;
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.totalCompanies / this.itemsPerPage));
    },

    paginatedCompanies() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.companies.slice(start, start + this.itemsPerPage);
    },

    downloadLabel() {
      return this.selectedIds.length
        ? `Download (${this.selectedIds.length})`
        : "Download";
    },

    companiesStatusText() {
      if (this.isLoading) return "Searching company...";
      if (this.error) return `Error: ${this.error}`;
      return `${this.totalCompanies.toLocaleString()} Total Companies`;
    },

    companiesStatusClass() {
      if (this.isLoading) return "text-blue-600";
      if (this.error) return "text-red-600";
      return "text-sub-text";
    },
  },

  watch: {
    totalCompanies() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
  },

  mounted() {
    this.fetchAllcompany();

    document.addEventListener("click", this.handleClickOutside);
  },

  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    ...mapActions("company", [
      "fetchAllcompany",
      "updatecompany",
      "deletecompany",
    ]),

    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    toggleDownloadDropdown() {
      this.showDownloadDropdown = !this.showDownloadDropdown;
    },

    handleClickOutside(e) {
      if (
        !e.target.closest(".add-dropdown") &&
        !e.target.closest(".download-dropdown")
      ) {
        this.showDropdown = false;
        this.showDownloadDropdown = false;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    openCompanyDetail(company) {
      this.selectedCompany = { ...company };
      this.showDetailDataCompany = true;
    },

    closeDetailDataCompany() {
      this.selectedCompany = null;
      this.showDetailDataCompany = false;
    },

    handleDetailDataCompanySubmit(payload) {
      const companyId = this.selectedCompany?.id;
      const companyName = payload?.company?.company_name?.trim();

      if (!companyId) {
        return alertService.error("ID company tidak ditemukan.");
      }

      if (!companyName) {
        return alertService.error("Company Name wajib diisi.");
      }

      this.isDetailDataSubmitting = true;

      this.updatecompany({
        keyedit: companyId,
        formdata: {
          ...payload.company,
          updated_at: new Date().toISOString(),
        },
      })
        .then(() => {
          alertService.success("Detail company berhasil diperbarui.");
          this.closeDetailDataCompany();
        })
        .catch((error) => {
          const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Gagal update company";

          alertService.error(message);
        })
        .finally(() => {
          this.isDetailDataSubmitting = false;
        });
    },

    handleDeleteCompanies() {
      if (!this.selectedIds.length) {
        return alertService.warning("Pilih minimal satu company untuk dihapus");
      }

      alertService
        .confirm(
          "Hapus Company?",
          `${this.selectedIds.length} company akan dihapus secara permanen.`,
        )
        .then((confirmDelete) => {
          if (!confirmDelete) return;

          const promises = this.selectedIds.map((id) => this.deletecompany(id));

          return Promise.all(promises);
        })
        .then(() => {
          this.selectedIds = [];
          alertService.success("Company berhasil dihapus");
        })
        .catch((error) => {
          const status = error?.response?.status;
          const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message;

          alertService.error(
            `Gagal menghapus company ${status ? `(Status ${status})` : ""}. ${
              message || ""
            }`,
          );
        });
    },

    handleDownload() {
      const target = this.selectedIds.length
        ? `selected: ${this.selectedIds}`
        : "all data";

      console.log("Download", target);
      this.showDownloadDropdown = false;
    },

    downloadAll() {
      console.log("Download all data");
      this.showDownloadDropdown = false;
    },

    handleBulkAdd() {
      this.showBulkAddForm = true;
    },
  },
};
</script>

<template>
  <!-- Action Bar -->
  <div
    class="bg-white rounded-lg shadow-sm h-147 p-4 border border-outline flex flex-col overflow-hidden"
  >
    <!-- Header with Title and Total -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-baseline gap-3">
        <h1 class="text-2xl font-bold text-dark-base">Companies</h1>
        <span class="text-sm" :class="companiesStatusClass">
          {{ companiesStatusText }}
        </span>
      </div>

      <!-- Right Section: Action Buttons -->
      <div class="flex items-center gap-2">
        <!-- Refresh Button -->
        <button
          @click="fetchData"
          :disabled="isLoading"
          class="p-2 border border-outline rounded-lg hover:bg-light-base transition-all active:scale-95 disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw
            :size="18"
            :class="{ 'animate-spin': isLoading }"
            class="text-sub-text"
          />
        </button>
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
          @click="handleDeleteCompanies"
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
            v-model="searchQuery"
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
          @click="prevPage"
          class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
          :disabled="currentPage === 1"
        >
          <ChevronLeft :size="18" class="text-sub-text" />
        </button>

        <span>Page</span>

        <input
          type="number"
          v-model.number="currentPage"
          min="1"
          :max="totalPages"
          class="w-12 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-sub-text"
        />

        <span>of {{ totalPages }}</span>

        <button
          @click="nextPage"
          class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
          :disabled="currentPage === totalPages"
        >
          <ChevronRight :size="18" class="text-sub-text" />
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="mt-4 flex-1 min-h-0 overflow-auto relative">
      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-white/60 z-20 flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-3">
          <RefreshCw class="animate-spin text-blue-950" :size="32" />
          <p class="text-sm text-sub-text font-medium">Loading companies...</p>
        </div>
      </div>

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
            <tr v-if="companies.length === 0 && !isLoading">
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
              v-for="company in paginatedCompanies"
              :key="company.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
              @click="openCompanyDetail(company)"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="company.id"
                  v-model="selectedIds"
                  @click.stop
                  class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
                />
              </td>
              <td class="px-6 py-4 text-sm text-gray-800 font-medium">
                {{ company.company_name }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ company.website }}
              </td>
              <td class="px-6 py-4 text-sm text-dark-base">
                {{ company.email }}
              </td>
              <td class="px-6 py-4">
                {{ company.type }}
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
    @submit="
      (data) => {
        console.log('Company added:', data);
        showCreateCompanyForm = false;
        showDetailForm = true;
      }
    "
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

  <DetailDataCompany
    :isOpen="showDetailDataCompany"
    :company="selectedCompany"
    :isSubmitting="isDetailDataSubmitting"
    @close="closeDetailDataCompany"
    @back="closeDetailDataCompany"
    @submit="handleDetailDataCompanySubmit"
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
