<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
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
  deal: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit", "back"]);

const store = useStore();
const isFetching = ref(false);

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

const assigneeOptions = computed(() => {
  const users = store.getters["users/allUsers"] || [];
  return [
    { value: "", label: "Select Data" },
    ...users.map((u) => ({
      value: u.name || u.username || u.id,
      label: u.name || u.username || "Unknown",
    })),
  ];
});

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

const pipelineOptions = [
  { value: "", label: "Select Data" },
  { value: "new", label: "New" },
  { value: "qualified", label: "Qualified" },
  { value: "advanced", label: "Advanced" },
  { value: "payment", label: "Payment" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const currencyOptions = [
  { value: "IDR", label: "IDR" },
  { value: "USD", label: "USD" },
  { value: "SGD", label: "SGD" },
  { value: "EUR", label: "EUR" },
];

const ownerOptions = computed(() => {
  const users = store.getters["users/allUsers"] || [];
  return [
    { value: "", label: "Select Owner" },
    ...users.map((u) => ({
      value: u.name || u.username || u.id,
      label: u.name || u.username || "Unknown",
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

const isNonEmptyAssociationValue = (value) => {
  return value !== "" && value !== null && value !== undefined;
};

// Dropdown State for Contacts
const isContactDropdownOpen = ref(false);
const contactSearch = ref("");
const contactDropdownRef = ref(null);

// Dropdown State for Companies
const isCompanyDropdownOpen = ref(false);
const companySearch = ref("");
const companyDropdownRef = ref(null);

const getDealPayloadData = (deal = null) => {
  if (!deal) return null;
  if (Array.isArray(deal.deals) && deal.deals.length > 0) {
    return deal.deals[0];
  }
  return deal;
};

const getAssociationCandidates = (...values) => {
  return values
    .flatMap((value) => {
      if (!isNonEmptyAssociationValue(value)) {
        return [];
      }

      if (Array.isArray(value)) {
        return getAssociationCandidates(...value);
      }

      if (typeof value === "object") {
        return [
          value.id,
          value.id_contact,
          value.id_contacts,
          value.id_company,
          value.id_companies,
          value.id_deal,
          value.id_deals,
          value.contact_id,
          value.contacts_id,
          value.company_id,
          value.companies_id,
          value.userid,
          value.id_user,
          value.value,
          value.contact,
          value.contact_name,
          value.company,
          value.company_name,
          value.name,
          value.label,
          // Handle plural objects if they are arrays
          ...(Array.isArray(value.contacts) ? getAssociationCandidates(value.contacts) : []),
          ...(Array.isArray(value.companies) ? getAssociationCandidates(value.companies) : []),
        ];
      }

      if (typeof value === "string") {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      return [value];
    })
    .filter((candidate) => isNonEmptyAssociationValue(candidate));
};

const resolveAssociationValue = (candidates, options) => {
  if (!Array.isArray(candidates) || !Array.isArray(options)) {
    return "";
  }

  for (const candidate of candidates) {
    const normalizedCandidate = String(candidate).trim().toLowerCase();
    if (!normalizedCandidate) continue;

    const matchedById = options.find((option) => {
      const optionValue = String(option.value ?? option.id ?? "")
        .trim()
        .toLowerCase();
      return optionValue === normalizedCandidate;
    });

    if (matchedById) {
      return matchedById.value ?? matchedById.id;
    }

    const matchedByLabel = options.find((option) => {
      return String(option.label ?? option.name ?? "")
        .trim()
        .toLowerCase() === normalizedCandidate;
    });

    if (matchedByLabel) {
      return matchedByLabel.value ?? matchedByLabel.id;
    }
  }

  return "";
};

const getDisplayNameFromContact = (contact) => {
  if (!contact) return "Unknown";

  return (
    `${contact.first_name || ""} ${contact.last_name || ""}`.trim() ||
    contact.name ||
    contact.email ||
    "Unknown"
  );
};

const contactOptions = computed(() => {
  const contacts = store.getters["contacts/allContacts"] || [];
  return [
    { value: "", label: "Select Contact" },
    ...contacts.map((c) => ({
      value: c.id,
      label: getDisplayNameFromContact(c),
    })),
  ];
});

const companyOptions = computed(() => {
  const companies = store.getters["company/allcompany"] || [];
  return [
    { value: "", label: "Select Company" },
    ...companies.map((c) => ({
      value: c.id,
      label: c.company_name || c.name || "Unknown",
    })),
  ];
});

const filteredContacts = computed(() => {
  if (!contactSearch.value) return contactOptions.value.filter(opt => opt.value !== "");
  return contactOptions.value.filter(
    (c) =>
      c.label?.toLowerCase().includes(contactSearch.value.toLowerCase()) && c.value !== ""
  );
});

const filteredCompanies = computed(() => {
  if (!companySearch.value) return companyOptions.value.filter(opt => opt.value !== "");
  return companyOptions.value.filter(
    (c) =>
      c.label?.toLowerCase().includes(companySearch.value.toLowerCase()) && c.value !== ""
  );
});

const localDealData = ref(null);

const resolveContactAssociationValues = (deal = null) => {
  if (!deal) return [];
  const data = getDealPayloadData(deal);
  const candidates = getAssociationCandidates(
    dealForm.value.contact_association?.length > 0
      ? dealForm.value.contact_association
      : null,
    deal?.contactassoc,
    data?.contactassoc,
    deal?.contacts_id,
    data?.contacts_id,
    deal?.contact_id,
    data?.contact_id,
    deal?.id_contact,
    data?.id_contact,
    deal?.id_contacts,
    data?.id_contacts,
    deal?.contact_association,
    data?.contact_association,
    deal?.dealsassoc,
    data?.dealsassoc,
    deal?.userid,
    data?.userid,
    deal?.id_user,
    data?.id_user,
    deal?.contact,
    data?.contact,
    deal?.contacts,
    data?.contacts,
    deal?.contact_name,
    data?.contact_name,
  );

  return resolveAssociationValues(candidates, contactOptions.value);
};

const resolveCompanyAssociationValues = (deal = null) => {
  if (!deal) return [];
  const data = getDealPayloadData(deal);
  const candidates = getAssociationCandidates(
    dealForm.value.companies_association?.length > 0
      ? dealForm.value.companies_association
      : null,
    deal?.companyassoc,
    data?.companyassoc,
    deal?.companies_id,
    data?.companies_id,
    deal?.company_id,
    data?.company_id,
    deal?.id_company,
    data?.id_company,
    deal?.id_companies,
    data?.id_companies,
    deal?.companies_association,
    data?.companies_association,
    deal?.company,
    data?.company,
    deal?.companies,
    data?.companies,
    deal?.company_name,
    data?.company_name,
    deal?.companies_name,
    data?.companies_name,
  );

  return resolveAssociationValues(candidates, companyOptions.value);
};

const resolveAssociationValues = (candidates, options) => {
  if (!candidates || !Array.isArray(candidates) || !options) return [];

  return candidates
    .map((candidate) => {
      const normalizedCandidate = String(candidate).trim();
      if (!normalizedCandidate) return null;

      const matchedOption = options.find((option) => {
        const optId = String(option.value || "").trim();
        return optId === normalizedCandidate;
      });
      if (matchedOption) return String(matchedOption.value);

      const matchedByLabel = options.find((option) => {
        const label = String(option.label || "").trim().toLowerCase();
        return label === normalizedCandidate.toLowerCase();
      });
      return matchedByLabel ? String(matchedByLabel.value) : null;
    })
    .filter((v) => v !== null && v !== undefined);
};

const toggleContact = (contact) => {
  const contactId = String(contact.value || contact.id).trim();
  const index = dealForm.value.contact_association.findIndex(
    (id) => String(id).trim() === contactId,
  );
  if (index === -1) {
    dealForm.value.contact_association.push(contactId);
  } else {
    dealForm.value.contact_association.splice(index, 1);
  }
};

const isContactSelected = (id) => {
  if (!dealForm.value?.contact_association) return false;
  const normalizedId = String(id).trim();
  return dealForm.value.contact_association.some(
    (assocId) => String(assocId).trim() === normalizedId,
  );
};

const selectedContacts = computed(() => {
  if (!dealForm.value?.contact_association) return [];
  return contactOptions.value.filter((c) => {
    const contactId = String(c.value).trim();
    if (!contactId) return false;
    return dealForm.value.contact_association.some(
      (id) => String(id).trim() === contactId,
    );
  });
});

const toggleCompany = (company) => {
  const companyId = String(company.value || company.id).trim();
  const index = dealForm.value.companies_association.findIndex(
    (id) => String(id).trim() === companyId,
  );
  if (index === -1) {
    dealForm.value.companies_association.push(companyId);
  } else {
    dealForm.value.companies_association.splice(index, 1);
  }
};

const isCompanySelected = (id) => {
  if (!dealForm.value?.companies_association) return false;
  const normalizedId = String(id).trim();
  return dealForm.value.companies_association.some(
    (assocId) => String(assocId).trim() === normalizedId,
  );
};

const selectedCompanies = computed(() => {
  if (!dealForm.value?.companies_association) return [];
  return companyOptions.value.filter((c) => {
    const companyId = String(c.value).trim();
    if (!companyId) return false;
    return dealForm.value.companies_association.some(
      (id) => String(id).trim() === companyId
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
  if (
    companyDropdownRef.value &&
    !companyDropdownRef.value.contains(event.target)
  ) {
    isCompanyDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const resolveUserValue = (candidate, options) => {
  if (!candidate || !options) return "";
  const normalizedCandidate = String(candidate).trim().toLowerCase();

  const match = options.find(
    (opt) =>
      String(opt.value).trim().toLowerCase() === normalizedCandidate ||
      String(opt.label).trim().toLowerCase() === normalizedCandidate,
  );

  return match ? match.value : candidate;
};

const syncAdditionalData = (dealData) => {
  if (!dealData) return;

  // Handle wrapped response format or direct object
  const data = getDealPayloadData(dealData);

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
    taskTime.value = data.task_time.split(".")[0].substring(0, 5);
  } else {
    taskTime.value = "";
  }

  taskPriority.value = data.priority || data.prioritytask || "";
  taskAssociatedContact.value = resolveUserValue(
    data.associated_contact || data.associatedContact,
    contactOptions.value,
  );

  // Docs mapping
  docDescription.value = data.docs || "";
};

const fetchFullDealDetails = async (id) => {
  if (!id) return;
  isFetching.value = true;
  try {
    const data = await store.dispatch("deals/fetchDealById", id);
    if (data) {
      // Handle wrapped response format
      const fullData = getDealPayloadData(data);
      
      // Update local deal data to trigger reactive resolution in watcher
      localDealData.value = { ...localDealData.value, ...fullData };
      
      // Also sync non-form data directly
      syncAdditionalData(fullData);
    }
  } catch (error) {
    console.error("Failed to fetch deal details:", error);
  } finally {
    isFetching.value = false;
  }
};

const sourceOptions = [
  { value: "", label: "Select Data" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social_media", label: "Social Media" },
  { value: "email_campaign", label: "Email Campaign" },
  { value: "cold_call", label: "Cold Call" },
  { value: "other", label: "Other" },
];

// Helper function to normalize pipeline/stage values from DB to Board format
const normalizePipelineValue = (rawValue) => {
  if (!rawValue) return "";
  const val = String(rawValue).toLowerCase();

  // Map database pipeline values to board stage values
  const dbToBoard = {
    negotiation: "advanced",
    proposal: "payment",
    closed_won: "won",
    closed_lost: "lost",
  };

  return dbToBoard[val] || rawValue;
};

// Helper function to convert board stage to database pipeline value for submission
const boardStageToDbPipeline = (boardStage) => {
  if (!boardStage) return "";
  const val = String(boardStage).toLowerCase();

  // Map board stage values to database pipeline values
  const boardToDb = {
    advanced: "negotiation",
    payment: "proposal",
    won: "closed_won",
    lost: "closed_lost",
  };

  return boardToDb[val] || boardStage;
};

// Helper function to normalize date format to yyyy-mm-dd
const normalizeDateValue = (rawDate) => {
  if (!rawDate || rawDate === "-") return "";

  // If already in yyyy-mm-dd format or ISO format
  const isoMatch = String(rawDate).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  // Try to parse as Date object
  try {
    const date = new Date(rawDate);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    // ignore
  }

  return "";
};

// Helper function to normalize amount/value
const normalizeAmountValue = (rawAmount) => {
  if (!rawAmount || rawAmount === "-") return "";

  // Remove any non-numeric characters except dot and minus
  const cleaned = String(rawAmount).replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleaned);

  return !isNaN(parsed) ? parsed : "";
};

const getDealFormDefaults = (deal = null) => {
  const data = getDealPayloadData(deal);

  return {
    deal_name: data?.deal_name || data?.dealName || data?.name || "",
    pipeline: normalizePipelineValue(data?.pipeline || data?.stage || ""),
    currency: data?.currency || "IDR",
    amount: normalizeAmountValue(
      data?.amount || data?.amount_value || data?.jumlah || "",
    ),
    expected_close_date: normalizeDateValue(
      data?.expected_close_date ||
        data?.expectedCloseDate ||
        data?.tertanggal ||
        "",
    ),
    owner: data?.owner || data?.owner_name || "",
    priority: data?.priority || "",
    source: data?.source || "",
    description: data?.description || "",
    contact_association: resolveContactAssociationValues(deal),
    companies_association: resolveCompanyAssociationValues(deal),
  };
};

const dealForm = ref({
  deal_name: "",
  pipeline: "",
  currency: "IDR",
  amount: "",
  expected_close_date: "",
  owner: "",
  priority: "",
  source: "",
  description: "",
  contact_association: [],
  companies_association: [],
});

const loadReferenceData = async () => {
  const requests = [];

  if (!store.getters["users/usersignin"]) {
    requests.push(store.dispatch("users/getusersignin").catch(() => null));
  }

  if ((store.getters["users/allUsers"] || []).length === 0) {
    requests.push(store.dispatch("users/fetchAllusers").catch(() => null));
  }

  if ((store.getters["contacts/allContacts"] || []).length === 0) {
    requests.push(
      store.dispatch("contacts/fetchAllContacts").catch(() => null),
    );
  }

  if ((store.getters["company/allcompany"] || []).length === 0) {
    requests.push(store.dispatch("company/fetchAllcompany").catch(() => null));
  }

  if (requests.length > 0) {
    await Promise.allSettled(requests);
  }
};

watch(
  currentUserName,
  (name) => {
    if (name) {
      if (!dealForm.value.owner) {
        dealForm.value.owner = name;
      }
      if (!taskAssignee.value) {
        taskAssignee.value = resolveUserValue(name, assigneeOptions.value);
      }
    }
  },
  { immediate: true },
);

watch(
  () => props.deal,
  (newDeal) => {
    if (newDeal) {
      localDealData.value = { ...newDeal };
      if (newDeal.id) {
        fetchFullDealDetails(newDeal.id);
      }
    }
  },
  { immediate: true },
);

watch(
  [localDealData, contactOptions, companyOptions],
  ([deal]) => {
    if (deal) {
      // Only initialize dealForm if it's a new deal ID or currently empty
      if (!dealForm.value.deal_name) {
        dealForm.value = getDealFormDefaults(deal);
      } else {
        // Only update associations reactively as they might load later
        dealForm.value.contact_association = resolveContactAssociationValues(deal);
        dealForm.value.companies_association = resolveCompanyAssociationValues(deal);
      }
      
      syncAdditionalData(deal);
    }
  }
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadReferenceData();
      if (props.deal?.id) {
        fetchFullDealDetails(props.deal.id);
      }
    }
  },
  { immediate: true },
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
  // Convert board stage values to database pipeline values before submitting
  const dealDataForSubmit = {
    ...dealForm.value,
    pipeline: boardStageToDbPipeline(dealForm.value.pipeline),
    stage: boardStageToDbPipeline(dealForm.value.pipeline),
    // Standardize naming and format for backend flattened update (mirroring Company module)
    contactassoc: (dealForm.value.contact_association || []).join(","),
    companyassoc: (dealForm.value.companies_association || []).join(","),
    contacts_id: (dealForm.value.contact_association || [])[0] || "",
    companies_id: (dealForm.value.companies_association || [])[0] || "",
  };

  emit("submit", {
    deal: dealDataForSubmit,
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
  dealForm.value = getDealFormDefaults(props.deal);
  noteContent.value = "";
  taskName.value = "";
  taskContent.value = "";
  taskStatus.value = "";
  taskAssignee.value = "";
  taskDueDate.value = "";
  taskTime.value = "";
  taskPriority.value = "";
  taskAssociatedContact.value = "";
  docDescription.value = "";
  docFileSource.value = "";
  selectedDocFiles.value = [];
};
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
          {{ props.deal ? "Deal Details" : "Add Deal / Details" }}
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
            <h3 class="text-sm font-semibold text-dark-base">Deal Info</h3>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Deal Name</label
                >
                <input
                  v-model="dealForm.deal_name"
                  type="text"
                  placeholder="Ex Partner Deal"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Pipeline</label
                >
                <select
                  v-model="dealForm.pipeline"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
                >
                  <option
                    v-for="opt in pipelineOptions"
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
                  >Currency</label
                >
                <select
                  v-model="dealForm.currency"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
                >
                  <option
                    v-for="opt in currencyOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Amount / Value</label
                >
                <input
                  v-model="dealForm.amount"
                  type="number"
                  placeholder="Amount/Value"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Expected Close Date</label
                >
                <input
                  v-model="dealForm.expected_close_date"
                  type="date"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Owner</label
                >
                <select
                  v-model="dealForm.owner"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
                >
                  <option
                    v-for="opt in ownerOptions"
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
                  >Priority</label
                >
                <select
                  v-model="dealForm.priority"
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
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Source</label
                >
                <select
                  v-model="dealForm.source"
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

            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Description</label
              >
              <textarea
                v-model="dealForm.description"
                rows="3"
                placeholder="Ex Lorem ipsum dolor sit"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm resize-none"
              ></textarea>
            </div>

            <!-- Contact Association -->
            <div class="relative" ref="contactDropdownRef">
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Contact Association</label
              >
              <div
                @click.stop="isContactDropdownOpen = !isContactDropdownOpen"
                class="w-full px-3 py-2 border border-outline rounded-lg flex flex-wrap gap-2 items-center cursor-pointer min-h-10.5 bg-white transition focus-within:ring-1 focus-within:ring-sub-text"
              >
                <div
                  v-if="dealForm.contact_association.length === 0"
                  class="text-gray-400 text-sm"
                >
                  Search and select contacts
                </div>
                <div
                  v-for="contact in selectedContacts"
                  :key="contact.value"
                  class="flex items-center gap-1 bg-light-base px-2 py-1 rounded text-xs font-medium text-dark-base border border-outline"
                  @click.stop
                >
                  {{ contact.label }}
                  <X
                    :size="12"
                    class="cursor-pointer hover:text-red-500"
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
                    :key="contact.value"
                    @click="toggleContact(contact)"
                    class="px-4 py-2 hover:bg-light-base cursor-pointer flex items-center justify-between text-sm transition"
                  >
                    <div class="flex flex-col">
                      <span class="font-medium text-dark-base">{{ contact.label }}</span>
                    </div>
                    <div
                      v-if="isContactSelected(contact.value)"
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

            <!-- Company Association -->
            <div class="relative" ref="companyDropdownRef">
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Companies Association</label
              >
              <div
                @click.stop="isCompanyDropdownOpen = !isCompanyDropdownOpen"
                class="w-full px-3 py-2 border border-outline rounded-lg flex flex-wrap gap-2 items-center cursor-pointer min-h-10.5 bg-white transition focus-within:ring-1 focus-within:ring-sub-text"
              >
                <div
                  v-if="dealForm.companies_association.length === 0"
                  class="text-gray-400 text-sm"
                >
                  Search and select companies
                </div>
                <div
                  v-for="company in selectedCompanies"
                  :key="company.value"
                  class="flex items-center gap-1 bg-light-base px-2 py-1 rounded text-xs font-medium text-dark-base border border-outline"
                  @click.stop
                >
                  {{ company.label }}
                  <X
                    :size="12"
                    class="cursor-pointer hover:text-red-500"
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
                      placeholder="Search deals"
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
                    <div class="flex flex-col">
                      <span class="font-medium text-dark-base">{{ company.label }}</span>
                    </div>
                    <div
                      v-if="isCompanySelected(company.value)"
                      class="w-5 h-5 bg-dark-base rounded-full flex items-center justify-center"
                    >
                      <Check :size="12" class="text-white" />
                    </div>
                  </div>
                  <div
                    v-if="filteredCompanies.length === 0"
                    class="px-4 py-6 text-center text-sm text-sub-text"
                  >
                    No companies found
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
                  ⚓
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
                    ⚓
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
                  ⚓
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
                  <!-- Dropdown list — terbuka ke ATAS -->
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
            class="px-4 py-2 text-sm font-medium text-sub-text hover:text-dark-base transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            @click="handleSave"
            :disabled="props.isSubmitting"
            class="px-6 py-2 bg-dark-base hover:bg-dark-base/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ props.isSubmitting ? "Saving..." : "Save" }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
