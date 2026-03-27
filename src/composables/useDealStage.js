import { ref } from "vue";
import { useStore } from "vuex";

export function useDealStage() {
    const store = useStore();

    const isSyncing = ref(false);
    const updatingId = ref(null);

    const stageColor = (stage) => {
        if (stage === "new") return "bg-slate-100 text-slate-700";
        if (stage === "qualified") return "bg-green-100 text-green-700";
        if (stage === "advanced" || stage === "payment")
            return "bg-yellow-100 text-yellow-700";
        if (stage === "won") return "bg-emerald-100 text-emerald-700";
        if (stage === "lost") return "bg-red-100 text-red-700";
        return "bg-slate-100 text-slate-700";
    };

    const changeStage = async (deal, newStage) => {
        const prev = deal.stage;
        deal.stage = newStage;

        updatingId.value = deal.id;
        isSyncing.value = true;

        try {
            await store.dispatch("deals/updateDealStage", {
                dealId: deal.id,
                newStage,
            });
        } catch (e) {
            deal.stage = prev;
        } finally {
            updatingId.value = null;
            isSyncing.value = false;
        }
    };

    return {
        isSyncing,
        updatingId,
        stageColor,
        changeStage,
    };
}