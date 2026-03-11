<!-- <script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import {
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Trash2,
  RefreshCw,
} from "lucide-vue-next";
import CreateTeamForm from "../forms/CreateTeamForm.vue";
import DetailTeamForm from "../forms/DetailTeamForm.vue";
import DetailTeamForm from "../forms/DetailTeamForm.vue";
import DetailTeamForm from "../forms/DetailTeamForm.vue";
import DetailTeamForm from "../forms/DetailTeamForm.vue";

const store = useStore();

const teams = computed(() => store.getters["team/filteredTeamUsers"]);
const isLoading = computed(() => store.getters["team/isLoading"]);
const error = computed(() => store.getters["team/error"]);

const showCreateTeamForm = ref(false);

const searchQuery = computed({
  get: () => store.state.team.searchQuery,
  set: (value) => store.dispatch("team/setSearchQuery", value),
});

const filteredTeams = computed(() => {
  return teams.value;
});

/* =========================
   PAGINATION
========================= */
const currentPage = ref(1);
const itemsPerPage = ref(5);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTeams.value.length / itemsPerPage.value)),
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
    paginatedTeams.value.every((t) => selectedTeam.value.includes(t.team_id)),
);

function toggleSelectAll(e) {
  selectedTeam.value = e.target.checked
    ? paginatedTeams.value.map((t) => t.team_id)
    : [];
}

const fetchData = async () => {
  try {
    await store.dispatch("team/fetchAllTeamUsers");
  } catch (err) {
    console.error("Failed to fetch team_user:", err);
  }
};

const handleCreateTeamSubmit = async (data) => {
  try {
    const createPayload = {
      team_name: data.teamName,
      parent_id: data.parentTeam?.id || null,
    };

    const createResult = await store.dispatch("team/createTeam", createPayload);
    const createdTeamId =
      createResult?.team?.id || createResult?.data?.id || createResult?.id;

    if (
      createdTeamId &&
      Array.isArray(data.selectedMembers) &&
      data.selectedMembers.length
    ) {
      const addUsersPayload = {
        team_id: createdTeamId,
        user_ids: data.selectedMembers.map((member) => member.id),
      };
      await store.dispatch("team/addTeamUsers", addUsersPayload);
    }

    showCreateTeamForm.value = false;
    await fetchData();
  } catch (err) {
    console.error("Failed to create team:", err);
    alert("Failed to create team. Please check API payload format.");
  }
};

onMounted(() => {
  fetchData();
});
</script> -->

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import {
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Trash2,
  RefreshCw,
} from "lucide-vue-next";
import CreateTeamForm from "../forms/CreateTeamForm.vue";
import DetailTeamForm from "../forms/DetailTeamForm.vue";

