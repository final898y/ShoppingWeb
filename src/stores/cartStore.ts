import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "@/utils/axios";
import { CartItem, ClearCartResult } from "@/models/cartOrderModel";

export const useCartStore = defineStore("cart", () => {
  // 狀態
  const items = ref<CartItem[]>([]);

  // 計算屬性
  const totalPrice = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  });

  // 方法（動作）
  async function addItem(item: CartItem) {
    try {
      const cartItemData = {
        productId: item.id,
        quantity: item.quantity,
        userUuid: "19de471a-2391-4205-baa9-774a691ca256", // TODO: 動態取得
      };

      const response = await axios.post("/carts/addToCart", cartItemData);

      if (response.data.success) {
        const existingItem = items.value.find((i) => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          items.value.push({ ...item });
        }
        saveToLocalStorage();
        console.log("商品已成功加入購物車！");
      } else {
        console.error("加入購物車失敗，請稍後再試。");
      }
    } catch (error) {
      console.error("加入購物車錯誤:", error);
    }
  }

  async function loadFromServer(userUuid: string) {
    try {
      const response = await axios.get("/carts/getCart", {
        params: { userUuid },
      });

      const rawData = response.data?.data;

      if (response.data.success && Array.isArray(rawData)) {
        items.value = rawData.map((item: any) => {
          const product = item.products;
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            image_url: product.image_url ?? "",
          } satisfies CartItem;
        });
      } else {
        console.warn("購物車資料格式異常");
      }
    } catch (error) {
      console.error("無法載入購物車：", error);
    }
  }

  async function updateItemQuantity(productId: number, quantity: number) {
    try {
      const userUuid = "19de471a-2391-4205-baa9-774a691ca256"; // TODO: 動態取得
      const response = await axios.put("/carts/updateCartItem", {
        userUuid,
        productId,
        quantity,
      });

      if (response.data.success) {
        const item = items.value.find((i) => i.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }

      return response.data;
    } catch (error) {
      console.error("更新購物車項目失敗：", error);
      return {
        success: false,
        message: "更新失敗，請稍後再試",
      };
    }
  }

  async function removeItem(item: CartItem): Promise<ClearCartResult> {
    try {
      const productId = item.id;
      const userUuid = "19de471a-2391-4205-baa9-774a691ca256"; // TODO: 動態取得

      const response = await axios.delete(`/carts/${productId}`, {
        params: { userUuid },
      });

      if (response.data.success) {
        items.value = items.value.filter((i) => i.id !== item.id);
        saveToLocalStorage();
        return { success: true, message: "商品已從購物車移除！" };
      } else {
        return { success: false, message: "移除商品失敗，請稍後再試。" };
      }
    } catch (error) {
      console.error("移除商品錯誤:", error);
      return {
        success: false,
        message: "伺服器錯誤，無法移除商品，請稍後再試。",
      };
    }
  }

  async function clearCart(userUuid: string): Promise<ClearCartResult> {
    try {
      const response = await axios.delete("/carts/clearCart", {
        params: { userUuid },
      });

      if (response.data.success) {
        items.value = [];
        saveToLocalStorage();
        return { success: true, message: "購物車已清空！" };
      } else {
        return { success: false, message: "清空購物車失敗，請稍後再試。" };
      }
    } catch (error) {
      console.error("清空購物車錯誤:", error);
      return {
        success: false,
        message: "伺服器錯誤，無法清空購物車，請稍後再試。",
      };
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(items.value));
  }

  // 如果需要，可以加載 localStorage 內的購物車
  /*
  function loadFromLocalStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      items.value = JSON.parse(savedCart);
    }
  }
  */

  return {
    items,
    totalPrice,
    addItem,
    loadFromServer,
    updateItemQuantity,
    removeItem,
    clearCart,
    saveToLocalStorage,
    // loadFromLocalStorage,
  };
});
