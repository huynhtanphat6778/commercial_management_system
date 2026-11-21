import { useEffect, useState, type FormEvent } from 'react';
import { api } from './api/mockApi';
import type {
  AdminMetrics,
  Cart,
  InventoryItem,
  Order,
  PosCart,
  PosProduct,
  PosReceipt,
  PosSession,
  Product,
  ProductVariant,
  PurchaseOrder,
} from './api/types';
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Modal,
  ScreenHeading,
  Select,
  Table,
  Toast,
} from './components/ui';

type Workspace = 'store' | 'pos' | 'admin';
type StorePage = 'catalog' | 'product' | 'cart' | 'checkout' | 'orders';
type AdminPage = 'overview' | 'products' | 'inventory' | 'orders' | 'purchases' | 'reports';

function money(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

function useApiRequest<T>(request: () => Promise<T>, dependencies: readonly unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    request()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Vui lòng thử lại sau.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [...dependencies, attempt]);

  return { data, loading, error, retry: () => setAttempt((value) => value + 1), setData };
}

function App() {
  const [workspace, setWorkspace] = useState<Workspace>('store');
  const [storePage, setStorePage] = useState<StorePage>('catalog');
  const [adminPage, setAdminPage] = useState<AdminPage>('overview');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const notify = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(''), 3000);
  };

  const selectWorkspace = (nextWorkspace: Workspace) => {
    setWorkspace(nextWorkspace);
    if (nextWorkspace === 'store') setStorePage('catalog');
    if (nextWorkspace === 'admin') setAdminPage('overview');
  };

  return (
    <div className={`app app--${workspace}`}>
      <header className="topbar">
        <button className="brand-lockup" onClick={() => selectWorkspace('store')} aria-label="Về trang cửa hàng">
          <span className="brand-mark">M.</span>
          <span className="brand-copy">
            <strong>MỘC ATELIER</strong>
            <small>FASHION · DAILY OBJECTS</small>
          </span>
        </button>

        <nav className="workspace-switch" aria-label="Chọn ứng dụng">
          <button className={workspace === 'store' ? 'is-active' : ''} aria-pressed={workspace === 'store'} onClick={() => selectWorkspace('store')}>Cửa hàng</button>
          <button className={workspace === 'pos' ? 'is-active' : ''} aria-pressed={workspace === 'pos'} onClick={() => selectWorkspace('pos')}>POS</button>
          <button className={workspace === 'admin' ? 'is-active' : ''} aria-pressed={workspace === 'admin'} onClick={() => selectWorkspace('admin')}>Quản trị</button>
        </nav>

        {workspace === 'store' ? (
          <nav className="store-links" aria-label="Điều hướng cửa hàng">
            <button onClick={() => setStorePage('catalog')}>Bộ sưu tập</button>
            <button onClick={() => setStorePage('orders')}>Đơn hàng</button>
            <Button variant="secondary" onClick={() => setStorePage('cart')}>Túi hàng <span aria-label="sản phẩm">↗</span></Button>
          </nav>
        ) : (
          <div className="topbar__meta">
            <span className="status-dot" />
            <span>{workspace === 'pos' ? 'Quầy bán hàng' : 'Không gian quản trị'}</span>
          </div>
        )}
      </header>

      {workspace === 'store' && (
        <div className="announcement-bar" role="note">
          <span className="announcement-bar__label">MỘC ATELIER · BST 26</span>
          <span>Những thiết kế tinh giản để mặc mỗi ngày</span>
          <span aria-hidden="true">✦</span>
        </div>
      )}

      {workspace === 'store' && (
        <StoreWorkspace
          page={storePage}
          setPage={setStorePage}
          productId={selectedProductId}
          setProductId={setSelectedProductId}
          notify={notify}
        />
      )}
      {workspace === 'pos' && <PosWorkspace notify={notify} />}
      {workspace === 'admin' && <AdminWorkspace page={adminPage} setPage={setAdminPage} />}
      <Toast message={toastMessage} />
    </div>
  );
}

function ProductArtwork({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div className={`artwork ${large ? 'artwork--large' : ''}`} style={{ backgroundColor: product.artworkColor }} aria-hidden="true">
      <span className="artwork__sun" />
      <span className="artwork__caption">{product.category} · MỘC 26</span>
      <span className={`garment ${product.category === 'Đầm' ? 'garment--dress' : product.category === 'Quần' ? 'garment--trousers' : product.category === 'Áo khoác' ? 'garment--jacket' : 'garment--shirt'}`} />
      <span className="artwork__shadow" />
    </div>
  );
}

function StoreWorkspace({
  page,
  setPage,
  productId,
  setProductId,
  notify,
}: {
  page: StorePage;
  setPage: (page: StorePage) => void;
  productId: string;
  setProductId: (id: string) => void;
  notify: (message: string) => void;
}) {
  const [confirmation, setConfirmation] = useState<Order | null>(null);

  if (page === 'product') {
    return <ProductDetailPage productId={productId} onBack={() => setPage('catalog')} onAdded={() => {
      setPage('cart');
      notify('Đã thêm sản phẩm vào túi hàng.');
    }} />;
  }
  if (page === 'cart') return <CartPage onCheckout={() => {
    setConfirmation(null);
    setPage('checkout');
  }} />;
  if (page === 'checkout') return <CheckoutPage confirmation={confirmation} onPlaced={setConfirmation} onContinue={() => setPage('catalog')} />;
  if (page === 'orders') return <OrderHistoryPage />;
  return <CatalogPage onSelect={(id) => {
    setProductId(id);
    setPage('product');
  }} />;
}

