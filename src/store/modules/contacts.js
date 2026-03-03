export default {
  namespaced: true,

  state: () => ({
    contacts: [],
    viewMode: "list",
  }),

  mutations: {
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },
    SET_CONTACTS(state, contacts) {
      state.contacts = contacts;
    },
  },

  actions: {
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },
  },

  getters: {
    currentView: (state) => state.viewMode,
    allContacts: (state) => state.contacts,
  },
};
