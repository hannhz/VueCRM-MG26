<script setup>
import { FileText, LayoutTemplate, Code2, RefreshCcw } from "lucide-vue-next";
import { useRoute } from "vue-router";

const route = useRoute();

// Mock total for the header
const totalDocuments = 6;

const menuItems = [
  {
    name: "Document List",
    icon: FileText,
    path: "/crmAdmin/documents",
    exact: true,
  },
  {
    name: "Template",
    icon: LayoutTemplate,
    path: "/crmAdmin/documents/template",
    exact: false,
  },
  {
    name: "Short Code",
    icon: Code2,
    path: "/crmAdmin/documents/short-code",
    exact: false,
  },
];

const isActive = (item) => {
  if (item.exact) {
    return route.path === item.path;
  }
  return route.path.startsWith(item.path);
};
</script>

<template>
  <!-- Header with Title and Total -->
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Documents</h1>
      <span class="text-sm text-sub-text" v-if="route.name === 'DocumentsList'">
        {{ totalDocuments }} Total Documents
      </span>
    </div>

    <!-- Update Button -->
    <button
      class="flex items-center gap-2 px-4 py-2 border border-outline bg-white text-sub-text rounded-lg hover:bg-sub-text hover:text-white transition shadow-sm"
    >
      <span class="text-sm font-medium">Update</span>
      <RefreshCcw :size="18" />
    </button>
  </div>

  <!-- Main Layout Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
    <!-- Secondary Sidebar -->
    <div
      class="bg-white rounded-xl shadow-sm border border-outline overflow-hidden sticky top-4"
    >
      <div class="bg-light-base/50 px-5 py-3 border-b border-outline">
        <h3 class="font-bold text-dark-base uppercase tracking-wider text-xs">
          Documents Menu
        </h3>
      </div>

      <nav class="p-2 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all group border border-transparent hover:bg-gray-50/50"
          active-class="text-dark-base"
          exact-active-class="bg-gray-50/80 text-dark-base border-outline/50 shadow-sm font-semibold"
        >
          <component
            :is="item.icon"
            :size="18"
            class="text-sub-text group-hover:text-dark-base group-[.router-link-exact-active]:text-dark-base"
          />
          <span
            class="font-medium text-sm group-hover:text-dark-base group-[.router-link-exact-active]:text-dark-base"
            >{{ item.name }}</span
          >
        </router-link>
      </nav>

      <div class="p-4 bg-light-base/30 border-t border-outline">
        <div class="text-[11px] text-gray-400 font-medium uppercase mb-2">
          Internal Note
        </div>
        <p class="text-xs text-sub-text leading-relaxed">
          Manage your document templates and shortcodes here for faster
          workflow.
        </p>
      </div>
    </div>

    <!-- Content Area -->
    <div class="min-w-0">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
