import axios from "axios";
import { alertService } from "@/services/alertService";
import { useCookies } from "vue3-cookies";
import router from "@/router";
import store from "@/store";

const { cookies } = useCookies();

let isDev = import.meta.env.VITE_APP_DEVELOPMENT == "true";
let devPath = isDev ? "/dev/" : "/";

const Api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alertService
        .error(
          "Anda tidak memiliki akses. Silakan login ulang.",
          "Unauthorized",
        )
        .then(() => {
          localStorage.clear();
          sessionStorage.clear();
          cookies.remove("loggedIn");
          cookies.remove("token");
          router.push("/login");
        });
    }
    return Promise.reject(error);
  },
);

const httpGet = (url, config = {}) => {
  return Api.request({
    method: "get",
    url: "api" + devPath + url,
    ...config,
    headers: {
      Authorization: "Bearer " + cookies.get("token"),
      ...(config.headers || {}),
    },
  });
};

const httpGetbydata = (url, params = {}, config = {}) => {
  return Api.request({
    method: "get",
    url: "api" + devPath + url,
    params,
    ...config,
    headers: {
      Authorization: "Bearer " + cookies.get("token"),
      ...(config.headers || {}),
    },
  });
};

const httpPost = (url, data = {}, config = {}) => {
  return Api.request({
    method: "post",
    url: "api" + devPath + url,
    data,
    ...config,
    headers: {
      Authorization: "Bearer " + cookies.get("token"),
      "Content-Type": "application/json",
      ...(config.headers || {}),
    },
  });
};

const httpDelete = (url, config = {}) => {
  return Api.request({
    method: "delete",
    url: "api" + devPath + url,
    ...config,
    headers: {
      Authorization: "Bearer " + cookies.get("token"),
      ...(config.headers || {}),
    },
  });
};

const api = {
  get: httpGet,
  getbydata: httpGetbydata,
  post: httpPost,
  delete: httpDelete,
};

export default api;
