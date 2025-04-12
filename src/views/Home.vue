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
import Aside from "../components/Aside.vue";

const products = [
  { id: 1, name: "手機", price: 599 },
  { id: 2, name: "T恤", price: 29 },
  { id: 3, name: "書", price: 15 },
];
</script>
