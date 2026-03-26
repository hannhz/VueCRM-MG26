<template>
  <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
    <div class="flex min-w-0 items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Users</h1>
      <span class="text-sm text-sub-text"> {{ totalUsers }} users total </span>
    </div>

    <div
      class="flex w-full flex-wrap items-center justify-end gap-1 sm:w-auto sm:gap-2"
    >
      <!-- Refresh Button -->
      <button
        @click="$emit('refresh')"
        :disabled="isLoading"
        class="h-9 w-9 rounded-lg border border-outline bg-white p-2 transition-all hover:bg-light-base active:scale-95 disabled:opacity-50 sm:h-10 sm:w-10"
        title="Refresh Data"
      >
        <RefreshCcw
          :size="18"
          :class="{ 'animate-spin': isLoading }"
          class="text-sub-text"
        />
      </button>

      <!-- Add User -->
      <button
        @click="$emit('open-add-user')"
        type="button"
        class="flex h-9 w-9 items-center justify-center gap-2 rounded-lg border border-outline bg-white px-2 py-2 text-sub-text transition hover:bg-sub-text hover:text-white sm:h-10 sm:w-auto sm:px-4"
      >
        <span class="text-lg font-semibold">+</span>
        <span class="hidden text-sm font-medium md:inline">Add User</span>
      </button>

      <!-- Delete Button -->
      <button
        @click="$emit('delete-users')"
        class="h-9 w-9 rounded-lg border border-red bg-white p-2 text-red transition hover:bg-red hover:text-white sm:h-10 sm:w-10"
        :disabled="isLoading"
        title="Delete selected users"
      >
        <Trash2 :size="18" />
      </button>
    </div>
  </div>
</template>

<script>
import { RefreshCcw, Trash2 } from "lucide-vue-next";

export default {
  name: "UsersHeader",
  components: { RefreshCcw, Trash2 },
  props: {
    isLoading: { type: Boolean, default: false },
    totalUsers: { type: Number, default: 0 },
  },
};
</script>
