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

    UPDATE_DEAL(state, payload) {
      const { dealId, updatedData } = payload;
      const index = state.deals.findIndex((deal) => deal.id === dealId);
      if (index !== -1) {
        state.deals[index] = { ...state.deals[index], ...updatedData };
      }
    },

    DELETE_DEAL(state, dealId) {
      state.deals = state.deals.filter((deal) => deal.id !== dealId);
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

    async updateDealStage({ commit, state }, payload) {
      const { dealId, newStage } = payload;
      const pipelineValue = mapBoardStageToPipeline(newStage);
      const apiStageValue = pipelineValue;

      commit("UPDATE_DEAL_STAGE", { dealId, newStage });

      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };

      // Cari deal yang akan diupdate untuk mendapatkan data lengkapnya
      const existingDeal = state.deals.find((deal) => deal.id === dealId);

      // Gunakan endpoint deals/input dengan choice='u' (update)
      const requestPayload = {
        choice: "u",
        id: dealId,
        // Kirim data yang sudah ada + stage/pipeline yang baru
        deal_name: existingDeal?.deal_name || existingDeal?.name || null,
        pipeline: pipelineValue,
        currency: existingDeal?.currency || "IDR",
        amount_value:
          existingDeal?.amount_value || existingDeal?.amount || null,
        expected_close_date: existingDeal?.expected_close_date || null,
        owner: existingDeal?.owner || null,
        priority: existingDeal?.priority || null,
        source: existingDeal?.source || null,
        stage: apiStageValue,
      };

      try {
        const response = await api.post("deals/input", requestPayload, {
          headers,
        });
        return response.data;
      } catch (error) {
        // Rollback jika gagal
        commit("UPDATE_DEAL_STAGE", {
          dealId,
          newStage: existingDeal?.stage || "new",
        });
        throw error;
      }
    },

    async createDeal({ commit, dispatch }, formData) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const payload = mapCreateDealPayload(formData);
      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };

      // Menentukan choice: 'i' untuk insert (create), 'u' untuk update
      const choice = formData.id ? "u" : "i";

      // Payload sesuai pattern TaskController
      const requestPayload = {
        choice: choice,
        id: formData.id || null,
        deal_name: payload.deal_name,
        pipeline: payload.pipeline,
        currency: payload.currency,
        amount_value: payload.amount_value,
        expected_close_date: payload.expected_close_date,
        owner: payload.owner,
        priority: payload.priority,
        source: payload.source,
        stage: payload.stage,
      };

      try {
        const response = await api.post("deals/input", requestPayload, {
          headers,
        });

        await dispatch("fetchAllDeals").catch(() => {
          const createdDeal = response?.data?.deal || response?.data?.data;
          if (createdDeal) {
            if (choice === "i") {
              commit("ADD_DEAL", createdDeal);
            }
          }
        });
        commit("SET_LOADING", false);
        return response.data;
      } catch (error) {
        const status = error?.response?.status;
        const serverMessage = error?.response?.data?.message;
        const operationType = choice === "i" ? "Create" : "Update";
        commit(
          "SET_ERROR",
          serverMessage ||
            (status
              ? status === 404
                ? "Endpoint input deal tidak ditemukan di server (404)."
                : `${operationType} deal gagal (HTTP ${status})`
              : error?.message ||
                `Failed to ${operationType.toLowerCase()} deal in API.`),
        );
        commit("SET_LOADING", false);
        throw error;
      }
    },

    // Backward compatibility for older callers that still dispatch `deals/input`.
    input({ dispatch }, formData) {
      return dispatch("createDeal", formData);
    },

    async updateDeal({ commit, dispatch }, payload) {
      const { keyedit, formdata } = payload;

      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };

      // Payload untuk update deal
      const requestPayload = {
        choice: "u",
        id: keyedit,
        deal_name: formdata.deal_name,
        pipeline: formdata.pipeline,
        currency: formdata.currency || "IDR",
        amount_value: formdata.amount || formdata.amount_value,
        expected_close_date: formdata.expected_close_date,
        owner: formdata.owner,
        priority: formdata.priority,
        source: formdata.source,
        stage: formdata.stage || formdata.pipeline,
        description: formdata.description,
      };

      try {
        const response = await api.post("deals/input", requestPayload, {
          headers,
        });

        // Update local state
        commit("UPDATE_DEAL", {
          dealId: keyedit,
          updatedData: {
            ...formdata,
            id: keyedit,
            stage: formdata.stage || formdata.pipeline,
            pipeline: formdata.pipeline,
          },
        });

        // Optionally refresh from server
        await dispatch("fetchAllDeals").catch(() => {});

        commit("SET_LOADING", false);
        return response.data;
      } catch (error) {
        const status = error?.response?.status;
        const serverMessage = error?.response?.data?.message;
        commit(
          "SET_ERROR",
          serverMessage ||
            (status
              ? `Update deal gagal (HTTP ${status})`
              : error?.message || "Failed to update deal"),
        );
        commit("SET_LOADING", false);
        throw error;
      }
    },

    async deleteDeal({ commit, dispatch }, dealId) {
      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };

      try {
        const response = await api.post(
          "deals/input",
          { choice: "d", id: dealId },
          { headers },
        );
        commit("DELETE_DEAL", dealId);
        await dispatch("fetchAllDeals").catch(() => {});
        return response.data;
      } catch (error) {
        await dispatch("fetchAllDeals").catch(() => {});
        throw error;
      }
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
