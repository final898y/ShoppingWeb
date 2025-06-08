<template>
  <aside>
    <h2 class="text-xl md:text-3xl font-bold mb-4">商品分類</h2>
    <ul class="menu bg-neutral rounded-box w-full">
      <li>
        <a
          class="md:text-lg py-2 cursor-pointer hover:text-primary"
          @click="productStore.resetFilter()"
          :aria-label="'顯示所有商品'"
          :class="{
            'text-primary':
              !productStore.selectedCategoryId &&
              !productStore.selectedSubCategoryId,
          }"
        >
          所有商品
        </a>
      </li>
      <li v-for="category in productStore.getCategories()" :key="category.id">
        <details>
          <summary class="md:text-lg py-2 cursor-pointer">
            <a
              @click="productStore.setFilter(category.id)"
              class="hover:text-primary"
              :aria-label="`篩選 ${category.name} 分類`"
              :class="{
                'text-primary':
                  productStore.selectedCategoryId === category.id &&
                  !productStore.selectedSubCategoryId,
              }"
            >
              {{ category.name }}
            </a>
          </summary>
          <ul>
            <li
              v-for="subCategory in category.subCategories"
              :key="subCategory.id"
            >
              <a
                @click="productStore.setFilter(category.id, subCategory.id)"
                class="text-sm md:text-base text-dark py-1 pl-4 hover:text-primary"
                :aria-label="`篩選 ${subCategory.name} 子分類`"
                :class="{
                  'text-primary':
                    productStore.selectedSubCategoryId === subCategory.id,
                }"
              >
                {{ subCategory.name }}
              </a>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useProductStore } from "@/stores/productStore";

const productStore = useProductStore();

// 調試日誌：監聽篩選狀態變化
productStore.$subscribe((mutation, state) => {
  console.log("productStore state changed:", {
    selectedCategoryId: state.selectedCategoryId,
    selectedSubCategoryId: state.selectedSubCategoryId,
  });
});
</script>
