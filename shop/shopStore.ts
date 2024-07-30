import { create } from 'zustand';
import { IOrder, IOrderItem, IUser } from '@/types';


export interface IStore {
  orderModal: boolean;
  toggleModalDelete: boolean;
  orders: IOrder[];
  orderItem: IOrderItem;
  setOrders: (orders: IOrder[]) => void;
  setOrder: (orderItem: IOrderItem) => void;
  toggleOrderModal: () => void;
  toggleOrderModalDelete: () => void;
  updateOrderItemQuantity: (orderId: string, itemId: string, quantity: number) => void;
  user:IUser;
  updateUser: (oldEmail: string, newEmail: string, name: string) => void;
}

// Zustand store creation with updated types and default values
const useStagairStore = create<IStore>((set) => ({
  orderModal: false,
  toggleModalDelete: false,
  orders: [], 
  orderItem: {
    id: "",
    orderId: "",
    productId: 0,
    quantity: 0,
    price: 0,
    name: "", 
    category: "", 
    image: "",
  },
  user:{
    id:"",
    email:"",
    name:""
  },
  updateUser: (oldEmail, newEmail, name) => set((state) => {
    if (state.user && state.user.email === oldEmail) {
      return {
        user: {
          ...state.user,
          email: newEmail,
          name: name,
        },
      };
    }
    return state;
  }),
  setOrders: (orders) => set({ orders }),
  setOrder: (orderItem) => set({ orderItem }),
  toggleOrderModal: () => set((state) => ({ orderModal: !state.orderModal })),
  toggleOrderModalDelete: () => set((state) => ({ toggleModalDelete: !state.toggleModalDelete })),
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
