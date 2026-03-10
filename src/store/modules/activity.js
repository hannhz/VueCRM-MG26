const STORAGE_KEY = "crm_activity_logs";
const MAX_LOGS = 300;

const state = {
  logs: [],
};

const getters = {
  allActivities: (state) => state.logs,
  recentActivities: (state) => state.logs.slice(0, 100),
};

const mutations = {
  SET_LOGS(state, logs) {
    state.logs = Array.isArray(logs) ? logs : [];
  },
  ADD_LOG(state, log) {
    state.logs = [log, ...state.logs].slice(0, MAX_LOGS);
  },
  CLEAR_LOGS(state) {
    state.logs = [];
  },
};

const actions = {
  initializeActivities({ commit }) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      commit("SET_LOGS", parsed);
    } catch (error) {
      commit("SET_LOGS", []);
    }
  },

  appendActivity({ commit, state }, payload = {}) {
    const log = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      date: payload.date || new Date().toISOString(),
      action: payload.action || "Updated Data",
      user: payload.user || "System",
      note: payload.note || "-",
      entity: payload.entity || "system",
      operation: payload.operation || "u",
    };

    commit("ADD_LOG", log);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.logs));
    } catch (error) {
      // Ignore storage errors to avoid breaking primary user flow.
    }
  },

  clearActivities({ commit }) {
    commit("CLEAR_LOGS");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Ignore storage errors to avoid breaking primary user flow.
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
