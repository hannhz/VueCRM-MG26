<script setup>
import { ref } from "vue";
const showCreateDealForm = ref(false);

import {
  ChevronDown,
  FileDown,
  FolderDown,
  Download,
  Edit,
  LayoutGrid,FolderPlus,
  FilePlus,
  List,
} from "lucide-vue-next";

const density = ref("comfy"); // comfy | compact

const viewMode = ref("grid"); // defaultnya grid

const totalDeals = ref(18600);
const showDropdown = ref(false);
const showAddContactForm = ref(false);
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};
const handleBulkAdd = () => {
  console.log("Bulk add deals");
};

const showDownloadDropdown = ref(false);
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
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Deals</h1>
      <span class="text-sm text-sub-text"
        >{{ totalDeals.toLocaleString() }} Total Deals</span
      >
    </div>

    <!-- Action Button -->
    <div class="flex items-center gap-2 ml-auto">
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
              showAddContactForm = true;
              showDropdown = false;
            "
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <FilePlus :size="18" />
            <span class="font-medium"> Single Deals </span>
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

      <!-- Grid Mode -->
      <router-link
        :to="{ name: 'DealsCard' }"
        custom
        v-slot="{ navigate, isActive }"
      >
        <button
          @click="navigate"
          :class="[
            isActive
              ? 'bg-sub-text text-white border-sub-text'
              : 'bg-white text-sub-text border-outline hover:bg-slate-50',
          ]"
          class="flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition"
        >
          <LayoutGrid :size="18" :stroke-width="3" />
        </button>
      </router-link>

      <!-- List Mode -->
      <router-link
        :to="{ name: 'DealsList' }"
        custom
        v-slot="{ navigate, isActive }"
      >
        <button
          @click="navigate"
          :class="[
            isActive
              ? 'bg-sub-text text-white border-sub-text'
              : 'bg-white text-sub-text border-outline hover:bg-slate-50',
          ]"
          class="flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition"
        >
          <List :size="18" :stroke-width="3" />
        </button>
      </router-link>
    </div>
  </div>
  <router-view />
</template>
