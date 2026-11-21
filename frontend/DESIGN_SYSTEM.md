# Mộc Atelier — Design System

## Hướng thẩm mỹ

Một cửa hàng thời trang tối giản, ấm và có chất biên tập: nền giấy ngà, kiểu chữ serif cho tiêu đề, đường kẻ mảnh như lookbook; màu rượu vang và xanh rêu tạo điểm nhấn. Tránh cảm giác dashboard mẫu bằng bố cục bất đối xứng, khoảng trắng rộng và hình minh họa trang phục dựng bằng CSS (không phụ thuộc ảnh bên ngoài).

## Token giao diện

| Token | Giá trị | Dùng cho |
|---|---|---|
| `canvas` / `--paper` | `#F5F2EB` | Nền chung |
| `ink` / `--ink` | `#211D1A` | Chữ chính |
| `wine` / `--wine` | `#5D2635` | CTA chính, tiêu đề nhấn |
| `moss` / `--moss` | `#5F6B55` | Trạng thái tốt, nhãn nhỏ |
| `acid` / `--acid` | `#D9F36A` | Điểm nhấn biên tập |
| `line` / `--line` | `#DED9CE` | Viền và phân cách |
| `danger` / `--danger` | `#9C3C39` | Lỗi / hết hàng |

- Chữ nội dung: system sans-serif, tối thiểu 12px ở các nhãn thao tác.
- Chữ tiêu đề: Georgia/serif, dùng cho cảm giác tạp chí thời trang.
- Thang khoảng cách cơ bản: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px.
- Bo góc nhỏ, ưu tiên đường viền và màu nền thay cho bóng đổ.
- Bố cục khách hàng ưu tiên mobile; POS/Admin dùng bảng và vùng thao tác rộng trên desktop/tablet.

## Component dùng chung

| Component | Quy ước |
|---|---|
| `Button` | `primary`, `secondary`, `quiet`, `danger`; luôn có trạng thái `disabled` và focus nhìn thấy được |
| `Input` | Nhãn luôn hiển thị, có thể truyền hint; dùng `required`, `type` và `autoComplete` theo trường |
| `Select` | Nhãn và option rõ ràng; các lựa chọn sản phẩm/màu/size lấy từ API |
| `Table` | Bảng có tên truy cập được, cuộn ngang trên màn hình nhỏ |
| `Modal` | `role="dialog"`, `aria-modal`, đóng bằng nút hoặc Escape |
| `Badge` | `neutral`, `positive`, `warning`, `negative`, `accent`; không chỉ dùng màu để truyền trạng thái |
| `Toast` | `role="status"` và `aria-live="polite"` |
| Trạng thái dữ liệu | Loading, lỗi có nút thử lại, rỗng và hết hàng có nội dung riêng |

## Truy cập

- Dùng cấu trúc heading, `label`, `fieldset`/`legend`, tên cho bảng và nhãn cho nút icon.
- Điều hướng bằng bàn phím, focus outline rõ; màu chữ tương phản trên nền.
- Có `prefers-reduced-motion`; trạng thái còn/hết hàng đi kèm chữ, không chỉ màu.
- Bộ đếm giữ hàng đọc được qua `role="timer"` và lấy `expiresAt` trong phản hồi API.

## Tailwind CSS

Tailwind 3.4 được cấu hình trong `tailwind.config.js`, `postcss.config.js` và nạp trong `src/index.css`. Các component có lớp CSS ngữ nghĩa cho hệ thống thiết kế; tiện ích Tailwind có thể dùng thêm cho bố cục nhỏ.
