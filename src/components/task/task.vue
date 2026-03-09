<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import {
  ChevronDown,
  Download,
  Trash,
  FolderDown,
  FileDown,
  FilePlus,
  FolderPlus,
  Edit,
  LayoutGrid,
  List,
  CalendarDays,
  RefreshCw,
} from "lucide-vue-next";
import TaskList from "./tasklist.vue";
import TaskCalender from "./taskcalender.vue";
import TaskCard from "./taskcard.vue";
import CreateTaskForm from "@/components/forms/CreateTaskForm.vue";

const store = useStore();

// Get tasks from Vuex store
const allTasks = computed(() => store.getters["tasks/filteredTasks"] || []);
const totalTask = computed(() => allTasks.value.length);
const isLoading = computed(() => store.getters["tasks/isLoading"]);
const error = computed(() => store.getters["tasks/error"]);

const tasksStatusText = computed(() => {
  if (isLoading.value) {
    return "Searching tasks...";
  }
  if (error.value) {
    return `Error: ${error.value}`;
  }
  return `${totalTask.value.toLocaleString()} Total Tasks`;
});

const tasksStatusClass = computed(() => {
  if (isLoading.value) {
    return "text-blue-600";
  }
  if (error.value) {
    return "text-red-600";
  }
  return "text-sub-text";
});

const showDropdown = ref(false);
const showDownloadDropdown = ref(false);
const showCreateTaskForm = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function toggleDownloadDropdown() {
  showDownloadDropdown.value = !showDownloadDropdown.value;
}

function handleBulkAdd() {
  console.log("Bulk Add Task");
}

function downloadAll() {
  console.log("Download All Tasks");
}

function handleDownload() {
  console.log("Download Selected Tasks");
}

function handleDelete() {
  console.log("Delete selected tasks");
}

// Keep local UI mode in sync with Vuex for consistency across task subviews.
const activeMode = computed({
  get: () => store.getters["tasks/currentView"] || "list",
  set: (mode) => {
    store.dispatch("tasks/setViewMode", mode);
  },
});

// Fungsi untuk mengubah mode
function setMode(mode) {
  activeMode.value = mode;
}

// Fetch data function untuk refresh
const fetchData = () => {
  return store.dispatch("tasks/fetchAllTasks");
};

const handleCreateTask = async (formData) => {
  try {
    await store.dispatch("tasks/createTask", formData);
    showCreateTaskForm.value = false;
  } catch (err) {
    console.error("Failed to create task:", err);
  }
};

// Lifecycle: Fetch tasks on mount
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Tasks</h1>
      <span class="text-sm" :class="tasksStatusClass">{{ tasksStatusText }}</span>
    </div>

    <!-- Action Button -->
    <div class="flex items-center gap-2 ml-auto">
      <!-- Refresh Button -->
      <button
        @click="fetchData"
        :disabled="isLoading"
        class="p-2 border bg-white border-outline rounded-lg hover:bg-light-base transition-all active:scale-95 disabled:opacity-50"
        title="Refresh Data"
      >
        <RefreshCw
          :size="18"
          :class="{ 'animate-spin': isLoading }"
          class="text-sub-text"
        />
      </button>

      <!-- Add New -->
      <div class="relative inline-block add-dropdown">
        <button
          type="button"
          @click="toggleDropdown"
          class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
        >
          <span class="text-lg font-semibold">+</span>
          <span class="text-sm font-medium">Add New</span>
          <ChevronDown
            :size="16"
            class="transition-transform duration-200"
            :class="{ 'rotate-180': showDropdown }"
          />
        </button>
        <!-- Dropdown Menu -->
        <div
          v-show="showDropdown"
          class="absolute right-0 text-sub-text mt-2 w-44 bg-white border border-outline rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95"
        >
          <button
            @click="
              showCreateTaskForm = true;
              showDropdown = false;
            "
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <FilePlus :size="18" />
            <span class="font-medium"> Single Task </span>
          </button>

          <button
            @click="
              handleBulkAdd();
              showDropdown = false;
            "
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <FolderPlus :size="18" />
            <span class="font-medium"> Bulk Task </span>
          </button>
        </div>
      </div>

      <!-- Download -->
      <div class="relative inline-block">
        <!-- Button -->
        <button
          type="button"
          @click="toggleDownloadDropdown"
          class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
        >
          <Download :size="18" />
          <span class="text-sm font-medium">Download</span>
          <ChevronDown
            :size="16"
            class="transition-transform duration-200"
            :class="{ 'rotate-180': showDownloadDropdown }"
          />
        </button>

        <!-- Dropdown -->
        <div
          v-show="showDownloadDropdown"
          class="absolute text-sub-text right-0 mt-2 w-48 bg-white border border-outline rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95"
        >
          <button
            @click="downloadAll"
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <FolderDown :size="16" />
            <span class="font-medium">Download All</span>
          </button>

          <button
            @click="handleDownload"
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <FileDown :size="16" />
            <span class="font-medium">Download</span>
          </button>
        </div>
      </div>

      <!-- Bulk Edit -->
      <button
        class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
      >
        <Edit :size="18" />
        <span class="text-sm font-medium">Bulk Edit</span>
      </button>

      <!--- Delete Mode -->
      <button
        @click="handleDelete"
        class="flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition bg-white text-sub-text border-outline hover:bg-red hover:text-white hover:border-red"
      >
        <Trash :size="18" :stroke-width="2" />
      </button>

      <!-- List Mode -->
      <button
        @click="setMode('list')"
        :class="[
          activeMode === 'list'
            ? 'bg-sub-text text-white border-sub-text'
            : 'bg-white text-sub-text border-outline hover:bg-sub-text hover:text-white',
        ]"
        class="flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition relative group"
        title="List View"
      >
        <List :size="18" :stroke-width="3" />
        <!-- Tooltip -->
      </button>

      <!-- Calendar Mode -->
      <button
        @click="setMode('calendar')"
        :class="[
          activeMode === 'calendar'
            ? 'bg-sub-text text-white border-sub-text'
            : 'bg-white text-sub-text border-outline hover:bg-sub-text hover:text-white',
        ]"
        class="flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition relative group"
        title="Calendar View"
      >
        <CalendarDays :size="18" :stroke-width="2" />
      </button>

      <!-- Grid Mode -->
      <button
        @click="setMode('grid')"
        :class="[
          activeMode === 'grid'
            ? 'bg-sub-text text-white border-sub-text'
            : 'bg-white text-sub-text border-outline hover:bg-sub-text hover:text-white',
        ]"
        class="flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition relative group"
        title="Kanban View"
      >
        <LayoutGrid :size="18" :stroke-width="2" />
      </button>
    </div>
  </div>

  <!-- Konten berdasarkan mode -->
  <div class="mt-4 relative">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-white/60 z-20 flex items-center justify-center rounded-lg"
    >
      <div class="flex flex-col items-center gap-3">
        <RefreshCw class="animate-spin text-blue-950" :size="32" />
        <p class="text-sm text-sub-text font-medium">Loading tasks...</p>
      </div>
    </div>

    <TaskList v-if="activeMode === 'list'" />
    <TaskCalender v-else-if="activeMode === 'calendar'" />
    <TaskCard v-else-if="activeMode === 'grid'" />
  </div>

  <!-- Create Task Form -->
  <CreateTaskForm
    :isOpen="showCreateTaskForm"
    @close="showCreateTaskForm = false"
    @submit="handleCreateTask"
  />
</template>
