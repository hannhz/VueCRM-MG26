<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { X, Plus, ChevronDown, Search, Check } from "lucide-vue-next";
import AddDealForm from "./AddDealForm.vue";
import AddContactQuickForm from "./AddContactQuickForm.vue";
import ContactDetailForm from "./DetailFormDuplicate.vue";
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
  return store.getters["contacts/allContacts"] || [];
});

const dealOptions = computed(() => {
  return store.getters["deals/allDeals"] || [];
});

const ownerOptions = computed(() => {
  const users = store.getters["users/allUsers"] || [];
  return [
    { value: "", label: "Select Owner" },
    ...users.map((user) => ({
      value: user.name || user.username || user.id,
      label: user.name || user.username || "Unknown",
    })),
  ];
});

const currentUserName = computed(() => {
  const signedInUser =
    store.getters["users/usersignin"] || store.state.auth?.user || null;
  const fullName = [
    signedInUser?.first_name || signedInUser?.firstname,
    signedInUser?.last_name || signedInUser?.lastname,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return signedInUser?.name || signedInUser?.username || fullName || "";
});

const applyDefaultOwner = () => {
  if (!formData.value.owner && currentUserName.value) {
    formData.value.owner = currentUserName.value;
  }
};

const fetchAssociationOptions = async () => {
  const promises = [];
  if (!store.getters["users/usersignin"]) {
    promises.push(store.dispatch("users/getusersignin"));
  }
  if ((store.getters["users/allUsers"] || []).length === 0) {
    promises.push(store.dispatch("users/fetchAllusers"));
  }
  if ((store.getters["contacts/allContacts"] || []).length === 0) {
    promises.push(store.dispatch("contacts/fetchAllContacts"));
  }
  if ((store.getters["deals/allDeals"] || []).length === 0) {
    promises.push(store.dispatch("deals/fetchAllDeals"));
  }

  if (promises.length > 0) {
    await Promise.allSettled(promises);
  }
};

onMounted(() => {
  fetchAssociationOptions().finally(applyDefaultOwner);
});

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      fetchAssociationOptions().finally(applyDefaultOwner);
    }
  },
);

const formData = ref({
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
});

// Dropdown State for Contacts
const isContactDropdownOpen = ref(false);
const contactSearch = ref("");
const contactDropdownRef = ref(null);

const filteredContacts = computed(() => {
  if (!contactSearch.value) return contactOptions.value;
  return contactOptions.value.filter(
    (c) =>
      `${c.first_name} ${c.last_name}`
        .toLowerCase()
        .includes(contactSearch.value.toLowerCase()) ||
      c.email?.toLowerCase().includes(contactSearch.value.toLowerCase()),
  );
});

// Dropdown State for Deals
const isDealDropdownOpen = ref(false);
const dealSearch = ref("");
const dealDropdownRef = ref(null);

const filteredDeals = computed(() => {
  if (!dealSearch.value) return dealOptions.value;
  return dealOptions.value.filter((d) =>
    (d.deal_name || d.name)
      ?.toLowerCase()
      .includes(dealSearch.value.toLowerCase()),
  );
});

const toggleContact = (contact) => {
  const index = formData.value.contactassoc.indexOf(contact.id);
  if (index === -1) {
    formData.value.contactassoc.push(contact.id);
  } else {
    formData.value.contactassoc.splice(index, 1);
  }
};

const isContactSelected = (id) => formData.value.contactassoc.includes(id);

const selectedContacts = computed(() => {
  return contactOptions.value.filter((c) => isContactSelected(c.id));
});

const toggleDeal = (deal) => {
  const index = formData.value.dealsassoc.indexOf(deal.id);
  if (index === -1) {
    formData.value.dealsassoc.push(deal.id);
  } else {
    formData.value.dealsassoc.splice(index, 1);
  }
};

const isDealSelected = (id) => formData.value.dealsassoc.includes(id);

const selectedDeals = computed(() => {
  return dealOptions.value.filter((d) => isDealSelected(d.id));
});

const handleClickOutside = (event) => {
  if (
    contactDropdownRef.value &&
    !contactDropdownRef.value.contains(event.target)
  ) {
    isContactDropdownOpen.value = false;
  }
  if (dealDropdownRef.value && !dealDropdownRef.value.contains(event.target)) {
    isDealDropdownOpen.value = false;
  }
};

