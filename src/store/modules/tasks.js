import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const normalizeTask = (task = {}, index = 0) => {
  const fallbackId = `${task?.title || task?.name || "task"}-${index}`;
  const status = (task.status || task.stage || task.pipeline || "not_started")
    .toString()
    .toLowerCase();

  return {
    ...task,
    id: task.id ?? task.task_id ?? fallbackId,
    title: task.title || task.name || task.task_name || "Untitled Task",
    description: task.description || task.task_content || "",
    status,
    stage: task.stage || task.status || status,
    owner: task.owner || task.assignee || task.user_name || "-",
    dueDate:
      task.dueDate ||
      task.due_date ||
      task.date ||
      task.deadline ||
      task.start ||
      null,
    time: task.task_time || task.time || task.due_time || null,
    priority: task.priority || "",
  };
};

const mapCreateTaskPayload = (formData = {}) => {
  const taskName = formData.task_name?.trim() || formData.taskName?.trim() || null;
  const description =
    formData.description?.trim() || formData.taskContent?.trim() || null;
  const assignee = formData.assignee || formData.owner?.trim() || null;
  const dueDate = formData.due_date || formData.dueDate || null;
  const taskTime = formData.task_time || formData.time || null;

  return {
    task_name: taskName,
    description,
    status: formData.status || "not_started",
    assignee,
    due_date: dueDate,
    task_time: taskTime,
    priority: formData.priority || null,
  };
};

const mapUpdateTaskPayload = (formData = {}) => {
  const taskName = formData.task_name?.trim() || formData.taskName?.trim() || null;
  const description =
    formData.description?.trim() || formData.taskContent?.trim() || null;
  const assignee = formData.assignee || formData.owner?.trim() || null;
  const dueDate = formData.due_date || formData.dueDate || null;
  const taskTime = formData.task_time || formData.time || null;

  return {
    task_name: taskName,
    description,
    status: formData.status || "not_started",
    assignee,
    due_date: dueDate,
    task_time: taskTime,
    priority: formData.priority || null,
  };
};

