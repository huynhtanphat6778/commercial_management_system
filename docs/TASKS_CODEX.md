# Giao việc cho Codex — Backend, Database, Logic nghiệp vụ, Kiểm thử

Phạm vi của Codex: mọi thứ trong `backend/`, `docker-compose.yml`, migration, seed, test, tài liệu API.
**Không** làm giao diện (thuộc về Antigravity, xem `docs/TASKS_ANTIGRAVITY.md`).

## Quy tắc bắt buộc

1. Đọc trước: `docs/SPEC.md` (đặc tả gốc, nguồn chuẩn; phần đầu liệt kê các quyết định đã đổi), `docs/DECISIONS.md`, `backend/prisma/schema.prisma`, `backend/src/domain/*`.
2. Không đổi công nghệ đã CONFIRMED. Cần thêm thư viện (ví dụ bcrypt/argon2, zod, jsonwebtoken) thì ghi lý do vào PR/commit và chờ chủ dự án xác nhận.
3. Không chuyển PENDING thành CONFIRMED. Cổng thanh toán, đơn vị vận chuyển, chính sách đổi trả: đọc từ cấu hình hoặc dùng adapter giả, không hardcode. Thời lượng giữ hàng đã CONFIRMED là 30 giây, đọc từ `settings` khóa `reservation.hold_seconds` (đã có trong seed); worker hết hạn phải chạy đủ thường xuyên (vài giây một lần) để phù hợp mốc 30 giây.
4. Frontend không truy cập database. Mọi nghiệp vụ đi qua `/api/v1`.
5. Nghiệp vụ quan trọng phải nằm trong transaction; xử lý đồng thời bằng khóa dòng của SQL Server (`WITH (UPDLOCK, ROWLOCK)` qua `prisma.$queryRaw` trong `$transaction`) hoặc cập nhật có điều kiện.
5a. Database là **SQL Server 2022**: không dùng enum/Json của Prisma; cột nullable cần duy nhất dùng filtered unique index (đã có trong `prisma/sql/constraints.sql`), vì vậy tra cứu theo `idempotencyKey` phải dùng `findFirst`, không dùng `findUnique`.
6. Xử lý idempotency: tạo đơn (`Order.idempotencyKey`), webhook (`PaymentWebhookEvent` unique), worker hết hạn chạy lặp, xác nhận nhận hàng.
7. Giữ nguyên ba quy tắc cốt lõi: FIFO là phương pháp giá vốn duy nhất; online dùng Timed Reservation; COD reserve ngay.
8. Dùng lại logic thuần đã có trong `src/domain/` (đã có test). Service chỉ bọc transaction + Prisma quanh các hàm đó, không viết lại công thức.
9. Mỗi task: có test chạy thật, cập nhật tài liệu API, báo cáo file tạo/sửa và kết quả test. Không tuyên bố xong nếu chưa chạy.
10. Mỗi module một thư mục `backend/src/modules/<tên>/` (routes, service, validation). Một nhánh git và một PR cho mỗi task.

## Việc đã làm sẵn (Task 3–4 phần khung)

- `schema.prisma` đầy đủ các nhóm bảng; `prisma/sql/constraints.sql` (CHECK constraint); `prisma/seed.ts`.
- `src/domain/fifo.ts`, `src/domain/reservation.ts` + 26 test chạy bằng `npm test`.
- Express khung với `/api/v1/health`.

## Việc đầu tiên của Codex (Task 3 — hoàn tất xác thực database)

1. `npm install`, `docker compose up -d` (chờ `db-init` tạo database `fashion_shop`), `npx prisma validate`, sửa lỗi schema nếu có (schema chưa từng được chạy trên SQL Server thật).
2. `npx prisma migrate dev --name init`, rồi `npx prisma migrate dev --create-only --name constraints` và dán nội dung `prisma/sql/constraints.sql` vào migration mới; chạy lại. Kiểm tra lần `migrate dev` kế tiếp không đòi xóa các filtered unique index (nếu Prisma báo drift, ghi lại cách xử lý vào `docs/`).
3. Chạy seed (có `reservation.hold_seconds = 30`). Viết integration test với SQL Server thật: CHECK constraint chặn onHand âm / reserved > onHand / remaining âm / giá trị enum sai; unique SKU, email, orderCode, webhook (provider, eventId), (warehouse, variant); filtered unique index cho `idempotencyKey` (nhiều NULL được phép, trùng giá trị khác NULL bị chặn).
4. Commit migration vào repo.

## Danh sách task tiếp theo (làm tuần tự, không bỏ task)

| Task | Nội dung | Tiêu chí hoàn thành chính |
|---|---|---|
| 5 | Authentication & RBAC | Đăng ký/đăng nhập, băm mật khẩu Argon2id hoặc bcrypt, middleware xác thực + phân quyền theo role/permission, seed tài khoản admin từ biến môi trường |
| 6 | Product & Catalog | CRUD sản phẩm, biến thể, danh mục, thương hiệu, ảnh; SKU duy nhất; giá xác thực ở backend |
| 7 | Inventory & Reservations | Số dư tồn, lịch sử stock movement, tạo/hủy/hết hạn reservation (transaction + khóa), worker hết hạn chạy lặp an toàn; test "hai khách mua sản phẩm cuối cùng" trên DB thật |
| 8 | Supplier & Purchasing | NCC, Purchase Order, Goods Receipt nhiều đợt; chỉ cộng tồn khi xác nhận nhận hàng; ghi giá nhập thực tế |
| 9 | FIFO Costing | Tạo cost layer khi nhận hàng; phân bổ khi xuất kho bằng `allocateFifo` trong transaction; test xuất đồng thời, không đủ lớp, giá vốn lịch sử không đổi |
| 10 | Order Management | Tạo đơn online/COD (kiểm tra giá, Available, reserve, idempotency), hủy đơn, chuyển trạng thái, snapshot giá |
| 11 | Payment | CASH/COD/ONLINE, webhook idempotent, hoàn tiền; cổng thanh toán thật vẫn PENDING nên dùng adapter giả |
| 12 | POS | Phiên POS, bán tại quầy dùng chung nghiệp vụ tồn kho/FIFO |
| 14 | Shipping & Returns | Shipment, yêu cầu đổi trả, kiểm hàng, nhập lại kho bán được, hoàn tiền; điều kiện đổi trả đọc từ cấu hình (PENDING) |
| 15 | Reports | Net Revenue, COGS (FIFO), Gross Profit theo công thức trong đặc tả; API cho dashboard |
| 16 | Testing & Security | Bao phủ các tình huống bắt buộc trong mục 12 của đặc tả, rà soát bảo mật |
| 17 | Deployment | Dockerfile backend, backup/restore database, tài liệu triển khai |

Task 13 (Customer Website) và phần giao diện của Task 12, 15 thuộc Antigravity.

## Hợp đồng API với Antigravity

- Tiền tố `/api/v1`, JSON, lỗi theo dạng `{ "error": { "code": "...", "message": "..." } }`.
- Tài liệu endpoint (method, URL, quyền, request, response, lỗi) viết vào `docs/API.md` song song với code, để Antigravity dựng giao diện và mock theo đó.
- Mọi thay đổi hợp đồng API phải cập nhật `docs/API.md` trong cùng PR.
