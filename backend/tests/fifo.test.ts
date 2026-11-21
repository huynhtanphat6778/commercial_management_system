import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allocateFifo,
  InsufficientCostLayersError,
  InvalidQuantityError,
  type CostLayer,
} from "../src/domain/fifo.ts";

const layer = (id: string, qty: number, cost: number, day: number): CostLayer => ({
  id,
  remainingQuantity: qty,
  unitCost: cost,
  receivedAt: new Date(Date.UTC(2026, 0, day)),
});

test("xuat tu mot lop gia von", () => {
  const r = allocateFifo([layer("A", 10, 100_000, 1)], 4);
  assert.equal(r.allocations.length, 1);
  assert.equal(r.totalCost, 400_000);
  assert.equal(r.updatedLayers[0]!.remainingQuantity, 6);
});

test("vi du trong dac ta: nhap 10@100k va 20@120k, xuat 15 => COGS 1.600.000", () => {
  const r = allocateFifo([layer("A", 10, 100_000, 1), layer("B", 20, 120_000, 2)], 15);
  assert.deepEqual(
    r.allocations.map((a) => [a.costLayerId, a.quantity, a.totalCost]),
    [
      ["A", 10, 1_000_000],
      ["B", 5, 600_000],
    ],
  );
  assert.equal(r.totalCost, 1_600_000);
  assert.deepEqual(r.updatedLayers.map((l) => l.remainingQuantity), [0, 15]);
});

test("thu tu FIFO khong phu thuoc thu tu mang dau vao", () => {
  const r = allocateFifo([layer("B", 20, 120_000, 2), layer("A", 10, 100_000, 1)], 12);
  assert.equal(r.allocations[0]!.costLayerId, "A");
  assert.equal(r.totalCost, 10 * 100_000 + 2 * 120_000);
});

test("trung thoi gian nhan: tie-break on dinh theo id", () => {
  const r = allocateFifo([layer("B", 5, 200, 1), layer("A", 5, 100, 1)], 5);
  assert.equal(r.allocations[0]!.costLayerId, "A");
});

test("bo qua lop da het hang", () => {
  const r = allocateFifo([layer("A", 0, 50_000, 1), layer("B", 5, 70_000, 2)], 3);
  assert.deepEqual(r.allocations.map((a) => a.costLayerId), ["B"]);
  assert.equal(r.totalCost, 210_000);
});

test("khong du ton trong cac lop => loi", () => {
  assert.throws(
    () => allocateFifo([layer("A", 3, 100, 1), layer("B", 2, 100, 2)], 6),
    (e: unknown) => e instanceof InsufficientCostLayersError && e.available === 5,
  );
});

test("so luong khong hop le => loi", () => {
  for (const q of [0, -1, 1.5, Number.NaN]) {
    assert.throws(() => allocateFifo([layer("A", 5, 100, 1)], q), InvalidQuantityError);
  }
});

test("khong thay doi du lieu dau vao (khong mutate)", () => {
  const input = [layer("A", 10, 100, 1)];
  allocateFifo(input, 4);
  assert.equal(input[0]!.remainingQuantity, 10);
});

test("remaining khong bao gio am sau khi xuat het", () => {
  const r = allocateFifo([layer("A", 4, 100, 1), layer("B", 6, 110, 2)], 10);
  assert.ok(r.updatedLayers.every((l) => l.remainingQuantity >= 0));
  assert.deepEqual(r.updatedLayers.map((l) => l.remainingQuantity), [0, 0]);
});

test("gia von lich su khong doi khi nhap them lop moi", () => {
  const first = allocateFifo([layer("A", 10, 100_000, 1)], 10);
  // Nhap them lo moi gia cao hon; ket qua phan bo cu la snapshot nen khong doi
  allocateFifo([layer("C", 50, 999_000, 5)], 5);
  assert.equal(first.totalCost, 1_000_000);
  assert.equal(first.allocations[0]!.unitCost, 100_000);
});

test("hai lan xuat lien tiep dung chung trang thai lop (mo phong giao dich tuan tu)", () => {
  const start = [layer("A", 10, 100, 1), layer("B", 10, 200, 2)];
  const first = allocateFifo(start, 8);
  const second = allocateFifo(first.updatedLayers, 8);
  assert.equal(first.totalCost, 800);
  assert.equal(second.totalCost, 2 * 100 + 6 * 200);
  assert.deepEqual(second.updatedLayers.map((l) => l.remainingQuantity), [0, 4]);
});
