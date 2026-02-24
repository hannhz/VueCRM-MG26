<script setup>
import { ref, computed } from "vue";
import { Filter, Search } from "lucide-vue-next";

const taskText = ref("");
const emit = defineEmits(["add"]);

/* =========================
   DATE STATE
========================= */
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const selectedDate = ref(formatDate(today));

/* =========================
   EVENTS DATA
========================= */
const events = ref({
  "2026-02-05": [{ title: "Meeting Client", time: "09:00" }],
  "2026-02-10": [{ title: "Design Review", time: "13:00" }],
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
    <div class="p-4 grid grid-cols-1 xl:grid-cols-4 gap-4">
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
            :key="index"
            class="p-3 border rounded-lg"
          >
            <div class="font-medium">{{ event.title }}</div>
            <div class="text-sm text-gray-500">{{ event.time }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
