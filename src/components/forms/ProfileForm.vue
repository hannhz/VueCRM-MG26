<script setup>
import { ref, computed, watch } from "vue";
import { X, ChevronDown } from "lucide-vue-next";
import { useStore } from "vuex";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);
const store = useStore();

const currentUser = computed(() => store.getters["auth/currentUser"]);
const isAdmin = computed(() => currentUser.value?.role?.toLowerCase() === "admin" || currentUser.value?.role?.toLowerCase() === "super_admin");

// Options (consistent with CreateUserForm)
const teamOptions = [
  { value: "", label: "Name Team" },
  { value: "management", label: "Management" },
  { value: "marketing", label: "Marketing" },
  { value: "design", label: "Design" },
  { value: "finance", label: "Finance" },
  { value: "development", label: "Development" },
  { value: "support", label: "Support" },
];

const staffLevelOptions = [
  { value: "", label: "Staff Level" },
  { value: "executive", label: "Executive Level" },
  { value: "director", label: "Director Level" },
  { value: "manager", label: "Manager Level" },
  { value: "staff", label: "Staff" },
  { value: "other", label: "Other" },
];

const roleOptions = [
  { value: "", label: "Role" },
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "marketing", label: "Marketing" },
];

// Form data - aligned with backend keys from image
const formData = ref({
  id: "",
  name: "",
  firstname: "",
  lastname: "",
  no_handphone: "",
  nik: "",
  email: "",
  password: "",
  primaryteam: "",
  secondaryteam: "",
  stafflevel: "",
  role: "",
});

const isLoading = ref(false);
const isSaving = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const fetchProfileData = async () => {
  isLoading.value = true;
  errorMsg.value = "";
  successMsg.value = "";
  try {
    const apiBaseUrl = import.meta.env.VITE_APP_API_URL || import.meta.env.BACKEND_APP_API_URL;
    const response = await fetch(`${apiBaseUrl}/api/userscrm/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${store.state.auth.token}`,
        "Accept": "application/json",
      },
    });

    if (response.ok) {
      let data = await response.json();
      console.log("Raw Profile Response:", data);
      
      // Handle array or wrapped response
      let userRecord = {};
      if (Array.isArray(data)) {
        const currentEmail = currentUser.value?.email;
        userRecord = data.find(u => u.email === currentEmail) || data[0] || {};
      } else if (data.data) {
        userRecord = data.data;
      } else if (data.user) {
        userRecord = data.user;
      } else {
        userRecord = data;
      }

      console.log("Calculated User Record:", userRecord);

      formData.value = {
        id: userRecord.id || currentUser.value?.id || "",
        name: userRecord.name || (userRecord.firstname + ' ' + userRecord.lastname) || "",
        firstname: userRecord.firstname || currentUser.value?.firstname || currentUser.value?.first_name || "",
        lastname: userRecord.lastname || currentUser.value?.lastname || currentUser.value?.last_name || "",
        no_handphone: userRecord.no_handphone || userRecord.Telephone || currentUser.value?.no_handphone || currentUser.value?.Telephone || currentUser.value?.telephone || "",
        nik: userRecord.nik || currentUser.value?.nik || "",
        email: userRecord.email || currentUser.value?.email || "",
        password: "", // Keep empty for security, but prevent backend error
        primaryteam: userRecord.primaryteam || currentUser.value?.primaryteam || currentUser.value?.primary_team || "",
        secondaryteam: userRecord.secondaryteam || currentUser.value?.secondaryteam || currentUser.value?.secondary_team || "",
        stafflevel: userRecord.stafflevel || currentUser.value?.stafflevel || currentUser.value?.staff_level || "",
        role: userRecord.role || currentUser.value?.role || "",
      };
    } else {
      throw new Error("Failed to fetch profile");
    }
  } catch (err) {
    console.error("Profile fetch error:", err);
    errorMsg.value = "Failed to load profile data from server.";
    // Fallback to store data entirely
    if (currentUser.value) {
      formData.value = {
        id: currentUser.value.id || "",
        name: currentUser.value.name || (currentUser.value.firstname + ' ' + currentUser.value.lastname) || "",
        firstname: currentUser.value.firstname || currentUser.value.first_name || "",
        lastname: currentUser.value.lastname || currentUser.value.last_name || "",
        no_handphone: currentUser.value.no_handphone || currentUser.value.Telephone || currentUser.value.telephone || "",
        nik: currentUser.value.nik || "",
        email: currentUser.value.email || "",
        password: "",
        primaryteam: currentUser.value.primaryteam || currentUser.value.primary_team || "",
        secondaryteam: currentUser.value.secondaryteam || currentUser.value.secondary_team || "",
        stafflevel: currentUser.value.stafflevel || currentUser.value.staff_level || "",
        role: currentUser.value.role || "",
      };
    }
  } finally {
    isLoading.value = false;
  }
};

// Sync with store data/fetch from API when form opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchProfileData();
  }
});

const handleClose = () => {
  emit("close");
};

