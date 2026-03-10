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

  createTeam(context, data) {
    // Gunakan saveTeam dengan choice='i' untuk backward compatibility
    const payload = {
      choice: "i",
      ...data,
    };
    return context.dispatch("saveTeam", payload);
  },

  saveTeam(context, formData) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        // Tentukan choice: 'i' untuk insert, 'u' untuk update
        const choice = formData.choice || (formData.id ? "u" : "i");

        const requestPayload = {
          choice: choice,
          ...formData,
        };

        let network = await api.post("team/input", requestPayload, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
      context.dispatch("fetchAllTeamUsers");
    });

    return promise;
  },

  // Alias untuk update team (backward compatibility)
  updateTeam(context, data) {
    const payload = {
      choice: "u",
      ...data,
    };
    return context.dispatch("saveTeam", payload);
  },

  async addTeamUsers({ dispatch }, payload) {
    const headers = {
      Authorization: "Bearer " + cookies.get("token"),
    };

    const response = await api.post("team/addteamusers", payload, { headers });
    await dispatch("fetchAllTeamUsers");
    return response.data;
  },

  fetchAllTeamUsers({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get("team", {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
          // headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });

        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        commit("SET_TEAM_USERS", data.teams);
        commit("SET_LOADING", false);
      })
      .catch((error) => {
        // Tangani error lain jika ada
        console.error("Error:", error);
        commit("SET_ERROR", error.message);
        commit("SET_LOADING", false);
      });

    return promise;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
