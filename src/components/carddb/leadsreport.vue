<script setup>
const leads = [
  {
    name: "Andi Pratama",
    email: "andi.pratama@sinarabadi.co.id",
    company: "PT Sinar Abadi Sejahtera",
    duration: "01 Jan - 31 Des 2026",
    days: "365 Days",
    status: "Lost",
  },
  {
    name: "Kevin Maulana",
    email: "kevin@novadigital.io",
    company: "PT Inovasi Digital Nusantara",
    duration: "01 Jan - 31 Des 2026",
    days: "365 Days",
    status: "Won",
  },
  {
    name: "Muhammad Haidar",
    email: "mhaidarhylmi@gmail.com",
    company: "PT Teknologi Cerdas Bangsa",
    duration: "01 Jan - 31 Des 2026",
    days: "365 Days",
    status: "Process",
  },
  {
    name: "Rizky Adnan",
    email: "rizky@apexinnovation.dev",
    company: "Apex Innovation Group",
    duration: "01 Jan - 31 Des 2026",
    days: "365 Days",
    status: "Lost",
  },
  {
    name: "Nadia Zahra",
    email: "nadia@horizondatasys.com",
    company: "Horizon Data Services",
    duration: "01 Jan - 31 Des 2026",
    days: "365 Days",
    status: "Process",
  },
];

const statusClass = (status) => {
  if (status === "Won") return "bg-green-100 text-green-600";
  if (status === "Lost") return "bg-red-100 text-red-500";
  return "bg-amber-100 text-amber-500";
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-outline p-6">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Leads Report</h2>
      <button class="text-slate-400 hover:text-gray-700">•••</button>
    </div>

    <!-- Table Head -->
    <div
      class="hidden md:grid grid-cols-6 text-sm text-slate-500 font-medium border-b pb-3"
    >
      <span>Name</span>
      <span>Company</span>
      <span>Email</span>
      <span>Projects</span>
      <span>Duration</span>
      <span class="text-center">Status</span>
    </div>

    <!-- Rows -->
    <div class="mt-3 space-y-2">
      <div
        v-for="(lead, i) in leads"
        :key="i"
        :class="[
          'grid md:grid-cols-[1.5fr_2.5fr_2.5fr_1.5fr_1fr_0.8fr] items-center py-3 px-3 rounded-xl text-sm',
          i % 2 ? 'bg-slate-100/60' : ''
        ]"
      >
        <div class="font-medium text-gray-800">{{ lead.name }}</div>
        <div class="text-gray-700">{{ lead.company }}</div>
        <div class="truncate">{{ lead.email }}</div>
        <div>{{ lead.duration }}</div>
        <div>{{ lead.days }}</div>

        <div class="flex justify-center">
          <span
            :class="[
              'px-4 py-1 rounded-full text-xs font-semibold',
              statusClass(lead.status)
            ]"
          >
            {{ lead.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
