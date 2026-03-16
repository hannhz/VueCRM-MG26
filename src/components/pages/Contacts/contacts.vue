<template>
  <div class="flex flex-col h-full">
    <div
      class="bg-white rounded-lg shadow-sm p-4 border border-outline flex flex-col min-h-0 flex-1"
    >
      <ContactsHeader
        :isLoading="isLoading"
        :contactsStatusText="contactsStatusText"
        :contactsStatusClass="contactsStatusClass"
        :downloadLabel="downloadLabel"
        :showAddDropdown="showDropdown"
        :showDownloadDropdown="showDownloadDropdown"
        @refresh="fetchData"
        @toggle-add-dropdown="toggleDropdown"
        @toggle-download-dropdown="toggleDownloadDropdown"
        @open-add-single="openAddSingle"
        @open-bulk-add="openBulkAdd"
        @download-all="downloadAll"
        @download="handleDownload"
        @delete-selected="handleDeleteContacts"
      />

      <ContactsFilterBar
        v-model:itemsPerPage="itemsPerPage"
        v-model:currentPage="currentPage"
        v-model:searchQuery="searchQuery"
        :totalPages="totalPages"
        @prev-page="prevPage"
        @next-page="nextPage"
        @search="handleSearch"
      />

      <ContactsTable
        :contacts="tableContacts"
        :isLoading="isLoading"
        :selectedIds="selectedIds"
        :allSelected="allSelected"
        @update:selectedIds="selectedIds = $event"
        @toggle-select-all="toggleSelectAll"
        @row-click="openContactDetail"
        @open-add-single="openAddSingle"
      />
    </div>

    <!-- Add Contact Form -->
    <AddContactForm
      :isOpen="showAddContactForm"
      @close="showAddContactForm = false"
      @submit="handleAddContact"
    />

    <!-- Contact Detail Form -->
    <DetailForm
      :isOpen="showDetailForm"
      title="Add Contact / Details"
      saveButtonText="Save Contact"
      entityType="contact"
      :contact="selectedContact"
      @close="showDetailForm = false"
      @submit="
        (data) => {
          console.log('Contact detail updated:', data);
          showDetailForm = false;
        }
      "
    />

    <!-- Contact Data Detail Form (for row click) -->
    <DetailDataContact
      :isOpen="showDetailDataContact"
      :contact="selectedContact"
      :isSubmitting="isDetailDataSubmitting"
      @close="closeDetailDataContact"
      @back="closeDetailDataContact"
      @submit="handleDetailDataContactSubmit"
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

<script>
import { mapActions, mapGetters } from "vuex";
import { alertService } from "@/services/alertService";

import ContactsHeader from "./ContactsHeader.vue";
import ContactsFilterBar from "./ContactsFilterBar.vue";
import ContactsTable from "./ContactsTable.vue";

import AddContactForm from "../../forms/AddContactForm.vue";
import BulkAddContactForm from "../../forms/BulkAddContactForm.vue";
import DetailForm from "../../forms/DetailFormDuplicate.vue";
import DetailDataContact from "../../forms/DetailDataContact.vue";

import {
  getAssociationCandidates,
  resolveAssociationLabels,
} from "@/utils/associations";
import { buildUpdateContactPayload } from "@/utils/contactPayload";

