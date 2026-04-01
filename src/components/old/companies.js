import api from "@/api";

import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const extractCompaniesArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.companies)) return payload.companies;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const extractPaginationMeta = (payload) => {
  const container =
    payload?.data && !Array.isArray(payload.data) ? payload.data : payload;

  const currentPage = Number(container?.current_page);
  const lastPage = Number(container?.last_page);

  if (!Number.isFinite(currentPage) || !Number.isFinite(lastPage)) {
    return null;
  }

  return {
    currentPage,
    lastPage,
  };
};

const dedupeCompaniesById = (companies) => {
  const seen = new Set();

  return companies.filter((company) => {
    const key = String(company?.id ?? company?.company_id ?? "");

    if (!key) {
      return true;
    }

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const state = {
  company: [],
  companyignin: null,
  companyidsignin: null,
  companybyid: [],
  token: cookies.get("token"),
  isLoading: false,
  error: null,
  viewMode: "list",
  searchQuery: "",
  currentPage: 1,
  itemsPerPage: 10,
};

const getters = {
  companyList: (state) => state.company,
  companysignin: (state) => state.companysignin,
  companyidsignin: (state) => state.companyidsignin,
  companybyid: (state) => state.companybyid,
  allcompany: (state) => state.company,
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,
  currentView: (state) => state.viewMode,
  searchQuery: (state) => state.searchQuery,
  filteredCompanies: (state) => {
    if (!state.searchQuery.trim()) {
      return state.company;
    }
    const query = state.searchQuery.toLowerCase();
    return state.company.filter(
      (company) =>
        company.name?.toLowerCase().includes(query) ||
        company.email?.toLowerCase().includes(query) ||
        company.phone?.toLowerCase().includes(query) ||
        company.country?.toLowerCase().includes(query),
    );
  },
  currentPage: (state) => state.currentPage,
  itemsPerPage: (state) => state.itemsPerPage,
};

const actions = {
  setCurrentPage({ commit }, page) {
    commit("SET_CURRENT_PAGE", page);
  },
  setItemsPerPage({ commit }, items) {
    commit("SET_ITEMS_PER_PAGE", items);
  },
  fetchAllcompany({ commit, state }, options = { forceRefresh: false }) {
    if (!options.forceRefresh && state.company && state.company.length > 0) {
      return Promise.resolve({ companies: state.company });
    }

    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get("company", {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
          // headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });

        const firstPayload = network.data;
        let companies = extractCompaniesArray(firstPayload);

        const paginationMeta = extractPaginationMeta(firstPayload);

        if (paginationMeta && paginationMeta.lastPage > 1) {
          for (let page = 2; page <= paginationMeta.lastPage; page += 1) {
            const pageResponse = await api.getbydata(
              "company",
              { page },
              {
                headers: {
                  Authorization: "Bearer " + cookies.get("token"),
                },
              },
            );

            companies = companies.concat(
              extractCompaniesArray(pageResponse.data),
            );
          }
        }

        resolve({
          raw: firstPayload,
          companies: dedupeCompaniesById(companies),
        });
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        const companiesData = data.companies || extractCompaniesArray(data.raw);
        commit("setcompany", companiesData);
        commit("SET_LOADING", false);
      })
      .catch((error) => {
        // Tangani error lain jika ada
        console.error("Error:", error);
        commit("SET_ERROR", error.message);
        commit("SET_LOADING", false);
      });

    return promise;
  },

  getcompanyignin({ commit }) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get("company/", {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });
        resolve(network);
      } catch (error) {
        // Jika endpoint Sanctum tidak bekerja, coba endpoint JWT
        if (error.response && error.response.status === 404) {
          try {
            let jwtNetwork = await api.get("getAuthenticatedcompany", {
              headers: {
                Authorization: "Bearer " + cookies.get("token"),
              },
            });
            resolve(jwtNetwork);
          } catch (jwtError) {
            reject(jwtError);
          }
        } else {
          reject(error);
        }
      }
    });

    promise
      .then((data) => {
        // Handle response dari Sanctum atau JWT
        const companyData = data.data.company || data.data; // JWT mengembalikan langsung company object
        commit("setcompanyidsignin", companyData.id);
        commit("setcompanyignin", companyData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return promise;
  },

  fetchcompanybyid(context, id) {
    let data = {
      id: id,
    };
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = api.getbydata("company/fetchcompanybyid", data, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
          // headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        resolve(network);
      } catch (error) {
        reject(error);
      }
    });

    promise.then((data) => {
      context.commit("setcompanybyid", data.data);
      // console.log(data.data);
    });
    // console.log(promise.data);

    // console.log(id);
    return promise;
  },

  getcompany(context, data) {
    context.commit("SET_LOADING", true);
    context.commit("SET_ERROR", null);
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = api.getbydata("company", data, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
          // headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        resolve(network);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        console.log("companies mod => ", data);
        context.commit("setcompany", data.data.companies);
        context.commit("SET_LOADING", false);
      })
      .catch((error) => {
        // Tangani error lain jika ada
        console.error("Error:", error);
        context.commit("SET_ERROR", error.message);
        context.commit("SET_LOADING", false);
      });
    // console.log(promise.data);

    // console.log(id);
    return promise;
  },

  insertcompany(context, data) {
    // Gunakan saveCompany dengan choice='i' untuk backward compatibility
    const payload = {
      choice: "i",
      ...data.formdata,
    };
    return context.dispatch("saveCompany", payload);
  },

  saveCompany(context, formData) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        // Tentukan choice: 'i' untuk insert, 'u' untuk update
        const choice = formData.choice || (formData.id ? "u" : "i");

        const requestPayload = {
          choice: choice,
          ...formData,
        };

        let network = await api.post("company/input", requestPayload, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });

        // Refresh daftar HANYA setelah sukses dan tunggu sampai selesai
        await context.dispatch("fetchAllcompany");

        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  },

  regcompany(context, data) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.post("reg", data, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
          // headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
      context.dispatch("fetchAllcompany");
    });

    return promise;
  },

  updatecompany(context, data) {
    // Gunakan saveCompany dengan choice='u' untuk backward compatibility
    const payload = {
      choice: "u",
      id: data.keyedit,
      ...data.formdata,
    };
    return context.dispatch("saveCompany", payload);
  },

  async deletecompany(context, data) {
    const headers = {
      Authorization: "Bearer " + cookies.get("token"),
    };

    try {
      const response = await api.post(
        "company/input",
        {
          choice: "d",
          id: data,
          company_name: "",
          company_owner: "",
          website: "",
          type: "",
          description: "",
          email: "",
          telephone: "",
          website: "",
          industry: "",
          address: "",
          country: "",
          city: "",
          province: "",
          pos_code: "",
          source: "",
          type: "",
          owner: "",
        },
        { headers },
      );
      await context.dispatch("fetchAllcompany");
      return response.data;
    } catch (error) {
      await context.dispatch("fetchAllcompany");
      throw error;
    }
  },

  updateprofile(context, data) {
    // console.log(data);
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.post(`editprofile`, data, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
          // headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
      // context.dispatch("fetchAllcompany");
    });

    promise.then((data) => {
      // console.log(data);
    });
  },

  setSearchQuery({ commit }, query) {
    commit("SET_SEARCH_QUERY", query);
  },

  savecompanyProfile(context, data) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.post("company/input", data, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise.then(() => {
      context.dispatch("fetchAllcompany");
    });

    return promise;
  },

  setViewMode({ commit }, mode) {
    commit("SET_VIEW_MODE", mode);
  },
};

const mutations = {
  setcompany: (state, company) => {
    state.company = company;
  },
  setcompanyignin: (state, company) => {
    state.companyignin = company;
  },
  setcompanyidsignin: (state, company) => {
    state.companyidsignin = company;
  },

  setcompanybyid: (state, company) => {
    state.companybyid = company;
  },

  SET_LOADING(state, isLoading) {
    state.isLoading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_VIEW_MODE(state, mode) {
    state.viewMode = mode;
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
