<script setup>
import { ref } from 'vue';
import { ArrowRight, X } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const industryOptions = [
  { value: '', label: 'Select Industry' },
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' },
];

const sourceOptions = [
  { value: '', label: 'Select Source' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'other', label: 'Other' },
];

const typeOptions = [
  { value: '', label: 'Select Type' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'customer', label: 'Customer' },
  { value: 'partner', label: 'Partner' },
  { value: 'vendor', label: 'Vendor' },
];

const formData = ref({
  companyName: '',
  companyOwner: '',
  description: '',
  email: '',
  telephone: '',
  website: '',
  industry: '',
  address: '',
  country: '',
  province: '',
  city: '',
  posCode: '',
  source: '',
  type: '',
  deals: '',
});

const handleClose = () => emit('close');

const handleSubmit = () => {
  emit('submit', formData.value);
  handleClose();
};
</script>

<template>
  <!-- Satu Transition membungkus strip + form → animasi identik dengan AddContactForm -->
  <Transition name="slide-company">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-screen flex z-[59]"
      @click.stop
    >
      <!-- Strip warna di kiri (efek tumpuk, ujung kiri pudar) -->
      <div class="w-200 h-full flex-shrink-0" style="background: linear-gradient(to right, transparent, rgba(100,114,139,0.6))"></div>

      <!-- Form panel -->
      <div class="w-full max-w-xl bg-white shadow-2xl flex flex-col h-full">

        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-outline px-6 py-4 flex items-center justify-between z-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div class="flex items-center gap-2">
            <ArrowRight :size="18" class="text-sub-text" />
            <h2 class="text-xl font-bold text-dark-base">Create Company</h2>
          </div>
          <button @click="handleClose" class="p-2 hover:bg-light-base rounded-lg transition-colors">
            <X :size="20" class="text-sub-text" />
          </button>
        </div>

        <!-- Form Content (Scrollable) -->
        <div class="flex-1 overflow-y-auto min-h-0">
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">

            <!-- Company Name & Owner -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Company Name</label>
                <input v-model="formData.companyName" type="text" placeholder="Ex Siap Soft"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Company Owner</label>
                <input v-model="formData.companyOwner" type="text" placeholder="Ex Abdul"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">Description</label>
              <textarea v-model="formData.description" placeholder="Ex Lorem ipsum dolor sit" rows="3"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm resize-none"></textarea>
            </div>

            <!-- Email & Telephone -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Email</label>
                <input v-model="formData.email" type="email" placeholder="Ex siapsoft@gmail.com"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Telephone</label>
                <input v-model="formData.telephone" type="text" placeholder="Ex +628234567891"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" />
              </div>
            </div>

            <!-- Website & Industry -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Website</label>
                <input v-model="formData.website" type="text" placeholder="Ex siapsoft.com"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Industry</label>
                <select v-model="formData.industry"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white">
                  <option v-for="opt in industryOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>

            <!-- Address & Country -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Address</label>
                <input v-model="formData.address" type="text" placeholder="Ex simopomahan"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Country</label>
                <input v-model="formData.country" type="text" placeholder="Country"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" />
              </div>
            </div>

            <!-- Province & City -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Province</label>
                <input v-model="formData.province" type="text" placeholder="Province"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">City</label>
                <input v-model="formData.city" type="text" placeholder="City"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" />
              </div>
            </div>

            <!-- Pos Code & Source -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Pos Code</label>
                <input v-model="formData.posCode" type="text" placeholder="Pos Code"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Source</label>
                <select v-model="formData.source"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white">
                  <option v-for="opt in sourceOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>

            <!-- Type & Deals -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Type</label>
                <select v-model="formData.type"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white">
                  <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-dark-base mb-2">Deals</label>
                <input v-model="formData.deals" type="text" placeholder="Search Deals"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm" />
              </div>
            </div>

          </form>
        </div>

        <!-- Footer -->
        <div class="bg-white flex items-center gap-3 px-6 py-4 border-t border-outline shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button type="button" @click="handleSubmit"
            class="px-6 py-2 bg-dark-base text-white rounded-lg hover:bg-dark-hover transition-colors text-sm font-medium">
            Add Company
          </button>
          <button type="button" @click="handleClose"
            class="px-6 py-2 border border-outline rounded-lg text-sub-text hover:bg-light-base transition-colors text-sm font-medium">
            Cancel
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Animasi identik dengan AddContactForm */
.slide-company-enter-active,
.slide-company-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-company-enter-from,
.slide-company-leave-to {
  transform: translateX(100%);
}
</style>
