import z from "zod";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T; // optional，因為有些錯誤回應可能沒 data
  errordetail?: string;
  stack?: string;
};

export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.success === "boolean" &&
    typeof obj.message === "string" &&
    ("data" in obj || obj.data === undefined) && // 可選欄位的簡單驗證方式
    ("errordetail" in obj || obj.errordetail === undefined) &&
    ("stack" in obj || obj.stack === undefined)
  );
}

export function isApiResponseOfType<T>(
  obj: any,
  typeCheck: (value: any) => boolean
): obj is ApiResponse<T> {
  return (
    obj !== null &&
    typeof obj === "object" &&
    typeof obj.success === "boolean" &&
    typeof obj.message === "string" &&
    obj.data !== undefined && // Require data to be present
    typeCheck(obj.data) && // Ensure data passes typeCheck
    (obj.errordetail === undefined || typeof obj.errordetail === "string") &&
    (obj.stack === undefined || typeof obj.stack === "string")
  );
}

export type UserDataType = {
  mobilephone: string;
  email: string;
};

export function isUserData(data: any): data is UserDataType {
  return (
    data !== null &&
    data !== undefined &&
    typeof data === "object" &&
    typeof data.mobilephone === "string" &&
    typeof data.email === "string"
  );
}

// 定義訂單項目的類型
export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  image_url?: string;
  // 如果有其他商品相關資訊，也可以加在這裡
  product: {
    name: string;
  };
}

// 定義訂單主體的類型
export interface Order {
  id: string; // 訂單編號
  status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  createdAt: string; // 訂單建立時間的 ISO 字符串
  totalAmount: number;
  items: OrderItem[];
  // 可以根據需要添加更多欄位，例如：
  // shippingAddress: string;
  // recipientName: string;
}

export const ecPayBackendOutputSchema = z.object({
  CheckMacValue: z.string(),
  MerchantTradeNo: z.string(),
  MerchantID: z.string(),
  ReturnURL: z.string(),
  EncryptType: z.number(),
});

const AddToCartRequestSchema = z.object({
  userUuid: z.string().uuid(),
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1),
});
