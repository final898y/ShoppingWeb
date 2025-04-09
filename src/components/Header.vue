<template>
  <header class="text-white p-4 flex justify-between items-center">
    <div class="flex items-center space-x-4">
      <router-link to="/" class="text-lg font-bold w-16 whitespace-nowrap"
        >首頁</router-link
      >
      <input
        type="text"
        placeholder="搜尋商品..."
        class="input input-bordered"
      />
    </div>
    <div class="flex space-x-4">
      <button class="btn">登入</button>
      <button class="btn">註冊</button>
      <button class="btn">會員中心</button>
      <button class="btn">查訂單</button>
      <button class="btn">追蹤清單</button>
      <button class="btn">折價券</button>
      <button class="btn">購物車</button>
    </div>
  </header>
</template>

<script setup lang="ts"></script>
