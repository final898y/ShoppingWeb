<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="card w-96 bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center mb-4">登入</h2>

        <form @submit.prevent="handleSubmit">
          <div class="form-control">
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

          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary w-full">登入</button>
          </div>

          <div class="mt-4 text-center">
            <a href="#" class="link link-hover text-sm">忘記密碼？</a>
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
import { onMounted } from "vue";
import {
  isApiResponse,
  isApiResponseOfType,
  UserDataType,
  isUserData,
} from "@/models/backendApiModel";
import router from "@/router/index";
import { useLoginStore } from "@/stores/userStore";
import * as csrfHelper from "@/utils/csrfToken";
const loginuserstore = useLoginStore();

// 宣告 google 的全域變數（讓 TS 不報錯）
declare global {
  interface Window {
    google: any;
  }
}

// 定義 GSI 回傳的 CredentialResponse 型別（簡化版）
interface CredentialResponse {
  credential: string;
  select_by: string;
  clientId: string;
}

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = () => {
    if (window.google) {
      console.log("Google Sign-In script loaded successfully");
    } else {
      console.error("Google Sign-In script failed to load");
    }

    window.google.accounts.id.initialize({
      client_id:
        "359200533687-87lah0su6ufvh34gi1c14mt0sudrpp21.apps.googleusercontent.com", // ← 換成你自己的 client_id
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("gsi-button"),
      // customization attributes
      {
        theme: "filled_black",
        size: "large",
        type: "standard",
        width: "336",
        locale: "en-US",
      }
    );
    window.google.accounts.id.prompt(); // also display the One Tap dialog
  };

  document.head.appendChild(script);
});

// Email and password data
const email = ref("");
const password = ref("");

// Handle the credential response from Google Sign-In
const handleCredentialResponse = async (response: CredentialResponse) => {
  const body = await csrfHelper.setcsrfTokenAsRequestBody();
  body.append("credential", response.credential);

  const res = await fetch(
    "https://tradebackendapitest-f7djcbgmc0f5hrfv.japaneast-01.azurewebsites.net/api/auth/verifyGoogleIdToken",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      credentials: "include",
    }
  );

  const result = await res.json();
  if (
    isApiResponseOfType<UserDataType>(result, isUserData) &&
    isUserData(result.data)
  ) {
    if (result.success) {
      console.log("已註冊");
      loginuserstore.loginIsRegistered(
        result.data.email,
        result.data.mobilephone
      );
      router.push("/loginresult");
    } else {
      console.log("未註冊");
      loginuserstore.loginNotRegistered(
        result.data.email,
        result.data.mobilephone
      );
      router.push("/loginresult");
    }
  } else {
    console.error("資料格式錯誤！");
    loginuserstore.isregistered = false;
    router.push("/loginresult");
  }
};

// Handle form submission
function handleSubmit() {
  console.log("Submitting form", email.value, password.value);
}
</script>

<style scoped>
/* Optional styling for input field */
input {
  margin-top: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
</style>
