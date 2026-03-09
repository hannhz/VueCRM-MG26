<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import {
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RefreshCw,
} from "lucide-vue-next";
import TaskDetailDataForm from "@/components/forms/TaskDetailDataForm.vue";
import { alertService } from "@/services/alertService";

/* =========================
   QUICK ADD
========================= */
const store = useStore();

// Get tasks from Vuex store
const allTasksData = computed(() => store.getters["tasks/filteredTasks"] || []);
const isLoading = computed(() => store.getters["tasks/isLoading"]);
const error = computed(() => store.getters["tasks/error"]);
const signedInUser = computed(() => store.getters["users/usersignin"] || null);
const authUser = computed(() => store.getters["auth/currentUser"] || null);
const searchQuery = computed({
  get: () => store.getters["tasks/searchQuery"] || "",
  set: (value) => store.dispatch("tasks/setSearchQuery", value),
});

const taskText = ref("");
const isQuickAdding = ref(false);
const quickAddOwnerLabel = computed(() => getLoggedInName());

const getLoggedInName = () => {
  const user = signedInUser.value || authUser.value || {};
  const fullName =
    user.name ||
    user.username ||
    user.user_name ||
    [user.firstname || user.first_name, user.lastname || user.last_name]
      .filter(Boolean)
      .join(" ") ||
    user.email ||
    "User";

  return String(fullName).trim() || "User";
};

async function quickAdd() {
  const taskName = taskText.value.trim();
  if (!taskName || isQuickAdding.value) return;

  isQuickAdding.value = true;

  try {
    if (!signedInUser.value) {
      await store.dispatch("users/getusersignin").catch(() => null);
    }

    await store.dispatch("tasks/createTask", {
      taskName,
      owner: getLoggedInName(),
    });

    taskText.value = "";
  } catch (err) {
    console.error("Quick add task failed:", err);
  } finally {
    isQuickAdding.value = false;
  }
}

const tasks = computed(() => allTasksData.value);

/* =========================
   PAGINATION
========================= */
const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalTask = computed(() => tasks.value.length);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalTask.value / itemsPerPage.value)),
);

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return tasks.value.slice(start, start + itemsPerPage.value);
});

