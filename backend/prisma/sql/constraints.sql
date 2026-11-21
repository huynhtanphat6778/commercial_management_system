-- =====================================================================
-- Rang buoc bo sung cho SQL Server 2022 (T-SQL).
-- Prisma khong bieu dien duoc: CHECK, filtered unique index.
-- Cach dung: xem docs/HUONG_DAN_VSCODE.md, buoc 4 (dan vao migration --create-only).
-- Ten bang/cot khop voi schema.prisma (bang snake_case, cot camelCase).
-- Luu y: filtered index can SET QUOTED_IDENTIFIER ON (mac dinh cua Prisma/ODBC).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Ton kho: OnHand >= 0, Reserved >= 0, Reserved <= OnHand
-- ---------------------------------------------------------------------
ALTER TABLE [dbo].[inventory_balances] ADD
  CONSTRAINT [chk_balance_on_hand_non_negative] CHECK ([onHand] >= 0),
  CONSTRAINT [chk_balance_reserved_non_negative] CHECK ([reserved] >= 0),
  CONSTRAINT [chk_balance_reserved_lte_on_hand] CHECK ([reserved] <= [onHand]);

-- ---------------------------------------------------------------------
-- 2) FIFO cost layer: remaining khong am, khong vuot so luong nhan
-- ---------------------------------------------------------------------
ALTER TABLE [dbo].[inventory_cost_layers] ADD
  CONSTRAINT [chk_layer_received_positive] CHECK ([receivedQuantity] > 0),
  CONSTRAINT [chk_layer_remaining_non_negative] CHECK ([remainingQuantity] >= 0),
  CONSTRAINT [chk_layer_remaining_lte_received] CHECK ([remainingQuantity] <= [receivedQuantity]),
  CONSTRAINT [chk_layer_unit_cost_non_negative] CHECK ([unitCost] >= 0);

ALTER TABLE [dbo].[cost_layer_allocations] ADD
  CONSTRAINT [chk_alloc_quantity_positive] CHECK ([quantity] > 0),
  CONSTRAINT [chk_alloc_costs_non_negative] CHECK ([unitCost] >= 0 AND [totalCost] >= 0);

-- ---------------------------------------------------------------------
-- 3) So luong / so tien hop le
-- ---------------------------------------------------------------------
ALTER TABLE [dbo].[stock_reservation_items] ADD
  CONSTRAINT [chk_reservation_item_quantity_positive] CHECK ([quantity] > 0);

ALTER TABLE [dbo].[product_variants] ADD
  CONSTRAINT [chk_variant_price_non_negative] CHECK ([price] >= 0);

ALTER TABLE [dbo].[orders] ADD
  CONSTRAINT [chk_order_amounts_non_negative]
  CHECK ([subtotal] >= 0 AND [discountTotal] >= 0 AND [shippingFee] >= 0 AND [total] >= 0);

ALTER TABLE [dbo].[order_items] ADD
  CONSTRAINT [chk_order_item_quantity_positive] CHECK ([quantity] > 0),
  CONSTRAINT [chk_order_item_amounts_non_negative]
  CHECK ([unitPrice] >= 0 AND [discountAmount] >= 0 AND [lineTotal] >= 0);

ALTER TABLE [dbo].[purchase_order_items] ADD
  CONSTRAINT [chk_po_item_quantity_positive] CHECK ([orderedQuantity] > 0),
  CONSTRAINT [chk_po_item_cost_non_negative] CHECK ([expectedUnitCost] >= 0);

ALTER TABLE [dbo].[goods_receipt_items] ADD
  CONSTRAINT [chk_receipt_item_quantity_positive] CHECK ([receivedQuantity] > 0),
  CONSTRAINT [chk_receipt_item_cost_non_negative] CHECK ([actualUnitCost] >= 0);

ALTER TABLE [dbo].[payments] ADD
  CONSTRAINT [chk_payment_amount_non_negative] CHECK ([amount] >= 0);

ALTER TABLE [dbo].[refunds] ADD
  CONSTRAINT [chk_refund_amount_positive] CHECK ([amount] > 0);

ALTER TABLE [dbo].[return_items] ADD
  CONSTRAINT [chk_return_item_quantity_positive] CHECK ([quantity] > 0);

