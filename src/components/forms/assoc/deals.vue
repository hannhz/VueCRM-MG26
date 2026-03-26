<template>
  <div class="relative" ref="dealDropdownRef">
    <label class="block text-sm font-medium text-dark-base mb-2"
      >Deals Association</label
    >
    <div
      @click="isDealDropdownOpen = !isDealDropdownOpen"
      class="w-full px-3 py-2 border border-outline rounded-lg flex flex-wrap gap-2 items-center cursor-pointer min-h-10.5 bg-white transition focus-within:ring-1 focus-within:ring-sub-text"
    >
      <div v-if="selectedDeals.length === 0" class="text-gray-400 text-sm">
        Search and select deals
      </div>
      <div
        v-for="deal in selectedDeals"
        :key="deal.id"
        class="flex items-center gap-1 bg-light-base px-2 py-1 rounded text-xs font-medium text-dark-base border border-outline"
        @click.stop
      >
        {{ getDisplayNameFromDeal(deal) }}
        <X
          :size="12"
          class="cursor-pointer hover:text-red"
          @click="toggleDeal(deal)"
        />
      </div>
      <ChevronDown :size="16" class="ml-auto text-sub-text" />
    </div>

    <!-- Dropdown Menu -->
    <div
      v-if="isDealDropdownOpen"
      class="absolute z-50 w-full mt-1 bg-white border border-outline rounded-lg shadow-xl flex flex-col max-h-64"
    >
      <div class="p-2 border-b border-outline">
        <div class="relative">
          <Search
            :size="14"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-sub-text"
          />
          <input
            v-model="dealSearch"
            type="text"
            placeholder="Search deals"
            class="w-full pl-9 pr-3 py-2 bg-light-base/50 border border-outline rounded text-sm focus:outline-none focus:ring-1 focus:ring-sub-text"
            @click.stop
          />
        </div>
      </div>
      <div class="flex-1 overflow-y-auto py-1">
        <div
          v-for="deal in filteredDeals"
          :key="deal.id"
          @click="toggleDeal(deal)"
          class="px-4 py-2 hover:bg-light-base cursor-pointer flex items-center justify-between text-sm transition"
        >
          <div class="flex flex-col">
            <span class="font-medium text-dark-base">{{
              getDisplayNameFromDeal(deal)
            }}</span>
            <span class="text-xs text-sub-text">{{
              deal.description || "No description"
            }}</span>
          </div>
          <div
            v-if="isDealSelected(deal.id)"
            class="w-5 h-5 bg-dark-base rounded-full flex items-center justify-center"
          >
            <Check :size="12" class="text-white" />
          </div>
        </div>
        <div
          v-if="filteredDeals.length === 0"
          class="px-4 py-6 text-center text-sm text-sub-text"
        >
          No deals found
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    companyForm: {
      type: Object,
      required: true,
    },
    allDeals: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isDealDropdownOpen: false,
      dealSearch: "",
    };
  },

  computed: {
    // ambil deal yang sudah dipilih berdasarkan id
    selectedDeals() {
      return this.allDeals.filter((deal) =>
        this.companyForm.dealsassoc.includes(deal.id),
      );
    },

    // filter search
    filteredDeals() {
      if (!this.dealSearch) return this.allDeals;

      return this.allDeals.filter((deal) =>
        this.getDisplayNameFromDeal(deal)
          .toLowerCase()
          .includes(this.dealSearch.toLowerCase()),
      );
    },
  },

  methods: {
    // cek apakah deal sudah dipilih
    isDealSelected(id) {
      return this.companyForm.dealsassoc.includes(id);
    },

    // toggle select / unselect
    toggleDeal(deal) {
      let updatedDeals = [...this.companyForm.dealsassoc];

      if (updatedDeals.includes(deal.id)) {
        updatedDeals = updatedDeals.filter((id) => id !== deal.id);
      } else {
        updatedDeals.push(deal.id);
      }

      // emit ke parent (PENTING)
      this.$emit("update:companyForm", {
        ...this.companyForm,
        dealsassoc: updatedDeals,
      });
    },

    // nama yang ditampilkan
    getDisplayNameFromDeal(deal) {
      return deal.name || deal.title || `Deal #${deal.id}`;
    },
  },
};
</script>
