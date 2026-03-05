import Dashboard from "@/components/dashboard.vue";
import Contacts from "@/components/contacts.vue";
import LoginPage from "@/components/loginpage.vue";
import MainDashboard from "@/components/maindashboard.vue";
import Companies from "@/components/companies.vue";
import Deals from "@/components/deals/deals.vue";
import DealsList from "@/components/deals/dealslist.vue";
import DealsCard from "@/components/deals/dealscard.vue";
import Task from "@/components/task/task.vue";
import TaskList from "@/components/task/tasklist.vue";
import TaskCard from "@/components/task/taskcard.vue";
import TaskCalender from "@/components/task/taskcalender.vue";
import EmailBroadcast from "@/components/EmailBroadcast.vue";
import Documents from "@/components/documents/Documents.vue";
import DocumentList from "@/components/documents/DocumentList.vue";
import DocumentsTemplate from "@/components/documents/DocumentsTemplate.vue";
import DocumentsShortCode from "@/components/documents/DocumentsShortCode.vue";
import UserSetings from "@/components/user/usersetings.vue";
import UserPermission from "@/components/user/userpermission.vue";
import UserTeam from "@/components/user/userteam.vue";
import User from "@/components/user/user.vue";
import SettingsPage from "@/components/Settings.vue";

import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();


const routes = [
  {
    path: "/",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/crmAdmin",
    component: MainDashboard,
    meta: { requiresAuth: true },
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
      {
        path: "email-broadcast",
        name: "EmailBroadcast",
        component: EmailBroadcast,
      },
      {
        path: "documents",
        component: Documents,
        children: [
          {
            path: "",
            name: "DocumentsList",
            component: DocumentList,
          },
          {
            path: "template",
            name: "DocumentsTemplate",
            component: DocumentsTemplate,
          },
          {
            path: "short-code",
            name: "DocumentsShortCode",
            component: DocumentsShortCode,
          },
        ],
      },
      {
        path: "users",
        component: User,
        children: [
          {
            path: "",
            name: "UserSettings",
            component: UserSetings,
          },
          {
            path: "user-permission",
            name: "UserPermission",
            component: UserPermission,
          },
          {
            path: "user-team",
            name: "UserTeam",
            component: UserTeam,
          },
        ],
      },
      {
        path: "settings",
        name: "Settings",
        component: SettingsPage,
      },
    ],
  },
];


const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "open",
  routes,
  // scrollBehavior() {
  //   return { top: 0 };
  // },
});

// router.beforeEach((to, from, next) => {
//   const isAuthenticated = store.getters["auth/isAuthenticated"];
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

//   if (requiresAuth && !isAuthenticated) {
//     // Redirect to login if not authenticated
//     next({ name: "login" });
//   } else if (to.name === "login" && isAuthenticated) {
//     // Redirect to dashboard if already authenticated
//     next({ name: "Dashboard" });
//   } else {
//     next();
//   }
// });

router.beforeEach((to, from, next) => {
  const token = cookies.get("token");
  const loggedIn = cookies.get("loggedIn");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const thisIsAuth = to.matched.some((record) => record.meta.thisisauth);

  if (requiresAuth) {
    if (!token || !loggedIn) {
      return next({ name: "login" });
    }
    return next();
  }

  if (thisIsAuth && loggedIn) {
    return next({ name: "Dashboard" });
  }

  return next();
});

export default router;
