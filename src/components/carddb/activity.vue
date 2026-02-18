<template>
  <div class="bg-white rounded-2xl shadow-sm border border-outline p-6 h-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-dark-base">System Activity</h2>

      <button
        class="flex items-center gap-2 text-sm text-slate-400 hover:text-dark-base transition"
      >
        <span>Daily</span>
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

    <!-- Table Header -->
    <div
      class="grid grid-cols-1 md:grid-cols-3 text-sm text-slate-500 font-medium border-b border-outline pb-3"
    >
      <span>Date</span>
      <span>Action</span>
      <span>Note</span>
    </div>

    <!-- Activity List -->
    <div class="mt-2 max-h-64 overflow-y-auto pr-2">
      <div
        v-for="(item, index) in activities"
        :key="index"
        :class="[
          'grid grid-cols-1 md:grid-cols-3 py-3 text-sm',
          index % 2 === 1 ? 'bg-slate-100/60 rounded-sm' : '',
        ]"
      >
        <span class="text-dark-base font-medium">
          {{ item.date }}
        </span>

        <span class="text-dark-base font-medium">
          {{ item.action }}
        </span>

        <span class="text-dark-base">
          <span class="font-bold">“{{ item.user }}”</span>
          {{ item.note }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const activities = [
  {
    date: "06 Feb 2026 - 10.39 AM",
    action: "Edited Task",
    user: "Hanan",
    note: " - changed task crm task status",
  },
  {
    date: "06 Feb 2026 - 10.39 AM",
    action: "Added in Task",
    user: "Hanan",
    note: " - created this task",
  },
  {
    date: "06 Feb 2026 - 10.39 AM",
    action: "Added in TeamFeature",
    user: "Hanan",
    note: " -",
  },
  {
    date: "06 Feb 2026 - 10.39 AM",
    action: "Added in TeamFeature",
    user: "Hanan",
    note: " -",
  },
  {
    date: "06 Feb 2026 - 10.39 AM",
    action: "Added in TeamFeature",
    user: "Hanan",
    note: " -",
  },
  {
    date: "06 Feb 2026 - 10.39 AM",
    action: "Edited Task",
    user: "Hanan",
    note: " - changed task crm task status",
  },
];
</script>
