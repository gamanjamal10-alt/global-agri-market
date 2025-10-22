
import { User, UserRole, Product, Order, OrderStatus, ChatMessage, Review } from '../types';

// --- MOCK DATABASE ---

const users: User[] = [
  { id: 'user-farmer-1', name: 'John Appleseed', role: 'Farmer', avatar: 'https://i.pravatar.cc/150?u=user-farmer-1' },
  { id: 'user-wholesaler-1', name: 'Global Produce Inc.', role: 'Wholesaler', avatar: 'https://i.pravatar.cc/150?u=user-wholesaler-1' },
  { id: 'user-retailer-1', name: 'FreshMart', role: 'Retailer', avatar: 'https://i.pravatar.cc/150?u=user-retailer-1' },
  { id: 'user-logistics-1', name: 'Swift Logistics', role: 'Logistics', avatar: 'https://i.pravatar.cc/150?u=user-logistics-1' },
  { id: 'user-farmer-2', name: 'Maria Garcia', role: 'Farmer', avatar: 'https://i.pravatar.cc/150?u=user-farmer-2' },
  { id: 'user-retailer-2', name: 'Corner Grocer', role: 'Retailer', avatar: 'https://i.pravatar.cc/150?u=user-retailer-2' },
];

const reviews: { [productId: string]: Review[] } = {
    'prod-1': [
        { id: 'rev-1', userId: 'user-retailer-1', userName: 'FreshMart', avatar: 'https://i.pravatar.cc/150?u=user-retailer-1', rating: 5, comment: 'Excellent quality tomatoes, very fresh!', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'rev-2', userId: 'user-retailer-2', userName: 'Corner Grocer', avatar: 'https://i.pravatar.cc/150?u=user-retailer-2', rating: 4, comment: 'Good product, arrived on time.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    'prod-2': [
        { id: 'rev-3', userId: 'user-wholesaler-1', userName: 'Global Produce Inc.', avatar: 'https://i.pravatar.cc/150?u=user-wholesaler-1', rating: 5, comment: 'Sweetest strawberries of the season.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    ]
};


const products: Product[] = [
  { id: 'prod-1', farmerId: 'user-farmer-1', name: 'Organic Tomatoes', category: 'Vegetables', quantity: 500, price: 2.50, description: 'Vine-ripened organic tomatoes, bursting with flavor. Perfect for salads, sauces, and sandwiches. Grown with care and sustainable practices.', imageUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=800', reviews: reviews['prod-1'] || [] },
  { id: 'prod-2', farmerId: 'user-farmer-2', name: 'Fresh Strawberries', category: 'Fruits', quantity: 300, price: 4.00, description: 'Juicy, sweet strawberries picked at the peak of ripeness. A delightful treat on their own or in desserts.', imageUrl: 'https://images.unsplash.com/photo-1587393855524-7ab1f96a9340?q=80&w=800', reviews: reviews['prod-2'] || [] },
  { id: 'prod-3', farmerId: 'user-farmer-1', name: 'Whole Wheat Grain', category: 'Grains', quantity: 1000, price: 1.20, description: 'High-quality whole wheat grain, ideal for milling into flour for bread, pasta, and baked goods. Rich in fiber and nutrients.', imageUrl: 'https://images.unsplash.com/photo-1503427332918-a0359f481a7a?q=80&w=800', reviews: [] },
  { id: 'prod-4', farmerId: 'user-farmer-2', name: 'Farm-Fresh Milk', category: 'Dairy', quantity: 150, price: 1.50, description: 'Creamy and delicious whole milk from grass-fed cows. Non-homogenized and pasteurized for safety and flavor.', imageUrl: 'https://images.unsplash.com/photo-1563636619-e93479934273?q=80&w=800', reviews: [] },
  { id: 'prod-5', farmerId: 'user-farmer-1', name: 'Crisp Lettuce Heads', category: 'Vegetables', quantity: 400, price: 1.80, description: 'Fresh and crisp lettuce, perfect for creating healthy and vibrant salads.', imageUrl: 'https://images.unsplash.com/photo-1615485925332-f3c54b68e54a?q=80&w=800', reviews: [] },
];

let orders: Order[] = [
  { id: 'order-1', productId: 'prod-1', productName: 'Organic Tomatoes', productImageUrl: products[0].imageUrl, buyerId: 'user-retailer-1', sellerId: 'user-farmer-1', quantity: 100, totalPrice: 250, status: 'Shipped', orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), shippingAddress: '123 Fresh St, Food City' },
  { id: 'order-2', productId: 'prod-3', productName: 'Whole Wheat Grain', productImageUrl: products[2].imageUrl, buyerId: 'user-wholesaler-1', sellerId: 'user-farmer-1', quantity: 500, totalPrice: 600, status: 'Delivered', orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), shippingAddress: '456 Grain Ave, Metroburg' },
  { id: 'order-3', productId: 'prod-2', productName: 'Fresh Strawberries', productImageUrl: products[1].imageUrl, buyerId: 'user-retailer-1', sellerId: 'user-farmer-2', quantity: 50, totalPrice: 200, status: 'Pending', orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), shippingAddress: '123 Fresh St, Food City' },
];

let chatMessages: ChatMessage[] = [
    { id: 'msg-1', senderId: 'user-retailer-1', receiverId: 'user-farmer-1', text: 'Hi John, are the tomatoes ready for shipment?', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'msg-2', senderId: 'user-farmer-1', receiverId: 'user-retailer-1', text: 'Yes, FreshMart! They are on their way. Order #order-1.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];


// --- API FUNCTIONS ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getUserById = async (id: string): Promise<User | null> => {
  await delay(200);
  return users.find(u => u.id === id) || null;
};

export const getUserIdByRole = (role: UserRole): string => {
    return users.find(u => u.role === role)!.id;
}

export const getAllProducts = async (): Promise<Product[]> => {
  await delay(500);
  return products;
};

export const getProductById = async (id: string): Promise<Product | null> => {
    await delay(300);
    return products.find(p => p.id === id) || null;
}

export const addProduct = async (productData: Omit<Product, 'id' | 'reviews'>): Promise<Product> => {
    await delay(400);
    const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        reviews: [],
    };
    products.unshift(newProduct);
    return newProduct;
}

export const getOrdersByUserId = async (userId: string, role: UserRole): Promise<Order[]> => {
    await delay(600);
    if (role === 'Farmer') return orders.filter(o => o.sellerId === userId).sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    if (role === 'Wholesaler' || role === 'Retailer') return orders.filter(o => o.buyerId === userId).sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    if (role === 'Logistics') return orders.filter(o => o.status === 'Shipped' || o.status === 'Delivered').sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    return [];
}

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order | null> => {
    await delay(300);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
        orders[orderIndex].status = status;
        return { ...orders[orderIndex] };
    }
    return null;
}

