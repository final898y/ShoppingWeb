<template>
  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <!-- loading 骨架畫面 -->
      <div v-if="loading" class="animate-pulse space-y-6">
        <div class="w-full h-96 bg-base-200 rounded-lg"></div>
        <div class="h-6 bg-base-200 rounded w-3/4"></div>
        <div class="h-4 bg-base-200 rounded w-full"></div>
        <div class="h-4 bg-base-200 rounded w-1/2"></div>
      </div>

      <!-- 商品卡片內容 -->
      <div
        v-else-if="product"
        class="card bg-base-100 shadow-xl border border-base-300"
      >
        <div class="card-body flex flex-col md:flex-row gap-6">
          <!-- 商品圖片 -->
          <div class="md:w-1/2">
            <img
              :src="product_ImageUrl"
              :alt="`${product.name} 商品圖片`"
              class="w-full h-96 object-contain rounded-lg"
              loading="lazy"
              @error="onImageError"
            />
          </div>

          <!-- 商品詳情 -->
          <div class="md:w-1/2">
            <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>
            <p class="text-lg text-base-content mb-2">
              價格：${{ product.price }}
            </p>
            <p class="text-base text-base-content/80 mb-4">
              {{ product.description }}
            </p>
            <p class="text-base text-base-content mb-4">
              庫存：{{ product.stock }} 件
            </p>

            <!-- 數量選擇 -->
            <div class="flex items-center gap-4 mb-4">
              <label for="quantity" class="text-base">數量：</label>
              <input
                id="quantity"
                type="number"
                v-model.number="quantity"
                min="1"
                :max="product.stock"
                class="input input-bordered w-24"
              />
            </div>

            <!-- 加入購物車按鈕 -->
            <button
              class="btn btn-primary"
              :disabled="quantity > product.stock || quantity <= 0"
              @click="addToCart"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";

// 取得路由與商店
const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();

// 狀態
const product = ref<any | null>(null);
const quantity = ref(1);
const loading = ref(true);

// 取得商品 ID
const productId = Number(route.params.id);

// 動態圖片路徑（fallback 處理）
const product_ImageUrl = computed(() => {
  return product.value?.image_url || "/NoImage.png";
});

// 如果圖片載入失敗，自動換成預設圖
const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "/NoImage.png";
};

// 初始化載入資料
onMounted(async () => {
  loading.value = true;
  const result = await productStore.fetchProductById(productId);
  if (!result) {
    router.push("/404");
  } else {
    product.value = result;
  }
  loading.value = false;
});

// 加入購物車功能
const addToCart = () => {
  if (!product.value) return;

  if (quantity.value > 0 && quantity.value <= product.value.stock) {
    cartStore.addItem({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      quantity: quantity.value,
      image_url: product.value.image_url,
    });
    alert(`${product.value.name} 已加入購物車！`);
    quantity.value = 1; // 重設數量
  } else {
    alert("請選擇有效的數量！");
  }
};
</script>
