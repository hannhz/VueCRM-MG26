<script setup>
import {
  Users,
  Building2,
  Briefcase,
  ClipboardClock,
  ArrowUp,
} from "lucide-vue-next";
</script>

<template>
  <div class="rounded-lg min-h-28 grid grid-cols-2 lg:grid-cols-4 gap-0.5 mb-5">
    <div class="ccard">
      <!-- Left Side -->
      <div class="flex items-center gap-5">
        <!-- Icon Box -->
        <div class="w-16 h-16 rounded-xl flex items-center justify-center">
          <Users :size="45" class="text-dark-base" />
        </div>

        <!-- Text -->
        <div>
          <div class="flex items-left gap-4">
            <h2 class="text-3xl font-bold text-dark-base">18.6K</h2>

            <div class="flex items-center gap-1 text-good-green font-medium">
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
        <div class="w-16 h-16 rounded-xl flex items-center justify-center">
          <Building2 :size="45" class="text-dark-base" />
        </div>

        <!-- Text -->
        <div>
          <div class="flex items-left gap-4">
            <h2 class="text-3xl font-bold text-dark-base">18.6K</h2>

            <div class="flex items-center gap-1 text-good-green font-medium">
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
        <div class="w-16 h-16 rounded-xl flex items-center justify-center">
          <Briefcase :size="45" class="text-dark-base" />
        </div>

        <!-- Text -->
        <div>
          <div class="flex items-left gap-4">
            <h2 class="text-3xl font-bold text-dark-base">18.6K</h2>

            <div class="flex items-center gap-1 text-good-green font-medium">
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
        <div class="w-16 h-16 rounded-xl flex items-center justify-center">
          <ClipboardClock :size="45" class="text-dark-base" />
        </div>

        <!-- Text -->
        <div>
          <div class="flex items-left gap-4">
            <h2 class="text-3xl font-bold text-dark-base">18.6K</h2>

            <div class="flex items-center gap-1 text-good-green font-medium">
              <ArrowUp :size="18" />
              <span>18%</span>
            </div>
          </div>
          <p class="text-sub-text text-sm mt-1">Total Contacts</p>
        </div>
      </div>
    </div>
  </div>
</template>
