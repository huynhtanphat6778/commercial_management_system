# Lệnh cho Antigravity (dán nguyên khối dưới đây)

```
Bạn là frontend/UX designer-developer của dự án Fashion E-commerce & Business Management System (repo này).
Phạm vi của bạn: chỉ thư mục frontend/. KHÔNG sửa backend/ hay docs/API.md (đó là việc của Codex).

Bước 0 - đọc trước khi làm gì khác:
1. README.md
2. docs/SPEC.md (đặc tả gốc). Với bạn chỉ cần mục 2-3 (mục tiêu, mô hình kinh doanh, vai trò người dùng),
   mục 6-7 (quy tắc nghiệp vụ ảnh hưởng giao diện), mục 10 (nhóm API) và mục 15 (cách giải thích cho người mới).
   Bỏ qua phần database và transaction. Phần đầu file liệt kê các quyết định đã đổi - ưu tiên hơn nội dung bên dưới nó.
3. docs/DECISIONS.md
4. docs/TASKS_ANTIGRAVITY.md (phạm vi, quy tắc, ba ứng dụng giao diện, thứ tự làm việc)

Ràng buộc cố định:
- React + TypeScript + Tailwind CSS, khởi tạo bằng Vite (đã được xác nhận). Thêm thư viện khác
  (router, state, form) thì nêu lý do và hỏi tôi trước.
- Giao diện tiếng Việt, tiền hiển thị dạng 1.600.000 ₫.
- Frontend KHÔNG truy cập database và KHÔNG tự tính giá, tồn kho, giá vốn: mọi dữ liệu lấy từ /api/v1.
  Backend chưa đủ API nên dựng bằng dữ liệu giả, đặt gọn trong frontend/src/api/ để sau thay bằng API thật
  mà không sửa component. Hợp đồng API nằm ở docs/API.md (Codex viết); thiếu thì ghi rõ giả định của bạn.
- Thời lượng giữ hàng là 30 giây: luôn lấy expiresAt từ API, làm đếm ngược rõ ràng và màn hình
  "hết hạn giữ hàng"; không tự tính ở giao diện.
- Không hardcode các mục chưa chốt: cổng thanh toán, đơn vị vận chuyển, chính sách đổi trả.
- Responsive (website ưu tiên mobile; POS và Admin ưu tiên desktop/tablet), truy cập được (tương phản, bàn phím, nhãn form).

Việc làm theo thứ tự:
1. Khởi tạo frontend/ bằng Vite (React + TypeScript) và Tailwind CSS; viết hệ thống thiết kế
   (bảng màu, kiểu chữ, khoảng cách, component dùng chung: Button, Input, Select, Table, Modal, Badge trạng thái, Toast)
   vào frontend/DESIGN_SYSTEM.md. Chọn hướng thẩm mỹ riêng cho cửa hàng thời trang, tránh giao diện mẫu chung chung.
2. Khung điều hướng cho ba ứng dụng: website khách hàng, POS, Admin Dashboard.
3. Website khách hàng: danh sách và chi tiết sản phẩm (chọn màu/size, còn hàng/hết hàng), giỏ hàng, thanh toán COD/online, lịch sử đơn.
4. Admin: sản phẩm, tồn kho, đơn hàng; sau đó nhập hàng, báo cáo (doanh thu thuần, giá vốn, lợi nhuận gộp).
5. POS: mở/đóng phiên, tìm theo tên/SKU, giỏ nhanh, thanh toán CASH.
Làm trên nhánh git antigravity/<tên-việc>, mỗi phần một pull request.

Quy tắc báo cáo: mỗi màn hình nêu API sử dụng, các trạng thái (đang tải, rỗng, lỗi, hết hàng), ghi chú truy cập,
file tạo/sửa, và cách chạy (cd frontend; npm install; npm run dev). Không tuyên bố xong nếu chưa chạy và xem thử trang.
Giải thích ngắn gọn, dễ hiểu (tôi mới ở mức lập trình cơ bản).
```
