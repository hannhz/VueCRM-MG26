<script setup>
import Sidebar from "./layouts/sidebar.vue";
import Kepala from "./layouts/kepala.vue";
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main -->

    <div class="flex-1">
      <Kepala />

      <main class="p-6 bg-gray-100">...</main>
    </div>
  </div>
</template>
