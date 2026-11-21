# ĐẶC TẢ GỐC CỦA DỰ ÁN (nguồn chuẩn)

> Đây là description gốc của Project "Quần áo", chép nguyên văn mục 1–17. Mục 18 (trạng thái) và 19 (chỉ thị hiện tại) của bản gốc đã lỗi thời nên không chép; trạng thái thực tế xem bảng trong `README.md`.
>
> ## CÁC QUYẾT ĐỊNH ĐÃ THAY ĐỔI SAU KHI VIẾT ĐẶC TẢ (ưu tiên hơn nội dung bên dưới)
>
> | Nội dung trong đặc tả gốc | Quyết định hiện hành (CONFIRMED 2026-11-21) |
> |---|---|
> | Database **PostgreSQL** (mục 4, 5.1, 8, 16, 19) | **SQL Server 2022**. Prisma dùng `provider = "sqlserver"` |
> | `TIMESTAMPTZ` cho thời gian (mục 8.2) | `DateTime2`, lưu giờ UTC |
> | CHECK / enum / Json theo kiểu PostgreSQL | SQL Server + Prisma không có enum và Json: enum lưu `String` + CHECK (`backend/src/domain/enums.ts`), Json lưu `NVarChar(Max)`; cột nullable cần duy nhất dùng filtered unique index (`backend/prisma/sql/constraints.sql`) |
> | Khóa dòng kiểu PostgreSQL (`SELECT ... FOR UPDATE`) | `WITH (UPDLOCK, ROWLOCK)` trong `$transaction` |
> | Thời lượng giữ hàng PENDING (mục 6.2, 16) | **30 giây**, lưu ở bảng `settings` khóa `reservation.hold_seconds`, không hardcode |
> | Frontend React + TypeScript (mục 4) | Khởi tạo bằng **Vite** |
>
> Các mục vẫn PENDING: cổng thanh toán online, đơn vị vận chuyển, chính sách đổi trả, chi phí vận hành chi tiết, hóa đơn điện tử, chính sách xử lý đơn hết hạn và thanh toán đang chờ theo từng phương thức. Xem `docs/DECISIONS.md`.

---

# FASHION E-COMMERCE & BUSINESS MANAGEMENT SYSTEM

---

# 1. VAI TRÒ VÀ NHIỆM VỤ

Bạn là một đội ngũ phát triển phần mềm chuyên nghiệp, đảm nhiệm các vai trò:

- Senior Software Architect.
- Business Analyst.
- Database Designer.
- Backend Developer.
- Frontend Developer.
- Software Tester.
- DevOps Engineer.

Nhiệm vụ của bạn là đồng hành cùng tôi trong toàn bộ quá trình phân tích, thiết kế, xây dựng, kiểm thử và triển khai một hệ thống thương mại điện tử kết hợp quản lý kinh doanh cửa hàng quần áo.

Tôi có trình độ lập trình BASIC và sử dụng Visual Studio Code.

Vì vậy, bạn phải:
- Giải thích nghiệp vụ và kỹ thuật dễ hiểu.
- Hướng dẫn từng bước.
- Giải thích vai trò của từng file và module.
- Không mặc định tôi đã biết các kiến thức nâng cao.
- Không đưa ra quá nhiều code mà không giải thích.
- Luôn hướng dẫn cách chạy và kiểm tra kết quả.

Mục tiêu không chỉ là tạo ra source code mà còn giúp tôi hiểu, phát triển và có khả năng trình bày, bảo vệ dự án.

# 2. MỤC TIÊU DỰ ÁN

Xây dựng hệ thống thương mại điện tử và quản lý kinh doanh quần áo có khả năng vận hành như một cửa hàng thực tế.

Hệ thống bao gồm:

1. Website bán hàng dành cho khách hàng.
2. POS phục vụ bán hàng trực tiếp.
3. Admin Dashboard phục vụ quản trị.
4. Backend API xử lý nghiệp vụ.
5. Database quản lý dữ liệu tập trung.
6. Quản lý sản phẩm và biến thể.
7. Quản lý khách hàng.
8. Quản lý kho hàng.
9. Quản lý nhà cung cấp và nhập hàng.
10. Quản lý đơn hàng.
11. Quản lý thanh toán.
12. Quản lý vận chuyển.
13. Quản lý đổi trả và hoàn tiền.
14. Quản lý giá vốn, doanh thu và lợi nhuận.
15. Quản lý nhân viên và phân quyền.
16. Báo cáo và thống kê kinh doanh.

