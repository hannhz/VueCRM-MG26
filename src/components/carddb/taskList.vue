<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const allTasks = computed(() => store.getters["tasks/allTasks"] || []);
const isLoading = computed(() => store.getters["tasks/isLoading"]);

const monthLabel = computed(() => {
  const now = new Date();
  return now.toLocaleDateString("en-US", { month: "long" });
});

const formatDueDate = (rawDate, rawTime) => {
  if (!rawDate && !rawTime) return "-";

  const dateObj = rawDate ? new Date(rawDate) : null;
  const isDateValid =
    dateObj instanceof Date && !Number.isNaN(dateObj.getTime());

  const datePart = isDateValid
    ? dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : String(rawDate || "").trim();

  const timePart = String(rawTime || "").trim();
  if (!timePart) return datePart || "-";

  return `${datePart} - ${timePart}`;
};

const getStatusLabel = (task) => {
  const statusRaw = String(task.status || task.stage || "").toLowerCase();

  if (statusRaw === "completed") return "Done";
  if (statusRaw === "in_progress") return "Process";
  if (statusRaw === "waiting") return "Waiting";
  if (statusRaw === "deferred") return "Deferred";

  const dueDate = task.due_date || task.dueDate || task.date;
  if (statusRaw === "not_started" && dueDate) {
    const due = new Date(dueDate);
    if (!Number.isNaN(due.getTime()) && due < new Date()) {
      return "Overdue";
    }
  }

  return "Not Started";
};

const statusStyle = (status) => {
  if (status === "Done") return "bg-green-600/10 text-green-600";
  if (status === "Overdue") return "bg-red-500/10 text-red-500";
  if (status === "Process") return "bg-amber-500/10 text-amber-500";
  if (status === "Waiting") return "bg-yellow-500/10 text-yellow-600";
  if (status === "Deferred") return "bg-slate-500/10 text-slate-600";
  return "bg-gray-200 text-gray-700";
};

const tasks = computed(() =>
  allTasks.value.slice(0, 8).map((task, index) => {
    const statusLabel = getStatusLabel(task);
    return {
      id: task.id ?? task.task_id ?? task.id_task ?? index,
      date: formatDueDate(
        task.due_date || task.dueDate || task.date,
        task.task_time || task.time,
      ),
      name: task.task_name || task.title || task.name || "Untitled Task",
      pic: task.assignee || task.owner || task.user_name || "-",
      status: statusLabel,
    };
  }),
);

onMounted(async () => {
  if (allTasks.value.length > 0) return;
  await store.dispatch("tasks/fetchAllTasks").catch(() => null);
});
</script>

<template>
  <div
    class="w-full h-full bg-white rounded-xl shadow-sm border border-outline p-6 mb-5"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-dark-base">Task List</h2>

      <button
        class="flex items-center gap-2 text-sm text-slate-400 hover:text-dark-base transition"
      >
        <span>{{ monthLabel }}</span>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <!-- Table Head -->
    <div
      class="grid grid-cols-[200px_1fr_140px_120px] text-sm text-slate-500 pb-2 border-b"
    >
      <div>Due Date</div>
      <div>Task Name</div>
      <div>PIC</div>
      <div class="text-center">Status</div>
    </div>

    <!-- Rows -->
    <div class="max-h-56 overflow-y-auto mt-2">
      <div v-if="isLoading" class="py-6 text-center text-sm text-sub-text">
        Loading tasks...
      </div>

      <div
        v-else-if="tasks.length === 0"
        class="py-6 text-center text-sm text-sub-text"
      >
        No task data from database.
      </div>

      <div
        v-else
        v-for="(task, i) in tasks"
        :key="task.id"
        class="grid grid-cols-[200px_1fr_140px_120px] items-center text-sm py-2 px-1"
        :class="i % 2 === 1 ? 'bg-slate-100/60 rounded' : ''"
      >
        <div class="text-gray-800">{{ task.date }}</div>

        <div class="text-gray-800 font-medium">
          {{ task.name }}
        </div>

        <div class="font-semibold text-gray-800">
          {{ task.pic }}
        </div>

        <div class="flex justify-center">
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="statusStyle(task.status)"
          >
            {{ task.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
