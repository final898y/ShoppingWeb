<template>
  <!-- 根元素是 span，依 status 加上不同背景色 -->
  <span
    :class="[
      'flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium',
      'text-' + textColor,
      badgeClass,
    ]"
  >
    <img v-if="iconPath" :src="iconPath" alt="icon" class="w-4 h-4" />
    <span>{{ label }}</span>
    <!-- 只有 status 是 checking 時，顯示轉圈圈動畫 SVG -->
    <svg
      v-if="status === 'checking'"
      class="w-4 h-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>

    <!-- 顯示對應狀態的文字 -->
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  status: "online" | "offline" | "checking";
  label: string;
  iconPath: string;
}>();

// 狀態對應的顯示文字
const statusTextMap: Record<string, string> = {
  online: "運行中",
  offline: "離線",
  checking: "檢查中",
};

// 使用 DaisyUI 主題 class（會自動對應 grayblue theme 的實際顏色）
const statusClassMap: Record<string, string> = {
  online: "bg-success",
  offline: "bg-error",
  checking: "bg-info",
};

const textColorMap: Record<string, string> = {
  online: "success-content",
  offline: "error-content",
  checking: "info-content",
};

const statusText = computed(() => statusTextMap[props.status] ?? "未知");
const badgeClass = computed(() => statusClassMap[props.status] ?? "bg-neutral");
const textColor = computed(
  () => textColorMap[props.status] ?? "neutral-content"
);

console.log("HealthIndicator status:", props.status);
</script>

<style scoped>
/* 若有特別需要可於此自定 */
</style>