Sản phẩm cuối cùng phải có source code, database, tài liệu kỹ thuật, báo cáo Word và slide thuyết trình.

# 3. MÔ HÌNH KINH DOANH ĐÃ XÁC NHẬN

## 3.1. Mô hình vận hành

- Một cửa hàng vật lý.
- Một website bán hàng online.
- Một hệ thống POS.
- Một kho hàng chung.
- Website và POS sử dụng chung dữ liệu sản phẩm và tồn kho.
- Hỗ trợ khách hàng mua online và mua trực tiếp.
- Có quản lý nhà cung cấp và nhập hàng.
- Có quản lý giá vốn và lợi nhuận.
- Có khả năng mở rộng nhiều chi nhánh và kho trong tương lai.

MVP chỉ triển khai một cửa hàng và một kho.

Không tự ý mở rộng sang nhiều chi nhánh trong giai đoạn MVP.

## 3.2. Các tác nhân

- Customer: khách hàng.
- Sales Staff: nhân viên bán hàng.
- Warehouse Staff: nhân viên kho.
- Manager: người quản lý.
- Administrator: quản trị viên.
- Payment Provider: nhà cung cấp thanh toán.
- Shipping Provider: đơn vị vận chuyển.

# 4. TECHNOLOGY STACK ĐÃ CHỐT

Môi trường phát triển:
- Visual Studio Code.
- Windows.
- Trình độ lập trình: Basic.

Công nghệ:

| Thành phần | Công nghệ |
|---|---|
| Frontend | React |
| Programming Language | TypeScript |
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| UI Styling | Tailwind CSS |
| Containerization | Docker |
| API Architecture | REST API |

Không tự ý thay đổi các công nghệ đã xác nhận.

Nếu cần bổ sung thư viện, framework hoặc dịch vụ bên ngoài, phải:
1. Giải thích lý do.
2. Nêu lợi ích và hạn chế.
3. Đánh giá ảnh hưởng đến kiến trúc.
4. Xin xác nhận trước khi thay đổi quyết định công nghệ.

# 5. SYSTEM ARCHITECTURE

## 5.1. Kiến trúc tổng thể

Sử dụng kiến trúc Modular Monolith.

Không sử dụng Microservices trong MVP.

Các tầng hệ thống:

1. Presentation Layer:
   - Customer Website.
   - POS Interface.
   - Admin Dashboard.

2. API Layer:
   - Express.js.
   - REST API.
   - Authentication Middleware.
   - Authorization Middleware.
   - Validation Middleware.

3. Business Layer:
   - Các module nghiệp vụ độc lập về trách nhiệm.

4. Data Layer:
   - Prisma ORM.
   - PostgreSQL.

5. External Services:
   - Payment Provider.
   - Shipping Provider.
   - Email Service nếu được xác nhận.

## 5.2. Các module chính

1. Identity & Access Management.
2. Product & Catalog Management.
3. Customer Management.
4. Order Management.
5. POS Management.
6. Inventory Management.
7. Supplier Management.
8. Purchasing Management.
9. FIFO Costing Management.
10. Payment Management.
11. Shipping Management.
12. Returns & Refunds.
13. Reports & Analytics.
14. Audit & System Management.

## 5.3. Nguyên tắc kiến trúc

- Frontend không được truy cập trực tiếp database.
- Tất cả nghiệp vụ được xử lý qua Backend API.
- Website và POS dùng chung nghiệp vụ tồn kho.
- Inventory là nguồn xử lý tồn kho tập trung.
- FIFO Costing chịu trách nhiệm xác định giá vốn hàng xuất.
- Các module có ranh giới trách nhiệm rõ ràng.
- Không tạo nhiều nguồn dữ liệu cho cùng một nghiệp vụ.
- Sử dụng transaction cho nghiệp vụ quan trọng.
- Thiết kế đơn giản, dễ hiểu, dễ bảo trì và mở rộng.

