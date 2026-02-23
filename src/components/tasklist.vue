<script setup>
import { ref, computed } from "vue";
import {
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-vue-next";

/* =========================
   QUICK ADD
========================= */
const taskText = ref("");
const emit = defineEmits(["add"]);

function quickAdd() {
  if (!taskText.value.trim()) return;
  emit("add", taskText.value);
  taskText.value = "";
}

/* =========================
   DATA TASK (DUMMY)
   nanti bisa dari API
========================= */
const tasks = ref([
  {
    id: 1,
    name: "Follow up client",
    stage: "Lead",
    amount: "$1200",
    owner: "Nan",
  },
  {
    id: 2,
    name: "Prepare proposal",
    stage: "Negotiation",
    amount: "$800",
    owner: "Nan",
  },
  {
    id: 3,
    name: "Meeting vendor",
    stage: "Closed",
    amount: "$500",
    owner: "Nan",
  },
]);

/* =========================
   PAGINATION
========================= */
const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalTask = computed(() => tasks.value.length);
const totalPages = computed(() =>
  Math.ceil(totalTask.value / itemsPerPage.value),
);

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

/* =========================
   SELECT TASK
========================= */

const task = ref([]);
const selectedTask = ref([]);

const allSelected = computed(
  () =>
    selectedTask.value.length === tasks.value.length && tasks.value.length > 0,
);

function toggleSelectAll(e) {
  selectedTask.value = e.target.checked ? tasks.value.map((t) => t.id) : [];
}

function toggleSelect(id) {
  if (selectedTask.value.includes(id)) {
    selectedTask.value = selectedTask.value.filter((i) => i !== id);
  } else {
    selectedTask.value.push(id);
  }
}
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm max-w-[1245px] h-147 border border-outline flex flex-col overflow-hidden"
  >
    <!-- Action Bar -->
    <div class="pt-4 pr-4 pl-4">
      <div class="flex items-center gap-4 w-full">
        <!-- LEFT -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
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

        <!-- quick add -->
        <div class="w-full max-w-xl">
          <div
            class="flex flex-col sm:flex-row bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden"
          >
            <!-- Input -->
            <input
              v-model="taskText"
              @keyup.enter="quickAdd"
              type="text"
              placeholder="Enter new task here..."
              class="flex-1 h-9 px-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
            />

            <!-- Button -->
            <button
              @click="quickAdd"
              class="h-9 px-6 bg-sub-text text-white text-sm font-semibold hover:bg-gray-700 transition flex items-center justify-center"
            >
              Quick Add
            </button>
          </div>
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

        <span>of {{ Math.ceil(totalTask / itemsPerPage) }}</span>

        <button
          class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
        >
          <ChevronRight :size="18" class="text-sub-text" />
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden">
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
                No tasks found
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="task in tasks"
              :key="task.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :value="task.id"
                  v-model="selectedTask"
                  class="w-4 h-4"
                />
              </td>

              <td class="px-6 py-4">{{ task.name }}</td>
              <td class="px-6 py-4">{{ task.stage }}</td>
              <td class="px-6 py-4">{{ task.amount }}</td>
              <td class="px-6 py-4">—</td>
              <td class="px-6 py-4">—</td>
              <td class="px-6 py-4">{{ task.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
