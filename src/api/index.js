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
  (response) => {
    try {
      const method = String(response?.config?.method || "").toLowerCase();
      const isMutating =
        method === "post" ||
        method === "put" ||
        method === "patch" ||
        method === "delete";

      if (isMutating) {
        const rawUrl = String(response?.config?.url || "");
        const endpoint = rawUrl
          .replace(/^.*\/api(?:\/dev)?\//, "")
          .replace(/^\/+/, "")
          .split("?")[0];

        const body = response?.config?.data
          ? typeof response.config.data === "string"
            ? JSON.parse(response.config.data)
            : response.config.data
          : {};

        const choice = String(body?.choice || "").toLowerCase();
        const operation = choice || (method === "delete" ? "d" : "u");

        const operationMap = {
          i: "Added",
          u: "Updated",
          d: "Deleted",
        };

        const entityRaw = endpoint.split("/")[0] || "data";
        const entityMap = {
          userscrm: "User",
          deals: "Deal",
          company: "Company",
          contact: "Contact",
          tasks: "Task",
          team: "Team",
          documents: "Document",
        };

        const entity = entityMap[entityRaw] || entityRaw;
        const action = `${operationMap[operation] || "Updated"} ${entity}`;

        const authUser = store?.state?.auth?.user || {};
        const userName =
          authUser?.name ||
          [authUser?.firstname, authUser?.lastname].filter(Boolean).join(" ") ||
          authUser?.email ||
          "System";

        const note = `- ${method.toUpperCase()} ${endpoint}`;

        store.dispatch("activity/appendActivity", {
          action,
          user: userName,
          note,
          entity: entity.toLowerCase(),
          operation,
        });
      }
    } catch (e) {
      // Never block API flow due to activity logging issues.
    }

    return response;
  },
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
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

  return Api.request({
    method: "post",
    url: "api" + devPath + url,
    data,
    ...config,
    headers: {
      Authorization: "Bearer " + cookies.get("token"),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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
