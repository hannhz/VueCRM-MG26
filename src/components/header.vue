<script setup>
import { Bell, Search } from "lucide-vue-next";
</script>

<template>
  <header
    class="h-16 bg-white shadow-sm flex items-center justify-between px-8"
  >
    <div class="relative w-64">
      <Search class="absolute left-3 top-2.5 text-gray-400" :size="18" />
      <input
        type="text"
        placeholder="Search..."
        class="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>

    <div class="flex items-center gap-4">
      <button class="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
        <Bell :size="20" />
        <span
          class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
        ></span>
      </button>
    </div>
  </header>
</template>

<style scoped></style>