# 6. CÁC QUYẾT ĐỊNH NGHIỆP VỤ ĐÃ CHỐT

Đây là những quyết định bắt buộc phải tuân thủ trong toàn bộ dự án.

## 6.1. Phương pháp tính giá vốn: FIFO

Đã xác nhận sử dụng First In, First Out.

Nguyên tắc:
- Hàng nhập trước được tính là hàng xuất trước.
- FIFO được tính riêng theo từng SKU/biến thể và từng kho.
- Mỗi lần nhận hàng hợp lệ tạo một lớp giá vốn.
- Khi xuất hàng, hệ thống lấy số lượng từ lớp giá vốn cũ nhất còn hàng.
- Nếu lớp cũ không đủ số lượng, tiếp tục lấy từ lớp tiếp theo.
- Phải lưu lịch sử phân bổ giá vốn tại thời điểm xuất.
- Không tính lại giá vốn lịch sử theo giá nhập mới.

Ví dụ:

Nhập:
- 10 áo, giá 100.000 đồng/áo.
- 20 áo, giá 120.000 đồng/áo.

Xuất 15 áo:

- 10 áo từ lớp thứ nhất.
- 5 áo từ lớp thứ hai.

COGS = 10 × 100.000 + 5 × 120.000 = 1.600.000 đồng.

Giá vốn phải được lưu chính xác vào lịch sử giao dịch.

## 6.2. Giữ hàng online: Timed Reservation

Đã xác nhận sử dụng cơ chế giữ hàng có thời hạn.

Quy tắc:
- Khi khách đặt hàng thành công, hệ thống kiểm tra tồn kho.
- Nếu đủ hàng, hệ thống tạo reservation.
- Reservation có thời hạn hết hiệu lực.
- Lưu thời điểm hết hạn bằng expires_at.
- Khi reservation hết hạn và đơn chưa được xử lý phù hợp, hệ thống giải phóng hàng.
- Reservation phải có trạng thái rõ ràng.
- Không được xóa lịch sử reservation.
- Không được giải phóng hàng hai lần.
- Thời lượng giữ hàng phải được cấu hình, không hardcode trong logic nghiệp vụ.

Các trạng thái đề xuất:
- ACTIVE.
- CONVERTED.
- RELEASED.
- EXPIRED.

Thời gian giữ hàng cụ thể chưa được xác nhận. Không tự ý quyết định số phút hoặc giờ.

## 6.3. Đơn COD: Reserve Immediately

Đã xác nhận đơn COD giữ hàng ngay khi tạo đơn thành công.

Quy trình:
1. Khách tạo đơn COD.
2. Backend kiểm tra tồn kho khả dụng.
3. Nếu đủ hàng, tạo đơn hàng.
4. Tạo reservation ngay.
5. Cập nhật số lượng reserved.
6. Ghi nhận thời điểm hết hạn nếu thuộc chính sách giữ hàng có thời hạn.
7. Khi đơn được xử lý, chuyển reservation thành xuất kho theo đúng trạng thái nghiệp vụ.
8. Khi đơn bị hủy hoặc hết hạn, giải phóng hàng.

Đơn COD không được bỏ qua bước giữ hàng.

## 6.4. Công thức tồn kho

Available = OnHand - Reserved

Trong đó:
- OnHand: tồn kho thực tế.
- Reserved: số lượng đã giữ.
- Available: số lượng có thể bán.

Ràng buộc:
- OnHand >= 0.
- Reserved >= 0.
- Reserved <= OnHand.
- Không được bán vượt Available.

## 6.5. Phương thức thanh toán

Đã xác nhận hỗ trợ:
- COD.
- CASH.
- ONLINE.

Trạng thái thanh toán độc lập với trạng thái đơn hàng.

Chưa xác nhận cổng thanh toán online cụ thể.

Không tự ý lựa chọn nhà cung cấp thanh toán.

# 7. BUSINESS RULES

## 7.1. Product Management

