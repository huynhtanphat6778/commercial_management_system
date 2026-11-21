import type {
  AdminMetrics,
  BusinessReport,
  Cart,
  InventoryItem,
  Order,
  PaymentMethod,
  PosCart,
  PosProduct,
  PosReceipt,
  PosSession,
  Product,
  PurchaseOrder,
  StaffProfile,
} from './types';

const products: Product[] = [
  {
    id: 'p-atelier-shirt',
    name: 'Sơ mi Linen Nắng',
    category: 'Áo',
    price: 890000,
    description:
      'Phom áo thoáng nhẹ, đường may tối giản và chất linen mềm dành cho những ngày nắng dịu.',
    artworkColor: '#CFB291',
    tag: 'BÁN CHẠY',
    variants: [
      { id: 'v-linen-white-s', color: 'Trắng ngà', size: 'S', sku: 'LN-WH-S', inStock: true },
      { id: 'v-linen-white-m', color: 'Trắng ngà', size: 'M', sku: 'LN-WH-M', inStock: true },
      { id: 'v-linen-olive-m', color: 'Olive', size: 'M', sku: 'LN-OL-M', inStock: false },
      { id: 'v-linen-olive-l', color: 'Olive', size: 'L', sku: 'LN-OL-L', inStock: true },
    ],
  },
  {
    id: 'p-midi-dress',
    name: 'Đầm Midi Thềm Nắng',
    category: 'Đầm',
    price: 1290000,
    description:
      'Đầm midi chuyển động mềm mại, có thể mặc đi làm hoặc dạo phố cuối tuần.',
    artworkColor: '#E7D7C2',
    tag: 'MỚI',
    variants: [
      { id: 'v-midi-sand-s', color: 'Cát', size: 'S', sku: 'MD-SA-S', inStock: true },
      { id: 'v-midi-sand-m', color: 'Cát', size: 'M', sku: 'MD-SA-M', inStock: true },
      { id: 'v-midi-ink-m', color: 'Mực', size: 'M', sku: 'MD-IN-M', inStock: false },
    ],
  },
  {
    id: 'p-tailored-trousers',
    name: 'Quần Ống Suông Mộc',
    category: 'Quần',
    price: 1090000,
    description:
      'Cạp cao vừa vặn, ống suông thanh lịch và dễ phối cùng các thiết kế cơ bản.',
    artworkColor: '#F5F5DC',
    variants: [
      { id: 'v-trouser-stone-s', color: 'Đá', size: 'S', sku: 'TR-ST-S', inStock: true },
      { id: 'v-trouser-stone-m', color: 'Đá', size: 'M', sku: 'TR-ST-M', inStock: true },
      { id: 'v-trouser-stone-l', color: 'Đá', size: 'L', sku: 'TR-ST-L', inStock: false },
    ],
  },
  {
    id: 'p-overshirt',
    name: 'Áo Khoác Nhẹ Sương',
    category: 'Áo khoác',
    price: 1590000,
    description:
      'Lớp áo khoác mỏng với sắc xanh trầm, hoàn thiện cho những ngày giao mùa.',
    artworkColor: '#95725A',
    variants: [
      { id: 'v-overshirt-forest-m', color: 'Rêu', size: 'M', sku: 'OS-FR-M', inStock: true },
      { id: 'v-overshirt-forest-l', color: 'Rêu', size: 'L', sku: 'OS-FR-L', inStock: true },
    ],
  },
];

const inventory: InventoryItem[] = [
  { sku: 'LN-WH-S', productName: 'Sơ mi Linen Nắng', variant: 'Trắng ngà / S', onHand: 18, reserved: 2, available: 16, stockStatus: 'Đang bán' },
  { sku: 'LN-WH-M', productName: 'Sơ mi Linen Nắng', variant: 'Trắng ngà / M', onHand: 8, reserved: 1, available: 7, stockStatus: 'Sắp hết' },
  { sku: 'LN-OL-M', productName: 'Sơ mi Linen Nắng', variant: 'Olive / M', onHand: 0, reserved: 0, available: 0, stockStatus: 'Hết hàng' },
  { sku: 'MD-SA-M', productName: 'Đầm Midi Thềm Nắng', variant: 'Cát / M', onHand: 12, reserved: 3, available: 9, stockStatus: 'Đang bán' },
];

const adminMetrics: AdminMetrics = {
  ordersToday: 24,
  activeReservations: 3,
  lowStockCount: 2,
  netRevenue: 28450000,
  cogs: 13980000,
  grossProfit: 14470000,
};

const businessReport: BusinessReport = {
  periodLabel: '01–30 tháng 11, 2026',
  netRevenue: 28450000,
  cogs: 13980000,
  grossProfit: 14470000,
  products: [
    { name: 'Sơ mi Linen Nắng', units: 42, netRevenue: 12600000, sharePercent: 82 },
    { name: 'Đầm Midi Thềm Nắng', units: 26, netRevenue: 9300000, sharePercent: 64 },
    { name: 'Quần Ống Suông Mộc', units: 19, netRevenue: 6550000, sharePercent: 45 },
  ],
};

