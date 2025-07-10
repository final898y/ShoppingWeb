import { inject } from "vue";

export type ToastType = "success" | "warning";

export interface ToastContext {
  showToast: (message: string, type?: ToastType) => void;
}

export const toastKey = Symbol("Toast");

export function useToast(): ToastContext {
  const ctx = inject<ToastContext>(toastKey);
  if (!ctx) {
    throw new Error("ToastContext not provided! 請確認 Toast 有被 App 提供");
  }
  return ctx;
}
