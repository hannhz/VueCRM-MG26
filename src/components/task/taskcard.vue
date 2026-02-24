<script setup>
import { ref } from "vue";
import draggable from "vuedraggable";
import { Filter, Search } from "lucide-vue-next";

const columns = ref([
  {
    name: "Not Started",
    items: [
      { id: 1, title: "Follow up client" },
      { id: 2, title: "Send proposal" },
    ],
  },
  { name: "In Progress", items: [{ id: 3, title: "Design UI Dashboard" }] },
  { name: "Waiting", items: [{ id: 4, title: "Client approval" }] },
  { name: "Completed", items: [{ id: 5, title: "Logo revision" }] },
  { name: "Deferred", items: [] },
]);

const isDragging = ref(false);
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm max-w-311.25 h-147 border border-outline flex flex-col overflow-hidden"
  >
    <!-- Action Bar -->
    <div class="pt-4 pr-4 pl-4">
      <div class="flex items-center gap-4 w-full mb-4">
        <!-- LEFT -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <!-- Filter -->
          <button
            class="p-2 border border-outline rounded-lg hover:bg-outline/30 transition"
          >
            <Filter :size="20" class="text-dark-base" />
          </button>

          <!-- Search -->
          <input
            type="text"
            placeholder="Search by Name"
            class="pl-3 pr-4 py-2 bg-white border border-outline rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-sub-text text-sm"
          />

          <!-- Search Btn -->
          <button
            class="p-2 bg-outline hover:bg-outline/30 rounded-lg transition"
          >
            <Search :size="20" class="text-dark-base" />
          </button>

          <!-- Show -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-dark-base">Show</span>
            <select class="px-3 py-2 border border-outline rounded-lg text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>
      <!-- Kanban Board -->
      <div class="flex gap-4 overflow-x-auto pb-4">
        <div
          v-for="col in columns"
          :key="col.name"
          class="w-72 shrink-0 bg-slate-100/60 rounded border border-gray-300 flex flex-col"
        >
          <!-- HEADER -->
          <div class="bg-white p-4 font-bold border-b flex justify-between">
            {{ col.name }}
            <span class="bg-gray-800 text-white text-xs px-2 py-0.5 rounded">
              {{ col.items.length }}
            </span>
          </div>

          <!-- DROP AREA -->
          <draggable
            v-model="col.items"
            group="tasks"
            item-key="id"
            animation="200"
            ghost-class="ghost"
            class="p-3 h-108 flex flex-col gap-3 min-h-50"
          >
            <template #item="{ element }">
              <div
                class="bg-white p-3 rounded shadow cursor-grab active:cursor-grabbing"
              >
                {{ element.title }}
              </div>
            </template>
          </draggable>
        </div>
      </div>
      <!-- DANGER DELETE ZONE -->
      <div
        v-show="isDragging"
        class="absolute bottom-0 left-0 w-full h-40 z-50 pointer-events-none"
      >
        <!-- gradient -->
        <div
          class="absolute inset-0 bg-linear-to-t from-red-600/80 via-red-500/40 to-transparent"
        ></div>

        <!-- center content -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div
            class="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-red-500"
          >
            <!-- trash icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-7 h-7 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 7L5 7M10 11V17M14 11V17M9 7V4H15V7M6 7H18L17 20H7L6 7Z"
              />
            </svg>
          </div>

          <p class="mt-2 text-white text-sm tracking-wide">
            Drop to <span class="font-bold">DELETE</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
