<script setup>
import { RefreshCcw, User2, KeyRound } from "lucide-vue-next";

const users = [{}];

</script>

<template>
  <!-- Header with Title and Total -->
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Users Settings</h1>
    </div>

    <!-- Update Button -->
    <button
      class="flex items-center gap-2 px-4 py-2 border border-outline bg-white text-sub-text rounded-lg hover:bg-sub-text hover:text-white transition shadow-sm-sm"
    >
      <span class="text-sm font-medium">Update</span>
      <RefreshCcw :size="18" />
    </button>
  </div>

  <div class="p-4 md:p-6 space-y-6">

    <!-- TOP GRID -->
    <div class="grid lg:grid-cols-[260px_1fr] gap-6">

      <!-- LEFT SIDEBAR -->
      <div class="space-y-6">

        <!-- USER SETTINGS -->
        <div class="bg-white rounded-lg shadow-sm border border-outline">
          <div class="bg-outline/40 px-4 py-2 font-semibold text-sub-text">
            User Settings
          </div>

          <ul class="divide-y divide-outline text-sm text-sub-text">
            <li class="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
  <User2 :size="16" class="text-sub-text" />
  <span>Users</span>
</li>
            <li class="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
  <KeyRound :size="16" class="text-sub-text" /> 
  <span>Users Permission</span>
</li>
            <li class="p-3 hover:bg-gray-50 cursor-pointer">Teams</li>
          </ul>
        </div>

        <!-- STATS -->
        <div class="bg-white rounded-lg shadow-sm border border-outline">
          <div class="bg-outline/40 px-4 py-2 font-semibold text-sub-text">
            Total Users
          </div>

          <div class="divide-y devide-outline text-sm text-sub-text">
            <div class="flex justify-between p-3">
              <span>Number of Users</span>
              <span class="font-medium">{{ users.length }}</span>
            </div>
            <div class="flex justify-between p-3">
              <span>Maximum Users</span>
              <span class="font-medium">10</span>
            </div>
          </div>
        </div>

      </div>
      </div>
      </div>
  
</template>
