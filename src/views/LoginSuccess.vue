<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="card w-96 bg-base-200 shadow-xl">
      <div class="card-body text-center">
        <h2 class="card-title justify-center mb-4">登入成功</h2>
        <p class="text-lg mb-6">歡迎回來！您已成功登入系統。</p>
        <div class="form-control">
          <button @click="goToHome" class="btn btn-primary w-full">
            前往首頁
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goToHome() {
  router.push("/");
}
</script>
