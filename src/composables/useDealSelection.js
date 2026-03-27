import { ref, computed } from "vue";

export function useDealSelection(deals) {
    const selectedDeals = ref([]);

    const filteredDealIds = computed(() =>
        deals.value.map((d) => d.id)
    );

    const isAllSelected = computed(() => {
        if (!filteredDealIds.value.length) return false;
        return filteredDealIds.value.every((id) =>
            selectedDeals.value.includes(id)
        );
    });

    const toggleSelectAll = (checked) => {
        selectedDeals.value = checked ? [...filteredDealIds.value] : [];
    };

    return {
        selectedDeals,
        isAllSelected,
        toggleSelectAll,
    };
}