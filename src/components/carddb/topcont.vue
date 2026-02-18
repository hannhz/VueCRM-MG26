<script setup>
const contacts = [
  {
    name: "Andi Pratama",
    deals: 5,
    last: "1 day ago",
    value: "Rp 120 jt",
  },
  {
    name: "Kevin Maulana",
    deals: 3,
    last: "2 days ago",
    value: "Rp 75 jt",
  },
  {
    name: "Muhammad Haidar",
    deals: 4,
    last: "3 days ago",
    value: "Rp 90 jt",
  },
];
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-outline p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-gray-800">Top Contacts</h2>
      <button class="text-slate-400 hover:text-gray-700">•••</button>
    </div>

    <!-- Table Header -->
    <div
      class="grid grid-cols-[2fr_0.7fr_1.2fr_1fr] text-sm text-slate-500 font-medium border-b pb-3"
    >
      <div>Contact</div>
      <div class="text-center">Deals</div>
      <div class="text-center">Last Activity</div>
      <div class="text-right">Deals Value</div>
    </div>

    <!-- Rows -->
    <div class="mt-3 space-y-3">
      <div
        v-for="(contact, i) in contacts"
        :key="i"
        class="grid grid-cols-[2fr_0.7fr_1.2fr_1fr] items-center text-sm"
      >
        <div class="font-medium text-gray-800">
          {{ contact.name }}
        </div>

        <div class="text-center text-gray-700">
          {{ contact.deals }}
        </div>

        <div class="text-center text-gray-700">
          {{ contact.last }}
        </div>

        <div class="text-right font-medium text-gray-800">
          {{ contact.value }}
        </div>
      </div>
    </div>
  </div>
</template>
