<script setup>
const salespeople = [
  { name: "Ahmad", deals: "2.5K", won: "2.1K" },
  { name: "Nur", deals: "1.5K", won: "1.1K" },
  { name: "Fuady", deals: "550", won: "500" },
  { name: "Hanan", deals: "196", won: "176" },
  { name: "Hafizhah", deals: "230", won: "210" },
];
</script>

<template>
  <div
    class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 w-full h-full"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Top Salespeople</h2>

      <button class="text-slate-400 hover:text-gray-700">•••</button>
    </div>

    <!-- Table Header -->
    <div class="grid grid-cols-3 text-sm text-gray-400 mb-2 px-3">
      <span>Name</span>
      <span class="text-right">Deals</span>
      <span class="text-right">Won</span>
    </div>

    <!-- List -->
    <div class="space-y-2">
      <div
        v-for="(person, i) in salespeople"
        :key="i"
        class="grid grid-cols-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-50"
      >
        <!-- Name -->
        <span class="font-medium text-gray-700">
          {{ person.name }}
        </span>

        <!-- Deals -->
        <span class="text-right text-gray-600">
          {{ person.deals }}
        </span>

        <!-- Won -->
        <span class="text-right font-semibold text-gray-800">
          {{ person.won }}
        </span>
      </div>
    </div>
  </div>
</template>
