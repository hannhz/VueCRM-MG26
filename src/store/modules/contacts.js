import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const state = {
  contacts: [],
  isLoading: false,
  error: null,
  viewMode: "list",
};

const getters = {
  currentView: (state) => state.viewMode,
  allContacts: (state) => state.contacts,
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,
};

const mutations = {
  SET_VIEW_MODE(state, mode) {
    state.viewMode = mode;
  },
  SET_CONTACTS(state, contacts) {
    state.contacts = contacts;
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  fetchAllContacts({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await api.get("contact", {
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
        const contactsData = data.contacts || data.data || data;
        commit("SET_CONTACTS", contactsData);
        commit("SET_LOADING", false);
      })
      .catch((error) => {
        console.error("Vuex fetchAllContacts error:", error);
        commit("SET_ERROR", error.message);
        commit("SET_LOADING", false);
      });

    return promise;
  },

  createContact({ commit, dispatch }, contactData) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await api.post("contact/input", contactData, {
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
        console.log("Contact created successfully:", data);
        dispatch("fetchAllContacts");
        commit("SET_LOADING", false);
      })
      .catch((error) => {
        console.error("Vuex createContact error:", error);
        commit("SET_ERROR", error.message);
        commit("SET_LOADING", false);
      });

    return promise;
  },

  setViewMode({ commit }, mode) {
    commit("SET_VIEW_MODE", mode);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
