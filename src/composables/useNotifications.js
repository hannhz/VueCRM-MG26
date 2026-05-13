import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '@/api'

// State di luar fungsi = singleton, dibagikan semua komponen
const notifications = ref([])
const toasts = ref([])
let pollInterval = null
let listenerCount = 0

export function useNotifications() {
  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.read_at).length
  )

  async function fetchNotifications() {
    try {
      const prevCount = unreadCount.value
      // Endpoint: notifications
      const res = await api.get('notifications')
      // Assuming res.data contains the list
      const data = res.data?.data || res.data || []
      notifications.value = data

      // Tampilkan toast untuk semua notif baru
      if (unreadCount.value > prevCount) {
        const diff = unreadCount.value - prevCount;
        const newNotifications = notifications.value
          .filter((n) => !n.read_at)
          .slice(0, diff); // Ambil sebanyak jumlah yang bertambah

        newNotifications.forEach((n) => {
          addToast(n.title || n.message || "New Notification");
        });
      }
    } catch (e) {
      console.error('Gagal fetch notifikasi:', e)
    }
  }

  async function markRead(id) {
    try {
      // Endpoint: notifications/{id}/read
      await api.patch(`notifications/${id}/read`)
      const n = notifications.value.find(x => x.id === id)
      if (n) n.read_at = new Date().toISOString()
    } catch (e) {
      console.error('Gagal mark read:', e)
    }
  }

  async function markAllRead() {
    try {
      // Endpoint: notifications/markallread
      await api.patch('notifications/markallread')
      notifications.value.forEach(n => {
        if (!n.read_at) n.read_at = new Date().toISOString()
      })
    } catch (e) {
      console.error('Gagal mark all read:', e)
    }
  }

  function addToast(message) {
    const id = Date.now()
    toasts.value.push({ id, message })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 4000)
  }

  onMounted(() => {
    listenerCount++
    if (listenerCount === 1) {
      fetchNotifications()
      pollInterval = setInterval(fetchNotifications, 30000) // polling 30 detik
    }
  })

  onUnmounted(() => {
    listenerCount--
    if (listenerCount === 0 && pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
  })

  return { 
    notifications, 
    unreadCount, 
    toasts, 
    markRead, 
    markAllRead, 
    addToast,
    fetchNotifications 
  }
}
