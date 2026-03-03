export default {
  namespaced: true,

  state: () => ({
    broadcasts: [],
    viewMode: "list",
  }),

  mutations: {
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },
    SET_BROADCASTS(state, items) {
      state.broadcasts = items;
    },
  },

  actions: {
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },
  },

  getters: {
    currentView: (state) => state.viewMode,
    allBroadcasts: (state) => state.broadcasts,
  },
};
