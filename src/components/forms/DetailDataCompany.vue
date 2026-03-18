<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useStatuses } from "@/composables/useStatuses";
import {
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  MapPin,
  Camera,
  Mic,
  Search,
  Check,
} from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  company: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit", "back"]);

const store = useStore();
const { statuses, fetchStatuses } = useStatuses();

const contactOptions = computed(() => {
  return store.getters["contacts/allContacts"] || [];
});

const dealOptions = computed(() => {
  return store.getters["deals/allDeals"] || [];
});

const fetchReferenceData = async () => {
  const promises = [];

  if (!store.getters["users/usersignin"]) {
    promises.push(store.dispatch("users/getusersignin"));
  }

  // Only fetch if store is empty to reduce 429 errors
  if ((store.getters["users/allUsers"] || []).length === 0) {
    promises.push(store.dispatch("users/fetchAllusers"));
  }
  if ((store.getters["contacts/allContacts"] || []).length === 0) {
    promises.push(store.dispatch("contacts/fetchAllContacts"));
  }
  if ((store.getters["deals/allDeals"] || []).length === 0) {
    promises.push(store.dispatch("deals/fetchAllDeals"));
  }

  promises.push(fetchStatuses());

  if (promises.length > 0) {
    await Promise.allSettled(promises);
  }
};

// Section toggles
const showNotes = ref(true);
const showTasks = ref(true);
const showDocs = ref(true);

// Notes
const noteContent = ref("");

// Tasks
const taskName = ref("");
const taskContent = ref("");
const taskStatus = ref("");
const taskAssignee = ref("");
const taskDueDate = ref("");
const taskTime = ref("");
const taskPriority = ref("");
const taskAssociatedContact = ref("");

