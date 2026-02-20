import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/components/dashboard.vue";
import Contacts from "@/components/contacts.vue";
import LoginPage from "@/components/loginpage.vue";
import MainDashboard from "@/components/maindashboard.vue";
import Companies from "@/components/companies.vue";
import Deals from "@/components/deals.vue";
import DealsList from "@/components/dealslist.vue";
import DealsCard from "@/components/dealscard.vue";
import Task from "@/components/task.vue";
import TaskList from "@/components/tasklist.vue";
import TaskCard from "@/components/taskcard.vue";
import TaskCalender from "@/components/taskcalender.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/crmAdmin",
    name: "MainDashboard",
    component: MainDashboard,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
      },

      {
        path: "contacts",
        name: "Contacts",
        component: Contacts,
      },
      {
        path: "companies",
        name: "Companies",
        component: Companies,
      },
      {
        path: "deals",
        component: Deals, // File yang barusan kamu kirim
        children: [
          {
            path: "dealscard",
            name: "DealsCard", // Gunakan nama unik
            component: DealsCard,
          },
          {
            path: "dealslist",
            name: "DealsList", // Gunakan nama unik
            component: DealsList,
          },
          {
            path: "",
            redirect: { name: "DealsCard" }, // Default ke card jika akses /deals
          },
        ],
      },
      {
        path: "task",
        component: Task,
        children: [
          {
            path: "tasklist",
            name: "TaskList",
            component: TaskList,
          },
          {
            path: "taskcard",
            name: "TaskCard",
            component: TaskCard,
          },
          {
            path: "taskcalender",
            name: "TaskCalender",
            component: TaskCalender,
          },
          {
            path: "",
            redirect: { name: "TaskList" }, // Default ke list jika akses /task
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