- Một sản phẩm có thể có nhiều biến thể.
- Biến thể có thể khác nhau về màu sắc, kích thước và thuộc tính.
- Mỗi SKU phải duy nhất.
- Quản lý giá bán, trạng thái và hình ảnh.
- Giá sản phẩm phải được xác thực ở Backend.

## 7.2. Inventory Management

- Tồn kho được quản lý theo SKU.
- Website và POS sử dụng chung kho.
- Mọi thay đổi tồn kho phải có lịch sử.
- Không cho phép cập nhật tồn kho trực tiếp từ Frontend.
- Nhập hàng phải thông qua phiếu nhận hàng.
- Xuất hàng phải thông qua nghiệp vụ bán hàng hoặc nghiệp vụ kho hợp lệ.
- Hủy đơn phải giải phóng reservation.
- Hàng trả về phải được kiểm tra trước khi nhập lại kho bán được.

## 7.3. FIFO Costing

Cần xây dựng hai bảng cốt lõi:

inventory_cost_layers:
- Lưu từng lớp giá vốn.
- Gắn với kho và SKU.
- Liên kết với dòng nhận hàng.
- Lưu số lượng nhận.
- Lưu số lượng còn lại.
- Lưu đơn giá vốn.
- Lưu thời điểm nhận hàng.

cost_layer_allocations:
- Ghi nhận lớp giá vốn được sử dụng.
- Liên kết với dòng đơn hàng và dòng xuất kho.
- Lưu số lượng phân bổ.
- Lưu đơn giá vốn.
- Lưu tổng giá vốn.

Khi xuất hàng:
- Lấy cost layer theo thứ tự nhận hàng tăng dần.
- Phân bổ đủ số lượng cần xuất.
- Giảm remaining_quantity.
- Ghi cost_layer_allocations.
- Ghi nhận tổng COGS.

Không được để một lớp giá vốn có remaining_quantity âm.

Phải xử lý đồng thời khi nhiều giao dịch xuất cùng một SKU.

## 7.4. Order Management

Phân biệt:
- ONLINE.
- POS.

Quản lý:
- Mã đơn.
- Khách hàng.
- Chi tiết sản phẩm.
- Giá bán snapshot.
- Giá vốn snapshot hoặc lịch sử phân bổ FIFO.
- Số lượng.
- Giảm giá.
- Phí vận chuyển.
- Tổng tiền.
- Trạng thái đơn.
- Trạng thái thanh toán.

Không tự ý sửa giá trị lịch sử của đơn đã hoàn tất.

## 7.5. Purchasing Management

- Quản lý nhà cung cấp.
- Tạo Purchase Order.
- Hỗ trợ nhận hàng nhiều đợt.
- Tạo Goods Receipt.
- Chỉ cập nhật tồn kho khi xác nhận nhận hàng.
- Khi nhận hàng hợp lệ phải tạo FIFO Cost Layer.
- Lưu giá nhập thực tế.
- Không lấy giá trong Purchase Order làm giá vốn nếu giá nhận thực tế khác mà chưa xử lý chênh lệch.

## 7.6. Returns & Refunds

- Khách có thể yêu cầu đổi trả theo chính sách được xác nhận.
- Hàng hoàn phải được kiểm tra.
- Hàng đạt điều kiện mới được nhập lại kho bán được.
- Hàng lỗi phải được quản lý theo trạng thái riêng.
- Hoàn tiền phải có lịch sử.
- Việc trả hàng phải xử lý đúng ảnh hưởng đến doanh thu và giá vốn.

Chưa tự ý quyết định thời hạn và điều kiện đổi trả.

## 7.7. Financial Management

Net Revenue = Gross Sales - Discounts - Returns

Gross Profit = Net Revenue - COGS

Operating Profit = Gross Profit - Operating Expenses

Trong đó:
- COGS phải được tính theo FIFO.
- Doanh thu không đồng nghĩa với tiền đã thu.
- COD chưa thu tiền không được coi là thanh toán hoàn tất.
- Hoàn tiền phải được ghi nhận.
- Chi phí vận hành phải được quản lý riêng nếu có yêu cầu.

# 8. DATABASE DESIGN

Sử dụng PostgreSQL và Prisma.

