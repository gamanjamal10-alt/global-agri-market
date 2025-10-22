
import { User, UserRole, Product, Order, OrderStatus, Review, ChatMessage } from '../types';

// --- MOCK DATA ---
const users: User[] = [
  { id: 'user-farmer-1', name: 'Green Valley Farms', role: 'Farmer', avatar: 'https://i.pravatar.cc/150?u=farmer1' },
  { id: 'user-retailer-1', name: 'FreshMart', role: 'Retailer', avatar: 'https://i.pravatar.cc/150?u=retailer1' },
  { id: 'user-logistics-1', name: 'SpeedyLogistics', role: 'Logistics', avatar: 'https://i.pravatar.cc/150?u=logistics1' },
  { id: 'user-farmer-2', name: 'Sunset Orchards', role: 'Farmer', avatar: 'https://i.pravatar.cc/150?u=farmer2' },
  { id: 'user-retailer-2', name: 'GrocerBox', role: 'Retailer', avatar: 'https://i.pravatar.cc/150?u=retailer2' },
];

let products: Product[] = [
  { id: 'prod-1', name: 'Organic Tomatoes', category: 'Vegetables', quantity: 500, price: 2.50, description: 'Fresh, ripe organic tomatoes, grown sustainably in the heart of the valley. Perfect for salads, sauces, and sandwiches.', imageUrl: 'https://images.unsplash.com/photo-1561155653-295af6667420?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', farmerId: 'user-farmer-1', reviews: [{id: 'rev-1', author: 'FreshMart', rating: 5, comment: 'Excellent quality and very fresh!', date: '2023-10-26'}]},
  { id: 'prod-2', name: 'Honeycrisp Apples', category: 'Fruits', quantity: 1200, price: 3.10, description: 'Crisp, juicy, and sweet Honeycrisp apples. A customer favorite for their delightful crunch and balanced flavor.', imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', farmerId: 'user-farmer-2', reviews: [] },
  { id: 'prod-3', name: 'Russet Potatoes', category: 'Vegetables', quantity: 2500, price: 1.20, description: 'Versatile Russet potatoes, ideal for baking, frying, or mashing. Consistently high quality and great taste.', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba657?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', farmerId: 'user-farmer-1', reviews: [{id: 'rev-2', author: 'GrocerBox', rating: 4, comment: 'Good potatoes, reliable supply.', date: '2023-10-25'}]},
  { id: 'prod-4', name: 'Sweet Corn', category: 'Vegetables', quantity: 800, price: 0.75, description: 'Sweet, tender corn on the cob. Harvested at peak freshness for maximum flavor.', imageUrl: 'https://images.unsplash.com/photo-1551754471-ddc2a043594a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600', farmerId: 'user-farmer-2', reviews: [] },
];

let orders: Order[] = [
    { id: 'ord-1', productId: 'prod-1', productName: 'Organic Tomatoes', quantity: 50, totalPrice: 125.00, status: 'Delivered', retailerId: 'user-retailer-1', farmerId: 'user-farmer-1', orderDate: '2023-10-20' },
    { id: 'ord-2', productId: 'prod-3', productName: 'Russet Potatoes', quantity: 200, totalPrice: 240.00, status: 'Shipped', retailerId: 'user-retailer-1', farmerId: 'user-farmer-1', orderDate: '2023-10-24' },
    { id: 'ord-3', productId: 'prod-2', productName: 'Honeycrisp Apples', quantity: 100, totalPrice: 310.00, status: 'Pending', retailerId: 'user-retailer-2', farmerId: 'user-farmer-2', orderDate: '2023-10-25' },
];

let chatMessages: ChatMessage[] = [
    { id: 'msg-1', senderId: 'user-retailer-1', receiverId: 'user-farmer-1', text: 'Hi, are the tomatoes ready for shipment?', timestamp: '2023-10-23T10:00:00Z' },
    { id: 'msg-2', senderId: 'user-farmer-1', receiverId: 'user-retailer-1', text: 'Yes, they are all packed and ready to go!', timestamp: '2023-10-23T10:02:00Z' },
    { id: 'msg-3', senderId: 'user-retailer-2', receiverId: 'user-farmer-2', text: 'Can I get a discount on a bulk order of apples?', timestamp: '2023-10-24T14:30:00Z' },
];

// --- API FUNCTIONS ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getUserIdByRole = (role: UserRole): string => {
    return users.find(u => u.role === role)?.id || users[0].id;
}

export const getUserById = async (id: string): Promise<User | undefined> => {
    await delay(300);
    return users.find(user => user.id === id);
};

export const getAllProducts = async (): Promise<Product[]> => {
    await delay(500);
    return products;
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    await delay(400);
    return products.find(p => p.id === id);
}

export const addProduct = async (productData: Omit<Product, 'id' | 'reviews'>): Promise<Product> => {
    await delay(600);
    const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        reviews: [],
    };
    products = [newProduct, ...products];
    return newProduct;
}