const statusOptions = [
  { value: "", label: "Select Data" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const assigneeOptions = computed(() => {
  const users = store.getters["users/allUsers"] || [];
  return [
    { value: "", label: "Select Data" },
    ...users.map((user) => ({
      value: user.name || user.username || user.id,
      label: user.name || user.username || "Unknown",
    })),
  ];
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

const associatedWithOptions = computed(() => {
  const contacts = store.getters["contacts/allContacts"] || [];
  return [
    { value: "", label: "Select Contact" },
    ...contacts.map((contact) => ({
      value: contact.id,
      label: getDisplayNameFromContact(contact),
    })),
  ];
});

const getDisplayNameFromContact = (contact) => {
  if (!contact) return "Unknown";
  return (
    `${contact.first_name || ""} ${contact.last_name || ""}`.trim() ||
    contact.name ||
    contact.email ||
    "Unknown"
  );
};

const getDisplayNameFromDeal = (deal) => {
  if (!deal) return "Unknown";
  return deal.deal_name || deal.name || "Unknown";
};

const priorityOptions = [
  { value: "", label: "Select Data" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

// Docs
const docDescription = ref("");
const docFileSource = ref("");
const docDropdownOpen = ref(false);
const docDropdownRef = ref(null);
const selectedDocFiles = ref([]);

const fileSourceOptions = [
  { value: "", label: "Select File Source" },
  { value: "local", label: "Local File" },
  { value: "google_drive", label: "Google Drive" },
  { value: "dropbox", label: "Dropbox" },
];

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

const getAssociationCandidates = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        if (typeof v === "object" && v !== null) {
          return (
            v.id ??
            v.deal_id ??
            v.contact_id ??
            v.id_deal ??
            v.id_contact ??
            v.userid ??
            v.id_user
          );
        }
        return v;
      })
      .filter((v) => v !== "" && v !== null && v !== undefined);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [value];
};

const resolveAssociationValues = (candidates, options) => {
  if (!candidates || !Array.isArray(candidates) || !options) return [];

  return candidates
    .map((candidate) => {
      const normalizedCandidate = String(candidate).trim();
      if (!normalizedCandidate) return null;

      // Find by ID match
      const matchedOption = options.find((option) => {
        const optId = String(
          option.id ??
            option.value ??
            option.deal_id ??
            option.contact_id ??
            "",
        ).trim();
        return optId === normalizedCandidate;
      });
      if (matchedOption) return matchedOption.id || matchedOption.value;

      // Fallback: search by name/label match
      const matchedByLabel = options.find((option) => {
        const label = String(
          option.name ?? option.deal_name ?? option.label ?? "",
        )
          .trim()
          .toLowerCase();
        return label === normalizedCandidate.toLowerCase();
      });
      return matchedByLabel ? matchedByLabel.id || matchedByLabel.value : null;
    })
    .filter((v) => v !== null && v !== undefined);
};

const resolveUserValue = (candidate, options) => {
  if (!candidate || !options) return "";
  const normalizedCandidate = String(candidate).trim().toLowerCase();
  
  const match = options.find(opt => 
    String(opt.value).trim().toLowerCase() === normalizedCandidate ||
    String(opt.label).trim().toLowerCase() === normalizedCandidate
  );
  
  return match ? match.value : candidate;
};

const getCompanyFormDefaults = (company = null) => {
  // Extract actual company data if it's wrapped in the response format
  const data = (company && company.companies && company.companies.length > 0) 
    ? company.companies[0] 
    : company;

  const deals = getAssociationCandidates(
    data?.dealsassoc ||
      company?.dealsassoc || // Check wrapper too
      data?.dealsAssociation ||
      data?.deals_id ||
      data?.deal_id ||
      data?.deals || // Handle 'deals' field from user JSON
      data?.deal
  );

  const contacts = getAssociationCandidates(
    data?.contactassoc ||
      company?.contactassoc || // Check wrapper too
      data?.contactAssociation ||
      data?.contacts_id ||
      data?.contact_id ||
      data?.contact || // Handle 'contact' field from user JSON
      data?.contact
  );

  return {
    company_name: data?.company_name || "",
    company_owner: data?.company_owner || "",
    owner: data?.owner || currentUserName.value || "",
    description: data?.description || "",
    email: data?.email || "",
    telephone: data?.telephone || "",
    website: data?.website || "",
    industry: data?.industry || "",
    address: data?.address || "",
    city: data?.city || "",
    province: data?.province || "",
    country: data?.country || "",
    pos_code: data?.pos_code || data?.posCode || "",
    source: data?.source || "",
    type: data?.type || "",
    dealsassoc: deals,
    contactassoc: contacts,
  };
};

const companyForm = ref(getCompanyFormDefaults());

const syncTaskAssociatedContact = (company = props.company) => {
  const candidates = getAssociationCandidates(
    taskAssociatedContact.value ||
      company?.contactassoc ||
      company?.contactAssociation ||
      company?.contacts_id ||
      company?.contact_id ||
      company?.contact,
  );

  const resolved = resolveAssociationValues(
    candidates,
    associatedWithOptions.value,
  );
  taskAssociatedContact.value = resolved.length > 0 ? resolved[0] : "";
};

const syncAssociationValues = (company = props.company) => {
  if (!company) {
    return;
  }

  // Handle wrapped response format
  const data = (company && company.companies && company.companies.length > 0) 
    ? company.companies[0] 
    : company;

  const dealsCandidates = getAssociationCandidates(
    companyForm.value.dealsassoc.length > 0
      ? companyForm.value.dealsassoc
      : company?.dealsassoc || // Check wrapper root (for associations array)
          data?.dealsassoc ||
          data?.dealsAssociation ||
          data?.deals_id ||
          data?.deals || // From user JSON
          data?.deal_id ||
          data?.deal,
  );

  companyForm.value.dealsassoc = resolveAssociationValues(
    dealsCandidates,
    dealOptions.value,
  );

  const contactCandidates = getAssociationCandidates(
    companyForm.value.contactassoc.length > 0
      ? companyForm.value.contactassoc
      : company?.contactassoc || // Check wrapper root
          data?.contactassoc ||
          data?.contactAssociation ||
          data?.contacts_id ||
          data?.contact || // From user JSON
          data?.contact_id ||
          data?.contact,
  );

  companyForm.value.contactassoc = resolveAssociationValues(
    contactCandidates,
    contactOptions.value,
  );
};

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
  const contactId = String(contact.id).trim();
  const index = companyForm.value.contactassoc.findIndex(
    (id) => String(id).trim() === contactId,
  );
  if (index === -1) {
    companyForm.value.contactassoc.push(contactId);
  } else {
    companyForm.value.contactassoc.splice(index, 1);
  }
};

const isContactSelected = (id) => {
  const normalizedId = String(id).trim();
  return companyForm.value.contactassoc.some(
    (assocId) => String(assocId).trim() === normalizedId,
  );
};

const selectedContacts = computed(() => {
  return contactOptions.value.filter((c) => {
    const contactId = String(c.id).trim();
    return companyForm.value.contactassoc.some(
      (id) => String(id).trim() === contactId,
    );
  });
});

const toggleDeal = (deal) => {
  const dealId = String(deal.id).trim();
  const index = companyForm.value.dealsassoc.findIndex(
    (id) => String(id).trim() === dealId,
  );
  if (index === -1) {
    companyForm.value.dealsassoc.push(dealId);
  } else {
    companyForm.value.dealsassoc.splice(index, 1);
  }
};

const isDealSelected = (id) => {
  const normalizedId = String(id).trim();
  return companyForm.value.dealsassoc.some(
    (assocId) => String(assocId).trim() === normalizedId,
  );
};

const selectedDeals = computed(() => {
  return dealOptions.value.filter((d) => {
    const dealId = String(d.id).trim();
    return companyForm.value.dealsassoc.some(
      (id) => String(id).trim() === dealId,
    );
  });
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
  document.addEventListener("mousedown", handleClickOutside);
});

const syncAdditionalData = (company) => {
  if (!company) return;

  // Handle wrapped response format
  const data = (company && company.companies && company.companies.length > 0) 
    ? company.companies[0] 
    : company;

  // Notes mapping
  noteContent.value = data.notes || "";

  // Tasks mapping
  taskName.value = data.task_name || "";
  taskContent.value = data.desktask || data.task_content || "";
  taskStatus.value = data.status || "";
  taskAssignee.value = resolveUserValue(data.assignee, assigneeOptions.value);
  taskDueDate.value = data.due_date || "";
  
  // Format task_time: HH:mm:ss.SSSSSSS -> HH:mm
  if (data.task_time) {
    taskTime.value = data.task_time.split('.')[0].substring(0, 5);
  } else {
    taskTime.value = "";
  }
  
  taskPriority.value = data.priority || "";

  // Docs mapping
  docDescription.value = data.docs || "";
};

watch(
  () => props.company,
  (company) => {
    if (company) {
      companyForm.value = getCompanyFormDefaults(company);
      syncAssociationValues(company);
      syncTaskAssociatedContact(company);
      syncAdditionalData(company);
    }
  },
  { immediate: true },
);

watch(
  [dealOptions, contactOptions, associatedWithOptions, assigneeOptions],
  () => {
    syncAssociationValues();
    syncTaskAssociatedContact();
    syncAdditionalData(props.company);
  },
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      fetchReferenceData();
    }
  },
);

