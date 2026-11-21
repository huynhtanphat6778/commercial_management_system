# Quyết định dự án (Decision Governance)

Ba trạng thái: **CONFIRMED** (đã xác nhận), **PROPOSED** (đề xuất, chưa xác nhận), **PENDING** (còn thiếu thông tin).
Không ai (người hay AI) được tự chuyển PENDING thành CONFIRMED.

## CONFIRMED

- Một cửa hàng vật lý + website online + POS; một kho chung; website và POS dùng chung tồn kho.
- Thanh toán: COD, CASH, ONLINE. Trạng thái thanh toán độc lập với trạng thái đơn.
- Có quản lý nhà cung cấp, nhập hàng, giá vốn, lợi nhuận.
- Kiến trúc Modular Monolith.
- Công nghệ: React + TypeScript, Node.js + Express, Prisma, Tailwind CSS, Docker, REST API, VS Code.
- **Database: SQL Server 2022** (đổi từ PostgreSQL theo yêu cầu chủ dự án, 2026-11-21).
  Hệ quả kỹ thuật: Prisma + SQL Server không có enum và Json, nên enum lưu bằng String + CHECK (khai báo ở `src/domain/enums.ts`), Json lưu bằng NVarChar(Max); cột nullable cần duy nhất dùng filtered unique index; `onDelete` dùng NoAction; khóa dòng dùng `WITH (UPDLOCK, ROWLOCK)`.
- Giá vốn: **FIFO** (theo từng SKU và từng kho, lưu lịch sử phân bổ).
- Giữ hàng online: **Timed Reservation** (ACTIVE / CONVERTED / RELEASED / EXPIRED).
- Đơn **COD giữ hàng ngay** khi tạo đơn thành công.
- Công thức: `Available = OnHand - Reserved`.
- Thời lượng giữ hàng: **30 giây** (xác nhận 2026-11-21). Lưu trong `settings` với khóa `reservation.hold_seconds`, không hardcode trong logic.
- Frontend khởi tạo bằng **Vite** (React + TypeScript), xác nhận 2026-11-21.

## CONFIRMED (trước đó là PROPOSED, xác nhận 2026-11-21)

- Tên bảng snake_case số nhiều, tên cột camelCase (để SQL của Prisma và file CHECK constraint thống nhất).
- Trạng thái đơn: `PENDING, CONFIRMED, PROCESSING, SHIPPED, COMPLETED, CANCELLED`.
- Tiền tệ lưu `Decimal(14,2)`; logic thuần tính bằng số nguyên đồng (VND).
- Mỗi dòng đơn hàng chỉ lưu giá bán snapshot; giá vốn lấy từ `cost_layer_allocations` (không lưu trùng).
- Hàng trả về (RESELLABLE) tạo lớp giá vốn mới theo đơn giá của lô đã xuất ban đầu.
- Cấu hình hệ thống nằm trong bảng `settings` (khóa/giá trị), ví dụ `reservation.hold_seconds`.
- Backend ghim Prisma 6 và Express 4 (ổn định, nhiều tài liệu cho người mới).

## PENDING

- Cổng thanh toán online.
- Đơn vị vận chuyển.
- Chính sách đổi trả (thời hạn, điều kiện).
- Quản lý chi phí vận hành chi tiết.
- Hóa đơn điện tử.
- Chính sách xử lý đơn hết hạn và thanh toán đang chờ theo từng phương thức.