const purchaseOrders: PurchaseOrder[] = [
  { code: 'PO-2026-031', supplier: 'Xưởng May An Nhiên', receivedAt: '19/11/2026', status: 'Đã nhận đủ', total: 12800000 },
  { code: 'PO-2026-030', supplier: 'Vải Mộc Nhiên', receivedAt: '16/11/2026', status: 'Đang nhận', total: 8450000 },
  { code: 'PO-2026-029', supplier: 'Xưởng May An Nhiên', receivedAt: '12/11/2026', status: 'Đã nhận đủ', total: 15600000 },
];

const staffProfile: StaffProfile = {
  displayName: 'Minh Anh',
  role: 'Administrator',
};

const orders: Order[] = [
  {
    id: 'o-1',
    code: 'MO-2601128',
    placedAt: '20/11/2026 · 14:32',
    status: 'PROCESSING',
    paymentMethod: 'COD',
    paymentStatus: 'Chưa thanh toán',
    total: 2180000,
    expiresAt: null,
    itemSummary: 'Sơ mi Linen Nắng × 1 · Đầm Midi Thềm Nắng × 1',
    shippingStatus: null,
  },
  {
    id: 'o-2',
    code: 'MO-2601096',
    placedAt: '12/11/2026 · 09:18',
    status: 'COMPLETED',
    paymentMethod: 'ONLINE',
    paymentStatus: 'Đã thanh toán',
    total: 1090000,
    expiresAt: null,
    itemSummary: 'Quần Ống Suông Mộc × 1',
    shippingStatus: null,
  },
];

let cart: Cart = {
  items: [
    {
      id: 'cart-linen',
      productId: 'p-atelier-shirt',
      productName: 'Sơ mi Linen Nắng',
      color: 'Trắng ngà',
      size: 'M',
      sku: 'LN-WH-M',
      unitPrice: 890000,
      quantity: 1,
      lineTotal: 890000,
    },
    {
      id: 'cart-midi',
      productId: 'p-midi-dress',
      productName: 'Đầm Midi Thềm Nắng',
      color: 'Cát',
      size: 'M',
      sku: 'MD-SA-M',
      unitPrice: 1290000,
      quantity: 1,
      lineTotal: 1290000,
    },
  ],
  subtotal: 2180000,
  shippingFee: null,
  total: 2180000,
};

let posSession: PosSession = { status: 'CLOSED', openedAt: null, openingCash: null };
let posCart: PosCart = { items: [], total: 0 };
let receiptSequence = 1;
let orderSequence = 1;

const posProducts: PosProduct[] = [
  { productId: 'p-atelier-shirt', name: 'Sơ mi Linen Nắng', sku: 'LN-WH-M', variant: 'Trắng ngà / M', price: 890000, stockLabel: 'Còn 7' },
  { productId: 'p-midi-dress', name: 'Đầm Midi Thềm Nắng', sku: 'MD-SA-M', variant: 'Cát / M', price: 1290000, stockLabel: 'Còn 9' },
  { productId: 'p-tailored-trousers', name: 'Quần Ống Suông Mộc', sku: 'TR-ST-M', variant: 'Đá / M', price: 1090000, stockLabel: 'Còn 5' },
  { productId: 'p-overshirt', name: 'Áo Khoác Nhẹ Sương', sku: 'OS-FR-M', variant: 'Rêu / M', price: 1590000, stockLabel: 'Còn 4' },
];

function respond<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(structuredClone(data)), 180);
  });
}

function updateCartTotals(items: Cart['items']): Cart {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { items, subtotal, shippingFee: null, total: subtotal };
}

