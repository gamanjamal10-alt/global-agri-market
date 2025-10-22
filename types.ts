
export type UserRole = 'Farmer' | 'Wholesaler' | 'Retailer' | 'Logistics';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  rating: number; // 1-5
  comment: string;
  timestamp: string;
}

export type ProductCategory = 'Vegetables' | 'Fruits' | 'Grains' | 'Dairy';

export interface Product {
  id: string;
  farmerId: string;
  name: string;
  category: ProductCategory;
  quantity: number; // in kg
  price: number; // per kg
  description: string;
  imageUrl: string;
  reviews: Review[];
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  orderDate: string;
  shippingAddress: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}
