<script setup>
import { ref } from 'vue';
import { X, Plus, ChevronDown } from 'lucide-vue-next';
import AddCompanyForm from './AddCompanyForm.vue';
import AddDealForm from './AddDealForm.vue';
import ContactDetailForm from './ContactDetailForm.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

// Source options
const sourceOptions = [
  { value: '', label: 'Select Source' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'email_campaign', label: 'Email Campaign' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'trade_show', label: 'Trade Show' },
  { value: 'partner', label: 'Partner' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' }
];

// Form data
const formData = ref({
  firstName: '',
  lastName: '',
  jobTitle: '',
  owner: '',
  email: '',
  telephone: '',
  status: '',
  address: '',
  country: '',
  province: '',
  city: '',
  posCode: '',
  source: '',
  companiesAssociation: '',
  dealsAssociation: ''
});

const showAddCompanyForm = ref(false);
const showAddDealForm = ref(false);
const showDetailForm = ref(false);

const handleClose = () => {
  emit('close');
};

const handleSubmit = () => {
  // Validate and submit
  emit('submit', formData.value);
  handleClose();
};

const handleReset = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    jobTitle: '',
    owner: '',
    email: '',
    telephone: '',
    status: '',
    address: '',
    country: '',
    province: '',
    city: '',
    posCode: '',
    source: '',
    companiesAssociation: '',
    dealsAssociation: ''
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
      <div class="sticky top-0 bg-white border-b border-outline px-6 py-4 flex items-center justify-between z-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
        <h2 class="text-xl font-bold text-dark-base">Add Contact</h2>
        <button
          @click="handleClose"
          class="p-2 hover:bg-light-base rounded-lg transition-colors"
        >
          <X :size="20" class="text-sub-text" />
        </button>
      </div>

      <!-- Form Content (Scrollable) -->
      <div class="flex-1 overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Name Section -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                First Name
              </label>
              <input
                v-model="formData.firstName"
                type="text"
                placeholder="First Name"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Last Name
              </label>
              <input
                v-model="formData.lastName"
                type="text"
                placeholder="Last Name"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                required
              />
            </div>
          </div>

          <!-- Job Title & Owner -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Job Title
              </label>
              <input
                v-model="formData.jobTitle"
                type="text"
                placeholder="Job Title"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Owner
              </label>
              <input
                v-model="formData.owner"
                type="text"
                placeholder="Owner"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!-- Email & Status -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Email
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="youremail@gmail.com"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Status
              </label>
              <input
                v-model="formData.status"
                type="text"
                placeholder="Status"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!--Telephone 1 & 2-->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Telephone 1
              </label>
              <input
                v-model="formData.telephone1"
                type="text"
                placeholder="Telephone 1"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Telephone 2
              </label>
              <input
                v-model="formData.telephone2"
                type="text"
                placeholder="Telephone 2"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!-- Address & Country -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Address
              </label>
              <input
                v-model="formData.address"
                type="text"
                placeholder="Address"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Country
              </label>
              <input
                v-model="formData.country"
                type="text"
                placeholder="Country"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!-- Province & City -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Province
              </label>
              <input
                v-model="formData.province"
                type="text"
                placeholder="Province"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                City
              </label>
              <input
                v-model="formData.city"
                type="text"
                placeholder="City"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
          </div>

          <!-- Pos Code & Source -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Pos Code
              </label>
              <input
                v-model="formData.posCode"
                type="text"
                placeholder="Pos Code"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Source
              </label>
              <div class="relative">
                <select
                  v-model="formData.source"
                  class="w-full px-3 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white appearance-none cursor-pointer"
                >
                  <option v-for="option in sourceOptions" :key="option.value" :value="option.value">
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
            <label class="block text-sm font-medium text-dark-base mb-2">
              Companies Association
            </label>
            <input
              v-model="formData.companiesAssociation"
              type="text"
              placeholder="Search by Name"
              class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
            />
            <button
              type="button"
              @click="showAddCompanyForm = true"
              class="mt-2 text-sm text-sub-text hover:text-dark-base font-medium flex items-center gap-1"
            >
              <Plus :size="16" />
              Create Company
            </button>
          </div>

          <!-- Deals Association -->
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2">
              Deals Association
            </label>
            <input
              v-model="formData.dealsAssociation"
              type="text"
              placeholder="Search by Name"
              class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
            />
            <button
              type="button"
              @click="showAddDealForm = true"
              class="mt-2 text-sm text-sub-text hover:text-dark-base font-medium flex items-center gap-1"
            >
              <Plus :size="16" />
              Add Another Deal
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
            type="submit"
            @click="showDetailForm = true"
            class="px-6 py-2 bg-dark-base text-white rounded-lg hover:bg-dark-hover transition-colors text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Add Company Form (stacked on top) -->
  <AddCompanyForm
    :isOpen="showAddCompanyForm"
    @close="showAddCompanyForm = false"
    @submit="showAddCompanyForm = false"
  />

  <!-- Add Deal Form (stacked on top) -->
  <AddDealForm
    :isOpen="showAddDealForm"
    @close="showAddDealForm = false"
    @submit="showAddDealForm = false"
  />

  <!-- Contact Detail Form (Next step) -->
  <ContactDetailForm
    :isOpen="showDetailForm"
    @close="showDetailForm = false"
    @back="showDetailForm = false"
    @submit="showDetailForm = false; handleClose()"
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

/* Preserve focus ring on autofilled inputs */
input:-webkit-autofill:focus,
select:-webkit-autofill:focus {
  -webkit-box-shadow: 
    0 0 0 30px white inset,
    0 0 0 1px #64728b !important;
  -webkit-text-fill-color: #1c2434 !important;
}

</style>
