

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
export enum UserRole {
  ADMIN,
  STAGIAIR,
  STAGEBEGELEIDER,
}

// Define the Role enum
export enum Role {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

// Define the User interface
export interface IUser {
  id: string;
  email: string;
  name: string;
  img?: string;
  hashedPassword?: string;
  role?: Role;
  orders?: IOrder[]; // List of orders associated with the user
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId?: number;
  quantity: number;
  price: number;
  name: string;
  category: string;
  image: string;
}

export interface IOrder {
  id: string;
  userId: string;
  items: IOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PaidOrder {
  id: string;
  userId: string;
  isPaid: boolean;
  totalAmount: number;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  orderDetails: IOrder[]; // Assuming orderDetails is an array of IOrder
}
