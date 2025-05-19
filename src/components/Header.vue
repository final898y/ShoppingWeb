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
    <div class="flex items-center space-x-4">
      <!-- Server Status Indicator -->
      <div class="flex items-center space-x-2">
        <span class="text-sm">伺服器狀態:</span>
        <span
          :class="{
            'h-3 w-3 rounded-full': true,
            'bg-green-500': serverStatus === 'online',
            'bg-red-500': serverStatus === 'offline',
            'bg-gray-500': serverStatus === 'checking',
          }"
        ></span>
        <span>{{
          serverStatus === "online"
            ? "線上"
            : serverStatus === "offline"
            ? "離線"
            : "檢查中"
        }}</span>
      </div>
      <!-- Existing buttons -->
      <router-link v-if="!islogined" to="/login" class="btn">登入</router-link>
      <router-link v-if="!islogined" to="/register" class="btn"
        >註冊</router-link
      >
      <button v-if="islogined" @click="logout" class="btn">登出</button>
      <router-link v-if="islogined" to="/membercenter" class="btn"
        >會員中心</router-link
      >
      <button class="btn">查訂單</button>
      <button class="btn">追蹤清單</button>
      <button class="btn">折價券</button>
      <button class="btn">購物車</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useLoginStore } from "../stores/userStore";
import { storeToRefs } from "pinia";
import router from "@/router/index";
import * as csrfHelper from "@/utils/csrfToken";
import { isApiResponse } from "@/models/backendApiModel";
import axios from "@/utils/axios";
import { ref, onMounted, onUnmounted } from "vue";

const loginStore = useLoginStore();
const { islogined } = storeToRefs(loginStore);
const serverStatus = ref<"online" | "offline" | "checking">("checking");
let statusCheckInterval: NodeJS.Timeout | null = null;

// Backend status check function
const checkServerStatus = async () => {
  serverStatus.value = "checking";
  try {
    // Using a simple health check endpoint - adjust according to your backend
    const response = await axios.get("tests/supabase", {
      timeout: 5000,
      withCredentials: true,
    });
    serverStatus.value = response.status === 200 ? "online" : "offline";
  } catch (error) {
    serverStatus.value = "offline";
    console.error("Server status check failed:", error);
  }
};

const logout = async () => {
  const body = await csrfHelper.setcsrfTokenAsRequestBody();
  body.append("mobilephone", loginStore.mobilephone);
  const res = await fetch("auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    credentials: "include",
  });
  const result = await res.json();
  if (isApiResponse(result) && result.success) {
    loginStore.logout();
    router.push("/");
  } else {
    loginStore.resultmessage = "登出失敗";
    console.log("登出失敗");
  }
};

// Setup periodic status checking
onMounted(() => {
  checkServerStatus(); // Initial check
  statusCheckInterval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
});

// Cleanup on component unmount
onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
  }
});
</script>
