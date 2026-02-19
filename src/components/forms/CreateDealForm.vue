<script setup>
import { ref } from 'vue';
import { X, Plus, ChevronDown, Paperclip } from 'lucide-vue-next';
import ContactDetailForm from './DetailForm.vue';
import AddCompanyForm from './AddCompanyForm.vue';
import AddContactQuickForm from './AddContactQuickForm.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const pipelineOptions = [
  { value: '', label: 'Select Data' },
  { value: 'new', label: 'New' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
];

const currencyOptions = [
  { value: 'IDR', label: 'IDR' },
  { value: 'USD', label: 'USD' },
  { value: 'SGD', label: 'SGD' },
  { value: 'EUR', label: 'EUR' },
];

const ownerOptions = [
  { value: '', label: 'Select Owner' },
  { value: 'thomas', label: 'Thomas Anree' },
  { value: 'alex', label: 'Alex Graham' },
  { value: 'sarah', label: 'Sarah Jenkins' },
];

const priorityOptions = [
  { value: '', label: 'Select Data' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const sourceOptions = [
  { value: '', label: 'Select Data' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'email_campaign', label: 'Email Campaign' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'other', label: 'Other' },
];

const showOptional = ref(false);
const showDetailForm = ref(false);
const showAddCompanyForm = ref(false);
const showAddContactQuickForm = ref(false);

// Documents dropdown
const docSourceOptions = [
  { value: '', label: 'Select File Source' },
  { value: 'local', label: 'Local File' },
  { value: 'google_drive', label: 'Google Drive' },
  { value: 'dropbox', label: 'Dropbox' },
  { value: 'onedrive', label: 'OneDrive' },
];
const selectedDocSource = ref('');
const isDocDropdownOpen = ref(false);

const selectDocSource = (value) => {
  selectedDocSource.value = value;
  isDocDropdownOpen.value = false;
  if (value !== 'local') {
    formData.value.documents = null;
  }
};

const formData = ref({
  dealName: '',
  pipeline: '',
  currency: 'IDR',
  amount: '',
  expectedCloseDate: '',
  owner: '',
  priority: '',
  source: '',
  description: '',
  documents: null,
  contactAssociation: '',
  companiesAssociation: '',
});

const handleFileChange = (e) => {
  formData.value.documents = e.target.files[0] ?? null;
};

const handleClose = () => emit('close');

const handleSubmit = () => {
  emit('submit', formData.value);
  handleClose();
};

const handleReset = () => {
  formData.value = {
    dealName: '',
    pipeline: '',
    currency: 'IDR',
    amount: '',
    expectedCloseDate: '',
    owner: '',
    priority: '',
    source: '',
    description: '',
    documents: null,
    contactAssociation: '',
    companiesAssociation: '',
  };
  showOptional.value = false;
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
      <div class="sticky top-0 bg-white border-b border-outline px-6 py-4 flex items-center justify-between z-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
        <h2 class="text-xl font-bold text-dark-base">Create Deal</h2>
        <button
          @click="handleClose"
          class="p-2 hover:bg-light-base rounded-lg transition-colors"
        >
          <X :size="20" class="text-sub-text" />
        </button>
      </div>

      <!-- Form Content (Scrollable) -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">

          <!-- Deal Name & Pipeline -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">Deal Name</label>
              <input
                v-model="formData.dealName"
                type="text"
                placeholder="Deal's Name"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">Pipeline</label>
              <div class="relative">
                <select
                  v-model="formData.pipeline"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option v-for="opt in pipelineOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none" />
              </div>
            </div>
          </div>

          <!-- Currency & Amount/Value -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">Currency</label>
              <div class="relative">
                <select
                  v-model="formData.currency"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option v-for="opt in currencyOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">Amount / Value</label>
              <input
                v-model="formData.amount"
                type="number"
                placeholder="Amount/Value"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!-- Expected Close Date & Owner -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">Expected Close Date</label>
              <input
                v-model="formData.expectedCloseDate"
                type="date"
                placeholder="Close Date"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">Owner</label>
              <div class="relative">
                <select
                  v-model="formData.owner"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option v-for="opt in ownerOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none" />
              </div>
            </div>
          </div>

          <!-- Priority & Source -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">Priority</label>
              <div class="relative">
                <select
                  v-model="formData.priority"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">Source</label>
              <div class="relative">
                <select
                  v-model="formData.source"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option v-for="opt in sourceOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
                <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none" />
              </div>
            </div>
          </div>

          <!-- Description & Document (Optional) - collapsible -->
          <div class="border border-outline rounded-lg">
            <label class="flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-light-base transition-colors">
              <input
                type="checkbox"
                v-model="showOptional"
                class="w-4 h-4 rounded border-outline accent-dark-base cursor-pointer"
              />
              <span class="text-sm font-medium text-sub-text">Description &amp; Document <span class="text-sub-text/60">(Opsional)</span></span>
            </label>

            <Transition name="expand">
              <div v-if="showOptional" class="border-t border-outline px-4 py-4 space-y-4">
                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-dark-base mb-2">Description</label>
                  <textarea
                    v-model="formData.description"
                    placeholder="Ex Lorem ipsum dolor sit"
                    rows="3"
                    class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm resize-none"
                  ></textarea>
                </div>

                <!-- Documents -->
                <div>
                  <label class="block text-sm font-medium text-dark-base mb-2">Documents</label>

                  <!-- Source Dropdown -->
                  <div class="relative">
                    <button
                      type="button"
                      @click="isDocDropdownOpen = !isDocDropdownOpen"
                      class="w-full flex items-center justify-between px-3 py-2 border border-outline rounded-lg text-sm bg-white cursor-pointer"
                      :class="selectedDocSource ? 'text-dark-base' : 'text-sub-text'"
                    >
                      <span>{{ docSourceOptions.find(o => o.value === selectedDocSource)?.label || 'Select File Source' }}</span>
                      <ChevronDown
                        :size="16"
                        class="text-sub-text transition-transform"
                        :class="{ 'rotate-180': isDocDropdownOpen }"
                      />
                    </button>

                    <!-- Dropdown Menu -->
                    <div
                      v-if="isDocDropdownOpen"
                      class="absolute left-0 right-0 mt-1 bg-white border border-outline rounded-lg shadow-lg z-30"
                    >
                      <ul class="py-1">
                        <li
                          v-for="opt in docSourceOptions.filter(o => o.value !== '')"
                          :key="opt.value"
                          @click="selectDocSource(opt.value)"
                          class="px-4 py-2 text-sm hover:bg-light-base cursor-pointer"
                          :class="selectedDocSource === opt.value ? 'text-dark-base font-medium' : 'text-sub-text'"
                        >
                          {{ opt.label }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Upload Area — muncul jika pilih Local File -->
                  <Transition name="expand">
                    <div v-if="selectedDocSource === 'local'" class="mt-2">
                      <label class="relative block cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          @change="handleFileChange"
                        />
                        <div
                          class="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-outline rounded-lg text-sm bg-light-base hover:bg-outline/10 transition-colors"
                        >
                          <!-- Upload Icon -->
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-sub-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4" />
                          </svg>
                          <span v-if="!formData.documents" class="text-sub-text font-medium">Klik untuk pilih file</span>
                          <span v-else class="text-dark-base font-medium">{{ formData.documents.name }}</span>
                          <span class="text-xs text-sub-text/70">PDF, DOC, XLS, JPG, PNG</span>
                        </div>
                      </label>
                    </div>
                  </Transition>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Contact Association -->
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2">Contact Association</label>
            <div class="relative">
              <input
                v-model="formData.contactAssociation"
                type="text"
                placeholder="Search by Name"
                class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
              <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none" />
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

          <!-- Companies Association -->
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2">Companies Association</label>
            <div class="relative">
              <input
                v-model="formData.companiesAssociation"
                type="text"
                placeholder="Search by Name"
                class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
              <ChevronDown :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none" />
            </div>
            <button
              type="button"
              @click="showAddCompanyForm = true"
              class="mt-2 text-sm text-sub-text hover:text-dark-base font-medium flex items-center gap-1"
            >
              <Plus :size="14" />
              Create Company
            </button>
          </div>

        </form>
      </div>

      <!-- Footer Actions (Sticky) -->
      <div class="bg-white flex items-center justify-between px-6 py-4 border-t border-outline shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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
            class="px-6 py-2 border border-outline rounded-lg text-sub-text hover:bg-light-base transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="showDetailForm = true"
            class="px-6 py-2 bg-dark-base text-white rounded-lg hover:bg-dark-hover transition-colors text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Contact Detail Form -->
  <ContactDetailForm
    :isOpen="showDetailForm"
    @close="showDetailForm = false"
    @back="showDetailForm = false"
    @submit="showDetailForm = false; handleClose()"
  />

  <!-- Add Company Form -->
  <AddCompanyForm
    :isOpen="showAddCompanyForm"
    @close="showAddCompanyForm = false"
    @submit="showAddCompanyForm = false"
  />

  <!-- Add Contact Quick Form -->
  <AddContactQuickForm
    :isOpen="showAddContactQuickForm"
    @close="showAddContactQuickForm = false"
    @submit="showAddContactQuickForm = false"
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

/* Expand Animation for optional section */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 400px;
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

/* Hide number input spin buttons */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
