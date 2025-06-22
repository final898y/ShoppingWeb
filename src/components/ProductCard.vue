<template>
  <!-- Toast 通知 -->
  <div class="toast toast-top toast-end" v-if="showToast">
    <div class="alert bg-success text-success-content">
      <span>{{ toastMessage }}</span>
    </div>
  </div>

  <div
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow rounded-lg p-3"
  >
    <figure
      class="aspect-square overflow-hidden rounded-lg max-w-60 mx-auto bg-base-200"
    >
      <img
        :src="imageSrc"
        :alt="`${product.name} 商品圖片`"
        class="w-60 h-60 object-contain object-center"
        loading="lazy"
        @error="onImageError"
      />
    </figure>
    <div class="card-body p-3 text-center">
      <h2 class="card-title text-base font-semibold">{{ product.name }}</h2>
      <p class="text-medium text-primary font-bold">{{ formattedPrice }}</p>
      <div class="card-actions flex justify-center gap-2 mt-3">
        <button
          class="btn btn-secondary btn-sm"
          @click="addToCart"
          :aria-label="`將 ${product.name} 加入購物車`"
        >
          加入購物車
        </button>
        <router-link
          :to="`/product/${product.id}`"
          class="btn btn-primary btn-sm"
          :aria-label="`查看 ${product.name} 詳情`"
        >
          查看詳情
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cartStore";

// 定義 Product 類型
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  categoryId: number;
  subCategoryId: number;
}

// 正確的 props 定義
const props = defineProps<{ product: Product }>();
const product = props.product;

// 初始化 cartStore
const cartStore = useCartStore();

// 處理圖片錯誤 fallback
const imageSrc = ref(product.image || "/NoImage.png");
const onImageError = () => {
  imageSrc.value = "/NoImage.png";
};

// 貨幣格式化
const currency = "USD";
const formattedPrice = computed(() => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);
});

// Toast 控制
const showToast = ref(false);
const toastMessage = ref("");

// 加入購物車
const addToCart = () => {
  const { id, name, price, image } = product;
  cartStore.addItem({
    id,
    name,
    price,
    quantity: 1,
    image,
  });
  toastMessage.value = `${name} 已加入購物車！`;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 1500);
};
</script>
