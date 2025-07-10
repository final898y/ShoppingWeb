<template>
  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <!-- Back Button -->
      <router-link to="/orders" class="btn btn-ghost mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        返回訂單列表
      </router-link>

      <h1 class="text-2xl font-bold mb-6">訂單詳情</h1>

      <!-- Loading Spinner -->
      <div v-if="isLoading" class="text-center p-10">
        <span class="loading loading-lg loading-spinner"></span>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="alert alert-error shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- Order Details -->
      <div v-else-if="order" class="space-y-6">
        <!-- Main Info -->
        <div class="card bg-base-200 shadow-lg border border-base-300">
          <div class="card-body">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm text-base-content/70">訂單編號</p>
                <h2 class="card-title text-primary">
                  {{ order.order_number }}
                </h2>
              </div>
              <div class="text-right">
                <div class="badge" :class="getStatusClass(order.status)">
                  {{ translateStatus(order.status) }}
                </div>
                <p class="text-sm text-base-content/70 mt-1">
                  下單於 {{ new Date(order.created_at).toLocaleString() }}
                </p>
              </div>
            </div>
            <div class="divider"></div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>總金額:</strong> ${{
                  parseFloat(order.total_amount).toFixed(2)
                }}
              </div>
              <div><strong>付款方式:</strong> {{ order.payment_method }}</div>
              <div>
                <strong>付款狀態:</strong>
                {{
                  order.paid_at
                    ? `已於 ${new Date(
                        order.paid_at
                      ).toLocaleDateString()} 付款`
                    : "待付款"
                }}
              </div>
            </div>
          </div>
        </div>

        <!-- Recipient & Shipping -->
        <div class="card bg-base-200 shadow-lg border border-base-300">
          <div class="card-body">
            <h3 class="card-title">配送資訊</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
              <p><strong>收件人:</strong> {{ order.recipient_name }}</p>
              <p><strong>聯絡電話:</strong> {{ order.recipient_phone }}</p>
              <p><strong>電子郵件:</strong> {{ order.recipient_email }}</p>
              <p><strong>運送地址:</strong> {{ order.shipping_address }}</p>
            </div>
            <div v-if="order.order_note" class="mt-4">
              <p><strong>訂單備註:</strong> {{ order.order_note }}</p>
            </div>
          </div>
        </div>

        <!-- Items List -->
        <div class="card bg-base-200 shadow-lg border border-base-300">
          <div class="card-body">
            <h3 class="card-title">商品列表</h3>
            <div class="overflow-x-auto mt-2">
              <table class="table w-full">
                <thead>
                  <tr>
                    <th>商品名稱</th>
                    <th class="text-right">單價</th>
                    <th class="text-right">數量</th>
                    <th class="text-right">小計</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item.product_id">
                    <td>{{ item.product_name }}</td>
                    <td class="text-right">
                      ${{ item.unit_price.toFixed(2) }}
                    </td>
                    <td class="text-right">{{ item.quantity }}</td>
                    <td class="text-right">
                      ${{ (item.unit_price * item.quantity).toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "@/utils/axios";
import { useToast } from "@/composables/useToast";

// Based on the Zod schema from docs/temporary.md
interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface OrderDetail {
  order_id: number;
  order_number: string;
  total_amount: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  shipping_address: string;
  order_note: string | null;
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string;
  payment_method: string;
  created_at: string; // Date comes as string from JSON
  paid_at: string | null; // Date comes as string from JSON
  items: OrderItem[];
}

const route = useRoute();
const order = ref<OrderDetail | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const { showToast } = useToast();

const fetchOrderDetail = async () => {
  const orderNumber = route.params.orderNumber as string;
  if (!orderNumber) {
    error.value = "無效的訂單編號";
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`/checkoutflow/order/${orderNumber}`);
    if (response.data.success) {
      order.value = response.data.data;
    } else {
      throw new Error(response.data.message || "未能成功獲取訂單詳情");
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "發生未知錯誤";
    error.value = `載入訂單失敗: ${errorMessage}`;
    showToast(error.value, "warning");
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchOrderDetail();
});

// Helper functions for display (can be moved to a composable if reused)
const translateStatus = (status: OrderDetail["status"]): string => {
  const statusMap = {
    PENDING: "待付款",
    PAID: "已付款",
    SHIPPED: "已出貨",
    COMPLETED: "已完成",
    CANCELLED: "已取消",
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: OrderDetail["status"]): string => {
  const classMap = {
    PENDING: "badge-warning",
    PAID: "badge-success",
    SHIPPED: "badge-info",
    COMPLETED: "badge-primary",
    CANCELLED: "badge-ghost",
  };
  return classMap[status] || "badge-secondary";
};
</script>
