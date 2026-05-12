<template>
  <div class="bg-white rounded-2xl shadow-sm border border-outline p-6 h-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-dark-base">System Activity</h2>

      <div ref="filterMenuRef" class="relative">
        <button
          @click="toggleFilterMenu"
          class="flex items-center gap-2 text-sm text-slate-400 hover:text-dark-base transition"
        >
          <span>{{ selectedRangeLabel }}</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div
          v-if="showFilterMenu"
          class="absolute right-0 mt-2 w-36 bg-white border border-outline rounded-lg shadow-lg z-20 py-1"
        >
          <button
            v-for="option in rangeOptions"
            :key="option.value"
            @click="selectRange(option.value)"
            class="w-full text-left px-3 py-2 text-sm hover:bg-outline/20 transition"
            :class="
              option.value === selectedRange
                ? 'font-semibold text-dark-base'
                : 'text-sub-text'
            "
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table Header (Desktop only) -->
    <div
      class="hidden md:grid grid-cols-3 text-sm text-slate-500 font-medium border-b border-outline pb-3"
    >
      <span>Date</span>
      <span>Action</span>
      <span>Note</span>
    </div>

    <!-- Activity List -->
    <div class="mt-2 max-h-64 overflow-y-auto pr-2">
      <div v-if="isLoading" class="py-8 text-center text-sm text-sub-text">
        Loading activities...
      </div>

      <template v-else>
        <div
          v-for="(item, index) in filteredActivities"
          :key="item.id || index"
          :class="[
            'py-3 text-sm',
            index % 2 === 1 ? 'bg-slate-100/60 rounded-sm' : '',
          ]"
        >
          <!-- Tampilan Mobile (Stack / Card) -->
          <div class="md:hidden space-y-1 px-2">
            <div>
              <span class="font-semibold text-slate-500">Date:</span>
              <span class="text-dark-base ml-1">{{ item.displayDate }}</span>
            </div>
            <div>
              <span class="font-semibold text-slate-500">Action:</span>
              <span class="text-dark-base ml-1">{{ item.action }}</span>
            </div>
            <div>
              <span class="font-semibold text-slate-500">Note:</span>
              <span class="text-dark-base ml-1">
                <span class="font-bold">"{{ item.user }}"</span> {{ item.note }}
              </span>
            </div>
          </div>

          <!-- Tampilan Desktop (Grid 3 kolom) -->
          <div class="hidden md:grid md:grid-cols-3">
            <span class="text-dark-base font-medium">{{
              item.displayDate
            }}</span>
            <span class="text-dark-base font-medium">{{ item.action }}</span>
            <span class="text-dark-base">
              <span class="font-bold">"{{ item.user }}"</span> {{ item.note }}
            </span>
          </div>
        </div>

        <div
          v-if="filteredActivities.length === 0"
          class="py-8 text-center text-sm text-sub-text"
        >
          Belum ada aktivitas pada periode ini.
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemActivity",
  props: {
    activities: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showFilterMenu: false,
      selectedRange: "daily",
      rangeOptions: [
        { value: "daily", label: "Daily", days: 1 },
        { value: "weekly", label: "Weekly", days: 7 },
        { value: "monthly", label: "Monthly", days: 30 },
        { value: "yearly", label: "A Year", days: 365 },
      ],
    };
  },
  computed: {
    selectedRangeLabel() {
      const found = this.rangeOptions.find(
        (opt) => opt.value === this.selectedRange,
      );
      return found ? found.label : "Daily";
    },
    filteredActivities() {
      const selected = this.rangeOptions.find(
        (opt) => opt.value === this.selectedRange,
      );
      const days = selected?.days || 1;
      const now = Date.now();
      const cutoff = now - days * 24 * 60 * 60 * 1000;

      return this.activities
        .filter((item) => {
          const ts = new Date(
            item.date || item.created_at || item.createdAt,
          ).getTime();
          return Number.isFinite(ts) && ts >= cutoff;
        })
        .map((item) => ({
          ...item,
          date: item.date || item.created_at || item.createdAt,
          action:
            item.action || item.entity_name || item.entity || "Updated Data",
          user: item.user || item.user_id || item.userId || "System",
          note: item.note || item.details || "-",
          displayDate: this.formatDate(
            item.date || item.created_at || item.createdAt,
          ),
        }));
    },
  },
  methods: {
    formatDate(dateStr) {
      const dt = new Date(dateStr);
      if (Number.isNaN(dt.getTime())) return "-";

      const datePart = dt.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const timePart = dt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return `${datePart} - ${timePart}`;
    },
    toggleFilterMenu() {
      this.showFilterMenu = !this.showFilterMenu;
    },
    selectRange(value) {
      this.selectedRange = value;
      this.showFilterMenu = false;
    },
    handleClickOutside(event) {
      if (!this.showFilterMenu) return;
      if (
        this.$refs.filterMenuRef &&
        !this.$refs.filterMenuRef.contains(event.target)
      ) {
        this.showFilterMenu = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>