## 8.1. Các nhóm bảng

Identity:
- users.
- roles.
- permissions.
- user_roles.
- role_permissions.

Product:
- categories.
- brands.
- products.
- product_variants.
- product_images.

Customer:
- customers.
- customer_addresses.

Orders:
- orders.
- order_items.

Inventory:
- warehouses.
- inventory_balances.
- stock_movements.
- stock_movement_items.

Reservations:
- stock_reservations.
- stock_reservation_items.

FIFO Costing:
- inventory_cost_layers.
- cost_layer_allocations.

Purchasing:
- suppliers.
- purchase_orders.
- purchase_order_items.
- goods_receipts.
- goods_receipt_items.

Payments:
- payments.
- refunds.
- payment_webhook_events.

Shipping:
- shipments.

Returns:
- return_requests.
- return_items.

POS:
- pos_sessions.

Audit:
- audit_logs.

## 8.2. Database requirements

Mỗi bảng phải xác định:
- Primary Key.
- Foreign Key.
- Unique Constraint.
- Check Constraint.
- Index.
- Nullable và Not Nullable.
- Default Value.
- Created At.
- Updated At nếu cần.

Yêu cầu:
- Dùng UUID cho định danh chính nếu phù hợp.
- Dùng NUMERIC/DECIMAL cho tiền tệ.
- Không dùng FLOAT cho tiền.
- Dùng TIMESTAMPTZ cho thời gian.
- Dùng INTEGER cho số lượng hàng nếu không có yêu cầu hàng lẻ.
- Có migration.
- Có seed data.
- Không xóa lịch sử tồn kho và tài chính tùy tiện.

## 8.3. Các constraint quan trọng

- Email người dùng phải duy nhất.
- SKU phải duy nhất.
- Mã đơn hàng phải duy nhất.
- Một cặp warehouse_id + variant_id chỉ có một inventory balance.
- OnHand không âm.
- Reserved không âm.
- Reserved không vượt OnHand.
- Remaining quantity của FIFO cost layer không âm.
- Tổng quantity đã phân bổ từ một cost layer không vượt lượng nhận.
- Webhook event ID phải duy nhất theo nhà cung cấp.
- Các số tiền phải không âm trong những nghiệp vụ phù hợp.

## 8.4. Index quan trọng

- users.email.
- product_variants.sku.
- inventory_balances(warehouse_id, variant_id).
- orders.order_code.
- orders(customer_id, created_at).
- stock_reservations(status, expires_at).
- inventory_cost_layers(warehouse_id, variant_id, received_at).
- payments(order_id, status).
- payment_webhook_events(provider, provider_event_id).
- stock_movements(variant_id, created_at).

Phải đánh giá index theo truy vấn thực tế, không tạo index tràn lan.

# 9. TRANSACTION & CONCURRENCY CONTROL

Các nghiệp vụ quan trọng phải có transaction.

## 9.1. Tạo đơn online/COD

1. Kiểm tra dữ liệu sản phẩm.
2. Kiểm tra giá bán từ Backend.
3. Khóa hoặc kiểm soát đồng thời tồn kho.
4. Kiểm tra Available.
5. Tạo Order.
6. Tạo Order Items.
7. Tạo Stock Reservation.
8. Cập nhật Reserved.
9. Commit transaction.

Nếu một bước thất bại, rollback toàn bộ.

## 9.2. Giải phóng reservation

1. Tìm reservation ACTIVE đã hết hạn.
2. Khóa bản ghi.
3. Kiểm tra lại trạng thái.
4. Chuyển sang EXPIRED hoặc RELEASED.
5. Giảm Reserved.
6. Ghi lịch sử phù hợp.
7. Commit transaction.

Phải bảo đảm chỉ giải phóng một lần.

## 9.3. Xuất kho FIFO

1. Xác định kho và SKU.
2. Kiểm tra tồn kho khả dụng.
3. Lấy cost layers còn hàng.
4. Sắp xếp theo received_at tăng dần, có thêm tiêu chí ổn định khi trùng thời gian.
5. Phân bổ số lượng từ lớp cũ nhất.
6. Tiếp tục sang lớp tiếp theo nếu chưa đủ.
7. Tạo cost_layer_allocations.
8. Cập nhật remaining_quantity.
9. Ghi stock movement.
10. Ghi nhận COGS.
11. Commit transaction.

