<script setup>
const tasks = [
  {
    date: "06 Feb 2026 - 10.39 AM",
    name: "Kirim proposal ke Andi, Lorem ipsum dolor sit amet.",
    pic: "Hanan Zarkasi",
    status: "Overdue",
  },
  {
    date: "06 Feb 2026 - 10.39 AM",
    name: "Kirim proposal ke Andi",
    pic: "Ahmad Fuady",
    status: "Done",
  },
  {
    date: "06 Feb 2026 - 10.39 AM",
    name: "Kirim proposal ke Andi",
    pic: "Hanan Zarkasi",
    status: "Process",
  },
  {
    date: "06 Feb 2026 - 10.39 AM",
    name: "Kirim proposal ke Andi",
    pic: "Ahmad Fuady",
    status: "Done",
  },
  {
    date: "06 Feb 2026 - 10.39 AM",
    name: "Kirim proposal ke Andi",
    pic: "Hanan Zarkasi",
    status: "Overdue",
  },
  {
    date: "06 Feb 2026 - 10.39 AM",
    name: "Kirim proposal ke Andi",
    pic: "Ahmad Fuady",
    status: "Process",
  },
];

const statusStyle = (status) => {
  if (status === "Done") return "bg-green-600/10 text-green-600";
  if (status === "Overdue") return "bg-red-500/10 text-red-500";
  if (status === "Process") return "bg-amber-500/10 text-amber-500";

  return "bg-gray-200 text-gray-700";
};
</script>

<template>
  <div
    class="w-full h-full bg-white rounded-xl shadow-sm border border-outline p-6 mb-5"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-dark-base">Task List</h2>

      <button
        class="flex items-center gap-2 text-sm text-slate-400 hover:text-dark-base transition"
      >
        <span>February</span>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <!-- Table Head -->
    <div
      class="grid grid-cols-[200px_1fr_140px_120px] text-sm text-slate-500 pb-2 border-b"
    >
      <div>Due Date</div>
      <div>Task Name</div>
      <div>PIC</div>
      <div class="text-center">Status</div>
    </div>

    <!-- Rows -->
    <div class="max-h-56 overflow-y-auto mt-2">
      <div
        v-for="(task, i) in tasks"
        :key="i"
        class="grid grid-cols-[200px_1fr_140px_120px] items-center text-sm py-2 px-1"
        :class="i % 2 === 1 ? 'bg-slate-100/60 rounded' : ''"
      >
        <div class="text-gray-800">{{ task.date }}</div>

        <div class="text-gray-800 font-medium">
          {{ task.name }}
        </div>

        <div class="font-semibold text-gray-800">
          {{ task.pic }}
        </div>

        <div class="flex justify-center">
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="statusStyle(task.status)"
          >
            {{ task.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
