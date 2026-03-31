import { ref, onMounted } from "vue";
import api from "@/api";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

// Singleton: cache statuses globally untuk hindari repeated API calls
let cachedStatuses = null;
let statusesPromise = null;

export function useStatuses() {
  const statuses = ref([]);
  const statusesLoading = ref(false);
  const statusesError = ref(null);

  const fetchStatuses = async () => {
    // Jika sudah pernah di-fetch, gunakan cache
    if (cachedStatuses !== null) {
      statuses.value = cachedStatuses;
      return cachedStatuses;
    }

    // Jika sedang di-fetch, tunggu sampai selesai
    if (statusesPromise) {
      const result = await statusesPromise;
      statuses.value = result;
      return result;
    }

    statusesLoading.value = true;
    statusesError.value = null;

    // Simpan promise untuk prevent race condition
    statusesPromise = (async () => {
      try {
        const response = await api.get("statuses", {
          headers: {
            Authorization: "Bearer " + cookies.get("token"),
          },
        });
        const data = response.data || [];
        cachedStatuses = data;
        statuses.value = data;
        console.log("✅ Statuses loaded from API:", data);
        return data;
      } catch (error) {
        console.error("❌ Failed to fetch statuses:", error);
        statusesError.value = error.message;
        // Fallback
        const fallback = [
          { id: 1, name: "Competitor" },
          { id: 2, name: "Customer" },
          { id: 3, name: "Ex Customer" },
          { id: 4, name: "Lead" },
          { id: 5, name: "Opportunity" },
          { id: 6, name: "Partner" },
          { id: 7, name: "Qualified" },
        ];
        cachedStatuses = fallback;
        statuses.value = fallback;
        return fallback;
      } finally {
        statusesLoading.value = false;
        statusesPromise = null;
      }
    })();

    return await statusesPromise;
  };

  const getStatusName = (id) => {
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
