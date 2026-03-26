<template>
  <div class="flex flex-col h-full">
    <div
      class="bg-white rounded-lg shadow-sm p-4 border border-outline flex flex-col min-h-0 flex-1"
    >
      <!-- Header -->
      <UsersHeader
        :isLoading="isLoadingTable"
        :totalUsers="totalDocuments"
        @refresh="fetchData"
        @open-add-user="showCreateUserForm = true"
        @delete-users="handleDeleteUsers"
      />

      <!-- Filter Bar -->
      <UsersFilterBar
        :searchQuery="searchQuery"
        :itemsPerPage="itemsPerPage"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @update:searchQuery="searchQuery = $event"
        @update:itemsPerPage="itemsPerPage = $event"
        @update:currentPage="currentPage = $event"
        @search="fetchData"
        @prev-page="prevPage"
        @next-page="nextPage"
      />

      <!-- Table (scrollable) -->
      <div class="flex-1 min-h-0 relative">
        <UsersTable
          :users="currentUser"
          :isLoading="isLoadingTable"
          :selectedIds="selectedIds"
          :allSelected="isAllSelected"
          @toggle-select-all="isAllSelected = $event"
          @toggle-user-select="toggleUserSelect"
          @row-click="openUserDetail"
        />
      </div>
    </div>
  </div>

  <!-- Add User Form Modal -->
  <CreateUserForm
    :isOpen="showCreateUserForm"
    :user="selectedUser"
    @close="
      showCreateUserForm = false;
      selectedUser = null;
    "
    @submit="fetchData"
  />
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { alertService } from "@/services/alertService";

import UsersHeader from "./usersHeader.vue";
import UsersFilterBar from "./usersetFiltBar.vue";
import UsersTable from "./usersTable.vue";
import CreateUserForm from "../../forms/CreateUserForm.vue";

export default {
  name: "UserSettings",
  components: {
    UsersHeader,
    UsersFilterBar,
    UsersTable,
    CreateUserForm,
  },

  data() {
    return {
      showCreateUserForm: false,
      itemsPerPage: 5,
      currentPage: 1,
      selectedIds: [],
      selectedUser: null,
      searchQuery: "",
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
      deleteUser: "users/deleteuser",
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

    toggleUserSelect(userId) {
      const index = this.selectedIds.indexOf(userId);
      if (index > -1) {
        this.selectedIds.splice(index, 1);
      } else {
        this.selectedIds.push(userId);
      }
    },

    async handleDeleteUsers() {
      if (this.selectedIds.length === 0) {
        await alertService.toastWarning(
          "Pilih minimal satu user untuk dihapus",
        );
        return;
      }

      const confirmDelete = await alertService.confirm(
        `${this.selectedIds.length} user akan dihapus permanen. Lanjutkan?`,
        "Hapus User?",
      );

      if (!confirmDelete?.isConfirmed) return;

      try {
        const idsToDelete = [...this.selectedIds];
        for (const id of idsToDelete) {
          await this.deleteUser(id);
        }
        this.selectedIds = [];
        await alertService.success("User berhasil dihapus");
      } catch (error) {
        console.error("Failed deleting users:", error);
        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Silakan coba lagi.";
        await alertService.error(`Gagal menghapus user. ${backendMessage}`);
      }
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>
