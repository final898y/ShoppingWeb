import { defineStore } from "pinia";

// 定義購物車項目的 TypeScript 介面
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// 定義購物車狀態的介面
interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    items: [],
  }),
  getters: {
    // 計算總金額
    totalPrice: (state) => {
      return state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
  actions: {
    // 加入購物車
    addItem(item: CartItem) {
      const existingItem = this.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.items.push({ ...item });
      }
      this.saveToLocalStorage();
    },
    // 移除商品
    removeItem(id: number) {
      this.items = this.items.filter((item) => item.id !== id);
      this.saveToLocalStorage();
    },
    // 清空購物車
    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },
    // 儲存到 localStorage
    saveToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },
    // 從 localStorage 載入
    loadFromLocalStorage() {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    },
  },
});
