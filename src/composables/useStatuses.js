import { ref, onMounted } from "vue";
import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

export function useStatuses() {
  const statuses = ref([]);
  const statusesLoading = ref(false);
  const statusesError = ref(null);

  const fetchStatuses = async () => {
    if (!api || !api.get) {
      console.warn("API module not ready, using fallback statuses");
      statuses.value = [
        { id: 1, name: "Competitor" },
        { id: 2, name: "Customer" },
        { id: 3, name: "Ex Customer" },
        { id: 4, name: "Lead" },
        { id: 5, name: "Opportunity" },
        { id: 6, name: "Partner" },
        { id: 7, name: "Qualified" },
      ];
      return;
    }

    statusesLoading.value = true;
    statusesError.value = null;

    try {
      const response = await api.get("statuses", {
        headers: {
          Authorization: "Bearer " + cookies.get("token"),
        },
      });
      statuses.value = response.data || [];
      console.log("Statuses loaded:", statuses.value);
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      statusesError.value = error.message;
      // Fallback ke hardcoded jika API fail
      statuses.value = [
        { id: 1, name: "Competitor" },
        { id: 2, name: "Customer" },
        { id: 3, name: "Ex Customer" },
        { id: 4, name: "Lead" },
        { id: 5, name: "Opportunity" },
        { id: 6, name: "Partner" },
        { id: 7, name: "Qualified" },
      ];
    } finally {
      statusesLoading.value = false;
    }
  };

  const getStatusName = (id) => {
    if (!id) return "-";
    const status = statuses.value.find((s) => s.id == id);
    return status ? status.name : "-";
  };

  return {
    statuses,
    statusesLoading,
    statusesError,
    fetchStatuses,
    getStatusName,
  };
}
