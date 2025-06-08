<template>
  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">購物車</h1>
      <div
        v-if="cartStore.items.length === 0"
        class="text-center text-base-content/80"
      >
        <p class="text-lg">您的購物車是空的，快去選購商品吧！</p>
        <router-link to="/" class="btn btn-primary mt-4">返回首頁</router-link>
      </div>
      <div v-else>
        <div class="card bg-base-100 shadow-xl border border-base-300 mb-6">
          <div class="card-body">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex items-center gap-4 py-4 border-b border-base-200"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-24 h-24 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h2 class="text-lg font-semibold">{{ item.name }}</h2>
                <p class="text-base">單價：${{ item.price }}</p>
                <p class="text-base">
                  小計：${{ (item.price * item.quantity).toFixed(2) }}
                </p>
              </div>
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
        <div class="flex justify-between items-center">
          <p class="text-lg font-bold">
            總金額：${{ cartStore.totalPrice.toFixed(2) }}
          </p>
          <button class="btn btn-error" @click="clearCart">清空購物車</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";

// 初始化商店
const cartStore = useCartStore();
const productStore = useProductStore();

// 獲取商品庫存
const getStock = (id: number) => {
  const product = productStore.getProductById(id);
  return product ? product.stock : 1;
};

// 更新數量
const updateQuantity = (item: { id: number; quantity: number }) => {
  const stock = getStock(item.id);
  if (item.quantity <= 0) {
    item.quantity = 1;
  } else if (item.quantity > stock) {
    item.quantity = stock;
    alert(`庫存僅剩 ${stock} 件`);
  }
  cartStore.saveToLocalStorage();
};

// 移除商品
const removeItem = (id: number) => {
  cartStore.removeItem(id);
  alert("商品已從購物車移除！");
};

// 清空購物車
const clearCart = () => {
  cartStore.clearCart();
  alert("購物車已清空！");
};
</script>
