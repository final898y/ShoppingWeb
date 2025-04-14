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

  // 在頁面載入時生成並儲存 CSRF token
  // const isSecure = window.location.protocol === "https:";

  // document.cookie = `g_csrf_token=${setCsrfToken}; Path=/; SameSite=${
  //   isSecure ? "None" : "Lax"
  // }${isSecure ? "; Secure" : ""}`;
  //document.cookie = `g_csrf_token=${setCsrfToken}; SameSite=Lax; Path=/`;
  // document.cookie = `g_csrf_token=${setCsrfToken}; SameSite=None; Secure; Path=/`;
});

// Email and password data
const email = ref("");
const password = ref("");

const getCsrfTokenFromServer = async (): Promise<string | null> => {
  try {
    const res = await fetch(
      "https://tradebackendfinal898y.azurewebsites.net/api/googleAuth/getCsrfToken",
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      console.error(`⚠️ 無法取得 CSRF Token，狀態碼：${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!data.success) {
      console.warn("⚠️ CSRF Token 回傳失敗：", data);
      return null;
    }

    console.log("✅ CSRF Token 已取得：", data.csrfToken);
    return data.csrfToken; // 直接傳回 token 而不是馬上讀 cookie
  } catch (err) {
    console.error("❌ 發生錯誤：無法從伺服器取得 CSRF Token", err);
    return null;
  }
};

// Handle the credential response from Google Sign-In
const handleCredentialResponse = async (response: CredentialResponse) => {
  const token = await getCsrfTokenFromServer();

  // 延遲讀取 cookie（保險起見）
  await new Promise((r) => setTimeout(r, 100));
  const csrfToken =
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("g_csrf_token="))
      ?.split("=")[1] ?? token; // 用備援的 token

  if (!csrfToken) {
    console.warn("⚠️ 無法取得 CSRF Token，請檢查是否正確設置 cookie");
    return;
  }

  const body = new URLSearchParams();
  body.append("credential", response.credential);
  body.append("g_csrf_token", csrfToken);
  console.log(body);

  const res = await fetch(
    "https://tradebackendfinal898y.azurewebsites.net/api/googleAuth/verifyGoogleIdToken",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      credentials: "include",
    }
  );

  const result = await res.json();
  console.log(result);
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
