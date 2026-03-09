<!-- <script setup>
import { ref, computed, watch } from "vue";
import {
  RefreshCcw,
  Filter,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-vue-next";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import CreateUserForm from "../forms/CreateUserForm.vue";
import { useStore } from "vuex";

//data
// data
const store = useStore();
const router = useRouter();

// Store mapping
const users = computed(() => store.getters["users/allUsers"]);
const isLoadingTable = computed(() => store.getters["users/isLoading"]);
const errorMsgTable = computed(() => store.getters["users/error"]);

// Admin validation
const isAdmin = computed(() => {
  const user = store.state.auth.user;
  return user && (user.role === 'admin' || user.stafflevel === 'admin' || user.role === 'Admin');
});

const fetchUsers = () => {
  store.dispatch("users/fetchUsers").catch(err => {
    console.error("Component fetch error:", err);
  });
};

onMounted(() => {
  // if (!isAdmin.value) {
  //   console.warn("Access denied: User is not an admin");
  //   router.push("/crmAdmin");
  //   return;
  // }
  fetchUsers();
});

const showCreateUserForm = ref(false);

//pagination

const itemsPerPage = ref(5);
const currentPage = ref(1);

const totalDocuments = computed(() => users.value.length);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalDocuments.value / itemsPerPage.value)),
);

/* pastikan page valid */
watch(currentPage, (val) => {
  if (val < 1) currentPage.value = 1;
  if (val > totalPages.value) currentPage.value = totalPages.value;
});

/* reset page jika jumlah per page berubah */
watch(itemsPerPage, () => (currentPage.value = 1));

/* data yang tampil di tabel */
const currentUser = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return users.value.slice(start, end);
});

//checkbox select all

const selectedIds = ref([]);

const isAllSelected = computed({
  get() {
    return (
      currentUser.value.length > 0 &&
      currentUser.value.every((user) => selectedIds.value.includes(user.id))
    );
  },
  set(val) {
    if (val) {
      selectedIds.value = currentUser.value.map((user) => user.id);
    } else {
      selectedIds.value = [];
    }
  },
});

//action page

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
</script> -->

<script>
import {
  RefreshCcw,
  Filter,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-vue-next";

import CreateUserForm from "../forms/CreateUserForm.vue";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  name: "UsersTable",

  components: {
    RefreshCcw,
    Filter,
    Search,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    CreateUserForm,
  },

  data() {
    return {
      showCreateUserForm: false,

      // pagination
      itemsPerPage: 5,
      currentPage: 1,

      // checkbox
      selectedIds: [],

      selectedUser: null,
    };
  },

  computed: {
    ...mapGetters({
      users: "users/allUsers",
      isLoadingTable: "users/isLoading",
      errorMsgTable: "users/error",
    }),

    ...mapState({
      authUser: (state) => state.auth.user,
    }),

    // admin validation
    isAdmin() {
      const user = this.authUser;
      return (
        user &&
        (user.role === "admin" ||
          user.stafflevel === "admin" ||
          user.role === "Admin")
      );
    },

    totalDocuments() {
      return this.users.length;
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.totalDocuments / this.itemsPerPage));
    },

    currentUser() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.users.slice(start, end);
    },

    isAllSelected: {
      get() {
        return (
          this.currentUser.length > 0 &&
          this.currentUser.every((user) => this.selectedIds.includes(user.id))
        );
      },
      set(val) {
        if (val) {
          this.selectedIds = this.currentUser.map((user) => user.id);
        } else {
          this.selectedIds = [];
        }
      },
    },
  },

  watch: {
    currentPage(val) {
      if (val < 1) this.currentPage = 1;
      if (val > this.totalPages) this.currentPage = this.totalPages;
    },

    itemsPerPage() {
      this.currentPage = 1;
    },
  },

  methods: {
    ...mapActions({
      fetchUsers: "users/fetchAllusers",
    }),

    fetchData() {
      this.fetchUsers()
        .then(() => {
          console.log("Users fetched successfully");
        })
        .catch((err) => {
          console.error("Failed to fetch users:", err);
        });
    },

    openUserDetail(user) {
      this.selectedUser = user;
      this.showCreateUserForm = true;
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  },

  mounted() {
    // if (!this.isAdmin) {
    //   console.warn("Access denied: User is not an admin");
    //   this.$router.push("/crmAdmin");
    //   return;
    // }
    this.fetchData();
  },
};
</script>

