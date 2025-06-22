<template>
  <!-- Toast 通知 -->
  <div class="toast toast-top toast-end" v-if="showToast">
    <div class="alert" :class="[toastConfig.bgClass, toastConfig.textClass]">
      <span>{{ toastConfig.message }}</span>
    </div>
  </div>

  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">付款</h1>

      <!-- 無有效資料提示 -->
      <div
        v-if="!formData || !cartItems.length"
        class="text-center text-base-content/80"
      >
        <p class="text-lg">無訂單資料，請重新填寫</p>
        <router-link to="/checkout" class="btn btn-primary mt-4"
          >返回填寫</router-link
        >
      </div>

      <!-- 付款頁面 -->
      <div v-else>
        <div class="card bg-base-100 shadow-xl border border-base-300">
          <div class="card-body">
            <h2 class="text-lg font-semibold mb-4">付款資訊</h2>
            <p class="text-base">訂單總金額：${{ totalPrice.toFixed(2) }}</p>
            <p class="text-sm text-base-content/80 mt-2">
              這是模擬付款頁面，點擊下方按鈕完成付款。
            </p>
            <div class="card-actions justify-end mt-6">
              <button
                class="btn btn-primary"
                :disabled="isProcessing"
                @click="processPayment"
              >
                {{ isProcessing ? "處理中..." : "模擬付款" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";

// 初始化
const router = useRouter();
const cartStore = useCartStore();

// 訂單資料
const formData = ref(null);
const cartItems = ref([]);
const totalPrice = ref(0);
const isProcessing = ref(false);

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

// 獲取傳遞的資料
onMounted(() => {
  const state = history.state;
  if (state.formData && state.cartItems && state.totalPrice !== undefined) {
    formData.value = state.formData;
    cartItems.value = state.cartItems;
    totalPrice.value = state.totalPrice;
  } else {
    displayToast("無有效的訂單資料，請重新填寫");
    setTimeout(() => router.push("/checkout"), 3000);
  }
});

// 模擬付款
const processPayment = () => {
  isProcessing.value = true;
  setTimeout(() => {
    try {
      // 生成訂單
      const order = {
        id: Date.now(),
        items: cartItems.value,
        totalPrice: totalPrice.value,
        formData: formData.value,
        createdAt: new Date().toISOString(),
      };

      // 儲存至 localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // 清空購物車
      cartStore.clearCart();

      // 顯示成功提示並導航回首頁
      displayToast("付款成功，訂單已提交！", "success");
      setTimeout(() => {
        router.push("/");
        isProcessing.value = false;
      }, 3000);
    } catch {
      displayToast("付款失敗，請稍後重試");
      isProcessing.value = false;
    }
  }, 2000); // 模擬 2 秒付款處理
};
</script>
