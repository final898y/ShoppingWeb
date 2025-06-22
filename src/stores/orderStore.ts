import { defineStore } from "pinia";
import { ref, watch } from "vue";

// 表單型別
export interface FormData {
  name: string;
  phone: string;
  address: string;
  email: string;
  notes?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export const useOrderStore = defineStore("order", () => {
  // 訂單資料
  const formData = ref<FormData>({
    name: "",
    phone: "",
    address: "",
    email: "",
    notes: "",
  });

  const cartItems = ref<CartItem[]>([]);
  const totalPrice = ref(0);

  // 初始化資料
  const loadFromStorage = () => {
    const saved = localStorage.getItem("order-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      formData.value = parsed.formData;
      cartItems.value = parsed.cartItems;
      totalPrice.value = parsed.totalPrice;
    }
  };
  const saveToStorage = () => {
    const data = {
      formData: formData.value,
      cartItems: cartItems.value,
      totalPrice: totalPrice.value,
    };
    localStorage.setItem("order-data", JSON.stringify(data));
  };

  // 自動儲存資料
  watch(
    [formData, cartItems, totalPrice],
    () => {
      localStorage.setItem(
        "order-data",
        JSON.stringify({
          formData: formData.value,
          cartItems: cartItems.value,
          totalPrice: totalPrice.value,
        })
      );
    },
    { deep: true }
  );

  // 清除訂單
  const clearOrder = () => {
    formData.value = {
      name: "",
      phone: "",
      address: "",
      email: "",
      notes: "",
    };
    cartItems.value = [];
    totalPrice.value = 0;
    localStorage.removeItem("order-data");
  };

  return {
    formData,
    cartItems,
    totalPrice,
    loadFromStorage,
    clearOrder,
    saveToStorage,
  };
});
