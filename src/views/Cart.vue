<template>
  <!-- Toast 通知 -->
  <div class="toast toast-top toast-end" v-if="showToast">
    <div class="alert" :class="[toastConfig.bgClass, toastConfig.textClass]">
      <span>{{ toastConfig.message }}</span>
    </div>
  </div>

  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">購物車</h1>

      <!-- 空購物車 -->
      <div
        v-if="cartStore.items.length === 0"
        class="text-center text-base-content/80"
      >
        <p class="text-lg">您的購物車是空的，快去選購商品吧！</p>
        <router-link to="/" class="btn btn-primary mt-4">返回首頁</router-link>
      </div>

      <!-- 商品列表 -->
      <div v-else>
        <div class="card bg-base-100 shadow-xl border border-base-300 mb-6">
          <div class="card-body">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex items-center gap-4 py-4 border-b border-base-200 hover:shadow-lg transition-shadow duration-300"
            >
              <!-- 商品圖片，點擊可進入詳情頁 -->
              <router-link :to="`/product/${item.id}`">
                <figure
                  class="w-24 h-24 overflow-hidden rounded-lg bg-base-200 flex justify-center items-center"
                >
                  <img
                    :src="item.image_url || '/NoImage.png'"
                    :alt="`${item.name} 商品圖片`"
                    class="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
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
                  class="text-lg font-semibold hover:text-primary transition-colors"
                >
                  {{ item.name }}
                </router-link>
                <p class="text-base">單價：${{ item.price }}</p>
                <p class="text-base">
                  小計：${{ (item.price * item.quantity).toFixed(2) }}
                </p>
              </div>

              <!-- 數量與移除按鈕 -->
              <div class="flex items-center gap-2">
                <label :for="'quantity-' + item.id" class="text-base"
                  >數量：</label
                >
                <input
                  :id="'quantity-' + item.id"
                  type="number"
                  v-model.number="item.quantity"
                  :min="1"
                  :max="getStock(item.id)"
                  class="input input-bordered w-20"
                  @change="updateQuantity(item)"
                />
                <button
                  class="btn btn-error btn-sm"
                  @click="removeItem(item.id)"
                >
                  移除
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 總金額與操作 -->
        <div class="flex justify-between items-center gap-4">
          <p class="text-lg font-bold">
            總金額：${{ cartStore.totalPrice.toFixed(2) }}
          </p>
          <div class="flex gap-2">
            <button class="btn btn-error" @click="clearCart">清空購物車</button>
            <router-link to="/checkout" class="btn btn-primary"
              >結帳</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";

const cartStore = useCartStore();
const productStore = useProductStore();

const showToast = ref(false);
const toastConfig = ref({
  message: "",
  bgClass: "bg-success",
  textClass: "text-success-content",
});

// 顯示 toast 通知
const displayToast = (
  message: string,
  type: "success" | "warning" = "success"
) => {
  toastConfig.value = {
    message,
    bgClass: type === "success" ? "bg-success" : "bg-warning",
    textClass:
      type === "success" ? "text-success-content" : "text-warning-content",
  };
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
};

// 使用 Map 緩存取得的商品資料
const productStockMap = new Map<number, number>();

// 根據商品 ID 取得庫存（若尚未載入則 fetch）
const getStock = (id: number) => {
  return productStockMap.get(id) ?? 1; // 若無庫存資料，預設為 1
};

// 初始時嘗試載入所有購物車商品的庫存
onMounted(async () => {
  for (const item of cartStore.items) {
    const product = await productStore.fetchProductById(item.id);
    if (product) {
      productStockMap.set(item.id, product.stock);
    }
  }
});

// 數量更新邏輯
const updateQuantity = (item: { id: number; quantity: number }) => {
  const stock = getStock(item.id);
  if (item.quantity <= 0) {
    item.quantity = 1;
    displayToast("數量不得小於 1", "warning");
  } else if (item.quantity > stock) {
    item.quantity = stock;
    displayToast(`庫存僅剩 ${stock} 件`, "warning");
  }
  cartStore.saveToLocalStorage();
};

// 移除商品
const removeItem = (id: number) => {
  cartStore.removeItem(id);
  displayToast("商品已從購物車移除！", "success");
};

// 清空購物車
const clearCart = () => {
  cartStore.clearCart();
  displayToast("購物車已清空！", "success");
};
</script>