-- ---------------------------------------------------------------------
-- 4) "Enum" bang CHECK (khop voi backend/src/domain/enums.ts)
--    Dinh dang IN ('A','B',...) khong co khoang trang: test enums.test.ts doi chieu.
-- ---------------------------------------------------------------------
ALTER TABLE [dbo].[users] ADD
  CONSTRAINT [chk_users_status] CHECK ([status] IN ('ACTIVE','DISABLED'));

ALTER TABLE [dbo].[products] ADD
  CONSTRAINT [chk_products_status] CHECK ([status] IN ('DRAFT','ACTIVE','ARCHIVED'));

ALTER TABLE [dbo].[product_variants] ADD
  CONSTRAINT [chk_variants_status] CHECK ([status] IN ('DRAFT','ACTIVE','ARCHIVED'));

ALTER TABLE [dbo].[orders] ADD
  CONSTRAINT [chk_orders_channel] CHECK ([channel] IN ('ONLINE','POS')),
  CONSTRAINT [chk_orders_status] CHECK ([status] IN ('PENDING','CONFIRMED','PROCESSING','SHIPPED','COMPLETED','CANCELLED')),
  CONSTRAINT [chk_orders_payment_method] CHECK ([paymentMethod] IN ('COD','CASH','ONLINE')),
  CONSTRAINT [chk_orders_payment_status] CHECK ([paymentStatus] IN ('UNPAID','PENDING','PAID','FAILED','PARTIALLY_REFUNDED','REFUNDED'));

ALTER TABLE [dbo].[payments] ADD
  CONSTRAINT [chk_payments_method] CHECK ([method] IN ('COD','CASH','ONLINE')),
  CONSTRAINT [chk_payments_status] CHECK ([status] IN ('UNPAID','PENDING','PAID','FAILED','PARTIALLY_REFUNDED','REFUNDED'));

ALTER TABLE [dbo].[stock_reservations] ADD
  CONSTRAINT [chk_reservations_status] CHECK ([status] IN ('ACTIVE','CONVERTED','RELEASED','EXPIRED'));

ALTER TABLE [dbo].[stock_movements] ADD
  CONSTRAINT [chk_movements_type] CHECK ([type] IN ('RECEIPT','SALE','RETURN_RESTOCK','ADJUSTMENT'));

ALTER TABLE [dbo].[purchase_orders] ADD
  CONSTRAINT [chk_purchase_orders_status] CHECK ([status] IN ('DRAFT','SENT','PARTIALLY_RECEIVED','RECEIVED','CANCELLED'));

ALTER TABLE [dbo].[shipments] ADD
  CONSTRAINT [chk_shipments_status] CHECK ([status] IN ('PENDING','SHIPPED','DELIVERED','FAILED','RETURNED'));

ALTER TABLE [dbo].[return_requests] ADD
  CONSTRAINT [chk_return_requests_status] CHECK ([status] IN ('REQUESTED','APPROVED','RECEIVED','INSPECTED','REFUNDED','REJECTED'));

ALTER TABLE [dbo].[return_items] ADD
  CONSTRAINT [chk_return_items_condition] CHECK ([condition] IN ('PENDING_INSPECTION','RESELLABLE','DEFECTIVE'));

ALTER TABLE [dbo].[refunds] ADD
  CONSTRAINT [chk_refunds_status] CHECK ([status] IN ('PENDING','COMPLETED','FAILED'));

-- ---------------------------------------------------------------------
-- 5) Filtered unique index: duy nhat khi KHAC NULL
--    (SQL Server chi cho 1 NULL trong UNIQUE thuong, nen khong dung @unique)
-- ---------------------------------------------------------------------
CREATE UNIQUE INDEX [uq_orders_idempotency_key]
  ON [dbo].[orders] ([idempotencyKey]) WHERE [idempotencyKey] IS NOT NULL;

CREATE UNIQUE INDEX [uq_payments_idempotency_key]
  ON [dbo].[payments] ([idempotencyKey]) WHERE [idempotencyKey] IS NOT NULL;

CREATE UNIQUE INDEX [uq_goods_receipts_idempotency_key]
  ON [dbo].[goods_receipts] ([idempotencyKey]) WHERE [idempotencyKey] IS NOT NULL;

CREATE UNIQUE INDEX [uq_customers_user_id]
  ON [dbo].[customers] ([userId]) WHERE [userId] IS NOT NULL;

CREATE UNIQUE INDEX [uq_cost_layers_goods_receipt_item]
  ON [dbo].[inventory_cost_layers] ([goodsReceiptItemId]) WHERE [goodsReceiptItemId] IS NOT NULL;
