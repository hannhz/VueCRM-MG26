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
  Loader2,
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
  contact: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit", "back"]);
const store = useStore();
const { statuses, fetchStatuses } = useStatuses();

const isFetching = ref(false);

const companyOptions = computed(() => {
  const companies = store.getters["company/allcompany"] || [];
  return [
    { value: "", label: "Select Company" },
    ...companies.map((company) => ({
      value: company.id,
      label: company.company_name || company.name || "Unknown",
    })),
  ];
});

const dealOptions = computed(() => {
  const deals = store.getters["deals/allDeals"] || [];
  return [
    { value: "", label: "Select Deal" },
    ...deals.map((deal) => ({
      value: deal.id,
      label: deal.deal_name || deal.name || "Unknown",
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

const getDisplayNameFromCompany = (company) => {
  if (!company) return "Unknown";
  return company.company_name || company.name || "Unknown";
};

const associatedWithOptions = computed(() => {
  const users = store.getters["users/allUsers"] || [];
  return [
    { value: "", label: "Select User" },
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

const fetchAssociationOptions = async () => {
  await Promise.allSettled([
    store.dispatch("users/getusersignin"),
    store.dispatch("users/fetchAllusers"),
    store.dispatch("company/fetchAllcompany"),
    store.dispatch("deals/fetchAllDeals"),
    fetchStatuses(),
  ]);
};

// Section toggles
const showNotes = ref(true);
const showTasks = ref(true);
const showDocs = ref(true);

// Notes
const noteContent = ref(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
);

// Tasks
const taskName = ref("");
const taskContent = ref(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
);
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

const priorityOptions = [
  { value: "", label: "Select Data" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

// Docs
const docDescription = ref(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
);
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
          option.name ?? option.deal_name ?? option.company_name ?? option.label ?? "",
        )
          .trim()
          .toLowerCase();
        return label === normalizedCandidate.toLowerCase();
      });
      return matchedByLabel ? matchedByLabel.id || matchedByLabel.label || matchedByLabel.value : null;
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

const getContactFormDefaults = (contact = null) => {
  // Extract actual contact data if it's wrapped in the response format
  const data = (contact && contact.contacts && contact.contacts.length > 0) 
    ? contact.contacts[0] 
    : contact;

  const companyCandidates = getAssociationCandidates(
    data?.companyassoc ||
      contact?.companyassoc || // Check root of full response
      data?.companiesAssociation ||
      data?.company_id ||
      data?.companies_id ||
      data?.company ||
      data?.company_name,
  );

  const dealsCandidates = getAssociationCandidates(
    data?.dealsassoc ||
      contact?.dealsassoc || // Check root of full response
      data?.dealsAssociation ||
      data?.deal_id ||
      data?.deals_id ||
      data?.deal ||
      data?.deal_name,
  );

  return {
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    job_title: data?.job_title || "",
    owner: data?.owner || currentUserName.value || "",
    email: data?.email || "",
    status: (() => {
      const statusValue = data?.status || "";
      // Try to find by ID first (if it's a number)
      if (!isNaN(statusValue)) {
        return parseInt(statusValue);
      }
      // If it's a string, try to find matching status by name
      const match = statuses.value.find(s => s.name.toLowerCase() === String(statusValue).toLowerCase());
      return match ? match.id : "";
    })(),
    type: (() => {
      const typeValue = data?.type || "";
      // Try to find by ID first (if it's a number)
      if (!isNaN(typeValue)) {
        return parseInt(typeValue);
      }
      // If it's a string, try to find matching status by name
      const match = statuses.value.find(s => s.name.toLowerCase() === String(typeValue).toLowerCase());
      return match ? match.id : "";
    })(),
    telephone_1: data?.telephone_1 || "",
    telephone_2: data?.telephone_2 || "",
    address: data?.address || "",
    city: data?.city || "",
    province: data?.province || "",
    country: data?.country || "",
    pos_code: data?.pos_code || data?.posCode || "",
    source: data?.source || "",
    companyassoc: companyCandidates,
    dealsassoc: dealsCandidates,
  };
};

const contactForm = ref(getContactFormDefaults());

const syncAssociationValues = (contactData = props.contact) => {
  if (!contactData) return;

  // Handle wrapped response format or direct object
  const data = (contactData && contactData.contacts && contactData.contacts.length > 0) 
    ? contactData.contacts[0] 
    : contactData;

  const dealsCandidates = getAssociationCandidates(
    contactForm.value.dealsassoc.length > 0
      ? contactForm.value.dealsassoc
      : contactData?.dealsassoc || // Check wrapper/full response
          data?.dealsassoc ||
          data?.dealsAssociation ||
          data?.deal_id ||
          data?.deals_id ||
          data?.deal ||
          data?.deal_name,
  );

  const resolvedDeals = resolveAssociationValues(
    dealsCandidates,
    dealOptions.value,
  );
  if (resolvedDeals.length > 0) {
    contactForm.value.dealsassoc = resolvedDeals;
  } else if (dealsCandidates.length > 0) {
    contactForm.value.dealsassoc = dealsCandidates;
  }

  const companyCandidates = getAssociationCandidates(
    contactForm.value.companyassoc.length > 0
      ? contactForm.value.companyassoc
      : contactData?.companyassoc || // Check wrapper/full response
          data?.companyassoc ||
          data?.companiesAssociation ||
          data?.company_id ||
          data?.companies_id ||
          data?.company ||
          data?.company_name,
  );

  const resolvedCompanies = resolveAssociationValues(
    companyCandidates,
    companyOptions.value,
  );
  if (resolvedCompanies.length > 0) {
    contactForm.value.companyassoc = resolvedCompanies;
  } else if (companyCandidates.length > 0) {
    contactForm.value.companyassoc = companyCandidates;
  }
};

const syncAdditionalData = (contactData) => {
  if (!contactData) return;

  // Handle wrapped response format or direct object
  const data = (contactData && contactData.contacts && contactData.contacts.length > 0) 
    ? contactData.contacts[0] 
    : contactData;

  // Notes mapping
  noteContent.value = data.notes || "";

  // Tasks mapping
  taskName.value = data.task_name || "";
  taskContent.value = data.desktask || data.task_content || "";
  taskStatus.value = data.status || data.statustask || "";
  taskAssignee.value = resolveUserValue(data.assignee, assigneeOptions.value);
  taskDueDate.value = data.due_date || "";
  
  // Format task_time: HH:mm:ss.SSSSSSS -> HH:mm
  if (data.task_time) {
    taskTime.value = data.task_time.split('.')[0].substring(0, 5);
  } else {
    taskTime.value = "";
  }
  
  taskPriority.value = data.priority || data.prioritytask || "";
  taskAssociatedContact.value = resolveUserValue(data.associated_contact || data.associatedContact, associatedWithOptions.value);

  // Docs mapping
  docDescription.value = data.docs || "";
};

const fetchFullContactDetails = async (id) => {
  if (!id) return;
  isFetching.value = true;
  try {
    const data = await store.dispatch("contacts/fetchContactById", id);
    if (data) {
      contactForm.value = getContactFormDefaults(data);
      syncAssociationValues(data);
      syncAdditionalData(data);
    }
  } catch (error) {
    console.error("Failed to fetch contact details:", error);
  } finally {
    isFetching.value = false;
  }
};

watch(
  () => props.contact,
  (contact) => {
    if (contact && contact.id) {
      // First populate with available prop data
      contactForm.value = getContactFormDefaults(contact);
      syncAssociationValues(contact);
      syncAdditionalData(contact);
      
      // Then fetch full details from server
      fetchFullContactDetails(contact.id);
    }
  },
  { immediate: true },
);

watch(
  [companyOptions, dealOptions, associatedWithOptions, assigneeOptions],
  () => {
    syncAssociationValues();
    syncAdditionalData(props.contact);
  },
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      fetchAssociationOptions();
      if (props.contact?.id) {
        fetchFullContactDetails(props.contact.id);
      }
    }
  },
);

// Dropdown State for Companies
const isCompanyDropdownOpen = ref(false);
const companySearch = ref("");
const companyDropdownRef = ref(null);

const filteredCompanies = computed(() => {
  if (!companySearch.value) return companyOptions.value.filter(opt => opt.value !== "");
  return companyOptions.value
    .filter(opt => opt.value !== "")
    .filter((c) =>
      c.label.toLowerCase().includes(companySearch.value.toLowerCase())
    );
});

// Dropdown State for Deals
const isDealDropdownOpen = ref(false);
const dealSearch = ref("");
const dealDropdownRef = ref(null);

const filteredDeals = computed(() => {
  if (!dealSearch.value) return dealOptions.value.filter(opt => opt.value !== "");
  return dealOptions.value
    .filter(opt => opt.value !== "")
    .filter((d) =>
      d.label.toLowerCase().includes(dealSearch.value.toLowerCase())
    );
});

const toggleCompany = (company) => {
  const companyId = String(company.value || company.id).trim();
  const index = contactForm.value.companyassoc.findIndex(
    (id) => String(id).trim() === companyId,
  );
  if (index === -1) {
    contactForm.value.companyassoc.push(companyId);
  } else {
    contactForm.value.companyassoc.splice(index, 1);
  }
};

const isCompanySelected = (id) => {
  const normalizedId = String(id).trim();
  return contactForm.value.companyassoc.some(
    (assocId) => String(assocId).trim() === normalizedId,
  );
};

const selectedCompaniesList = computed(() => {
  return companyOptions.value.filter((c) => {
    const companyId = String(c.value || c.id).trim();
    if (!companyId) return false;
    return contactForm.value.companyassoc.some(
      (id) => String(id).trim() === companyId,
    );
  });
});

const toggleDeal = (deal) => {
  const dealId = String(deal.value || deal.id).trim();
  const index = contactForm.value.dealsassoc.findIndex(
    (id) => String(id).trim() === dealId,
  );
  if (index === -1) {
    contactForm.value.dealsassoc.push(dealId);
  } else {
    contactForm.value.dealsassoc.splice(index, 1);
  }
};

const isDealSelected = (id) => {
  const normalizedId = String(id).trim();
  return contactForm.value.dealsassoc.some(
    (assocId) => String(assocId).trim() === normalizedId,
  );
};

const selectedDealsList = computed(() => {
  return dealOptions.value.filter((d) => {
    const dealId = String(d.value || d.id).trim();
    if (!dealId) return false;
    return contactForm.value.dealsassoc.some(
      (id) => String(id).trim() === dealId,
    );
  });
});

const handleClickOutside = (event) => {
  if (
    companyDropdownRef.value &&
    !companyDropdownRef.value.contains(event.target)
  ) {
    isCompanyDropdownOpen.value = false;
  }
  if (dealDropdownRef.value && !dealDropdownRef.value.contains(event.target)) {
    isDealDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

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
    ...contactForm.value,
    id: props.contact?.id,
    type: contactForm.value.type || "",
    status: contactForm.value.status || "",
    companyassoc: (contactForm.value.companyassoc || []).join(","),
    dealsassoc: (contactForm.value.dealsassoc || []).join(","),
  };

  emit("submit", {
    contact: submissionData,
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
  contactForm.value = getContactFormDefaults(props.contact);
  syncAssociationValues(props.contact);
  syncAdditionalData(props.contact);
  noteContent.value = "";
  taskName.value = "";
  taskContent.value = "";
  docFileSource.value = "";
  selectedDocFiles.value = [];
};

watch(
  currentUserName,
  (name) => {
    if (name) {
      if (!contactForm.value.owner) {
        contactForm.value.owner = name;
      }
      if (!taskAssignee.value) {
        taskAssignee.value = resolveUserValue(name, assigneeOptions.value);
      }
    }
  },
  { immediate: true },
);

onMounted(() => {
  fetchAssociationOptions();
});
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
          {{ props.contact ? "Contact Details" : "Add Contact / Details" }}
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
      <div class="flex-1 overflow-y-auto min-h-0 relative">
        <!-- Loading Overlay -->
        <div 
          v-if="isFetching" 
          class="absolute inset-0 bg-white/60 z-20 flex items-center justify-center pointer-events-none"
        >
          <div class="flex flex-col items-center gap-2">
            <Loader2 class="w-8 h-8 animate-spin text-sub-text" />
            <span class="text-sm font-medium text-sub-text">Loading details...</span>
          </div>
        </div>

        <div class="p-6 pb-10 space-y-6">
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-dark-base">Contact Info</h3>

            <!-- First Name & Last Name -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >First Name</label
                >
                <input
                  v-model="contactForm.first_name"
                  type="text"
                  placeholder="First Name"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Last Name</label
                >
                <input
                  v-model="contactForm.last_name"
                  type="text"
                  placeholder="Last Name"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
            </div>

            <!-- Job Title & Owner -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Job Title</label
                >
                <input
                  v-model="contactForm.job_title"
                  type="text"
                  placeholder="Job Title"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Owner</label
                >
                <div class="relative">
                  <select
                    v-model="contactForm.owner"
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

            <!-- Email & Status -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Email</label
                >
                <input
                  v-model="contactForm.email"
                  type="email"
                  placeholder="youremail@gmail.com"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Status</label
                >
                <div class="relative">
                  <select
                    v-model.number="contactForm.status"
                    class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled selected>Select Status</option>
                    <option
                      v-for="status in (statuses || [])"
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

            <!-- Type -->
            <div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Type</label
                >
                <div class="relative">
                  <select
                    v-model.number="contactForm.type"
                    class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled selected>Select Type</option>
                    <option
                      v-for="status in (statuses || [])"
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

            <!-- Telephone 1 & Telephone 2 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Telephone 1</label
                >
                <input
                  v-model="contactForm.telephone_1"
                  type="text"
                  placeholder="Telephone 1"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Telephone 2</label
                >
                <input
                  v-model="contactForm.telephone_2"
                  type="text"
                  placeholder="Telephone 2"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
            </div>

            <!-- Address & City -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Address</label
                >
                <input
                  v-model="contactForm.address"
                  type="text"
                  placeholder="Address"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >City</label
                >
                <input
                  v-model="contactForm.city"
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
                  v-model="contactForm.province"
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
                  v-model="contactForm.country"
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
                  v-model="contactForm.pos_code"
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
                    v-model="contactForm.source"
                    class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                  >
                    <option
                      v-for="option in sourceOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                  <ChevronDown
                    :size="16"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <!-- Companies Association -->
            <div class="relative" ref="companyDropdownRef">
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Companies Association</label
              >
              <div
                @click="isCompanyDropdownOpen = !isCompanyDropdownOpen"
                class="w-full px-3 py-2 border border-outline rounded-lg flex flex-wrap gap-2 items-center cursor-pointer min-h-10.5 bg-white transition focus-within:ring-1 focus-within:ring-sub-text"
              >
                <div
                  v-if="contactForm.companyassoc.length === 0"
                  class="text-gray-400 text-sm"
                >
                  Search and select companies
                </div>
                <div
                  v-for="company in selectedCompaniesList"
                  :key="company.value"
                  class="flex items-center gap-1 bg-light-base px-2 py-1 rounded text-xs font-medium text-dark-base border border-outline"
                  @click.stop
                >
                  {{ company.label }}
                  <X
                    :size="12"
                    class="cursor-pointer hover:text-red"
                    @click="toggleCompany(company)"
                  />
                </div>
                <ChevronDown :size="16" class="ml-auto text-sub-text" />
              </div>

              <!-- Dropdown Menu -->
              <div
                v-if="isCompanyDropdownOpen"
                class="absolute z-50 w-full mt-1 bg-white border border-outline rounded-lg shadow-xl flex flex-col max-h-64"
              >
                <div class="p-2 border-b border-outline">
                  <div class="relative">
                    <Search
                      :size="14"
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-sub-text"
                    />
                    <input
                      v-model="companySearch"
                      type="text"
                      placeholder="Search by company name"
                      class="w-full pl-9 pr-3 py-2 bg-light-base/50 border border-outline rounded text-sm focus:outline-none focus:ring-1 focus:ring-sub-text"
                      @click.stop
                    />
                  </div>
                </div>
                <div class="flex-1 overflow-y-auto py-1">
                  <div
                    v-for="company in filteredCompanies"
                    :key="company.value"
                    @click="toggleCompany(company)"
                    class="px-4 py-2 hover:bg-light-base cursor-pointer flex items-center justify-between text-sm transition"
                  >
                    <span class="font-medium text-dark-base">{{ company.label }}</span>
                    <div
                      v-if="isCompanySelected(company.value)"
                      class="w-5 h-5 bg-dark-base rounded-full flex items-center justify-center"
                    >
                      <Check :size="12" class="text-white" />
                    </div>
                  </div>
                  <div
                    v-if="filteredCompanies.length === 0"
                    class="px-4 py-3 text-center text-sm text-sub-text italic"
                  >
                    No companies found
                  </div>
                </div>
              </div>
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
                  v-if="contactForm.dealsassoc.length === 0"
                  class="text-gray-400 text-sm"
                >
                  Search and select deals
                </div>
                <div
                  v-for="deal in selectedDealsList"
                  :key="deal.value"
                  class="flex items-center gap-1 bg-light-base px-2 py-1 rounded text-xs font-medium text-dark-base border border-outline"
                  @click.stop
                >
                  {{ deal.label }}
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
                      placeholder="Search by deal name"
                      class="w-full pl-9 pr-3 py-2 bg-light-base/50 border border-outline rounded text-sm focus:outline-none focus:ring-1 focus:ring-sub-text"
                      @click.stop
                    />
                  </div>
                </div>
                <div class="flex-1 overflow-y-auto py-1">
                  <div
                    v-for="deal in filteredDeals"
                    :key="deal.value"
                    @click="toggleDeal(deal)"
                    class="px-4 py-2 hover:bg-light-base cursor-pointer flex items-center justify-between text-sm transition"
                  >
                    <span class="font-medium text-dark-base">{{ deal.label }}</span>
                    <div
                      v-if="isDealSelected(deal.value)"
                      class="w-5 h-5 bg-dark-base rounded-full flex items-center justify-center"
                    >
                      <Check :size="12" class="text-white" />
                    </div>
                  </div>
                  <div
                    v-if="filteredDeals.length === 0"
                    class="px-4 py-3 text-center text-sm text-sub-text italic"
                  >
                    No deals found
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
                  ↩
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-sub-text text-xs"
                >
                  ↪
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
                  🔗
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ⚡
                </button>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ☰
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ☰
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
                    ↩
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-sub-text text-xs"
                  >
                    ↪
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
                    🔗
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    ⚡
                  </button>
                  <span class="text-outline mx-1">|</span>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    ≡
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    ≡
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    ≡
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    ≡
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    ☰
                  </button>
                  <button
                    type="button"
                    class="p-1 hover:bg-white rounded text-xs text-sub-text"
                  >
                    ☰
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
                  ↩
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-sub-text text-xs"
                >
                  ↪
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
                  🔗
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ⚡
                </button>
                <span class="text-outline mx-1">|</span>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ≡
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ☰
                </button>
                <button
                  type="button"
                  class="p-1 hover:bg-white rounded text-xs text-sub-text"
                >
                  ☰
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
                  <!-- Dropdown list – terbuka ke ATAS -->
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
                        ✕
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
              Save Contact
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

/* Slide */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
