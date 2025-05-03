import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCounterStore = defineStore("loginuser", () => {
  const mobilephone = ref("");
  const email = ref("");
  const isregistered = ref(false);
  const resultmessage = ref("");

  return { mobilephone, email, isregistered, resultmessage };
});
