# Fashion E-commerce & Business Management System

Hệ thống thương mại điện tử kết hợp quản lý cửa hàng quần áo: website bán hàng, POS, Admin Dashboard, Backend API, SQL Server 2022.
Kiến trúc Modular Monolith; MVP gồm một cửa hàng và một kho.

## Công nghệ (đã chốt)

React + TypeScript + Tailwind CSS · Node.js + Express · SQL Server 2022 + Prisma · Docker · REST API (`/api/v1`).

## Quy tắc nghiệp vụ cốt lõi

- Giá vốn **FIFO**, tính riêng theo từng SKU và từng kho, lưu lịch sử phân bổ.
- Online dùng **Timed Reservation**; đơn **COD giữ hàng ngay** khi tạo đơn.
- `Available = OnHand - Reserved`; không bán vượt Available.

Chi tiết quyết định: [`docs/DECISIONS.md`](docs/DECISIONS.md).

## Cấu trúc

```
backend/    API, database (Prisma), logic nghiệp vụ, test        -> Codex
frontend/   Website khách hàng, POS, Admin Dashboard             -> Antigravity
docs/       Đặc tả gốc (SPEC.md), quyết định, phân công việc, lệnh cho Codex/Antigravity, hướng dẫn chạy
docker-compose.yml   SQL Server 2022 cho môi trường phát triển
```

## Phân công

- [`docs/TASKS_CODEX.md`](docs/TASKS_CODEX.md): backend, database, nghiệp vụ, kiểm thử (Task 3, 5–12, 14–17).
- [`docs/TASKS_ANTIGRAVITY.md`](docs/TASKS_ANTIGRAVITY.md): thiết kế và giao diện web (Task 13 và phần giao diện của Task 12, 15).

## Bắt đầu

Xem [`docs/HUONG_DAN_VSCODE.md`](docs/HUONG_DAN_VSCODE.md).

## Trạng thái

| Task | Trạng thái |
|---|---|
| 3. Database & Prisma schema | Đã viết schema (SQL Server) và ràng buộc T-SQL; **chưa** chạy `prisma validate`, migration, seed trên SQL Server thật |
| 4. Khởi tạo dự án | Đã có khung backend, Docker Compose SQL Server 2022; chưa khởi tạo frontend |
| Logic FIFO, giữ hàng, enum | Đã viết và test (41/41 đạt, chạy bằng `npm test`) |
| Task 5 trở đi | Chưa triển khai |
