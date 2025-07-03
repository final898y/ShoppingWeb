<template>
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
              <!-- 商品圖片 -->
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

              <!-- 數量與操作 -->
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
                <button class="btn btn-error btn-sm" @click="removeItem(item)">
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
            <button class="btn btn-primary" @click="proceedToCheckout">
              結帳
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";
import { useOrderStore } from "@/stores/orderStore";
import { debounce } from "@/utils/debounce";
import { useStockCache } from "@/composables/useStockCache";
import { useToast } from "@/composables/useToast"; // ✅ 使用全域 Toast

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

const cartStore = useCartStore();
const productStore = useProductStore();
const orderStore = useOrderStore();
const router = useRouter();
const { getStock, fetchStock, watchAndFill } = useStockCache(productStore);

// ✅ 呼叫全域 Toast 方法
const { showToast } = useToast();

const { items } = storeToRefs(cartStore);
watchAndFill(items);

// 防抖更新
const debouncedUpdate = debounce(async (item: CartItem) => {
  const result = await cartStore.updateItemQuantity(item.id, item.quantity);
  showToast(result.message, result.success ? "success" : "warning");
}, 500);

// 更新數量
const updateQuantity = async (item: CartItem) => {
  const stock = await fetchStock(item.id);
  if (item.quantity <= 0) {
    item.quantity = 1;
    showToast("數量不得小於 1", "warning");
  } else if (item.quantity > stock) {
    item.quantity = stock;
    showToast(`庫存僅剩 ${stock} 件`, "warning");
  }
  debouncedUpdate(item);
};

// 移除項目
const removeItem = async (item: CartItem) => {
  const result = await cartStore.removeItem(item);
  showToast(result.message, result.success ? "success" : "warning");
};

// 清空購物車
const clearCart = async () => {
  const userUuid = "19de471a-2391-4205-baa9-774a691ca256"; // TODO: 從登入取得
  const result = await cartStore.clearCart(userUuid);
  showToast(result.message, result.success ? "success" : "warning");
};

// 結帳檢查庫存
const proceedToCheckout = async () => {
  for (const item of cartStore.items) {
    const hasStock = await productStore.checkStock(item.id, item.quantity);
    if (!hasStock) {
      showToast(`商品 ${item.name} 庫存不足`, "warning");
      return;
    }
  }

  orderStore.setupOrder(cartStore.items, cartStore.totalPrice);
  router.push("/checkout");
};
</script>
