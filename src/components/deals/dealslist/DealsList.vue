<script>
import { ChevronDown } from "lucide-vue-next";
import { alertService } from "@/services/alertService";
import DealsListHeader from "./DealsListHeader.vue";
import DealsListToolbar from "./DealsListToolbar.vue";
import DealsListRow from "./DealsListRow.vue";
import DealsEmptyState from "./DealsEmptyState.vue";
import DataGrid from "@/components/widgets/DataGrid.vue";
import { useDealSelection } from "@/composables/useDealSelection";

export default {
  name: "DealsList",
  components: {
    ChevronDown,
    DealsListHeader,
    DealsListToolbar,
    DealsListRow,
    DealsEmptyState,
    DataGrid,
  },
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },
  emits: ["viewDetail", "update:currentPage", "update:itemsPerPage"],
  data() {
    return {
      // Pilih kolom mana saja yang ingin ditampilkan
      visibleColumns: [
        "deal_name", // Nama Deal
        "stage", // Stage/Status
        "amount", // Jumlah/Amount
        "associated_contact", // Associated Contact
        "owner", // Owner
        "updated_at", // Last Updated
      ],
      selectedDeals: [],
    };
  },
  computed: {
    // Use uiDeals getter untuk normalized data
    deals() {
      return this.$store.getters["deals/uiDeals"] || [];
    },

    // Pagination data dari store
    pagination() {
      return this.$store.getters["deals/pagination"] || {};
    },

    // Filter tableDeals untuk hanya include kolom yang dipilih
    tableDeals() {
      return this.deals.map((deal) => {
        const filtered = {};
        this.visibleColumns.forEach((col) => {
          filtered[col] = deal[col];
        });
        // Selalu include ID untuk keyExpr
        filtered.id = deal.id;
        return filtered;
      });
    },

    // Cek apakah semua deals terseleksi
    isAllSelected() {
      if (!this.deals.length) return false;
      return this.deals.every((deal) => this.selectedDeals.includes(deal.id));
    },

    // Search query dari store
    searchQuery() {
      return this.$store.state.deals.searchQuery;
    },
  },
  watch: {
    // Watch deals untuk cleanup selected yang udah dihapus
    deals: {
      immediate: true,
      handler(newDeals) {
        const validIds = newDeals.map((deal) => deal.id);
        this.selectedDeals = this.selectedDeals.filter((id) =>
          validIds.includes(id),
        );
      },
    },
  },
  methods: {
    // Toggle select semua deals
    toggleSelectAll(forceChecked) {
      const nextChecked =
        typeof forceChecked === "boolean" ? forceChecked : !this.isAllSelected;

      if (nextChecked) {
        this.selectedDeals = this.deals.map((deal) => deal.id);
        return;
      }

      this.selectedDeals = [];
    },

    // Toggle selection satu deal
    handleRowToggle(id) {
      const index = this.selectedDeals.indexOf(id);
      if (index > -1) {
        this.selectedDeals.splice(index, 1);
        return;
      }
      this.selectedDeals.push(id);
    },

    // Handle delete selected deals
    async handleDeleteSelected() {
      if (this.selectedDeals.length === 0) return;

      const confirmed = await alertService.confirm(
        "Hapus Deal?",
        `${this.selectedDeals.length} deal akan dihapus secara permanen. Lanjutkan?`,
      );

      if (!confirmed) return;

      try {
        for (const id of this.selectedDeals) {
          await this.$store.dispatch("deals/deleteDeal", id);
        }
        this.selectedDeals = [];
        alertService.success("Deal berhasil dihapus.");
        await this.$store.dispatch("deals/fetchAllDeals").catch(() => {});
      } catch (error) {
        console.error("Bulk delete error:", error);
        alertService.error("Gagal menghapus beberapa deal.");
      }
    },

    // Handle row focus/selection di DataGrid
    handleFocusedRowChanged(rowData) {
      if (rowData && rowData.data) {
        // Cari deal original dari deals untuk emit (bukan dari filtered)
        const originalDeal = this.deals.find((d) => d.id === rowData.data.id);
        this.$emit("viewDetail", originalDeal || rowData.data);
      }
    },

    // Handle search query update
    handleSearchQuery(query) {
      this.$store.dispatch("deals/setSearchQuery", query);
    },
  },
};
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm max-w-full h-147 border border-outline flex flex-col overflow-hidden"
  >
    <!-- Action Bar (Search) -->
    <DealsListHeader
      :searchQuery="searchQuery"
      @update:searchQuery="handleSearchQuery"
    />

    <!-- Toolbar (Selection counts, pagination, items per page) -->
    <DealsListToolbar
      :isAllSelected="isAllSelected"
      :currentPage="currentPage"
      :totalPages="pagination.last_page || 1"
      :selectedCount="selectedDeals.length"
      :itemsPerPage="itemsPerPage"
      @toggleAll="toggleSelectAll"
      @page="$emit('update:currentPage', $event)"
      @update:itemsPerPage="$emit('update:itemsPerPage', $event)"
      @delete="handleDeleteSelected"
    />

    <!-- Table Container -->
    <DataGrid
      :dataSource="tableDeals"
      :keyExpr="'id'"
      @focused-row-changed="handleFocusedRowChanged"
      :showActionColumn="false"
    />
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
