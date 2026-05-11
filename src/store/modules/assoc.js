import api from "@/api";
import { useCookies } from "vue3-cookies";
import { getDetailEndpointCandidates } from "@/utils/detailFormPayload";

const { cookies } = useCookies();

const state = {
  companys: [],
  contacts: [],
  deals: [],
  projects: [],
};

const getters = {
  allCompanys: (state) => state.companys,
  allContacts: (state) => state.contacts,
  // allContacts: (state) => {
  //   // console.log("Getting all contacts from state:", state.contacts);
  //   return state.contacts.data || [];
  // },
  nextpagecontacts: (state) => state.contacts.next_page_url,
  prevpagecontacts: (state) => state.contacts.prev_page_url,

  allDeals: (state) => state.deals,
  allprojects: (state) => state.projects,
};

const mutations = {
  setcompanys(state, payload) {
    state.companys = payload;
  },
  setcontacts(state, payload) {
    state.contacts = payload;
  },
  setprojects(state, payload) {
    state.projects = payload;
  },
  setdeals(state, payload) {
    state.deals = payload;
  },

  appendContacts(state, payload) {
    state.contacts = [...state.contacts, ...payload];
  },

  appendcompanys(state, payload) {
    state.companys = [...state.companys, ...payload];
  },
  appendProjects(state, payload) {
    state.projects = [...state.projects, ...payload];
  },

  appendDeals(state, payload) {
    state.deals = [...state.deals, ...payload];
  },

  resetContacts(state) {
    state.contacts = [];
  },

  resetprojects(state) {
    state.projects = [];
  }
};

const actions = {
  getcompanys(context, params = {}) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.getbydata("assoc/company", params, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        console.log("Data received in getcompanys action:", data);
        // context.commit("setcompanys", data);
        if (!params.page || params.page === 1) {
          context.commit("setcompanys", data.data);
        } else {
          // 🔥 kalau page berikutnya → append
          context.commit("appendcompanys", data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return promise;
  },

  getcontacts(context, params = {}) {
    // if (params.search !== "") {
    //   params.page = 1; // reset page
    // }
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.getbydata("assoc/contact", params, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        // 🔥 kalau page 1 → reset
        if (!params.page || params.page === 1) {
          context.commit("setcontacts", data.data);
        } else {
          // 🔥 kalau page berikutnya → append
          context.commit("appendContacts", data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return promise;
  },

  getdeals(context,params = {}) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get("assoc/deals", {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        if (!params.page || params.page === 1) {
          context.commit("setdeals", data.data);
        } else {
          // 🔥 kalau page berikutnya → append
          context.commit("appendDeals", data.data);
        }
        // context.commit("setdeals", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return promise;
  },

  getprojects(context, params = {}) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.getbydata("assoc/project", params, {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        console.log("Data received in getprojects action:", data);
        // context.commit("setprojects", data);
        if (!params.page || params.page === 1) {
          context.commit("setprojects", data.data);
        } else {
          // 🔥 kalau page berikutnya → append
          context.commit("appendProjects", data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return promise;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
