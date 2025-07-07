import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axios from "@/utils/axios";
import type { Order } from "@/models/backendApiModel";
import { PaymentItem } from "@/models/cartOrderModel";

export const usePaymentStore = defineStore("payment", () => {
  const paymentItemList = ref<PaymentItem>({
    orderNumber: "",
    MerchantTradeNo: "",
    amount: 0,
  });
});