export default {
  name: "Contacts",

  components: {
    ContactsHeader,
    ContactsFilterBar,
    ContactsTable,
    AddContactForm,
    BulkAddContactForm,
    DetailForm,
    DetailDataContact,
  },

  data() {
    return {
      // server pagination + filters
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",

      // dropdowns & modals
      showAddContactForm: false,
      showBulkAddForm: false,
      showDropdown: false,
      showDownloadDropdown: false,

      // selection & detail
      selectedIds: [],
      selectedContact: null,
      showDetailForm: false,
      showDetailDataContact: false,
      isDetailDataSubmitting: false,
    };
  },

  computed: {
    ...mapGetters({
      contacts: "contacts/allContacts",
      pagination: "contacts/pagination",
      isLoading: "contacts/isLoading",
      error: "contacts/error",
      allCompanies: "company/allcompany",
      allDeals: "deals/allDeals",
    }),

    totalContacts() {
      return this.pagination?.total || 0;
    },

    totalPages() {
      return this.pagination?.last_page || 1;
    },

    contactsStatusText() {
      if (this.isLoading) return "Searching contacts...";
      if (this.error) return `Error: ${this.error}`;
      return `${this.totalContacts.toLocaleString()} Total Contacts`;
    },

    contactsStatusClass() {
      if (this.isLoading) return "text-blue-600";
      if (this.error) return "text-red-600";
      return "text-sub-text";
    },

    downloadLabel() {
      return this.selectedIds.length
        ? `Download (${this.selectedIds.length})`
        : "Download";
    },

    // untuk checkbox select-all di table
    allSelected() {
      const ids = (this.contacts || []).map((c) => c.id).filter(Boolean);
      if (!ids.length) return false;
      return ids.every((id) => this.selectedIds.includes(id));
    },

    // View-model untuk table agar ContactsTable.vue simpel
    tableContacts() {
      const baseContacts = this.contacts || [];

      const companyOptions = (this.allCompanies || []).map((company) => ({
        value: company.id,
        label: company.company_name || company.name || "Unknown",
      }));

      const dealOptions = (this.allDeals || []).map((deal) => ({
        value: deal.id,
        label: deal.deal_name || deal.name || "Unknown",
      }));

      return baseContacts.map((contact) => {
        const companyCandidates = getAssociationCandidates(
          contact?.companyassoc,
          contact?.companiesAssociation,
          contact?.company_id,
          contact?.companies_id,
          contact?.company,
          contact?.company_name,
        );

        const dealCandidates = getAssociationCandidates(
          contact?.dealsassoc,
          contact?.dealsAssociation,
          contact?.deal_id,
          contact?.deals_id,
          contact?.deal,
          contact?.deal_name,
        );

        const companyLabels = resolveAssociationLabels(
          companyCandidates,
          companyOptions,
        );
        const dealLabels = resolveAssociationLabels(dealCandidates, dealOptions);

        return {
          ...contact,
          companyLabelsText: (companyLabels.length ? companyLabels : ["-"]).join(
            ", ",
          ),
          dealLabelsText: (dealLabels.length ? dealLabels : ["-"]).join(", "),
          updatedAtText: this.formatDate(contact.updated_at || contact.created_at),
          statusClass: this.getStatusClass(contact.status),
        };
      });
    },
  },

  watch: {
    currentPage() {
      this.fetchData();
    },
    itemsPerPage() {
      this.currentPage = 1;
      this.fetchData();
    },
  },

  methods: {
    ...mapActions({
      fetchAllContacts: "contacts/fetchAllContacts",
      fetchAllcompany: "company/fetchAllcompany",
      fetchAllDeals: "deals/fetchAllDeals",
      updateContact: "contacts/updateContact",
      deleteContact: "contacts/deleteContact",
    }),

    // ========================
    // API / data
    // ========================
    fetchData() {
      // kalau store belum support params, kamu bisa abaikan param di action
      return this.fetchAllContacts({
        page: this.currentPage,
        per_page: this.itemsPerPage,
        // q: this.searchQuery, // aktifkan kalau API mendukung search
      }).catch((err) => {
        console.error("Failed to fetch contacts:", err);
      });
    },

    handleSearch() {
      // Saat search, reset page
      this.currentPage = 1;
      this.fetchData();
    },

    // ========================
    // Header dropdown actions
    // ========================
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
      // optional: close lainnya
      if (this.showDropdown) this.showDownloadDropdown = false;
    },

    toggleDownloadDropdown() {
      this.showDownloadDropdown = !this.showDownloadDropdown;
      if (this.showDownloadDropdown) this.showDropdown = false;
    },

    openAddSingle() {
      this.showAddContactForm = true;
      this.showDropdown = false;
    },

    openBulkAdd() {
      this.showBulkAddForm = true;
      this.showDropdown = false;
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

    // ========================
    // Table selection
    // ========================
    toggleSelectAll(checked) {
      const ids = (this.contacts || []).map((c) => c.id).filter(Boolean);
      this.selectedIds = checked ? ids : [];
    },

    // ========================
    // Detail modal
    // ========================
    openContactDetail(contact) {
      // kontak dari tableContacts masih punya field tambahan, aman
      this.selectedContact = { ...contact };
      this.showDetailDataContact = true;
    },

    closeDetailDataContact() {
      this.showDetailDataContact = false;
      this.selectedContact = null;
    },

    handleDetailDataContactSubmit(payload) {
      const contactId = this.selectedContact?.id;

      const { data, error } = buildUpdateContactPayload({
        selectedContactId: contactId,
        payload,
      });

      if (error) return alertService.error(error);

      this.isDetailDataSubmitting = true;

      this.updateContact(data)
        .then(() => {
          alertService.success("Detail contact berhasil diperbarui.");
          this.closeDetailDataContact();
        })
        .catch((err) => {
          const message =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Gagal update contact.";
          alertService.error(message);
        })
        .finally(() => {
          this.isDetailDataSubmitting = false;
        });
    },

    handleAddContact(contactData) {
      console.log("New contact:", contactData);
      // TODO: Implement API call via Vuex
    },

    // ========================
    // Delete
    // ========================
    handleDeleteContacts() {
      if (!this.selectedIds.length) {
        return alertService.warning("Pilih minimal satu contact untuk dihapus");
      }

      alertService
        .confirm(
          "Hapus Contact?",
          `${this.selectedIds.length} contact akan dihapus secara permanen.`,
        )
        .then((confirmDelete) => {
          if (!confirmDelete) return;
          const promises = this.selectedIds.map((id) => this.deleteContact(id));
          return Promise.all(promises);
        })
        .then(() => {
          this.selectedIds = [];
          alertService.success("Contact berhasil dihapus");
        })
        .catch((err) => {
          const status = err?.response?.status;
          const message =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message;

          alertService.error(
            `Gagal menghapus contact ${status ? `(Status ${status})` : ""}. ${
              message || ""
            }`,
          );
        });
    },

    // ========================
    // Pagination helpers (filter bar)
    // ========================
    prevPage() {
      if (this.currentPage > 1) this.currentPage -= 1;
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage += 1;
    },

    // ========================
    // Utilities
    // ========================
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

    getStatusClass(status) {
      if (!status) return "bg-gray-100 text-gray-700";
      const s = String(status).toLowerCase();
      if (s === "active" || s === "aktif") return "bg-green-100 text-green-700";
      if (s === "pending") return "bg-yellow-100 text-yellow-700";
      return "bg-gray-100 text-gray-700";
    },
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);

    // initial fetch
    this.fetchData();
    this.fetchAllcompany();
    this.fetchAllDeals();
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
/* tidak berubah dari file lama */
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