export default {
  components: {
    CreateTeamForm,
    DetailTeamForm,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Trash2,
    RefreshCw,
  },

  data() {
    return {
      showCreateTeamForm: false,
      showTeamDetailForm: false,
      selectedTeamDetail: null,
      teamApiPayload: null,
      currentPage: 1,
      itemsPerPage: 5,
      selectedTeam: [],
    };
  },

  computed: {
    ...mapGetters({
      teams: "team/allTeamUsers",
      isLoading: "team/isLoading",
      error: "team/error",
    }),

    searchQuery: {
      get() {
        return this.$store.state.team.searchQuery;
      },
      set(value) {
        this.$store.dispatch("team/setSearchQuery", value);
      },
    },

    filteredTeams() {
      return this.teams;
    },

    totalPages() {
      return Math.max(
        1,
        Math.ceil(this.filteredTeams.length / this.itemsPerPage),
      );
    },

    paginatedTeams() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredTeams.slice(start, start + this.itemsPerPage);
    },

    allSelected() {
      return (
        this.paginatedTeams.length > 0 &&
        this.paginatedTeams.every((t) => this.selectedTeam.includes(t.team_id))
      );
    },
  },

  methods: {
    ...mapActions({
      fetchAllTeamUsers: "team/fetchAllTeamUsers",
      createTeam: "team/createTeam",
      addTeamUsers: "team/addTeamUsers",
      setSearchQuery: "team/setSearchQuery",
    }),

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    toggleSelectAll(e) {
      this.selectedTeam = e.target.checked
        ? this.paginatedTeams.map((t) => t.team_id)
        : [];
    },

    async fetchData() {
      try {
        const result = await this.fetchAllTeamUsers();
        this.teamApiPayload = result || null;
      } catch (err) {
        console.error("Failed to fetch team_user:", err);
      }
    },

    openTeamDetail(team) {
      this.selectedTeamDetail = { ...team };
      this.showTeamDetailForm = true;
    },

    closeTeamDetail() {
      this.showTeamDetailForm = false;
      this.selectedTeamDetail = null;
    },

    handleCreateTeamSubmit(data) {
      console.log(data);

      let dataparam = {
        teamName: data.teamName,
        parentTeam: data.parentTeam?.name || null,
        selectedMembers: data.selectedMembers.map((member) => member.id),
      };

      this.createTeam(dataparam)
        .then((createResult) => {
          const createdTeamId =
            createResult?.team?.id ||
            createResult?.data?.id ||
            createResult?.id;

          if (createdTeamId && dataparam.selectedMembers.length) {
            const addUsersPayload = {
              team_id: createdTeamId,
              user_ids: dataparam.selectedMembers,
            };
            return this.addTeamUsers(addUsersPayload);
          }
        })
        .then(() => {
          this.showCreateTeamForm = false;
          return this.fetchData();
        })
        .catch((err) => {
          console.error("Failed to create team:", err);
          alert("Failed to create team. Please check API payload format.");
        });
      console.log(dataparam);

      // try {
      //   const createPayload = {
      //     team_name: data.teamName,
      //     parent_id: data.parentTeam ? data.parentTeam.id : null,
      //   };

      //   const createResult = await this.createTeam(createPayload);

      //   const createdTeamId =
      //     (createResult && createResult.team && createResult.team.id) ||
      //     (createResult && createResult.data && createResult.data.id) ||
      //     (createResult && createResult.id);

      //   if (
      //     createdTeamId &&
      //     Array.isArray(data.selectedMembers) &&
      //     data.selectedMembers.length
      //   ) {
      //     const addUsersPayload = {
      //       team_id: createdTeamId,
      //       user_ids: data.selectedMembers.map((member) => member.id),
      //     };

      //     await this.addTeamUsers(addUsersPayload);
      //   }

      //   this.showCreateTeamForm = false;
      //   await this.fetchData();
      // } catch (err) {
      //   console.error("Failed to create team:", err);
      //   alert("Failed to create team. Please check API payload format.");
      // }
    },
  },

  mounted() {
    this.fetchData();
  },

  watch: {
    teams(e) {
      console.log(e);
    },
  },
};
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-outline overflow-hidden"
  >
    <!-- ACTION BAR -->
    <div class="p-4 border-b border-outline">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <!-- LEFT -->
        <div class="flex items-center gap-3">
          <!-- Filter -->
          <button
            class="p-2 border border-outline rounded-lg hover:bg-outline/30 transition"
          >
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

          <button
            class="p-2 bg-outline hover:bg-outline/30 rounded-lg transition"
          >
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
          <button
            @click="fetchData"
            :disabled="isLoading"
            class="p-2 border border-outline rounded-lg hover:bg-light-base transition-all active:scale-95 disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw
              :size="18"
              :class="{ 'animate-spin': isLoading }"
              class="text-sub-text"
            />
          </button>
          <!-- Add New -->
          <div class="relative inline-block add-dropdown">
            <button
              @click="showCreateTeamForm = true"
              type="button"
              class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
            >
              <span class="text-lg font-semibold">+</span>
              <span class="text-sm font-medium">Add Team</span>
            </button>
          </div>

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
    <div class="relative overflow-x-auto">
      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-3">
          <RefreshCw :size="32" class="animate-spin text-sub-text" />
          <p class="text-sm font-medium text-sub-text">Loading teams...</p>
        </div>
      </div>

      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50/50">
            <th class="px-6 py-4"></th>

            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center gap-2">
                Team Name
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center gap-2">
                Parent Name
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>

            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center gap-2">
                Total Users
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="error">
            <td colspan="3" class="px-6 py-10 text-center text-red-500">
              Failed to load data: {{ error }}
            </td>
          </tr>

          <!-- EMPTY STATE -->
          <tr v-else-if="!isLoading && paginatedTeams.length === 0">
            <td colspan="3" class="px-6 py-20 text-center text-sub-text">
              No team_user data found
            </td>
          </tr>

          <!-- ROWS -->
          <tr
            v-for="team in paginatedTeams"
            :key="team.team_id"
            class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
            @click="openTeamDetail(team)"
          >
            <td class="px-6 py-4">
              <input
                type="checkbox"
                :value="team.team_id"
                v-model="selectedTeam"
                @click.stop
                class="w-4 h-4"
              />
            </td>

            <td
              class="px-6 py-4 font-medium text-gray-800"
              style="cursor: pointer"
              @click="openTeamDetail(team)"
            >
              {{ team.team_name }}
            </td>
            <td
              class="px-6 py-4 font-medium text-gray-800"
              style="cursor: pointer"
              @click="openTeamDetail(team)"
            >
              {{ team.parent }}
            </td>

            <td class="px-6 py-4 text-dark-base" @click="openTeamDetail(team)">
              {{ team.total_users }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Add Team Form -->
  <CreateTeamForm
    :isOpen="showCreateTeamForm"
    @close="showCreateTeamForm = false"
    @submit="handleCreateTeamSubmit"
  />

  <DetailTeamForm
    :isOpen="showTeamDetailForm"
    :team="selectedTeamDetail"
    :apiPayload="teamApiPayload"
    @close="closeTeamDetail"
  />
</template>
