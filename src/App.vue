<template>
  <div class="min-h-screen flex flex-col">
    <Header class="bg-base-100 border-b-4 border-base-300 h-16" />

    <router-view />

    <Footer
      class="bg-base-300 sm:footer-horizontal text-neutral-content p-10"
    />

    <div class="bg-base-300 text-base-content text-center">
      <p>
        Copyright © {{ new Date().getFullYear() }} - All right reserved by ACME
        Industries Ltd
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>
