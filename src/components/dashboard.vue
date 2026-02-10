<script setup>
import Sidebar from "./layouts/sidebar.vue";
import Kepala from "./layouts/kepala.vue";
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <Kepala />

      <main class="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p class="mt-4 text-gray-600">Welcome to your CRM dashboard!</p>
      </main>
    </div>
  </div>
</template>
