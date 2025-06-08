<template>
  <!-- Drawer for Responsive Aside -->
  <div class="drawer md:drawer-open @container">
    <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
    <div
      class="drawer-content md:border-l-4 border-base-300 min-h-[calc(100vh-16rem)]"
    >
      <!-- Main Content -->
      <label
        for="drawer-toggle"
        class="btn btn-primary drawer-button md:hidden m-4 w-full"
      >
        Menu
      </label>
      <main class="flex-1 p-6 bg-base-100">
        <div class="p-4">
          <h1 class="text-2xl font-bold">歡迎來到購物網站</h1>
          <div
            v-if="filteredProducts.length === 0"
            class="text-center text-base-content/80 mt-4"
          >
            <p class="text-lg">此分類暫無商品</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="card bg-primary shadow-xl"
            >
              <figure>
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-48 object-cover rounded-t-lg"
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">{{ product.name }}</h2>
                <p class="text-medium">${{ product.price }}</p>
                <div class="card-actions justify-end gap-2">
                  <button
                    class="btn btn-secondary"
                    @click="addToCart(product)"
                    :aria-label="`將 ${product.name} 加入購物車`"
                  >
                    加入購物車
                  </button>
                  <router-link
                    :to="`/product/${product.id}`"
                    class="btn btn-primary"
                    :aria-label="`查看 ${product.name} 詳情`"
                  >
                    查看詳情
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div class="drawer-side">
      <label for="drawer-toggle" class="drawer-overlay"></label>
      <Aside
        class="p-4 bg-base-100 w-64 md:p-6 max-md:w-64 min-h-[calc(100vh)]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Aside from "../components/Aside.vue";
import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";

// 初始化商店
const cartStore = useCartStore();
const productStore = useProductStore();

// 響應式獲取篩選後的商品
const filteredProducts = computed(() => {
  const products = productStore.getFilteredProducts();
  console.log("Filtered products:", products); // 調試日誌
  return products;
});

// 加入購物車功能
const addToCart = (product: {
  id: number;
  name: string;
  price: number;
  image: string;
}) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.image,
  });
  alert(`${product.name} 已加入購物車！`);
};
</script>
