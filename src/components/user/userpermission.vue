<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
// import PermissionToggle from "./PermissionToggle.vue";

//data
const users = ref([
  {
    id: 1,
    name: "Hanan Hafizhah",
    email: "hanan@mail.com",
    team: "Management",
    lastactv: "2 minutes ago",
    role: "Super Admin",
  },
  {
    id: 2,
    name: "Aulia Rahman",
    email: "aulia@mail.com",
    team: "Marketing",
    lastactv: "10 minutes ago",
    role: "Admin",
  },
  {
    id: 3,
    name: "Rizky Pratama",
    email: "rizky@mail.com",
    team: "Design",
    lastactv: "1 hour ago",
    role: "Editor",
  },
  {
    id: 4,
    name: "Siti Lestari",
    email: "siti@mail.com",
    team: "Finance",
    lastactv: "Yesterday",
    role: "Viewer",
  },
  {
    id: 5,
    name: "Budi Santoso",
    email: "budi@mail.com",
    team: "Development",
    lastactv: "2 days ago",
    role: "Admin",
  },
  {
    id: 6,
    name: "Kevin Wijaya",
    email: "kevin@mail.com",
    team: "Support",
    lastactv: "3 days ago",
    role: "Viewer",
  },
]);

const selectedUsers = ref([]);

const tabs = ["Contacts", "Companies", "Deals", "Tasks", "Admin"];
const activeTab = ref("Contacts");

const permissions = ref({
  contacts: {
    add: true,
    view: true,
    edit: true,
    delete: false,
  },
  companies: {
    add: true,
    delete: false,
  },
  deals: {
    delete: false,
  },
});

const search = ref("");
const isOpen = ref(false);
const filteredUsers = ref([...users.value]);

function openDropdown() {
  isOpen.value = true;
  filteredUsers.value = users.value; // tampilkan semua saat klik
}

function filterUsers() {
  const keyword = search.value.toLowerCase();

  filteredUsers.value = users.value.filter((user) =>
    user.name.toLowerCase().includes(keyword),
  );
}

function selectUser(user) {
  search.value = user.name; // isi input dengan pilihan
  isOpen.value = false;
}

function handleClickOutside(e) {
  if (!e.target.closest(".relative")) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);
</script>

<template>
  <div class="bg-white rounded-xl border border-outline shadow-sm">
    <!-- HEADER -->
    <div class="p-4 border-b border-outline">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <!-- Left Section: Filter + Search + Show -->
        <div class="flex items-center gap-3">
          <!-- Search Input -->
          <div class="relative w-64">
            <!-- INPUT -->
            <input
              v-model="search"
              @focus="openDropdown"
              @input="filterUsers"
              type="text"
              placeholder="Search and select name"
              class="pl-3 pr-4 py-2 bg-white border border-outline rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
            />

            <!-- DROPDOWN -->
            <div
              v-if="isOpen"
              class="absolute mt-1 w-full bg-white border border-outline rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto"
            >
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                @click="selectUser(user)"
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {{ user.name }}
              </div>

              <div
                v-if="filteredUsers.length === 0"
                class="px-3 py-2 text-xs text-gray-400"
              >
                No results
              </div>
            </div>
          </div>
        </div>

        <!-- Right Section: Action Buttons -->
        <div class="flex items-center gap-2"></div>
      </div>
    </div>

    <!-- TABS -->
    <div class="border-b border-outline">
      <nav class="flex gap-6 px-4 text-sm">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'py-3 border-b-2 transition',
            activeTab === tab
              ? 'border-primary text-primary font-medium'
              : 'border-transparent text-gray-400',
          ]"
        >
          {{ tab }}
        </button>
      </nav>
    </div>

    <!-- TAB CONTENT -->
    <div class="p-4 space-y-4">
      <!-- CONTACT ACCESS -->
      <div v-if="activeTab === 'Contacts'">
        <div
          class="flex items-center justify-between py-3 border-b border-gray-100"
        >
          <div>
            <p class="font-medium text-sm">Add</p>
            <p class="text-xs text-gray-500">Add contacts</p>
          </div>
          <input
            type="checkbox"
            v-model="permissions.contacts.add"
            class="toggle text-primary focus:ring-primary"
          />
        </div>

        <div
          class="flex items-center justify-between py-3 border-b border-gray-100"
        >
          <div>
            <p class="font-medium text-sm">Edit</p>
            <p class="text-xs text-gray-500">Edit contacts</p>
          </div>
          <input
            type="checkbox"
            v-model="permissions.contacts.edit"
            class="toggle text-primary focus:ring-primary"
          />
        </div>

        <div
          class="flex items-center justify-between py-3 border-b border-gray-100"
        >
          <div>
            <p class="font-medium text-sm">Delete</p>
            <p class="text-xs text-gray-500">Delete contacts</p>
          </div>
          <input
            type="checkbox"
            v-model="permissions.contacts.delete"
            class="toggle text-primary focus:ring-primary"
          />
        </div>
      </div>

      <!-- COMPANY ACCESS -->
      <div v-if="activeTab === 'Companies'">
        <div
          class="flex items-center justify-between py-3 border-b border-gray-100"
        >
          <div>
            <p class="font-medium text-sm">Add</p>
            <p class="text-xs text-gray-500">Add companies</p>
          </div>
          <input
            type="checkbox"
            v-model="permissions.companies.add"
            class="toggle text-primary focus:ring-primary"
          />
        </div>

        <div
          class="flex items-center justify-between py-3 border-b border-gray-100"
        >
          <div>
            <p class="font-medium text-sm">Delete</p>
            <p class="text-xs text-gray-500">Delete companies</p>
          </div>
          <input
            type="checkbox"
            v-model="permissions.companies.delete"
            class="toggle text-primary focus:ring-primary"
          />
        </div>
      </div>

      <!-- DEALS ACCESS -->
      <div v-if="activeTab === 'Deals'">
        <div
          class="flex items-center justify-between py-3 border-b border-gray-100"
        >
          <div>
            <p class="font-medium text-sm">Delete</p>
            <p class="text-xs text-gray-500">Delete deals</p>
          </div>
          <input
            type="checkbox"
            v-model="permissions.deals.delete"
            class="toggle text-primary focus:ring-primary"
          />
        </div>
      </div>

      <!-- TASKS ACCESS -->
      <div v-if="activeTab === 'Tasks'">
        <div
          class="flex items-center justify-between py-3 border-b border-gray-100"
        >
          <div>
            <p class="font-medium text-sm">Delete</p>
            <p class="text-xs text-gray-500">Delete task</p>
          </div>
          <input
            type="checkbox"
            v-model="permissions.deals.delete"
            class="toggle text-primary focus:ring-primary"
          />
        </div>
      </div>

      <!-- ADMIN ACCESS -->
      <div v-if="activeTab === 'Admin'">
        <div
          class="flex items-center justify-between py-3 border-b border-gray-100"
        >
          <div>
            <p class="font-medium text-sm">Delete</p>
            <p class="text-xs text-gray-500">Delete admin</p>
          </div>
          <input
            type="checkbox"
            v-model="permissions.deals.delete"
            class="toggle text-primary focus:ring-primary"
          />
        </div>
      </div>
    </div>
  </div>
</template>
