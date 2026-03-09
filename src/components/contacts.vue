<script>
import { mapActions, mapGetters } from "vuex";
import AddContactForm from "./forms/AddContactForm.vue";
import BulkAddContactForm from "./forms/BulkAddContactForm.vue";

import {
  Search,
  ChevronDown,
  Download,
  Edit,
  Trash2,
  Facebook,
  Filter,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  FilePlus,
  FileDown,
  FolderDown,
  RefreshCw,
} from "lucide-vue-next";

export default {
  name: "ContactsPage",

  components: {
    AddContactForm,
    BulkAddContactForm,
    Search,
    ChevronDown,
    Download,
    Edit,
    Trash2,
    Facebook,
    Filter,
    ChevronLeft,
    ChevronRight,
    FolderPlus,
    FilePlus,
    FileDown,
    FolderDown,
    RefreshCw,
  },

  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      showAddContactForm: false,
      showBulkAddForm: false,
      showDropdown: false,
      showDownloadDropdown: false,
      selectedIds: [],
    };
  },

  computed: {
    ...mapGetters({
      contacts: "contacts/allContacts",
      isLoading: "contacts/isLoading",
      error: "contacts/error",
    }),

    totalContacts() {
      return this.contacts.length;
    },

    downloadLabel() {
      return this.selectedIds.length
        ? `Download (${this.selectedIds.length})`
        : "Download";
    },

    paginatedContacts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.contacts.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.totalContacts / this.itemsPerPage) || 1;
    },
  },

  methods: {
    ...mapActions({
      fetchAllContacts: "contacts/fetchAllContacts",
    }),

    fetchData() {
      this.fetchAllContacts()
        .then(() => {
          console.log("Contacts fetched successfully");
        })
        .catch((err) => {
          console.error("Failed to fetch contacts:", err);
        });
    },

    handleAddContact(contactData) {
      console.log("New contact:", contactData);
      // TODO: Implement API call via Vuex
    },

    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    toggleDownloadDropdown() {
      this.showDownloadDropdown = !this.showDownloadDropdown;
    },

    handleBulkAdd() {
      this.showBulkAddForm = true;
    },

    downloadAll() {
      console.log("Download all data");
      this.showDownloadDropdown = false;
    },

    handleDownload() {
      if (this.selectedIds.length) {
        console.log("Download selected:", this.selectedIds);
      } else {
        console.log("Download all data");
      }
      this.showDownloadDropdown = false;
    },

    handleClickOutside(e) {
      if (
        !e.target.closest(".printable-dropdown") &&
        !e.target.closest(".add-dropdown")
      ) {
        this.showDropdown = false;
        this.showDownloadDropdown = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    },
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.fetchData();
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<template>
  <div class="space-y-4">
    <!-- Action Bar -->
    <div class="bg-white rounded-lg shadow-sm p-4 border border-outline">
      <!-- Header with Title and Total -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-baseline gap-3">
          <h1 class="text-2xl font-bold text-dark-base">Contacts</h1>
          <span class="text-sm text-sub-text"
            >{{ totalContacts.toLocaleString() }} Total Contacts</span
          >
          <span v-if="isLoading" class="text-xs text-blue-500 animate-pulse ml-2">Loading data...</span>
        </div>

        <!-- Right Section: Action Buttons -->
        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-2 px-4 py-2 border border-fecbuk text-fecbuk rounded-lg hover:bg-fecbuk bg-white hover:text-white transition shadow-sm"
          >
            <Facebook :size="18" />
            <span class="text-sm font-medium">Connect Facebook</span>
            <ChevronDown :size="16" />
          </button>

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
                  showAddContactForm = true;
                  showDropdown = false;
                "
                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <FilePlus :size="18" />
                <span class="font-medium"> Single Contact </span>
              </button>

              <button
                @click="
                  handleBulkAdd();
                  showDropdown = false;
                "
                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <FolderPlus :size="18" />
                <span class="font-medium"> Bulk Contact </span>
              </button>
            </div>
          </div>

          <!-- Download -->
          <div class="relative inline-block printable-dropdown">
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

            <!-- Dropdown -->
            <div
              v-show="showDownloadDropdown"
              class="absolute text-sub-text right-0 mt-2 w-48 bg-white border border-outline rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95"
            >
              <button
                @click="downloadAll"
                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <FolderDown :size="16" />
                <span class="font-medium">Download All</span>
              </button>

              <button
                @click="handleDownload"
                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <FileDown :size="16" />
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
          <button
            class="p-2 border border-outline rounded-lg hover:bg-outline/30 transition"
          >
            <Filter :size="20" class="text-dark-base" />
          </button>

          <div class="relative">
            <input
              type="text"
              placeholder="Search by Name"
              class="pl-3 pr-4 py-2 bg-white border border-outline rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
            />
          </div>

          <button
            class="p-2 bg-outline hover:bg-outline/30 rounded-lg transition"
          >
            <Search :size="20" class="text-dark-base" />
          </button>

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

        <!-- Pagination Controls -->
        <div class="ml-auto flex items-center gap-3 text-sm text-sub-text">
          <button
            @click="currentPage > 1 && currentPage--"
            class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
            :disabled="currentPage === 1"
          >
            <ChevronLeft :size="18" />
          </button>

          <span>Page</span>

          <input
            type="number"
            v-model="currentPage"
            min="1"
            :max="totalPages"
            class="w-12 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none"
          />

          <span>of {{ totalPages }}</span>

          <button
            @click="currentPage < totalPages && currentPage++"
            class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
            :disabled="currentPage === totalPages"
          >
            <ChevronRight :size="18" />
          </button>
        </div>
      </div>

      <!-- Table Content -->
      <div class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="px-6 py-4 text-left">
                  <input type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300" />
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div class="flex items-center gap-2">
                    Contact Name
                    <ChevronDown :size="16" class="text-gray-400" />
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div class="flex items-center gap-2">
                    Contact Info
                    <ChevronDown :size="16" class="text-gray-400" />
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div class="flex items-center gap-2">
                    Associated with
                    <ChevronDown :size="16" class="text-gray-400" />
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div class="flex items-center gap-2">
                    Status
                    <ChevronDown :size="16" class="text-gray-400" />
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div class="flex items-center gap-2">
                    Created/Update
                    <ChevronDown :size="16" class="text-gray-400" />
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  <div class="flex items-center gap-2">
                    Owner
                    <ChevronDown :size="16" class="text-gray-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Empty State -->
              <tr v-if="paginatedContacts.length === 0 && !isLoading">
                <td colspan="7" class="px-6 py-20 text-center text-sub-text">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search :size="32" class="text-gray-400" />
                    </div>
                    <p class="text-lg font-medium">No contacts found</p>
                    <p class="text-sm text-gray-400">
                      We couldn't find any contacts matching your criteria.
                    </p>
                    <button @click="showAddContactForm = true" class="mt-2 text-blue-600 font-medium hover:underline text-sm">+ Add Your First Contact</button>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-for="contact in paginatedContacts"
                :key="contact.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td class="px-6 py-4">
                  <input type="checkbox" v-model="selectedIds" :value="contact.id" class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300" />
                </td>
                <td class="px-6 py-4 text-sm text-gray-800 font-medium">
                  {{ contact.first_name }} {{ contact.last_name }}
                </td>
                <td class="px-6 py-4 text-sm text-dark-base">
                  <div>{{ contact.email || '-' }}</div>
                  <div class="text-xs text-sub-text">{{ contact.telephone_1 || '-' }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-dark-base">
                  {{ contact.companiesAssociation || contact.company || '-' }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-700': contact.status?.toLowerCase() === 'active' || contact.status?.toLowerCase() === 'aktif',
                      'bg-yellow-100 text-yellow-700': contact.status?.toLowerCase() === 'pending',
                      'bg-gray-100 text-gray-700': !contact.status || contact.status?.toLowerCase() === 'inactive' || contact.status?.toLowerCase() === 'non-aktif',
                    }"
                  >
                    {{ contact.status || 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-dark-base">
                  {{ formatDate(contact.updated_at || contact.created_at) }}
                </td>
                <td class="px-6 py-4 text-sm text-dark-base">
                  {{ contact.owner || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Contact Form -->
    <AddContactForm
      :isOpen="showAddContactForm"
      @close="showAddContactForm = false"
      @submit="handleAddContact"
    />

    <!-- Bulk Add Contact Form -->
    <BulkAddContactForm
      :isOpen="showBulkAddForm"
      @close="showBulkAddForm = false"
      @submit="
        (file) => {
          console.log('File uploaded:', file);
          showBulkAddForm = false;
        }
      "
    />
  </div>
</template>

<style scoped>
/* Custom Scrollbar for the table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

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

/* Slide and Fade transitions from userscrm */
.animate-in {
  animation: animate-in 0.2s ease-out;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
