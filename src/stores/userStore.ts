import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useLoginStore = defineStore("loginuser", () => {
  // 👉 狀態變數
  const mobilephone = ref("");
  const email = ref("");
  const isregistered = ref(false);
  const resultmessage = ref("");
  const islogined = ref(false);

  function loginIsRegistered(userEmail: string, userPhone: string) {
    islogined.value = true;
    isregistered.value = true;
    email.value = userEmail;
    mobilephone.value = userPhone;
    resultmessage.value = "登入成功！";
  }
  function loginNotRegistered(userEmail: string, userPhone: string) {
    islogined.value = false;
    isregistered.value = false;
    email.value = userEmail;
    mobilephone.value = userPhone;
    resultmessage.value = "登入成功！";
  }

  // ✅ 登出方法
  function logout() {
    islogined.value = false;
    email.value = "";
    mobilephone.value = "";
    resultmessage.value = "已登出。";
    localStorage.removeItem("loginStore");
  }

  // ✅ 載入 localStorage 資料（初始化用）
  function loadFromLocalStorage() {
    const saved = localStorage.getItem("loginStore");
    if (saved) {
      const data = JSON.parse(saved);
      islogined.value = data.islogined;
      email.value = data.email;
      mobilephone.value = data.mobilephone;
      resultmessage.value = data.resultmessage || "";
    }
  }

  // ✅ 自動監聽狀態變化 → 儲存到 localStorage
  watch(
    () => ({
      islogined: islogined.value,
      email: email.value,
      mobilephone: mobilephone.value,
      resultmessage: resultmessage.value,
    }),
    (newState) => {
      localStorage.setItem("loginStore", JSON.stringify(newState));
    },
    { deep: true }
  );

  // 導出狀態與方法
  return {
    mobilephone,
    email,
    isregistered,
    resultmessage,
    islogined,
    logout,
    loginIsRegistered,
    loginNotRegistered,
    loadFromLocalStorage,
  };
});
