import api from "@/api";
import { useCookies } from "vue3-cookies";
import { getDetailEndpointCandidates } from "@/utils/detailFormPayload";

const { cookies } = useCookies();

const state = {
  provinsi: [],
  kotakabupaten: [],
  kecamatan: [],
  kelurahan: [],
  kodepos: [],
};

const getters = {
  getprovinsi: (state) => state.provinsi,
  getkotakabupaten: (state) => state.kotakabupaten,
  getkecamatan: (state) => state.kecamatan,
  getkelurahan: (state) => state.kelurahan,
  getkodepos: (state) => state.kodepos,
};

const mutations = {
  setprovinsi(state, payload) {
    state.provinsi = payload;
  },
  setkotakabupaten(state, payload) {
    state.kotakabupaten = payload;
  },
  setkecamatan(state, payload) {
    state.kecamatan = payload;
  },
  setkelurahan(state, payload) {
    state.kelurahan = payload;
  },
  setkodepos(state, payload) {
    state.kodepos = payload;
  },
};

const actions = {
  actprovinsi(context, params = {}) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get("lokasi/getprovinsi", params, {
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
        console.log("Data received in actprovinsi action:", data);
        context.commit("setprovinsi", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return promise;
  },

  actkotakabupaten(context, params = {}) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get(
          "lokasi/getkotakabupaten/" + params.id,
          {
            headers: {
              Authorization: "Bearer " + cookies.get("token"),
            },
          },
        );
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        console.log("Data received in actkotakabupaten action:", data);
        context.commit("setkotakabupaten", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return promise;
  },

  actkecamatan(context, params = {}) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get(
          "lokasi/getkecamatan/" + params.id,
          {
            headers: {
              Authorization: "Bearer " + cookies.get("token"),
            },
          },
        );
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        console.log("Data received in actkecamatan action:", data);
        context.commit("setkecamatan", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return promise;
  },

  actkelurahan(context, params = {}) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get(
          "lokasi/getkelurahan/" + params.id,
          {
            headers: {
              Authorization: "Bearer " + cookies.get("token"),
            },
          },
        );
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        console.log("Data received in actkelurahan action:", data);
        context.commit("setkelurahan", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return promise;
  
  },
  
  actkodepos(context, params = {}) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        let network = await api.get(
          "lokasi/getkodepos/" + params.id,
          {
            headers: {
              Authorization: "Bearer " + cookies.get("token"),
            },
          },
        );
        resolve(network.data);
      } catch (error) {
        reject(error);
      }
    });

    promise
      .then((data) => {
        console.log("Data received in actkodepos action:", data);
        context.commit("setkodepos", data);
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
