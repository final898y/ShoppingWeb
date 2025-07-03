import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axios from "@/utils/axios";
import { useCartStore } from "./cartStore";

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
  image_url?: string;
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
    const saved = localStorage.getItem("orderingdata");
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
    localStorage.setItem("orderingdata", JSON.stringify(data));
  };

  // 自動儲存資料
  watch(
    [formData, cartItems, totalPrice],
    () => {
      localStorage.setItem(
        "orderingdata",
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
    localStorage.removeItem("orderingdata");
  };

  const createOrderFromCart = async () => {
    const cartStore = useCartStore();
    try {
      const response = await axios.post("/checkoutflow/createOrderFromCart", {
        userUuid: "19de471a-2391-4205-baa9-774a691ca256", //TODO：
        shipping_address: formData.value.address,
        order_note: formData.value.notes,
        recipient_name: formData.value.name,
        recipient_phone: formData.value.phone,
        recipient_email: formData.value.email,
        payment_method: "ecpay", //TODO：
      });

      if (response.data && response.data.orderNumber) {
        const orderNumber = response.data.orderNumber;
        clearOrder();
        cartStore.clearCart("19de471a-2391-4205-baa9-774a691ca256"); //TODO: 從認證 store 動態取得
        return orderNumber;
      } else {
        throw new Error("訂單建立失敗，伺服器未返回訂單ID");
      }
    } catch (error) {
      console.error("建立訂單時發生錯誤:", error);
      throw error;
    }
  };

  const setupOrder = (items: CartItem[], total: number) => {
    cartItems.value = items;
    totalPrice.value = total;
    saveToStorage();
  };

  return {
    formData,
    cartItems,
    totalPrice,
    loadFromStorage,
    clearOrder,
    saveToStorage,
    createOrderFromCart,
    setupOrder,
  };
});
