// =====================================================================
// FIFO COSTING - logic thuan (khong truy cap database)
//
// Quy tac (muc 6.1 va 7.3 trong dac ta):
//  - Lop nhap truoc xuat truoc. Tinh rieng theo tung SKU va tung kho
//    (caller chi truyen vao cac lop cua DUNG 1 kho + 1 SKU).
//  - Lop cu khong du thi lay tiep lop ke tiep.
//  - Ket qua phan bo (unitCost, totalCost) la snapshot, khong bao gio tinh lai.
//  - remainingQuantity khong bao gio am.
//
// Tien te tinh bang so nguyen dong (VND) de tranh sai so so thuc.
// Lop service (Task 9) se dung transaction + khoa dong quanh ham nay de xu ly
// xuat dong thoi. Tren SQL Server: SELECT ... FROM ... WITH (UPDLOCK, ROWLOCK)
// (qua prisma.$queryRaw) hoac cap nhat co dieu kien, trong $transaction.
// =====================================================================

export interface CostLayer {
  id: string;
  remainingQuantity: number;
  unitCost: number; // dong / don vi
  receivedAt: Date;
}

export interface Allocation {
  costLayerId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface FifoResult {
  allocations: Allocation[];
  totalCost: number; // COGS cua lan xuat nay
  updatedLayers: CostLayer[]; // ban sao da tru remainingQuantity
}

export class InvalidQuantityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidQuantityError";
  }
}

export class InsufficientCostLayersError extends Error {
  readonly requested: number;
  readonly available: number;
  constructor(requested: number, available: number) {
    super(`Khong du ton trong cac lop gia von: can ${requested}, con ${available}`);
    this.name = "InsufficientCostLayersError";
    this.requested = requested;
    this.available = available;
  }
}

/** Sap xep lop theo received_at tang dan; trung thoi gian thi theo id de on dinh. */
export function sortLayersFifo(layers: readonly CostLayer[]): CostLayer[] {
  return [...layers].sort((a, b) => {
    const diff = a.receivedAt.getTime() - b.receivedAt.getTime();
    if (diff !== 0) return diff;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

export function allocateFifo(layers: readonly CostLayer[], quantity: number): FifoResult {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new InvalidQuantityError("So luong xuat phai la so nguyen duong");
  }
  for (const layer of layers) {
    if (!Number.isInteger(layer.remainingQuantity) || layer.remainingQuantity < 0) {
      throw new InvalidQuantityError(`Lop ${layer.id} co remainingQuantity khong hop le`);
    }
    if (!Number.isInteger(layer.unitCost) || layer.unitCost < 0) {
      throw new InvalidQuantityError(`Lop ${layer.id} co unitCost khong hop le`);
    }
  }

  const sorted = sortLayersFifo(layers);
  const totalAvailable = sorted.reduce((sum, l) => sum + l.remainingQuantity, 0);
  if (totalAvailable < quantity) {
    throw new InsufficientCostLayersError(quantity, totalAvailable);
  }

  const allocations: Allocation[] = [];
  const updatedLayers: CostLayer[] = [];
  let needed = quantity;

  for (const layer of sorted) {
    const take = Math.min(layer.remainingQuantity, needed);
    if (take > 0) {
      allocations.push({
        costLayerId: layer.id,
        quantity: take,
        unitCost: layer.unitCost,
        totalCost: take * layer.unitCost,
      });
      needed -= take;
    }
    updatedLayers.push({ ...layer, remainingQuantity: layer.remainingQuantity - take });
  }

  const totalCost = allocations.reduce((sum, a) => sum + a.totalCost, 0);
  return { allocations, totalCost, updatedLayers };
}
