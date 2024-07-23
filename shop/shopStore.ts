import { create } from 'zustand';
import { IOrder, IOrderItem } from '@/types';

// Updated IStore interface
export interface IStore {
  orderModal: boolean;
  toggleModal: boolean;
  orders: IOrder[];
  orderItem: IOrderItem;
  setOrders: (orders: IOrder[]) => void;
  setOrder: (orderItem: IOrderItem) => void;
  toggleOrderModal: () => void;
  updateOrderItemQuantity: (orderId: string, itemId: string, quantity: number) => void;
}

// Zustand store creation with updated types and default values
const useStagairStore = create<IStore>((set) => ({
  orderModal: false,
  toggleModal: false,
  orders: [], // Changed from single order to array of orders
  orderItem: {
    id: "",
    orderId: "",
    productId: 0, // Updated to match Product ID type
    quantity: 0,
    price: 0,
    name: "", // Added
    category: "", // Added
    image: "", // Added
  },
  setOrders: (orders) => set({ orders }),
  setOrder: (orderItem) => set({ orderItem }),
  toggleOrderModal: () => set((state) => ({ orderModal: !state.orderModal })),
  updateOrderItemQuantity: (orderId, itemId, quantity) => set((state) => {
    const orders = state.orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.map(item => 
            item.id === itemId ? { ...item, quantity } : item
          ),
        };
      }
      return order;
    });
    return { orders };
  }),
}));

export default useStagairStore;
