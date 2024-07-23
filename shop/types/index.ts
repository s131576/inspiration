

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

// Define the Order interface
export interface IOrder {
  id: string;
  userId: string;
  user?: IUser;
  items: IOrderItem[]; 
  createdAt: string;
  updatedAt: string; 
}

// Define the OrderItem interface
export interface IOrderItem {
  id: string;
  orderId: string;
  order?: IOrder;
  productId?: number;
  quantity: number;
  price: number;
  name: string;
  category: string;
  image: string; 
}
