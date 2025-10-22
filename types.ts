
export type UserRole = 'Farmer' | 'Retailer' | 'Logistics';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  description: string;
  imageUrl: string;
  farmerId: string;
  reviews?: Review[];
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  retailerId: string;
  farmerId: string;
  orderDate: string;
}

export interface ShippingOffer {
    id: string;
    logisticsCompanyId: string;
    orderId: string;
    price: number;
    estimatedDelivery: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string;
}
