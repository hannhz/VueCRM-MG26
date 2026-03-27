<script>
import { mapActions, mapGetters } from "vuex";
import { X, Plus, ChevronDown } from "lucide-vue-next";
import AddDealForm from "./AddDealForm.vue";
import AddContactQuickForm from "./AddContactQuickForm.vue";
import LocationSelector from "./component/LocationSelector.vue";
import ContactDetailForm from "./DetailFormDuplicate.vue";
import { alertService } from "@/services/alertService";
import api from "@/api";

export default {
  name: "CreateCompanyForm",

  components: {
    X,
    Plus,
    ChevronDown,
    AddDealForm,
    AddContactQuickForm,
    ContactDetailForm,
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isSubmitting: false,
      contactSearch: "",
      dealSearch: "",
      isContactDropdownOpen: false,
      isDealDropdownOpen: false,
      statuses: [],

      industryOptions: [
        { value: "", label: "Select Industry" },
        { value: "technology", label: "Technology" },
        { value: "finance", label: "Finance" },
        { value: "healthcare", label: "Healthcare" },
        { value: "education", label: "Education" },
        { value: "retail", label: "Retail" },
        { value: "manufacturing", label: "Manufacturing" },
        { value: "consulting", label: "Consulting" },
        { value: "other", label: "Other" },
      ],

      sourceOptions: [
        { value: "", label: "Select Source" },
        { value: "website", label: "Website" },
        { value: "referral", label: "Referral" },
        { value: "social_media", label: "Social Media" },
        { value: "email_campaign", label: "Email Campaign" },
        { value: "cold_call", label: "Cold Call" },
        { value: "trade_show", label: "Trade Show" },
        { value: "partner", label: "Partner" },
        { value: "other", label: "Other" },
      ],

      formData: {
        company_name: "",
        company_owner: "",
        owner: "",
        description: "",
        email: "",
        telephone: "",
        website: "",
        industry: "",
        address: "",
        country: "",
        province: "",
        city: "",
        pos_code: "",
        source: "",
        type: "",
        dealsassoc: [],
        contactassoc: [],
      },

      showAddDealForm: false,
      showAddContactQuickForm: false,
      showDetailForm: false,
    };
  },

  computed: {
    ...mapGetters({
      contactOptions: "contacts/allContacts",
      dealOptions: "deals/allDeals",
      allUsers: "users/allUsers",
      userSignin: "users/usersignin",
    }),

    ownerOptions() {
      const users = this.allUsers || [];
      return [
        { value: "", label: "Select Owner" },
        ...users.map((user) => ({
          value: user.name || user.username || user.id,
          label: user.name || user.username || "Unknown",
        })),
      ];
    },

    currentUserName() {
      const user = this.userSignin || null;
      if (!user) return "";

      const fullName = [
        user.first_name || user.firstname,
        user.last_name || user.lastname,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      return user.name || user.username || fullName || "";
    },

    filteredContacts() {
      if (!this.contactSearch) return this.contactOptions || [];
      return (this.contactOptions || []).filter(
        (c) =>
          `${c.first_name} ${c.last_name}`
            .toLowerCase()
            .includes(this.contactSearch.toLowerCase()) ||
          (c.email || "")
            .toLowerCase()
            .includes(this.contactSearch.toLowerCase()),
      );
    },

    filteredDeals() {
      if (!this.dealSearch) return this.dealOptions || [];
      return (this.dealOptions || []).filter((d) =>
        (d.deal_name || d.name || "")
          .toLowerCase()
          .includes(this.dealSearch.toLowerCase()),
      );
    },

    selectedContacts() {
      return (this.contactOptions || []).filter((c) =>
        this.formData.contactassoc.includes(c.id),
      );
    },

    selectedDeals() {
      return (this.dealOptions || []).filter((d) =>
        this.formData.dealsassoc.includes(d.id),
      );
    },
  },

  watch: {
    isOpen(isOpen) {
      if (isOpen) {
        this.fetchAssociationOptions().then(() => this.applyDefaultOwner());
      }
    },
  },

  mounted() {
    this.fetchAssociationOptions().then(() => this.applyDefaultOwner());
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    ...mapActions({
      getUserSignin: "users/getusersignin",
      fetchAllUsers: "users/fetchAllusers",
      fetchAllContacts: "contacts/fetchAllContacts",
      fetchAllDeals: "deals/fetchAllDeals",
      insertCompany: "company/insertcompany",
    }),

    async fetchStatuses() {
      try {
        if (!api || !api.get) {
          this.setFallbackStatuses();
          return;
        }

        const response = await api.get("statuses", {
          headers: {
            Authorization: `Bearer ${this.$cookies?.get("token") || ""}`,
          },
        });
        this.statuses = response.data || [];
      } catch (error) {
        console.error("Failed to fetch statuses:", error);
        this.setFallbackStatuses();
      }
    },

    setFallbackStatuses() {
      this.statuses = [
        { id: 1, name: "Competitor" },
        { id: 2, name: "Customer" },
        { id: 3, name: "Ex Customer" },
        { id: 4, name: "Lead" },
        { id: 5, name: "Opportunity" },
        { id: 6, name: "Partner" },
        { id: 7, name: "Qualified" },
      ];
    },

    applyDefaultOwner() {
      if (!this.formData.owner && this.currentUserName) {
        this.formData.owner = this.currentUserName;
      }
    },

    async fetchAssociationOptions() {
      const promises = [];

      if (!this.userSignin) {
        promises.push(this.getUserSignin());
      }

      if ((this.allUsers || []).length === 0) {
        promises.push(this.fetchAllUsers());
      }

      if ((this.contactOptions || []).length === 0) {
        promises.push(this.fetchAllContacts());
      }

      if ((this.dealOptions || []).length === 0) {
        promises.push(this.fetchAllDeals());
      }

      if (this.statuses.length === 0) {
        promises.push(this.fetchStatuses());
      }

      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }
    },

    toggleContact(contact) {
      const index = this.formData.contactassoc.indexOf(contact.id);
      if (index === -1) {
        this.formData.contactassoc.push(contact.id);
      } else {
        this.formData.contactassoc.splice(index, 1);
      }
    },

    isContactSelected(id) {
      return this.formData.contactassoc.includes(id);
    },

    toggleDeal(deal) {
      const index = this.formData.dealsassoc.indexOf(deal.id);
      if (index === -1) {
        this.formData.dealsassoc.push(deal.id);
      } else {
        this.formData.dealsassoc.splice(index, 1);
      }
    },

    isDealSelected(id) {
      return this.formData.dealsassoc.includes(id);
    },

    toggleContactDropdown() {
      this.isContactDropdownOpen = !this.isContactDropdownOpen;
    },

    toggleDealDropdown() {
      this.isDealDropdownOpen = !this.isDealDropdownOpen;
    },

    filterContacts() {
      this.isContactDropdownOpen = true;
    },

    filterDeals() {
      this.isDealDropdownOpen = true;
    },

    handleClickOutside(e) {
      // Close dropdowns saat klik di luar
      if (!e.target.closest("[data-contacts-dropdown]")) {
        this.isContactDropdownOpen = false;
      }
      if (!e.target.closest("[data-deals-dropdown]")) {
        this.isDealDropdownOpen = false;
      }
    },

    handleClose() {
      this.$emit("close");
    },

    handleSubmit() {
      if (!this.formData.company_name.trim()) {
        alertService.error("Company Name wajib diisi!");
        return;
      }
      this.showDetailForm = true;
    },

    async handleDetailSubmit(detailPayload) {
      this.isSubmitting = true;

      try {
        const now = new Date().toISOString();
        const dataToSubmit = {
          ...this.formData,
          owner: this.formData.owner || this.currentUserName || "",
          dealsassoc: (this.formData.dealsassoc || []).join(","),
          contactassoc: (this.formData.contactassoc || []).join(","),
          notes: detailPayload?.note || "",
          task_name: detailPayload?.task?.name || "",
          desktask: detailPayload?.task?.content || "",
          statustask: detailPayload?.task?.status || "",
          assignee: detailPayload?.task?.assignee || "",
          due_date: detailPayload?.task?.dueDate || "",
          task_time: detailPayload?.task?.time || "",
          prioritytask: detailPayload?.task?.priority || "",
          associated_contact: detailPayload?.task?.associatedContact || "",
          docs: detailPayload?.docs?.description || "",
          created_at: now,
          updated_at: now,
        };

        const response = await this.insertCompany({ formdata: dataToSubmit });

        alertService.success("Company berhasil ditambahkan!");
        this.resetForm();
        this.$emit("submit", response);
        this.showDetailForm = false;
        this.handleClose();
      } catch (error) {
        alertService.error(
          error.response?.data?.message ||
            error.message ||
            "Gagal menambah company.",
        );
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.formData = {
        company_name: "",
        company_owner: "",
        owner: this.currentUserName || "",
        description: "",
        email: "",
        telephone: "",
        website: "",
        industry: "",
        address: "",
        country: "",
        province: "",
        city: "",
        pos_code: "",
        source: "",
        type: "",
        dealsassoc: [],
        contactassoc: [],
      };
      this.contactSearch = "";
      this.dealSearch = "";
    },

    async handleDealFormSubmit() {
      this.showAddDealForm = false;
      await this.fetchAssociationOptions();
    },

    async handleContactQuickSubmit() {
      this.showAddContactQuickForm = false;
      await this.fetchAssociationOptions();
    },
  },
};
</script>

