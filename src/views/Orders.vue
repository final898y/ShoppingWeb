<template>
  <!-- Toast 通知 -->
  <div class="toast toast-top toast-end" v-if="showToast">
    <div class="alert" :class="[toastConfig.bgClass, toastConfig.textClass]">
      <span>{{ toastConfig.message }}</span>
    </div>
  </div>

  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">訂單歷史</h1>

      <!-- 無訂單提示 -->
      <div v-if="orders.length === 0" class="text-center text-base-content/80">
        <p class="text-lg">您尚未有任何訂單，快去選購商品吧！</p>
        <router-link to="/" class="btn btn-primary mt-4">返回首頁</router-link>
      </div>

      <!-- 訂單清單 -->
      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="card bg-base-100 shadow-xl border border-base-300"
        >
          <div class="card-body">
            <!-- 訂單資訊 -->
            <div
              class="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center mb-4 gap-2 sm:gap-4"
            >
              <h2 class="text-lg font-semibold break-words">
                訂單 ID: {{ order.id }}
              </h2>
              <p class="text-sm text-base-content/80 break-words">
                訂單時間: {{ formatDate(order.createdAt) }}
              </p>
              <button
                class="btn btn-error btn-sm self-end sm:ml-auto"
                @click="cancelOrder(order.id)"
              >
                取消訂單
              </button>
            </div>

            <!-- 商品清單 -->
            <div class="mb-4">
              <h3 class="text-base font-medium mb-2">商品清單</h3>
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center gap-4 py-2 border-b border-base-200 last:border-b-0"
              >
                <img
                  :src="item.image_url || '/NoImage.png'"
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded-lg"
                  @error="item.image_url = '/NoImage.png'"
                />
                <div class="flex-1">
                  <h4 class="text-sm font-medium">{{ item.name }}</h4>
                  <p class="text-sm">單價：${{ item.price }}</p>
                  <p class="text-sm">數量：{{ item.quantity }}</p>
                  <p class="text-sm font-bold">
                    小計：${{ (item.price * item.quantity).toFixed(2) }}
                  </p>
                </div>
              </div>
              <div class="text-right mt-2">
                <p class="text-base font-bold">
                  總金額：${{ order.totalPrice.toFixed(2) }}
                </p>
              </div>
            </div>

            <!-- 收件人資訊 -->
            <div>
              <h3 class="text-base font-medium mb-2">收件人資訊</h3>
              <p class="text-sm">姓名：{{ order.formData.name }}</p>
              <p class="text-sm">電話：{{ order.formData.phone }}</p>
              <p class="text-sm">地址：{{ order.formData.address }}</p>
              <p class="text-sm">電子郵件：{{ order.formData.email }}</p>
              <p class="text-sm" v-if="order.formData.notes">
                備註：{{ order.formData.notes }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 訂單資料結構
interface Order {
  id: number;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
  }[];
  totalPrice: number;
  formData: {
    name: string;
    phone: string;
    address: string;
    email: string;
    notes: string;
  };
  createdAt: string;
}

// Toast 控制
const showToast = ref(false);
const toastConfig = ref({
  message: "",
  bgClass: "bg-warning",
  textClass: "text-warning-content",
});

// 顯示 Toast
const displayToast = (
  message: string,
  type: "success" | "warning" = "warning"
) => {
  toastConfig.value = {
    message,
    bgClass: type === "success" ? "bg-success" : "bg-warning",
    textClass:
      type === "success" ? "text-success-content" : "text-warning-content",
  };
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 訂單資料
const orders = ref<Order[]>([]);

// 格式化日期
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

// 讀取訂單
onMounted(() => {
  try {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.value = storedOrders;
  } catch {
    displayToast("無法讀取訂單資料，請稍後重試");
  }
});

// 取消訂單
const cancelOrder = (id: number) => {
  orders.value = orders.value.filter((order) => order.id !== id);
  localStorage.setItem("orders", JSON.stringify(orders.value));
  displayToast("訂單已取消", "success");
};
</script>
