<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  ChevronDown,
  Download,
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
import TaskDetailDataForm from "@/components/forms/TaskDetailDataForm.vue";
import { alertService } from "@/services/alertService";

const store = useStore();
const route = useRoute();

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
const showTaskDetailForm = ref(false);
const selectedTaskDetail = ref(null);
const isTaskDetailSubmitting = ref(false);

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

function openTaskDetail(task) {
  selectedTaskDetail.value = { ...task };
  showTaskDetailForm.value = true;
}

function closeTaskDetail() {
  selectedTaskDetail.value = null;
  showTaskDetailForm.value = false;
}

async function handleTaskDetailSubmit(payload) {
  const taskId = selectedTaskDetail.value?.id || payload?.id;

  if (!taskId) {
    alertService.error("ID task tidak ditemukan. Coba buka ulang detail task.");
    return;
  }

  if (!payload?.task_name?.trim()) {
    alertService.error("Task name wajib diisi.");
    return;
  }

  isTaskDetailSubmitting.value = true;

  try {
    await store.dispatch("tasks/updateTask", {
      id: taskId,
      formData: {
        ...payload,
        task_name: payload.task_name.trim(),
        description: payload.description?.trim() || "",
        assignee: payload.assignee?.trim() || "",
      },
    });

    await store.dispatch("tasks/fetchAllTasks");

    alertService.success("Task berhasil diperbarui.");
    closeTaskDetail();
  } catch (err) {
    const backendMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Gagal update task. Silakan coba lagi.";
    alertService.error(backendMessage);
  } finally {
    isTaskDetailSubmitting.value = false;
  }
}

// Lifecycle: Fetch tasks on mount
onMounted(() => {
  fetchData();
});

watch(
  () => route.path,
  (path) => {
    if (path.endsWith("/taskcard")) {
      store.dispatch("tasks/setViewMode", "grid");
      return;
    }

    if (path.endsWith("/taskcalender")) {
      store.dispatch("tasks/setViewMode", "calendar");
      return;
    }

    if (path.includes("/crmAdmin/task")) {
      store.dispatch("tasks/setViewMode", "list");
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
    <div class="flex min-w-0 items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Tasks</h1>
      <span class="text-sm" :class="tasksStatusClass">{{
        tasksStatusText
      }}</span>
    </div>

    <!-- Action Button -->
    <div
      class="ml-auto flex w-full flex-wrap items-center justify-end gap-1 sm:w-auto sm:gap-2"
    >
      <!-- Refresh Button -->
      <button
        @click="fetchData"
        :disabled="isLoading"
        class="h-9 w-9 rounded-lg border border-outline bg-white p-2 transition-all hover:bg-light-base active:scale-95 disabled:opacity-50 sm:h-10 sm:w-10"
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
          class="flex h-9 w-9 items-center justify-center gap-2 rounded-lg border border-outline bg-white px-2 py-2 text-sub-text transition hover:bg-sub-text hover:text-white sm:h-10 sm:w-auto sm:px-4"
        >
          <span class="text-lg font-semibold">+</span>
          <span class="hidden text-sm font-medium md:inline">Add New</span>
          <ChevronDown
            :size="16"
            class="hidden transition-transform duration-200 md:inline"
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
          class="flex h-9 w-9 items-center justify-center gap-2 rounded-lg border border-outline bg-white px-2 py-2 text-sub-text transition hover:bg-sub-text hover:text-white sm:h-10 sm:w-auto sm:px-4"
        >
          <Download :size="18" />
          <span class="hidden text-sm font-medium md:inline">Download</span>
          <ChevronDown
            :size="16"
            class="hidden transition-transform duration-200 md:inline"
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
        class="flex h-9 w-9 items-center justify-center gap-2 rounded-lg border border-outline bg-white px-2 py-2 text-sub-text transition hover:bg-sub-text hover:text-white sm:h-10 sm:w-auto sm:px-4"
      >
        <Edit :size="18" />
        <span class="hidden text-sm font-medium md:inline">Bulk Edit</span>
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
  <div class="mt-4">
    <TaskList v-if="activeMode === 'list'" @viewDetail="openTaskDetail" />
    <TaskCalender
      v-else-if="activeMode === 'calendar'"
      @viewDetail="openTaskDetail"
    />
    <TaskCard v-else-if="activeMode === 'grid'" @viewDetail="openTaskDetail" />
  </div>

  <!-- Create Task Form -->
  <CreateTaskForm
    :isOpen="showCreateTaskForm"
    @close="showCreateTaskForm = false"
    @submit="handleCreateTask"
  />

  <TaskDetailDataForm
    :isOpen="showTaskDetailForm"
    :task="selectedTaskDetail"
    :isSubmitting="isTaskDetailSubmitting"
    @close="closeTaskDetail"
    @back="closeTaskDetail"
    @submit="handleTaskDetailSubmit"
  />
</template>