onMounted(() => {
  fetchAssociationOptions();
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

const showAddDealForm = ref(false);
const showAddContactQuickForm = ref(false);
const showDetailForm = ref(false);

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

  showDetailForm.value = true;
};

const handleDetailSubmit = async (detailPayload) => {
  console.log(detailPayload);
  isSubmitting.value = true;

  try {
    // Tambahkan timestamps sebelum kirim
    const dataToSubmit = {
      ...detailPayload, // Pastikan detailPayload tidak menimpa field utama
      ...formData.value,
      owner: formData.value.owner || currentUserName.value || "",
      dealsassoc: (formData.value.dealsassoc || []).join(","),
      contactassoc: (formData.value.contactassoc || []).join(","),
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

    emit("submit", response);
    showDetailForm.value = false;
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
    owner: currentUserName.value || "",
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
  contactSearch.value = "";
  dealSearch.value = "";
};
</script>

<!-- <script>
import { mapActions, mapGetters } from "vuex";
import { X, Plus, ChevronDown, Search, Check } from "lucide-vue-next";
import AddDealForm from "./AddDealForm.vue";
import AddContactQuickForm from "./AddContactQuickForm.vue";
import ContactDetailForm from "./DetailFormDuplicate.vue";
import { alertService } from "@/services/alertService";

export default {
  components: {
    X,
    Plus,
    ChevronDown,
    Search,
    Check,
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

  emits: ["close", "submit"],

  data() {
    return {
      isSubmitting: false,

      contactSearch: "",
      dealSearch: "",

      isContactDropdownOpen: false,
      isDealDropdownOpen: false,

      contactDropdownRef: null,
      dealDropdownRef: null,

      showAddDealForm: false,
      showAddContactQuickForm: false,
      showDetailForm: false,

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

      typeOptions: [
        { value: "", label: "Select Type" },
        { value: "prospect", label: "Prospect" },
        { value: "customer", label: "Customer" },
        { value: "partner", label: "Partner" },
        { value: "vendor", label: "Vendor" },
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

      return (this.contactOptions || []).filter((c) =>
        `${c.first_name} ${c.last_name}`
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
    isOpen(val) {
      if (val) {
        this.fetchAssociationOptions().finally(this.applyDefaultOwner);
      }
    },
  },

  mounted() {
    this.fetchAssociationOptions().finally(this.applyDefaultOwner);
    document.addEventListener("mousedown", this.handleClickOutside);
  },

  beforeDestroy() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  },

  methods: {
    ...mapActions({
      getUserSignin: "users/getusersignin",
      fetchAllUsers: "users/fetchAllusers",
      fetchAllContacts: "contacts/fetchAllContacts",
      fetchAllDeals: "deals/fetchAllDeals",
      insertCompany: "company/insertcompany",
    }),

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

    toggleDeal(deal) {
      const index = this.formData.dealsassoc.indexOf(deal.id);

      if (index === -1) {
        this.formData.dealsassoc.push(deal.id);
      } else {
        this.formData.dealsassoc.splice(index, 1);
      }
    },

    handleClickOutside(event) {
      if (
        this.contactDropdownRef &&
        !this.contactDropdownRef.contains(event.target)
      ) {
        this.isContactDropdownOpen = false;
      }

      if (
        this.dealDropdownRef &&
        !this.dealDropdownRef.contains(event.target)
      ) {
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
        const dataToSubmit = {
          ...this.formData,
          owner: this.formData.owner || this.currentUserName || "",
          dealsassoc: (this.formData.dealsassoc || []).join(","),
          contactassoc: (this.formData.contactassoc || []).join(","),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const response = await this.insertCompany({
          formdata: dataToSubmit,
        });

        alertService.success("Company berhasil ditambahkan!");

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

    handleReset() {
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
</script> -->

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

          <!-- Type & Owner -->
          <div class="grid grid-cols-2 gap-4">
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
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Owner</label
              >
              <div class="relative">
                <select
                  v-model="formData.owner"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option
                    v-for="opt in ownerOptions"
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

          <!-- Contact Association -->
          <div class="relative" ref="contactDropdownRef">
            <label class="block text-sm font-medium text-dark-base mb-2"
              >Contact Association</label
            >
            <div
              @click="isContactDropdownOpen = !isContactDropdownOpen"
              class="w-full px-3 py-2 border border-outline rounded-lg flex flex-wrap gap-2 items-center cursor-pointer min-h-10.5 bg-white transition focus-within:ring-1 focus-within:ring-sub-text"
            >
              <div
                v-if="formData.contactassoc.length === 0"
                class="text-gray-400 text-sm"
              >
                Search and select contacts
              </div>
              <div
                v-for="contact in selectedContacts"
                :key="contact.id"
                class="flex items-center gap-1 bg-light-base px-2 py-1 rounded text-xs font-medium text-dark-base border border-outline"
                @click.stop
              >
                {{ contact.first_name }} {{ contact.last_name }}
                <X
                  :size="12"
                  class="cursor-pointer hover:text-red"
                  @click="toggleContact(contact)"
                />
              </div>
              <ChevronDown :size="16" class="ml-auto text-sub-text" />
            </div>

            <!-- Dropdown Menu -->
            <div
              v-if="isContactDropdownOpen"
              class="absolute z-50 w-full mt-1 bg-white border border-outline rounded-lg shadow-xl flex flex-col max-h-64"
            >
              <div class="p-2 border-b border-outline">
                <div class="relative">
                  <Search
                    :size="14"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-sub-text"
                  />
                  <input
                    v-model="contactSearch"
                    type="text"
                    placeholder="Search by name or email"
                    class="w-full pl-9 pr-3 py-2 bg-light-base/50 border border-outline rounded text-sm focus:outline-none focus:ring-1 focus:ring-sub-text"
                    @click.stop
                  />
                </div>
              </div>
              <div class="flex-1 overflow-y-auto py-1">
                <div
                  v-for="contact in filteredContacts"
                  :key="contact.id"
                  @click="toggleContact(contact)"
                  class="px-4 py-2 hover:bg-light-base cursor-pointer flex items-center justify-between text-sm transition"
                >
                  <div class="flex flex-col">
                    <span class="font-medium text-dark-base"
                      >{{ contact.first_name }} {{ contact.last_name }}</span
                    >
                    <span class="text-xs text-sub-text">{{
                      contact.email
                    }}</span>
                  </div>
                  <div
                    v-if="isContactSelected(contact.id)"
                    class="w-5 h-5 bg-dark-base rounded-full flex items-center justify-center"
                  >
                    <Check :size="12" class="text-white" />
                  </div>
                </div>
                <div
                  v-if="filteredContacts.length === 0"
                  class="px-4 py-6 text-center text-sm text-sub-text"
                >
                  No contacts found
                </div>
              </div>
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
          <div class="relative" ref="dealDropdownRef">
            <label class="block text-sm font-medium text-dark-base mb-2"
              >Deals Association</label
            >
            <div
              @click="isDealDropdownOpen = !isDealDropdownOpen"
              class="w-full px-3 py-2 border border-outline rounded-lg flex flex-wrap gap-2 items-center cursor-pointer min-h-10.5 bg-white transition focus-within:ring-1 focus-within:ring-sub-text"
            >
              <div
                v-if="formData.dealsassoc.length === 0"
                class="text-gray-400 text-sm"
              >
                Search and select deals
              </div>
              <div
                v-for="deal in selectedDeals"
                :key="deal.id"
                class="flex items-center gap-1 bg-light-base px-2 py-1 rounded text-xs font-medium text-dark-base border border-outline"
                @click.stop
              >
                {{ deal.deal_name || deal.name }}
                <X
                  :size="12"
                  class="cursor-pointer hover:text-red"
                  @click="toggleDeal(deal)"
                />
              </div>
              <ChevronDown :size="16" class="ml-auto text-sub-text" />
            </div>

            <!-- Dropdown Menu -->
            <div
              v-if="isDealDropdownOpen"
              class="absolute z-50 w-full mt-1 bg-white border border-outline rounded-lg shadow-xl flex flex-col max-h-64"
            >
              <div class="p-2 border-b border-outline">
                <div class="relative">
                  <Search
                    :size="14"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-sub-text"
                  />
                  <input
                    v-model="dealSearch"
                    type="text"
                    placeholder="Search deals"
                    class="w-full pl-9 pr-3 py-2 bg-light-base/50 border border-outline rounded text-sm focus:outline-none focus:ring-1 focus:ring-sub-text"
                    @click.stop
                  />
                </div>
              </div>
              <div class="flex-1 overflow-y-auto py-1">
                <div
                  v-for="deal in filteredDeals"
                  :key="deal.id"
                  @click="toggleDeal(deal)"
                  class="px-4 py-2 hover:bg-light-base cursor-pointer flex items-center justify-between text-sm transition"
                >
                  <div class="flex flex-col">
                    <span class="font-medium text-dark-base">{{
                      deal.deal_name || deal.name
                    }}</span>
                    <span class="text-xs text-sub-text">{{
                      deal.description || "No description"
                    }}</span>
                  </div>
                  <div
                    v-if="isDealSelected(deal.id)"
                    class="w-5 h-5 bg-dark-base rounded-full flex items-center justify-center"
                  >
                    <Check :size="12" class="text-white" />
                  </div>
                </div>
                <div
                  v-if="filteredDeals.length === 0"
                  class="px-4 py-6 text-center text-sm text-sub-text"
                >
                  No deals found
                </div>
              </div>
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
