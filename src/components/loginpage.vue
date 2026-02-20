<script setup>
import { Eye, EyeClosedIcon, Mail } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";

const showPassword = ref(false);
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMsg = ref("");

const handleLogin = () => {
  // contoh validasi sederhana
  if (email.value === "admin@mail.com" && password.value === "123456") {
    router.push("/crmAdmin");
  } else {
    errorMsg.value = "Email atau password salah";
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <!-- Card Container -->
    <div
      class="w-full max-w-6xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden grid lg:grid-cols-2"
    >
      <!-- LEFT SIDE -->
      <div
        class="hidden lg:flex flex-col justify-center items-center text-center p-12 bg-white"
      >
        <h1 class="text-5xl font-extrabold text-gray-800 mb-6">CRM MG26</h1>

        <p class="text-slate-500 text-lg leading-relaxed max-w-md">
          Deliver better customer experiences with organized, efficient CRM
          management.
        </p>

        <!-- Illustration -->
        <img src="/public/login.svg" alt="illustration" class="w-80 mt-10" />
      </div>

      <!-- RIGHT SIDE -->
      <div class="p-10 lg:p-14 flex flex-col justify-center">
        <p class="text-slate-500 text-lg mb-2">
          Start Building Better Workflows
        </p>

        <h2 class="text-4xl font-bold text-gray-800 mb-8">
          Log In to CRM MG26
        </h2>

        <!-- Email -->
        <label class="text-gray-800 font-medium mb-2">Email</label>
        <div class="relative mb-6">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full h-14 px-4 pr-12 rounded-xl border border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">
            <Mail class="w-5 h-5 text-blue-950" />
          </span>
        </div>

        <!-- Password -->
        <label class="text-gray-800 font-medium mb-2">Password</label>
        <div class="relative mb-6">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            class="w-full h-14 px-4 pr-12 rounded-xl border border-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-900"
          />

          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
          >
            <Eye v-if="showPassword" class="w-5 h-5 text-blue-950" />
            <EyeClosedIcon v-else class="w-5 h-5 text-blue-950" />
          </button>
        </div>

        <!-- Error Message -->
        <p v-if="errorMsg" class="text-red-500 text-sm mb-3">
          {{ errorMsg }}
        </p>
        <!-- Button -->
        <button
          @click="handleLogin"
          class="w-full h-14 bg-blue-950 text-white rounded-xl font-semibold hover:opacity-90 transition"
        >
          Log In
        </button>

        <!-- Sign Up -->
        <p class="text-center text-slate-500 mt-8">
          Don’t have any account?
          <span class="text-blue-950 font-medium cursor-pointer">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
