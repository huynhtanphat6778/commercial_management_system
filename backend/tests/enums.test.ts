import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as enums from "../src/domain/enums.ts";

const sql = readFileSync(new URL("../prisma/sql/constraints.sql", import.meta.url), "utf8");
const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");

const lists: Record<string, readonly string[]> = {
  USER_STATUS: enums.USER_STATUS,
  PRODUCT_STATUS: enums.PRODUCT_STATUS,
  ORDER_CHANNEL: enums.ORDER_CHANNEL,
  ORDER_STATUS: enums.ORDER_STATUS,
  PAYMENT_METHOD: enums.PAYMENT_METHOD,
  PAYMENT_STATUS: enums.PAYMENT_STATUS,
  RESERVATION_STATUS: enums.RESERVATION_STATUS,
  STOCK_MOVEMENT_TYPE: enums.STOCK_MOVEMENT_TYPE,
  PURCHASE_ORDER_STATUS: enums.PURCHASE_ORDER_STATUS,
  SHIPMENT_STATUS: enums.SHIPMENT_STATUS,
  RETURN_STATUS: enums.RETURN_STATUS,
  RETURN_CONDITION: enums.RETURN_CONDITION,
  REFUND_STATUS: enums.REFUND_STATUS,
};

for (const [name, values] of Object.entries(lists)) {
  test(`enums.ts khop voi CHECK trong constraints.sql: ${name}`, () => {
    const expected = `IN (${values.map((v) => `'${v}'`).join(",")})`;
    assert.ok(sql.includes(expected), `constraints.sql thieu hoac sai: ${expected}`);
  });
}

test("schema.prisma khong dung enum / Json / kieu rieng cua PostgreSQL (SQL Server khong ho tro)", () => {
  const code = schema
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  assert.ok(!/^enum\s/m.test(code), "SQL Server khong ho tro enum");
  assert.ok(!/\bJson\b/.test(code), "SQL Server khong ho tro Json");
  assert.ok(!/Timestamptz|@db\.Uuid\b/.test(code), "con kieu rieng cua PostgreSQL");
  assert.ok(!/onDelete:\s*(Restrict|SetNull)/.test(code), "SQL Server khong co Restrict; SetNull de gay loi cascade path");
  assert.match(code, /provider\s*=\s*"sqlserver"/);
});

test("cot co the NULL nhung phai duy nhat khong dung @unique (dung filtered index)", () => {
  for (const field of ["idempotencyKey", "userId", "goodsReceiptItemId"]) {
    const re = new RegExp(`^\\s*${field}\\s+String\\?.*@unique`, "m");
    assert.ok(!re.test(schema), `${field} (nullable) khong duoc co @unique`);
  }
  for (const index of ["uq_orders_idempotency_key", "uq_payments_idempotency_key", "uq_goods_receipts_idempotency_key", "uq_customers_user_id", "uq_cost_layers_goods_receipt_item"]) {
    assert.ok(sql.includes(index), `thieu filtered unique index ${index}`);
  }
});
