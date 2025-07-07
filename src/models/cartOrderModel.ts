export interface FormData {
  name: string;
  phone: string;
  address: string;
  email: string;
  notes?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface ClearCartResult {
  success: boolean;
  message: string;
}

export interface PaymentItem {
  orderNumber: string;
  MerchantTradeNo: string;
  amount: number;
}