const handleDocFileChange = (e) => {
  selectedDocFiles.value = Array.from(e.target.files);
};

const removeDocFile = (index) => {
  selectedDocFiles.value.splice(index, 1);
};

const handleClose = () => emit("close");
const handleBack = () => emit("back");

const handleSave = () => {
  // Map fields to match standard naming and wrap associations in comma-separated strings
  const submissionData = {
    ...companyForm.value,
    id: props.company?.id,
    dealsassoc: (companyForm.value.dealsassoc || []).join(","),
    contactassoc: (companyForm.value.contactassoc || []).join(","),
  };

  emit("submit", {
    company: submissionData,
    note: noteContent.value,
    task: {
      name: taskName.value,
      content: taskContent.value,
      status: taskStatus.value,
      assignee: taskAssignee.value,
      dueDate: taskDueDate.value,
      time: taskTime.value,
      priority: taskPriority.value,
      associatedContact: taskAssociatedContact.value,
    },
    docs: {
      description: docDescription.value,
      fileSource: docFileSource.value,
      files: selectedDocFiles.value,
    },
  });
};

const handleReset = () => {
  companyForm.value = getCompanyFormDefaults(props.company);
  syncAdditionalData(props.company);
  syncTaskAssociatedContact(props.company);
  docFileSource.value = "";
  selectedDocFiles.value = [];
};

