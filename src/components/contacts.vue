<script setup>
import Sidebar from "./layouts/sidebar.vue";
import Kepala from "./layouts/kepala.vue";
import { Search, ChevronDown, Download, Edit, Trash2, Facebook, Filter, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { ref } from "vue";

// Sample data - replace with actual data from API
const contacts = ref([]);
const currentPage = ref(1);
const totalContacts = ref(18600);
const itemsPerPage = ref(10);
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main -->
    <div class="flex-1">
      <Kepala />
      
      <main class="p-6 bg-gray-50 min-h-screen overflow-y-auto">
        <!-- Header -->
        <div class="mb-6 space-y-2">
          <h1 class="text-3xl font-bold text-gray-800">Contacts</h1>
          <p class="text-gray-500">{{ totalContacts.toLocaleString() }} Total Contacts</p>
        </div>

        <!-- Action Bar -->
        <div class="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <!-- Left Section: Filter + Search -->
            <div class="flex items-center gap-3 flex-1">
              <!-- Filter Icon -->
              <button class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter :size="20" class="text-gray-600" />
              </button>

              <!-- Search Input -->
              <div class="relative flex-1 max-w-xs">
                <Search class="absolute left-3 top-2.5 text-gray-400" :size="18" />
                <input 
                  type="text" 
                  placeholder="Search by Name" 
                  class="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <!-- Search Button -->
              <button class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                <Search :size="20" class="text-gray-600" />
              </button>

              <!-- Items Per Page Dropdown -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Show</span>
                <select 
                  v-model="itemsPerPage" 
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
              </div>
            </div>

            <!-- Right Section: Action Buttons -->
            <div class="flex items-center gap-3">
              <!-- Connect Facebook -->
              <button class="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition">
                <Facebook :size="18" />
                <span class="text-sm font-medium">Connect Facebook</span>
                <ChevronDown :size="16" />
              </button>

              <!-- Add New -->
              <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <span class="text-lg font-semibold">+</span>
                <span class="text-sm font-medium">Add New</span>
                <ChevronDown :size="16" />
              </button>

              <!-- Download -->
              <button class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Download :size="18" class="text-gray-600" />
                <span class="text-sm font-medium text-gray-700">Download</span>
                <ChevronDown :size="16" class="text-gray-600" />
              </button>

              <!-- Bulk Edit -->
              <button class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Edit :size="18" class="text-gray-600" />
                <span class="text-sm font-medium text-gray-700">Bulk Edit</span>
              </button>

              <!-- Delete -->
              <button class="p-2 bg-red-50 border border-red-200 text-red-500 rounded-lg hover:bg-red-100 transition">
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Table Header with Select All -->
          <div class="border-b border-gray-200 px-6 py-3 flex items-center gap-4 bg-gray-50">
            <input 
              type="checkbox" 
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <span class="text-sm text-gray-600">Select all filtered result</span>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="px-6 py-4 text-left">
                    <input type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div class="flex items-center gap-2">
                      Name
                      <ChevronDown :size="16" class="text-gray-400" />
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div class="flex items-center gap-2">
                      Contact Info
                      <ChevronDown :size="16" class="text-gray-400" />
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div class="flex items-center gap-2">
                      Associated with
                      <ChevronDown :size="16" class="text-gray-400" />
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div class="flex items-center gap-2">
                      Status
                      <ChevronDown :size="16" class="text-gray-400" />
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div class="flex items-center gap-2">
                      Created/Update
                      <ChevronDown :size="16" class="text-gray-400" />
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div class="flex items-center gap-2">
                      Owner
                      <ChevronDown :size="16" class="text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Empty State -->
                <tr v-if="contacts.length === 0">
                  <td colspan="7" class="px-6 py-20 text-center text-gray-500">
                    <div class="flex flex-col items-center gap-3">
                      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search :size="32" class="text-gray-400" />
                      </div>
                      <p class="text-lg font-medium">No contacts found</p>
                      <p class="text-sm text-gray-400">Start adding contacts to see them here</p>
                    </div>
                  </td>
                </tr>

                <!-- Sample rows - will be populated with actual data -->
                <tr v-for="contact in contacts" :key="contact.id" class="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td class="px-6 py-4">
                    <input type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-800 font-medium">{{ contact.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ contact.email }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ contact.company }}</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-xs font-medium" :class="{
                      'bg-green-100 text-green-700': contact.status === 'Active',
                      'bg-gray-100 text-gray-700': contact.status === 'Inactive'
                    }">
                      {{ contact.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ contact.updatedAt }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ contact.owner }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button class="p-2 hover:bg-gray-100 rounded transition" :disabled="currentPage === 1">
                <ChevronLeft :size="20" :class="currentPage === 1 ? 'text-gray-300' : 'text-gray-600'" />
              </button>
              <span class="text-sm text-gray-600">Page</span>
            </div>

            <div class="flex items-center gap-2">
              <input 
                type="number" 
                v-model="currentPage"
                class="w-16 px-3 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              <span class="text-sm text-gray-600">of {{ Math.ceil(totalContacts / itemsPerPage) }}</span>
            </div>

            <button class="p-2 hover:bg-gray-100 rounded transition">
              <ChevronRight :size="20" class="text-gray-600" />
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
