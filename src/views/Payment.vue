<template>
  <section class="min-h-screen bg-base-100 px-4 py-12 flex justify-center">
    <div class="w-full max-w-screen-sm">
      <!-- 標題區域 -->
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-base-content">付款狀態</h1>
        <p class="text-base-content/70 mt-2">以下是您這筆訂單的付款結果</p>
        <p v-if="orderNumber" class="text-sm mt-2 text-base-content/50">
          訂單編號：{{ orderNumber }}
        </p>
      </header>

      <!-- 狀態主畫面 -->
      <main class="text-center space-y-6">
        <!-- 載入中 -->
        <div v-if="isLoading">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <p class="mt-4 text-base-content/70">正在確認付款結果，請稍候...</p>
        </div>

        <!-- 已付款 -->
        <div v-else-if="paymentStatus === 'PAID'">
          <h2 class="text-2xl font-semibold text-success">🎉 付款成功！</h2>
          <p class="text-base-content/70">
            感謝您的購買，我們將盡快處理您的訂單。
          </p>
          <div class="flex justify-center gap-3 mt-6 flex-wrap">
            <router-link to="/orders" class="btn btn-primary"
              >查看訂單</router-link
            >
            <router-link to="/" class="btn btn-secondary">回到首頁</router-link>
          </div>
        </div>

        <!-- 尚未付款 -->
        <div v-else-if="paymentStatus === 'PENDING'">
          <h2 class="text-2xl font-semibold text-warning">付款尚未完成</h2>
          <p class="text-base-content/70">
            系統尚未收到您的付款資訊。請等待幾分鐘後再次查看，或留意簡訊／Email
            通知。
          </p>
          <div class="flex justify-center gap-3 mt-6 flex-wrap">
            <button @click="retryCheck" class="btn btn-primary">
              重新查詢付款狀態
            </button>
            <router-link to="/" class="btn btn-secondary">回到首頁</router-link>
          </div>
        </div>

        <!-- 訂單過期 -->
        <div v-else-if="paymentStatus === 'EXPIRED'">
          <h2 class="text-2xl font-semibold text-error">訂單已過期</h2>
          <p class="text-base-content/70">此訂單已超過付款期限，請重新下單。</p>
          <div class="mt-6">
            <router-link to="/" class="btn btn-primary">回到首頁</router-link>
          </div>
        </div>

        <!-- 未知錯誤 -->
        <div v-else>
          <h2 class="text-2xl font-semibold text-base-content">
            無法確認訂單狀態
          </h2>
          <p class="text-base-content/70">
            發生錯誤或無法查詢訂單狀態，請稍後再試或聯繫客服。
          </p>
          <div class="mt-6">
            <router-link to="/" class="btn btn-secondary">回到首頁</router-link>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";
import type { OrderDetail } from "@/models/backendApiModel";
import axios from "@/utils/axios";
import { paymentSchema } from "@/models/backendApiModel";

type PaymentStatus = "PENDING" | "PAID" | "EXPIRED" | "UNKNOWN";

const route = useRoute();
const orderStore = useOrderStore();

const isLoading = ref(true);
const paymentStatus = ref<PaymentStatus>("PENDING");
const order = ref<OrderDetail | null>(null);
const orderNumber = ref<string>("");

onMounted(() => {
  const queryOrderNumber = route.query.orderNumber as string;
  if (!queryOrderNumber) {
    paymentStatus.value = "UNKNOWN";
    isLoading.value = false;
    return;
  }
  orderNumber.value = queryOrderNumber;
  checkPaymentStatus(queryOrderNumber);
});

async function checkPaymentStatus(orderNo: string) {
  isLoading.value = true;
  try {
    const response = await axios.get("/pay/ecpay/getPaymentByOrderNumber", {
      params: { orderNumber: orderNo },
    });
    const result = paymentSchema.safeParse(response.data.data);

    if (result.success) {
      const status = result.data.status;
      if (status === "PAID") {
        paymentStatus.value = "PAID";
      } else if (status === "EXPIRED") {
        paymentStatus.value = "EXPIRED";
      } else {
        paymentStatus.value = "PENDING"; // 不等於 PAID 也不代表失敗
      }
    } else {
      paymentStatus.value = "UNKNOWN";
    }
  } catch (error) {
    console.error("付款狀態查詢失敗:", error);
    paymentStatus.value = "UNKNOWN";
  } finally {
    isLoading.value = false;
  }
}

const retryCheck = async () => {
  if (!orderNumber.value) return;
  await checkPaymentStatus(orderNumber.value);
};
</script>
