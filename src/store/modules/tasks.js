import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

export default {
  namespaced: true,

  state: () => ({
    tasks: [],
    viewMode: "list",
    isLoading: false,
    error: null,
    searchQuery: "",
  }),

  mutations: {
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query;
    },
  },

  actions: {
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },

    fetchAllTasks({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await api.get("task", {
            headers: {
              Authorization: "Bearer " + cookies.get("token"),
            },
          });
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      });

      promise
        .then((data) => {
          const tasksData = data.tasks || data.data || data;
          commit("SET_TASKS", Array.isArray(tasksData) ? tasksData : []);
          commit("SET_LOADING", false);
        })
        .catch((error) => {
          commit("SET_ERROR", error.message || "Failed to fetch tasks");
          commit("SET_LOADING", false);
        });

      return promise;
    },

    setSearchQuery({ commit }, query) {
      commit("SET_SEARCH_QUERY", query);
    },
  },

  getters: {
    currentView: (state) => state.viewMode,
    allTasks: (state) => state.tasks,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    searchQuery: (state) => state.searchQuery,
    filteredTasks: (state) => {
      if (!state.searchQuery.trim()) {
        return state.tasks;
      }
      const query = state.searchQuery.toLowerCase();
      return state.tasks.filter(
        (task) =>
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query),
      );
    },
  },
};
