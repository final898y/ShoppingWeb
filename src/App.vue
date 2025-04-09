<template>
  <div class="min-h-screen flex flex-col">
    <Header class="bg-base-100 border-b-4 border-base-300 h-16" />

    <!-- Drawer for Responsive Aside -->
    <div class="drawer md:drawer-open @container">
      <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
      <div
        class="drawer-content md:border-l-4 border-base-300 min-h-[calc(100vh-16rem)]"
      >
        <!-- Main Content -->
        <label
          for="drawer-toggle"
          class="btn btn-primary drawer-button md:hidden m-4 w-full"
        >
          Menu
        </label>
        <main class="flex-1 p-6 bg-base-100">
          <router-view />
        </main>
      </div>
      <div class="drawer-side">
        <label for="drawer-toggle" class="drawer-overlay"></label>
        <Aside
          class="p-4 bg-base-100 w-64 md:p-6 max-md:w-64 min-h-[calc(100vh)]"
        />
      </div>
    </div>

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
import Aside from "./components/Aside.vue";
import Footer from "./components/Footer.vue";
</script>
