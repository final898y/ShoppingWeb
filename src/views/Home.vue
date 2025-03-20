<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">歡迎來到購物網站</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="card bg-primary shadow-xl"
      >
        <div class="card-body">
          <h2 class="card-title">{{ product.name }}</h2>
          <p class="text-medium">${{ product.price }}</p>
          <button class="btn hover:bg-secondary">加入購物車</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const products = [
  { id: 1, name: "手機", price: 599 },
  { id: 2, name: "T恤", price: 29 },
  { id: 3, name: "書", price: 15 },
];
</script>
