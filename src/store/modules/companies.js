import api from "@/api";

import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

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
};

const actions = {
  fetchAllcompany({ commit }) {
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

        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        commit("setcompany", data.companies || data);
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
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = api.get("fetchcompanybyid/" + id, {
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
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
      // refresh daftar setelah sukses/atau gagal
      context.dispatch("fetchAllcompany");
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
        { choice: "d", id: data },
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
