<template>
  <div class="mt-4 flex-1 min-h-0 relative">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-white/60 z-20 flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <RefreshCcw class="animate-spin text-sub-text" :size="32" />
        <p class="text-sm text-sub-text font-medium">Loading users...</p>
      </div>
    </div>

    <div class="h-full overflow-auto relative">
      <table class="w-full">
        <thead
          class="sticky top-0 z-10 bg-white shadow-sm ring-1 ring-gray-200"
        >
          <tr class="border-b border-gray-200">
            <th class="px-6 py-4 text-left">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="$emit('toggle-select-all', $event.target.checked)"
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
          <tr v-if="users.length === 0 && !isLoading">
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

          <!-- Table Rows -->
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
            @click="$emit('row-click', user)"
          >
            <td class="px-6 py-4" @click.stop>
              <input
                type="checkbox"
                :checked="selectedIds.includes(user.id)"
                @change="$emit('toggle-user-select', user.id)"
                class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
              />
            </td>
            <td class="px-6 py-4 text-sm">
              <div class="font-medium text-gray-800">
                {{
                  user.firstname
                    ? `${user.firstname} ${user.lastname || ""}`
                    : user.name || "Unknown User"
                }}
              </div>
              <div class="text-xs text-gray-400">{{ user.email }}</div>
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
</template>

<script>
import { RefreshCcw, Search, ChevronDown } from "lucide-vue-next";

export default {
  name: "UsersTable",
  components: { RefreshCcw, Search, ChevronDown },
  props: {
    users: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    selectedIds: { type: Array, default: () => [] },
    allSelected: { type: Boolean, default: false },
  },
};
</script>