<template>
  <!-- Document List -->
  <div class="bg-white rounded-lg shadow-sm border border-outline">
    <div class="p-4 border-b border-outline">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <!-- Left Section: Filter + Search + Show -->
        <div class="flex items-center gap-3">
          <!-- Filter Icon -->
          <button
            class="p-2 border border-outline rounded-lg hover:bg-outline/30 transition shadow-sm bg-white"
          >
            <Filter :size="20" class="text-dark-base" />
          </button>

          <!-- Search Input -->
          <div class="relative">
            <input
              type="text"
              placeholder="Search by Name"
              class="pl-3 pr-4 py-2 bg-white border border-outline rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
            />
          </div>

          <!-- Search Icon Button -->
          <button
            class="p-2 bg-outline hover:bg-outline/30 rounded-lg transition"
          >
            <Search :size="20" class="text-dark-base" />
          </button>

          <!-- Show Dropdown -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-dark-base">Show</span>
            <select
              v-model="itemsPerPage"
              class="px-3 py-2 border border-outline rounded-lg focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>

        <!-- Right Section: Action Buttons -->
        <div class="flex items-center gap-2">
          <!-- Refresh Button -->
          <button
            @click="fetchData"
            :disabled="isLoadingTable"
            class="p-2 border border-outline rounded-lg hover:bg-light-base transition-all active:scale-95 disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCcw
              :size="18"
              :class="{ 'animate-spin': isLoadingTable }"
              class="text-sub-text"
            />
          </button>

          <!-- Add New -->
          <div class="relative inline-block add-dropdown">
            <button
              @click="showCreateUserForm = true"
              type="button"
              class="flex items-center gap-2 px-4 py-2 h-10 bg-white text-sub-text rounded-lg border border-outline hover:bg-sub-text hover:text-white transition"
            >
              <span class="text-lg font-semibold">+</span>
              <span class="text-sm font-medium">Add User</span>
            </button>
          </div>

          <!-- Delete -->
          <button
            class="p-2 bg-white border border-red text-red rounded-lg hover:bg-red hover:text-white transition"
          >
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!--- filter select n page -->
    <div class="px-6 py-4 flex items-center border-b border-outline">
      <!-- KIRI -->
      <label class="flex items-center gap-2 text-sm text-sub-text">
        <input
          type="checkbox"
          v-model="isAllSelected"
          class="h-4 w-4 rounded border-gray-300 text-sub-text focus:ring-sub-text"
        />
        Select all filtered result
      </label>

      <!-- PUSH KANAN -->
      <div class="ml-auto flex items-center gap-3 text-sm text-sub-text">
        <button
          @click="prevPage"
          class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
          :disabled="currentPage === 1"
        >
          <ChevronLeft :size="18" class="text-sub-text" />
        </button>

        <span>Page</span>

        <input
          type="number"
          v-model="currentPage"
          min="1"
          class="w-12 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-sub-text"
        />

        <span>of {{ totalPages }}</span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="p-2 rounded hover:bg-gray-100 transition disabled:opacity-40"
        >
          <ChevronRight :size="18" class="text-sub-text" />
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="relative overflow-x-auto">
      <!-- Loading Overlay -->
      <div
        v-if="isLoadingTable"
        class="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-3">
          <RefreshCcw :size="32" class="animate-spin text-sub-text" />
          <p class="text-sm font-medium text-sub-text">Loading users...</p>
        </div>
      </div>

      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="px-6 py-4 text-left">
              <input
                type="checkbox"
                class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
              />
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center gap-2">
                Name(Email)
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center gap-2">Team</div>
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center gap-2">Last Active</div>
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              <div class="flex items-center gap-2">Role</div>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Empty State -->
          <tr v-if="currentUser.length === 0 && !isLoadingTable">
            <td colspan="5" class="px-6 py-20 text-center text-sub-text">
              <div class="flex flex-col items-center gap-3">
                <div
                  class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <Search :size="32" class="text-gray-400" />
                </div>
                <p class="text-lg font-medium">No users found</p>
                <p class="text-sm text-gray-400">
                  Try refreshing or adding a new user
                </p>
              </div>
            </td>
          </tr>

          <!-- Sample rows -->
          <tr
            v-for="user in currentUser"
            :key="user.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
            @click="openUserDetail(user)"
          >
            <td class="px-6 py-4" @click.stop>
              <input
                type="checkbox"
                :value="user.id"
                v-model="selectedIds"
                class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
              />
            </td>
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">
              <div class="text-sm font-medium text-gray-800">
                {{
                  user.firstname
                    ? `${user.firstname} ${user.lastname || ""}`
                    : user.name || "Unknown User"
                }}
              </div>
              <div class="text-xs text-gray-400">
                {{ user.email }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-dark-base">
              {{ user.primaryteam || user.team || "-" }}
            </td>
            <td class="px-6 py-4 text-sm text-dark-base">
              {{ user.last_active || user.lastactv || user.updated_at || "-" }}
            </td>
            <td class="px-6 py-4 text-sm text-dark-base font-medium">
              {{ user.role }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Add User Form -->
  <CreateUserForm
    :isOpen="showCreateUserForm"
    :user="selectedUser"
    @close="
      showCreateUserForm = false;
      selectedUser = null;
    "
    @submit="fetchUsers"
  />
</template>
