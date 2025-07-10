<template>
  <aside>
    <h2 class="text-xl md:text-3xl font-bold mb-4">商品分類</h2>
    <ul class="menu bg-neutral rounded-box w-full">
      <li>
        <a
          class="md:text-lg py-2 cursor-pointer hover:text-primary"
          @click="onClickAll"
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
      <li v-for="category in productStore.categories" :key="category.id">
        <details>
          <summary class="md:text-lg py-2 cursor-pointer">
            <a
              @click.prevent="onClickCategory(category.id)"
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
            <li v-for="sub in category.subCategories" :key="sub.id">
              <a
                @click.prevent="onClickSubCategory(category.id, sub.id)"
                class="text-sm md:text-base text-dark py-1 pl-4 hover:text-primary"
                :aria-label="`篩選 ${sub.name} 子分類`"
                :class="{
                  'text-primary': productStore.selectedSubCategoryId === sub.id,
                }"
              >
                {{ sub.name }}
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

const onClickAll = async () => {
  await productStore.resetFilter();
  await productStore.fetchProducts();
};

const onClickCategory = async (categoryId: number) => {
  await productStore.setFilter(categoryId);
};

const onClickSubCategory = async (
  categoryId: number,
  subCategoryId: number
) => {
  await productStore.setFilter(categoryId, subCategoryId);
};
</script>
