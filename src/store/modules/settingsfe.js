import api from "@/api";
const state = {
  loading: false,
  datasetingall: null,
  dxdatagridsetting: null,
  dxselectboxsetting: null,
  layoutweb: null,
  cabangpilihan: null,
  cabangpilihanlv2: null,
  sharetanggal: null,
  paramdetailperkiraan: null,
  frbrowse: null,
  layoutMenu: null
};

const getters = {
  getloading: (state) => state.loading,
  getdatasetingall: (state) => state.datasetingall,
  getdxdatagridsetting: (state) => state.dxdatagridsetting,
  getdxselectboxsetting: (state) => state.dxselectboxsetting,
  getcabangpilihan: (state) => state.cabangpilihan,
  getcabangpilihanlv2: (state) => state.cabangpilihanlv2,
  getsharetanggal: (state) => state.sharetanggal,
  getparamdetailperkiraan: (state) => state.paramdetailperkiraan,
  // getfrbrowse: (state) => state.frbrowse,
  getfrbrowse: (state) => {
    if (state.frbrowse) {
      return state.frbrowse?.datafrbrowse || [];
    } else {
      return [];
    }
  },

  disablecolfrbrowse: (state) => {
    if (state.frbrowse && Array.isArray(state.frbrowse.disablecol)) {
      return state.frbrowse.disablecol || [];
    } else {
      return [];
    }
  },

  // Updated getter to return the full layout web data
  getlayoutmenuweb: (state) => state.layoutweb,

  // Get level 0 items (main menu items)
  getlayoutwebl0: (state) => {
    if (state.layoutweb && state.layoutweb.dbmenu2) {
      return state.layoutweb.dbmenu2.filter(
        (item) => item.L0 === "0" && item.HASACCESS === "1"
      );
    }
    return [];
  },

  // Get level 1 items that have access
  getlayoutwebl1: (state, getters) => {
    if (state.layoutweb && state.layoutweb.dbmenu2) {
      const parentL1s = getters.getlayoutwebl0.map((item) => item.L1);
      return state.layoutweb.dbmenu2.filter(
        (item) => parentL1s.includes(item.Parent) && item.HASACCESS === "1"
      );
    }
    return [];
  },

  // Get level 2 items that have access
  getlayoutwebl2: (state, getters) => {
    if (state.layoutweb && state.layoutweb.dbmenu2) {
      const parentL2s = getters.getlayoutwebl1.filter(
        (item) => item.ACCESS === "0"
      );
      const parentL2ss = parentL2s.map((item) => item.L1);
      return state.layoutweb.dbmenu2.filter(
        (item) => parentL2ss.includes(item.Parent) && item.HASACCESS === "1"
      );
    }
    return [];
  },

  getparentL1s: (state, getters) => {
    const parentL2s = getters.getlayoutwebl1.filter(
      (item) => item.ACCESS === "0"
    );
    const parentL2ss = parentL2s.map((item) => item.L1);
    return parentL2ss;
  },

  // New getters for better menu organization
  getMenuByLevel: (state) => (level) => {
    if (state.layoutweb && state.layoutweb.dbmenu2) {
      return state.layoutweb.dbmenu2.filter(
        (item) => item.L0 === level.toString() && item.HASACCESS === "1"
      );
    }
    return [];
  },

  getMenuByParent: (state) => (parentId) => {
    if (state.layoutweb && state.layoutweb.dbmenu2) {
      return state.layoutweb.dbmenu2.filter(
        (item) => item.Parent === parentId && item.HASACCESS === "1"
      );
    }
    return [];
  },

  // Get menu items that have pathfile (clickable items)
  getClickableMenuItems: (state) => {
    if (state.layoutweb && state.layoutweb.dbmenu2) {
      return state.layoutweb.dbmenu2.filter(
        (item) =>
          item.pathfile && item.pathfile !== "" && item.HASACCESS === "1"
      );
    }
    return [];
  },
};

