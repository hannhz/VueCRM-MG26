import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const state = {
  teamUsers: [],
  isLoading: false,
  error: null,
  searchQuery: "",
};

const getters = {
  allTeamUsers: (state) => state.teamUsers,
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,
  searchQuery: (state) => state.searchQuery,
  filteredTeamUsers: (state) => {
    if (!state.searchQuery.trim()) return state.teamUsers;
    const query = state.searchQuery.toLowerCase();
    return state.teamUsers.filter((item) => {
      const teamId = String(item.team_id ?? "").toLowerCase();
      const teamName = String(item.team_name ?? "").toLowerCase();
      return teamId.includes(query) || teamName.includes(query);
    });
  },
};

const mutations = {
  SET_TEAM_USERS(state, payload) {
    state.teamUsers = Array.isArray(payload) ? payload : [];
  },
  SET_LOADING(state, payload) {
    state.isLoading = payload;
  },
  SET_ERROR(state, payload) {
    state.error = payload;
  },
  SET_SEARCH_QUERY(state, payload) {
    state.searchQuery = payload;
  },
};

const actions = {
  setSearchQuery({ commit }, query) {
    commit("SET_SEARCH_QUERY", query);
  },

  async createTeam({ dispatch }, payload) {
    const headers = {
      Authorization: "Bearer " + cookies.get("token"),
    };

    const response = await api.post("team/input", payload, { headers });
    await dispatch("fetchAllTeamUsers");
    return response.data;
  },

  async addTeamUsers({ dispatch }, payload) {
    const headers = {
      Authorization: "Bearer " + cookies.get("token"),
    };

    const response = await api.post("team/addteamusers", payload, { headers });
    await dispatch("fetchAllTeamUsers");
    return response.data;
  },

  async fetchAllTeamUsers({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    const headers = {
      Authorization: "Bearer " + cookies.get("token"),
    };

    let lastError = null;
    let teamUsersRaw = [];
    let teamsRaw = [];

    try {
      const teamUsersResponse = await api.get("team/users", { headers });
      const teamUsersData = teamUsersResponse.data;
      const teamUsersRows =
        teamUsersData?.team_user ||
        teamUsersData?.teamUsers ||
        teamUsersData?.users ||
        teamUsersData?.data ||
        teamUsersData;
      teamUsersRaw = Array.isArray(teamUsersRows) ? teamUsersRows : [];
    } catch (error) {
      lastError = error;
    }

    try {
      const teamsResponse = await api.get("team/", { headers });
      const teamsData = teamsResponse.data;
      const teamsRows =
        teamsData?.teams || teamsData?.team || teamsData?.data || teamsData;
      teamsRaw = Array.isArray(teamsRows) ? teamsRows : [];
    } catch (error) {
      // Team name mapping is optional; keep fallback name if endpoint is unavailable.
    }

    if (!teamUsersRaw.length) {
      commit("SET_LOADING", false);
      commit("SET_ERROR", lastError?.message || "Failed to fetch team users");
      throw lastError || new Error("Failed to fetch team users");
    }

    const teamNameMap = new Map(
      teamsRaw.map((team) => [
        Number(team.id),
        team.team_name || team.name || `Team ${team.id}`,
      ]),
    );

    const countByTeamId = teamUsersRaw.reduce((acc, row) => {
      const teamId = Number(row.team_id);
      if (!Number.isFinite(teamId)) return acc;
      acc.set(teamId, (acc.get(teamId) || 0) + 1);
      return acc;
    }, new Map());

    const aggregated = Array.from(countByTeamId.entries())
      .map(([team_id, total_users]) => ({
        team_id,
        team_name: teamNameMap.get(team_id) || `Team ${team_id}`,
        total_users,
      }))
      .sort((a, b) => a.team_id - b.team_id);

    commit("SET_TEAM_USERS", aggregated);
    commit("SET_LOADING", false);
    return aggregated;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
