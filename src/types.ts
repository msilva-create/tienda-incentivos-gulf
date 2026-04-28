
export type Role = 'ADMIN' | 'COMMERCIAL';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  distributor: string;
  gallons: number;
  initialGallons: number;
  balance: number;
  initialBalance: number;
  role: Role;
  monthlyBalances?: Record<string, number>;
}

export interface DistributorData {
  name: string;
  commercials: User[];
  totalGallons: number;
  totalBalance: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  label?: string;
}

export type ViewState = 'dashboard' | 'catalog' | 'admin' | 'wishlist' | 'redeemed';

export type OrderStatus = 'Solicitud recibida' | 'En validación' | 'Aprobado' | 'En despacho' | 'Entregado';

export interface Order {
  id: string;
  recipientName: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  reference: string;
  observations: string;
  requestDate: string;
  distributor: string;
  commercial: string;
  productName: string;
  quantity: number;
  balanceBefore: number;
  discountedBalance: number;
  finalBalance: number;
  status: OrderStatus;
  productId: string;
  userEmail: string;
}

export interface RedeemedItem {
  id?: string;
  productId: string;
  productName: string;
  price: number;
  image?: string;
  date: string;
  userEmail: string;
  distributor: string;
}

export interface Redemption {
  userName: string;
  distributor: string;
  productName: string;
  value: number;
  date: Date;
}

export interface MonthlyRecord {
  id: string;
  userId: string;
  userName: string;
  distributor: string;
  month: string;
  gallonsSold: number;
  valuePerGallon: number;
  amountLoaded: number;
  redeemed: number;
  availableBalance: number;
  observations: string;
  date: string;
}
