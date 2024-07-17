// export interface Dimensions {
//   width: number;
//   height: number;
//   depth: number;
// }

// export interface Review {
//   rating: number;
//   comment: string;
//   date: string; // Date should ideally be represented as a Date object in TypeScript, but for simplicity, it's kept as string here.
//   reviewerName: string;
//   reviewerEmail: string;
// }

// export interface Meta {
//   createdAt: string; // Date should ideally be represented as a Date object in TypeScript, but for simplicity, it's kept as string here.
//   updatedAt: string; // Date should ideally be represented as a Date object in TypeScript, but for simplicity, it's kept as string here.
//   barcode: string;
//   qrCode: string;
// }

// export interface Product {
//   id: number;
//   title: string;
//   description: string;
//   category: string;
//   price: number;
//   discountPercentage: number;
//   rating: number;
//   stock: number;
//   tags: string[];
//   brand: string;
//   sku: string;
//   weight: number;
//   dimensions: Dimensions;
//   warrantyInformation: string;
//   shippingInformation: string;
//   availabilityStatus: string;
//   reviews: Review[];
//   returnPolicy: string;
//   minimumOrderQuantity: number;
//   meta: Meta;
//   images: string[];
//   thumbnail: string;
// }

// export interface ProductsResponse {
//   products: Product[];
// }

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
export interface IUser {
  id: string;
  name: string;
  email: string;
  img: string;
  createdAt: Date;
  role: UserRole;
  stagiairID: string;
}