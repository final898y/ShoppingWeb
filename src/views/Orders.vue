<template>
  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">我的訂單</h1>

      <!-- Loading Spinner -->
      <div v-if="isLoading" class="text-center p-10">
        <span class="loading loading-lg loading-spinner"></span>
      </div>

      <!-- No Orders -->
      <div
        v-else-if="!isLoading && orders.length === 0"
        class="text-center text-base-content/80 p-10 card bg-base-200"
      >
        <p class="text-lg">您目前沒有任何訂單。</p>
        <router-link to="/" class="btn btn-primary mt-4">去逛逛</router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div
          v-for="order in orders"
          :key="order.order_number"
          class="card bg-base-200 shadow-xl border border-base-300 transition-all hover:shadow-2xl hover:-translate-y-1"
        >
          <div class="card-body">
            <div class="flex justify-between items-start gap-4">
              <div>
                <p class="font-semibold text-sm text-base-content/70">
                  訂單編號
                </p>
                <h2 class="card-title">{{ order.order_number }}</h2>
              </div>
              <div class="text-right">
                <div class="badge" :class="getStatusClass(order.status)">
                  {{ translateStatus(order.status) }}
                </div>
                <p class="text-sm text-base-content/70 mt-1">
                  {{ new Date(order.created_at).toLocaleDateString() }}
                </p>
              </div>
            </div>

            <div class="divider my-2"></div>

            <div class="flex justify-between items-end">
              <div>
                <p class="text-base-content/70">
                  收件人: {{ order.recipient_name }}
                </p>
                <p class="text-lg font-bold">
                  總金額: ${{ parseFloat(order.total_amount).toFixed(2) }}
                </p>
              </div>
              <div class="card-actions">
                                <router-link :to="{ name: 'OrderDetail', params: { orderNumber: order.order_number } }" class="btn btn-primary btn-sm">查看詳情</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "@/utils/axios";
import { useToast } from "@/composables/useToast";

// 根據 API 文件定義的訂單資料結構
interface Order {
  id: number;
  order_number: string;
  total_amount: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  recipient_name: string;
  created_at: string;
  payments: {
    status: string;
    payment_method: string;
  }[];
}

const orders = ref<Order[]>([]);
const isLoading = ref(true);
const { showToast } = useToast();

// 獲取訂單資料
const fetchOrders = async () => {
  // TODO: 未來從 auth store 或使用者狀態中取得 userUuid
  const userUuid = "19de471a-2391-4205-baa9-774a691ca256"; // 暫時寫死的 UUID
  isLoading.value = true;
  try {
    const response = await axios.get("/checkoutflow/orders", {
      params: { userUuid },
    });
    if (response.data.success) {
      orders.value = response.data.data;
    } else {
      throw new Error(response.data.message || "未能成功獲取訂單");
    }
  } catch (error) {
    console.error("載入訂單失敗:", error);
    const errorMessage =
      error instanceof Error ? error.message : "發生未知錯誤";
    showToast(`載入訂單失敗: ${errorMessage}`, "warning");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});

// 翻譯訂單狀態
const translateStatus = (status: Order["status"]): string => {
  const statusMap: { [key in Order["status"]]: string } = {
    PENDING: "待付款",
    PAID: "已付款",
    SHIPPED: "已出貨",
    COMPLETED: "已完成",
    CANCELLED: "已取消",
  };
  return statusMap[status] || status;
};

// 根據狀態返回對應的 DaisyUI 樣式
const getStatusClass = (status: Order["status"]): string => {
  const classMap: { [key in Order["status"]]: string } = {
    PENDING: "badge-warning",
    PAID: "badge-success",
    SHIPPED: "badge-info",
    COMPLETED: "badge-primary",
    CANCELLED: "badge-ghost",
  };
  return classMap[status] || "badge-secondary";
};
</script>
