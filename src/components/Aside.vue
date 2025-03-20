<template>
  <aside>
    <h2 class="text-xl md:text-3xl font-bold mb-4">商品分類</h2>
    <ul class="menu bg-neutral rounded-box w-full">
      <li v-for="category in categories" :key="category.id">
        <details>
          <summary class="md:text-lg py-2 cursor-pointer">
            {{ category.name }}
          </summary>
          <ul>
            <li
              v-for="subCategory in category.subCategories"
              :key="subCategory.id"
            >
              <a class="text-sm md:text-base text-dark py-1 pl-4">{{
                subCategory.name
              }}</a>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
const categories = [
  {
    id: 1,
    name: "電子產品",
    subCategories: [
      { id: 11, name: "手機" },
      { id: 12, name: "筆電" },
      { id: 13, name: "配件" },
    ],
  },
  {
    id: 2,
    name: "服飾",
    subCategories: [
      { id: 21, name: "上衣" },
      { id: 22, name: "褲子" },
      { id: 23, name: "鞋子" },
    ],
  },
  {
    id: 3,
    name: "書籍",
    subCategories: [
      { id: 31, name: "小說" },
      { id: 32, name: "教材" },
      { id: 33, name: "漫畫" },
    ],
  },
  {
    id: 4,
    name: "家居用品",
    subCategories: [
      { id: 41, name: "家具" },
      { id: 42, name: "廚具" },
      { id: 43, name: "裝飾" },
    ],
  },
];
</script>