Phải tránh hai giao dịch cùng phân bổ vượt số lượng còn lại của một FIFO layer.

## 9.4. Idempotency

Bắt buộc xử lý các trường hợp:
- Khách gửi yêu cầu tạo đơn nhiều lần.
- Webhook thanh toán gửi lặp.
- Worker hết hạn reservation chạy lại.
- Nhân viên nhấn xác nhận giao dịch nhiều lần.

Không được ghi nhận giao dịch trùng.

# 10. API DESIGN

Sử dụng REST API:

/api/v1

Nhóm endpoint:

- /auth
- /users
- /products
- /categories
- /customers
- /orders
- /pos
- /inventory
- /reservations
- /suppliers
- /purchase-orders
- /goods-receipts
- /payments
- /shipping
- /returns
- /reports

Mỗi endpoint phải mô tả:
- HTTP Method.
- URL.
- Authentication.
- Authorization.
- Request Body.
- Response.
- Validation.
- Error Codes.
- Business Rules.

API phải được thiết kế nhất quán và có thể kiểm thử.

# 11. SECURITY

Bắt buộc:
- Password hashing bằng Argon2id hoặc bcrypt.
- Authentication.
- RBAC.
- Backend authorization.
- Input validation.
- Parameterized queries.
- HTTPS khi triển khai.
- Quản lý secret qua environment variables.
- Bảo vệ webhook.
- Idempotency.
- Audit log.
- Backup và restore database.

Không hardcode password, API key hoặc thông tin bí mật.

# 12. TESTING

Phải xây dựng unit test, integration test và kiểm thử nghiệp vụ phù hợp.

Các tình huống bắt buộc:

Inventory:
- Đặt hàng khi đủ tồn.
- Đặt hàng khi không đủ tồn.
- Hai khách cùng mua sản phẩm cuối cùng.
- Hủy đơn giải phóng hàng.
- Reservation hết hạn.
- Worker chạy lặp.
- Website và POS cùng cập nhật tồn kho.

FIFO:
- Xuất hàng từ một cost layer.
- Xuất hàng qua nhiều cost layer.
- Nhập nhiều đợt với giá khác nhau.
- Hai giao dịch xuất đồng thời.
- Không đủ cost layer để xuất.
- Trả hàng.
- Giá vốn lịch sử không bị thay đổi khi nhập hàng mới.

Orders:
- Đơn online.
- Đơn COD.
- Đơn POS.
- Hủy đơn.
- Đơn thanh toán thất bại.
- Đơn đã hoàn tất.

Purchasing:
- Nhận hàng đầy đủ.
- Nhận hàng một phần.
- Nhận nhiều đợt.
- Giá nhập thực tế khác giá dự kiến.

Payments:
- Thanh toán thành công.
- Thanh toán thất bại.
- Webhook trùng.
- Hoàn tiền.

Không được tuyên bố test thành công nếu chưa thực sự chạy và kiểm tra kết quả.

# 13. DEVELOPMENT ROADMAP

Thực hiện theo thứ tự:

Task 1: Business Requirement Analysis.

Task 2: System Analysis & Design.

Task 3: Physical Database Design & Prisma Schema.

Task 4: Project Initialization & Development Environment.

Task 5: Authentication & RBAC.

Task 6: Product & Catalog Management.

Task 7: Inventory Management & Reservations.

Task 8: Supplier & Purchasing Management.

Task 9: FIFO Costing Management.

Task 10: Order Management.

Task 11: Payment Management.

Task 12: POS Management.

Task 13: Customer Website.

Task 14: Shipping & Returns.

Task 15: Admin Dashboard & Reports.

Task 16: Testing, Security & Optimization.

Task 17: Deployment, Backup & Documentation.

Không tự ý bỏ qua task.

Không triển khai task tiếp theo khi các điều kiện đầu vào quan trọng của task trước chưa được thống nhất.

# 14. DOCUMENTATION & DELIVERABLES

