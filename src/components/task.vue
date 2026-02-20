<script setup>
import { ref } from "vue";
import {
  ChevronDown,
  Download,
  Trash,
  FolderDown,
  FileDown,
  FilePlus,
  FolderPlus,
  Edit,
  LayoutGrid,
  List,
  CalendarDays,
} from "lucide-vue-next";

const showDropdown = ref(false);
const showDownloadDropdown = ref(false);
const totalTask = ref(12);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function toggleDownloadDropdown() {
  showDownloadDropdown.value = !showDownloadDropdown.value;
}

function handleBulkAdd() {
  console.log("Bulk Add Task");
}

function downloadAll() {
  console.log("Download All Tasks");
}

function handleDownload() {
  console.log("Download Selected Tasks");
}
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Task</h1>
      <span class="text-sm text-sub-text"
        >{{ totalTask.toLocaleString() }} Total Task</span
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
            <span class="font-medium"> Single Task </span>
          </button>

          <button
            @click="
              handleBulkAdd();
              showDropdown = false;
            "
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <FolderPlus :size="18" />
            <span class="font-medium"> Bulk Task </span>
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

      <!--- Delete Mode -->
      <button
        @click="handleDelete"
        class="flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition bg-white text-sub-text border-outline hover:bg-red hover:text-white hover:border-red"
      >
        <Trash :size="18" :stroke-width="2" />
      </button>

      <!-- List Mode -->
      <router-link
        :to="{ name: 'TaskList' }"
        custom
        v-slot="{ navigate, isActive }"
      >
        <button
          @click="navigate"
          :class="[
            isActive
              ? 'bg-sub-text text-white border-sub-text'
              : 'bg-white text-sub-text border-outline hover:bg-sub-text hover:text-white',
          ]"
          class="flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition"
        >
          <List :size="18" :stroke-width="3" />
        </button>
      </router-link>

      <!-- calender Mode -->
      <router-link
        :to="{ name: 'TaskCalender' }"
        custom
        v-slot="{ navigate, isActive }"
      >
        <button
          @click="navigate"
          :class="[
            isActive
              ? 'bg-sub-text text-white border-sub-text'
              : 'bg-white text-sub-text border-outline hover:bg-sub-text hover:text-white',
          ]"
          class="flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition"
        >
          <CalendarDays :size="18" :stroke-width="2" />
        </button>
      </router-link>

      <!-- Grid Mode -->
      <router-link
        :to="{ name: 'TaskCard' }"
        custom
        v-slot="{ navigate, isActive }"
      >
        <button
          @click="navigate"
          :class="[
            isActive
              ? 'bg-sub-text text-white border-sub-text'
              : 'bg-white text-sub-text border-outline hover:bg-sub-text hover:text-white',
          ]"
          class="flex items-center justify-center px-4 py-2 h-10 rounded-lg border transition"
        >
          <LayoutGrid :size="18" :stroke-width="2" />
        </button>
      </router-link>
    </div>
  </div>
  <router-view />
</template>
