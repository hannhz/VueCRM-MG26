<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { Users, Building2, Briefcase, ClipboardClock } from "lucide-vue-next";

const store = useStore();

const contactsTotal = computed(
  () => store.getters["contacts/allContacts"]?.length || 0,
);
const companiesTotal = computed(
  () => store.getters["company/allcompany"]?.length || 0,
);
const dealsTotal = computed(() => store.getters["deals/allDeals"]?.length || 0);
const tasksTotal = computed(() => store.getters["tasks/allTasks"]?.length || 0);
const isSummaryLoading = computed(
  () =>
    store.getters["contacts/isLoading"] ||
    store.getters["company/isLoading"] ||
    store.getters["deals/isLoading"] ||
    store.getters["tasks/isLoading"],
);

const formatCount = (value) => {
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
};

const displayCount = (value) => {
  return isSummaryLoading.value ? "..." : formatCount(value);
};

onMounted(async () => {
  await Promise.allSettled([
    store.dispatch("contacts/fetchAllContacts"),
    store.dispatch("company/fetchAllcompany"),
    store.dispatch("deals/fetchAllDeals"),
    store.dispatch("tasks/fetchAllTasks"),
  ]);
});
</script>

<template>
  <div class="rounded-lg min-h-28 grid grid-cols-2 lg:grid-cols-4 gap-0.5 mb-5">
    <div class="ccard">
      <!-- Left Side -->
      <div class="flex items-center gap-5">
        <!-- Icon Box -->
        <div class="w-16 h-16 rounded-xl flex items-center justify-center">
          <Users :size="45" class="text-dark-base" />
        </div>

        <!-- Text -->
        <div>
          <div class="flex items-left gap-4">
            <h2 class="text-3xl font-bold text-dark-base">
              {{ displayCount(contactsTotal) }}
            </h2>
          </div>
          <p class="text-sub-text text-sm mt-1">Total Contacts</p>
        </div>
      </div>
    </div>

    <!-- companies Summary Card -->
    <div class="ccard">
      <!-- Left Side -->
      <div class="flex items-center gap-5">
        <!-- Icon Box -->
        <div class="w-16 h-16 rounded-xl flex items-center justify-center">
          <Building2 :size="45" class="text-dark-base" />
        </div>

        <!-- Text -->
        <div>
          <div class="flex items-left gap-4">
            <h2 class="text-3xl font-bold text-dark-base">
              {{ displayCount(companiesTotal) }}
            </h2>
          </div>
          <p class="text-sub-text text-sm mt-1">Total Companies</p>
        </div>
      </div>
    </div>

    <!-- deals Summary Card -->
    <div class="ccard">
      <!-- Left Side -->
      <div class="flex items-center gap-5">
        <!-- Icon Box -->
        <div class="w-16 h-16 rounded-xl flex items-center justify-center">
          <Briefcase :size="45" class="text-dark-base" />
        </div>

        <!-- Text -->
        <div>
          <div class="flex items-left gap-4">
            <h2 class="text-3xl font-bold text-dark-base">
              {{ displayCount(dealsTotal) }}
            </h2>
          </div>
          <p class="text-sub-text text-sm mt-1">Total Deals</p>
        </div>
      </div>
    </div>

    <!-- task Summary Card -->
    <div class="ccard">
      <!-- Left Side -->
      <div class="flex items-center gap-5">
        <!-- Icon Box -->
        <div class="w-16 h-16 rounded-xl flex items-center justify-center">
          <ClipboardClock :size="45" class="text-dark-base" />
        </div>

        <!-- Text -->
        <div>
          <div class="flex items-left gap-4">
            <h2 class="text-3xl font-bold text-dark-base">
              {{ displayCount(tasksTotal) }}
            </h2>
          </div>
          <p class="text-sub-text text-sm mt-1">Total Tasks</p>
        </div>
      </div>
    </div>
  </div>
</template>
