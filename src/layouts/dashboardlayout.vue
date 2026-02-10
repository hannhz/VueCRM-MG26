<script setup>
import Sidebar from "../components/sidebar.vue";
import Header from "../components/header.vue";
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <main class="flex-1">
      <Header />
      <slot />
    </main>
  </div>
</template>