<template>
  <!-- Overlay Background -->
  <Transition name="overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-sub-text/80 z-40 transition-all duration-300"
      @click="handleClose"
    ></div>
  </Transition>

  <!-- Form Slide Panel -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-outline px-6 py-4 flex items-center justify-between z-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <h2 class="text-xl font-bold text-dark-base">Create Company</h2>
        <button
          @click="handleClose"
          class="p-2 hover:bg-light-base rounded-lg transition-colors"
        >
          <X :size="20" class="text-sub-text" />
        </button>
      </div>

      <!-- Form Content (Scrollable) - halaman utama TIDAK ikut scroll -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Company Name & Owner -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Company Name <span class="text-red-600">*</span></label
              >
              <input
                v-model="formData.company_name"
                type="text"
                placeholder="Ex Siap Soft"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Company Owner <span class="text-red-600">*</span></label
              >
              <input
                v-model="formData.company_owner"
                type="text"
                placeholder="Ex Abdul"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2"
              >Description</label
            >
            <textarea
              v-model="formData.description"
              placeholder="Ex Lorem ipsum dolor sit"
              rows="3"
              class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm resize-none"
            ></textarea>
          </div>

          <!-- Email & Telephone -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Email <span class="text-red-600">*</span></label
              >
              <input
                v-model="formData.email"
                type="email"
                placeholder="Ex siapsoft@gmail.com"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Telephone</label
              >
              <input
                v-model="formData.telephone"
                type="text"
                placeholder="Ex +628234567891"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!-- Website & Industry -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Website</label
              >
              <input
                v-model="formData.website"
                type="text"
                placeholder="Ex siapsoft.com"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Industry</label
              >
              <div class="relative">
                <select
                  v-model="formData.industry"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option
                    v-for="opt in industryOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
                <ChevronDown
                  :size="16"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
          </div>

            <LocationSelector v-model="formData" />

          <!-- Pos Code & Source -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Pos Code</label
              >
              <input
                v-model="formData.pos_code"
                type="text"
                placeholder="Pos Code"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Source</label
              >
              <div class="relative">
                <select
                  v-model="formData.source"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option
                    v-for="opt in sourceOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
                <ChevronDown
                  :size="16"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
          </div>

          <!-- Type -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Type</label
              >
              <div class="relative">
                <select
                  v-model.number="formData.type"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Select Type</option>
                  <option
                    v-for="status in statuses"
                    :key="status.id"
                    :value="status.id"
                  >
                    {{ status.name }}
                  </option>
                </select>
                <ChevronDown
                  :size="16"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
    
          </div>

          <!-- Contact Association -->
          <div data-contacts-dropdown>
            <label class="block text-sm font-medium text-dark-base mb-2">
              Contact Association
            </label>
            <div class="relative">
              <input
                v-model="contactSearch"
                type="text"
                placeholder="Search contacts..."
                @click="toggleContactDropdown"
                @input="filterContacts"
                class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
              <ChevronDown
                :size="16"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none transition-transform duration-200"
                :class="{ 'rotate-180': isContactDropdownOpen }"
              />

              <!-- Dropdown -->
              <div
                v-if="isContactDropdownOpen && filteredContacts.length > 0"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-outline rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
              >
                <div
                  v-for="contact in filteredContacts"
                  :key="contact.id"
                  @click="toggleContact(contact)"
                  class="px-3 py-2 hover:bg-light-base cursor-pointer text-sm text-dark-base"
                >
                  {{ contact.first_name }} {{ contact.last_name }}
                </div>
              </div>

              <!-- Empty State -->
              <div
                v-if="
                  isContactDropdownOpen &&
                  filteredContacts.length === 0 &&
                  contactOptions.length > 0
                "
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-outline rounded-lg shadow-lg z-50 px-3 py-4 text-center"
              >
                <p class="text-sm text-sub-text">No contacts found</p>
              </div>

              <!-- Loading/No Data State -->
              <div
                v-if="isContactDropdownOpen && contactOptions.length === 0"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-outline rounded-lg shadow-lg z-50 px-3 py-4 text-center"
              >
                <p class="text-sm text-sub-text">Loading contacts...</p>
              </div>
            </div>

            <!-- Selected Contacts -->
            <div
              v-if="selectedContacts.length > 0"
              class="mt-2 flex flex-wrap gap-2"
            >
              <span
                v-for="contact in selectedContacts"
                :key="contact.id"
                class="bg-light-base px-2 py-1 rounded text-xs text-dark-base flex items-center gap-1"
              >
                {{ contact.first_name }} {{ contact.last_name }}
                <button
                  type="button"
                  @click="toggleContact(contact)"
                  class="hover:text-red"
                >
                  <X :size="14" />
                </button>
              </span>
            </div>

            <button
              type="button"
              @click="showAddContactQuickForm = true"
              class="mt-2 text-sm text-sub-text hover:text-dark-base font-medium flex items-center gap-1"
            >
              <Plus :size="14" />
              Create Contact
            </button>
          </div>

          <!-- Deals Association -->
          <div data-deals-dropdown>
            <label class="block text-sm font-medium text-dark-base mb-2">
              Deals Association
            </label>
            <div class="relative">
              <input
                v-model="dealSearch"
                type="text"
                placeholder="Search deals..."
                @click="toggleDealDropdown"
                @input="filterDeals"
                class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
              <ChevronDown
                :size="16"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none transition-transform duration-200"
                :class="{ 'rotate-180': isDealDropdownOpen }"
              />

              <!-- Dropdown -->
              <div
                v-if="isDealDropdownOpen && filteredDeals.length > 0"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-outline rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
              >
                <div
                  v-for="deal in filteredDeals"
                  :key="deal.id"
                  @click="toggleDeal(deal)"
                  class="px-3 py-2 hover:bg-light-base cursor-pointer text-sm text-dark-base"
                >
                  {{ deal.deal_name || deal.name || "Unnamed Deal" }}
                </div>
              </div>

              <!-- Empty State -->
              <div
                v-if="
                  isDealDropdownOpen &&
                  filteredDeals.length === 0 &&
                  dealOptions.length > 0
                "
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-outline rounded-lg shadow-lg z-50 px-3 py-4 text-center"
              >
                <p class="text-sm text-sub-text">No deals found</p>
              </div>

              <!-- Loading/No Data State -->
              <div
                v-if="isDealDropdownOpen && dealOptions.length === 0"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-outline rounded-lg shadow-lg z-50 px-3 py-4 text-center"
              >
                <p class="text-sm text-sub-text">Loading deals...</p>
              </div>
            </div>

            <!-- Selected Deals -->
            <div
              v-if="selectedDeals.length > 0"
              class="mt-2 flex flex-wrap gap-2"
            >
              <span
                v-for="deal in selectedDeals"
                :key="deal.id"
                class="bg-light-base px-2 py-1 rounded text-xs text-dark-base flex items-center gap-1"
              >
                {{ deal.deal_name || deal.name }}
                <button
                  type="button"
                  @click="toggleDeal(deal)"
                  class="hover:text-red"
                >
                  <X :size="14" />
                </button>
              </span>
            </div>

            <button
              type="button"
              @click="showAddDealForm = true"
              class="mt-2 text-sm text-sub-text hover:text-dark-base font-medium flex items-center gap-1"
            >
              <Plus :size="14" />
              Add Another Deal
            </button>
          </div>
        </form>
      </div>

      <!-- Footer Actions (Sticky) -->
      <div
        class="bg-white flex items-center justify-between px-6 py-4 border-t border-outline shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <button
          type="button"
          @click="handleReset"
          class="text-sm text-red font-medium hover:underline"
        >
          Reset
        </button>
        <div class="flex gap-3">
          <button
            type="button"
            @click="handleClose"
            :disabled="isSubmitting"
            class="px-6 py-2 border border-outline rounded-lg text-sub-text hover:bg-light-base transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-dark-base text-white rounded-lg hover:bg-dark-hover transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <template v-if="isSubmitting">
              <span
                class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              ></span>
              <span>Saving...</span>
            </template>
            <template v-else> Next </template>
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Add Deal Form -->
  <AddDealForm
    :isOpen="showAddDealForm"
    @close="showAddDealForm = false"
    @submit="handleDealFormSubmit"
  />

  <!-- Add Contact Quick Form -->
  <AddContactQuickForm
    :isOpen="showAddContactQuickForm"
    @close="showAddContactQuickForm = false"
    @submit="handleContactQuickSubmit"
  />

  <ContactDetailForm
    :isOpen="showDetailForm"
    title="Create Company / Details"
    saveButtonText="Save Company"
    entityType="company"
    :isSaving="isSubmitting"
    @close="showDetailForm = false"
    @back="showDetailForm = false"
    @submit="handleDetailSubmit"
  />
</template>

<style scoped>
/* Overlay Animation */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Slide Animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}

/* Custom scrollbar for dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

/* Remove Browser Autofill Blue Background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:active,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #1c2434 !important;
  transition: background-color 5000s ease-in-out 0s;
}

input:-webkit-autofill:focus,
select:-webkit-autofill:focus {
  -webkit-box-shadow:
    0 0 0 30px white inset,
    0 0 0 1px #64728b !important;
  -webkit-text-fill-color: #1c2434 !important;
}
</style>
