import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/components/dashboard.vue";
import Contacts from "@/components/contacts.vue";
import LoginPage from "@/components/loginpage.vue";
import MainDashboard from "@/components/maindashboard.vue";
import Companies from "@/components/companies.vue";
import Deals from "@/components/dealscard.vue";
import DealsList from "@/components/dealslist.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/maindashboard",
    name: "MainDashboard",
    component: MainDashboard,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
      },

      {
        path: "/contacts",
        name: "Contacts",
        component: Contacts,
      },
      {
        path: "/companies",
        name: "Companies",
        component: Companies,
      },
      {
        path: "/deals",
        name: "Deals",
        component: Deals,
      },
      {
        path: "/dealslist",
        name: "DealsList",
        component: DealsList,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
