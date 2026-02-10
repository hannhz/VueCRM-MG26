<script setup>
// Impor icon yang dibutuhkan 
import { LayoutDashboard, Users, Settings, Bell, Search, LogOut } from 'lucide-vue-next';
</script>

<template>
    <div class="flex h-screen">
  <!-- Sidebar -->
  <aside class="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
      <div class="p-6 text-white text-2xl font-bold flex items-center gap-2 border-b border-slate-800">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <LayoutDashboard :size="20" class="text-white" />
        </div>
        <span>VueCRM</span>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <a href="#" class="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl transition">
          <LayoutDashboard :size="20" />
          <span class="font-medium">Dashboard</span>
        </a>

        <a href="#" class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group">
          <Users :size="20" class="group-hover:text-blue-400" />
          <span>Users</span>
        </a>

        <a href="#" class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group">
          <Settings :size="20" class="group-hover:text-blue-400" />
          <span>Settings</span>
        </a>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <button class="flex items-center gap-3 p-3 w-full hover:bg-red-500/10 hover:text-red-500 rounded-xl transition text-left">
          <LogOut :size="20" />
          <span>Logout</span>
        </button>
      </div>
    </aside>


  <!-- Main -->
  <div class="flex-1">
    <!-- Header -->
    <header class="h-16 bg-white shadow-sm flex items-center justify-between px-8">
  <div class="relative w-64">
    <Search class="absolute left-3 top-2.5 text-gray-400" :size="18" />
    <input type="text" placeholder="Search..." class="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
  </div>
  
  <div class="flex items-center gap-4">
    <button class="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
      <Bell :size="20" />
      <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
    </button>
    </div>
</header>

<!-- Content -->
    <main class="p-6 bg-gray-100">
      ...
    </main>
  </div>
</div>
</template>

<style scoped></style>
