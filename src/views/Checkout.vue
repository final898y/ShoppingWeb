<template>
  <div class="min-h-[calc(100vh-16rem)] p-6 bg-base-100">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-2xl font-bold mb-6">訂單資料填寫</h1>

      <!-- 商品清單 -->
      <div class="card bg-base-100 shadow-xl border border-base-300 mb-6">
        <div class="card-body">
          <h2 class="text-lg font-semibold mb-4">訂單商品</h2>

          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex items-center gap-4 py-4 border-b border-base-200 last:border-b-0 hover:shadow-lg transition-shadow duration-300"
          >
            <!-- 商品圖片 -->
            <router-link
              :to="`/product/${item.id}`"
              :aria-label="`查看 ${item.name} 詳情`"
            >
              <figure
                class="w-24 h-24 overflow-hidden rounded-lg bg-base-200 flex justify-center items-center"
              >
                <img
                  :src="item.image_url || '/NoImage.png'"
                  :alt="`${item.name} 商品圖片`"
                  class="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  @error="item.image_url = '/NoImage.png'"
                />
              </figure>
            </router-link>

            <div class="flex-1">
              <router-link
                :to="`/product/${item.id}`"
                class="text-base font-medium hover:text-primary transition-colors"
                :aria-label="`查看 ${item.name} 詳情`"
              >
                {{ item.name }}
              </router-link>
              <p class="text-sm">單價：${{ item.price }}</p>
              <p class="text-sm">數量：{{ item.quantity }}</p>
              <p class="text-sm font-bold">
                小計：${{ (item.price * item.quantity).toFixed(2) }}
              </p>
            </div>
          </div>

          <div class="text-right mt-4">
            <p class="text-lg font-bold">
              總金額：${{ cartStore.totalPrice.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- 訂單表單 -->
      <div class="card bg-base-100 shadow-xl border border-base-300">
        <div class="card-body">
          <h2 class="text-lg font-semibold mb-4">收件人資訊</h2>
          <div class="grid gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">
                  收件人姓名 <span class="text-error">*</span>
                </span>
              </label>
              <input
                ref="nameInput"
                type="text"
                v-model="formData.name"
                class="input input-bordered w-full"
                placeholder="請輸入姓名"
                :class="{ 'input-error': errors.name }"
              />
              <span v-if="errors.name" class="text-error text-sm mt-1">{{
                errors.name
              }}</span>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">
                  聯繫電話 <span class="text-error">*</span>
                </span>
              </label>
              <input
                type="tel"
                v-model="formData.phone"
                class="input input-bordered w-full"
                placeholder="請輸入電話號碼"
                :class="{ 'input-error': errors.phone }"
              />
              <span v-if="errors.phone" class="text-error text-sm mt-1">{{
                errors.phone
              }}</span>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">
                  收件地址 <span class="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                v-model="formData.address"
                class="input input-bordered w-full"
                placeholder="請輸入完整地址"
                :class="{ 'input-error': errors.address }"
              />
              <span v-if="errors.address" class="text-error text-sm mt-1">{{
                errors.address
              }}</span>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">
                  電子郵件 <span class="text-error">*</span>
                </span>
              </label>
              <input
                type="email"
                v-model="formData.email"
                class="input input-bordered w-full"
                placeholder="請輸入電子郵件"
                :class="{ 'input-error': errors.email }"
              />
              <span v-if="errors.email" class="text-error text-sm mt-1">{{
                errors.email
              }}</span>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">備註</span>
              </label>
              <textarea
                v-model="formData.notes"
                class="textarea textarea-bordered w-full"
                placeholder="選填，例如送貨時間要求"
              ></textarea>
            </div>
          </div>

          <div class="card-actions justify-end mt-6">
            <button class="btn btn-primary" @click="confirmOrder">
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { useToast } from "@/composables/useToast";

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();
const nameInput = ref<HTMLInputElement | null>(null);

// 導入全域 toast 功能
const toast = useToast();

// 表單資料
const formData = reactive({
  name: "",
  phone: "",
  address: "",
  email: "",
  notes: "",
});

onMounted(() => {
  orderStore.loadFromStorage();
  Object.assign(formData, orderStore.formData);
  nextTick(() => nameInput.value?.focus());
});

const errors = reactive({
  name: "",
  phone: "",
  address: "",
  email: "",
});

// 表單驗證
const validateForm = () => {
  let isValid = true;

  errors.name = formData.name.trim() ? "" : "請輸入收件人姓名";
  errors.phone = formData.phone.trim() ? "" : "請輸入聯繫電話";
  errors.address = formData.address.trim() ? "" : "請輸入收件地址";
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ? ""
    : "請輸入有效的電子郵件";

  if (errors.name || errors.phone || errors.address || errors.email) {
    isValid = false;
    toast.showToast("請填寫所有必填欄位並確保格式正確", "warning");
  }

  return isValid;
};

// 確認訂單
const confirmOrder = () => {
  if (!validateForm()) return;

  orderStore.formData = JSON.parse(JSON.stringify(formData));
  orderStore.cartItems = JSON.parse(JSON.stringify(cartStore.items));
  orderStore.totalPrice = cartStore.totalPrice;

  router.push("/checkoutconfirm");
};
</script>
