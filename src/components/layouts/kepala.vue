<script setup>
import { Bell, Search, ChevronDown } from "lucide-vue-next";
</script>

<template>
  <header
    class="h-16 bg-white shadow-sm flex items-center justify-between px-4"
  >
    <div class="relative w-72">
      <Search class="absolute left-3 top-2.5 text-gray-400" :size="18" />
      <input
        type="text"
        placeholder="Type to search..."
        class="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
      />
    </div>

    <div class="flex items-center gap-4">
      <!-- Notification Bell -->
      <button class="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
        <Bell :size="20" />
        <span
          class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
        ></span>
      </button>

      <!-- User Profile -->
      <div
        class="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 transition"
      >
        <div class="flex items-center gap-3">
          <!-- Avatar with Placeholder -->
          <div
            class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          >
            TA
          </div>

          <!-- User Info -->
          <div class="text-left">
            <p class="text-sm font-semibold text-gray-800">Thomas Anree</p>
            <p class="text-xs text-gray-500">Owner</p>
          </div>
        </div>

        <!-- Dropdown Icon -->
        <ChevronDown :size="16" class="text-gray-500" />
      </div>
    </div>
  </header>
</template>

<style scoped></style>
