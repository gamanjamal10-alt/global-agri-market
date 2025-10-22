
import { User, UserRole, Product, Order, OrderStatus, Shipment } from '../types';

// --- MOCK DATABASE ---
let users: User[] = [
  { id: 'user-1', name: 'John Appleseed', role: UserRole.FARMER, avatar: 'https://picsum.photos/seed/user1/200', rating: 4.8 },
  { id: 'user-2', name: 'Global Foods Inc.', role: UserRole.RETAILER, avatar: 'https://picsum.photos/seed/user2/200', rating: 4.5 },
  { id: 'user-3', name: 'Swift Logistics', role: UserRole.LOGISTICS, avatar: 'https://picsum.photos/seed/user3/200', rating: 4.9 },
];

let products: Product[] = [
  { id: 'prod-1', farmerId: 'user-1', name: 'Organic Tomatoes', quantity: 5000, price: 2.50, description: 'Fresh, ripe organic tomatoes from California. Perfect for sauces and salads.', imageUrl: 'https://picsum.photos/seed/tomato/800/600', category: 'Vegetable', location: 'California, USA' },
  { id: 'prod-2', farmerId: 'user-1', name: 'Hass Avocados', quantity: 8000, price: 3.10, description: 'Creamy and delicious Hass avocados. Ideal for guacamole or toast.', imageUrl: 'https://picsum.photos/seed/avocado/800/600', category: 'Fruit', location: 'California, USA' },
  { id: 'prod-3', farmerId: 'user-1', name: 'Sweet Corn', quantity: 10000, price: 0.80, description: 'Juicy and sweet corn on the cob, harvested at peak freshness.', imageUrl: 'https://picsum.photos/seed/corn/800/600', category: 'Vegetable', location: 'California, USA' },
];

let orders: Order[] = [
  { id: 'ord-1', productId: 'prod-1', buyerId: 'user-2', quantity: 500, totalPrice: 1250, status: OrderStatus.DELIVERED, orderDate: '2023-10-01', deliveryDate: '2023-10-05', shippingId: 'ship-1' },
  { id: 'ord-2', productId: 'prod-2', buyerId: 'user-2', quantity: 1000, totalPrice: 3100, status: OrderStatus.SHIPPED, orderDate: '2023-10-15', shippingId: 'ship-2' },
  { id: 'ord-3', productId: 'prod-3', buyerId: 'user-2', quantity: 200, totalPrice: 160, status: OrderStatus.PENDING, orderDate: '2023-10-20' },
];

let shipments: Shipment[] = [
    { id: 'ship-1', orderId: 'ord-1', logisticsId: 'user-3', status: 'Delivered', pickupDate: '2023-10-02', estimatedDelivery: '2023-10-05'},
    { id: 'ship-2', orderId: 'ord-2', logisticsId: 'user-3', status: 'In Transit', pickupDate: '2023-10-16', estimatedDelivery: '2023-10-19'},
];

// --- API FUNCTIONS ---
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// USER
export const getUserById = async (id: string): Promise<User | undefined> => {
  await simulateDelay(200);
  return users.find(u => u.id === id);
};

export const getUserIdByRole = (role: UserRole): string => {
    switch(role) {
        case UserRole.FARMER: return 'user-1';
        case UserRole.RETAILER: return 'user-2';
        case UserRole.LOGISTICS: return 'user-3';
    }
}

// PRODUCT
export const getAllProducts = async (): Promise<Product[]> => {
  await simulateDelay(500);
  return products;
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await simulateDelay(200);
  return products.find(p => p.id === id);
};

export const getProductsByFarmer = async (farmerId: string): Promise<Product[]> => {
  await simulateDelay(300);
  return products.filter(p => p.farmerId === farmerId);
};

export const addProduct = async (data: Omit<Product, 'id' | 'imageUrl'>): Promise<Product> => {
    await simulateDelay(600);
    const newProduct: Product = {
        ...data,
        id: `prod-${Date.now()}`,
        imageUrl: `https://picsum.photos/seed/${data.name.replace(/\s+/g, '')}/${Math.floor(Math.random() * 1000)}/800/600`,
    };
    products.push(newProduct);
    return newProduct;
}

// ORDER
export const getOrdersByFarmer = async (farmerId: string): Promise<Order[]> => {
  await simulateDelay(400);
  const farmerProducts = products.filter(p => p.farmerId === farmerId).map(p => p.id);
  return orders.filter(o => farmerProducts.includes(o.productId));
};

export const getOrdersByBuyer = async (buyerId: string): Promise<Order[]> => {
  await simulateDelay(400);
  return orders.filter(o => o.buyerId === buyerId);
};

export const getOrdersByStatus = async(status: OrderStatus): Promise<Order[]> => {
    await simulateDelay(300);
    return orders.filter(o => o.status === status);
}

export const createOrder = async (productId: string, buyerId: string, quantity: number): Promise<Order> => {
    await simulateDelay(800);
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error("Product not found");
    if (product.quantity < quantity) throw new Error("Not enough quantity available");
    
    product.quantity -= quantity;
    
    const newOrder: Order = {
        id: `ord-${Date.now()}`,
        productId,
        buyerId,
        quantity,
        totalPrice: product.price * quantity,
        status: OrderStatus.PENDING,
        orderDate: new Date().toISOString().split('T')[0],
    };
    orders.unshift(newOrder); // Add to beginning of array
    // Simulate farmer accepting the order after a delay
    setTimeout(() => {
        const order = orders.find(o => o.id === newOrder.id);
        if(order) order.status = OrderStatus.ACCEPTED;
    }, 5000);

    return newOrder;
};

// SHIPMENT
export const getShipmentsByLogistics = async (logisticsId: string): Promise<Shipment[]> => {
    await simulateDelay(400);
    return shipments.filter(s => s.logisticsId === logisticsId);
}

export const createShipment = async (orderId: string, logisticsId: string): Promise<Shipment> => {
    await simulateDelay(700);
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error("Order not found");
    if (order.status !== OrderStatus.ACCEPTED) throw new Error("Order not ready for shipment");

    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 1);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);

    const newShipment: Shipment = {
        id: `ship-${Date.now()}`,
        orderId,
        logisticsId,
        status: 'Awaiting Pickup',
        pickupDate: pickupDate.toISOString().split('T')[0],
        estimatedDelivery: deliveryDate.toISOString().split('T')[0],
    }
    shipments.push(newShipment);
    order.status = OrderStatus.SHIPPED;
    order.shippingId = newShipment.id;

    // Simulate transit and delivery
    setTimeout(() => {
        const shipment = shipments.find(s => s.id === newShipment.id);
        if(shipment) shipment.status = 'In Transit';
    }, 2 * 24 * 60 * 60 * 1000); // 2 days

    setTimeout(() => {
        const shipment = shipments.find(s => s.id === newShipment.id);
        if(shipment) shipment.status = 'Delivered';

        const relatedOrder = orders.find(o => o.id === orderId);
        if(relatedOrder) {
            relatedOrder.status = OrderStatus.DELIVERED;
            relatedOrder.deliveryDate = new Date().toISOString().split('T')[0];
        }
    }, 4 * 24 * 60 * 60 * 1000); // 4 days

    return newShipment;
}
