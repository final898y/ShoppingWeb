<template>
  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">訂單確認</h1>

      <div v-if="!isValidOrder" class="text-center text-base-content/80">
        <p class="text-lg">無訂單資料，請重新填寫</p>
        <router-link to="/checkout" class="btn btn-primary mt-4"
          >返回填寫</router-link
        >
      </div>

      <div v-else>
        <div class="card bg-base-100 shadow-xl border border-base-300 mb-6">
          <div class="card-body">
            <h2 class="text-lg font-semibold mb-4">訂單商品</h2>
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex items-center gap-4 py-4 border-b border-base-200 last:border-b-0 hover:shadow-lg transition-shadow duration-300"
            >
              <!-- 商品圖片，點擊可進入詳情頁 -->
              <router-link
                :to="`/product/${item.id}`"
                :aria-label="`查看 ${item.name} 詳情`"
              >
                <figure
                  class="w-24 h-24 overflow-hidden rounded-lg bg-base-200 flex justify-center items-center"
                >
                  <img
                    :src="item.image_url || '/NoImage.png'"
                    :alt="`${item.name} 商品圖片`"
                    class="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    @error="item.image_url = '/NoImage.png'"
                  />
                </figure>
              </router-link>

              <!-- 商品資訊 -->
              <div class="flex-1">
                <!-- 商品名稱，點擊可進入詳情頁 -->
                <router-link
                  :to="`/product/${item.id}`"
                  class="text-base font-medium hover:text-primary transition-colors"
                  :aria-label="`查看 ${item.name} 詳情`"
                >
                  {{ item.name }}
                </router-link>
                <p class="text-sm">單價：${{ item.price }}</p>
                <p class="text-sm">數量：{{ item.quantity }}</p>
                <p class="text-sm font-bold">
                  小計：${{ (item.price * item.quantity).toFixed(2) }}
                </p>
              </div>
            </div>
            <div class="text-right mt-4">
              <p class="text-lg font-bold">
                總金額：${{ totalPrice.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl border border-base-300">
          <div class="card-body">
            <h2 class="text-lg font-semibold mb-4">收件人資訊</h2>
            <p class="text-sm">姓名：{{ formData.name }}</p>
            <p class="text-sm">電話：{{ formData.phone }}</p>
            <p class="text-sm">地址：{{ formData.address }}</p>
            <p class="text-sm">電子郵件：{{ formData.email }}</p>
            <p class="text-sm" v-if="formData.notes">
              備註：{{ formData.notes }}
            </p>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <router-link to="/checkout" class="btn btn-outline"
            >返回編輯</router-link
          >
          <button
            class="btn btn-primary"
            @click="proceedToPayment"
            :disabled="isProcessing"
          >
            {{ isProcessing ? "處理中..." : "進入付款" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";
import axios from "@/utils/axios";

const router = useRouter();
const orderStore = useOrderStore();
const isProcessing = ref(false);

// 在頁面加載時嘗試從 localStorage 恢復資料
onMounted(() => {
  orderStore.loadFromStorage();
  // 若資料無效，自動導回訂單填寫頁面
  if (!isValidOrder.value) {
    router.push("/checkout");
  }
});

// 檢查訂單資料是否有效
const isValidOrder = computed(() => {
  return (
    formData.value.name &&
    formData.value.phone &&
    formData.value.address &&
    formData.value.email &&
    cartItems.value.length > 0 &&
    totalPrice.value > 0
  );
});

// 從 orderStore 獲取資料
const formData = computed(() => orderStore.formData);
const cartItems = computed(() => orderStore.cartItems);
const totalPrice = computed(() => orderStore.totalPrice);

// 進入付款頁面
// const proceedToPayment = async () => {
//   if (isProcessing.value) return;
//   isProcessing.value = true;
//   try {
//     const orderNumber = await orderStore.createOrderFromCart();
//     if (orderNumber) {
//       router.push(`/payment?orderNumber=${orderNumber}`);
//     } else {
//       // 可以在此處添加更詳細的錯誤處理，例如顯示一個 toast 通知
//       console.error("訂單建立失敗，未返回訂單ID");
//     }
//   } catch (error) {
//     console.error("建立訂單或導向付款頁面失敗：", error);
//   } finally {
//     isProcessing.value = false;
//   }
// };
const proceedToPayment = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;

  try {
    // 第一步：建立訂單並取得訂單編號
    const orderNumber = await orderStore.createOrderFromCart();
    if (!orderNumber) throw new Error("訂單建立失敗");

    // 第二步：準備送給後端的 ecPay 資料
    const tradeDate = new Date();
    const tradeDateString = formatDate(tradeDate);

    const ecPayRequest = {
      MerchantTradeDate: tradeDateString,
      PaymentType: "aio",
      TotalAmount: Math.round(totalPrice.value), // 確保是整數
      TradeDesc: "線上購物付款",
      ItemName: cartItems.value.map((item) => item.name).join("#"),
      ChoosePayment: "ALL",
      ClientBackURL: "http://localhost:5173/Payment", // 或部署後正式網址
    };

    // 第三步：向後端請求 CheckMacValue 與 MerchantTradeNo
    const response = await axios.post("/pay/ecpay/getcheckout", ecPayRequest);
    const backendData = response.data;

    if (!backendData.CheckMacValue || !backendData.MerchantTradeNo) {
      throw new Error("後端回傳資料格式錯誤");
    }

    // 第四步：準備表單自動送出至綠界
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";

    const ecPayFinalData = {
      ...ecPayRequest,
      MerchantTradeNo: backendData.MerchantTradeNo,
      CheckMacValue: backendData.CheckMacValue,
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
    form.submit(); // ✅ 將使用者導向綠界收銀台
  } catch (error) {
    console.error("付款流程發生錯誤：", error);
  } finally {
    isProcessing.value = false;
  }
};

// function formatDate(date:Date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是 0-11，需要 +1，並補 0
//   const day = String(date.getDate()).padStart(2, '0');
//   const hours = String(date.getHours()).padStart(2, '0');
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   const seconds = String(date.getSeconds()).padStart(2, '0');

//   return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
// }
function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}
</script>
