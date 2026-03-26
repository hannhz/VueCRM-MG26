<template>
  <div class="mt-4 flex-1 min-h-0 relative">
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-white/60 z-20 flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <RefreshCw class="animate-spin text-blue-950" :size="32" />
        <p class="text-sm text-sub-text font-medium">Loading contacts...</p>
      </div>
    </div>

    <div class="h-full overflow-auto overflow-x-auto">
      <table class="w-full table-fixed">
        <thead
          class="sticky top-0 z-10 bg-white shadow-sm ring-1 ring-gray-200"
        >
          <tr class="border-b border-gray-200">
            <th class="w-16 px-6 py-4 text-left bg-white">
              <input
                type="checkbox"
                class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
                :checked="allSelected"
                @change="$emit('toggle-select-all', $event.target.checked)"
              />
            </th>
            <th
              class="w-[18%] px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-white"
            >
              <div class="flex items-center gap-2">
                Contact Name
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>
            <th
              class="w-[22%] px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-white"
            >
              <div class="flex items-center gap-2">
                Contact Info
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>
            <th
              class="w-[20%] px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-white"
            >
              <div class="flex items-center gap-2">
                Associated with
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>
            <th
              class="w-[10%] px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-white"
            >
              <div class="flex items-center gap-2">
                Status
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>
            <th
              class="w-[15%] px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-white"
            >
              <div class="flex items-center gap-2">
                Created/Update
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>
            <th
              class="w-[15%] px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-white"
            >
              <div class="flex items-center gap-2">
                Owner
                <ChevronDown :size="16" class="text-gray-400" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="contacts.length === 0 && !isLoading">
            <td colspan="7" class="px-6 py-20 text-center text-sub-text">
              <div class="flex flex-col items-center gap-3">
                <div
                  class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <Search :size="32" class="text-gray-400" />
                </div>
                <p class="text-lg font-medium">No contacts found</p>
                <p class="text-sm text-gray-400">
                  We couldn't find any contacts matching your criteria.
                </p>
                <button
                  @click="$emit('open-add-single')"
                  class="mt-2 text-blue-600 font-medium hover:underline text-sm"
                >
                  + Add Your First Contact
                </button>
              </div>
            </td>
          </tr>

          <tr
            v-for="contact in contacts"
            :key="contact.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
            @click="$emit('row-click', contact)"
          >
            <td class="px-6 py-4" @click.stop>
              <input
                type="checkbox"
                class="w-4 h-4 text-blue-600 rounded focus:ring-sub-text border-gray-300"
                :checked="selectedIds.includes(contact.id)"
                @change="onToggleRow(contact.id, $event.target.checked)"
              />
            </td>

            <td class="px-6 py-4 text-sm text-gray-800 font-medium">
              {{ contact.first_name }} {{ contact.last_name }}
            </td>

            <td class="px-6 py-4 text-sm text-dark-base">
              <div>{{ contact.email || "-" }}</div>
              <div class="text-xs text-sub-text">
                {{ contact.telephone_1 || "-" }}
              </div>
            </td>

            <td class="px-6 py-4 text-sm text-dark-base leading-5">
              <div>{{ contact.companyLabelsText }}</div>
              <div>{{ contact.dealLabelsText }}</div>
            </td>

            <td class="px-6 py-4">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="contact.statusClass"
              >
                {{ contact.statusName || contact.status || "Inactive" }}
              </span>
            </td>

            <td class="px-6 py-4 text-sm text-dark-base">
              {{ contact.updatedAtText }}
            </td>

            <td class="px-6 py-4 text-sm text-dark-base">
              {{ contact.owner || "-" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ChevronDown, RefreshCw, Search } from "lucide-vue-next";

export default {
  name: "ContactsTable",
  components: { ChevronDown, RefreshCw, Search },
  props: {
    contacts: { type: Array, default: () => [] }, // contacts view-model sudah siap tampil
    isLoading: { type: Boolean, default: false },
    selectedIds: { type: Array, default: () => [] },
    allSelected: { type: Boolean, default: false },
  },
  emits: [
    "row-click",
    "open-add-single",
    "toggle-select-all",
    "update:selectedIds",
  ],
  methods: {
    onToggleRow(id, checked) {
      const next = checked
        ? Array.from(new Set([...this.selectedIds, id]))
        : this.selectedIds.filter((x) => x !== id);

      this.$emit("update:selectedIds", next);
    },
  },
};
</script>
