import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axios from "@/utils/axios";
import { useCartStore } from "./cartStore";
import type { Order } from "@/models/backendApiModel";

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

  const fetchOrder = async (orderNumber: string): Promise<Order | null> => {
    console.log(`Fetching order with orderNumber: ${orderNumber}`);
    // 這是一個模擬的 API 請求，您需要替換成真實的後端 API
    // try {
    //   const response = await axios.get(`/api/orders/${orderNumber}`);
    //   return response.data as Order;
    // } catch (error) {
    //   console.error(`Failed to fetch order ${orderNumber}:`, error);
    //   return null;
    // }

    // --- 模擬程式碼 ---
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (orderNumber === '123-success') {
      return {
        id: '123-success',
        status: 'PAID',
        createdAt: new Date().toISOString(),
        totalAmount: 1500,
        items: [{ productId: 1, product: { name: '範例商品' }, quantity: 1, price: 1500, image_url: '' }],
      } as unknown as Order;
    } else if (orderNumber === '456-failed') {
      return {
        id: '456-failed',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        totalAmount: 800,
        items: [{ productId: 2, product: { name: '另一個商品' }, quantity: 2, price: 400, image_url: '' }],
      } as unknown as Order;
    } else if (orderNumber === '789-expired') {
       return {
        id: '789-expired',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        totalAmount: 200,
        items: [{ productId: 3, product: { name: '過期商品' }, quantity: 1, price: 200, image_url: '' }],
      } as unknown as Order;
    }
    
    return null;
    // --- 模擬結束 ---
  };

  const retryPayment = async (orderNumber: string) => {
    console.log(`Retrying payment for order: ${orderNumber}`);
    // --- 模擬程式碼 ---
    alert(`正在為訂單 ${orderNumber} 重新發起付款流程...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.href = `/payment?orderNumber=${orderNumber}&status=success`; // 模擬成功
    // --- 模擬結束 ---
  };
  
  const fetchUserOrders = async (): Promise<Order[]> => {
    console.log("Fetching user orders...");
    // --- 模擬程式碼 ---
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
       { id: '123-success', status: 'PAID', createdAt: new Date().toISOString(), totalAmount: 1500, items: [{ productId: 1, product: { name: '範例商品' }, quantity: 1, price: 1500, image_url: '' }] },
       { id: '456-failed', status: 'PENDING', createdAt: new Date().toISOString(), totalAmount: 800, items: [{ productId: 2, product: { name: '另一個商品' }, quantity: 2, price: 400, image_url: '' }] },
       { id: 'abc-shipped', status: 'SHIPPED', createdAt: '2023-10-01T10:00:00Z', totalAmount: 350, items: [{ productId: 4, product: { name: '已出貨商品' }, quantity: 1, price: 350, image_url: '' }] },
       { id: 'def-completed', status: 'COMPLETED', createdAt: '2023-09-15T14:30:00Z', totalAmount: 2000, items: [{ productId: 5, product: { name: '已完成商品' }, quantity: 1, price: 2000, image_url: '' }] },
    ] as unknown as Order[];
    // --- 模擬結束 ---
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
    fetchOrder,
    retryPayment,
    fetchUserOrders,
  };
});