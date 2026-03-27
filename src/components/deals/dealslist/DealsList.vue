<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { ChevronDown } from "lucide-vue-next";
import { alertService } from "@/services/alertService";

import DealsListHeader from "./DealsListHeader.vue";
import DealsListToolbar from "./DealsListToolbar.vue";
import DealsListRow from "./DealsListRow.vue";
import DealsEmptyState from "./DealsEmptyState.vue";

import { useDealSelection } from "@/composables/useDealSelection";

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits([
  "viewDetail",
  "update:currentPage",
  "update:itemsPerPage",
]);

const store = useStore();

// Use uiDeals getter for normalized data
const deals = computed(() => store.getters["deals/uiDeals"] || []);
const pagination = computed(() => store.getters["deals/pagination"] || {});

const { selectedDeals, isAllSelected, toggleSelectAll } =
  useDealSelection(deals);

const handleDeleteSelected = async () => {
  if (selectedDeals.value.length === 0) return;

  const confirmed = await alertService.confirm(
    "Hapus Deal?",
    `${selectedDeals.value.length} deal akan dihapus secara permanen. Lanjutkan?`,
  );

  if (!confirmed) return;

  try {
    for (const id of selectedDeals.value) {
      await store.dispatch("deals/deleteDeal", id);
    }
    selectedDeals.value = [];
    alertService.success("Deal berhasil dihapus.");
    await store.dispatch("deals/fetchAllDeals").catch(() => {});
  } catch (error) {
    console.error("Bulk delete error:", error);
    alertService.error("Gagal menghapus beberapa deal.");
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm max-w-full h-147 border border-outline flex flex-col overflow-hidden">
    <!-- Action Bar (Search, Currency, Pipeline) -->
    <DealsListHeader
      :searchQuery="store.state.deals.searchQuery"
      @update:searchQuery="store.dispatch('deals/setSearchQuery', $event)"
    />

    <!-- Toolbar (Selection counts, pagination, items per page) -->
    <DealsListToolbar
      :isAllSelected="isAllSelected"
      :currentPage="currentPage"
      :totalPages="pagination.last_page || 1"
      :selectedCount="selectedDeals.length"
      :itemsPerPage="itemsPerPage"
      @toggleAll="toggleSelectAll"
      @page="emit('update:currentPage', $event)"
      @update:itemsPerPage="emit('update:itemsPerPage', $event)"
      @delete="handleDeleteSelected"
    />

    <!-- Table Container -->
    <div class="flex-1 min-h-0 overflow-auto custom-scrollbar">
      <table class="w-full border-collapse">
        <thead class="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
          <tr class="border-b border-gray-200">
            <th class="px-6 py-4 text-left w-12">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll($event.target.checked)"
                class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300 transition cursor-pointer"
              />
            </th>
            <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <div class="flex items-center gap-2">
                Deal Name
                <ChevronDown :size="14" />
              </div>
            </th>
            <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider w-40">
              <div class="flex items-center gap-2">
                Stage
                <ChevronDown :size="14" />
              </div>
            </th>
            <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <div class="flex items-center gap-2">
                Jumlah / Close
                <ChevronDown :size="14" />
              </div>
            </th>
            <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <div class="flex items-center gap-2">
                Associated With
                <ChevronDown :size="14" />
              </div>
            </th>
            <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <div class="flex items-center gap-2">
                Last Updated
                <ChevronDown :size="14" />
              </div>
            </th>
            <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <div class="flex items-center gap-2">
                Owner
                <ChevronDown :size="14" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Empty State -->
          <DealsEmptyState v-if="deals.length === 0" />

          <!-- Row Data -->
          <DealsListRow
            v-for="deal in deals"
            :key="deal.id"
            :deal="deal"
            :selectedDeals="selectedDeals"
            @toggle="(id) => {
                const index = selectedDeals.indexOf(id);
                if (index > -1) selectedDeals.splice(index, 1);
                else selectedDeals.push(id);
            }"
            @view="emit('viewDetail', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>