const actions = {
  async actlayoutweb({ commit, rootState }) {
    const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
    try {
      // Mocking the structure from senior's code
      // Real implementation would fetch from server
      const data = {
        dbmenu2: [
          { pathfile: "/crmAdmin", pathfiledefault: "/crmAdmin", label: "Dashboard" }
        ]
      };
      commit("SET_LAYOUT", data);
      return data;
    } catch (error) {
      console.error("Layout fetch error:", error);
      throw error;
    }
  },
  clearmenuuser({ commit }) {
    commit("CLEAR_MENU");
  },

  actsettingsfe(context) {
    context.commit("setloading", true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get("settingsfe", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            keyfe: "0-opklm,",
          },
        });
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });
    promise
      .then((data) => {
        context.commit("setloading", false);
        context.commit("setdatasetingall", data);
        context.commit("setdxdatagridsetting", data.datagridsettings);
        context.commit("setdxselectboxsetting", data.selectboxsettings);
      })
      .catch((error) => {
        context.commit("setloading", false);
        console.error(error);
      });
  },

  actfrbrowse(context, data) {
    context.commit("settingsfe/setloading", true, { root: true });
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.getbydata("formbrowse", data);
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        console.log(data);
        context.commit("setfrbrowse", data);
        context.commit("settingsfe/setloading", false, { root: true });
      })
      .catch((error) => {
        console.error("Error:", error);
        context.commit("settingsfe/setloading", false, { root: true });
      });

    return promise;
  },

  // Updated actlayoutweb action
  actlayoutwebold(context) {
    // If layoutweb already has data, return it without making API call
    if (context.state.layoutweb) {
      return Promise.resolve(context.state.layoutweb);
    }

    context.commit("setloading", true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get("menuweb", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            keyfe: "0-opklm,",
          },
        });

        resolve(network.data);
      } catch (error) {
        console.error("Error fetching menuweb:", error);
        reject(error);
      }
    });

    promise
      .then((data) => {
        context.commit("setloading", false);
        context.commit("setlayoutweb", data);

        // Log the dbmenu2 array specifically as requested
        if (data && data.dbmenu2) {
          // Log menu structure for debugging
          const level0Items = data.dbmenu2.filter((item) => item.L0 === "0");
          const level1Items = data.dbmenu2.filter((item) => item.L0 === "1");
          const level2Items = data.dbmenu2.filter((item) => item.L0 === "2");
        }
      })
      .catch((error) => {
        context.commit("setloading", false);
      });

    return promise;
  },

  clearmenuuserold({ commit }) {
    commit("setlayoutweb", null);
  },

  actcabangpilihan(context, data) {
    context.commit("setcabangpilihan", data);
  },

  actcabangpilihanlv2(context, data) {
    context.commit("setcabangpilihanlv2", data);
  },

  actsharetanggal(context, data) {
    context.commit("setsharetanggal", data);
  },

  actparamdetailperkiraan(context, data) {
    context.commit("setparamdetailperkiraan", data);
  },
};

const mutations = {
  SET_LAYOUT(state, data) {
    state.layoutMenu = data;
  },
  CLEAR_MENU(state) {
    state.layoutMenu = null;
  },
  setfrbrowse: (state, frbrowse) => {
    state.frbrowse = frbrowse;
  },
  setdatasetingall: (state, datasetingall) => {
    state.datasetingall = datasetingall;
  },
  setdxdatagridsetting: (state, dxdatagridsetting) => {
    state.dxdatagridsetting = dxdatagridsetting;
  },
  setdxselectboxsetting: (state, dxselectboxsetting) => {
    state.dxselectboxsetting = dxselectboxsetting;
  },
  setloading: (state, loading) => {
    state.loading = loading;
  },
  // Updated mutation to store the complete response
  setlayoutweb: (state, layoutweb) => {
    state.layoutweb = layoutweb;
  },
  setcabangpilihan: (state, cabangpilihan) => {
    state.cabangpilihan = cabangpilihan;
  },
  setcabangpilihanlv2: (state, cabangpilihanlv2) => {
    state.cabangpilihanlv2 = cabangpilihanlv2;
  },
  setsharetanggal: (state, sharetanggal) => {
    state.sharetanggal = sharetanggal;
  },
  setparamdetailperkiraan: (state, paramdetailperkiraan) => {
    state.paramdetailperkiraan = paramdetailperkiraan;
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
//     namespaced: true,
//     state: () => ({
//         layoutMenu: null
//     }),
//     mutations: {
//         SET_LAYOUT(state, data) {
//             state.layoutMenu = data;
//         },
//         CLEAR_MENU(state) {
//             state.layoutMenu = null;
//         }
//     },
//     actions: {
//         async actlayoutweb({ commit, rootState }) {
//             const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
//             try {
//                 // Mocking the structure from senior's code
//                 // Real implementation would fetch from server
//                 const data = {
//                     dbmenu2: [
//                         { pathfile: "/crmAdmin", pathfiledefault: "/crmAdmin", label: "Dashboard" }
//                     ]
//                 };
//                 commit("SET_LAYOUT", data);
//                 return data;
//             } catch (error) {
//                 console.error("Layout fetch error:", error);
//                 throw error;
//             }
//         },
//         clearmenuuser({ commit }) {
//             commit("CLEAR_MENU");
//         }
//     }
// };
