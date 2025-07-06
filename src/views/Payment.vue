<template>
  <div class="payment-container">
    <div v-if="isLoading" class="card">
      <h2>正在確認付款結果...</h2>
      <p>請稍候，我們正在與金流服務確認您的付款狀態。</p>
    </div>

    <div v-else-if="paymentStatus === 'PAID'" class="card success">
      <h2>🎉 付款成功！</h2>
      <p>感謝您的購買，我們將盡快為您處理訂單。</p>
      <div class="actions">
        <router-link to="/orders" class="btn btn-primary"
          >查看我的訂單</router-link
        >
        <router-link to="/" class="btn btn-secondary">回到首頁</router-link>
      </div>
    </div>

    <div v-else-if="paymentStatus === 'FAILED'" class="card failed">
      <h2>付款失敗</h2>
      <p>喔不，在處理您的付款時發生了一些問題。</p>
      <p v-if="order?.id">訂單編號: {{ order.id }}</p>
      <div class="actions">
        <button @click="retryPayment" class="btn btn-primary">重新付款</button>
        <router-link to="/" class="btn btn-secondary">回到首頁</router-link>
      </div>
    </div>

    <div v-else-if="paymentStatus === 'expired'" class="card expired">
      <h2>訂單已過期</h2>
      <p>此訂單已超過1小時的付款期限，請重新下單。</p>
      <div class="actions">
        <router-link to="/" class="btn btn-primary">回到首頁</router-link>
      </div>
    </div>

    <div v-else class="card">
      <h2>無法確認訂單狀態</h2>
      <p>我們無法找到對應的訂單資訊，或發生未預期的錯誤。</p>
      <div class="actions">
        <router-link to="/" class="btn btn-secondary">回到首頁</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";
import type { Order } from "@/models/backendApiModel";

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "expired";

const route = useRoute();
const orderStore = useOrderStore();

const isLoading = ref(true);
const paymentStatus = ref<PaymentStatus>("PENDING");
const order = ref<Order | null>(null);

onMounted(async () => {
  const orderNumber = route.query.orderNumber as string;

  if (!orderNumber) {
    isLoading.value = false;
    paymentStatus.value = "FAILED";
    return;
  }

  try {
    // const fetchedOrder = await orderStore.fetchOrder(orderNumber);
    // order.value = fetchedOrder;

    // if (!fetchedOrder) {
    //   throw new Error("Order not found");
    // }

    // 這裡可以保留或移除訂單過期邏輯，根據您的需求
    // const orderCreationTime = new Date(fetchedOrder.createdAt).getTime();
    // const oneHour = 60 * 60 * 1000;
    // if (
    //   Date.now() - orderCreationTime > oneHour &&
    //   fetchedOrder.status !== "PAID"
    // ) {
    //   paymentStatus.value = "expired";
    //   return;
    // }

    // 根據後端驗證的最終狀態來決定顯示成功或失敗
    const result = await orderStore.fetchOrderPaymentStatus(orderNumber);
    if (result && result === "PAID") {
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

const retryPayment = async () => {
  if (!order.value?.id) return;
  try {
    await orderStore.retryPayment(order.value.id);
  } catch (error) {
    console.error("Retry payment failed:", error);
    alert("重新付款失敗，請稍後再試或聯繫客服。");
  }
};
</script>

<style scoped>
.payment-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
  background-color: #f9f9f9;
}

.card {
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
  border-top: 4px solid #6c757d; /* Default border */
}

.card.success {
  border-top-color: #28a745;
}

.card.failed {
  border-top-color: #dc3545;
}

.card.expired {
  border-top-color: #ffc107;
}

.card h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.card p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
