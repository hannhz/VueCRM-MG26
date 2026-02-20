<script setup>
import { ref } from "vue";
const showCreateDealForm = ref(false);

import {
  ChevronDown,
  Download,
  Edit,
  LayoutGrid,
  List,
} from "lucide-vue-next";

const density = ref("comfy"); // comfy | compact

const viewMode = ref("grid"); // defaultnya grid

const totalDeals = ref(18600);
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
      <button
        @click="showCreateDealForm = true"
        class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
      >
        <span class="text-lg font-semibold">+</span>
        <span class="text-sm font-medium">Add New</span>
        <ChevronDown :size="16" />
      </button>

      <!-- Download -->
      <button
        class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
      >
        <Download :size="18" />
        <span class="text-sm font-medium">Download</span>
        <ChevronDown :size="16" />
      </button>

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
              ? 'bg-blue-600 text-white border-blue-600'
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
              ? 'bg-blue-600 text-white border-blue-600'
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
