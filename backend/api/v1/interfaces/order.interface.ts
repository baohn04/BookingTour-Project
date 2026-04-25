// ===== Shared Order Interfaces =====

export interface OrderInfo {
  fullName: string;
  phone: string;
  note?: string;
}

export interface OrderItem {
  tourId: string;
  quantity: number;
}

export interface OrderRequest {
  info: OrderInfo;
  paymentMethod: string;
  totalAmount: number;
  cart: OrderItem[];
}

export interface BaseOrderItem {
  orderId: string;
  tourId: string;
  quantity: number;
  price: number;
  discount: number;
  timeStart: Date;
}

export interface CartItem {
  tourId: string;
  quantity: number;
  info?: any;
  image?: string;
  price_special?: number;
  total?: number;
}

export interface OrderSuccessQuery {
  orderCode?: string;
  orderInfo?: string;
}
