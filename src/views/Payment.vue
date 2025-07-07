<template>
  <div class="flex justify-center items-center min-h-[60vh] bg-base-100 p-6">
    <div
      v-if="isLoading"
      class="card bg-base-100 shadow-xl text-base-content w-full max-w-md"
    >
      <div class="card-body items-center text-center">
        <h2 class="card-title">正在確認付款結果...</h2>
        <p>請稍候，我們正在與金流服務確認您的付款狀態。</p>
      </div>
    </div>

    <div
      v-else-if="paymentStatus === 'PAID'"
      class="card bg-success text-success-content shadow-xl w-full max-w-md"
    >
      <div class="card-body items-center text-center">
        <h2 class="card-title">🎉 付款成功！</h2>
        <p>感謝您的購買，我們將盡快為您處理訂單。</p>
        <div class="card-actions justify-center mt-4">
          <router-link to="/orders" class="btn btn-primary"
            >查看我的訂單</router-link
          >
          <router-link to="/" class="btn btn-secondary">回到首頁</router-link>
        </div>
      </div>
    </div>

    <div
      v-else-if="paymentStatus === 'FAILED'"
      class="card bg-error text-error-content shadow-xl w-full max-w-md"
    >
      <div class="card-body items-center text-center">
        <h2 class="card-title">付款失敗</h2>
        <p>喔不，在處理您的付款時發生了一些問題。</p>
        <p v-if="order?.order_number">訂單編號: {{ order.order_number }}</p>
        <div class="card-actions justify-center mt-4">
          <button @click="retryPayment" class="btn btn-primary">
            重新付款
          </button>
          <router-link to="/" class="btn btn-secondary">回到首頁</router-link>
        </div>
      </div>
    </div>

    <div
      v-else-if="paymentStatus === 'expired'"
      class="card bg-warning text-warning-content shadow-xl w-full max-w-md"
    >
      <div class="card-body items-center text-center">
        <h2 class="card-title">訂單已過期</h2>
        <p>此訂單已超過1小時的付款期限，請重新下單。</p>
        <div class="card-actions justify-center mt-4">
          <router-link to="/" class="btn btn-primary">回到首頁</router-link>
        </div>
      </div>
    </div>

    <div
      v-else
      class="card bg-neutral text-neutral-content shadow-xl w-full max-w-md"
    >
      <div class="card-body items-center text-center">
        <h2 class="card-title">無法確認訂單狀態</h2>
        <p>我們無法找到對應的訂單資訊，或發生未預期的錯誤。</p>
        <div class="card-actions justify-center mt-4">
          <router-link to="/" class="btn btn-secondary">回到首頁</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";
import type { OrderDetail } from "@/models/backendApiModel";
import axios from "@/utils/axios";
import { paymentSchema } from "@/models/backendApiModel";

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "expired";

const route = useRoute();
const orderStore = useOrderStore();

const isLoading = ref(true);
const paymentStatus = ref<PaymentStatus>("PENDING");
const order = ref<OrderDetail | null>(null);

onMounted(async () => {
  const orderNumber = route.query.orderNumber as string;

  if (!orderNumber) {
    isLoading.value = false;
    paymentStatus.value = "FAILED";
    return;
  }

  try {
    // 根據後端驗證的最終狀態來決定顯示成功或失敗
    const responseData = await getPaymentByOrderNumber(orderNumber);
    const result = paymentSchema.safeParse(responseData.data);
    console.log(result);

    if (result.success && result.data.status === "PAID") {
      paymentStatus.value = "PAID";
    } else {
      paymentStatus.value = "FAILED";
    }
  } catch (error) {
    console.error("Failed to verify payment:", error);
    paymentStatus.value = "FAILED";
  } finally {
    isLoading.value = false;
  }
});

async function getPaymentByOrderNumber(orderNumber: string) {
  try {
    const response = await axios.get("/pay/ecpay/getPaymentByOrderNumber", {
      params: {
        orderNumber: orderNumber, // 會自動轉成 query string
      },
    });
    return response.data;
  } catch (error) {
    console.error("查詢付款資料失敗:", error);
    throw error;
  }
}

const retryPayment = async () => {
  if (!order.value?.order_number) return;
  try {
    await orderStore.retryPayment(order.value.order_number);
  } catch (error) {
    console.error("Retry payment failed:", error);
    alert("重新付款失敗，請稍後再試或聯繫客服。");
  }
};
</script>
