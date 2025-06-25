<template>
  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">訂單確認</h1>

      <div
        v-if="!formData || !cartItems.length"
        class="text-center text-base-content/80"
      >
        <p class="text-lg">無訂單資料，請重新填寫</p>
        <router-link to="/checkout" class="btn btn-primary mt-4"
          >返回填寫</router-link
        >
      </div>

      <div v-else>
        <div class="card bg-base-100 shadow-xl border border-base-300 mb-6">
          <div class="card-body">
            <h2 class="text-lg font-semibold mb-4">訂單商品</h2>
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex items-center gap-4 py-4 border-b border-base-200 last:border-b-0"
            >
              <img
                :src="item.image_url || '/NoImage.png'"
                :alt="item.name"
                class="w-16 h-16 object-cover rounded-lg"
                @error="item.image_url = '/NoImage.png'"
              />
              <div class="flex-1">
                <h3 class="text-base font-medium">{{ item.name }}</h3>
                <p class="text-sm">單價：${{ item.price }}</p>
                <p class="text-sm">數量：{{ item.quantity }}</p>
                <p class="text-sm font-bold">
                  小計：${{ (item.price * item.quantity).toFixed(2) }}
                </p>
              </div>
            </div>
            <div class="text-right mt-4">
              <p class="text-lg font-bold">
                總金額：${{ totalPrice.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl border border-base-300">
          <div class="card-body">
            <h2 class="text-lg font-semibold mb-4">收件人資訊</h2>
            <p class="text-sm">姓名：{{ formData.name }}</p>
            <p class="text-sm">電話：{{ formData.phone }}</p>
            <p class="text-sm">地址：{{ formData.address }}</p>
            <p class="text-sm">電子郵件：{{ formData.email }}</p>
            <p class="text-sm" v-if="formData.notes">
              備註：{{ formData.notes }}
            </p>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <router-link to="/checkout" class="btn btn-outline"
            >返回編輯</router-link
          >
          <button class="btn btn-primary" @click="proceedToPayment">
            進入付款
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";

const router = useRouter();
const orderStore = useOrderStore();

// onMounted 時載入資料
onMounted(() => {
  orderStore.loadFromStorage();
});

// 對應 template 用的 ref
const formData = orderStore.formData;
const cartItems = orderStore.cartItems;
const totalPrice = orderStore.totalPrice;

const proceedToPayment = () => {
  router.push("/payment");
};
</script>
