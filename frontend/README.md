# Mộc Atelier — Frontend

Frontend React + TypeScript + Tailwind CSS, khởi tạo bằng Vite. Giao diện demo có ba không gian: cửa hàng khách hàng, POS và Admin Dashboard. Điều hướng nội bộ dùng state sẵn có của React để không tự thêm thư viện router khi chưa được duyệt.

## Chạy ứng dụng

Trong terminal VS Code:

```powershell
cd frontend
npm install
npm run dev
```

Mở địa chỉ local mà Vite in trong terminal. Tạo bản build kiểm tra bằng `npm run build`.

## API và giả định hiện tại

`src/api/mockApi.ts` là lớp dữ liệu duy nhất của giao diện. Mọi trang gọi lớp này, không truy cập database và không gọi backend trực tiếp. Khi hợp đồng thật được công bố, thay cách triển khai trong thư mục `src/api/`, giữ nguyên component.

Tại thời điểm triển khai, `docs/API.md` chưa tồn tại. Các giả định demo:

- Response mock đại diện cho các nhóm `/api/v1/products`, `/categories`, `/orders`, `/reservations`, `/inventory`, `/purchase-orders`, `/reports`, `/pos` và `/auth`.
- API trả tiền VND, tổng giỏ, `available`, số liệu báo cáo, trạng thái và lựa chọn biến thể đã được tính/xác thực từ phía server.
- Mock đặt `expiresAt` cách thời điểm tạo 30 giây để minh họa; component chỉ đếm ngược từ timestamp API. Cổng online, đơn vị giao hàng và chính sách đổi trả không được tự chọn; giao diện báo rõ dữ liệu/chính sách chưa có.
- Các nút ghi dữ liệu quản trị đang khóa vì chưa có hợp đồng API ghi.

## Màn hình và trạng thái

| Màn hình | Dữ liệu/API giả lập | Loading / rỗng / lỗi / trạng thái đặc biệt |
|---|---|---|
| Bộ sưu tập, lọc và chi tiết sản phẩm | `getCatalogFilters`, `getProducts`, `getProduct` | Có tải/lỗi/thử lại/rỗng; biến thể hết hàng không thể thêm vào túi |
| Túi hàng và thanh toán | `getCart`, `updateCartQuantity`, `placeOrder` | Có tải/lỗi/rỗng; tổng lấy từ API; xác nhận đơn có countdown và màn hình hết hạn theo `expiresAt` |
| Lịch sử đơn | `getOrders`, `getReturnInfo` | Có tải/lỗi/rỗng; không hiển thị chính sách đổi trả hoặc hãng giao hàng chưa được xác nhận |
| Admin: tổng quan, sản phẩm, tồn kho, đơn hàng, nhập hàng, báo cáo | `getStaffProfile`, `getAdminMetrics`, `getAdminProducts`, `getInventory`, `getAdminOrders`, `getPurchaseOrders`, `getBusinessReport` | Có tải/lỗi/thử lại/rỗng; tồn và tài chính hiển thị theo response API |
| POS | `getPosSnapshot`, `searchPosProducts`, `openPosSession`, `addPosItem`, `completePosSale`, `closePosSession` | Có tải/lỗi/rỗng; phải mở phiên trước khi bán; hóa đơn nằm trong hộp thoại truy cập được |

Các nhãn biểu mẫu, focus bàn phím, bảng cuộn ngang, thông báo trạng thái và `prefers-reduced-motion` được hỗ trợ. Chi tiết token và component dùng chung xem [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).
