<script setup>
import { LayoutDashboard, Users, Settings, LogOut, Building2, Briefcase, CheckSquare, Mail, FileText, UserCircle } from "lucide-vue-next";
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
      <span>Sae Cafe</span>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <router-link
        to="/dashboard"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-blue-600 text-white"
      >
        <LayoutDashboard :size="20" class="group-hover:text-blue-400" />
        <span class="font-medium">Dashboard</span>
      </router-link>

      <router-link
        to="/contacts"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-blue-600 text-white"
      >
        <Users :size="20" />
        <span class="font-medium">Contacts</span>
      </router-link>

      <router-link
        to="/companies"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-blue-600 text-white"
      >
        <Building2 :size="20" class="group-hover:text-blue-400" />
        <span>Companies</span>
      </router-link>

      <router-link
        to="/deals"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-blue-600 text-white"
      >
        <Briefcase :size="20" class="group-hover:text-blue-400" />
        <span>Deals</span>
      </router-link>

      <router-link
        to="/task"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-blue-600 text-white"
      >
        <CheckSquare :size="20" class="group-hover:text-blue-400" />
        <span>Task</span>
      </router-link>

      <router-link
        to="/email-broadcast"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-blue-600 text-white"
      >
        <Mail :size="20" class="group-hover:text-blue-400" />
        <span>Email Broadcast</span>
      </router-link>

      <router-link
        to="/documents"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-blue-600 text-white"
      >
        <FileText :size="20" class="group-hover:text-blue-400" />
        <span>Documents</span>
      </router-link>

      <router-link
        to="/users"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-blue-600 text-white"
      >
        <UserCircle :size="20" class="group-hover:text-blue-400" />
        <span>Users</span>
      </router-link>

      <router-link
        to="/settings"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-blue-600 text-white"
      >
        <Settings :size="20" class="group-hover:text-blue-400" />
        <span>Settings</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <button
        class="flex items-center gap-3 p-3 w-full hover:bg-red-500/10 hover:text-red-500 rounded-xl transition text-left"
      >
        <LogOut :size="20" />
        <span>Log Out</span>
      </button>
    </div>
  </aside>
</template>

<style scoped></style>
