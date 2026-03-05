import api from "@/api";

import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const state = {
  users: [],
  usersignin: null,
  useridsignin: null,
  userbyid: [],
  token: cookies.get("token"),
};

const getters = {
  usersList: (state) => state.users,
  usersignin: (state) => state.usersignin,
  useridsignin: (state) => state.useridsignin,
  userbyid: (state) => state.userbyid,
};

const actions = {
  fetchAllusers({ commit }) {
    const promise =  new Promise(async (resolve, reject) => {
      try {
        let network = await api.get("users", {
          headers: {
            Authorization:
              "Bearer " + cookies.get("token"),
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
      })
      .catch((error) => {
        // Tangani error lain jika ada
        console.error("Error:", error);
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
            Authorization:
              "Bearer " + cookies.get("token"),
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
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.post("users/insertusr", data.formdata, {
          headers: {
            Authorization:
              "Bearer " + cookies.get("token"),
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

  reguser(context, data) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.post("reg", data, {
          headers: {    
            Authorization:
              "Bearer " + cookies.get("token"),
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
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.post(
          `users/updateusr?id=${data.keyedit}`,
          data.formdata,
          {
            headers: {
              Authorization:
                "Bearer " + cookies.get("token") ??
                localStorage.getItem("token"),
            },
            // headers: {
            //   Authorization: "Bearer " + localStorage.getItem("token"),
            // },
          }
        );
        resolve(network.data);
        context.dispatch("fetchAllusers");
      } catch (error) {
        reject(error);
      }
    });
    return promise;

    // promise.then((data) => {
    //   console.log(data);
    // });
  },

  deleteuser(context, data) {
    return new Promise(async (resolve, reject) => {
      try {
        let network = await api.delete(`users/deleteusr?id=${data}`, {
          headers: {
            Authorization:
              "Bearer " + cookies.get("token"),
          },
          // headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
      context.dispatch("fetchAllusers");
    });
  },

  updateprofile(context, data) {
    // console.log(data);
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.post(`editprofile`, data, {
          headers: {
            Authorization:
              "Bearer " + cookies.get("token"),
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
