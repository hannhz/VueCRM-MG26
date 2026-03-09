export default {
  namespaced: true,

  state: () => ({
    preferences: {},
    viewMode: "", // maybe not needed for settings
  }),

  mutations: {
    SET_PREFERENCES(state, prefs) {
      state.preferences = prefs;
    },
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },
  },

  actions: {
    setPreferences({ commit }, prefs) {
      commit("SET_PREFERENCES", prefs);
    },
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },
  },

  getters: {
    allPreferences: (state) => state.preferences,
    currentView: (state) => state.viewMode,
  },
};
