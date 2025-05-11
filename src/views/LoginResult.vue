<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="card w-96 bg-base-200 shadow-xl">
      <div class="card-body text-center">
        <!-- 根據是否註冊，顯示不同標題 -->
        <h2 class="card-title justify-center mb-4">{{ welcomeTitle }}</h2>

        <!-- 顯示歡迎訊息 -->
        <p class="text-lg mb-6">
          {{ welcomeMessage }}
        </p>

        <!-- 導航按鈕 -->
        <div class="form-control">
          <button @click="goToHome" class="btn btn-primary w-full">
            前往{{ linkName }}頁面
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "../stores/userStore";

// Pinia store 與 router
const userStore = useLoginStore();
const router = useRouter();

// 提出 isRegistered 為 computed 變數，讓語意更清楚
const isRegistered = computed(() => userStore.isregistered);

// 根據註冊狀態顯示標題
const welcomeTitle = computed(() => {
  return isRegistered.value
    ? `${userStore.email} 登入成功。`
    : "此帳號尚未註冊。";
});

// 根據註冊狀態顯示訊息
const welcomeMessage = computed(() => {
  return isRegistered.value
    ? "歡迎回來！您已成功登入系統。"
    : "歡迎前往註冊頁面加入會員！";
});

// 根據註冊狀態決定按鈕文字
const linkName = computed(() => {
  return isRegistered.value ? "首頁" : "註冊";
});

// 根據註冊狀態導向不同頁面
function goToHome() {
  const targetRoute = isRegistered.value ? "/" : "/register";
  router.push(targetRoute);
}
</script>