Đầu ra cuối cùng:

1. Source Code đầy đủ.
2. Database Schema và Migration.
3. Báo cáo Word (.docx).
4. Slide thuyết trình.

Tài liệu phải phản ánh đúng hệ thống đã xây dựng.

Bao gồm:
- Business Requirement.
- Use Case Diagram.
- Activity Diagram.
- System Architecture.
- ERD.
- Physical Database Design.
- API Documentation.
- UI Design.
- Implementation.
- Testing.
- Deployment.
- Đánh giá kết quả.
- Hạn chế và hướng phát triển.

Không bịa số liệu, kết quả kiểm thử hoặc chức năng chưa được triển khai.

# 15. DEVELOPMENT RULES

Tôi là người có trình độ lập trình cơ bản.

Khi hướng dẫn:
- Giải thích dễ hiểu.
- Hướng dẫn từng bước trong VS Code.
- Ghi rõ lệnh cần chạy.
- Ghi rõ thư mục đang thao tác.
- Nêu file cần tạo hoặc chỉnh sửa.
- Giải thích nội dung file.
- Hướng dẫn cách chạy.
- Hướng dẫn cách kiểm tra.
- Khi gặp lỗi phải phân tích nguyên nhân.
- Không đưa ra nhiều thay đổi không liên quan trong cùng một bước.

Khi chỉnh sửa code:
- Đọc cấu trúc dự án hiện tại trước.
- Không xóa code đang hoạt động nếu không có lý do.
- Không tự ý đổi kiến trúc.
- Không tạo file trùng lặp.
- Giữ code rõ ràng và dễ bảo trì.
- Cập nhật tài liệu khi thay đổi kiến trúc hoặc API.

# 16. DECISION GOVERNANCE

Mọi quyết định phải được phân thành ba trạng thái:

CONFIRMED:
Đã được người dùng xác nhận.

PROPOSED:
Đề xuất nhưng chưa được xác nhận.

PENDING:
Còn thiếu thông tin.

Các quyết định đã CONFIRMED:

- Mô hình một cửa hàng vật lý.
- Website bán hàng online.
- POS bán hàng tại quầy.
- Một kho chung.
- Website và POS dùng chung tồn kho.
- Thanh toán COD, CASH, ONLINE.
- Có quản lý nhà cung cấp và nhập hàng.
- Có quản lý giá vốn và lợi nhuận.
- Kiến trúc Modular Monolith.
- React + TypeScript.
- Node.js + Express.
- PostgreSQL.
- Prisma.
- Tailwind CSS.
- Docker.
- VS Code.
- Phương pháp giá vốn FIFO.
- Giữ hàng online theo Timed Reservation.
- Đơn COD giữ hàng ngay khi tạo đơn thành công.

Các nội dung còn PENDING:

- Thời lượng giữ hàng cụ thể.
- Cổng thanh toán online.
- Đơn vị vận chuyển.
- Chính sách đổi trả.
- Quản lý chi phí vận hành chi tiết.
- Hóa đơn điện tử.
- Chính sách xử lý đơn hết hạn và thanh toán đang chờ theo từng phương thức.

Không tự ý chuyển PENDING thành CONFIRMED.

Nếu thiếu thông tin quan trọng, hãy hỏi tôi một câu rõ ràng tại một thời điểm hoặc đưa ra phương án đề xuất để tôi xác nhận.

# 17. DEFINITION OF DONE

Một task chỉ được coi là hoàn thành khi:

1. Đáp ứng yêu cầu.
2. Có đầu ra cụ thể.
3. Có kiểm tra hoặc kiểm thử phù hợp.
4. Không còn lỗi nghiêm trọng chưa xử lý.
5. Có tài liệu cập nhật.
6. Có bằng chứng về kết quả.

Mỗi lần kết thúc task phải báo cáo:

- Nội dung đã hoàn thành.
- File đã tạo.
- File đã sửa.
- Các quyết định mới.
- Các kiểm thử đã thực hiện.
- Kết quả kiểm thử.
- Các vấn đề còn tồn tại.
- Task tiếp theo.

Không bao giờ tuyên bố DONE nếu chưa có bằng chứng.
