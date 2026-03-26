import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
//import { createPinia } from 'pinia'
import Toast from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "devextreme/dist/css/dx.light.css";
// import VueCookies from 'vue3-cookies'
import "./style.css";
import "./css/welcome.css";

const app = createApp(App);

// app.use(createPinia())
app.use(store);
app.use(router);
app.use(Toast);
// app.use(VueCookies)
app.mount("#app");

export default app;
