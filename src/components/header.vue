<script setup>
import { Bell, Search } from "lucide-vue-next";
</script>

<template>
  <header class="header">
    <div class="search-box">
      <Search class="search-icon" :size="18" />
      <input class="search-input" placeholder="Search..." />
    </div>

    <button class="notif-btn">
      <Bell :size="20" />
      <span class="notif-dot"></span>
    </button>
  </header>
</template>

<style scoped>
.header {
  @apply h-16 bg-white shadow-sm flex items-center justify-between px-8;
}

.search-box {
  @apply relative w-64;
}

.search-icon {
  @apply absolute left-3 top-2.5 text-gray-400;
}

.search-input {
  @apply pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg w-full
         focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm;
}

.notif-btn {
  @apply p-2 text-gray-400 hover:bg-gray-100 rounded-full relative;
}

.notif-dot {
  @apply absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white;
}
</style>
