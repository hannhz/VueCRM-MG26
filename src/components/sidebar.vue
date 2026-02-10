<script setup>
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
} from "lucide-vue-next";
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo-box">
        <LayoutDashboard :size="20" class="text-white" />
      </div>
      <span>VueCRM</span>
    </div>

    <nav class="sidebar-nav">
      <a href="#" class="sidebar-item active">
        <LayoutDashboard :size="20" />
        <span>Dashboard</span>
      </a>

      <a href="#" class="sidebar-item group">
        <Users :size="20" class="sidebar-icon" />
        <span>Users</span>
      </a>

      <a href="#" class="sidebar-item group">
        <Settings :size="20" class="sidebar-icon" />
        <span>Settings</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <button class="logout-btn">
        <LogOut :size="20" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>

.sidebar {
  @apply w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col;
}

.sidebar-header {
  @apply p-6 text-white text-2xl font-bold flex items-center gap-2 border-b border-slate-800;
}

.logo-box {
  @apply w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center;
}

.sidebar-nav {
  @apply flex-1 p-4 space-y-1;
}

.sidebar-item {
  @apply flex items-center gap-3 p-3 rounded-xl transition;
}

.sidebar-item:hover {
  @apply bg-slate-800 text-white;
}

.sidebar-item.active {
  @apply bg-blue-600 text-white;
}

.sidebar-icon {
  @apply transition;
}

.group:hover .sidebar-icon {
  @apply text-blue-400;
}

.sidebar-footer {
  @apply p-4 border-t border-slate-800;
}

.logout-btn {
  @apply flex items-center gap-3 p-3 w-full rounded-xl transition text-left
         hover:bg-red-500/10 hover:text-red-500;
}
</style>
