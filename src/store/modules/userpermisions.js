import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const state = {
  permissions: [],
  loading: false,
  saving: false,
  error: null,
};

const getters = {
  permissions: (state) => state.permissions,
  loading: (state) => state.loading,
  saving: (state) => state.saving,
  error: (state) => state.error,
};

const mutations = {
  SET_PERMISSIONS(state, data) {
    state.permissions = data;
  },

  SET_LOADING(state, val) {
    state.loading = val;
  },

  SET_SAVING(state, val) {
    state.saving = val;
  },

  SET_ERROR(state, payload) {
    state.error = payload;
  },
};

const actions = {
  loadPermissions({ commit }, username) {
    commit("SET_LOADING", true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.post("berkas/getflmenu", username, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });

        resolve(network.data);
      } catch (error) {
        reject(error);
        commit("SET_ERROR", error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    });
    return promise;
  },

  savePermissions({ commit }, payload) {
    commit("SET_SAVING", true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.post("berkas/saveedit", payload, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });

        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
