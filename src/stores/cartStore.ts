import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { z } from "zod";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  items: CartItem[];
}

interface ClearCartResult {
  success: boolean;
  message: string;
}

const AddToCartRequestSchema = z.object({
  userUuid: z.string().uuid(),
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1),
});

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
    async addItem(item: CartItem) {
      try {
        const cartItemData = {
          productId: item.id,
          quantity: item.quantity,
          userUuid: "19de471a-2391-4205-baa9-774a691ca256", // TODO: 應從認證 store 動態取得
        };

        const response = await axios.post("/carts/addToCart", cartItemData);

        if (response.data.success) {
          // 如果後端成功，將商品加入前端狀態
          const existingItem = this.items.find((i) => i.id === item.id);
          if (existingItem) {
            // 如果商品已存在，增加數量
            existingItem.quantity += item.quantity;
          } else {
            // 如果是新商品，加入購物車
            this.items.push({ ...item });
          }
          this.saveToLocalStorage();
          console.log("商品已成功加入購物車！");
        } else {
          console.error("加入購物車失敗，請稍後再試。");
        }
      } catch (error) {
        console.error("加入購物車錯誤:", error);
      }
    },
    async loadFromServer(userUuid: string) {
      try {
        const response = await axios.get("/carts/getCart", {
          params: { userUuid },
        });

        const rawData = response.data?.data;

        if (response.data.success && Array.isArray(rawData)) {
          this.items = rawData.map((item: any) => {
            const product = item.products;

            return {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: item.quantity,
              image_url: product.image_url ?? "", // 若為 null，預設為空字串
            } satisfies CartItem;
          });
        } else {
          console.warn("購物車資料格式異常");
        }
      } catch (error) {
        console.error("無法載入購物車：", error);
      }
    },
    async updateItemQuantity(productId: number, quantity: number) {
      try {
        const userUuid = "19de471a-2391-4205-baa9-774a691ca256";
        // 送出更新請求
        const response = await axios.put("/carts/updateCartItem", {
          userUuid,
          productId,
          quantity,
        });

        // 若成功，更新本地購物車資料
        if (response.data.success) {
          const item = this.items.find((i) => i.id === productId);
          if (item) {
            item.quantity = quantity;
          }
        }

        return response.data; // 包含 success、message 等資訊
      } catch (error) {
        console.error("更新購物車項目失敗：", error);
        return {
          success: false,
          message: "更新失敗，請稍後再試",
        };
      }
    },
    // 移除商品
    async removeItem(item: CartItem): Promise<ClearCartResult> {
      try {
        const productId = item.id;
        const userUuid = "19de471a-2391-4205-baa9-774a691ca256"; // TODO: 應從認證 store 動態取得

        const response = await axios.delete(
          `/carts/deleteCartItem/${productId}`,
          {
            params: { userUuid },
          }
        );

        if (response.data.success) {
          this.items = this.items.filter((i) => i.id !== item.id);
          this.saveToLocalStorage();
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
    },
    // 清空購物車
    async clearCart(userUuid: string): Promise<ClearCartResult> {
      try {
        z.string().uuid().parse(userUuid);

        const response = await axios.delete("/carts/clearCart", {
          params: { userUuid },
        });

        // 檢查後端回應是否成功
        if (response.data.success) {
          // 清空前端購物車狀態
          this.items = [];
          // 同步到 localStorage
          this.saveToLocalStorage();
          // 返回成功結果
          return { success: true, message: "購物車已清空！" };
        } else {
          // 返回失敗結果
          return { success: false, message: "清空購物車失敗，請稍後再試。" };
        }
      } catch (error) {
        // 處理錯誤並返回結果
        console.error("清空購物車錯誤:", error);
        return {
          success: false,
          message: "伺服器錯誤，無法清空購物車，請稍後再試。",
        };
      }
    },
    // 儲存到 localStorage
    saveToLocalStorage() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },
    // 從 localStorage 載入
    // loadFromLocalStorage() {
    //   const savedCart = localStorage.getItem("cart");
    //   if (savedCart) {
    //     this.items = JSON.parse(savedCart);
    //   }
    // },
  },
});
