import api from "@/api";

import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const state = {
  users: [],
  usersignin: null,
  useridsignin: null,
  userbyid: [],
  token: cookies.get("token"),
  isLoading: false,
  error: null,
  viewMode: "list",
};

const getters = {
  usersList: (state) => state.users,
  usersignin: (state) => state.usersignin,
  useridsignin: (state) => state.useridsignin,
  userbyid: (state) => state.userbyid,
  allUsers: (state) => state.users,
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,
  currentView: (state) => state.viewMode,
};

const actions = {
  fetchAllusers({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get("userscrm", {
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
        commit("setusers", data.users);
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

  getusersignin({ commit }) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get("user/", {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });
        resolve(network);
      } catch (error) {
        // Jika endpoint Sanctum tidak bekerja, coba endpoint JWT
        if (error.response && error.response.status === 404) {
          try {
            let jwtNetwork = await api.get("getAuthenticatedUser", {
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
        const userData = data.data.user || data.data; // JWT mengembalikan langsung user object
        commit("setuseridsignin", userData.id);
        commit("setusersignin", userData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return promise;
  },

  fetchuserbyid(context, id) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = api.get("fetchuserbyid/" + id, {
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
      context.commit("setuserbyid", data.data);
      // console.log(data.data);
    });
    // console.log(promise.data);

    // console.log(id);
    return promise;
  },

  insertuser(context, data) {
    // Gunakan saveUser dengan choice='i' untuk backward compatibility
    const payload = {
      choice: "i",
      ...data,
    };
    return context.dispatch("saveUser", payload);
  },

  async saveUser({ commit, dispatch }, formData) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const choice = formData.choice || (formData.id ? "u" : "i");
      const requestPayload = {
        ...formData,
        choice,
      };

      const network = await api.post("userscrm/input", requestPayload, {
        headers: {
          Authorization: "Bearer " + cookies.get("token"),
        },
      });

      // Keep table reactive after create/update.
      if (requestPayload.id) {
        commit("UPSERT_USER", requestPayload);
      }

      await dispatch("fetchAllusers").catch(() => {});
      return network.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  reguser(context, data) {
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
      context.dispatch("fetchAllusers");
    });

    return promise;
  },

  updateuser(context, data) {
    // Gunakan saveUser dengan choice='u' untuk backward compatibility
    const payload = {
      choice: "u",
      id: data.keyedit,
      ...data.formdata,
    };
    return context.dispatch("saveUser", payload);
  },

  async deleteuser({ commit, dispatch }, data) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const id = data?.id || data;
      const payload = {
        choice: "d",
        id,
      };

      const network = await api.post("userscrm/input", payload, {
        headers: {
          Authorization: "Bearer " + cookies.get("token"),
        },
      });

      commit("DELETE_USER", id);
      await dispatch("fetchAllusers").catch(() => {});
      return network.data;
    } catch (error) {
      commit("SET_ERROR", error.message);
      throw error;
    } finally {
      commit("SET_LOADING", false);
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
      // context.dispatch("fetchAllusers");
    });

    promise.then((data) => {
      // console.log(data);
    });
  },

  saveUserProfile(context, data) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.post("userscrm/input", data, {
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
      context.dispatch("fetchAllusers");
    });

    return promise;
  },

  setViewMode({ commit }, mode) {
    commit("SET_VIEW_MODE", mode);
  },
};

const mutations = {
  setusers: (state, users) => {
    state.users = users;
  },
  setusersignin: (state, user) => {
    state.usersignin = user;
  },
  setuseridsignin: (state, user) => {
    state.useridsignin = user;
  },

  setuserbyid: (state, user) => {
    state.userbyid = user;
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
  DELETE_USER(state, userId) {
    state.users = state.users.filter((user) => user.id !== userId);
  },
  UPSERT_USER(state, userData) {
    const index = state.users.findIndex((user) => user.id === userData.id);
    if (index >= 0) {
      state.users.splice(index, 1, { ...state.users[index], ...userData });
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

// export default {
//   namespaced: true,

//   state: () => ({
//     users: [],
//     isLoading: false,
//     error: null,
//     viewMode: "list",
//   }),

//   mutations: {
//     SET_USERS(state, users) {
//       state.users = users;
//     },
//     SET_LOADING(state, isLoading) {
//       state.isLoading = isLoading;
//     },
//     SET_ERROR(state, error) {
//       state.error = error;
//     },
//     SET_VIEW_MODE(state, mode) {
//       state.viewMode = mode;
//     },
//   },

//   actions: {
//     async fetchUsers({ commit, rootState }) {
//       commit('SET_LOADING', true);
//       commit('SET_ERROR', null);

//       try {
//         const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
//         const response = await fetch(`${apiBaseUrl}/api/userscrm/`, {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${rootState.auth.token}`,
//             "Accept": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch users: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("DEBUG: Vuex fetchUsers raw data:", data);

//         let extractedUsers = [];
//         // Handle various response formats found during debugging
//         if (data && Array.isArray(data.users)) {
//           extractedUsers = data.users;
//         } else if (data && typeof data.users === 'object' && data.users !== null) {
//           extractedUsers = Object.values(data.users).filter(u => typeof u === 'object');
//         } else if (Array.isArray(data)) {
//           extractedUsers = data;
//         } else if (data && Array.isArray(data.data)) {
//           extractedUsers = data.data;
//         }

//         commit('SET_USERS', extractedUsers);
//         return extractedUsers;
//       } catch (error) {
//         console.error("Vuex fetchUsers error:", error);
//         commit('SET_ERROR', error.message);
//         throw error;
//       } finally {
//         commit('SET_LOADING', false);
//       }
//     },
//     setViewMode({ commit }, mode) {
//       commit("SET_VIEW_MODE", mode);
//     },
//   },

//   getters: {
//     allUsers: (state) => state.users,
//     isLoading: (state) => state.isLoading,
//     error: (state) => state.error,
//     currentView: (state) => state.viewMode,
//   }
// };
