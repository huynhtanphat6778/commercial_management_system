// =====================================================================
// Cac "enum" cua he thong.
// SQL Server + Prisma khong co enum that, nen cac cot nay la String trong
// schema.prisma va duoc chan bang CHECK trong prisma/sql/constraints.sql.
// Danh sach duoi day PHAI khop voi CHECK (co test tests/enums.test.ts kiem tra).
// =====================================================================

export const USER_STATUS = ["ACTIVE", "DISABLED"] as const;
export const PRODUCT_STATUS = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
export const ORDER_CHANNEL = ["ONLINE", "POS"] as const;
export const ORDER_STATUS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"] as const;
export const PAYMENT_METHOD = ["COD", "CASH", "ONLINE"] as const;
// Trang thai thanh toan DOC LAP voi trang thai don hang
export const PAYMENT_STATUS = ["UNPAID", "PENDING", "PAID", "FAILED", "PARTIALLY_REFUNDED", "REFUNDED"] as const;
export const RESERVATION_STATUS = ["ACTIVE", "CONVERTED", "RELEASED", "EXPIRED"] as const;
export const STOCK_MOVEMENT_TYPE = ["RECEIPT", "SALE", "RETURN_RESTOCK", "ADJUSTMENT"] as const;
export const PURCHASE_ORDER_STATUS = ["DRAFT", "SENT", "PARTIALLY_RECEIVED", "RECEIVED", "CANCELLED"] as const;
export const SHIPMENT_STATUS = ["PENDING", "SHIPPED", "DELIVERED", "FAILED", "RETURNED"] as const;
export const RETURN_STATUS = ["REQUESTED", "APPROVED", "RECEIVED", "INSPECTED", "REFUNDED", "REJECTED"] as const;
export const RETURN_CONDITION = ["PENDING_INSPECTION", "RESELLABLE", "DEFECTIVE"] as const;
export const REFUND_STATUS = ["PENDING", "COMPLETED", "FAILED"] as const;

export type UserStatus = (typeof USER_STATUS)[number];
export type ProductStatus = (typeof PRODUCT_STATUS)[number];
export type OrderChannel = (typeof ORDER_CHANNEL)[number];
export type OrderStatus = (typeof ORDER_STATUS)[number];
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];
export type ReservationStatusValue = (typeof RESERVATION_STATUS)[number];
export type StockMovementType = (typeof STOCK_MOVEMENT_TYPE)[number];
export type PurchaseOrderStatus = (typeof PURCHASE_ORDER_STATUS)[number];
export type ShipmentStatus = (typeof SHIPMENT_STATUS)[number];
export type ReturnStatus = (typeof RETURN_STATUS)[number];
export type ReturnCondition = (typeof RETURN_CONDITION)[number];
export type RefundStatus = (typeof REFUND_STATUS)[number];
