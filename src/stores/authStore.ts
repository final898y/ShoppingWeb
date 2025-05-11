// authStore.ts
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as null | { name: string },
    lastCheckTime: 0, // 時間戳（毫秒）
  }),
  actions: {
    async fetchUser() {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        if (!res.ok) throw new Error("未登入");
        const data = await res.json();
        this.user = data;
        this.lastCheckTime = Date.now();
        return true;
      } catch (err) {
        this.user = null;
        return false;
      }
    },
  },
});
