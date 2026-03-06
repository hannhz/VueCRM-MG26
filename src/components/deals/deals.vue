<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import DealsCard from "./dealscard.vue";
import DealsList from "./dealslist.vue";
import CreateDealForm from "@/components/forms/CreateDealForm.vue";
import BulkAddDealForm from "@/components/forms/BulkAddDealForm.vue";
import {
  ChevronDown,
  FileDown,
  FolderDown,
  Download,
  Edit,
  LayoutGrid,
  FolderPlus,
  FilePlus,
  List,
  RefreshCw,
} from "lucide-vue-next";

const store = useStore();

/* 🔥 GANTI activeMode dengan Vuex */
const activeMode = computed(() =>
  store.getters["deals/currentView"]
);

// Get total deals dynamically from Vuex store
const totalDeals = computed(() => store.getters["deals/allDeals"]?.length || 0);
const isLoading = computed(() => store.getters["deals/isLoading"]);
const error = computed(() => store.getters["deals/error"]);
const showDropdown = ref(false);

function changeToCard() {
  store.dispatch("deals/setViewMode", "card");
}

function changeToList() {
  store.dispatch("deals/setViewMode", "list");
}
const selectedIds = ref([]);
const showDownloadDropdown = ref(false);
const showCreateDealForm = ref(false);
const showBulkAddDealForm = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleBulkAdd = () => {
  showBulkAddDealForm.value = true;
};

const toggleDownloadDropdown = () => {
  showDownloadDropdown.value = !showDownloadDropdown.value;
};

const downloadAll = () => {
  console.log("Download all data");
  showDownloadDropdown.value = false;
};

const handleDownload = () => {
  console.log("Download selected data:", selectedIds.value);
  showDownloadDropdown.value = false;
};

// Fetch data function untuk refresh
const fetchData = () => {
  store.dispatch("deals/fetchAllDeals")
    .then(() => {
      console.log("Deals fetched successfully");
    })
    .catch((err) => {
      console.error("Failed to fetch deals:", err);
    });
};

// Lifecycle: Fetch deals on mount
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="p-0">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-baseline gap-3">
        <h1 class="text-2xl font-bold text-dark-base">Deals</h1>
        <span class="text-sm text-sub-text"
          >{{ totalDeals.toLocaleString() }} Total Deals</span>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-2 ml-auto">

        <!-- Refresh Button -->
          <button
            @click="fetchData"
            :disabled="isLoading"
            class="p-2 border bg-white border-outline rounded-lg hover:bg-light-base transition-all active:scale-95 disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw :size="18" :class="{ 'animate-spin': isLoading }" class="text-sub-text" />
          </button>

        <!-- Add New -->
        <div class="relative inline-block add-dropdown">
          <button
            type="button"
            @click="toggleDropdown"
            class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
          >
            <span class="text-lg font-semibold">+</span>
            <span class="text-sm font-medium">Add New</span>
            <ChevronDown
              :size="16"
              class="transition-transform duration-200"
              :class="{ 'rotate-180': showDropdown }"
            />
          </button>
          <!-- Dropdown Menu -->
          <div
            v-show="showDropdown"
            class="absolute right-0 text-sub-text mt-2 w-44 bg-white border border-outline rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95"
          >
            <button
              @click="
                showCreateDealForm = true;
                showDropdown = false;
              "
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FilePlus :size="18" />
              <span class="font-medium"> Single Deal </span>
            </button>

            <button
              @click="
                handleBulkAdd();
                showDropdown = false;
              "
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FolderPlus :size="18" />
              <span class="font-medium"> Bulk Deals </span>
            </button>
          </div>
        </div>

        <!-- Download -->
        <div class="relative inline-block">
          <!-- Button -->
          <button
            type="button"
            @click="toggleDownloadDropdown"
            class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
          >
            <Download :size="18" />
            <span class="text-sm font-medium">Download</span>
            <ChevronDown
              :size="16"
              class="transition-transform duration-200"
              :class="{ 'rotate-180': showDownloadDropdown }"
            />
          </button>

          <!-- Dropdown -->
          <div
            v-show="showDownloadDropdown"
            class="absolute text-sub-text right-0 mt-2 w-48 bg-white border border-outline rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95"
          >
            <button
              @click="downloadAll"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FolderDown :size="16" />
              <span class="font-medium">Download All</span>
            </button>

            <button
              @click="handleDownload"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FileDown :size="16" />
              <span class="font-medium">Download</span>
            </button>
          </div>
        </div>

        <!-- Bulk Edit -->
        <button
          class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
        >
          <Edit :size="18" />
          <span class="text-sm font-medium">Bulk Edit</span>
        </button>

        <!-- Grid Mode (Card) -->
        <button
          @click="changeToCard"
          :class="[
            'relative group flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition',
            activeMode === 'card'
              ? 'bg-sub-text text-white border-sub-text'
              : 'bg-white text-sub-text border-outline hover:bg-sub-text hover:text-white',
          ]"
          title="kanban view"
        >
          <LayoutGrid :size="18" :stroke-width="2" />
          <!-- Tooltip -->
        </button>

        <!-- List Mode -->
        <button
          @click="changeToList"
          :class="[
            'relative group flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition',
            activeMode === 'list'
              ? 'bg-sub-text text-white border-sub-text'
              : 'bg-white text-sub-text border-outline hover:bg-sub-text hover:text-white',
          ]"
          title="List View"
        >
          <List :size="18" :stroke-width="3" />
          <!-- Tooltip -->
        </button>
      </div>
    </div>

    <!-- Render komponen berdasarkan mode -->
    <div class="mt-4">
      <DealsCard v-if="activeMode === 'card'" />
      <DealsList v-else-if="activeMode === 'list'" />
    </div>

    <!-- Create Deal Form -->
    <CreateDealForm
      :isOpen="showCreateDealForm"
      @close="showCreateDealForm = false"
      @submit="showCreateDealForm = false"
    />

    <!-- Bulk Add Deal Form -->
    <BulkAddDealForm
      :isOpen="showBulkAddDealForm"
      @close="showBulkAddDealForm = false"
      @submit="showBulkAddDealForm = false"
    />
  </div>
</template>
