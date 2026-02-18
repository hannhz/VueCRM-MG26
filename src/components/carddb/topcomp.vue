<script setup>
const companies = [
  {
    name: "PT Maju Jaya Teknologi",
    deals: 5,
    value: "Rp 250 jt",
    percent: "45%",
  },
  {
    name: "PT Global Solusi Digital",
    deals: 3,
    value: "Rp 180 jt",
    percent: "32%",
  },
  {
    name: "CV Karya Nusantara",
    deals: 4,
    value: "Rp 90 jt",
    percent: "21%",
  },
];
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-outline p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-gray-800">Top Company</h2>
      <button class="text-slate-400 hover:text-gray-700">•••</button>
    </div>

    <!-- Table Header -->
    <div
      class="grid grid-cols-[2fr_0.6fr_1.2fr_0.8fr] text-sm text-slate-500 font-medium border-b pb-3"
    >
      <div>Company</div>
      <div class="text-center">Deals</div>
      <div class="text-center">Total Deal Value</div>
      <div class="text-right">% of Total</div>
    </div>

    <!-- Rows -->
    <div class="mt-3 space-y-3">
      <div
        v-for="(company, i) in companies"
        :key="i"
        class="grid grid-cols-[2fr_0.6fr_1.2fr_0.8fr] items-center text-sm"
      >
        <div class="font-medium text-gray-800">
          {{ company.name }}
        </div>

        <div class="text-center text-gray-700">
          {{ company.deals }}
        </div>

        <div class="text-center font-medium text-gray-800">
          {{ company.value }}
        </div>

        <div class="text-right text-gray-700">
          {{ company.percent }}
        </div>
      </div>
    </div>
  </div>
</template>