const handleSubmit = async () => {
  isSaving.value = true;
  errorMsg.value = "";
  successMsg.value = "";

  // Update name before submitting
  formData.value.name = `${formData.value.firstname} ${formData.value.lastname}`.trim();

  try {
    const apiBaseUrl = import.meta.env.VITE_APP_API_URL || import.meta.env.BACKEND_APP_API_URL;
    const response = await fetch(`${apiBaseUrl}/api/userscrm/input`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${store.state.auth.token}`,
        "Accept": "application/json",
      },
      body: JSON.stringify(formData.value),
    });

    if (response.ok) {
      successMsg.value = "Profile updated successfully!";
      // Update local store if needed
      store.dispatch("auth/login", { 
        user: { ...store.state.auth.user, ...formData.value },
        token: store.state.auth.token 
      });
      
      // Close after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }
  } catch (err) {
    console.error("Profile update error:", err);
    errorMsg.value = err.message || "Failed to save profile changes.";
  } finally {
    isSaving.value = false;
  }
};

const handleReset = () => {
  fetchProfileData();
};
</script>

<template>
  <!-- Overlay Background -->
  <Transition name="overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-sub-text/80 z-[60] transition-all duration-300"
      @click="handleClose"
    ></div>
  </Transition>

  <!-- Form Slide Panel -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-[70] flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-outline px-6 py-4 flex items-center justify-between z-10 shadow-sm"
      >
        <h2 class="text-xl font-bold text-dark-base">My Profile</h2>
        <button
          @click="handleClose"
          class="p-2 hover:bg-light-base rounded-lg transition-colors"
        >
          <X :size="20" class="text-sub-text" />
        </button>
      </div>

      <!-- Form Content (Scrollable) -->
      <div class="flex-1 overflow-y-auto relative">
        <!-- Loading State -->
        <div v-if="isLoading" class="absolute inset-0 bg-white/50 z-20 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950"></div>
        </div>

        <form @submit.prevent="handleSubmit" id="profileForm" class="p-6 space-y-6">
          <!-- Error Message -->
          <div v-if="errorMsg" class="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 italic">
            {{ errorMsg }}
          </div>
          
          <!-- Success Message -->
          <div v-if="successMsg" class="p-3 bg-green-50 text-green-600 text-xs rounded-lg border border-green-100 font-medium">
            {{ successMsg }}
          </div>

          <!-- Names -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                First Name
              </label>
              <input
                v-model="formData.firstname"
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
                v-model="formData.lastname"
                type="text"
                placeholder="Last Name"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                required
              />
            </div>
          </div>

          <!-- NIK & Telephone -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                NIK
              </label>
              <input
                v-model="formData.nik"
                type="text"
                placeholder="NIK"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Telephone
              </label>
              <input
                v-model="formData.no_handphone"
                type="text"
                placeholder="Telephone"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
                required
              />
            </div>
          </div>

          <!-- Email & Password -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Email Address
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="youremail@gmail.com"
                :disabled="!isAdmin"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm transition-all shadow-sm"
                :class="{ 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200': !isAdmin }"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Update Password
              </label>
              <input
                v-model="formData.password"
                type="password"
                placeholder="Leave blank to keep current"
                class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm transition-all shadow-sm"
                :placeholder="isSaving ? 'Updating...' : 'Update Password'"
              />
            </div>
          </div>

          <!-- Primary & Secondary Team -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Primary Team
              </label>
              <div class="relative">
                <select
                  v-model="formData.primaryteam"
                  :disabled="!isAdmin"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm transition-all shadow-sm appearance-none"
                  :class="{ 
                    'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200': !isAdmin,
                    'text-dark-base bg-white pr-10 cursor-pointer': isAdmin 
                  }"
                  required
                >
                  <option
                    v-for="option in teamOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <ChevronDown
                  v-if="isAdmin"
                  :size="16"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Secondary Team
              </label>
              <div class="relative">
                <select
                  v-model="formData.secondaryteam"
                  :disabled="!isAdmin"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm transition-all shadow-sm appearance-none"
                  :class="{ 
                    'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200': !isAdmin,
                    'text-dark-base bg-white pr-10 cursor-pointer': isAdmin 
                  }"
                >
                  <option
                    v-for="option in teamOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <ChevronDown
                  v-if="isAdmin"
                  :size="16"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
          </div>

          <!-- Staff Level & Role -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Staff Level
              </label>
              <div class="relative">
                <select
                  v-model="formData.stafflevel"
                  :disabled="!isAdmin"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm transition-all shadow-sm appearance-none"
                  :class="{ 
                    'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200': !isAdmin,
                    'text-dark-base bg-white pr-10 cursor-pointer': isAdmin 
                  }"
                  required
                >
                  <option
                    v-for="option in staffLevelOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <ChevronDown
                  v-if="isAdmin"
                  :size="16"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2">
                Role
              </label>
              <div class="relative">
                <select
                  v-model="formData.role"
                  :disabled="!isAdmin"
                  class="w-full px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm transition-all shadow-sm appearance-none"
                  :class="{ 
                    'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200': !isAdmin,
                    'text-dark-base bg-white pr-10 cursor-pointer': isAdmin 
                  }"
                  required
                >
                  <option
                    v-for="option in roleOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <ChevronDown
                  v-if="isAdmin"
                  :size="16"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer Actions -->
      <div
        class="bg-white flex items-center justify-between px-6 py-4 border-t border-outline shadow-sm"
      >
        <button
          type="button"
          @click="handleReset"
          class="text-sm text-red-500 font-medium hover:underline"
        >
          Reset to Original
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
            form="profileForm"
            :disabled="isSaving"
            class="px-8 py-2 bg-blue-950 text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-semibold shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <div v-if="isSaving" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
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

/* Chrome/Safari focus fix */
input:focus, select:focus {
  border-color: #1e3a8a !important; /* blue-950 */
}
</style>
