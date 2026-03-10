<template>
  <div class="flex h-screen font-sans">
    <!-- SIDEBAR -->
    <Sidebar v-model:collapsed="collapsed" @opentabchange="handleOpenTab" />

    <div class="flex flex-col flex-1">
      <!-- HEADER -->
      <Kepala />

      <!-- TAB HEADER -->
      <div
        class="flex items-center gap-2 bg-gray-100 px-4 py-2 border-b overflow-x-auto"
      >
        <div
          v-for="tab in tabsflmenu"
          :key="tab"
          class="group relative flex items-center justify-center min-w-33 px-5 py-3 rounded-t-lg cursor-pointer whitespace-nowrap overflow-hidden transition-colors duration-150"
          :class="{
            'bg-dark-base text-white': tab.pathfile === selectedTab,
            'bg-dark-base/75 text-white': tab.pathfile !== selectedTab,
          }"
          @click="selectTab(tab)"
        >
          <span class="block max-w-45 truncate text-center text-sm font-medium leading-none">
            {{ tab.CAPTION }}
          </span>

          <div
            v-if="tab.CAPTION !== 'Dashboard'"
            class="absolute inset-y-0 right-0 flex items-center pl-3 pr-1 bg-linear-to-l from-black/35 via-black/15 to-transparent transition-all duration-200"
            :class="{
              'opacity-100 pointer-events-auto translate-x-0': tab.pathfile === selectedTab,
              'opacity-0 pointer-events-none translate-x-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-x-0': tab.pathfile !== selectedTab,
            }"
          >
            <button
              @click.stop="removeTab(tab)"
              type="button"
              class="flex h-5 w-5 items-center justify-center rounded-md text-xs text-white/80 transition-all duration-150 hover:cursor-pointer hover:bg-red-500/25 hover:text-red-200"
              aria-label="Close tab"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- CONTENT -->
      <main class="flex-1 overflow-y-auto bg-light-base p-4">
        <router-view v-slot="{ Component, route }">
          <!-- <keep-alive>  -->
          <keep-alive :include="this.nametabs">
            <component :is="Component" :key="key" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Sidebar from "./layouts/sidebar.vue";
import Kepala from "./layouts/kepala.vue";

/* contoh pages */
import Dashboard from "./dashboard.vue";

import functioncustom from "@/mixins/customformat";

export default {
  name: "MainLayout",

  components: {
    Sidebar,
    Kepala,
    Dashboard,
  },
  mixins: [functioncustom],
  computed: {
    ...mapGetters({
      getlayoutmenuweb: "settingsfe/getlayoutmenuweb",
      tabsflmenu: "tabs/getTabsFlMenu",
      nametabs: "tabs/getNameTabs",
      selectedTab: "tabs/getSelectedTab",
      selectedTabFlMenu: "tabs/getSelectedTabFlMenu",
    }),

    isScrollable() {
      return this.$route.meta.scrollable === true;
    },

    key() {
      return this.$route.path;
    },

    opentab() {
      const stored = JSON.parse(localStorage.getItem("openTabsflmenu")) ?? [];
      // const stored = localStorage.getItem("openTabs") ?? [];
      console.log(stored);
      return stored;
    },
  },

  data() {
    return {
      collapsed: false,

      opentabsflmenu: [],
      dropdownOpen: false,
      dropdownButton: null,
      dropdownMenu: null,

      /* ========================
         TAB STATE
      ======================== */
      tabs: [
        {
          name: "dashboard",
          title: "Dashboard",
          component: Dashboard,
        },
      ],

      activeTab: "dashboard",
    };
  },

  methods: {
    ...mapActions({
      addTab: "tabs/addTab",
      removeTabvuex: "tabs/removeTab",
      removeOtherTabs: "tabs/removeOtherTabs",
      removeAllTabs: "tabs/removeAllTabs",
      selectTabvuex: "tabs/selectTab",
      selectTabFlMenu: "tabs/selectTabFlMenu",
      handleOpenTabs: "tabs/handleOpenTabflmenu",
      actlayoutweb: "settingsfe/actlayoutwebflmenu",
    }),

    activeTabIndex() {
      if (!this.selectedTabFlMenu) return 0;
      const idx = this.tabsflmenu.findIndex(
        (tab) => tab.pathfile === this.selectedTabFlMenu.pathfile,
      );
      return idx >= 0 ? idx + 1 : 0;
    },

    handleOpenTab(tab) {
      this.handleOpenTabs(tab);
    },

    selectTab(tab) {
      this.selectTabvuex(tab);
    },

    removeTab(tab) {
      this.removeTabvuex(tab);
    },

    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },

    selectTabFromDropdown(tab) {
      this.selectTab(tab);
      this.selectTabFlMenu(tab);
      this.dropdownOpen = false;
    },
  },

  async mounted() {
    if (!this.getlayoutmenuweb || this.getlayoutmenuweb.length === 0) {
      await this.actlayoutweb().then((e) => {
        console.log(e);
      });
    }

    // this.loadTabsFromStorage();
  },

  watch: {
    nametabs(e) {
      console.log(e);
    },
  },
};
</script>
