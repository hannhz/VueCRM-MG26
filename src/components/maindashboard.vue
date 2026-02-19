<script setup>
import { ref } from "vue";
import Sidebar from "./layouts/sidebar.vue";
import Kepala from "./layouts/kepala.vue";

const collapsed = ref(false);
</script>

<template>
  <div class="flex h-screen font-sans">
    <Sidebar v-model:collapsed="collapsed" />

    <div class="flex flex-col flex-1">
      <Kepala />

      <main class="flex-1 overflow-y-auto bg-light-base p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>
