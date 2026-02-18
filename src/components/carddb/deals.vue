<template>
  <!-- Deals Overview Card -->
  <div class="bg-white rounded-2xl w-full shadow-sm border border-outline p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-dark-base">Deals Overview</h2>

      <!-- More Icon -->
      <button class="p-2 rounded-lg hover:bg-outline/40 transition">
        <ellipsis :size="18" class="text-sub-text" />
      </button>
    </div>

    <!-- Sub Header -->
    <div class="flex justify-between text-sm text-sub-text font-medium mb-4">
      <span>Pipeline Summary</span>
      <span>Total</span>
    </div>

    <!-- Pipeline Items -->
    <div class="space-y-3">
      <!-- New -->
      <div class="flex items-center justify-between">
        <div
          class="flex-1 mr-4 bg-outline/40 rounded-md h-9 flex items-center px-3"
        >
          <span class="text-sm font-medium text-dark-base">New</span>
        </div>
        <span class="text-sm font-medium text-dark-base">2.1K</span>
      </div>

      <!-- Qualified -->
      <div class="flex items-center justify-between">
        <div
          class="flex-1 mr-4 bg-outline/40 rounded-md h-9 flex items-center px-3"
        >
          <span class="text-sm font-medium text-dark-base">Qualified</span>
        </div>
        <span class="text-sm font-medium text-dark-base">1.1K</span>
      </div>

      <!-- Advanced -->
      <div class="flex items-center justify-between">
        <div
          class="flex-1 mr-4 bg-outline/40 rounded-md h-9 flex items-center px-3"
        >
          <span class="text-sm font-medium text-dark-base">Advanced</span>
        </div>
        <span class="text-sm font-medium text-dark-base">500</span>
      </div>

      <!-- Won -->
      <div class="flex items-center justify-between">
        <div
          class="flex-1 mr-4 bg-outline/40 rounded-md h-9 flex items-center px-3"
        >
          <span class="text-sm font-medium text-dark-base">Won</span>
        </div>
        <span class="text-sm font-medium text-dark-base">176</span>
      </div>

      <!-- Lost -->
      <div class="flex items-center justify-between">
        <div
          class="flex-1 mr-4 bg-outline/40 rounded-md h-9 flex items-center px-3"
        >
          <span class="text-sm font-medium text-dark-base">Lost</span>
        </div>
        <span class="text-sm font-medium text-dark-base">210</span>
      </div>
    </div>
  </div>
</template>
