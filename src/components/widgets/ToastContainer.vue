<template>
  <Teleport to="body">
    <div class="toast-wrap">
      <TransitionGroup name="toast">
        <div v-for="t in toasts" :key="t.id" class="toast">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white border flex items-center justify-center shrink-0 shadow-sm" style="border-color: var(--color-outline)">
              <Bell :size="18" style="color: var(--color-dark-base)" />
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] font-bold uppercase tracking-wider" style="color: var(--color-sub-text)">New Notification</span>
              <span class="text-sm font-semibold" style="color: var(--color-dark-base)">{{ t.message }}</span>
            </div>
          </div>
          <button @click="dismiss(t.id)" class="dismiss">
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications'
import { Bell, X } from 'lucide-vue-next'

const { toasts } = useNotifications()

function dismiss(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}
</script>

<style scoped>
.toast-wrap {
  position: fixed;
  top: 5rem;
  right: 2rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  background: var(--color-pipeline);
  border: 1px solid var(--color-outline);
  border-radius: 16px;
  min-width: 320px;
  max-width: 420px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}
.dismiss {
  padding: 4px;
  border-radius: 8px;
  background: white;
  border: 1px solid var(--color-outline);
  cursor: pointer;
  color: var(--color-sub-text);
  transition: all 0.2s;
}
.dismiss:hover {
  background: var(--color-baris-genap);
  color: var(--color-dark-base);
}
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) translateX(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
