<script setup>
import Summary from "./carddb/summary.vue";
import Deals from "./carddb/deals.vue";
import Activity from "./carddb/activity.vue";
import LeadsReport from "./carddb/leadsreport.vue";
import TopCont from "./carddb/topcont.vue";
import TopComp from "./carddb/topcomp.vue";
import TasksKPI from "./carddb/tasksKPI.vue";
import TaskList from "./carddb/taskList.vue";
import TopslsPeople from "./carddb/topslspeople.vue";
import { RefreshCcw } from "lucide-vue-next";
</script>

<template>
  <!-- Header with Title and Total -->
  <div class="flex items-center justify-between mb-5">
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold text-dark-base">Dashboard</h1>
    </div>

    <!-- Connect Regfresh/update Button -->
    <button
      class="flex items-center gap-2 px-4 py-2 border border-outline bg-white text-sub-text rounded-lg hover:bg-sub-text hover:text-white transition shadow-sm"
    >
      <span class="text-sm font-medium">Update</span>
      <RefreshCcw :size="18" />
    </button>
  </div>

  <!-- Content Area -->
  <!-- Summary Cards -->
  <!-- contact Summary Card -->
  <Summary></Summary>

  <!-- Deals and Activity -->
  <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 mb-5">
    <Deals />
    <Activity />
  </div>

  <!-- Leads Report -->
  <LeadsReport />

  <!-- Top Contacts and company -->
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5 mb-5">
    <TopCont />
    <TopComp />
  </div>

  <!-- tasks KPI -->
  <TasksKPI />

  <!-- task list -->
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 mb-5">
    <TaskList />
    <TopslsPeople />
  </div>
</template>
