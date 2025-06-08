import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import { useLoginStore } from "@/stores/userStore";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
const loginStore = useLoginStore();
const productStore = useProductStore();
const cartStore = useCartStore();
loginStore.loadFromLocalStorage();
productStore.loadFromLocalStorage();
cartStore.loadFromLocalStorage();

app.use(router);
app.mount("#app");
