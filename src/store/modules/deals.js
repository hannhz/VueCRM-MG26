import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

export default {
  namespaced: true,

  state: () => ({
    deals: [],
    viewMode: "card", // default
    isLoading: false,
    error: null,
    searchQuery: "", // Add search state
  }),

  mutations: {
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },

    SET_DEALS(state, deals) {
      state.deals = deals;
    },

    UPDATE_DEAL_STAGE(state, payload) {
      const { dealId, newStage } = payload;
      const targetDeal = state.deals.find((deal) => deal.id === dealId);
      if (targetDeal) {
        targetDeal.stage = newStage;
      }
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
  },

  actions: {
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },

    setSearchQuery({ commit }, query) {
      commit("SET_SEARCH_QUERY", query);
    },

    fetchAllDeals({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await api.get("deal", {
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
          const dealsData = data.deals || data.data || data;
          commit("SET_DEALS", Array.isArray(dealsData) ? dealsData : []);
          commit("SET_LOADING", false);
        })
        .catch((error) => {
          commit("SET_ERROR", error.message || "Failed to fetch deals");
          commit("SET_LOADING", false);
        });

      return promise;
    },

    async updateDealStage({ commit }, payload) {
      const { dealId, newStage } = payload;

      commit("UPDATE_DEAL_STAGE", { dealId, newStage });

      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };

      const candidates = [
        () => api.post("deal/update-stage", { id: dealId, stage: newStage }, { headers }),
        () => api.post("deal/updatestage", { id: dealId, stage: newStage }, { headers }),
        () =>
          api.post(
            `deal/updateusr?id=${dealId}`,
            { stage: newStage, pipeline: newStage },
            { headers },
          ),
        () => api.post(`deal/update?id=${dealId}`, { stage: newStage }, { headers }),
      ];

      let lastError = null;
      for (const run of candidates) {
        try {
          const response = await run();
          return response.data;
        } catch (error) {
          lastError = error;
        }
      }

      throw lastError || new Error("Failed to update deal stage");
    },
  },

  getters: {
    currentView: (state) => state.viewMode,
    allDeals: (state) => state.deals,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    searchQuery: (state) => state.searchQuery,
    filteredDeals: (state) => {
      if (!state.searchQuery.trim()) {
        return state.deals;
      }
      const query = state.searchQuery.toLowerCase();
      return state.deals.filter((deal) =>
        deal.name?.toLowerCase().includes(query) ||
        deal.contact?.toLowerCase().includes(query) ||
        deal.company?.toLowerCase().includes(query)
      );
    },
  },
};