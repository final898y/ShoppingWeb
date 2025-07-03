<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] w-auto max-w-sm" v-if="show">
      <div
        class="alert shadow-lg px-4 py-3 flex items-center justify-center text-sm font-medium"
        :class="toastClass"
      >
        <span>{{ message }}</span>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ToastType } from "@/composables/useToast";

const show = ref(false);
const message = ref("");
const type = ref<ToastType>("success");

function showToast(payload: { message: string; type: ToastType }) {
  message.value = payload.message;
  type.value = payload.type;
  show.value = true;

  setTimeout(() => {
    show.value = false;
  }, 3000);
}

const toastClass = computed(() =>
  type.value === "success"
    ? "bg-success text-success-content"
    : "bg-warning text-warning-content"
);

defineExpose({ showToast });
</script>
