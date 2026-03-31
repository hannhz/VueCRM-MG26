<script>
import { mapActions, mapGetters } from "vuex";
import { X, Plus, ChevronDown } from "lucide-vue-next";
import AddDealForm from "./AddDealForm.vue";
import AddContactQuickForm from "./AddContactQuickForm.vue";
import LocationSelector from "./component/LocationSelector.vue";
import ContactDetailForm from "./DetailFormDuplicate.vue";
import ContactAssociationForm from "./assoc/contacts.vue";
import DealAssociationForm from "./assoc/deals.vue";
import { alertService } from "@/services/alertService";
import NotesEditor from "@/components/widgets/NotesEditor.vue";
import TaskEditor from "@/components/widgets/TaskEditor.vue";
import DocsEditor from "@/components/widgets/DocsEditor.vue";

export default {
  name: "CreateCompanyForm",

  components: {
    X,
    Plus,
    ChevronDown,
    AddDealForm,
    AddContactQuickForm,
    LocationSelector,
    ContactDetailForm,
    ContactAssociationForm,
    DealAssociationForm,
    NotesEditor,
    TaskEditor,
    DocsEditor,
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      contactSearch: "",
      statuses: [],
      activeTab: "master",
      formData: {
        company_name: "",
        company_owner: "",
        owner: "",
        description: "",
        email: "",
        telephone: "",
        website: "",
        industry: "",
        source: "",
        address: "",
        country: "",
        province: "",
        city: "",
        pos_code: "",
        type: "",
        dealsassoc: [],
        contactassoc: [],
        task: {
          name: "",
          content: "",
          status: "",
          dueDate: "",
          time: "",
          priority: "",
        },

        docs: {
          description: "",
          fileSource: "",
          files: [],
        },
      },

      showAddDealForm: false,
      showAddContactQuickForm: false,
      showDetailForm: false,
      isSubmitting:false,
    };
  },

  computed: {
    ...mapGetters({
      contactOptions: "contacts/allContacts",
      dealOptions: "deals/allDeals",
      allUsers: "users/allUsers",
      userSignin: "users/usersignin",
      industries: "company/industries",
      sources: "company/sources",
      type: "company/type",
    }),
  },

  watch: {
    isOpen(isOpen) {
      if (isOpen) {
        this.getinduestries();
        this.getsources();
        this.gettype();
      }
    },
  },

  mounted() {
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
      getinduestries: "company/getinduestries",
      getsources: "company/getsources",
      gettype: "company/gettype",
    }),

    handleClickOutside(e) {
      // Close dropdowns saat klik di luar
      if (!e.target.closest("[data-contacts-dropdown]")) {
        this.isContactDropdownOpen = false;
      }
    },

    handleClose() {
      this.$emit("close");
    },

    handleSave() {
      this.isSubmitting = true;
      // const now = new Date().toISOString();
      // const dataToSubmit = {
      //   ...this.formData,
      //   owner: this.formData.owner || this.currentUserName || "",
      //   dealsassoc: (this.formData.dealsassoc || []).join(","),
      //   contactassoc: (this.formData.contactassoc || []).join(","),
      //   notes: detailPayload?.note || "",
      //   task_name: detailPayload?.task?.name || "",
      //   desktask: detailPayload?.task?.content || "",
      //   statustask: detailPayload?.task?.status || "",
      //   assignee: detailPayload?.task?.assignee || "",
      //   due_date: detailPayload?.task?.dueDate || "",
      //   task_time: detailPayload?.task?.time || "",
      //   prioritytask: detailPayload?.task?.priority || "",
      //   associated_contact: detailPayload?.task?.associatedContact || "",
      //   docs: detailPayload?.docs?.description || "",
      //   created_at: now,
      //   updated_at: now,
      // };

      console.log("Data to submit:", this.formData);

      this.insertCompany({ formdata: this.formData }).then((data)=>{
        alertService.success("Company berhasil ditambahkan!");
        this.resetForm();
        this.$emit("submit", data);
        this.showDetailForm = false;
        this.handleClose();
      }).catch((error)=>{
        alertService.error(
          error.response?.data?.message ||
            error.message ||
            "Gagal menambah company.",
        );
      }).finally(()=>{
        this.isSubmitting = false;
      });

      // try {
      //   const response = await this.insertCompany({ formdata: dataToSubmit });
      //   alertService.success("Company berhasil ditambahkan!");
      //   this.resetForm();
      //   this.$emit("submit", response);
      //   this.showDetailForm = false;
      //   this.handleClose();
      // } catch (error) {
      //   alertService.error(
      //     error.response?.data?.message ||
      //       error.message ||
      //       "Gagal menambah company.",
      //   );
      // } finally {
      //   this.isSubmitting = false;
      // }
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
    },
    
    handleDetailSubmit(){
      
    }
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

      <!-- Tabs -->
      <div class="flex border-b border-outline px-6 bg-white">
        <button
          type="button"
          @click="activeTab = 'master'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition',
            activeTab === 'master'
              ? 'border-dark-base text-dark-base'
              : 'border-transparent text-sub-text hover:text-dark-base',
          ]"
        >
          Master
        </button>

        <button
          type="button"
          @click="activeTab = 'detail'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition',
            activeTab === 'detail'
              ? 'border-dark-base text-dark-base'
              : 'border-transparent text-sub-text hover:text-dark-base',
          ]"
        >
          Detail
        </button>
      </div>

      <!-- Form Content (Scrollable) - halaman utama TIDAK ikut scroll -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <form>
          <!-- master -->
          <div v-if="activeTab === 'master'" class="p-6 space-y-6">
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
                  <v-select
                    v-model="formData.industry"
                    :options="industries"
                    label="label"
                    :reduce="(opt) => opt.value"
                    placeholder="Select Industry"
                  />
                </div>
              </div>
            </div>

            <!-- Address & City | Province & Country -->
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
                  <v-select
                    v-model="formData.source"
                    :options="sources"
                    label="label"
                    :reduce="(opt) => opt.value"
                    placeholder="Select Source"
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
                  <v-select
                    v-model="formData.type"
                    :options="type"
                    label="label"
                    :reduce="(opt) => opt.value"
                    placeholder="Select Type"
                  />
                </div>
              </div>
            </div>

            <!-- Contact Association -->
            <ContactAssociationForm v-model="formData.contactassoc" />
            <DealAssociationForm v-model="formData.dealsassoc" />
          </div>

          <!-- detail -->
          <div v-if="activeTab === 'detail'" class="p-6 space-y-6">
            <div class="flex-1 overflow-y-auto min-h-0">
              <div>
                <NotesEditor v-model="formData.notes" />

                <TaskEditor v-model="formData.task" />

                <DocsEditor v-model="formData.docs" />
              </div>
            </div>
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
            @click="handleSave"
            :disabled="isSubmitting"
            class="px-6 py-2 bg-dark-base text-white rounded-lg hover:bg-dark-hover transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <template v-if="isSubmitting">
              <span
                class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              ></span>
              <span>Saving...</span>
            </template>
            <template v-else> Save </template>
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Add Deal Form -->
  <!-- <AddDealForm
    :isOpen="showAddDealForm"
    @close="showAddDealForm = false"
    @submit="handleDealFormSubmit"
  /> -->

  <!-- Add Contact Quick Form -->
  <!-- <AddContactQuickForm
    :isOpen="showAddContactQuickForm"
    @close="showAddContactQuickForm = false"
    @submit="handleContactQuickSubmit"
  /> -->

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
