<template>
  <div class="drawer md:drawer-open @container">
    <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
    <div
      class="drawer-content md:border-l-4 border-base-300 min-h-[calc(100vh-16rem)]"
    >
      <label
        for="drawer-toggle"
        class="btn btn-primary drawer-button md:hidden m-4 w-full"
      >
        Menu
      </label>

      <main class="flex-1 p-6 bg-base-100">
        <div class="p-4">
          <h1 class="text-2xl font-bold">歡迎來到購物網站</h1>

          <div v-if="productStore.isLoading" class="text-center mt-8">
            <span
              class="loading loading-spinner loading-lg text-primary"
            ></span>
          </div>

          <div
            v-else-if="productStore.products.length === 0"
            class="text-center mt-4 text-base-content/80"
          >
            <p class="text-lg">此分類暫無商品</p>
          </div>

          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4"
          >
            <ProductCard
              v-for="product in productStore.products"
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- 分頁 -->
          <div v-if="totalPages > 1" class="flex justify-center mt-8">
            <ul class="pagination">
              <li :class="{ disabled: productStore.currentPage === 1 }">
                <a
                  href="#"
                  @click.prevent="goToPage(productStore.currentPage - 1)"
                  >«</a
                >
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                :class="{ active: productStore.currentPage === page }"
              >
                <a href="#" @click.prevent="goToPage(page)">{{ page }}</a>
              </li>
              <li
                :class="{ disabled: productStore.currentPage === totalPages }"
              >
                <a
                  href="#"
                  @click.prevent="goToPage(productStore.currentPage + 1)"
                  >»</a
                >
              </li>
            </ul>
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
import { computed, onMounted } from "vue";
import ProductCard from "@/components/ProductCard.vue";
import Aside from "@/components/Aside.vue";
import { useProductStore } from "@/stores/productStore";

const productStore = useProductStore();

const totalPages = computed(() =>
  Math.ceil(productStore.totalProducts / productStore.pageSize)
);

const visiblePages = computed(() => {
  const current = productStore.currentPage;
  const total = totalPages.value;
  const delta = 2;
  let start = current - delta;
  let end = current + delta;

  if (start < 1) {
    end += 1 - start;
    start = 1;
  }
  if (end > total) {
    start -= end - total;
    end = total;
  }
  if (start < 1) start = 1;

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  await productStore.setPage(page);
};

onMounted(async () => {
  await productStore.fetchCategories();
  await productStore.fetchProducts();
});
</script>
