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

const normalizeAssociationId = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
};

const resolveDealId = (responseData, fallbackId = null) => {
  const candidates = [
    responseData?.deal?.id,
    responseData?.data?.id,
    responseData?.id,
    responseData?.deal_id,
    fallbackId,
  ];

  return (
    candidates.find(
      (candidate) =>
        candidate !== "" && candidate !== null && candidate !== undefined,
    ) || null
  );
};

const mapCreateDealPayload = (formData = {}) => {
  const normalizedAmount = normalizeNumber(formData.amount);

  // Helper to ensure association is a string
  const formatAssoc = (assoc) => {
    if (Array.isArray(assoc)) {
      return assoc.filter(Boolean).join(",");
    }
    return assoc || "";
  };

  return {
    // Mapping utama sesuai kolom DB
    deal_name: formData.dealName?.trim() || formData.deal_name?.trim() || null,
    pipeline: formData.pipeline || null,
    currency: formData.currency || "IDR",
    amount_value: normalizedAmount,
    expected_close_date:
      formData.expectedCloseDate || formData.expected_close_date || null,
    owner: formData.owner || null,
    priority: formData.priority || null,
    source: formData.source || null,
    // Associations
    contactassoc: formatAssoc(formData.contactassoc || formData.contacts_id),
    companyassoc: formatAssoc(formData.companyassoc || formData.companies_id),
    // Alias untuk kompatibilitas variasi backend
    name: formData.dealName?.trim() || formData.deal_name?.trim() || null,
    dealName: formData.dealName?.trim() || formData.deal_name?.trim() || null,
    amount: normalizedAmount,
    stage: formData.pipeline || "new",
    expectedCloseDate:
      formData.expectedCloseDate || formData.expected_close_date || null,
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

const normalizeStage = (rawStage) => {
  const stage = String(rawStage || "new").toLowerCase();
  if (stage.includes("qual")) return "qualified";
  if (stage.includes("adv") || stage.includes("negot")) return "advanced";
  if (stage.includes("pay") || stage.includes("proposal")) return "payment";
  if (
    stage.includes("won") ||
    stage.includes("close_won") ||
    stage.includes("closed_won")
  )
    return "won";
  if (
    stage.includes("lost") ||
    stage.includes("close_lost") ||
    stage.includes("closed_lost")
  )
    return "lost";
  return "new";
};

export default {
  namespaced: true,

  state: () => ({
    deals: [],
    viewMode: "card", // default
    isLoading: false,
    error: null,
    searchQuery: "", // Add search state
    pagination: null, // Add pagination state
  }),

  mutations: {
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },

    SET_DEALS(state, deals) {
      state.deals = deals;
    },

    ADD_DEAL(state, deal) {
      if (!deal) return;
      // Map properties if needed to match frontend expectation
      const normalizedDeal = {
        ...deal,
        id: deal.id || Date.now(), // Fallback ID if missing
        name: deal.deal_name || deal.dealName || deal.name || "New Deal",
        stage: deal.pipeline || deal.stage || "new",
        amount: deal.amount_value || deal.amount || 0,
      };
      state.deals = [normalizedDeal, ...state.deals];
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
      const index = state.deals.findIndex(
        (deal) => String(deal.id) === String(dealId),
      );
      if (index !== -1) {
        // Create new array to trigger Vue 3 reactivity
        const newDeals = [...state.deals];
        newDeals[index] = { ...newDeals[index], ...updatedData };
        state.deals = newDeals;
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

    SET_PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
  },

  actions: {
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },

    setSearchQuery({ commit }, query) {
      commit("SET_SEARCH_QUERY", query);
    },

    fetchAllDeals({ commit }, params = {}) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const requestParams = { ...params };
      // Hapus &q= jika kosong agar backend tidak bingung
      if (
        requestParams.q === "" ||
        requestParams.q === null ||
        requestParams.q === undefined
      ) {
        delete requestParams.q;
      }

      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await api.get("deals", {
            params: requestParams,
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
          // Tangani struktur paginasi Laravel (deals.data)
          const dealsData = data.deals?.data || data.deals || data.data || data;

          commit("SET_DEALS", Array.isArray(dealsData) ? dealsData : []);

          // Simpan info paginasi jika ada
          if (data.deals && data.deals.current_page) {
            const { data: _, ...pagination } = data.deals;
            commit("SET_PAGINATION", pagination);
          } else if (data.current_page) {
            const { data: _, ...pagination } = data;
            commit("SET_PAGINATION", pagination);
          }

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

    fetchDealById({ commit }, id) {
      commit("SET_LOADING", true);
      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await api.get(`deals/fetchdealsbyid?id=${id}`, {
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
          commit("SET_LOADING", false);
          return data;
        })
        .catch((error) => {
          commit("SET_LOADING", false);
          throw error;
        });

      return promise;
    },

    async updateDealStage({ commit, state, dispatch }, payload) {
      const { dealId, newStage } = payload;
      const pipelineValue = mapBoardStageToPipeline(newStage);

      // Cari deal yang akan diupdate untuk mendapatkan data lengkapnya
      const existingDeal = state.deals.find(
        (deal) => String(deal.id) === String(dealId),
      );
      if (!existingDeal) return;

      const previousStage =
        existingDeal.stage || normalizeStage(existingDeal.pipeline);

      // Optimistic update
      commit("UPDATE_DEAL_STAGE", { dealId, newStage });

      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };

      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      // Helper to ensure association is a string
      const formatAssoc = (assoc) => {
        if (Array.isArray(assoc)) return assoc.filter(Boolean).join(",");
        if (assoc && typeof assoc === "object") return assoc.id || "";
        return assoc || "";
      };

      const cAssoc = formatAssoc(
        existingDeal.contactassoc ||
          existingDeal.dealsassoc ||
          existingDeal.contacts_id ||
          existingDeal.contact_id ||
          existingDeal.id_contact,
      );
      const mAssoc = formatAssoc(
        existingDeal.companyassoc ||
          existingDeal.companies_id ||
          existingDeal.company_id ||
          existingDeal.id_company,
      );

      const requestPayload = {
        choice: "u",
        id: dealId,
        id_deals: dealId,
        deal_name:
          existingDeal.deal_name ||
          existingDeal.name ||
          existingDeal.dealName ||
          "Untitled Deal",
        name: existingDeal.name || existingDeal.deal_name || "Untitled Deal",
        dealName:
          existingDeal.deal_name || existingDeal.name || "Untitled Deal",
        pipeline: pipelineValue,
        stage: pipelineValue,
        currency: existingDeal.currency || "IDR",
        amount_value: existingDeal.amount_value || existingDeal.amount || null,
        amount: existingDeal.amount_value || existingDeal.amount || null,
        expected_close_date:
          existingDeal.expected_close_date ||
          existingDeal.expectedCloseDate ||
          null,
        owner: existingDeal.owner || existingDeal.owner_name || null,
        priority: existingDeal.priority || null,
        source: existingDeal.source || null,
        updated_at: now,

        // Backend strongly requires these association fields (Flattened)
        contactassoc: cAssoc,
        companyassoc: mAssoc,
        contacts_id: cAssoc.split(",")[0] || "",
        companies_id: mAssoc.split(",")[0] || "",
        contact_id: cAssoc.split(",")[0] || "",
        company_id: mAssoc.split(",")[0] || "",

        // Notes, Tasks, & Docs
        notes: existingDeal.notes || "",
        docs: existingDeal.docs || "",
      };

      try {
        await api.post("deals/input", requestPayload, { headers });

        // PENTING: Refresh state dengan parameter yang sama agar tampilan tidak reset
        await dispatch("fetchAllDeals", {
          page: state.pagination?.current_page || 1,
          per_page: state.pagination?.per_page || 10,
          q: state.searchQuery,
        });

        return { success: true };
      } catch (error) {
        // Rollback jika gagal
        commit("UPDATE_DEAL_STAGE", {
          dealId,
          newStage: previousStage,
        });
        throw error;
      }
    },

    async saveDeal({ dispatch, commit }, formData) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const promise = new Promise(async (resolve, reject) => {
        try {
          // Tentukan choice: 'i' untuk insert, 'u' untuk update
          const choice = formData.choice || (formData.id ? "u" : "i");

          const requestPayload = {
            choice: choice,
            ...formData,
          };

          const response = await api.post("deals/input", requestPayload, {
            headers: {
              Authorization: "Bearer " + cookies.get("token"),
            },
          });

          // Refresh daftar dengan parameter yang sama agar tampilan tidak reset
          await dispatch("fetchAllDeals", {
            page: state.pagination?.current_page || 1,
            per_page: state.pagination?.per_page || 10,
            q: state.searchQuery,
          });

          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      });

      promise
        .then(() => {
          commit("SET_LOADING", false);
        })
        .catch((error) => {
          const status = error?.response?.status;
          const serverMessage = error?.response?.data?.message;
          commit(
            "SET_ERROR",
            serverMessage ||
              (status
                ? `Save deal gagal (HTTP ${status})`
                : error?.message || "Failed to save deal"),
          );
          commit("SET_LOADING", false);
        });

      return promise;
    },

    createDeal({ dispatch }, formData) {
      // Gunakan mapCreateDealPayload untuk memastikan key sesuai backend (deal_name, etc.)
      const mappedData = mapCreateDealPayload(formData);
      const payload = {
        choice: "i",
        ...formData,
        ...mappedData,
      };
      return dispatch("saveDeal", payload);
    },

    // Backward compatibility for older callers that still dispatch `deals/input`.
    input({ dispatch }, formData) {
      return dispatch("createDeal", formData);
    },

    async updateDeal({ dispatch }, payload) {
      const { keyedit, formdata } = payload;

      // Gunakan saveDeal dengan choice='u' untuk backward compatibility
      const requestPayload = {
        choice: "u",
        id: keyedit,
        ...formdata,
        // Backend strictly requires amount_value
        amount_value:
          formdata.amount !== undefined
            ? formdata.amount
            : formdata.amount_value,
      };

      return dispatch("saveDeal", requestPayload);
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
      return state.deals.filter((deal) => {
        return (
          deal.dealName?.toLowerCase().includes(query) ||
          deal.name?.toLowerCase().includes(query) ||
          deal.deal_name?.toLowerCase().includes(query)
        );
      });
    },

    pagination: (state) => state.pagination,
  },
};
