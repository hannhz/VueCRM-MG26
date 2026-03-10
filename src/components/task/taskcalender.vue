<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { Filter, Search, RefreshCw, Trash } from "lucide-vue-next";
import { alertService } from "@/services/alertService";

const store = useStore();

// Get tasks state from Vuex
const isLoading = computed(() => store.getters["tasks/isLoading"]);
const error = computed(() => store.getters["tasks/error"]);
const allTasks = computed(() => store.getters["tasks/allTasks"] || []);

const taskText = ref("");
const emit = defineEmits(["add", "viewDetail"]);

/* =========================
   DATE STATE
========================= */
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const selectedDate = ref(formatDate(today));

const events = computed(() => {
  return allTasks.value.reduce((acc, task) => {
    if (!task?.dueDate) {
      return acc;
    }

    const parsedDate = new Date(task.dueDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return acc;
    }

    const key = formatDate(parsedDate);
    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push({
      id: task.id,
      title: task.title || task.name || "Untitled Task",
      time: task.time || "",
      rawTask: task,
    });

    return acc;
  }, {});
});

/* =========================
   HELPERS
========================= */
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentMonthName = computed(() => monthNames[currentMonth.value]);

/* =========================
   GENERATE DAYS
========================= */
const days = computed(() => {
  const result = [];
  const totalDays = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0,
  ).getDate();

  for (let i = 1; i <= totalDays; i++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

    result.push({
      day: i,
      date: dateStr,
      isToday:
        i === today.getDate() &&
        currentMonth.value === today.getMonth() &&
        currentYear.value === today.getFullYear(),
      hasEvent: !!events.value[dateStr],
    });
  }
  return result;
});

/* =========================
   NAVIGATION
========================= */
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else currentMonth.value--;
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else currentMonth.value++;
}

function goToday() {
  currentMonth.value = today.getMonth();
  currentYear.value = today.getFullYear();
  selectedDate.value = formatDate(today);
}

/* =========================
   SELECT DATE
========================= */
function selectDate(day) {
  selectedDate.value = day.date;
}

function isSelected(day) {
  return day.date === selectedDate.value;
}

const selectedEvents = computed(() => {
  return events.value[selectedDate.value] || [];
});

const selectedDateLabel = computed(() => {
  return new Date(selectedDate.value).toDateString();
});

function openTaskDetailFromCalendar(eventItem) {
  emit("viewDetail", eventItem.rawTask || { id: eventItem.id });
}

async function handleDeleteTask(taskItem) {
  const confirmDelete = await alertService.confirm(
    "Hapus Task?",
    "Task ini akan dihapus secara permanen. Lanjutkan?",
  );

  if (!confirmDelete) return;

  try {
    await store.dispatch("tasks/deleteTask", taskItem?.rawTask || taskItem);
    alertService.success("Task berhasil dihapus");
  } catch (error) {
    console.error("Error deleting task:", error);
    const status = error?.response?.status;
    const backendMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message;
    alertService.error(
      `Gagal menghapus task. ${status ? `Status: ${status}. ` : ""}${backendMessage || "Silakan coba lagi."}`,
    );
  }
}
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-outline flex flex-col overflow-hidden"
  >
    <!-- Action Bar -->
    <div class="pt-4 px-4">
      <div class="flex items-center gap-4 w-full flex-wrap">
        <!-- LEFT -->
        <div class="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
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
            class="pl-3 pr-4 py-2 bg-white border border-outline rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
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
            <select class="px-3 py-2 border border-outline rounded-lg text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- CALENDAR AREA -->
    <div class="p-4 grid grid-cols-1 xl:grid-cols-4 gap-4 relative">
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

      <!-- CALENDAR -->
      <div class="xl:col-span-3">
        <!-- HEADER -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">
            {{ currentMonthName }} {{ currentYear }}
          </h2>

          <div class="flex gap-2">
            <button @click="prevMonth" class="px-3 py-1 border rounded">
              ◀
            </button>
            <button @click="goToday" class="px-3 py-1 border rounded">
              Today
            </button>
            <button @click="nextMonth" class="px-3 py-1 border rounded">
              ▶
            </button>
          </div>
        </div>

        <!-- GRID -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="day in days"
            :key="day.date"
            @click="selectDate(day)"
            class="h-24 p-2 rounded-lg cursor-pointer border relative transition hover:shadow-md flex flex-col"
            :class="{
              'bg-blue-100 border-blue-400': day.isToday,
              'bg-blue-500 text-white': isSelected(day),
            }"
          >
            <!-- tanggal -->
            <div class="text-sm font-semibold">
              {{ day.day }}
            </div>

            <!-- preview event -->
            <div
              v-if="events[day.date]"
              class="mt-1 text-xs text-left space-y-1 overflow-hidden"
            >
              <div
                class="bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate"
              >
                {{ events[day.date][0].title }}
              </div>

              <!-- jika lebih dari 1 -->
              <div
                v-if="events[day.date].length > 1"
                class="text-[10px] text-gray-500"
              >
                +{{ events[day.date].length - 1 }} more
              </div>
            </div>

            <!-- dot indicator -->
            <span
              v-if="day.hasEvent"
              class="absolute bottom-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"
            ></span>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="border rounded-lg p-4">
        <h3 class="font-semibold mb-3">
          {{ selectedDateLabel }}
        </h3>

        <div v-if="selectedEvents.length === 0" class="text-gray-400">
          No schedule
        </div>

        <ul v-else class="space-y-2">
          <li
            v-for="(event, index) in selectedEvents"
            :key="event.id || index"
            class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition flex items-start justify-between group"
            @click="openTaskDetailFromCalendar(event)"
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium">{{ event.title }}</div>
              <div class="text-sm text-gray-500">{{ event.time }}</div>
            </div>
            <button
              type="button"
              @click.stop="handleDeleteTask(event)"
              class="ml-2 p-1 rounded cursor-pointer hover:bg-red-100 text-gray-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100"
              title="Delete task"
            >
              <Trash :size="16" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <p
      v-if="error"
      class="px-6 py-3 text-sm text-red-600 border-t border-gray-100"
    >
      {{ error }}
    </p>
  </div>
</template>
