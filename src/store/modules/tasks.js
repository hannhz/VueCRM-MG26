export default {
  namespaced: true,

  state: () => ({
    tasks: [],
    viewMode: "list",
  }),

  mutations: {
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
  },

  actions: {
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },
  },

  getters: {
    currentView: (state) => state.viewMode,
    allTasks: (state) => state.tasks,
  },
};
