<script setup>
import { ref } from "vue";
import { Filter, Search } from "lucide-vue-next";
const taskText = ref("");
const emit = defineEmits(["add"]);
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm max-w-311.25 h-147 border border-outline flex flex-col overflow-hidden"
  >
    <!-- Action Bar -->
    <div class="pt-4 pr-4 pl-4">
      <div class="flex items-center gap-4 w-full">
        <!-- LEFT -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <!-- Filter -->
          <button
            class="p-2 border border-outline rounded-lg hover:bg-outline/30 transition"
          >
            <Filter :size="20" class="text-dark-base" />
          </button>

          <!-- Search -->
          <input
            type="text"
            placeholder="Search by Name"
            class="pl-3 pr-4 py-2 bg-white border border-outline rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
          />

          <!-- Search Btn -->
          <button
            class="p-2 bg-outline hover:bg-outline/30 rounded-lg transition"
          >
            <Search :size="20" class="text-dark-base" />
          </button>

          <!-- Show -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-dark-base">Show</span>
            <select class="px-3 py-2 border border-outline rounded-lg text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>

        <!-- quick add -->
      </div>
    </div>
  </div>
</template>
