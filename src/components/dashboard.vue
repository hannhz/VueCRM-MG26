<script setup>
import Sidebar from "./layouts/sidebar.vue";
import Kepala from "./layouts/kepala.vue";
import {
  RefreshCcw,
  Users,
  Building2,
  Briefcase,
  ClipboardClock,
  ArrowUp,
} from "lucide-vue-next";
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <Kepala />

      <main class="flex-1 p-4 bg-light-base overflow-y-auto">
        <!-- Header with Title and Total -->
        <div class="flex items-center justify-between mb-4">
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
        <div class="rounded-lg h-28 grid grid-cols-2 lg:grid-cols-4 gap-1">
          <!-- contact Summary Card -->
          <div class="ccard">
            <!-- Left Side -->
            <div class="flex items-center gap-5">
              <!-- Icon Box -->
              <div
                class="w-16 h-16 rounded-xl flex items-center justify-center"
              >
                <Users :size="45" class="text-dark-base" />
              </div>

              <!-- Text -->
              <div>
                <div class="flex items-left gap-4">
                  <h2 class="text-3xl font-bold text-dark-base">18.6K</h2>

                  <div
                    class="flex items-center gap-1 text-good-green font-medium"
                  >
                    <ArrowUp :size="18" />
                    <span>18%</span>
                  </div>
                </div>
                <p class="text-sub-text text-sm mt-1">Total Contacts</p>
              </div>
            </div>
          </div>

          <!-- companies Summary Card -->
          <div class="ccard">
            <!-- Left Side -->
            <div class="flex items-center gap-5">
              <!-- Icon Box -->
              <div
                class="w-16 h-16 rounded-xl flex items-center justify-center"
              >
                <Building2 :size="45" class="text-dark-base" />
              </div>

              <!-- Text -->
              <div>
                <div class="flex items-left gap-4">
                  <h2 class="text-3xl font-bold text-dark-base">18.6K</h2>

                  <div
                    class="flex items-center gap-1 text-good-green font-medium"
                  >
                    <ArrowUp :size="18" />
                    <span>18%</span>
                  </div>
                </div>
                <p class="text-sub-text text-sm mt-1">Total Contacts</p>
              </div>
            </div>
          </div>

          <!-- deals Summary Card -->
          <div class="ccard">
            <!-- Left Side -->
            <div class="flex items-center gap-5">
              <!-- Icon Box -->
              <div
                class="w-16 h-16 rounded-xl flex items-center justify-center"
              >
                <Briefcase :size="45" class="text-dark-base" />
              </div>

              <!-- Text -->
              <div>
                <div class="flex items-left gap-4">
                  <h2 class="text-3xl font-bold text-dark-base">18.6K</h2>

                  <div
                    class="flex items-center gap-1 text-good-green font-medium"
                  >
                    <ArrowUp :size="18" />
                    <span>18%</span>
                  </div>
                </div>
                <p class="text-sub-text text-sm mt-1">Total Contacts</p>
              </div>
            </div>
          </div>

          <!-- task Summary Card -->
          <div class="ccard">
            <!-- Left Side -->
            <div class="flex items-center gap-5">
              <!-- Icon Box -->
              <div
                class="w-16 h-16 rounded-xl flex items-center justify-center"
              >
                <ClipboardClock :size="45" class="text-dark-base" />
              </div>

              <!-- Text -->
              <div>
                <div class="flex items-left gap-4">
                  <h2 class="text-3xl font-bold text-dark-base">18.6K</h2>

                  <div
                    class="flex items-center gap-1 text-good-green font-medium"
                  >
                    <ArrowUp :size="18" />
                    <span>18%</span>
                  </div>
                </div>
                <p class="text-sub-text text-sm mt-1">Total Contacts</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Add more summary cards as needed -->
      </main>
    </div>
  </div>
</template>
