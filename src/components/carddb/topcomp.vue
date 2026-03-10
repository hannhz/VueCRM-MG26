<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const allCompanies = computed(() => store.getters["company/allcompany"] || []);
const isLoading = computed(() => store.getters["company/isLoading"]);

const getCompanyName = (company = {}) => {
  return (
    company.name ||
    company.company_name ||
    company.nama_perusahaan ||
    `Company ${company.id || ""}`
  );
};

const companies = computed(() =>
  allCompanies.value.slice(0, 8).map((company, index) => ({
    id: company.id ?? index,
    name: getCompanyName(company),
    // Placeholder sementara, nanti disesuaikan saat data metrik deal siap.
    deals: "-",
    value: "-",
    percent: "-",
  })),
);

onMounted(async () => {
  if (allCompanies.value.length > 0) return;
  await store.dispatch("company/fetchAllcompany").catch(() => null);
});
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
    <div v-if="isLoading" class="py-6 text-center text-sm text-sub-text">
      Loading companies...
    </div>

    <div
      v-else-if="companies.length === 0"
      class="py-6 text-center text-sm text-sub-text"
    >
      No company data from database.
    </div>

    <div v-else class="mt-3 space-y-3">
      <div
        v-for="(company, i) in companies"
        :key="company.id"
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
