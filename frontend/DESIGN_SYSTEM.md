# Mộc Atelier — Design System

## Hướng thẩm mỹ

Một cửa hàng thời trang tinh tế và ấm cúng: nền ivory, nâu cacao, nâu đất và beige. Trang chủ dùng điều hướng mảnh, một dải thông điệp ngắn và hero căn giữa theo tinh thần lookbook/editorial — lấy bố cục thoáng của ảnh tham khảo làm cảm hứng, không sao chép nhận diện hay nội dung. Tiêu đề serif tạo cảm giác thủ công; CTA mềm, bo tròn và hình minh họa sản phẩm dùng các tông đất.

## Token giao diện

| Token | Giá trị | Dùng cho |
|---|---|---|
| `cocoa` / `--ink` | `#5A3122` | Chữ chính, CTA |
| `clay` | `#95725A` | Màu đất, điều hướng phụ |
| `tan` / `--acid` | `#CFB291` | Điểm nhấn và minh họa |
| `cream` / `--paper-deep` | `#F5F5DC` | Nền hero và bề mặt phụ |
| `ivory` / `--paper` | `#FCFCF6` | Nền trang |
| `line` / `--line` | `#E6DDCF` | Viền và phân cách |
| `danger` / `--danger` | `#8D3E34` | Lỗi / hết hàng |

- Chữ nội dung: system sans-serif, tối thiểu 12px ở các nhãn thao tác.
- Chữ tiêu đề: Georgia/serif, dùng cho cảm giác tạp chí thời trang.
- Thang khoảng cách cơ bản: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px.
- Bo góc nhẹ cho nút và thẻ; ưu tiên đường viền, sắc độ nền thay cho bóng đổ nặng.
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
