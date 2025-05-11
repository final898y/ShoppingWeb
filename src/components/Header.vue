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
      <!-- 使用 v-if 顯示/隱藏登入與註冊按鈕 -->
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

const loginStore = useLoginStore();
const { islogined } = storeToRefs(loginStore);
// 登出函式：清除登入狀態
const logout = async () => {
  const body = await csrfHelper.setcsrfTokenAsRequestBody();
  body.append("mobilephone", loginStore.mobilephone);
  const res = await fetch(
    "https://tradebackendapitest-f7djcbgmc0f5hrfv.japaneast-01.azurewebsites.net/api/auth/logout",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      credentials: "include", // 💡 否則 cookie 不會帶過去
    }
  );
  const result = await res.json();
  if (isApiResponse(result) && result.success) {
    loginStore.logout();
    router.push("/");
    // 這裡可以額外加上導向首頁或其他頁面
  } else {
    loginStore.resultmessage = "登出失敗";
    console.log("登出失敗");
  }
};
</script>
