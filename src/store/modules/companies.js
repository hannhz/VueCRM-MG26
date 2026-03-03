export default {
  namespaced: true,

  state: () => ({
    companies: [],
    viewMode: "list",
  }),

  mutations: {
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },
    SET_COMPANIES(state, companies) {
      state.companies = companies;
    },
  },

  actions: {
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },
  },

  getters: {
    currentView: (state) => state.viewMode,
    allCompanies: (state) => state.companies,
  },
};
