<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const allUsers = computed(() => store.getters["users/allUsers"] || []);
const isLoading = computed(() => store.getters["users/isLoading"]);

const getDisplayName = (user = {}) => {
  const fullName =
    user.name ||
    user.username ||
    user.user_name ||
    [user.firstname || user.first_name, user.lastname || user.last_name]
      .filter(Boolean)
      .join(" ") ||
    user.email ||
    `User ${user.id || ""}`;

  return String(fullName).trim();
};

const salespeople = computed(() =>
  allUsers.value.slice(0, 8).map((user, index) => ({
    id: user.id ?? index,
    name: getDisplayName(user),
    // Placeholder sementara sampai metrik deals/won siap dari backend.
    deals: "-",
    won: "-",
  })),
);

onMounted(async () => {
  if (allUsers.value.length > 0) return;
  await store.dispatch("users/fetchAllusers").catch(() => null);
});
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
    <div v-if="isLoading" class="py-6 text-center text-sm text-sub-text">
      Loading users...
    </div>

    <div
      v-else-if="salespeople.length === 0"
      class="py-6 text-center text-sm text-sub-text"
    >
      No user data from database.
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="(person, i) in salespeople"
        :key="person.id"
        class="grid text-sm grid-cols-3 items-center px-3 py-2 rounded-lg transition hover:bg-gray-50"
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
