<script setup>
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-vue-next";
</script>

<template>
  <aside class="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
    <div
      class="p-6 text-white text-2xl font-bold flex items-center gap-2 border-b border-slate-800"
    >
      <div
        class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
      >
        <LayoutDashboard :size="20" class="text-white" />
      </div>
      <span>VueCRM</span>
    </div>

    <nav class="flex-1 p-4 space-y-1">
      <a
        href="#"
        class="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl transition"
      >
        <LayoutDashboard :size="20" />
        <span class="font-medium">Dashboard</span>
      </a>

      <a
        href="#"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
      >
        <Users :size="20" class="group-hover:text-blue-400" />
        <span>Users</span>
      </a>

      <a
        href="#"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
      >
        <Settings :size="20" class="group-hover:text-blue-400" />
        <span>Settings</span>
      </a>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <button
        class="flex items-center gap-3 p-3 w-full hover:bg-red-500/10 hover:text-red-500 rounded-xl transition text-left"
      >
        <LogOut :size="20" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped></style>
