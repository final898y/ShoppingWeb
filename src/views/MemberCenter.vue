<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100">
    <div class="card w-96 bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center mb-4">會員中心</h2>

        <div class="text-center mb-6">
          <div class="avatar">
            <div
              class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mx-auto"
            >
              <img
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                alt="User Avatar"
              />
            </div>
          </div>
          <h3 class="text-xl font-semibold mt-4">{{ username }}</h3>
          <p class="text-sm text-base-content/70">{{ email }}</p>
        </div>

        <div class="form-control">
          <button @click="handleLogout" class="btn btn-primary w-full">
            登出
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Mock user data (replace with actual user data from your auth system)
const username = ref<string>("使用者名稱");
const email = ref<string>("user@example.com");

const handleLogout = () => {
  // Add your logout logic here (e.g., clear token, reset auth state)
  console.log("User logged out");
  router.push("/login");
};
</script>
