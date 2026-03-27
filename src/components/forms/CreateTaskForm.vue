<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import {
  X,
  ChevronDown,
  Calendar,
  Clock,
  ClipboardList,
  Type,
  Bold,
  Italic,
  Underline,
  Link2,
  Anchor,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  RotateCcw,
  RotateCw,
} from "lucide-vue-next";

const store = useStore();

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);

const getCurrentUserName = () => {
  const userSignin = store.getters["users/usersignin"];
  return (
    userSignin?.name ||
    userSignin?.username ||
    userSignin?.user?.name ||
    userSignin?.user?.username ||
    ""
  );
};

// Form Data
const formData = ref({
  task_name: "",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  status: "",
  assignee: getCurrentUserName(),
  due_date: "",
  task_time: "",
  priority: "",
});

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

const priorityOptions = [
  { value: "", label: "Select Data" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const handleClose = () => emit("close");

const handleSubmit = () => {
  emit("submit", formData.value);
  handleReset();
  handleClose();
};

const handleReset = () => {
  formData.value = {
    task_name: "",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    status: "",
    assignee: getCurrentUserName(),
    due_date: "",
    task_time: "",
    priority: "",
  };
};

onMounted(async () => {
  await Promise.allSettled([
    store.dispatch("users/fetchAllusers"),
    store.dispatch("users/getusersignin"),
  ]);

  if (!formData.value.assignee) {
    formData.value.assignee = getCurrentUserName();
  }
});

watch(
  () => store.getters["users/usersignin"],
  () => {
    if (!formData.value.assignee) {
      formData.value.assignee = getCurrentUserName();
    }
  },
);
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
      class="fixed top-0 right-0 h-screen w-full sm:max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-outline px-6 py-4 flex items-center justify-between z-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <div class="flex items-center gap-2">
          <ClipboardList :size="20" class="text-dark-base" />
          <h2 class="text-xl font-bold text-dark-base">Tasks</h2>
        </div>
        <button
          @click="handleClose"
          class="p-2 hover:bg-light-base rounded-lg transition-colors"
        >
          <X :size="20" class="text-sub-text" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto min-h-0">
        <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 space-y-5">
          <!-- Name of Task -->
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2"
              >Name of Task <span class="text-red-600">*</span></label
            >
            <input
              v-model="formData.task_name"
              type="text"
              placeholder="Task name..."
              class="w-full px-4 py-3 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white"
            />
          </div>

          <!-- Task Description (Rich Text Editor Mockup) -->
          <div
            class="border border-outline rounded-lg overflow-hidden shadow-sm"
          >
            <!-- Toolbar -->
            <div
              class="flex items-center gap-1.5 px-4 py-2 border-b border-outline bg-light-base/50 flex-wrap"
            >
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <RotateCcw :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <RotateCw :size="16" />
              </button>
              <div class="w-px h-4 bg-outline mx-1"></div>
              <div class="relative flex items-center">
                <select
                  class="text-xs font-medium border-none bg-transparent text-sub-text focus:outline-none py-1 pl-1 pr-6 rounded cursor-pointer appearance-none"
                >
                  <option>Format</option>
                </select>
                <ChevronDown
                  :size="12"
                  class="absolute right-1 text-sub-text pointer-events-none"
                />
              </div>
              <div class="w-px h-4 bg-outline mx-1"></div>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-dark-base font-bold"
              >
                <Bold :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <Italic :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <Underline :size="16" />
              </button>
              <div class="w-px h-4 bg-outline mx-1"></div>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <Link2 :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <Anchor :size="16" />
              </button>
              <div class="w-px h-4 bg-outline mx-1"></div>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <AlignLeft :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <AlignCenter :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <AlignRight :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <AlignJustify :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <List :size="16" />
              </button>
              <button
                type="button"
                class="p-1.5 hover:bg-white rounded transition-colors text-sub-text"
              >
                <ListOrdered :size="16" />
              </button>
            </div>
            <!-- Textarea -->
            <textarea
              v-model="formData.description"
              rows="6"
              class="w-full px-4 py-4 text-sm text-sub-text focus:outline-none resize-none bg-white"
              placeholder="Lorem ipsum..."
            ></textarea>
          </div>

          <!-- Status -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Status</label
              >
              <div class="relative">
                <select
                  v-model="formData.status"
                  class="w-full px-4 py-3 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white appearance-none cursor-pointer text-dark-base"
                >
                  <option
                    v-for="opt in statusOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
                <ChevronDown
                  :size="18"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
          </div>

          <!-- Due Date & Time -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Due Date</label
              >
              <div class="relative">
                <input
                  v-model="formData.due_date"
                  type="date"
                  class="w-full px-4 py-3 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white"
                />
                <Calendar
                  :size="18"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-base mb-2"
                >Time</label
              >
              <div class="relative">
                <input
                  v-model="formData.task_time"
                  type="time"
                  class="w-full px-4 py-3 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm text-dark-base bg-white"
                />
                <Clock
                  :size="18"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
                />
              </div>
            </div>
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-dark-base mb-2"
              >Priority</label
            >
            <div class="relative">
              <select
                v-model="formData.priority"
                class="w-full px-4 py-3 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm bg-white appearance-none cursor-pointer text-dark-base"
              >
                <option
                  v-for="opt in priorityOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
              <ChevronDown
                :size="18"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-sub-text pointer-events-none"
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Footer Actions -->
      <div
        class="bg-white flex items-center justify-between p-4 sm:px-6 sm:py-4 border-t border-outline shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <button
          @click="handleReset"
          class="text-sm text-red font-medium hover:underline px-2"
        >
          Reset
        </button>
        <div class="flex gap-3">
          <button
            @click="handleClose"
            class="px-6 py-2 border border-outline rounded-lg text-sub-text hover:bg-light-base transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            class="px-6 py-2 bg-dark-base text-white rounded-lg hover:bg-dark-hover transition-colors text-sm font-medium"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Transition Animations */
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
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Remove Browser Autofill Blue Background */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #1c2434 !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Custom rounding for a premium feel */
.rounded-lg {
  border-radius: 0.5rem;
}

/* Appearance for select icons */
select {
  background-image: none !important;
}

/* Date/Time input styling to hide browser icons if needed, 
   but here we rely on the lucide icons overlayed */
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
