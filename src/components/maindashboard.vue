<script setup>
import { ref } from "vue";

import Sidebar from "./layouts/sidebar.vue";
import Kepala from "./layouts/kepala.vue";

/* contoh pages */
import Dashboard from "./dashboard.vue";

const collapsed = ref(false);

/* ========================
   TAB STATE
======================== */

const tabs = ref([
  {
    name: "dashboard",
    title: "Dashboard",
    component: Dashboard,
  },
]);

const activeTab = ref("dashboard");

/* ========================
   OPEN TAB
======================== */

function openTab(tab) {
  const exist = tabs.value.find((t) => t.name === tab.name);

  if (!exist) {
    tabs.value.push(tab);
  }

  activeTab.value = tab.name;
}

/* ========================
   CLOSE TAB
======================== */

function closeTab(name) {
  if (name === "dashboard") return;

  const index = tabs.value.findIndex((t) => t.name === name);

  tabs.value.splice(index, 1);

  if (activeTab.value === name) {
    activeTab.value = tabs.value[index - 1]?.name || tabs.value[0]?.name;
  }
}
</script>

<template>
  <div class="flex h-screen font-sans">
    <!-- SIDEBAR -->
    <Sidebar v-model:collapsed="collapsed" @open-tab="openTab" />

    <div class="flex flex-col flex-1">
      <!-- HEADER -->
      <Kepala />

      <!-- TAB HEADER -->
      <div
        class="flex items-center gap-2 bg-gray-100 px-4 py-2 border-b overflow-x-auto"
      >
        <div
          v-for="tab in tabs"
          :key="tab.name"
          @click="activeTab = tab.name"
          class="flex items-center gap-0.5 px-4 py-2 rounded-t-lg cursor-pointer whitespace-nowrap"
          :class="
            activeTab === tab.name
              ? 'bg-dark-base text-white'
              : 'bg-dark-base/75 text-white'
          "
        >
          {{ tab.title }}

          <span
            v-if="tab.name !== 'dashboard'"
            @click.stop="closeTab(tab.name)"
            class="ml-1 hover:text-red-300 cursor-pointer"
          >
            ✕
          </span>
        </div>
      </div>

      <!-- CONTENT -->
      <main class="flex-1 overflow-y-auto bg-light-base p-4">
        <KeepAlive>
          <component :is="tabs.find((t) => t.name === activeTab)?.component" />
        </KeepAlive>
      </main>
    </div>
  </div>
</template>