export const getChatContacts = async (userId: string): Promise<User[]> => {
    await delay(400);
    const contactIds = new Set<string>();
    chatMessages.forEach(msg => {
        if (msg.senderId === userId) contactIds.add(msg.receiverId);
        if (msg.receiverId === userId) contactIds.add(msg.senderId);
    });
    // Add all farmers for non-farmers, and all non-farmers for farmers as potential contacts
    const user = await getUserById(userId);
    if (user?.role === 'Farmer') {
        users.forEach(u => u.role !== 'Farmer' && contactIds.add(u.id));
    } else {
        users.forEach(u => u.role === 'Farmer' && contactIds.add(u.id));
    }
    
    return users.filter(u => contactIds.has(u.id));
}

export const getChatMessages = async (userId1: string, userId2: string): Promise<ChatMessage[]> => {
    await delay(200);
    return chatMessages.filter(msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
    ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export const sendChatMessage = async (senderId: string, receiverId: string, text: string): Promise<ChatMessage> => {
    await delay(100);
    const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId,
        receiverId,
        text,
        timestamp: new Date().toISOString(),
    };
    chatMessages.push(newMessage);
    return newMessage;
}

export const getShipmentStatus = async (orderId: string) => {
    await delay(700);
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;
    // Simulate tracking data
    const history = [
        { status: 'Order Placed', location: 'Origin Warehouse', timestamp: order.orderDate }
    ];
    if (order.status === 'Shipped' || order.status === 'Delivered') {
        history.push({ status: 'Shipped', location: 'Origin Hub', timestamp: new Date(new Date(order.orderDate).getTime() + 24*60*60*1000).toISOString() });
    }
     if (order.status === 'Delivered') {
        history.push({ status: 'Out for Delivery', location: 'Destination Hub', timestamp: new Date(new Date(order.orderDate).getTime() + 48*60*60*1000).toISOString() });
        history.push({ status: 'Delivered', location: order.shippingAddress, timestamp: new Date(new Date(order.orderDate).getTime() + 52*60*60*1000).toISOString() });
    }
    
    return {
        currentLocation: { lat: 34.0522, lng: -118.2437 }, // Mock location (Los Angeles)
        estimatedDelivery: new Date(new Date(order.orderDate).getTime() + 5 * 24 * 60 * 60 * 1000).toDateString(),
        history: history.reverse()
    }
}
