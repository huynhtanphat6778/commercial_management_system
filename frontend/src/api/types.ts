export type PaymentMethod = 'COD' | 'ONLINE';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED';

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  sku: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  artworkColor: string;
  tag?: string;
  variants: ProductVariant[];
}

export interface CartLine {
  id: string;
  productId: string;
  productName: string;
  color: string;
  size: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  items: CartLine[];
  subtotal: number;
  shippingFee: number | null;
  total: number;
}

export interface Order {
  id: string;
  code: string;
  placedAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  total: number;
  expiresAt: string | null;
  itemSummary: string;
  shippingStatus: string | null;
}

export interface InventoryItem {
  sku: string;
  productName: string;
  variant: string;
  onHand: number;
  reserved: number;
  available: number;
  stockStatus: string;
}

export interface AdminMetrics {
  ordersToday: number;
  activeReservations: number;
  lowStockCount: number;
  netRevenue: number;
  cogs: number;
  grossProfit: number;
}

export interface PurchaseOrder {
  code: string;
  supplier: string;
  receivedAt: string;
  status: string;
  total: number;
}

export interface ReportProduct {
  name: string;
  units: number;
  netRevenue: number;
  sharePercent: number;
}

export interface BusinessReport {
  periodLabel: string;
  netRevenue: number;
  cogs: number;
  grossProfit: number;
  products: ReportProduct[];
}

export interface PosSession {
  status: 'OPEN' | 'CLOSED';
  openedAt: string | null;
  openingCash: number | null;
}

export interface PosProduct {
  productId: string;
  name: string;
  sku: string;
  variant: string;
  price: number;
  stockLabel: string;
}

export interface PosCartLine extends PosProduct {
  quantity: number;
  lineTotal: number;
}

export interface PosCart {
  items: PosCartLine[];
  total: number;
}

export interface PosReceipt {
  code: string;
  paidAt: string;
  paymentMethod: 'CASH';
  total: number;
}

export interface StaffProfile {
  displayName: string;
  role: 'Administrator' | 'Manager' | 'Sales Staff' | 'Warehouse Staff';
}
