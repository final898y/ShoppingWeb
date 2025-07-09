import { ref, onMounted, onUnmounted } from "vue";
import axios from "@/utils/axios";
import { paymentSchema } from "@/models/backendApiModel";

export type PaymentStatus = "PENDING" | "PAID" | "EXPIRED" | "UNKNOWN";

export function usePaymentStatus(orderNumber: string) {
  const isLoading = ref(true);
  const isRetrying = ref(false);
  const paymentStatus = ref<PaymentStatus>("PENDING");

  let pollingTimer: number | null = null;

  // 查詢付款狀態函式
  async function fetchPaymentStatus() {
    try {
      const response = await axios.get("/pay/ecpay/getPaymentByOrderNumber", {
        params: { orderNumber },
      });

      const result = paymentSchema.safeParse(response.data.data);

      if (result.success) {
        const status = result.data.status;
        if (status === "PAID") {
          paymentStatus.value = "PAID";
          stopPolling();
        } else if (status === "EXPIRED") {
          paymentStatus.value = "EXPIRED";
          stopPolling();
        } else {
          paymentStatus.value = "PENDING";
        }
      } else {
        paymentStatus.value = "UNKNOWN";
      }
    } catch (err) {
      console.error("查詢付款狀態失敗:", err);
      paymentStatus.value = "UNKNOWN";
    } finally {
      isLoading.value = false;
    }
  }

  // 重新查詢（手動）
  async function retryCheck() {
    if (isRetrying.value) return;
    isRetrying.value = true;
    await fetchPaymentStatus();
    isRetrying.value = false;
  }

  // 啟動輪詢
  function startPolling() {
    pollingTimer = window.setInterval(fetchPaymentStatus, 10000);
  }

  // 停止輪詢
  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  }

  onMounted(() => {
    if (!orderNumber) {
      paymentStatus.value = "UNKNOWN";
      isLoading.value = false;
      return;
    }
    fetchPaymentStatus(); // 第一次查詢
    startPolling(); // 啟動輪詢
  });

  onUnmounted(() => {
    stopPolling();
  });

  return {
    isLoading,
    isRetrying,
    paymentStatus,
    retryCheck,
  };
}
