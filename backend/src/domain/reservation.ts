// =====================================================================
// INVENTORY + TIMED RESERVATION - logic thuan (khong truy cap database)
//
// Cong thuc: Available = OnHand - Reserved
// Rang buoc: OnHand >= 0, Reserved >= 0, Reserved <= OnHand
// Trang thai reservation: ACTIVE -> CONVERTED | RELEASED | EXPIRED
//  - Chi giai phong DUNG MOT LAN (idempotent): reservation khong con
//    ACTIVE thi cac ham release/expire khong lam gi.
//  - Thoi luong giu hang (reservation.hold_seconds, hien la 30 giay) lay tu cau hinh, KHONG hardcode.
//    Don COD cung phai reserve ngay khi tao don thanh cong.
// =====================================================================

export interface Balance {
  onHand: number;
  reserved: number;
}

export type ReservationStatus = "ACTIVE" | "CONVERTED" | "RELEASED" | "EXPIRED";

export interface Reservation {
  id: string;
  status: ReservationStatus;
  quantity: number;
  expiresAt: Date;
  releasedAt: Date | null;
}

export class InsufficientAvailableError extends Error {
  readonly requested: number;
  readonly available: number;
  constructor(requested: number, available: number) {
    super(`Khong du hang kha dung: can ${requested}, kha dung ${available}`);
    this.name = "InsufficientAvailableError";
    this.requested = requested;
    this.available = available;
  }
}

export class InvariantViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvariantViolationError";
  }
}

export class InvalidReservationStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidReservationStateError";
  }
}

export function availableQuantity(b: Balance): number {
  return b.onHand - b.reserved;
}

export function assertBalanceInvariants(b: Balance): void {
  if (!Number.isInteger(b.onHand) || !Number.isInteger(b.reserved)) {
    throw new InvariantViolationError("onHand va reserved phai la so nguyen");
  }
  if (b.onHand < 0) throw new InvariantViolationError("onHand khong duoc am");
  if (b.reserved < 0) throw new InvariantViolationError("reserved khong duoc am");
  if (b.reserved > b.onHand) throw new InvariantViolationError("reserved khong duoc vuot onHand");
}

function assertPositiveInt(n: number): void {
  if (!Number.isInteger(n) || n <= 0) {
    throw new InvariantViolationError("So luong phai la so nguyen duong");
  }
}

/** Giu hang: tang reserved. Khong ban vuot Available. */
export function reserve(b: Balance, quantity: number): Balance {
  assertBalanceInvariants(b);
  assertPositiveInt(quantity);
  const available = availableQuantity(b);
  if (quantity > available) throw new InsufficientAvailableError(quantity, available);
  return { onHand: b.onHand, reserved: b.reserved + quantity };
}

/** Tra lai hang da giu (huy don...). Giam reserved, khong dong vao onHand. */
export function releaseReserved(b: Balance, quantity: number): Balance {
  assertBalanceInvariants(b);
  assertPositiveInt(quantity);
  if (quantity > b.reserved) {
    throw new InvariantViolationError("Giai phong nhieu hon so luong dang giu");
  }
  return { onHand: b.onHand, reserved: b.reserved - quantity };
}

/** Xuat kho thuc te cho hang da giu: giam ca onHand lan reserved. */
export function fulfillReserved(b: Balance, quantity: number): Balance {
  assertBalanceInvariants(b);
  assertPositiveInt(quantity);
  if (quantity > b.reserved) {
    throw new InvariantViolationError("Xuat nhieu hon so luong dang giu");
  }
  return { onHand: b.onHand - quantity, reserved: b.reserved - quantity };
}

export function isExpired(r: Reservation, now: Date): boolean {
  return r.status === "ACTIVE" && r.expiresAt.getTime() <= now.getTime();
}

export interface ReleaseOutcome {
  changed: boolean; // false neu da duoc xu ly truoc do (idempotent)
  reservation: Reservation;
  balance: Balance;
}

/** Het han: ACTIVE va da qua expiresAt -> EXPIRED + tra reserved. Chay lap khong sao. */
export function expireReservation(r: Reservation, b: Balance, now: Date): ReleaseOutcome {
  if (!isExpired(r, now)) return { changed: false, reservation: r, balance: b };
  return {
    changed: true,
    reservation: { ...r, status: "EXPIRED", releasedAt: now },
    balance: releaseReserved(b, r.quantity),
  };
}

/** Huy don: ACTIVE -> RELEASED + tra reserved. Goi lai lan nua khong tra them. */
export function cancelReservation(r: Reservation, b: Balance, now: Date): ReleaseOutcome {
  if (r.status !== "ACTIVE") return { changed: false, reservation: r, balance: b };
  return {
    changed: true,
    reservation: { ...r, status: "RELEASED", releasedAt: now },
    balance: releaseReserved(b, r.quantity),
  };
}

/** Don duoc xu ly/xuat kho: ACTIVE -> CONVERTED. Reserved duoc tru khi xuat kho that. */
export function convertReservation(r: Reservation): Reservation {
  if (r.status !== "ACTIVE") {
    throw new InvalidReservationStateError(`Khong the chuyen doi reservation o trang thai ${r.status}`);
  }
  return { ...r, status: "CONVERTED" };
}

/** Tinh thoi diem het han tu cau hinh (so giay). Gia tri phai den tu bang settings (reservation.hold_seconds). */
export function computeExpiresAt(now: Date, holdSeconds: number): Date {
  if (!Number.isFinite(holdSeconds) || holdSeconds <= 0) {
    throw new InvariantViolationError("holdSeconds phai la so duong (lay tu cau hinh)");
  }
  return new Date(now.getTime() + holdSeconds * 1000);
}
