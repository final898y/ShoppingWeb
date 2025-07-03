<template>
  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">付款</h1>

      <!-- 無有效資料提示 -->
      <div v-if="!isValidOrder" class="text-center text-base-content/80">
        <p class="text-lg">無訂單資料，請重新填寫</p>
        <router-link to="/checkout" class="btn btn-primary mt-4"
          >返回填寫</router-link
        >
      </div>

      <!-- 付款頁面 -->
      <div v-else>
        <!-- 商品清單 -->
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

        <!-- 付款資訊 -->
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
                :aria-label="isProcessing ? '正在處理付款' : '模擬付款'"
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
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { useToast } from "@/composables/useToast"; // ✅ 新增

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const isProcessing = ref(false);

// ✅ 全域 toast
const toast = useToast();

const formData = computed(() => orderStore.formData);
const cartItems = computed(() => orderStore.cartItems);
const totalPrice = computed(() => orderStore.totalPrice);

// 訂單是否有效
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

// 頁面載入時自動載入資料
onMounted(() => {
  orderStore.loadFromStorage();

  if (!isValidOrder.value) {
    toast.showToast("無有效的訂單資料，請重新填寫", "warning");
    setTimeout(() => router.push("/checkout"), 3000);
  }
});

// 模擬付款流程
const processPayment = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;

  try {
    // 模擬延遲
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 建立訂單資料
    const order = {
      id: Date.now(),
      items: cartItems.value,
      totalPrice: totalPrice.value,
      formData: formData.value,
      createdAt: new Date().toISOString(),
    };

    // 寫入 localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // 清除資料
    cartStore.clearCart("19de471a-2391-4205-baa9-774a691ca256"); // TODO: 從使用者登入狀態取得
    orderStore.clearOrder();

    // 顯示成功提示
    toast.showToast("付款成功，訂單已提交！", "success");
    setTimeout(() => {
      router.push("/");
      isProcessing.value = false;
    }, 3000);
  } catch (error) {
    console.error("付款失敗：", error);
    toast.showToast("付款失敗，請稍後重試", "warning");
    isProcessing.value = false;
  }
};
</script>
