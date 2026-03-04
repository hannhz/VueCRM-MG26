export default {
  namespaced: true,

  state: () => ({
    users: [],
    isLoading: false,
    error: null,
    viewMode: "list",
  }),

  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },
  },

  actions: {
    async fetchUsers({ commit, rootState }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      try {
        const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
        const response = await fetch(`${apiBaseUrl}/api/userscrm/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${rootState.auth.token}`,
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();
        console.log("DEBUG: Vuex fetchUsers raw data:", data);

        let extractedUsers = [];
        // Handle various response formats found during debugging
        if (data && Array.isArray(data.users)) {
          extractedUsers = data.users;
        } else if (data && typeof data.users === 'object' && data.users !== null) {
          extractedUsers = Object.values(data.users).filter(u => typeof u === 'object');
        } else if (Array.isArray(data)) {
          extractedUsers = data;
        } else if (data && Array.isArray(data.data)) {
          extractedUsers = data.data;
        }

        commit('SET_USERS', extractedUsers);
        return extractedUsers;
      } catch (error) {
        console.error("Vuex fetchUsers error:", error);
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },
  },

  getters: {
    allUsers: (state) => state.users,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    currentView: (state) => state.viewMode,
  }
};
