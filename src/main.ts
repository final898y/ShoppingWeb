import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import { useLoginStore } from "@/stores/userStore";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
const loginStore = useLoginStore();
loginStore.loadFromLocalStorage(); // 還原登入狀態

app.use(router);
app.mount("#app");
