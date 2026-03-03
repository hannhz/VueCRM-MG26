<script setup>
import { ref } from "vue";
import { User, UserCog, Users, RefreshCcw } from "lucide-vue-next";
import UserSettings from "./usersetings.vue"; // perhatikan nama file (sesuaikan)
import UserPermission from "./userpermission.vue";
import UserTeam from "./userteam.vue";

const activeTab = ref("settings"); // 'settings', 'permission', 'team'

const menuItems = [
  { key: "settings", label: "User Settings", icon: User },
  { key: "permission", label: "User Permission", icon: UserCog },
  { key: "team", label: "Team", icon: Users },
];

// Data dummy untuk total user (nanti dari API)
const users = [];
const totalUser = users.length;
</script>

<template>
  <!-- Main Layout Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
    <!-- Secondary Sidebar -->
    <div
      class="bg-white rounded-xl shadow-sm border border-outline overflow-hidden sticky"
    >
      <div class="bg-light-base/50 px-5 py-3 border-b border-outline">
        <h3 class="font-bold text-dark-base uppercase tracking-wider text-xs">
          User Menu
        </h3>
      </div>

      <nav class="p-2 space-y-1">
        <button
          v-for="item in menuItems"
          :key="item.key"
          @click="activeTab = item.key"
          class="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition"
          :class="[
            activeTab === item.key
              ? 'bg-gray-50/80 text-dark-base border-outline/50 shadow-sm font-semibold'
              : 'hover:bg-gray-50/50 text-sub-text',
          ]"
        >
          <component :is="item.icon" :size="18" />
          <span class="text-sm">{{ item.label }}</span>
        </button>
      </nav>

      <div class="p-4 bg-light-base/30 border-t border-outline">
        <div class="text-[11px] text-gray-400 font-medium uppercase mb-2">
          User Total
        </div>
        <div class="space-y-2 text-sm text-sub-text">
          <div class="flex justify-between">
            <span>Number of Users</span>
            <span class="font-medium">{{ totalUser }}</span>
          </div>
          <div class="flex justify-between">
            <span>Maximum Users</span>
            <span class="font-medium">10</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="min-w-0">
      <UserSettings v-if="activeTab === 'settings'" />
      <UserPermission v-else-if="activeTab === 'permission'" />
      <UserTeam v-else-if="activeTab === 'team'" />
    </div>
  </div>
</template>
