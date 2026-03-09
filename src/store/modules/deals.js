import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const normalizeNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapCreateDealPayload = (formData = {}) => {
  const normalizedAmount = normalizeNumber(formData.amount);

  return {
    // Mapping utama sesuai kolom DB
    deal_name: formData.dealName?.trim() || null,
    pipeline: formData.pipeline || null,
    currency: formData.currency || "IDR",
    amount_value: normalizedAmount,
    expected_close_date: formData.expectedCloseDate || null,
    owner: formData.owner || null,
    priority: formData.priority || null,
    source: formData.source || null,
    // Alias untuk kompatibilitas variasi backend
    name: formData.dealName?.trim() || null,
    dealName: formData.dealName?.trim() || null,
    amount: normalizedAmount,
    stage: formData.pipeline || "new",
    expectedCloseDate: formData.expectedCloseDate || null,
  };
};

const mapBoardStageToPipeline = (stage) => {
  const stageMap = {
    new: "new",
    qualified: "qualified",
    advanced: "negotiation",
    payment: "proposal",
    won: "closed_won",
    lost: "closed_lost",
  };

  return stageMap[stage] || stage || "new";
};

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

    ADD_DEAL(state, deal) {
      state.deals = [deal, ...state.deals];
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
          const response = await api.get("deals", {
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
          const status = error?.response?.status;
          const serverMessage = error?.response?.data?.message;
          commit(
            "SET_ERROR",
            serverMessage ||
              (status
                ? status === 404
                  ? "Endpoint deals tidak ditemukan di server (404)."
                  : `Fetch deals gagal (HTTP ${status})`
                : error.message || "Failed to fetch deals"),
          );
          commit("SET_LOADING", false);
        });

      return promise;
    },

    async updateDealStage({ commit }, payload) {
      const { dealId, newStage } = payload;
      const pipelineValue = mapBoardStageToPipeline(newStage);
      const apiStageValue = pipelineValue;

      commit("UPDATE_DEAL_STAGE", { dealId, newStage });

      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };

      const candidates = [
        () =>
          api.post(
            "deal/update-stage",
            {
              id: dealId,
              stage: apiStageValue,
              pipeline: pipelineValue,
              board_stage: newStage,
            },
            { headers },
          ),
        () =>
          api.post(
            "deal/updatestage",
            {
              id: dealId,
              stage: apiStageValue,
              pipeline: pipelineValue,
              board_stage: newStage,
            },
            { headers },
          ),
        () =>
          api.post(
            `deal/updateusr?id=${dealId}`,
            {
              stage: apiStageValue,
              pipeline: pipelineValue,
              board_stage: newStage,
            },
            { headers },
          ),
        () =>
          api.post(
            `deal/update?id=${dealId}`,
            {
              stage: apiStageValue,
              pipeline: pipelineValue,
              board_stage: newStage,
            },
            { headers },
          ),
        () =>
          api.post(
            `deals/updateusr?id=${dealId}`,
            {
              stage: apiStageValue,
              pipeline: pipelineValue,
              board_stage: newStage,
            },
            { headers },
          ),
        () =>
          api.post(
            "deals/update",
            {
              id: dealId,
              stage: apiStageValue,
              pipeline: pipelineValue,
              board_stage: newStage,
            },
            { headers },
          ),
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

    async createDeal({ commit, dispatch }, formData) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const payload = mapCreateDealPayload(formData);
      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };

      try {
        const response = await api.post("deals/input", payload, { headers });

        await dispatch("fetchAllDeals").catch(() => {
          const createdDeal = response?.data?.deal || response?.data?.data;
          if (createdDeal) {
            commit("ADD_DEAL", createdDeal);
          }
        });
        commit("SET_LOADING", false);
        return response.data;
      } catch (error) {
        const status = error?.response?.status;
        const serverMessage = error?.response?.data?.message;
        commit(
          "SET_ERROR",
          serverMessage ||
            (status
              ? status === 404
                ? "Endpoint input deal tidak ditemukan di server (404)."
                : `Create deal gagal (HTTP ${status})`
              : error?.message || "Failed to create deal in API."),
        );
        commit("SET_LOADING", false);
        throw error;
      }
    },

    // Backward compatibility for older callers that still dispatch `deals/input`.
    input({ dispatch }, formData) {
      return dispatch("createDeal", formData);
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
      return state.deals.filter(
        (deal) =>
          deal.name?.toLowerCase().includes(query) ||
          deal.deal_name?.toLowerCase().includes(query) ||
          deal.contact?.toLowerCase().includes(query) ||
          deal.company?.toLowerCase().includes(query),
      );
    },
  },
};
