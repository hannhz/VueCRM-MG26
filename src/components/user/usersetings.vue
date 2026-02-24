<script setup>
import { RefreshCcw, User, UserCog, Users } from "lucide-vue-next";
const users = [{}];
</script>

<template>
  <!-- Header -->
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Users Settings</h1>
    </div>

    <button
      class="flex items-center gap-2 px-4 py-2 border border-outline bg-white text-sub-text rounded-lg hover:bg-sub-text hover:text-white transition shadow-sm-sm"
    >
      <span class="text-sm font-medium">Update</span>
      <RefreshCcw :size="18" />
    </button>
  </div>

  <!-- CONTENT -->
  <div class="mb-4">
    <div class="grid lg:grid-cols-[260px_1fr] gap-6">
      <!-- LEFT -->
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-outline">
          <div class="bg-outline/40 px-4 py-2 font-semibold text-sub-text">
            User Settings
          </div>

          <ul class="divide-y divide-outline text-sm text-sub-text">
            <li class="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
              <User :size="16" />
              <span>Users</span>
            </li>
            <li class="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
              <UserCog :size="16" />
              <span>Users Permission</span>
            </li>
            <li class="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
              <Users :size="16" />
              <span>Team</span>
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-outline">
          <div class="bg-outline/40 px-4 py-2 font-semibold text-sub-text">
            Total Users
          </div>

          <div class="divide-y divide-outline text-sm text-sub-text">
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
      <!-- RIGHT -->
       
    </div>
  </div>
    <router-view />
</template>