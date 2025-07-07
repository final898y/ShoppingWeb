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
              v-for="item in ckConfirmcartItems"
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
                總金額：${{ ckConfirmtotalPrice.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl border border-base-300">
          <div class="card-body">
            <h2 class="text-lg font-semibold mb-4">收件人資訊</h2>
            <p class="text-sm">姓名：{{ ckConfirmformData.name }}</p>
            <p class="text-sm">電話：{{ ckConfirmformData.phone }}</p>
            <p class="text-sm">地址：{{ ckConfirmformData.address }}</p>
            <p class="text-sm">電子郵件：{{ ckConfirmformData.email }}</p>
            <p class="text-sm" v-if="ckConfirmformData.notes">
              備註：{{ ckConfirmformData.notes }}
            </p>
          </div>
        </div>

        <div class="flex justify-between items-center mt-6">
          <router-link to="/checkout" class="btn btn-outline"
            >返回編輯</router-link
          >

          <div class="flex flex-col items-end">
            <!-- 失敗時顯示錯誤訊息 -->
            <p v-if="status === 'failed'" class="text-error mb-2 text-sm">
              {{ errorMessage }}
            </p>
            <button
              class="btn btn-primary"
              @click="handlePayment"
              :disabled="status === 'processing'"
            >
              <span
                v-if="status === 'processing'"
                class="loading loading-spinner"
              ></span>
              {{ buttonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const orderStore = useOrderStore();

// 頁面狀態管理
type PageStatus = "idle" | "processing" | "failed";
const status = ref<PageStatus>("idle");
const errorMessage = ref<string | null>(null);

onMounted(() => {
  orderStore.loadFromStorage();
  if (!isValidOrder.value) {
    router.push("/checkout");
  }
  if (orderStore.currentOrderNumber) {
    status.value = "failed";
  }
});

const {
  formData: ckConfirmformData,
  cartItems: ckConfirmcartItems,
  totalPrice: ckConfirmtotalPrice,
} = storeToRefs(orderStore);

// 檢查訂單資料是否有效
const isValidOrder = computed(() => {
  return (
    !!ckConfirmformData.value.name &&
    !!ckConfirmformData.value.phone &&
    !!ckConfirmformData.value.address &&
    !!ckConfirmformData.value.email &&
    ckConfirmcartItems.value.length > 0 &&
    ckConfirmtotalPrice.value > 0
  );
});

const buttonText = computed(() => {
  switch (status.value) {
    case "processing":
      return "處理中...";
    case "failed":
      return "重試付款";
    default:
      return "進入付款";
  }
});

const handlePayment = async () => {
  if (status.value === "processing") return;

  status.value = "processing";
  errorMessage.value = null;

  try {
    if (orderStore.currentOrderNumber) {
      // 如果是重試，調用 retryPayment
      await orderStore.retryPayment(orderStore.currentOrderNumber);
    } else {
      // 首次付款
      await orderStore.initiateEcpayPayment();
    }
    // 如果成功，頁面會跳轉到綠界，這裡不需要做什麼
  } catch (error: any) {
    console.error("付款流程失敗：", error);
    status.value = "failed";
    errorMessage.value = "付款請求失敗，請檢查您的網路連線或稍後再試。";
    if (!orderStore.currentOrderNumber) {
      errorMessage.value += " 無法建立訂單，請返回上一步檢查資料。";
    }
  }
};
</script>
