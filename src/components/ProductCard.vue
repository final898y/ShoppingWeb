<template>
  <!-- Toast 通知 -->
  <div class="toast toast-top toast-end" v-if="showToast">
    <div class="alert bg-success text-success-content">
      <span>{{ toastMessage }}</span>
    </div>
  </div>

  <div
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow rounded-lg p-3 min-h-[420px]"
  >
    <!-- 商品圖片區 -->
    <router-link :to="`/product/${product.id}`">
      <figure
        class="h-72 md:h-80 overflow-hidden rounded-lg bg-base-200 flex justify-center items-center"
      >
        <img
          :src="imageSrc"
          :alt="`${product.name} 商品圖片`"
          class="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
          loading="lazy"
          @error="onImageError"
        />
      </figure>
    </router-link>

    <!-- 商品內容區 -->
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

// 定義 props 與類型
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  image_url: string;
  categoryId: number;
  subCategoryId: number;
}
const props = defineProps<{ product: Product }>();
const product = props.product;

// 購物車 store
const cartStore = useCartStore();

// 圖片錯誤備援
const imageSrc = ref(product.image_url || "/NoImage.png");
const onImageError = () => {
  imageSrc.value = "/NoImage.png";
};

// 貨幣格式
const currency = "USD";
const formattedPrice = computed(() =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price)
);

// Toast 訊息
const showToast = ref(false);
const toastMessage = ref("");

// 加入購物車
const addToCart = () => {
  const { id, name, price, image_url } = product;
  cartStore.addItem({
    id,
    name,
    price,
    quantity: 1,
    image_url,
  });
  toastMessage.value = `${name} 已加入購物車！`;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 1500);
};
</script>
