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
  DELETE_CONTACT(state, contactId) {
    state.contacts = state.contacts.filter(
      (contact) => contact.id !== contactId,
    );
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

    // Tentukan choice: 'i' untuk insert (create), 'u' untuk update
    const choice = contactData.id ? "u" : "i";

    const requestPayload = {
      choice: choice,
      ...contactData,
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await api.post("contact/input", requestPayload, {
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
        const operationType = choice === "i" ? "created" : "updated";
        console.log(`Contact ${operationType} successfully:`, data);
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

  // Alias untuk update contact (backward compatibility)
  updateContact({ dispatch }, contactData) {
    return dispatch("createContact", contactData);
  },

  async deleteContact({ commit, dispatch }, contactId) {
    const headers = {
      Authorization: "Bearer " + cookies.get("token"),
    };

    try {
      const response = await api.post(
        "contact/input",
        { choice: "d", id: contactId },
        { headers },
      );
      commit("DELETE_CONTACT", contactId);
      await dispatch("fetchAllContacts").catch(() => {});
      return response.data;
    } catch (error) {
      await dispatch("fetchAllContacts").catch(() => {});
      throw error;
    }
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