watch([itemsPerPage, totalTask], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

/* =========================
   SELECT TASK
========================= */

const selectedTask = ref([]);
const selectedTaskDetail = ref(null);
const showTaskDetailForm = ref(false);
const isTaskDetailSubmitting = ref(false);

const allSelected = computed(
  () =>
    paginatedTasks.value.length > 0 &&
    paginatedTasks.value.every((task) => selectedTask.value.includes(task.id)),
);

function toggleSelectAll(e) {
  selectedTask.value = e.target.checked
    ? paginatedTasks.value.map((t) => t.id)
    : [];
}

function toggleSelect(id) {
  if (selectedTask.value.includes(id)) {
    selectedTask.value = selectedTask.value.filter((i) => i !== id);
  } else {
    selectedTask.value.push(id);
  }
}

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

</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm w-full h-147 border border-outline flex flex-col overflow-hidden"
  >
    <!-- Action Bar -->
    <div class="pt-4 pr-4 pl-4">
      <div class="flex flex-col xl:flex-row xl:items-start gap-4 w-full">
        <!-- LEFT -->
        <div class="flex items-center flex-wrap gap-3 flex-1 min-w-0">
          <!-- Filter -->
          <button
            class="p-2 border border-outline rounded-lg hover:bg-outline/30 transition"
          >
            <Filter :size="20" class="text-dark-base" />
          </button>

          <!-- Search -->
          <input
            type="text"
            placeholder="Search by Name"
            v-model="searchQuery"
            class="pl-3 pr-4 py-2 bg-white border border-outline rounded-lg w-full sm:w-64 lg:w-72 focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
          />

          <!-- Search Btn -->
          <button
            class="p-2 bg-outline hover:bg-outline/30 rounded-lg transition"
          >
            <Search :size="20" class="text-dark-base" />
          </button>

          <!-- Show -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-dark-base">Show</span>
            <select
              v-model.number="itemsPerPage"
              class="px-3 py-2 border border-outline rounded-lg text-sm"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>

        <!-- quick add -->
        <div class="w-full xl:w-[26rem] shrink-0">
          <div
            class="flex flex-col sm:flex-row bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden"
          >
            <!-- Input -->
            <input
              v-model="taskText"
              @keyup.enter="quickAdd"
              type="text"
              placeholder="Enter new task here..."
              class="w-full min-w-0 flex-1 h-10 sm:h-9 px-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
            />

            <!-- Button -->
            <button
              @click="quickAdd"
              :disabled="isQuickAdding || !taskText.trim()"
              class="w-full sm:w-auto h-10 sm:h-9 px-6 bg-sub-text text-white text-sm font-semibold hover:bg-gray-700 transition flex items-center justify-center shrink-0"
              :class="{ 'opacity-60 cursor-not-allowed': isQuickAdding || !taskText.trim() }"
            >
              {{ isQuickAdding ? "Saving..." : "Quick Add" }}
            </button>
          </div>
          <p class="mt-1 text-xs text-sub-text">
            Owner otomatis: {{ quickAddOwnerLabel }}
          </p>
        </div>
      </div>
    </div>

    <!-- select sama page total -->
    <div class="px-6 py-4 flex items-center">
      <!-- KIRI -->
      <label class="flex items-center gap-2 text-sm text-sub-text">
        <input
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-sub-text focus:ring-sub-text"
        />
        Select all filtered result
      </label>

      <!-- PUSH KANAN -->
      <div class="ml-auto flex items-center gap-3 text-sm text-sub-text">
        <button
          @click="prevPage"
          class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
          :disabled="currentPage === 1"
        >
          <ChevronLeft :size="18" class="text-sub-text" />
        </button>

        <span>Page</span>

        <input
          type="number"
          v-model="currentPage"
          min="1"
          class="w-12 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-sub-text"
        />

        <span>of {{ totalPages }}</span>

        <button
          @click="nextPage"
          class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
          :disabled="currentPage === totalPages"
        >
          <ChevronRight :size="18" class="text-sub-text" />
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden relative">
      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-white/60 z-20 flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-3">
          <RefreshCw class="animate-spin text-blue-950" :size="32" />
          <p class="text-sm text-sub-text font-medium">Loading tasks...</p>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  @change="toggleSelectAll"
                  :checked="allSelected"
                  class="w-4 h-4 rounded border-gray-300"
                />
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  tasks Name
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Stage
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Jumlah/Tertanggal
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Associated with
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>

              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Created/Update
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-gray-700"
              >
                <div class="flex items-center gap-2">
                  Owner
                  <ChevronDown :size="16" class="text-gray-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty State -->
            <tr v-if="tasks.length === 0">
              <td colspan="7" class="px-6 py-20 text-center text-sub-text">
                <div class="flex flex-col items-center gap-3">
                  <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    <Search :size="32" class="text-gray-400" />
                  </div>
                  <p class="text-lg font-medium">No task found</p>
                  <p class="text-sm text-gray-400">
                    Start adding task to see them here
                  </p>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="task in paginatedTasks"
              :key="task.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
              @click="openTaskDetail(task)"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="task.id"
                  v-model="selectedTask"
                  @click.stop
                  class="w-4 h-4"
                />
              </td>

              <td class="px-6 py-4">{{ task.title || task.name }}</td>
              <td class="px-6 py-4">{{ task.stage || task.status || '-' }}</td>
              <td class="px-6 py-4">{{ task.dueDate || task.time || '-' }}</td>
              <td class="px-6 py-4">—</td>
              <td class="px-6 py-4">—</td>
              <td class="px-6 py-4">{{ task.owner || task.assignee || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="error" class="px-6 py-3 text-sm text-red-600 border-t border-gray-100">
      {{ error }}
    </p>

    <TaskDetailDataForm
      :isOpen="showTaskDetailForm"
      :task="selectedTaskDetail"
      :isSubmitting="isTaskDetailSubmitting"
      @close="closeTaskDetail"
      @back="closeTaskDetail"
      @submit="handleTaskDetailSubmit"
    />
  </div>
</template>