export default {
  namespaced: true,

  state: () => ({
    tasks: [],
    viewMode: "list",
    isLoading: false,
    error: null,
    searchQuery: "",
  }),

  mutations: {
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    ADD_TASK(state, task) {
      state.tasks = [task, ...state.tasks];
    },
    UPDATE_TASK(state, task) {
      const index = state.tasks.findIndex((item) => item.id === task.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, { ...state.tasks[index], ...task });
      }
    },
    DELETE_TASK(state, taskId) {
      state.tasks = state.tasks.filter((task) => task.id !== taskId);
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
  },

  actions: {
    setViewMode({ commit }, mode) {
      commit("SET_VIEW_MODE", mode);
    },

    fetchAllTasks({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await api.get("tasks", {
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
          const tasksData = data.tasks || data.data || data;
          const normalizedTasks = Array.isArray(tasksData)
            ? tasksData.map((task, index) => normalizeTask(task, index))
            : [];
          commit("SET_TASKS", normalizedTasks);
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
                  ? "Endpoint tasks tidak ditemukan di server (404)."
                  : `Fetch tasks gagal (HTTP ${status})`
                : error.message || "Failed to fetch tasks"),
          );
          commit("SET_LOADING", false);
        });

      return promise;
    },

    async createTask({ commit, dispatch }, formData) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };
      const payload = mapCreateTaskPayload(formData);

      try {
        const response = await api.post("tasks/input", payload, { headers });

        await dispatch("fetchAllTasks").catch(() => {
          const createdTask =
            response?.data?.task || response?.data?.data || response?.data;
          if (createdTask) {
            commit("ADD_TASK", normalizeTask(createdTask));
          }
        });

        commit("SET_LOADING", false);
        return response.data;
      } catch (error) {
        const status = error?.response?.status;
        const serverMessage = error?.response?.data?.message;
        commit(
          "SET_ERROR",
          serverMessage ||
            (status
              ? status === 404
                ? "Endpoint create task tidak ditemukan di server (404)."
                : `Create task gagal (HTTP ${status})`
              : error?.message || "Failed to create task"),
        );
        commit("SET_LOADING", false);
        throw error;
      }
    },

    async updateTask({ commit, dispatch }, payload = {}) {
      const taskId = payload.id;
      if (!taskId) {
        throw new Error("Task ID is required");
      }

      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };

      const body = mapUpdateTaskPayload(payload.formData || {});

      const candidates = [
        () => api.post(`tasks/updateusr?id=${taskId}`, body, { headers }),
        () => api.post(`tasks/update?id=${taskId}`, body, { headers }),
        () => api.post(`task/updateusr?id=${taskId}`, body, { headers }),
        () => api.post(`task/update?id=${taskId}`, body, { headers }),
        () => api.post("tasks/update", { id: taskId, ...body }, { headers }),
        () => api.post("task/update", { id: taskId, ...body }, { headers }),
      ];

      let lastError = null;

      for (const run of candidates) {
        try {
          const response = await run();

          await dispatch("fetchAllTasks").catch(() => {
            const updatedTask =
              response?.data?.task || response?.data?.data || { id: taskId, ...body };
            commit("UPDATE_TASK", normalizeTask(updatedTask));
          });

          commit("SET_LOADING", false);
          return response?.data;
        } catch (error) {
          lastError = error;
        }
      }

      const status = lastError?.response?.status;
      const serverMessage = lastError?.response?.data?.message;
      commit(
        "SET_ERROR",
        serverMessage ||
          (status
            ? status === 404
              ? "Endpoint update task tidak ditemukan di server (404)."
              : `Update task gagal (HTTP ${status})`
            : lastError?.message || "Failed to update task"),
      );
      commit("SET_LOADING", false);
      throw lastError || new Error("Failed to update task");
    },

    async deleteTask({ commit, dispatch }, taskId) {
      if (!taskId) {
        throw new Error("Task ID is required");
      }

      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const headers = {
        Authorization: "Bearer " + cookies.get("token"),
      };

      const candidates = [
        () => api.delete(`tasks/deleteusr?id=${taskId}`, { headers }),
        () => api.delete(`tasks/delete?id=${taskId}`, { headers }),
        () => api.delete(`task/deleteusr?id=${taskId}`, { headers }),
        () => api.delete(`task/delete?id=${taskId}`, { headers }),
        () => api.post(`tasks/deleteusr?id=${taskId}`, {}, { headers }),
        () => api.post(`tasks/delete?id=${taskId}`, {}, { headers }),
        () => api.post(`task/deleteusr?id=${taskId}`, {}, { headers }),
        () => api.post(`task/delete?id=${taskId}`, {}, { headers }),
        () => api.post("tasks/delete", { id: taskId }, { headers }),
        () => api.post("task/delete", { id: taskId }, { headers }),
      ];

      let lastError = null;

      for (const run of candidates) {
        try {
          const response = await run();

          await dispatch("fetchAllTasks").catch(() => {
            commit("DELETE_TASK", taskId);
          });

          commit("SET_LOADING", false);
          return response?.data;
        } catch (error) {
          lastError = error;
        }
      }

      const status = lastError?.response?.status;
      const serverMessage = lastError?.response?.data?.message;
      commit(
        "SET_ERROR",
        serverMessage ||
          (status
            ? status === 404
              ? "Endpoint delete task tidak ditemukan di server (404)."
              : `Delete task gagal (HTTP ${status})`
            : lastError?.message || "Failed to delete task"),
      );
      commit("SET_LOADING", false);
      throw lastError || new Error("Failed to delete task");
    },

    setSearchQuery({ commit }, query) {
      commit("SET_SEARCH_QUERY", query);
    },
  },

  getters: {
    currentView: (state) => state.viewMode,
    allTasks: (state) => state.tasks,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    searchQuery: (state) => state.searchQuery,
    filteredTasks: (state) => {
      if (!state.searchQuery.trim()) {
        return state.tasks;
      }
      const query = state.searchQuery.toLowerCase();
      return state.tasks.filter(
        (task) =>
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query),
      );
    },
  },
};
