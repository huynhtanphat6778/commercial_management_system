// Seed du lieu nen (SQL Server 2022): vai tro, cau hinh giu hang, kho mac dinh.
// Chay: npx prisma db seed (sau khi da migrate).
// Chua tao tai khoan admin (can bam mat khau) -> lam o Task 5.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROLES = [
  { code: "ADMIN", name: "Quan tri vien" },
  { code: "MANAGER", name: "Quan ly" },
  { code: "SALES_STAFF", name: "Nhan vien ban hang" },
  { code: "WAREHOUSE_STAFF", name: "Nhan vien kho" },
  { code: "CUSTOMER", name: "Khach hang" },
];

async function main() {
  for (const role of ROLES) {
    await prisma.role.upsert({ where: { code: role.code }, update: { name: role.name }, create: role });
  }
  // Thoi luong giu hang da CONFIRMED: 30 giay (doc tu bang settings, khong hardcode trong logic)
  await prisma.setting.upsert({
    where: { key: "reservation.hold_seconds" },
    update: {},
    create: { key: "reservation.hold_seconds", value: "30" },
  });
  await prisma.warehouse.upsert({
    where: { code: "MAIN" },
    update: {},
    create: { code: "MAIN", name: "Kho chinh", isDefault: true },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
