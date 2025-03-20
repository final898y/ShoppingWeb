<template>
  <div class="min-h-screen flex flex-col">
    <Header class="bg-base-100 border-b-4 border-base-300 h-16" />

    <div class="flex flex-1">
      <Aside
        class="p-4 md:p-6 hidden md:block bg-base-100 border-r-4 border-base-300 w-1/6"
      />
      <main class="flex-1 p-6 bg-base-100">
        <router-view />
      </main>
    </div>

    <Footer
      class="bg-base-300 footer sm:footer-horizontal text-neutral-content p-10"
    />

    <div class="bg-base-300 text-base-content text-center">
      <div>
        <p>
          Copyright © {{ new Date().getFullYear() }} - All right reserved by
          ACME Industries Ltd
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import Aside from "./components/Aside.vue";
import Footer from "./components/Footer.vue";
</script>

<style scoped>
/* 若需要額外自訂樣式 */
</style>
