import { test } from "node:test";
import assert from "node:assert/strict";
import {
  availableQuantity,
  cancelReservation,
  computeExpiresAt,
  convertReservation,
  expireReservation,
  fulfillReserved,
  InsufficientAvailableError,
  InvalidReservationStateError,
  InvariantViolationError,
  releaseReserved,
  reserve,
  type Balance,
  type Reservation,
} from "../src/domain/reservation.ts";

const T0 = new Date("2026-11-21T08:00:00Z");

const makeReservation = (quantity: number, holdSeconds = 30): Reservation => ({
  id: "r1",
  status: "ACTIVE",
  quantity,
  expiresAt: computeExpiresAt(T0, holdSeconds),
  releasedAt: null,
});

test("Available = OnHand - Reserved", () => {
  assert.equal(availableQuantity({ onHand: 10, reserved: 3 }), 7);
});

test("dat hang khi du ton: tang reserved", () => {
  assert.deepEqual(reserve({ onHand: 5, reserved: 1 }, 4), { onHand: 5, reserved: 5 });
});

test("dat hang khi khong du ton: bi tu choi", () => {
  assert.throws(
    () => reserve({ onHand: 5, reserved: 3 }, 3),
    (e: unknown) => e instanceof InsufficientAvailableError && e.available === 2,
  );
});

test("hai khach cung mua san pham cuoi cung: chi mot nguoi thanh cong", () => {
  let balance: Balance = { onHand: 1, reserved: 0 };
  balance = reserve(balance, 1); // khach 1 thanh cong
  assert.throws(() => reserve(balance, 1), InsufficientAvailableError); // khach 2 that bai
  assert.deepEqual(balance, { onHand: 1, reserved: 1 });
});

test("website va POS dung chung ton: POS ban het thi online khong con hang", () => {
  const start: Balance = { onHand: 3, reserved: 1 };
  const afterOnline = reserve(start, 1); // online giu 1
  const afterPos = fulfillReserved(reserve(afterOnline, 1), 1); // POS ban 1 (giu roi xuat)
  // ban dau 3 ton / 1 giu; online giu them 1, POS giu 1 roi xuat 1 => onHand 2, reserved 2
  assert.deepEqual(afterPos, { onHand: 2, reserved: 2 });
  assert.equal(availableQuantity(afterPos), 0);
  assert.throws(() => reserve(afterPos, 1), InsufficientAvailableError);
});

test("huy don giai phong hang va chi giai phong mot lan", () => {
  const r = makeReservation(2);
  const b: Balance = { onHand: 5, reserved: 2 };
  const first = cancelReservation(r, b, T0);
  assert.equal(first.changed, true);
  assert.equal(first.reservation.status, "RELEASED");
  assert.deepEqual(first.balance, { onHand: 5, reserved: 0 });

  const second = cancelReservation(first.reservation, first.balance, T0);
  assert.equal(second.changed, false);
  assert.deepEqual(second.balance, { onHand: 5, reserved: 0 });
});

test("reservation chua het han thi khong bi giai phong", () => {
  const r = makeReservation(2, 30);
  const b: Balance = { onHand: 5, reserved: 2 };
  const out = expireReservation(r, b, new Date(T0.getTime() + 29_000));
  assert.equal(out.changed, false);
  assert.deepEqual(out.balance, b);
});

test("reservation het han: EXPIRED va tra reserved", () => {
  const r = makeReservation(2, 30);
  const out = expireReservation(r, { onHand: 5, reserved: 2 }, new Date(T0.getTime() + 30_000));
  assert.equal(out.changed, true);
  assert.equal(out.reservation.status, "EXPIRED");
  assert.deepEqual(out.balance, { onHand: 5, reserved: 0 });
});

test("worker het han chay lap: khong giai phong hai lan", () => {
  const r = makeReservation(2, 30);
  const later = new Date(T0.getTime() + 60_000);
  const first = expireReservation(r, { onHand: 5, reserved: 2 }, later);
  const second = expireReservation(first.reservation, first.balance, later);
  assert.equal(second.changed, false);
  assert.deepEqual(second.balance, { onHand: 5, reserved: 0 });
});

test("reservation da huy khong the bi het han them lan nua", () => {
  const r = makeReservation(1);
  const cancelled = cancelReservation(r, { onHand: 2, reserved: 1 }, T0);
  const out = expireReservation(cancelled.reservation, cancelled.balance, new Date(T0.getTime() + 999 * 60_000));
  assert.equal(out.changed, false);
});

test("chuyen doi reservation: ACTIVE -> CONVERTED, trang thai khac bi tu choi", () => {
  const converted = convertReservation(makeReservation(1));
  assert.equal(converted.status, "CONVERTED");
  assert.throws(() => convertReservation(converted), InvalidReservationStateError);
});

test("xuat kho cho hang da giu giam ca onHand va reserved", () => {
  assert.deepEqual(fulfillReserved({ onHand: 5, reserved: 2 }, 2), { onHand: 3, reserved: 0 });
});

test("rang buoc: khong giai phong hay xuat nhieu hon so dang giu", () => {
  assert.throws(() => releaseReserved({ onHand: 5, reserved: 1 }, 2), InvariantViolationError);
  assert.throws(() => fulfillReserved({ onHand: 5, reserved: 1 }, 2), InvariantViolationError);
});

test("rang buoc ton kho khong hop le bi phat hien", () => {
  assert.throws(() => reserve({ onHand: 1, reserved: 2 }, 1), InvariantViolationError);
  assert.throws(() => reserve({ onHand: -1, reserved: 0 }, 1), InvariantViolationError);
  assert.throws(() => reserve({ onHand: 5, reserved: 0 }, 0), InvariantViolationError);
});

test("thoi luong giu hang phai den tu cau hinh hop le", () => {
  assert.equal(computeExpiresAt(T0, 30).getTime() - T0.getTime(), 30_000);
  assert.throws(() => computeExpiresAt(T0, 0), InvariantViolationError);
  assert.throws(() => computeExpiresAt(T0, Number.NaN), InvariantViolationError);
});
