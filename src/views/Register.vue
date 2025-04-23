<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="card w-96 bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center mb-4">註冊</h2>

        <form @submit.prevent="handleSubmit">
          <div class="form-control">
            <label class="label">
              <span class="label-text">使用者名稱</span>
            </label>
            <input
              v-model="username"
              type="text"
              placeholder="輸入您的使用者名稱"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">電子郵件</span>
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="輸入您的電子郵件"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">密碼</span>
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="輸入您的密碼"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control mt-4">
            <label class="label">
              <span class="label-text">確認密碼</span>
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="再次輸入您的密碼"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary w-full">註冊</button>
          </div>

          <div class="mt-4 text-center">
            <p class="text-sm">
              已有帳號？
              <router-link to="/login" class="link link-hover"
                >立即登入</router-link
              >
            </p>
          </div>

          <div class="divider">或</div>

          <div id="gsi-button"></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const username = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");

const handleSubmit = () => {
  if (password.value !== confirmPassword.value) {
    alert("密碼與確認密碼不一致！");
    return;
  }
  // Proceed with registration API call or logic
  console.log("Registration submitted:", {
    username: username.value,
    email: email.value,
    password: password.value,
  });
};
</script>