function CatalogPage({ onSelect }: { onSelect: (id: string) => void }) {
  const filtersRequest = useApiRequest(() => api.getCatalogFilters(), []);
  const [queryInput, setQueryInput] = useState('');
  const [filters, setFilters] = useState({ query: '', category: '', size: '', color: '', priceMin: '', priceMax: '' });
  const productsRequest = useApiRequest(
    () => api.getProducts({
      query: filters.query,
      category: filters.category,
      size: filters.size,
      color: filters.color,
      priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
      priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
    }),
    [filters],
  );

  const submitFilters = (event: FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    setFilters({
      query: queryInput,
      category: String(formData.get('category') ?? ''),
      size: String(formData.get('size') ?? ''),
      color: String(formData.get('color') ?? ''),
      priceMin: String(formData.get('priceMin') ?? ''),
      priceMax: String(formData.get('priceMax') ?? ''),
    });
  };

  return (
    <main className="store-main">
      <section className="editorial-hero">
        <div className="editorial-hero__copy">
          <p className="eyebrow">MỘC ATELIER · BỘ SƯU TẬP 26</p>
          <h1 className="display-title">Mặc điều<br /><em>mình thích.</em></h1>
          <p>Thiết kế tinh giản, chất liệu dễ chịu — để mỗi ngày đều có một chút dịu dàng.</p>
          <a className="button button--primary hero-cta" href="#catalog">Khám phá bộ sưu tập <span aria-hidden="true">↘</span></a>
        </div>
        <div className="editorial-hero__art" aria-hidden="true">
          <div className="hero-arch">
            <div className="hero-figure">
              <span className="hero-figure__head" />
              <span className="hero-figure__body" />
              <span className="hero-figure__legs" />
            </div>
          </div>
          <div className="hero-sticker">CHẤT LIỆU<br />MỀM MẠI</div>
          <span className="hero-index">01 — 04 / DAILY UNIFORM</span>
        </div>
      </section>

      <section id="catalog" className="catalog-section">
        <div className="catalog-intro">
          <div>
            <p className="eyebrow">CHỌN MÓN BẠN YÊU</p>
            <h2 className="section-title">Đồ mặc mỗi ngày</h2>
          </div>
          <span className="catalog-count">{productsRequest.data?.length ?? '—'} thiết kế</span>
        </div>
        <form className="filter-bar" onSubmit={submitFilters}>
          <label className="filter-search">
            <span className="sr-only">Tìm sản phẩm</span>
            <input value={queryInput} onChange={(event) => setQueryInput(event.target.value)} placeholder="Tìm tên sản phẩm…" />
            <button type="submit" aria-label="Tìm kiếm">⌕</button>
          </label>
          <Select name="category" label="Danh mục" options={(filtersRequest.data?.categories ?? ['Tất cả']).map((item) => ({ value: item === 'Tất cả' ? '' : item, label: item }))} />
          <Select name="size" label="Kích cỡ" options={[{ value: '', label: 'Mọi size' }, ...(filtersRequest.data?.sizes ?? []).map((item) => ({ value: item, label: item }))]} />
          <Select name="color" label="Màu sắc" options={[{ value: '', label: 'Mọi màu' }, ...(filtersRequest.data?.colors ?? []).map((item) => ({ value: item, label: item }))]} />
          <Input name="priceMin" label="Giá từ" inputMode="numeric" placeholder="0" />
          <Input name="priceMax" label="Đến" inputMode="numeric" placeholder="Không giới hạn" />
          <Button type="submit" variant="secondary">Lọc</Button>
        </form>

        {productsRequest.loading && <LoadingState label="Đang tải bộ sưu tập" />}
        {productsRequest.error && <ErrorState message={productsRequest.error} onRetry={productsRequest.retry} />}
        {!productsRequest.loading && !productsRequest.error && productsRequest.data?.length === 0 && (
          <EmptyState title="Chưa tìm thấy thiết kế phù hợp" message="Thử đổi bộ lọc hoặc xóa từ khóa tìm kiếm." />
        )}
        {!productsRequest.loading && !productsRequest.error && productsRequest.data && productsRequest.data.length > 0 && (
          <div className="product-grid">
            {productsRequest.data.map((product, index) => (
              <button className="product-card" key={product.id} onClick={() => onSelect(product.id)}>
                <div className="product-card__image">
                  <ProductArtwork product={product} />
                  {product.tag && <span className="product-card__tag">{product.tag}</span>}
                  <span className="product-card__index">0{index + 1}</span>
                </div>
                <div className="product-card__details">
                  <div>
                    <p className="product-card__category">{product.category}</p>
                    <h3>{product.name}</h3>
                  </div>
                  <strong>{money(product.price)}</strong>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
      <footer className="store-footer">
        <span>MỘC ATELIER</span>
        <span>Chất liệu tốt · Mặc thật lâu</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}

function ProductDetailPage({
  productId,
  onBack,
  onAdded,
}: {
  productId: string;
  onBack: () => void;
  onAdded: () => void;
}) {
  const productRequest = useApiRequest(() => api.getProduct(productId), [productId]);
  const [variantId, setVariantId] = useState('');
  const [mutationError, setMutationError] = useState('');
  const product = productRequest.data;
  const variant = product?.variants.find((item) => item.id === variantId) ?? product?.variants[0];

  useEffect(() => {
    if (product) setVariantId(product.variants[0]?.id ?? '');
  }, [product?.id]);

  const addProduct = async () => {
    if (!product || !variant) return;
    setMutationError('');
    try {
      await api.addToCart(product, variant.id);
      onAdded();
    } catch (reason) {
      setMutationError(reason instanceof Error ? reason.message : 'Không thể thêm sản phẩm.');
    }
  };

  if (productRequest.loading) return <main className="page-wrap"><LoadingState label="Đang tải sản phẩm" /></main>;
  if (productRequest.error || !product) return <main className="page-wrap"><ErrorState message={productRequest.error || 'Không tìm thấy sản phẩm.'} onRetry={productRequest.retry} /></main>;

  return (
    <main className="page-wrap">
      <button className="back-link" onClick={onBack}>← Quay lại bộ sưu tập</button>
      <div className="product-detail">
        <ProductArtwork product={product} large />
        <section className="product-detail__info">
          <p className="eyebrow">{product.category} · MỘC 26</p>
          <h1 className="display-title">{product.name}</h1>
          <p className="product-detail__price">{money(product.price)}</p>
          <p className="product-detail__description">{product.description}</p>
          <div className="detail-rule" />
          <Select
            label="Màu sắc / kích cỡ"
            value={variant?.id ?? ''}
            onChange={(event) => setVariantId(event.target.value)}
            options={product.variants.map((option) => ({
              value: option.id,
              label: `${option.color} · ${option.size}${option.inStock ? '' : ' · Hết hàng'}`,
            }))}
          />
          <div className="availability-row">
            <Badge tone={variant?.inStock ? 'positive' : 'negative'}>{variant?.inStock ? 'Còn hàng' : 'Hết hàng'}</Badge>
            {variant && <span>SKU {variant.sku}</span>}
          </div>
          <Button className="button--wide" disabled={!variant?.inStock} onClick={addProduct}>Thêm vào túi hàng <span aria-hidden="true">↗</span></Button>
          {mutationError && <p className="inline-error" role="alert">{mutationError}</p>}
          <p className="product-detail__note">Thông tin giá và khả dụng được trả về từ API.</p>
        </section>
      </div>
    </main>
  );
}

function CartPage({ onCheckout }: { onCheckout: () => void }) {
  const request = useApiRequest(() => api.getCart(), []);
  const [mutationError, setMutationError] = useState('');
  const changeQuantity = async (id: string, quantity: number) => {
    setMutationError('');
    try {
      const result = await api.updateCartQuantity(id, quantity);
      request.setData(result);
    } catch (reason) {
      setMutationError(reason instanceof Error ? reason.message : 'Không thể cập nhật túi hàng.');
    }
  };

  return (
    <main className="page-wrap narrow-wrap">
      <ScreenHeading eyebrow="TÚI HÀNG · 01" title="Món đồ đã chọn" description="Kiểm tra lựa chọn của bạn trước khi tiếp tục." />
      {request.loading && <LoadingState label="Đang tải túi hàng" />}
      {request.error && <ErrorState message={request.error} onRetry={request.retry} />}
      {!request.loading && request.data?.items.length === 0 && <EmptyState title="Túi hàng đang trống" message="Khám phá bộ sưu tập để tìm món đồ bạn yêu thích." />}
      {!request.loading && request.data && request.data.items.length > 0 && <CartContents cart={request.data} onChangeQuantity={changeQuantity} onCheckout={onCheckout} mutationError={mutationError} />}
    </main>
  );
}

function CartContents({
  cart,
  onChangeQuantity,
  onCheckout,
  mutationError,
}: {
  cart: Cart;
  onChangeQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
  mutationError: string;
}) {
  return (
    <div className="cart-layout">
      <div className="cart-lines">
        {cart.items.map((item) => (
          <article className="cart-line" key={item.id}>
            <div className="cart-line__swatch" aria-hidden="true" />
            <div className="cart-line__info">
              <h2>{item.productName}</h2>
              <p>{item.color} · {item.size} · SKU {item.sku}</p>
              <strong>{money(item.unitPrice)}</strong>
            </div>
            <div className="quantity-control" aria-label={`Số lượng ${item.productName}`}>
              <button aria-label="Giảm số lượng" onClick={() => onChangeQuantity(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button aria-label="Tăng số lượng" onClick={() => onChangeQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <strong className="cart-line__total">{money(item.lineTotal)}</strong>
          </article>
        ))}
      </div>
      <aside className="summary-card">
        <p className="eyebrow">TÓM TẮT ĐƠN</p>
        <div className="summary-row"><span>Tạm tính</span><strong>{money(cart.subtotal)}</strong></div>
        <div className="summary-row"><span>Phí giao hàng</span><span>{cart.shippingFee === null ? 'Chưa có dữ liệu' : money(cart.shippingFee)}</span></div>
        <div className="summary-total"><span>Tổng cộng</span><strong>{money(cart.total)}</strong></div>
        {mutationError && <p className="inline-error" role="alert">{mutationError}</p>}
        <Button className="button--wide" onClick={onCheckout}>Tiếp tục thanh toán</Button>
        <p className="muted-note">Giá và tổng tiền hiển thị theo phản hồi API.</p>
      </aside>
    </div>
  );
}

function CheckoutPage({
  confirmation,
  onPlaced,
  onContinue,
}: {
  confirmation: Order | null;
  onPlaced: (order: Order | null) => void;
  onContinue: () => void;
}) {
  const cartRequest = useApiRequest(() => api.getCart(), []);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const formData = new FormData(event.currentTarget);
    try {
      const order = await api.placeOrder({
        name: String(formData.get('name') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        address: String(formData.get('address') ?? ''),
        paymentMethod,
      });
      onPlaced(order);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tạo đơn hàng.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <main className="page-wrap narrow-wrap">
        <ReservationConfirmation order={confirmation} onContinue={onContinue} onClear={() => onPlaced(null)} />
      </main>
    );
  }
  if (cartRequest.loading) return <main className="page-wrap"><LoadingState label="Đang kiểm tra túi hàng" /></main>;
  if (cartRequest.error) return <main className="page-wrap"><ErrorState message={cartRequest.error} onRetry={cartRequest.retry} /></main>;
  if (!cartRequest.data?.items.length) return <main className="page-wrap narrow-wrap"><EmptyState title="Không có sản phẩm để thanh toán" message="Túi hàng đang trống hoặc đơn trước đã được tạo." /></main>;

  return (
    <main className="page-wrap narrow-wrap">
      <ScreenHeading eyebrow="THANH TOÁN · 02" title="Thông tin giao hàng" description="Vui lòng nhập thông tin để cửa hàng tạo đơn." />
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submitOrder}>
          <Input name="name" label="Họ và tên" autoComplete="name" required />
          <Input name="phone" label="Số điện thoại" type="tel" autoComplete="tel" required />
          <Input name="address" label="Địa chỉ nhận hàng" autoComplete="street-address" required />
          <fieldset className="payment-options">
            <legend>Phương thức thanh toán</legend>
            <label className={paymentMethod === 'COD' ? 'payment-option is-selected' : 'payment-option'}>
              <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
              <span><strong>Thanh toán khi nhận hàng</strong><small>COD · trả tiền khi nhận đơn</small></span>
            </label>
            <label className={paymentMethod === 'ONLINE' ? 'payment-option is-selected' : 'payment-option'}>
              <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} />
              <span><strong>Thanh toán online</strong><small>Nhà cung cấp thanh toán chưa được kết nối</small></span>
            </label>
          </fieldset>
          {error && <p className="inline-error" role="alert">{error}</p>}
          <Button type="submit" className="button--wide" disabled={submitting}>{submitting ? 'Đang tạo đơn…' : 'Xác nhận đặt hàng'}</Button>
          <p className="muted-note">Không nhập thông tin thẻ. Cổng thanh toán online chưa được xác nhận.</p>
        </form>
        <aside className="summary-card">
          <p className="eyebrow">TÓM TẮT ĐƠN</p>
          {cartRequest.data.items.map((item) => <div className="summary-row" key={item.id}><span>{item.productName} × {item.quantity}</span><strong>{money(item.lineTotal)}</strong></div>)}
          <div className="summary-total"><span>Tổng cộng</span><strong>{money(cartRequest.data.total)}</strong></div>
        </aside>
      </div>
    </main>
  );
}

function ReservationConfirmation({
  order,
  onContinue,
  onClear,
}: {
  order: Order;
  onContinue: () => void;
  onClear: () => void;
}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!order.expiresAt) return;
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, [order.expiresAt]);

  const remaining = order.expiresAt
    ? Math.max(0, Math.ceil((new Date(order.expiresAt).getTime() - now) / 1000))
    : null;

  if (remaining === 0) {
    return (
      <section className="reservation-card reservation-card--expired">
        <span className="reservation-icon" aria-hidden="true">!</span>
        <p className="eyebrow">GIỮ HÀNG ĐÃ KẾT THÚC</p>
        <h1 className="display-title">Đã hết hạn<br />giữ hàng.</h1>
        <p>Thời gian giữ hàng theo API đã hết. Bạn có thể quay lại cửa hàng để kiểm tra tình trạng mới nhất.</p>
        <Button onClick={() => { onClear(); onContinue(); }}>Quay lại cửa hàng</Button>
      </section>
    );
  }

  return (
    <section className="reservation-card">
      <p className="eyebrow">ĐẶT HÀNG THÀNH CÔNG</p>
      <span className="reservation-check" aria-hidden="true">✓</span>
      <h1 className="display-title">Đơn hàng<br /><em>đang được giữ.</em></h1>
      <p>Mã đơn <strong>{order.code}</strong> · {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online'}</p>
      {order.expiresAt && (
        <div className="countdown-panel" role="timer" aria-live="polite">
          <span>Thời gian giữ hàng còn lại</span>
          <strong>{String(Math.floor((remaining ?? 0) / 60)).padStart(2, '0')}:{String((remaining ?? 0) % 60).padStart(2, '0')}</strong>
          <small>Hết hạn lúc {new Date(order.expiresAt).toLocaleTimeString('vi-VN')}</small>
        </div>
      )}
      <p className="muted-note">Mốc hết hạn được lấy từ API; bộ đếm chỉ hiển thị thời gian còn lại.</p>
      <Button variant="secondary" onClick={() => { onClear(); onContinue(); }}>Tiếp tục mua sắm</Button>
    </section>
  );
}

function OrderHistoryPage() {
  const ordersRequest = useApiRequest(() => api.getOrders(), []);
  const returnsRequest = useApiRequest(() => api.getReturnInfo(), []);
  return (
    <main className="page-wrap">
      <ScreenHeading eyebrow="TÀI KHOẢN · LỊCH SỬ" title="Đơn hàng của bạn" description="Theo dõi trạng thái do cửa hàng trả về." />
      {ordersRequest.loading && <LoadingState label="Đang tải lịch sử đơn hàng" />}
      {ordersRequest.error && <ErrorState message={ordersRequest.error} onRetry={ordersRequest.retry} />}
      {!ordersRequest.loading && ordersRequest.data?.length === 0 && <EmptyState title="Bạn chưa có đơn hàng" message="Đơn hàng mới sẽ xuất hiện tại đây." />}
      {!ordersRequest.loading && ordersRequest.data && ordersRequest.data.length > 0 && (
        <div className="order-list">
          {ordersRequest.data.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card__top">
                <div><p className="eyebrow">MÃ ĐƠN</p><h2>{order.code}</h2></div>
                <Badge tone={order.status === 'COMPLETED' ? 'positive' : 'warning'}>{order.status}</Badge>
              </div>
              <p>{order.placedAt} · {order.itemSummary}</p>
              <div className="order-card__bottom">
                <span>{order.paymentMethod} · {order.paymentStatus}</span>
                <strong>{money(order.total)}</strong>
              </div>
              {order.shippingStatus && <p className="muted-note">Vận chuyển: {order.shippingStatus}</p>}
              {!order.shippingStatus && <p className="muted-note">Chưa có dữ liệu đơn vị vận chuyển.</p>}
            </article>
          ))}
        </div>
      )}
      <div className="pending-policy">
        <span className="pending-policy__mark">i</span>
        <div>
          <strong>Đổi trả</strong>
          {returnsRequest.loading && <p>Đang kiểm tra thông tin từ cửa hàng…</p>}
          {returnsRequest.error && <p role="alert">{returnsRequest.error}</p>}
          {returnsRequest.data && <p>{returnsRequest.data.message}</p>}
        </div>
      </div>
    </main>
  );
}

const adminNavigation: Array<{ id: AdminPage; label: string; icon: string }> = [
  { id: 'overview', label: 'Tổng quan', icon: '◫' },
  { id: 'products', label: 'Sản phẩm', icon: '◇' },
  { id: 'inventory', label: 'Tồn kho', icon: '▦' },
  { id: 'orders', label: 'Đơn hàng', icon: '↗' },
  { id: 'purchases', label: 'Nhập hàng', icon: '⇣' },
  { id: 'reports', label: 'Báo cáo', icon: '⌁' },
];

function AdminWorkspace({ page, setPage }: { page: AdminPage; setPage: (page: AdminPage) => void }) {
  const profileRequest = useApiRequest(() => api.getStaffProfile(), []);
  const visibleNavigation = adminNavigation.filter((item) => {
    if (profileRequest.data?.role === 'Warehouse Staff') return ['inventory', 'purchases'].includes(item.id);
    if (profileRequest.data?.role === 'Sales Staff') return ['overview', 'orders'].includes(item.id);
    return true;
  });

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__title"><span className="eyebrow">MỘC ATELIER</span><strong>Vận hành cửa hàng</strong></div>
        <nav aria-label="Điều hướng quản trị">
          {visibleNavigation.map((item) => (
            <button className={page === item.id ? 'admin-nav is-active' : 'admin-nav'} aria-current={page === item.id ? 'page' : undefined} key={item.id} onClick={() => setPage(item.id)}>
              <span aria-hidden="true">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="admin-profile">
          <span className="avatar">MA</span>
          <span><strong>{profileRequest.data?.displayName ?? 'Đang tải hồ sơ'}</strong><small>{profileRequest.data?.role ?? 'Nhân viên'}</small></span>
        </div>
      </aside>
      <main className="admin-content">
        <div className="admin-content__top">
          <div>
            <p className="eyebrow">BẢNG ĐIỀU KHIỂN</p>
            <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <Badge tone="positive">Một cửa hàng · Một kho</Badge>
        </div>
        {page === 'overview' && <AdminOverview />}
        {page === 'products' && <AdminProducts />}
        {page === 'inventory' && <AdminInventory />}
        {page === 'orders' && <AdminOrders />}
        {page === 'purchases' && <AdminPurchases />}
        {page === 'reports' && <AdminReports />}
      </main>
    </div>
  );
}

function AdminOverview() {
  const request = useApiRequest(() => api.getAdminMetrics(), []);
  const metrics = request.data;
  return (
    <>
      <ScreenHeading eyebrow="TỔNG QUAN" title="Chào buổi sáng, Minh Anh." description="Tình hình cửa hàng được tổng hợp từ dữ liệu hệ thống." />
      {request.loading && <LoadingState />}
      {request.error && <ErrorState message={request.error} onRetry={request.retry} />}
      {metrics && <MetricsGrid metrics={metrics} />}
      {metrics && (
        <section className="admin-lower-grid">
          <div className="panel-card">
            <div className="panel-card__head"><div><p className="eyebrow">CẦN CHÚ Ý</p><h2 className="section-title">Tình trạng vận hành</h2></div><Badge tone="warning">Hôm nay</Badge></div>
            <div className="attention-row"><span className="attention-number">{metrics.activeReservations}</span><div><strong>Đơn đang giữ hàng</strong><small>Theo dữ liệu reservation từ API</small></div><span aria-hidden="true">↗</span></div>
            <div className="attention-row"><span className="attention-number">{metrics.lowStockCount}</span><div><strong>Sản phẩm sắp hết</strong><small>Xem tồn khả dụng trong mục Tồn kho</small></div><span aria-hidden="true">↗</span></div>
          </div>
          <div className="admin-note-card">
            <span className="eyebrow">NHẮC NHỞ</span>
            <h2>Con số luôn có nguồn.</h2>
            <p>Doanh thu, giá vốn và tồn kho ở đây do API trả về — giao diện không tự suy diễn nghiệp vụ.</p>
            <span className="admin-note-card__stamp">MỘC / 26</span>
          </div>
        </section>
      )}
    </>
  );
}

function MetricsGrid({ metrics }: { metrics: AdminMetrics }) {
  const items = [
    { label: 'Đơn hàng hôm nay', value: String(metrics.ordersToday), suffix: 'đơn' },
    { label: 'Doanh thu thuần', value: money(metrics.netRevenue), suffix: 'tháng này' },
    { label: 'Giá vốn FIFO', value: money(metrics.cogs), suffix: 'tháng này' },
    { label: 'Lợi nhuận gộp', value: money(metrics.grossProfit), suffix: 'tháng này' },
  ];
  return <div className="metrics-grid">{items.map((item) => <article className="metric-card" key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.suffix}</small></article>)}</div>;
}

function AdminProducts() {
  const request = useApiRequest(() => api.getAdminProducts(), []);
  return (
    <>
      <ScreenHeading eyebrow="DANH MỤC" title="Sản phẩm" description="Danh sách và giá bán từ API sản phẩm." action={<Button variant="secondary" disabled>Thêm sản phẩm</Button>} />
      {request.loading && <LoadingState />}
      {request.error && <ErrorState message={request.error} onRetry={request.retry} />}
      {!request.loading && request.data?.length === 0 && <EmptyState title="Chưa có sản phẩm" message="Sản phẩm được tạo từ công cụ quản trị backend." />}
      {request.data && request.data.length > 0 && (
        <Table label="Danh sách sản phẩm">
          <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Biến thể / SKU</th><th className="align-right">Giá bán</th></tr></thead>
          <tbody>{request.data.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.description}</small></td><td>{product.category}</td><td>{product.variants.map((variant: ProductVariant) => variant.sku).join(', ')}</td><td className="align-right">{money(product.price)}</td></tr>)}</tbody>
        </Table>
      )}
      <p className="muted-note">Chỉnh sửa sản phẩm chưa khả dụng vì API ghi chưa được công bố.</p>
    </>
  );
}

function AdminInventory() {
  const request = useApiRequest(() => api.getInventory(), []);
  return (
    <>
      <ScreenHeading eyebrow="KHO HÀNG · MỘT KHO" title="Tồn kho theo SKU" description="On hand, reserved và available được trả về từ API — không tự tính tại giao diện." />
      {request.loading && <LoadingState />}
      {request.error && <ErrorState message={request.error} onRetry={request.retry} />}
      {!request.loading && request.data?.length === 0 && <EmptyState title="Chưa có dữ liệu kho" message="Tồn kho sẽ hiển thị khi API trả về SKU." />}
      {request.data && request.data.length > 0 && <InventoryTable rows={request.data} />}
    </>
  );
}

function InventoryTable({ rows }: { rows: InventoryItem[] }) {
  return (
    <Table label="Tồn kho theo SKU">
      <thead><tr><th>Sản phẩm</th><th>SKU</th><th className="align-right">On hand</th><th className="align-right">Reserved</th><th className="align-right">Available</th><th>Trạng thái</th></tr></thead>
      <tbody>{rows.map((row) => <tr key={row.sku}><td><strong>{row.productName}</strong><small>{row.variant}</small></td><td><code>{row.sku}</code></td><td className="align-right">{row.onHand}</td><td className="align-right">{row.reserved}</td><td className="align-right"><strong>{row.available}</strong></td><td><Badge tone={row.stockStatus === 'Hết hàng' ? 'negative' : row.stockStatus === 'Sắp hết' ? 'warning' : 'positive'}>{row.stockStatus}</Badge></td></tr>)}</tbody>
    </Table>
  );
}

function AdminOrders() {
  const request = useApiRequest(() => api.getAdminOrders(), []);
  return (
    <>
      <ScreenHeading eyebrow="BÁN HÀNG · ONLINE & POS" title="Đơn hàng" description="Theo dõi trạng thái đơn và thanh toán độc lập." />
      {request.loading && <LoadingState />}
      {request.error && <ErrorState message={request.error} onRetry={request.retry} />}
      {!request.loading && request.data?.length === 0 && <EmptyState title="Chưa có đơn hàng" message="Đơn mới sẽ xuất hiện tại đây." />}
      {request.data && request.data.length > 0 && <Table label="Danh sách đơn hàng"><thead><tr><th>Mã đơn</th><th>Thời điểm</th><th>Thanh toán</th><th>Trạng thái đơn</th><th className="align-right">Tổng</th></tr></thead><tbody>{request.data.map((order) => <tr key={order.id}><td><strong>{order.code}</strong><small>{order.itemSummary}</small></td><td>{order.placedAt}</td><td>{order.paymentMethod}<small>{order.paymentStatus}</small></td><td><Badge tone={order.status === 'COMPLETED' ? 'positive' : 'warning'}>{order.status}</Badge></td><td className="align-right">{money(order.total)}</td></tr>)}</tbody></Table>}
    </>
  );
}

function AdminPurchases() {
  const request = useApiRequest(() => api.getPurchaseOrders(), []);
  return (
    <>
      <ScreenHeading eyebrow="NHÀ CUNG CẤP · GOODS RECEIPT" title="Nhập hàng" description="Theo dõi Purchase Order và trạng thái nhận hàng." action={<Button variant="secondary" disabled>Tạo phiếu nhập</Button>} />
      {request.loading && <LoadingState />}
      {request.error && <ErrorState message={request.error} onRetry={request.retry} />}
      {!request.loading && request.data?.length === 0 && <EmptyState title="Chưa có phiếu nhập" message="Dữ liệu sẽ xuất hiện khi API mua hàng sẵn sàng." />}
      {request.data && request.data.length > 0 && <Table label="Danh sách phiếu nhập"><thead><tr><th>Mã phiếu</th><th>Nhà cung cấp</th><th>Ngày nhận</th><th>Trạng thái</th><th className="align-right">Tổng tiền</th></tr></thead><tbody>{request.data.map((po: PurchaseOrder) => <tr key={po.code}><td><strong>{po.code}</strong></td><td>{po.supplier}</td><td>{po.receivedAt}</td><td><Badge tone={po.status === 'Đã nhận đủ' ? 'positive' : 'warning'}>{po.status}</Badge></td><td className="align-right">{money(po.total)}</td></tr>)}</tbody></Table>}
    </>
  );
}

function AdminReports() {
  const request = useApiRequest(() => api.getBusinessReport(), []);
  const report = request.data;
  return (
    <>
      <ScreenHeading eyebrow={`TÀI CHÍNH · ${report?.periodLabel ?? 'KỲ BÁO CÁO'}`} title="Doanh thu & lợi nhuận" description="Số liệu do API báo cáo trả về. Giá vốn được quản lý theo FIFO." />
      {request.loading && <LoadingState />}
      {request.error && <ErrorState message={request.error} onRetry={request.retry} />}
      {report && <>
        <div className="report-period"><span>Kỳ báo cáo</span><strong>{report.periodLabel}</strong></div>
        <FinancialMetrics netRevenue={report.netRevenue} cogs={report.cogs} grossProfit={report.grossProfit} />
        <section className="panel-card report-chart">
          <div className="panel-card__head"><div><p className="eyebrow">SẢN PHẨM ĐÓNG GÓP</p><h2 className="section-title">Top thiết kế</h2></div><span className="muted-note">Doanh thu thuần · VND</span></div>
          {report.products.map((item) => <div className="bar-row" key={item.name}><div className="bar-row__label"><strong>{item.name}</strong><span>{item.units} sản phẩm · {money(item.netRevenue)}</span></div><div className="bar-track" aria-label={`${item.name}: ${item.sharePercent}%`}><span style={{ width: `${item.sharePercent}%` }} /></div></div>)}
        </section>
        <p className="muted-note">Không bao gồm chi phí vận hành chi tiết vì dữ liệu này đang chờ xác nhận.</p>
      </>}
    </>
  );
}

function FinancialMetrics({
  netRevenue,
  cogs,
  grossProfit,
}: {
  netRevenue: number;
  cogs: number;
  grossProfit: number;
}) {
  const items = [
    { label: 'Doanh thu thuần', value: netRevenue },
    { label: 'Giá vốn FIFO', value: cogs },
    { label: 'Lợi nhuận gộp', value: grossProfit },
  ];
  return <div className="metrics-grid metrics-grid--three">{items.map((item) => <article className="metric-card" key={item.label}><span>{item.label}</span><strong>{money(item.value)}</strong><small>Giá trị do API báo cáo trả về</small></article>)}</div>;
}

function PosWorkspace({ notify }: { notify: (message: string) => void }) {
  const request = useApiRequest(() => api.getPosSnapshot(), []);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<PosProduct[] | null>(null);
  const [cashInput, setCashInput] = useState('');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<PosReceipt | null>(null);
  const [closingCash, setClosingCash] = useState('');
  const [closeMessage, setCloseMessage] = useState('');

  const session: PosSession | null = request.data?.session ?? null;
  const cart: PosCart = request.data?.cart ?? { items: [], total: 0 };
  const searchProducts = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      setResults(await api.searchPosProducts(search));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tìm sản phẩm.');
    }
  };
  const openSession = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await api.openPosSession(Number(cashInput));
      request.retry();
      notify('Đã mở phiên bán hàng.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể mở phiên.');
    }
  };
  const addItem = async (product: PosProduct) => {
    setError('');
    try {
      await api.addPosItem(product);
      request.retry();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể thêm sản phẩm.');
    }
  };
  const finishSale = async () => {
    setError('');
    try {
      const result = await api.completePosSale();
      setReceipt(result.receipt);
      request.retry();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể hoàn tất thanh toán.');
    }
  };
  const finishSession = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const result = await api.closePosSession(Number(closingCash));
      setCloseMessage(`Đã đóng phiên. Tiền cuối ca đã được gửi để đối soát: ${money(result.closingCash)}.`);
      request.retry();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể đóng phiên.');
    }
  };

  return (
    <main className="pos-shell">
      <div className="pos-heading">
        <div><p className="eyebrow">MỘC ATELIER · BÁN TẠI QUẦY</p><h1 className="display-title">Bán hàng nhanh.</h1></div>
        {session?.status === 'OPEN' ? <Badge tone="positive">Phiên đang mở</Badge> : <Badge tone="neutral">Chưa mở phiên</Badge>}
      </div>
      {request.loading && <LoadingState label="Đang tải quầy POS" />}
      {request.error && <ErrorState message={request.error} onRetry={request.retry} />}
      {!request.loading && !request.error && session?.status !== 'OPEN' && (
        <section className="pos-open-card">
          <div><span className="eyebrow">BẮT ĐẦU CA</span><h2>Mở phiên bán hàng</h2><p>Nhập tiền đầu ca để bắt đầu thao tác tại quầy.</p></div>
          <form onSubmit={openSession} className="pos-open-form">
            <Input label="Tiền đầu ca (₫)" type="number" min={0} step={1} inputMode="numeric" value={cashInput} onChange={(event) => setCashInput(event.target.value)} required />
            <Button type="submit">Mở phiên</Button>
          </form>
        </section>
      )}
      {!request.loading && !request.error && session?.status === 'OPEN' && (
        <div className="pos-grid">
          <section className="pos-products">
            <form className="pos-search" onSubmit={searchProducts}>
              <Input label="Tìm theo tên hoặc SKU" placeholder="Ví dụ: Linen hoặc LN-WH-M" value={search} onChange={(event) => setSearch(event.target.value)} />
              <Button type="submit" variant="secondary">Tìm</Button>
            </form>
            <div className="pos-product-list">
              {(results ?? request.data?.products ?? []).map((product) => (
                <article className="pos-product" key={product.sku}>
                  <div className="pos-product__monogram">{product.name.slice(0, 1)}</div>
                  <div><strong>{product.name}</strong><small>{product.variant} · {product.sku}</small><small>{product.stockLabel}</small></div>
                  <div className="pos-product__action"><strong>{money(product.price)}</strong><Button variant="secondary" aria-label={`Thêm ${product.name}`} onClick={() => addItem(product)}>+</Button></div>
                </article>
              ))}
              {results?.length === 0 && <EmptyState title="Không có kết quả" message="Kiểm tra tên sản phẩm hoặc SKU." />}
            </div>
          </section>
          <aside className="pos-cart">
            <div className="pos-cart__head"><div><p className="eyebrow">ĐƠN TẠI QUẦY</p><h2>Giỏ nhanh</h2></div><span>{cart.items.length} dòng</span></div>
            {cart.items.length === 0 ? <EmptyState title="Chưa có sản phẩm" message="Tìm sản phẩm rồi nhấn dấu cộng để thêm vào đơn." /> : cart.items.map((item) => <div className="pos-cart-line" key={item.sku}><div><strong>{item.name}</strong><small>{item.variant} · SL {item.quantity}</small></div><strong>{money(item.lineTotal)}</strong></div>)}
            <div className="pos-cart-total"><span>Tổng đơn</span><strong>{money(cart.total)}</strong></div>
            {error && <p className="inline-error" role="alert">{error}</p>}
            <Button className="button--wide" disabled={cart.items.length === 0} onClick={finishSale}>Thanh toán CASH</Button>
            <form className="pos-close-form" onSubmit={finishSession}>
              <Input label="Tiền cuối ca (₫)" type="number" min={0} step={1} inputMode="numeric" value={closingCash} onChange={(event) => setClosingCash(event.target.value)} required />
              <Button type="submit" variant="quiet">Đóng phiên</Button>
            </form>
            {closeMessage && <p className="inline-success" role="status">{closeMessage}</p>}
          </aside>
        </div>
      )}
      <Modal open={Boolean(receipt)} title="Thanh toán hoàn tất" onClose={() => setReceipt(null)}>
        {receipt && <div className="receipt">
          <div className="receipt__mark">M.</div>
          <p className="eyebrow">HÓA ĐƠN POS · CASH</p>
          <h3>{receipt.code}</h3>
          <p>{receipt.paidAt}</p>
          <div className="summary-total"><span>Tổng đã thanh toán</span><strong>{money(receipt.total)}</strong></div>
          <Button className="button--wide" onClick={() => setReceipt(null)}>Đơn tiếp theo</Button>
        </div>}
      </Modal>
    </main>
  );
}

export default App;
