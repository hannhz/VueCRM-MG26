<script setup>
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Building2,
  Briefcase,
  CheckSquare,
  Mail,
  FileText,
  UserCircle,
} from "lucide-vue-next";
import { ref } from "vue";
const collapsed = ref(false);
</script>

<template>
  <aside
    :class="[
      'bg-dark-base text-slate-300 hidden md:flex flex-col h-screen overflow-hidden transition-all duration-300',
      collapsed ? 'w-20' : 'w-64',
    ]"
  >
    <div
      class="p-6 text-white text-2xl font-bold flex items-center gap-2 border-b border-slate-800 shrink-0"
    >
      <div
        class="w-8 h-8 bg-dark-base rounded-lg flex items-center justify-center"
      >
        <button
          @click="collapsed = !collapsed"
          class="ml-auto text-slate-400 hover:text-white"
        >
          <LayoutDashboard :size="20" />
        </button>
      </div>
      <span v-show="!collapsed" class="truncate">Sae Cafe</span>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <router-link
        to="/dashboard"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-dark-hover text-white"
      >
        <LayoutDashboard :size="20" class="group-hover:text-blue-400" />
        <span v-show="!collapsed" class="truncate">Dashboard</span>
      </router-link>

      <div
        :class="[
          'h-[0.75px] my-3 bg-outline transition-all duration-300',
          collapsed ? 'w-6 mx-auto' : 'w-20 mx-auto',
        ]"
      ></div>

      <router-link
        to="/contacts"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-dark-hover text-white"
      >
        <Users :size="20" class="group-hover:text-blue-400" />
        <span v-show="!collapsed" class="truncate">Contacts</span>
      </router-link>

      <router-link
        to="/companies"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-dark-hover text-white"
      >
        <Building2 :size="20" class="group-hover:text-blue-400" />
        <span v-show="!collapsed" class="truncate">Companies</span>
      </router-link>

      <div
        :class="[
          'h-[0.75px] my-3 bg-outline transition-all duration-300',
          collapsed ? 'w-6 mx-auto' : 'w-20 mx-auto',
        ]"
      ></div>

      <router-link
        to="/deals"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-dark-hover text-white"
      >
        <Briefcase :size="20" class="group-hover:text-blue-400" />
        <span v-show="!collapsed" class="truncate">Deals</span>
      </router-link>

      <div
        :class="[
          'h-[0.75px] my-3 bg-outline transition-all duration-300',
          collapsed ? 'w-6 mx-auto' : 'w-20 mx-auto',
        ]"
      ></div>

      <router-link
        to="/task"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-dark-hover text-white"
      >
        <CheckSquare :size="20" class="group-hover:text-blue-400" />
        <span v-show="!collapsed" class="truncate">Task</span>
      </router-link>

      <router-link
        to="/email-broadcast"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-dark-hover text-white"
      >
        <Mail :size="20" class="group-hover:text-blue-400" />
        <span v-show="!collapsed" class="truncate">Broadcast</span>
      </router-link>

      <div
        :class="[
          'h-[0.75px] my-3 bg-outline transition-all duration-300',
          collapsed ? 'w-6 mx-auto' : 'w-20 mx-auto',
        ]"
      ></div>

      <router-link
        to="/documents"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-dark-hover text-white"
      >
        <FileText :size="20" class="group-hover:text-blue-400" />
        <span v-show="!collapsed" class="truncate">Documents</span>
      </router-link>

      <div
        :class="[
          'h-[0.75px] my-3 bg-outline transition-all duration-300',
          collapsed ? 'w-6 mx-auto' : 'w-20 mx-auto',
        ]"
      ></div>

      <router-link
        to="/users"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-dark-hover text-white"
      >
        <UserCircle :size="20" class="group-hover:text-blue-400" />
        <span v-show="!collapsed" class="truncate">Users</span>
      </router-link>

      <router-link
        to="/settings"
        class="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl transition group"
        active-class="bg-dark-hover text-white"
      >
        <Settings :size="20" class="group-hover:text-blue-400" />
        <span v-show="!collapsed" class="truncate">Settings</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-800 shrink-0">
      <button
        class="flex bg-dark-red items-center text-white gap-3 p-3 w-full hover:bg-red-500/10 hover:text-red-500 rounded-xl transition text-left"
      >
        <LogOut :size="20" />
        <span v-show="!collapsed" class="font-medium truncate">Log Out</span>
      </button>
    </div>
  </aside>
</template>

<style scoped></style>
