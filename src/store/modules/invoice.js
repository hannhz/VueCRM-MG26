import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const state = {
  invoices: [],
  resinvoice: {},
  token: cookies.get("token"),
  isLoading: false,
  error: null,
  searchQuery: "",
  currentPage: 1,
  itemsPerPage: 10,
};

const getters = {
  invoiceList: (state) => state.invoices,
  getResinvoice: (state) => state.resinvoice,
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,
  searchQuery: (state) => state.searchQuery,
  currentPage: (state) => state.currentPage,
  itemsPerPage: (state) => state.itemsPerPage,
};

const actions = {
  async fetchAllinvoice({ commit }, { page = 1, per_page = 10, search = "" } = {}) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const response = await api.get("invoices", {
        params: {
          page,
          per_page,
          search,
        },
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
        },
      });

      const invoices = Array.isArray(response.data?.data) 
        ? response.data.data 
        : Array.isArray(response.data) 
          ? response.data 
          : [];

      const pagination = {
        total: response.data?.total || invoices.length,
        current_page: response.data?.current_page || page,
        last_page: response.data?.last_page || 1,
        per_page: response.data?.per_page || per_page,
      };

      commit("SET_INVOICES", invoices);
      commit("SET_PAGINATION", pagination);
      commit("SET_LOADING", false);

      return { data: invoices, pagination };
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      commit("SET_ERROR", error.message || "Failed to fetch invoices");
      commit("SET_LOADING", false);
      throw error;
    }
  },

  setSearchQuery({ commit }, query) {
    commit("SET_SEARCH_QUERY", query);
  },

  setCurrentPage({ commit }, page) {
    commit("SET_CURRENT_PAGE", page);
  },

  setItemsPerPage({ commit }, items) {
    commit("SET_ITEMS_PER_PAGE", items);
  },

  clearInvoices({ commit }) {
    commit("SET_INVOICES", []);
    commit("SET_PAGINATION", {});
    commit("SET_ERROR", null);
  },
};

const mutations = {
  SET_INVOICES(state, invoices) {
    state.invoices = invoices;
  },

  SET_PAGINATION(state, pagination) {
    state.resinvoice = pagination;
  },

  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },

  SET_ERROR(state, error) {
    state.error = error;
  },

  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query;
  },

  SET_CURRENT_PAGE(state, page) {
    state.currentPage = page;
  },

  SET_ITEMS_PER_PAGE(state, items) {
    state.itemsPerPage = items;
  },

  CLEAR_STATE(state) {
    state.invoices = [];
    state.resinvoice = {};
    state.error = null;
    state.searchQuery = "";
    state.currentPage = 1;
    state.itemsPerPage = 10;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