export const api = {
  getCatalogFilters: () => respond({
    categories: ['Tất cả', ...new Set(products.map((product) => product.category))],
    sizes: [...new Set(products.flatMap((product) => product.variants.map((variant) => variant.size)))].sort(),
    colors: [...new Set(products.flatMap((product) => product.variants.map((variant) => variant.color)))].sort(),
  }),

  getProducts: (filters: {
    query?: string;
    category?: string;
    size?: string;
    color?: string;
    priceMin?: number;
    priceMax?: number;
  }) => {
    const query = filters.query?.trim().toLocaleLowerCase('vi');
    return respond(
      products.filter((product) => {
        const matchesQuery = !query || `${product.name} ${product.category}`.toLocaleLowerCase('vi').includes(query);
        const matchesCategory = !filters.category || filters.category === 'Tất cả' || product.category === filters.category;
        const matchesSize = !filters.size || product.variants.some((variant) => variant.size === filters.size);
        const matchesColor = !filters.color || product.variants.some((variant) => variant.color === filters.color);
        const matchesMinimumPrice = filters.priceMin === undefined || product.price >= filters.priceMin;
        const matchesMaximumPrice = filters.priceMax === undefined || product.price <= filters.priceMax;
        return matchesQuery && matchesCategory && matchesSize && matchesColor && matchesMinimumPrice && matchesMaximumPrice;
      }),
    );
  },

  getProduct: (id: string) => {
    const product = products.find((entry) => entry.id === id);
    return product ? respond(product) : Promise.reject(new Error('Không tìm thấy sản phẩm.'));
  },

  getCart: () => respond(cart),

  addToCart: (product: Product, variantId: string) => {
    const variant = product.variants.find((entry) => entry.id === variantId);
    if (!variant || !variant.inStock) return Promise.reject(new Error('Biến thể này hiện không còn hàng.'));
    const existing = cart.items.find((line) => line.sku === variant.sku);
    const items = existing
      ? cart.items.map((line) => line.id === existing.id
        ? { ...line, quantity: line.quantity + 1, lineTotal: (line.quantity + 1) * line.unitPrice }
        : line)
      : [...cart.items, {
        id: `cart-${variant.id}`,
        productId: product.id,
        productName: product.name,
        color: variant.color,
        size: variant.size,
        sku: variant.sku,
        unitPrice: product.price,
        quantity: 1,
        lineTotal: product.price,
      }];
    cart = updateCartTotals(items);
    return respond(cart);
  },

  updateCartQuantity: (lineId: string, quantity: number) => {
    const items = quantity < 1
      ? cart.items.filter((line) => line.id !== lineId)
      : cart.items.map((line) => line.id === lineId
        ? { ...line, quantity, lineTotal: line.unitPrice * quantity }
        : line);
    cart = updateCartTotals(items);
    return respond(cart);
  },

  placeOrder: (input: { name: string; phone: string; address: string; paymentMethod: PaymentMethod }) => {
    if (cart.items.length === 0) return Promise.reject(new Error('Giỏ hàng đang trống.'));
    const order: Order = {
      id: `new-${orderSequence}`,
      code: `MO-2611${String(200 + orderSequence)}`,
      placedAt: new Date().toLocaleString('vi-VN'),
      status: 'PENDING',
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === 'ONLINE' ? 'Chờ thanh toán' : 'Chưa thanh toán',
      total: cart.total,
      expiresAt: new Date(Date.now() + 30000).toISOString(),
      itemSummary: cart.items.map((item) => `${item.productName} × ${item.quantity}`).join(' · '),
      shippingStatus: null,
    };
    orderSequence += 1;
    orders.unshift(order);
    cart = { items: [], subtotal: 0, shippingFee: null, total: 0 };
    return respond(order);
  },

  getOrders: () => respond(orders),
  getReturnInfo: () => respond({ available: false, message: 'Chính sách đổi trả chưa được xác nhận.' }),

  getStaffProfile: () => respond(staffProfile),
  getAdminMetrics: () => respond(adminMetrics),
  getAdminProducts: () => respond(products),
  getInventory: () => respond(inventory),
  getAdminOrders: () => respond(orders),
  getPurchaseOrders: () => respond(purchaseOrders),
  getBusinessReport: () => respond(businessReport),

  getPosSnapshot: () => respond({ session: posSession, products: posProducts, cart: posCart }),
  searchPosProducts: (query: string) => {
    const term = query.trim().toLocaleLowerCase('vi');
    return respond(
      term
        ? posProducts.filter((product) => `${product.name} ${product.sku}`.toLocaleLowerCase('vi').includes(term))
        : posProducts,
    );
  },
  openPosSession: (openingCash: number) => {
    posSession = { status: 'OPEN', openedAt: new Date().toISOString(), openingCash };
    posCart = { items: [], total: 0 };
    return respond(posSession);
  },
  addPosItem: (product: PosProduct) => {
    if (posSession.status !== 'OPEN') return Promise.reject(new Error('Vui lòng mở phiên bán hàng trước.'));
    const existing = posCart.items.find((line) => line.sku === product.sku);
    const items = existing
      ? posCart.items.map((line) => line.sku === product.sku
        ? { ...line, quantity: line.quantity + 1, lineTotal: line.price * (line.quantity + 1) }
        : line)
      : [...posCart.items, { ...product, quantity: 1, lineTotal: product.price }];
    posCart = { items, total: items.reduce((sum, line) => sum + line.lineTotal, 0) };
    return respond(posCart);
  },
  completePosSale: () => {
    if (posCart.items.length === 0) return Promise.reject(new Error('Chưa có sản phẩm trong giỏ.'));
    const receipt: PosReceipt = {
      code: `POS-2611-${String(receiptSequence).padStart(3, '0')}`,
      paidAt: new Date().toLocaleString('vi-VN'),
      paymentMethod: 'CASH',
      total: posCart.total,
    };
    receiptSequence += 1;
    posCart = { items: [], total: 0 };
    return respond({ receipt, cart: posCart });
  },
  closePosSession: (closingCash: number) => {
    const result = {
      session: { ...posSession, status: 'CLOSED' as const },
      closingCash,
      openingCash: posSession.openingCash,
    };
    posSession = { status: 'CLOSED', openedAt: null, openingCash: null };
    posCart = { items: [], total: 0 };
    return respond(result);
  },
};
