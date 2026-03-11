<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useStore } from "vuex";
import {
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  MapPin,
  Camera,
  Mic,
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
    ...users.map((user) => ({
      value: user.name || user.username || user.id,
      label: user.name || user.username || "Unknown",
    })),
  ];
});

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

const associatedWithOptions = computed(() => {
  const contacts = store.getters["contacts/allContacts"] || [];
  return [
    { value: "", label: "Select Contact" },
    ...contacts.map((contact) => ({
      value: contact.id,
      label:
        `${contact.first_name || ""} ${contact.last_name || ""}`.trim() ||
        contact.name ||
        contact.email ||
        "Unknown",
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

const statusContactOptions = [
  { value: "", label: "Select Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const fetchReferenceData = async () => {
  await Promise.allSettled([
    store.dispatch("users/fetchAllusers"),
    store.dispatch("users/getusersignin"),
    store.dispatch("contacts/fetchAllContacts"),
    store.dispatch("company/fetchAllcompany"),
    store.dispatch("deals/fetchAllDeals"),
  ]);
};

const getAssociationCandidate = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) {
      const firstValue = value.find(
        (item) => item !== "" && item !== null && item !== undefined,
      );
      if (firstValue !== undefined) {
        return firstValue;
      }
      continue;
    }

    if (value !== "" && value !== null && value !== undefined) {
      return value;
    }
  }

  return "";
};

const resolveAssociationValue = (candidate, options) => {
  if (candidate === "" || candidate === null || candidate === undefined) {
    return "";
  }

  const normalizedCandidate = String(candidate).trim();
  const matchedOption = options.find(
    (option) => String(option.value) === normalizedCandidate,
  );

  if (matchedOption) {
    return matchedOption.value;
  }

  const matchedByLabel = options.find(
    (option) => option.label === normalizedCandidate,
  );

  return matchedByLabel?.value || candidate;
};

const getContactFormDefaults = (contact = null) => ({
  first_name: contact?.first_name || "",
  last_name: contact?.last_name || "",
  job_title: contact?.job_title || "",
  owner: contact?.owner || "",
  email: contact?.email || "",
  status: contact?.status || "",
  telephone_1: contact?.telephone_1 || "",
  telephone_2: contact?.telephone_2 || "",
  address: contact?.address || "",
  city: contact?.city || "",
  province: contact?.province || "",
  country: contact?.country || "",
  pos_code: contact?.pos_code || contact?.posCode || "",
  source: contact?.source || "",
  companiesAssociation: getAssociationCandidate(
    contact?.companyassoc,
    contact?.companiesAssociation,
    contact?.company_id,
    contact?.companies_id,
    contact?.company,
  ),
  dealsAssociation: getAssociationCandidate(
    contact?.dealsassoc,
    contact?.dealsAssociation,
    contact?.deal_id,
    contact?.deals_id,
    contact?.deal,
  ),
});

const contactForm = ref(getContactFormDefaults());

const syncContactAssociations = (contact = props.contact) => {
  contactForm.value.companiesAssociation = resolveAssociationValue(
    getAssociationCandidate(
      contactForm.value.companiesAssociation,
      contact?.companyassoc,
      contact?.companiesAssociation,
      contact?.company_id,
      contact?.companies_id,
      contact?.company,
    ),
    companyOptions.value,
  );

  contactForm.value.dealsAssociation = resolveAssociationValue(
    getAssociationCandidate(
      contactForm.value.dealsAssociation,
      contact?.dealsassoc,
      contact?.dealsAssociation,
      contact?.deal_id,
      contact?.deals_id,
      contact?.deal,
    ),
    dealOptions.value,
  );
};

const syncTaskAssociatedContact = (contact = props.contact) => {
  taskAssociatedContact.value = resolveAssociationValue(
    getAssociationCandidate(
      taskAssociatedContact.value,
      contact?.id,
      contact?.contact_id,
      contact?.contacts_id,
    ),
    associatedWithOptions.value,
  );
};

watch(
  () => props.contact,
  (contact) => {
    contactForm.value = getContactFormDefaults(contact);
    syncContactAssociations(contact);
    syncTaskAssociatedContact(contact);
  },
  { immediate: true },
);

watch([companyOptions, dealOptions, associatedWithOptions], () => {
  syncContactAssociations();
  syncTaskAssociatedContact();
});

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
  const contactPayload = {
    ...contactForm.value,
    companyassoc: contactForm.value.companiesAssociation
      ? [contactForm.value.companiesAssociation]
      : [],
    dealsassoc: contactForm.value.dealsAssociation
      ? [contactForm.value.dealsAssociation]
      : [],
  };

  emit("submit", {
    contact: contactPayload,
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
  noteContent.value = "";
  taskName.value = "";
  taskContent.value = "";
  taskStatus.value = "";
  taskAssignee.value = "";
  taskDueDate.value = "";
  taskTime.value = "";
  taskPriority.value = "";
  syncTaskAssociatedContact(props.contact);
  docDescription.value = "";
  docFileSource.value = "";
  selectedDocFiles.value = [];
};

onMounted(() => {
  fetchReferenceData();
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
      <div class="flex-1 overflow-y-auto min-h-0">
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
                <input
                  v-model="contactForm.status"
                  type="text"
                  placeholder="Status"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                />
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
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Companies Association</label
              >
              <div class="relative">
                <select
                  v-model="contactForm.companiesAssociation"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option
                    v-for="opt in companyOptions"
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

            <!-- Deals Association -->
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Deals Association</label
              >
              <div class="relative">
                <select
                  v-model="contactForm.dealsAssociation"
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

              <div class="px-4 pb-4">
                <label class="block text-sm font-medium text-dark-base mb-2"
                  >Associated with</label
                >
                <select
                  v-model="taskAssociatedContact"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
                >
                  <option
                    v-for="opt in associatedWithOptions"
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
