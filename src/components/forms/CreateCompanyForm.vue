<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { X, Plus, ChevronDown } from "lucide-vue-next";
import AddDealForm from "./AddDealForm.vue";
import AddContactQuickForm from "./AddContactQuickForm.vue";
import { alertService } from "@/services/alertService";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);

const store = useStore();
const isSubmitting = ref(false);

const industryOptions = [
  { value: "", label: "Select Industry" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

const sourceOptions = [
  { value: "", label: "Select Source" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social_media", label: "Social Media" },
  { value: "email_campaign", label: "Email Campaign" },
  { value: "cold_call", label: "Cold Call" },
  { value: "trade_show", label: "Trade Show" },
  { value: "partner", label: "Partner" },
  { value: "other", label: "Other" },
];

const typeOptions = [
  { value: "", label: "Select Type" },
  { value: "prospect", label: "Prospect" },
  { value: "customer", label: "Customer" },
  { value: "partner", label: "Partner" },
  { value: "vendor", label: "Vendor" },
];

const contactOptions = computed(() => {
  const contacts = store.getters["contacts/allContacts"] || [];
  return [
    { value: "", label: "Select Contact" },
    ...contacts.map((c) => ({
      value: c.id,
      label: `${c.first_name} ${c.last_name}`.trim() || c.name || "Unknown",
    })),
  ];
});

const dealOptions = computed(() => {
  const deals = store.getters["deals/allDeals"] || [];
  return [
    { value: "", label: "Select Deal" },
    ...deals.map((d) => ({
      value: d.id,
      label: d.deal_name || d.name || "Unknown",
    })),
  ];
});

const fetchAssociationOptions = async () => {
  await Promise.allSettled([
    store.dispatch("contacts/fetchAllContacts"),
    store.dispatch("deals/fetchAllDeals"),
  ]);
};

onMounted(() => {
  fetchAssociationOptions();
});

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      fetchAssociationOptions();
    }
  },
);

const formData = ref({
  company_name: "",
  company_owner: "",
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
  dealsassoc: "",
  contactassoc: "",
});

const showAddDealForm = ref(false);
const showAddContactQuickForm = ref(false);

const handleClose = () => emit("close");

const handleDealFormSubmit = async () => {
  showAddDealForm.value = false;
  await fetchAssociationOptions();
};

const handleContactQuickSubmit = async () => {
  showAddContactQuickForm.value = false;
  await fetchAssociationOptions();
};

const handleSubmit = async () => {
  // Validasi input
  if (!formData.value.company_name.trim()) {
    alertService.error("Company Name wajib diisi!");
    return;
  }

  isSubmitting.value = true;

  try {
    // Tambahkan timestamps sebelum kirim
    const dataToSubmit = {
      ...formData.value,
      dealsassoc: formData.value.dealsassoc ? [formData.value.dealsassoc] : [],
      contactassoc: formData.value.contactassoc
        ? [formData.value.contactassoc]
        : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Kirim data ke store action insertcompany
    const response = await store.dispatch("company/insertcompany", {
      formdata: dataToSubmit,
    });

    // Jika berhasil
    console.log("Company berhasil ditambahkan:", response);
    alertService.success("Company berhasil ditambahkan!");

    emit("submit", formData.value);
    handleClose();
  } catch (error) {
    // Jika error
    console.error("Error saat menambah company:", error);
    alertService.error(
      error.response?.data?.message ||
        error.message ||
        "Gagal menambah company. Silakan coba lagi.",
    );
  } finally {
    isSubmitting.value = false;
  }
};

const handleReset = () => {
  formData.value = {
    company_name: "",
    company_owner: "",
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
    dealsassoc: "",
    contactassoc: "",
  };
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

          <!-- Address & City -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Address</label
              >
              <input
                v-model="formData.address"
                type="text"
                placeholder="Ex simopomahan"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >City</label
              >
              <input
                v-model="formData.city"
                type="text"
                placeholder="City"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!-- Province & Country -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Province</label
              >
              <input
                v-model="formData.province"
                type="text"
                placeholder="Province"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Country</label
              >
              <input
                v-model="formData.country"
                type="text"
                placeholder="Country"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!-- Pos Code & Source -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Pos Code</label
              >
              <input
                v-model="formData.posCode"
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
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2"
              >Type</label
            >
            <div class="relative">
              <select
                v-model="formData.type"
                class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
              >
                <option
                  v-for="opt in typeOptions"
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

          <!-- Contact Association -->
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2"
              >Contact Association</label
            >
            <div class="relative">
              <select
                v-model="formData.contactassoc"
                class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
              >
                <option
                  v-for="opt in contactOptions"
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
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2"
              >Deals Association</label
            >
            <div class="relative">
              <select
                v-model="formData.dealsassoc"
                class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
              >
                <option
                  v-for="opt in dealOptions"
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
