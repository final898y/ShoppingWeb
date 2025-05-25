import { defineStore } from "pinia";
import { ref, watch } from "vue";

export type HealthStatus = "online" | "offline" | "checking";

// localStorage 的 key
const STORAGE_KEY = "health-store";

export const useHealthStore = defineStore("health", () => {
  // 載入本地儲存資料
  const localData = sessionStorage.getItem(STORAGE_KEY);
  const parsed = localData ? JSON.parse(localData) : null;

  // 狀態
  const healthStatus = ref<
    Record<"server" | "redis" | "supabase", HealthStatus>
  >(
    parsed?.healthStatus || {
      server: "checking",
      redis: "checking",
      supabase: "checking",
    }
  );

  const needsChecking = ref<Record<"server" | "redis" | "supabase", boolean>>(
    parsed?.needsChecking || {
      server: true,
      redis: true,
      supabase: true,
    }
  );

  // ✅ 方法：更新健康狀態
  function setHealthStatus(
    service: keyof typeof healthStatus.value,
    status: HealthStatus
  ) {
    healthStatus.value[service] = status;
  }

  // ✅ 方法：更新是否需要檢查
  function setNeedsChecking(
    service: keyof typeof needsChecking.value,
    value: boolean
  ) {
    needsChecking.value[service] = value;
  }

  // ✅ 監聽變化並儲存到 localStorage
  watch(
    [healthStatus, needsChecking],
    ([newHealthStatus, newNeedsChecking]) => {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          healthStatus: newHealthStatus,
          needsChecking: newNeedsChecking,
        })
      );
    },
    { deep: true }
  );

  return {
    healthStatus,
    needsChecking,
    setHealthStatus,
    setNeedsChecking,
  };
});
