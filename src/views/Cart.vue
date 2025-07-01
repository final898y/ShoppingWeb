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
import { ref, onMounted, reactive } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";
import { debounce } from "@/utils/debounce";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

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

// ======== 庫存處理區 ========

const productStockMap = reactive(new Map<number, number>());
const debouncedFetchStockMap = new Map<number, () => void>();

const getStock = (id: number): number => productStockMap.get(id) ?? 0;

const fetchStockWithDebounce = (id: number): Promise<number> => {
  return new Promise((resolve) => {
    if (productStockMap.has(id)) {
      resolve(productStockMap.get(id)!);
      return;
    }
    if (!debouncedFetchStockMap.has(id)) {
      const fn = debounce(async () => {
        const product = await productStore.fetchProductById(id);
        const stock = product?.stock ?? 0;
        productStockMap.set(id, stock);
        resolve(stock);
      }, 300);
      debouncedFetchStockMap.set(id, fn);
    }
    debouncedFetchStockMap.get(id)!();
  });
};

// 預載所有庫存
onMounted(async () => {
  const promises = cartStore.items.map((item) =>
    fetchStockWithDebounce(item.id).then((stock) =>
      productStockMap.set(item.id, stock)
    )
  );
  await Promise.all(promises);
});

// 建立防抖函式：延遲觸發更新後端
const debouncedUpdate = debounce(async (item: CartItem) => {
  const result = await cartStore.updateItemQuantity(item.id, item.quantity);
  displayToast(result.message, result.success ? "success" : "warning");
}, 500);

// 數量更新邏輯
const updateQuantity = async (item: CartItem) => {
  const stock = await fetchStockWithDebounce(item.id); // 使用非同步版本檢查庫存
  if (item.quantity <= 0) {
    item.quantity = 1;
    displayToast("數量不得小於 1", "warning");
  } else if (item.quantity > stock) {
    item.quantity = stock;
    displayToast(`庫存僅剩 ${stock} 件`, "warning");
  }
  debouncedUpdate(item); // 使用防抖更新
};

// 移除商品
const removeItem = async (item: CartItem) => {
  const result = await cartStore.removeItem(item);
  displayToast(result.message, result.success ? "success" : "warning");
};

// 清空購物車
const clearCart = async () => {
  const userUuid = "19de471a-2391-4205-baa9-774a691ca256"; // TODO: 從認證 store 動態取得
  const result = await cartStore.clearCart(userUuid);
  displayToast(result.message, result.success ? "success" : "warning");
};
</script>
