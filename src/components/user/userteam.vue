<script setup>
import { ref, computed } from "vue";
import {
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
    ChevronDown,
  Trash2
} from "lucide-vue-next";

/* =========================
   TEAM DATA (DUMMY)
========================= */
const teams = ref([
  { id: 1, team: "Management", members: 4 },
  { id: 2, team: "Marketing", members: 7 },
  { id: 3, team: "Design", members: 5 },
  { id: 4, team: "Finance", members: 3 },
  { id: 5, team: "Development", members: 12 },
  { id: 6, team: "Support", members: 6 },
]);

/* =========================
   SEARCH
========================= */
const searchQuery = ref("");

const filteredTeams = computed(() => {
  if (!searchQuery.value) return teams.value;

  return teams.value.filter(t =>
    t.team.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

/* =========================
   PAGINATION
========================= */
const currentPage = ref(1);
const itemsPerPage = ref(5);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTeams.value.length / itemsPerPage.value))
);

const paginatedTeams = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredTeams.value.slice(start, start + itemsPerPage.value);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

/* =========================
   SELECT TEAM
========================= */
const selectedTeam = ref([]);

const allSelected = computed(
  () =>
    paginatedTeams.value.length > 0 &&
    paginatedTeams.value.every(t => selectedTeam.value.includes(t.id))
);

function toggleSelectAll(e) {
  selectedTeam.value = e.target.checked
    ? paginatedTeams.value.map(t => t.id)
    : [];
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-outline overflow-hidden">
    
    <!-- ACTION BAR -->
    <div class="p-4 border-b border-outline">
      <div class="flex items-center justify-between flex-wrap gap-3">
        
        <!-- LEFT -->
        <div class="flex items-center gap-3">
          
          <!-- Filter -->
          <button class="p-2 border border-outline rounded-lg hover:bg-outline/30 transition">
            <Filter :size="20" class="text-dark-base" />
          </button>

          <!-- Search -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search team..."
              class="pl-3 pr-4 py-2 bg-white border border-outline rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
            />
          </div>

          <button class="p-2 bg-outline hover:bg-outline/30 rounded-lg transition">
            <Search :size="20" class="text-dark-base" />
          </button>

          <!-- Show -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-dark-base">Show</span>
            <select
              v-model="itemsPerPage"
              class="px-3 py-2 border border-outline rounded-lg text-sm"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
            </select>
          </div>
        </div>

        <!-- Right Section: Action Buttons -->
        <div class="flex items-center gap-2">
          <!-- Delete -->
          <button
            class="p-2 bg-white border border-red text-red rounded-lg hover:bg-red hover:text-white transition"
          >
            <Trash2 :size="18" />
          </button>
        </div>

      </div>
    </div>

    <!-- SELECT & PAGINATION -->
    <div class="px-6 py-4 flex items-center border-b border-outline">
      
      <label class="flex items-center gap-2 text-sm text-sub-text">
        <input
          type="checkbox"
          @change="toggleSelectAll"
          :checked="allSelected"
          class="h-4 w-4 rounded border-gray-300"
        />
        Select all team
      </label>

      <div class="ml-auto flex items-center gap-3 text-sm text-sub-text">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronLeft :size="18" />
        </button>

        <span>Page</span>

        <input
          type="number"
          v-model="currentPage"
          min="1"
          class="w-12 px-2 py-1 border border-gray-300 rounded text-center"
        />

        <span>of {{ totalPages }}</span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
        >
          <ChevronRight :size="18" />
        </button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="overflow-x-auto">
      <table class="w-full">
        
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50/50">
            <th class="px-6 py-4">

            </th>

            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center gap-2">
                Team
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>

            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center gap-2">
                Number of Members
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- EMPTY STATE -->
          <tr v-if="paginatedTeams.length === 0">
            <td colspan="3" class="px-6 py-20 text-center text-sub-text">
              No teams found
            </td>
          </tr>

          <!-- ROWS -->
          <tr
            v-for="team in paginatedTeams"
            :key="team.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4">
              <input
                type="checkbox"
                :value="team.id"
                v-model="selectedTeam"
                class="w-4 h-4"
              />
            </td>

            <td class="px-6 py-4 font-medium text-gray-800">
              {{ team.team }}
            </td>

            <td class="px-6 py-4 text-dark-base">
              {{ team.members }} members
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>