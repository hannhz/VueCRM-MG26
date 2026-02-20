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
  ListCollapse,
} from "lucide-vue-next";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const collapsed = ref(false);
const isHovered = ref(false);

const mediaQuery = window.matchMedia("(max-width: 1200px)");

const handleMedia = (e) => {
  collapsed.value = e.matches;
};

onMounted(() => {
  collapsed.value = mediaQuery.matches;
  mediaQuery.addEventListener("change", handleMedia);
});

onBeforeUnmount(() => {
  mediaQuery.removeEventListener("change", handleMedia);
});

const sidebarWidth = computed(() => {
  if (collapsed.value) {
    return isHovered.value ? "w-64" : "w-20";
  }
  return "w-64";
});

const isExpanded = computed(() => {
  return !collapsed.value || isHovered.value;
});

import { defineEmits, watch } from "vue";

const emit = defineEmits(["update:collapsed"]);

watch(collapsed, (val) => {
  emit("update:collapsed", val);
});
</script>

<template>
  <aside
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="[
      'flex flex-col bg-dark-base text-slate-300 h-screen transition-all duration-300',

      // 🔥 kalau collapsed + hover → overlay
      collapsed && isHovered
        ? 'left-0 top-0 w-64 shadow-xl z-50'
        : // 🔥 kalau normal expand
          !collapsed
          ? 'relative w-64'
          : // 🔥 collapsed normal
            'relative w-20',
    ]"
  >
    <div
      :class="[
        'px-5 py-2 text-white text-2xl font-bold flex items-center border-b border-slate-800 shrink-0',
        isExpanded ? 'gap-2 justify-start' : 'justify-center',
      ]"
    >
      <span v-show="isExpanded" class="truncate">CRM MG26</span>
      <button
        @click="collapsed = !collapsed"
        :class="[
          'w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800',
          isExpanded ? 'ml-auto' : '',
        ]"
      >
        <ListCollapse :size="20" />
      </button>
    </div>

    <nav class="flex-1 min-h-0 p-4 space-y-1 overflow-y-auto">
      <router-link
        to="/crmAdmin"
        :class="[
          'flex h-12 items-center p-3 rounded-xl transition group hover:bg-slate-800 hover:text-white',
          isExpanded ? 'gap-3 justify-start' : 'justify-center',
        ]"
        exact-active-class="bg-dark-hover text-white"
      >
        <div class="w-6 flex justify-center">
          <LayoutDashboard :size="20" class="group-hover:text-blue-400" />
        </div>

        <span v-show="isExpanded" class="truncate">Dashboard</span>
      </router-link>

      <div
        :class="[
          'h-[0.75px] my-3 bg-outline transition-all duration-300',
          isExpanded ? 'w-20 mx-auto' : 'w-6 mx-auto',
        ]"
      ></div>

      <router-link
        to="/crmAdmin/contacts"
        :class="[
          'flex h-12 items-center p-3 rounded-xl transition group hover:bg-slate-800 hover:text-white',
          isExpanded ? 'gap-3 justify-start' : 'justify-center',
        ]"
        exact-active-class="bg-dark-hover text-white"
      >
        <div class="w-6 flex justify-center">
          <Users :size="20" class="group-hover:text-blue-400" />
        </div>
        <span v-show="isExpanded" class="truncate">Contacts</span>
      </router-link>

      <router-link
        to="/crmAdmin/companies"
        :class="[
          'flex h-12 items-center p-3 rounded-xl transition group hover:bg-slate-800 hover:text-white',
          isExpanded ? 'gap-3 justify-start' : 'justify-center',
        ]"
        exact-active-class="bg-dark-hover text-white"
      >
        <div class="w-6 flex justify-center">
          <Building2 :size="20" class="group-hover:text-blue-400" />
        </div>
        <span v-show="isExpanded" class="truncate">Companies</span>
      </router-link>

      <div
        :class="[
          'h-[0.75px] my-3 bg-outline transition-all duration-300',
          isExpanded ? 'w-20 mx-auto' : 'w-6 mx-auto',
        ]"
      ></div>

      <router-link
        :to="{ name: 'DealsCard' }"
        :class="[
          'flex h-12 items-center p-3 rounded-xl transition group hover:bg-slate-800 hover:text-white',
          isExpanded ? 'gap-3 justify-start' : 'justify-center',
        ]"
        active-class="bg-dark-hover text-white"
        ><div class="w-6 flex justify-center">
          <Briefcase :size="20" class="group-hover:text-blue-400" />
        </div>
        <span v-show="isExpanded" class="truncate">Deals</span>
      </router-link>

      <div
        :class="[
          'h-[0.75px] my-3 bg-outline transition-all duration-300',
          isExpanded ? 'w-20 mx-auto' : 'w-6 mx-auto',
        ]"
      ></div>

      <router-link
        to="/crmAdmin/task"
        :class="[
          'flex h-12 items-center p-3 rounded-xl transition group hover:bg-slate-800 hover:text-white',
          isExpanded ? 'gap-3 justify-start' : 'justify-center',
        ]"
        exact-active-class="bg-dark-hover text-white"
        ><div class="w-6 flex justify-center">
          <CheckSquare :size="20" class="group-hover:text-blue-400" />
        </div>
        <span v-show="isExpanded" class="truncate">Task</span>
      </router-link>

      <router-link
        to="/crmAdmin/email-broadcast"
        :class="[
          'flex h-12 items-center p-3 rounded-xl transition group hover:bg-slate-800 hover:text-white',
          isExpanded ? 'gap-3 justify-start' : 'justify-center',
        ]"
        exact-active-class="bg-dark-hover text-white"
        ><div class="w-6 flex justify-center">
          <Mail :size="20" class="group-hover:text-blue-400" />
        </div>
        <span v-show="isExpanded" class="truncate">Broadcast</span>
      </router-link>

      <div
        :class="[
          'h-[0.75px] my-3 bg-outline transition-all duration-300',
          isExpanded ? 'w-20 mx-auto' : 'w-6 mx-auto',
        ]"
      ></div>

      <router-link
        to="/crmAdmin/documents"
        :class="[
          'flex h-12 items-center p-3 rounded-xl transition group hover:bg-slate-800 hover:text-white',
          isExpanded ? 'gap-3 justify-start' : 'justify-center',
        ]"
        exact-active-class="bg-dark-hover text-white"
        ><div class="w-6 flex justify-center">
          <FileText :size="20" class="group-hover:text-blue-400" />
        </div>
        <span v-show="isExpanded" class="truncate">Documents</span>
      </router-link>

      <div
        :class="[
          'h-[0.75px] my-3 bg-outline transition-all duration-300',
          isExpanded ? 'w-20 mx-auto' : 'w-6 mx-auto',
        ]"
      ></div>

      <router-link
        to="/crmAdmin/users"
        :class="[
          'flex h-12 items-center p-3 rounded-xl transition group hover:bg-slate-800 hover:text-white',
          isExpanded ? 'gap-3 justify-start' : 'justify-center',
        ]"
        exact-active-class="bg-dark-hover text-white"
        ><div class="w-6 flex justify-center">
          <UserCircle :size="20" class="group-hover:text-blue-400" />
        </div>
        <span v-show="isExpanded" class="truncate">Users</span>
      </router-link>

      <router-link
        to="/crmAdmin/settings"
        :class="[
          'flex h-12 items-center p-3 rounded-xl transition group hover:bg-slate-800 hover:text-white',
          isExpanded ? 'gap-3 justify-start' : 'justify-center',
        ]"
        exact-active-class="bg-dark-hover text-white"
        ><div class="w-6 flex justify-center">
          <Settings :size="20" class="group-hover:text-blue-400" />
        </div>
        <span v-show="isExpanded" class="truncate">Settings</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-800 shrink-0">
      <button
        :class="[
          'flex items-center p-3 w-full rounded-xl transition bg-dark-red text-white hover:bg-red-700',
          isExpanded ? 'gap-3 justify-start text-left' : 'justify-center',
        ]"
      >
        <LogOut :size="20" />
        <span v-show="isExpanded" class="font-medium truncate"> Log Out </span>
      </button>
    </div>
  </aside>
</template>

<style scoped></style>
