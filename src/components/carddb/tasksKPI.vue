<script setup>
import { computed } from "vue";

const tasks = [
  { name: "Fuady Ahmad", stats: [10, 9, 1, 3, 2] },
  { name: "Hanan Zarkasi", stats: [9, 5, 1, 1, 2] },
  { name: "Hyazuna Mii", stats: [2, 15, 7, 39, 55] },
  { name: "Kevin Maulana", stats: [3, 4, 5, 10, 20] },
  { name: "Andi Pratama", stats: [1, 2, 3, 4, 5] },
];

const sortedTasks = computed(() =>
  [...tasks].sort((a, b) => b.stats[0] - a.stats[0]),
);

// warna dibalik: tua ➜ muda
const colors = [
  "bg-dark-base",
  "bg-deffered-color",
  "bg-waiting-color",
  "bg-progress-color",
  "bg-sub-text",
];
</script>

<template>
  <div
    class="w-full bg-white rounded-xl shadow-sm border border-outline p-6 mb-5"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-dark-base">Task KPI by Status</h2>
      <button class="text-slate-400 hover:text-gray-700">•••</button>
    </div>

    <!-- Table Head -->
    <div class="flex justify-between text-sm text-sub-text mb-4">
      <span>Name</span>
      <span>Total</span>
    </div>

    <!-- Rows -->
    <div class="space-y-4">
      <div
        v-for="(task, i) in tasks"
        :key="i"
        class="grid grid-cols-[180px_1fr_60px] items-center gap-4"
      >
        <!-- NAME (sejajar dengan bar) -->
        <p class="font-medium text-dark-base">
          {{ task.name }}
        </p>

        <!-- Progress Bar -->
        <div class="w-full h-4 bg-gray-200 rounded overflow-hidden flex">
          <div
            v-for="(val, index) in task.stats"
            :key="index"
            :class="[
              colors[index],
              'flex items-center justify-end text-white text-xs font-bold pr-2 border-r border-white',
            ]"
            :style="{ width: val * 5 + '%' }"
          >
            {{ val }}
          </div>
        </div>

        <!-- Total -->
        <p class="text-right text-sm text-dark-base">
          {{ task.stats.reduce((a, b) => a + b, 0) }}
        </p>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex justify-center gap-6 mt-8 text-xs">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-dark-base rounded-full"></span> Not Started
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-deffered-color rounded-full"></span> Deferred
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-waiting-color rounded-full"></span> Waiting
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-progress-color rounded-full"></span> In Progress
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-sub-text rounded-full"></span> Completed
      </div>
    </div>
  </div>
</template>
