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

async function initApp() {
  const loginStore = useLoginStore();
  const productStore = useProductStore();
  const cartStore = useCartStore();

  loginStore.loadFromLocalStorage();
  await cartStore.loadFromServer("19de471a-2391-4205-baa9-774a691ca256");

  app.use(router);
  app.mount("#app");
}

initApp();
