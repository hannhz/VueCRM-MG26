<script setup>
import { ArrowRight, UserPlus, LogIn } from "lucide-vue-next";

const handleAction = (type) => {
  console.log(`Navigasi ke halaman: ${type}`);
};
</script>

<template>
  <div class="welcome-container">
    <div class="max-w-4xl w-full text-center space-y-8">
      <div class="space-y-4">
        <h1 class="welcome-title">
          Kelola Bisnis Lebih <span class="text-blue-600">Smart.</span>
        </h1>
        <p class="welcome-subtitle">
          Selamat datang di VueCRM. Platform dashboard modern untuk memantau
          performa tim, data klien, dan laporan keuangan dalam satu tempat.
        </p>
      </div>

      <div class="preview-wrapper">
        <div class="preview-glow"></div>
        <div class="preview-card">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
            alt="Dashboard"
            class="object-cover w-full h-full opacity-80"
          />
          <div
            class="absolute inset-0 bg-slate-900/20 flex items-center justify-center"
          >
            <div
              class="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-semibold text-slate-800 cursor-pointer"
            >
              Lihat Demo <ArrowRight :size="18" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
      >
        <button @click="handleAction('register')" class="btn-primary">
          <UserPlus :size="20" /> Daftar Sekarang
        </button>

        <button @click="handleAction('login')" class="btn-secondary">
          <LogIn :size="20" /> Masuk Ke Akun
        </button>
      </div>
    </div>

    <footer class="absolute bottom-8 text-slate-400 text-sm italic">
      &copy; 2026 VueCRM MG26 - Clean Architecture Mode
    </footer>
  </div>
</template>
