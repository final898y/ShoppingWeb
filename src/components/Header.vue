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
      <HealthIndicator
        label="伺服器"
        iconPath="/icons/AppServices_logo.svg"
        :status="healthStatus.server"
      />
      <HealthIndicator
        label="Redis"
        iconPath="/icons/redis_logo.svg"
        :status="healthStatus.redis"
      />
      <HealthIndicator
        label="Supabase"
        iconPath="/icons/supabase_logo.svg"
        :status="healthStatus.supabase"
      />

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
      <router-link
        to="/cart"
        class="btn relative"
        :aria-label="`購物車，當前有 ${cartItemsLength} 件商品`"
      >
        購物車
        <span
          v-if="cartItemsLength > 0"
          class="badge badge-secondary absolute -top-2 -right-2"
        >
          {{ cartItemsLength }}
        </span>
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLoginStore } from "../stores/userStore";
import { useHealthStore } from "@/stores/healthStore";
import { useCartStore } from "@/stores/cartStore";
import { storeToRefs } from "pinia";
import router from "@/router/index";
import * as csrfHelper from "@/utils/csrfToken";
import { isApiResponse } from "@/models/backendApiModel";
import axios from "@/utils/axios";
import { ref, onMounted, onUnmounted } from "vue";
import HealthIndicator from "@/components/HealthIndicator.vue";

const loginStore = useLoginStore();
const { islogined } = storeToRefs(loginStore);
const healthStore = useHealthStore();
const { healthStatus, needsChecking } = storeToRefs(healthStore);
const cartStore = useCartStore();

// 計算購物車商品數量
const cartItemsLength = computed(() => cartStore.items.length);

let healthCheckInterval: NodeJS.Timeout | null = null;

// Health check function
const checkHealthStatus = async () => {
  // If all components are online, stop checking
  if (
    !needsChecking.value.server &&
    !needsChecking.value.redis &&
    !needsChecking.value.supabase
  ) {
    if (healthCheckInterval) clearInterval(healthCheckInterval);
    healthCheckInterval = null;
    return;
  }

  try {
    const response = await axios.get("/health/check", {
      timeout: 5000, // 5 seconds timeout
      withCredentials: true, // Include cookies
    });

    healthStatus.value.server = response.data.server || "offline";
    healthStatus.value.redis = response.data.redis || "offline";
    healthStatus.value.supabase = response.data.supabase || "offline";

    if (response.data.redis === "online") needsChecking.value.redis = false;
    if (response.data.supabase === "online")
      needsChecking.value.supabase = false;
    if (response.data.server === "online") needsChecking.value.server = false;
  } catch (error) {
    console.error("Health check failed:", error);
    if (needsChecking.value.server) healthStatus.value.server = "checking";
    if (needsChecking.value.redis) healthStatus.value.redis = "checking";
    if (needsChecking.value.supabase) healthStatus.value.supabase = "checking";
  }
};

const logout = async () => {
  const body = await csrfHelper.setcsrfTokenAsRequestBody();
  body.append("mobilephone", loginStore.mobilephone);

  const formData = new URLSearchParams(body as any);

  try {
    // 使用 Axios 發送 POST 請求
    const res = await axios.post("/auth/logout", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    });

    const result = res.data;

    if (isApiResponse(result) && result.success) {
      loginStore.logout();
      router.push("/");
    } else {
      loginStore.resultmessage = "登出失敗";
      console.log("登出失敗");
    }
  } catch (error) {
    loginStore.resultmessage = "登出錯誤";
    console.error("登出請求失敗：", error);
  }
};

// Setup periodic health checking
onMounted(() => {
  const healthStore = useHealthStore();

  // 如果有任一項需要檢查，才執行 check
  const shouldCheck = Object.values(healthStore.needsChecking).some(
    (value) => value === true
  );

  if (shouldCheck) {
    checkHealthStatus(); // 初次檢查
    healthCheckInterval = setInterval(checkHealthStatus, 15000); // 每 15 秒檢查一次
  }
});

onUnmounted(() => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
});
</script>
