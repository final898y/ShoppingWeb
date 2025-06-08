<template>
  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <!-- 商品卡片 -->
      <div class="card bg-base-100 shadow-xl border border-base-300">
        <div class="card-body flex flex-col md:flex-row gap-6">
          <!-- 商品照片 -->
          <div class="md:w-1/2">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-96 object-contain rounded-lg"
            />
          </div>
          <!-- 商品詳細資訊 -->
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
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";

// 初始化商店
const cartStore = useCartStore();
const productStore = useProductStore();

// 獲取路由參數
const route = useRoute();
const router = useRouter();
const productId = Number(route.params.id);

// 從 productStore 獲取商品
const product = productStore.getProductById(productId) || {
  id: 1,
  name: "未知商品",
  price: 0,
  description: "商品不存在",
  stock: 0,
  image: "https://via.placeholder.com/400x400?text=Not+Found",
};

// 若商品不存在，導航到 404 頁面
if (product.name === "未知商品") {
  router.push("/404");
}

// 數量選擇
const quantity = ref(1);

// 加入購物車功能
const addToCart = () => {
  if (quantity.value > 0 && quantity.value <= product.stock) {
    cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity.value,
      image: product.image,
    });
    alert(`${product.name} 已加入購物車！`);
    quantity.value = 1; // 重置數量
  } else {
    alert("請選擇有效的數量！");
  }
};
</script>
