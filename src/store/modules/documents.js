export default {
  namespaced: true,

  state: () => ({
    documents: [],
    viewMode: "list",
  }),

  mutations: {
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },
    SET_DOCUMENTS(state, docs) {
      state.documents = docs;
    },
  },

  actions: {
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },
  },

  getters: {
    currentView: (state) => state.viewMode,
    allDocuments: (state) => state.documents,
  },
};
