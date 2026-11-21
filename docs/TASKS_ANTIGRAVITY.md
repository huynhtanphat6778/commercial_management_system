# Giao việc cho Antigravity — Thiết kế web và giao diện

Phạm vi của Antigravity: thư mục `frontend/` (React + TypeScript + Tailwind CSS), thiết kế giao diện, hệ thống thiết kế, trải nghiệm người dùng.
**Không** sửa `backend/` (thuộc về Codex, xem `docs/TASKS_CODEX.md`).

Đọc thêm `docs/SPEC.md` (đặc tả gốc): mục 2–3, 6–7, 10, 15 là phần liên quan tới giao diện. Phần đầu file liệt kê các quyết định đã đổi sau đặc tả, ưu tiên hơn nội dung bên dưới.

## Quy tắc bắt buộc

1. Công nghệ cố định: React, TypeScript, Tailwind CSS. Dùng Vite để khởi tạo (đã được chủ dự án xác nhận). Cần thêm thư viện khác (router, quản lý state, form) thì ghi lý do và chờ xác nhận.
2. Frontend **không** truy cập database và **không** tự tính giá, tồn kho, giá vốn. Mọi dữ liệu và nghiệp vụ lấy từ `/api/v1`. Backend là nơi xác thực giá và tồn kho; frontend chỉ hiển thị.
3. Backend chưa có đủ API: dựng giao diện với dữ liệu giả (mock) đặt trong một lớp `frontend/src/api/` duy nhất, để sau này thay bằng gọi API thật mà không sửa component. Hợp đồng API nằm ở `docs/API.md` (do Codex viết); nếu thiếu, ghi rõ giả định bạn dùng.
4. Giao diện tiếng Việt. Tiền hiển thị theo VND (định dạng `1.600.000 ₫`). Không hardcode các mục PENDING (cổng thanh toán, đơn vị vận chuyển, chính sách đổi trả): hiển thị từ dữ liệu API hoặc để trống có chủ đích. Thời lượng giữ hàng hiện là 30 giây nhưng vẫn lấy `expiresAt` từ API, không tự tính ở giao diện; vì rất ngắn, màn hình đặt hàng cần đếm ngược rõ ràng và xử lý trạng thái "hết hạn giữ hàng".
5. Đáp ứng responsive (ưu tiên mobile cho website khách hàng, desktop/tablet cho POS và Admin), truy cập được (tương phản, bàn phím, nhãn form).

## Ba ứng dụng giao diện

### A. Website khách hàng (Task 13)
- Trang chủ, danh sách sản phẩm (lọc theo danh mục, kích cỡ, màu, giá), trang chi tiết sản phẩm với chọn biến thể (màu/kích cỡ) và hiển thị còn hàng/hết hàng theo dữ liệu API.
- Giỏ hàng, thanh toán (chọn COD hoặc thanh toán online), nhập địa chỉ, xác nhận đơn.
- Trạng thái "đang giữ hàng" cho đơn chưa thanh toán: hiển thị thời điểm hết hạn lấy từ API, không tự tính.
- Đăng ký/đăng nhập, lịch sử đơn hàng, yêu cầu đổi trả.

### B. POS bán tại quầy (giao diện của Task 12)
- Mở/đóng phiên POS (tiền đầu ca, cuối ca).
- Tìm sản phẩm theo tên hoặc SKU (quét mã vạch nếu có), giỏ hàng nhanh, chọn thanh toán CASH, in/hiển thị hóa đơn.
- Tối ưu thao tác nhanh cho nhân viên bán hàng, phím tắt, nút lớn.

### C. Admin Dashboard (giao diện của Task 15)
- Đăng nhập theo vai trò; menu và màn hình ẩn/hiện theo quyền (Administrator, Manager, Sales Staff, Warehouse Staff).
- Quản lý sản phẩm và biến thể, danh mục; tồn kho và lịch sử nhập/xuất; nhà cung cấp, Purchase Order, nhận hàng.
- Đơn hàng (online và POS), thanh toán, vận chuyển, đổi trả và hoàn tiền.
- Báo cáo: doanh thu thuần, giá vốn (COGS), lợi nhuận gộp, top sản phẩm; biểu đồ rõ ràng, có chú thích đơn vị.

## Thứ tự đề xuất

1. Hệ thống thiết kế: bảng màu, kiểu chữ, khoảng cách, token Tailwind, component dùng chung (Button, Input, Select, Table, Modal, Badge trạng thái, Toast). Ghi vào `frontend/DESIGN_SYSTEM.md`.
2. Khung điều hướng cho ba ứng dụng (layout website, layout POS, layout admin).
3. Website khách hàng (luồng xem sản phẩm → giỏ → thanh toán) với mock API.
4. Admin: sản phẩm, tồn kho, đơn hàng; sau đó nhập hàng, báo cáo.
5. POS.
6. Khi backend xong từng module: thay mock bằng API thật và kiểm thử luồng đầu-cuối.

## Bàn giao

Mỗi màn hình: ảnh chụp hoặc mô tả, danh sách API sử dụng, các trạng thái (đang tải, rỗng, lỗi, hết hàng), và ghi chú truy cập. Báo cáo file đã tạo/sửa và cách chạy (`npm install`, `npm run dev` trong `frontend/`).