export const getOrdersByUserId = async (userId: string, role: UserRole): Promise<Order[]> => {
    await delay(500);
    if (role === 'Farmer') return orders.filter(o => o.farmerId === userId);
    if (role === 'Retailer') return orders.filter(o => o.retailerId === userId);
    // Logistics might see orders they are assigned to, simplified for now
    if (role === 'Logistics') return orders.filter(o => o.status === 'Shipped' || o.status === 'Pending');
    return [];
};

export const placeOrder = async (orderData: Omit<Order, 'id' | 'status' | 'orderDate'>): Promise<Order> => {
    await delay(700);
    const newOrder: Order = {
        ...orderData,
        id: `ord-${Date.now()}`,
        status: 'Pending',
        orderDate: new Date().toISOString().split('T')[0],
    };
    orders.unshift(newOrder);
    return newOrder;
}

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order | undefined> => {
    await delay(300);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        return orders[orderIndex];
    }
    return undefined;
}

// --- NEW MOCK FUNCTIONS ---

export const getChatContacts = async (userId: string): Promise<User[]> => {
    await delay(300);
    const contactIds = new Set<string>();
    chatMessages.forEach(msg => {
        if (msg.senderId === userId) contactIds.add(msg.receiverId);
        if (msg.receiverId === userId) contactIds.add(msg.senderId);
    });
    return users.filter(user => contactIds.has(user.id));
}

export const getChatMessages = async (userId: string, contactId: string): Promise<ChatMessage[]> => {
    await delay(400);
    return chatMessages
        .filter(msg => 
            (msg.senderId === userId && msg.receiverId === contactId) ||
            (msg.senderId === contactId && msg.receiverId === userId)
        )
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export const sendChatMessage = async (senderId: string, receiverId: string, text: string): Promise<ChatMessage> => {
    await delay(200);
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

export const addReview = async (productId: string, author: string, rating: number, comment: string): Promise<Review> => {
    await delay(500);
    const newReview: Review = {
        id: `rev-${Date.now()}`,
        author,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0],
    };
    const product = products.find(p => p.id === productId);
    if (product) {
        product.reviews = product.reviews ? [newReview, ...product.reviews] : [newReview];
    }
    return newReview;
}

export const getShipmentStatus = async (orderId: string) => {
    await delay(600);
    // Simulate tracking data based on a hash of the orderId for consistency
    const hash = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const statuses = [
        { status: 'Order Placed', location: 'Green Valley Farms', timestamp: '2023-10-24T09:00:00Z' },
        { status: 'Picked Up by Carrier', location: 'Green Valley Farms', timestamp: '2023-10-24T14:00:00Z' },
    ];
    if (hash % 3 === 0) {
        statuses.push({ status: 'In Transit', location: 'Central Distribution Hub', timestamp: '2023-10-25T03:00:00Z' });
    }
     if (hash % 2 === 0) {
        statuses.push({ status: 'Out for Delivery', location: 'City Warehouse', timestamp: '2023-10-26T08:00:00Z' });
    }
    return {
        currentLocation: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
        estimatedDelivery: '2023-10-27',
        history: statuses,
    };
}
