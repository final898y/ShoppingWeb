<template>
  <div
    class="min-h-[calc(100vh-16rem)] p-6 bg-base-100 flex items-center justify-center"
  >
    <div class="card bg-base-100 shadow-xl border border-base-300 text-center">
      <div class="card-body">
        <h1 class="text-4xl font-bold text-error mb-4">404 - 頁面未找到</h1>
        <p class="text-lg text-base-content/80 mb-6">
          抱歉，您訪問的頁面不存在。可能是商品 ID 無效或頁面已被移除。
        </p>
        <router-link to="/" class="btn btn-primary"> 返回首頁 </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