watch(
  currentUserName,
  (name) => {
    if (name) {
      if (!companyForm.value.owner) {
        companyForm.value.owner = name;
      }
      if (!taskAssignee.value) {
        taskAssignee.value = resolveUserValue(name, assigneeOptions.value);
      }
    }
  },
  { immediate: true },
);

// Remove redundant onMounted
</script>

<template>
  <!-- Overlay -->
  <Transition name="overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-sub-text/80 z-40 transition-all duration-300"
      @click="handleClose"
    ></div>
  </Transition>

  <!-- Slide Panel -->
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
        <h2 class="text-xl font-bold text-dark-base">
          {{ props.company ? "Company Details" : "Add Contact / Details" }}
        </h2>
        <button
          @click="handleClose"
          :disabled="props.isSubmitting"
          class="p-2 hover:bg-light-base rounded-lg transition-colors"
        >
          <X :size="20" class="text-sub-text" />
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <div class="p-6 pb-10 space-y-6">
          <div class="border border-outline rounded-lg p-4 space-y-4">
            <h3 class="text-sm font-semibold text-dark-base">Company Info</h3>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Company Name</label
                >
                <input
                  v-model="companyForm.company_name"
                  type="text"
                  placeholder="Ex Siap Soft"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Company Owner</label
                >
                <input
                  v-model="companyForm.company_owner"
                  type="text"
                  placeholder="Ex Abdul"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Description</label
              >
              <textarea
                v-model="companyForm.description"
                rows="3"
                placeholder="Ex Lorem ipsum dolor sit"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Email</label
                >
                <input
                  v-model="companyForm.email"
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
                  v-model="companyForm.telephone"
                  type="text"
                  placeholder="Ex +628234567891"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Website</label
                >
                <input
                  v-model="companyForm.website"
                  type="text"
                  placeholder="Ex siapsoft.com"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Industry</label
                >
                <select
                  v-model="companyForm.industry"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
                >
                  <option
                    v-for="opt in industryOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Address</label
                >
                <input
                  v-model="companyForm.address"
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
                  v-model="companyForm.city"
                  type="text"
                  placeholder="City"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Province</label
                >
                <input
                  v-model="companyForm.province"
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
                  v-model="companyForm.country"
                  type="text"
                  placeholder="Country"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Pos Code</label
                >
                <input
                  v-model="companyForm.pos_code"
                  type="text"
                  placeholder="Pos Code"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Source</label
                >
                <select
                  v-model="companyForm.source"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
                >
                  <option
                    v-for="opt in sourceOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Type</label
                >
                <select
                  v-model.number="companyForm.type"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
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
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Owner</label
                >
                <div class="relative">
                  <select
                    v-model="companyForm.owner"
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

            <div class="relative" ref="dealDropdownRef">
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Deals Association</label
              >
              <div
                @click="isDealDropdownOpen = !isDealDropdownOpen"
                class="w-full px-3 py-2 border border-outline rounded-lg flex flex-wrap gap-2 items-center cursor-pointer min-h-10.5 bg-white transition focus-within:ring-1 focus-within:ring-sub-text"
              >
                <div
                  v-if="companyForm.dealsassoc.length === 0"
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
                  {{ getDisplayNameFromDeal(deal) }}
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
                        getDisplayNameFromDeal(deal)
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
            </div>

            <div class="relative" ref="contactDropdownRef">
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Contact Association</label
              >
              <div
                @click="isContactDropdownOpen = !isContactDropdownOpen"
                class="w-full px-3 py-2 border border-outline rounded-lg flex flex-wrap gap-2 items-center cursor-pointer min-h-10.5 bg-white transition focus-within:ring-1 focus-within:ring-sub-text"
              >
                <div
                  v-if="companyForm.contactassoc.length === 0"
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
                  {{ getDisplayNameFromContact(contact) }}
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
                      <span class="font-medium text-dark-base">{{
                        getDisplayNameFromContact(contact)
                      }}</span>
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
            </div>
          </div>

          <!-- NOTES SECTION -->
          <div>
            <button
              type="button"
              @click="showNotes = !showNotes"
              class="flex items-center gap-2 w-full text-left mb-3"
            >
              <component
                :is="showNotes ? ChevronDown : ChevronRight"
                :size="16"
                class="text-sub-text"
              />
              <span
                class="text-sm font-semibold text-dark-base flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                  />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Notes
              </span>
            </button>

            <div
              v-if="showNotes"
              class="border border-outline rounded-lg overflow-hidden"
            >
              <!-- Toolbar -->
              <div
                class="flex items-center gap-1 px-3 py-2 border-b border-outline bg-light-base flex-wrap"
              >
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-sub-text text-xs"
                >
                  â†©
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-sub-text text-xs"
                >
                  â†ª
                </button>
                <span class="text-outline mx-1">|</span>
                <select
                  class="text-xs border-none bg-transparent text-sub-text focus:outline-none"
                >
                  <option>Format</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Paragraph</option>
                </select>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded font-bold text-xs text-sub-text"
                >
                  B
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded italic text-xs text-sub-text"
                >
                  I
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded underline text-xs text-sub-text"
                >
                  U
                </button>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ðŸ”—
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  âš“
                </button>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â‰¡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â‰¡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â‰¡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â‰¡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â˜°
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â˜°
                </button>
              </div>
              <!-- Editor area -->
              <textarea
                v-model="noteContent"
                rows="5"
                class="w-full px-4 py-3 text-sm text-sub-text focus:outline-none resize-none"
                placeholder="Tulis catatan..."
              ></textarea>
              <!-- Bottom actions -->
              <div
                class="flex items-center gap-4 px-4 py-2 border-t border-outline"
              >
                <button
                  type="button"
                  class="flex items-center gap-1.5 text-xs text-sub-text hover:text-dark-base"
                >
                  <MapPin :size="14" /> Add GPS Location
                </button>
                <button
                  type="button"
                  class="flex items-center gap-1.5 text-xs text-sub-text hover:text-dark-base"
                >
                  <Camera :size="14" /> Add Photo
                </button>
                <button
                  type="button"
                  class="flex items-center gap-1.5 text-xs text-sub-text hover:text-dark-base"
                >
                  <Mic :size="14" /> Start Recording
                </button>
              </div>
            </div>
          </div>

          <!-- TASKS SECTION -->
          <div>
            <button
              type="button"
              @click="showTasks = !showTasks"
              class="flex items-center gap-2 w-full text-left mb-3"
            >
              <component
                :is="showTasks ? ChevronDown : ChevronRight"
                :size="16"
                class="text-sub-text"
              />
              <span
                class="text-sm font-semibold text-dark-base flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 11 12 14 22 4" />
                  <path
                    d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                  />
                </svg>
                Tasks
              </span>
            </button>

            <div
              v-if="showTasks"
              class="border border-outline rounded-lg overflow-hidden space-y-0"
            >
              <!-- Task Name -->
              <div class="px-4 pt-4 pb-2">
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Name of Task</label
                >
                <input
                  v-model="taskName"
                  type="text"
                  placeholder="Task name..."
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>

              <!-- Task Rich Text -->
              <div class="px-4 pb-4">
                <!-- Toolbar -->
                <div
                  class="flex items-center gap-1 px-3 py-2 border border-outline rounded-t-lg bg-light-base flex-wrap"
                >
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-sub-text text-xs"
                  >
                    â†©
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-sub-text text-xs"
                  >
                    â†ª
                  </button>
                  <span class="text-outline mx-1">|</span>
                  <select
                    class="text-xs border-none bg-transparent text-sub-text focus:outline-none"
                  >
                    <option>Format</option>
                    <option>Heading 1</option>
                    <option>Paragraph</option>
                  </select>
                  <span class="text-outline mx-1">|</span>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded font-bold text-xs text-sub-text"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded italic text-xs text-sub-text"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded underline text-xs text-sub-text"
                  >
                    U
                  </button>
                  <span class="text-outline mx-1">|</span>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    ðŸ”—
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    âš“
                  </button>
                  <span class="text-outline mx-1">|</span>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    â‰¡
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    â‰¡
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    â‰¡
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    â‰¡
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    â˜°
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    â˜°
                  </button>
                </div>
                <textarea
                  v-model="taskContent"
                  rows="4"
                  class="w-full px-3 py-3 text-sm text-sub-text border border-outline border-t-0 rounded-b-lg focus:outline-none resize-none"
                  placeholder="Deskripsi task..."
                ></textarea>
              </div>

              <!-- Status & Assignee -->
              <div class="grid grid-cols-2 gap-4 px-4 pb-4">
                <div>
                  <label class="block text-sm font-medium text-dark-base mb-2"
                    >Status</label
                  >
                  <select
                    v-model="taskStatus"
                    class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
                  >
                    <option
                      v-for="opt in statusOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-dark-base mb-2"
                    >Assignee</label
                  >
                  <select
                    v-model="taskAssignee"
                    class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
                  >
                    <option
                      v-for="opt in assigneeOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Due Date & Time -->
              <div class="grid grid-cols-2 gap-4 px-4 pb-4">
                <div>
                  <label class="block text-sm font-medium text-dark-base mb-2"
                    >Due Date</label
                  >
                  <input
                    v-model="taskDueDate"
                    type="date"
                    class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-dark-base mb-2"
                    >Time</label
                  >
                  <div class="relative">
                    <input
                      v-model="taskTime"
                      type="time"
                      class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                    />
                  </div>
                </div>
              </div>

              <!-- Priority -->
              <div class="px-4 pb-4">
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Priority</label
                >
                <select
                  v-model="taskPriority"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
                >
                  <option
                    v-for="opt in priorityOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              
            </div>
          </div>

          <!-- DOCS SECTION -->
          <div>
            <button
              type="button"
              @click="showDocs = !showDocs"
              class="flex items-center gap-2 w-full text-left mb-3"
            >
              <component
                :is="showDocs ? ChevronDown : ChevronRight"
                :size="16"
                class="text-sub-text"
              />
              <span
                class="text-sm font-semibold text-dark-base flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                  />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Docs
              </span>
            </button>

            <div
              v-if="showDocs"
              class="border border-outline rounded-lg overflow-hidden"
            >
              <!-- Desc of Docs label -->
              <div class="px-4 pt-4 pb-2">
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Desc of Docs</label
                >
              </div>
              <!-- Toolbar -->
              <div
                class="flex items-center gap-1 px-3 py-2 border-t border-b border-outline bg-light-base flex-wrap mx-4"
              >
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-sub-text text-xs"
                >
                  â†©
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-sub-text text-xs"
                >
                  â†ª
                </button>
                <span class="text-outline mx-1">|</span>
                <select
                  class="text-xs border-none bg-transparent text-sub-text focus:outline-none"
                >
                  <option>Format</option>
                  <option>Heading 1</option>
                  <option>Paragraph</option>
                </select>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded font-bold text-xs text-sub-text"
                >
                  B
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded italic text-xs text-sub-text"
                >
                  I
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded underline text-xs text-sub-text"
                >
                  U
                </button>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ðŸ”—
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  âš“
                </button>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â‰¡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â‰¡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â‰¡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â‰¡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â˜°
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  â˜°
                </button>
              </div>
              <textarea
                v-model="docDescription"
                rows="5"
                class="w-full px-4 py-3 text-sm text-sub-text focus:outline-none resize-none"
                placeholder="Deskripsi dokumen..."
              ></textarea>

              <!-- Documents -->
              <div class="px-4 pb-4 border-t border-outline pt-4">
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Documents</label
                >
                <!-- Custom dropup -->
                <div class="relative" ref="docDropdownRef">
                  <button
                    type="button"
                    @click="docDropdownOpen = !docDropdownOpen"
                    class="w-full flex items-center justify-between px-3 py-2 border border-outline rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-sub-text"
                  >
                    <span
                      :class="
                        docFileSource ? 'text-dark-base' : 'text-gray-400'
                      "
                    >
                      {{
                        fileSourceOptions.find((o) => o.value === docFileSource)
                          ?.label || "Select File Source"
                      }}
                    </span>
                    <svg
                      class="w-4 h-4 text-sub-text transition-transform"
                      :class="docDropdownOpen ? 'rotate-180' : ''"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <!-- Dropdown list â€” terbuka ke ATAS -->
                  <ul
                    v-if="docDropdownOpen"
                    class="absolute bottom-full left-0 right-0 mb-1 bg-white border border-outline rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    <li
                      v-for="opt in fileSourceOptions"
                      :key="opt.value"
                      @click="
                        docFileSource = opt.value;
                        docDropdownOpen = false;
                      "
                      class="px-3 py-2 text-sm cursor-pointer hover:bg-light-base"
                      :class="
                        docFileSource === opt.value
                          ? 'text-sub-text font-medium bg-light-base'
                          : 'text-dark-base'
                      "
                    >
                      {{ opt.label }}
                    </li>
                  </ul>
                </div>

                <!-- Local file picker -->
                <div v-if="docFileSource === 'local'" class="mt-3">
                  <label
                    class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-outline rounded-lg cursor-pointer hover:bg-light-base transition-colors"
                  >
                    <div class="flex flex-col items-center gap-1 text-sub-text">
                      <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span class="text-xs font-medium"
                        >Klik untuk pilih file</span
                      >
                      <span class="text-xs text-gray-400"
                        >PDF, DOC, XLS, JPG, PNG</span
                      >
                    </div>
                    <input
                      type="file"
                      multiple
                      class="hidden"
                      @change="handleDocFileChange"
                    />
                  </label>
                  <ul v-if="selectedDocFiles.length" class="mt-2 space-y-1">
                    <li
                      v-for="(file, i) in selectedDocFiles"
                      :key="i"
                      class="flex items-center justify-between text-xs px-3 py-1.5 bg-light-base rounded-lg"
                    >
                      <span class="truncate text-dark-base">{{
                        file.name
                      }}</span>
                      <button
                        type="button"
                        @click="removeDocFile(i)"
                        class="ml-2 text-sub-text hover:text-red-500 shrink-0"
                      >
                        âœ•
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="bg-white flex items-center justify-between px-6 py-4 border-t border-outline shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <button
          type="button"
          @click="handleReset"
          :disabled="props.isSubmitting"
          class="text-sm text-red font-medium hover:underline"
        >
          Reset
        </button>
        <div class="flex gap-3">
          <button
            type="button"
            @click="handleBack"
            :disabled="props.isSubmitting"
            class="px-6 py-2 border border-outline rounded-lg text-sub-text hover:bg-light-base transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSave"
            :disabled="props.isSubmitting"
            class="flex items-center gap-2 px-5 py-2 bg-dark-base text-white rounded-lg hover:bg-dark-hover transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <template v-if="props.isSubmitting">
              <span
                class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              ></span>
              <span>Saving...</span>
            </template>
            <template v-else>
              Save Company
              <ChevronDown :size="16" />
            </template>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Overlay */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
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

/* Slide from right — identik dengan AddContactForm */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
