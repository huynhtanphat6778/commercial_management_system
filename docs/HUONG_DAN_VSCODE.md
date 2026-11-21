# Hướng dẫn từng bước trong VS Code (Windows)

> Chưa được chạy thử trên máy thật: bước 2–4 và 6 (môi trường tạo mã không có mạng để cài Prisma và SQL Server). Bước 5 (test logic FIFO, giữ hàng, enum) đã chạy thật và đạt 41/41. Nếu gặp lỗi ở bước nào, gửi nguyên văn thông báo lỗi để được phân tích.

## Chuẩn bị (cài một lần)

- Node.js bản 22.18 trở lên (kiểm tra: `node --version`).
- Docker Desktop (để chạy SQL Server 2022; cần còn ít nhất 2 GB RAM trống).
- Git.
- Tùy chọn: tiện ích VS Code "SQL Server (mssql)" để xem dữ liệu.

## Bước 1. Lấy mã nguồn và đẩy lên GitHub

1. Mở VS Code, bấm Ctrl+Shift+P, chọn **Git: Clone**, dán `https://github.com/huynhtanphat6778/commercial_management_system.git`, chọn thư mục lưu rồi mở thư mục đó.
2. Giải nén file zip, chép **nội dung** thư mục `commercial_management_system` bên trong (backend, docs, frontend, README.md, docker-compose.yml, .gitignore) vào thư mục vừa clone. Cho phép ghi đè `README.md`.
3. Mở tab **Source Control** (Ctrl+Shift+G): bấm dấu **+** cạnh "Changes", nhập thông điệp commit (ví dụ `Khoi tao khung du an`), bấm **Commit**, rồi **Sync Changes**. Lần đầu VS Code hỏi đăng nhập GitHub: chọn đăng nhập qua trình duyệt.

Hoặc dùng Terminal (Ctrl+`), thư mục hiện tại là thư mục repo:

```
git add .
git commit -m "Khoi tao khung du an"
git push origin main
```

## Bước 2. Chạy SQL Server 2022

Thư mục hiện tại: thư mục repo.

```
docker compose up -d
```

Lần đầu Docker tải image khoảng vài trăm MB. Kiểm tra: `docker compose ps` thấy `db` ở trạng thái healthy; dịch vụ `db-init` chạy một lần để tạo database `fashion_shop` rồi tự thoát (xem `docker compose logs db-init`).

## Bước 3. Cài thư viện và cấu hình backend

```
cd backend
npm install
copy .env.example .env
```

File `.env` chứa chuỗi kết nối. Giá trị mặc định khớp với `docker-compose.yml` (user `sa`, mật khẩu `ShopDev2026Pass`), chỉ dùng trên máy phát triển của bạn. Nếu đổi mật khẩu trong `docker-compose.yml` (biến `MSSQL_SA_PASSWORD`), đổi cả trong `.env`.

## Bước 4. Tạo bảng trong database

Thư mục hiện tại: `backend`.

```
npx prisma validate
npx prisma migrate dev --name init
npx prisma migrate dev --create-only --name constraints
```

Lệnh cuối tạo một migration rỗng trong `prisma/migrations/`. Mở file `migration.sql` mới nhất, dán toàn bộ nội dung `prisma/sql/constraints.sql` vào, lưu lại, rồi chạy:

```
npx prisma migrate dev
npx prisma db seed
```

Giải thích: Prisma tự sinh bảng từ `schema.prisma`, nhưng không diễn đạt được các ràng buộc CHECK (ví dụ tồn kho không âm, giá trị trạng thái hợp lệ) và filtered unique index (khóa chống trùng chỉ áp dụng khi có giá trị), nên ta thêm chúng bằng file SQL riêng.

## Bước 5. Chạy test logic nghiệp vụ

Thư mục hiện tại: `backend`.

```
npm test
```

Kết quả mong đợi: `# pass 41`, `# fail 0`. Test kiểm tra quy tắc FIFO (nhập 10 áo giá 100.000 và 20 áo giá 120.000, xuất 15 áo thì giá vốn 1.600.000), quy tắc giữ hàng 30 giây (hai khách mua sản phẩm cuối cùng, hủy đơn, hết hạn, worker chạy lặp) và việc danh sách trạng thái trong code khớp với ràng buộc CHECK.

## Bước 6. Chạy backend

```
npm run dev
```

Mở http://localhost:3000/api/v1/health: phải thấy `{"status":"ok", ...}`.

## Giao việc cho Codex và Antigravity

Mở thư mục repo trong công cụ tương ứng, rồi dán nội dung lệnh:

- Codex (backend): `docs/PROMPT_CODEX.md`
- Antigravity (giao diện web): `docs/PROMPT_ANTIGRAVITY.md`

Để hai bên không giẫm lên nhau: Codex chỉ sửa `backend/`, Antigravity chỉ sửa `frontend/`; mỗi bên làm trên nhánh git riêng (`codex/...`, `antigravity/...`) và bạn gộp vào `main` sau khi kiểm tra.

## Vai trò các file chính

| File / thư mục | Vai trò |
|---|---|
| `backend/prisma/schema.prisma` | Khai báo toàn bộ bảng và quan hệ (SQL Server) |
| `backend/prisma/sql/constraints.sql` | Ràng buộc CHECK, enum bằng CHECK và filtered unique index (T-SQL) |
| `backend/prisma/seed.ts` | Dữ liệu nền: vai trò, thời lượng giữ hàng 30 giây, kho mặc định |
| `backend/src/domain/enums.ts` | Danh sách trạng thái (thay cho enum mà SQL Server + Prisma không có) |
| `backend/src/domain/fifo.ts` | Phân bổ giá vốn FIFO (logic thuần, dễ kiểm thử) |
| `backend/src/domain/reservation.ts` | Tồn kho khả dụng và giữ hàng có thời hạn |
| `backend/src/app.ts`, `server.ts` | Khung Express và điểm khởi chạy |
| `backend/tests/` | Test tự động |
| `docs/SPEC.md` | Đặc tả gốc của dự án (nguồn chuẩn), kèm danh sách quyết định đã đổi |
| `docs/DECISIONS.md` | Quyết định đã chốt, đề xuất, còn thiếu |
| `docs/TASKS_CODEX.md`, `docs/TASKS_ANTIGRAVITY.md` | Phạm vi và quy tắc của từng bên |
| `docs/PROMPT_CODEX.md`, `docs/PROMPT_ANTIGRAVITY.md` | Lệnh sẵn để dán |
