import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axios from "@/utils/axios";
import { useCartStore } from "./cartStore";
import type { Order } from "@/models/backendApiModel";
import { ecPayBackendOutputSchema } from "@/models/backendApiModel";
import { FormData, CartItem } from "@/models/cartOrderModel";

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
  const currentOrderNumber = ref<string | null>(null);
  // const failedOrderNumber = ref<string | null>(null);
  // 初始化資料
  const loadFromStorage = () => {
    const saved = localStorage.getItem("currentOrderData");
    if (saved) {
      const parsed = JSON.parse(saved);
      formData.value = parsed.formData;
      cartItems.value = parsed.cartItems;
      totalPrice.value = parsed.totalPrice;
      currentOrderNumber.value = parsed.currentOrderNumber;
    }
  };
  const saveToStorage = () => {
    const data = {
      formData: formData.value,
      cartItems: cartItems.value,
      totalPrice: totalPrice.value,
      currentOrderNumber: currentOrderNumber.value,
    };
    localStorage.setItem("currentOrderData", JSON.stringify(data));
  };

  // 自動儲存資料
  watch(
    [formData, cartItems, totalPrice, currentOrderNumber],
    () => {
      localStorage.setItem(
        "currentOrderData",
        JSON.stringify({
          formData: formData.value,
          cartItems: cartItems.value,
          totalPrice: totalPrice.value,
          currentOrderNumber: currentOrderNumber.value,
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

  const initiateEcpayPayment = async (): Promise<string> => {
    let orderNumber: string | null = null;
    try {
      // 第一步：建立訂單並取得訂單編號
      orderNumber = await createOrderFromCart();
      if (!orderNumber) {
        throw new Error("訂單建立失敗，未返回訂單編號");
      }
      currentOrderNumber.value = orderNumber; // 保存訂單號以供重試
      // 後續步驟封裝成一個可重用的函數
      await proceedToEcpay(orderNumber);
      return orderNumber;
    } catch (error) {
      console.error("首次付款流程發生錯誤：", error);
      throw error;
    }
  };
  const createOrderFromCart = async () => {
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

      if (response.data && response.data.data.orderNumber) {
        const orderNumber = response.data.data.orderNumber;
        // Reverted: No longer saving orderNumber to localStorage or Pinia state here.
        //clearOrder();
        //cartStore.clearCart("19de471a-2391-4205-baa9-774a691ca256"); //TODO: 從認證 store 動態取得
        return orderNumber;
      } else {
        throw new Error("訂單建立失敗，伺服器未返回訂單ID");
      }
    } catch (error) {
      console.error("建立訂單時發生錯誤:", error);
      throw error;
    }
  };

  // 抽出可重用的付款流程
  const proceedToEcpay = async (orderNumber: string) => {
    // 第二步：準備送給後端的 ecPay 資料
    const tradeDate = new Date();
    const tradeDateString = formatDate(tradeDate);

    const ecPayRequest = {
      MerchantTradeDate: tradeDateString,
      PaymentType: "aio",
      TotalAmount: Math.round(totalPrice.value),
      TradeDesc: "線上購物付款",
      ItemName: cartItems.value.map((item) => item.name).join("#"),
      ChoosePayment: "ALL",
      ClientBackURL: `https://localhost:5173/payment?orderNumber=${orderNumber}`,
    };

    const response = await axios.post("/pay/ecpay/getcheckout", ecPayRequest);
    const backendData = response.data;
    const parsedResult = ecPayBackendOutputSchema.safeParse(backendData);

    if (!parsedResult.success) {
      console.error(
        "❌ 後端Response驗證失敗:",
        parsedResult.error.flatten().fieldErrors
      );
      throw new Error("⚠️ 請檢查你的伺服器結帳設定！");
    }

    // 第四步：準備表單自動送出至綠界
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";

    const ecPayFinalData = {
      ...ecPayRequest,
      MerchantTradeNo: parsedResult.data.MerchantTradeNo,
      MerchantID: parsedResult.data.MerchantID,
      ReturnURL: parsedResult.data.ReturnURL,
      EncryptType: parsedResult.data.EncryptType,
      CheckMacValue: parsedResult.data.CheckMacValue,
    };

    for (const key in ecPayFinalData) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value =
        ecPayFinalData[key as keyof typeof ecPayFinalData].toString();
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  function formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  }

  const fetchOrderPaymentStatus = async (orderNumber: string) => {
    try {
      // TODO: 替換為真實的後端 API
      const response = await axios.get(`/checkoutflow/order/${orderNumber}`);
      if (response.data && response.data.data?.status)
        return response.data.data?.status;
    } catch (error) {
      console.error(`查詢訂單 ${orderNumber} 狀態失敗:`, error);
      return null;
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
    return null;
    // --- 模擬結束 ---
  };

  const retryPayment = async (orderNumber: string) => {
    if (!orderNumber) {
      throw new Error("沒有提供訂單編號，無法重試付款");
    }
    console.log(`正在為訂單 ${orderNumber} 重新發起付款流程...`);
    try {
      // 直接調用可重用的付款流程
      await proceedToEcpay(orderNumber);
    } catch (error) {
      console.error(`重試訂單 ${orderNumber} 的付款時發生錯誤:`, error);
      // 再次拋出錯誤，以便UI層可以捕獲並顯示提示
      throw error;
    }
  };

  const fetchUserOrders = async (): Promise<Order[]> => {
    console.log("Fetching user orders...");
    // --- 模擬程式碼 ---
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [] as unknown as Order[];
    // --- 模擬結束 ---
  };

  return {
    formData,
    cartItems,
    totalPrice,
    currentOrderNumber,
    loadFromStorage,
    clearOrder,
    saveToStorage,
    createOrderFromCart,
    setupOrder,
    fetchOrder,
    retryPayment,
    fetchUserOrders,
    initiateEcpayPayment,
    fetchOrderPaymentStatus,
  };
});
