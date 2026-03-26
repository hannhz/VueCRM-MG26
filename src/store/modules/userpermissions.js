import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const state = {
  permissions: [],
  isLoading: false,
  error: null,
};

const getters = {
  allPermissions: (state) => state.permissions,
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,
};

const actions = {
  async loadPermissions({ commit }, { username }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      console.log(
        "[Vuex] userpermissions/loadPermissions - Loading for user:",
        username,
      );

      const response = await api.get("user/permissions", {
        params: { username },
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      });

      console.log(
        "[Vuex] userpermissions/loadPermissions - Response:",
        response.data,
      );
      commit("SET_PERMISSIONS", response.data);
      commit("SET_LOADING", false);
      return response.data;
    } catch (error) {
      console.error("[Vuex] userpermissions/loadPermissions - Error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load permissions";
      commit("SET_ERROR", message);
      commit("SET_LOADING", false);
      throw error;
    }
  },

  async savePermissions({ commit }, payload) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      console.log(
        "[Vuex] userpermissions/savePermissions - Saving payload:",
        payload,
      );

      const response = await api.post("user/permissions", payload, {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      });

      console.log(
        "[Vuex] userpermissions/savePermissions - Response:",
        response.data,
      );
      commit("SET_LOADING", false);
      return response.data;
    } catch (error) {
      console.error("[Vuex] userpermissions/savePermissions - Error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save permissions";
      commit("SET_ERROR", message);
      commit("SET_LOADING", false);
      throw error;
    }
  },
};

const mutations = {
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions;
  },
  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
