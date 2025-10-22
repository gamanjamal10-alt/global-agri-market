
export enum UserRole {
  FARMER = 'farmer',
  RETAILER = 'retailer',
  LOGISTICS = 'logistics',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  rating: number;
}

export interface Product {
  id: string;
  farmerId: string;
  name:string;
  quantity: number; // in kg
  price: number; // per kg
  description: string;
  imageUrl: string;
  category: string;
  location: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  shippingId?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  logisticsId: string;
  status: 'Awaiting Pickup' | 'In Transit' | 'Delivered';
  pickupDate: string;
  estimatedDelivery: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}
