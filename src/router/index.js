import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/dashboard.vue'
import Contacts from '@/components/contacts.vue'

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/contacts',
        name: 'Contacts',
        component: Contacts
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router