(() => {
  const STORE_KEYS = {
    products: 'artverse_products_v2',
    users: 'artverse_users_v2',
    reviews: 'artverse_reviews_v2',
    orders: 'artverse_orders_v2',
    transactions: 'artverse_transactions_v2',
    messages: 'artverse_messages_v2',
    applications: 'artverse_applications_v2',
    withdrawals: 'artverse_withdrawals_v2',
    disputes: 'artverse_disputes_v2',
    settings: 'artverse_settings_v2',
    currentUser: 'artverse_current_user_v2',
    cart: 'artverse_cart_v2',
    wishlist: 'artverse_wishlist_v2'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const page = document.body.dataset.page || 'home';

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seedOnce() {
    if (!localStorage.getItem(STORE_KEYS.products)) set(STORE_KEYS.products, window.SEED_PRODUCTS || []);
    if (!localStorage.getItem(STORE_KEYS.users)) set(STORE_KEYS.users, window.SEED_USERS || []);
    if (!localStorage.getItem(STORE_KEYS.reviews)) set(STORE_KEYS.reviews, window.SEED_REVIEWS || []);
    if (!localStorage.getItem(STORE_KEYS.orders)) set(STORE_KEYS.orders, window.SEED_ORDERS || []);
    if (!localStorage.getItem(STORE_KEYS.transactions)) set(STORE_KEYS.transactions, window.SEED_TRANSACTIONS || []);
    if (!localStorage.getItem(STORE_KEYS.messages)) set(STORE_KEYS.messages, window.SEED_MESSAGES || []);
    if (!localStorage.getItem(STORE_KEYS.applications)) set(STORE_KEYS.applications, window.SEED_ARTIST_APPLICATIONS || []);
    if (!localStorage.getItem(STORE_KEYS.withdrawals)) set(STORE_KEYS.withdrawals, window.SEED_WITHDRAWALS || []);
    if (!localStorage.getItem(STORE_KEYS.disputes)) set(STORE_KEYS.disputes, window.SEED_DISPUTES || []);
    if (!localStorage.getItem(STORE_KEYS.settings)) set(STORE_KEYS.settings, {coinRate: 1, platformFee: 10});
    if (!localStorage.getItem(STORE_KEYS.cart)) set(STORE_KEYS.cart, []);
    if (!localStorage.getItem(STORE_KEYS.wishlist)) set(STORE_KEYS.wishlist, []);
  }

  const products = () => get(STORE_KEYS.products, []);
  const users = () => get(STORE_KEYS.users, []);
  const reviews = () => get(STORE_KEYS.reviews, []);
  const orders = () => get(STORE_KEYS.orders, []);
  const transactions = () => get(STORE_KEYS.transactions, []);
  const messages = () => get(STORE_KEYS.messages, []);
  const applications = () => get(STORE_KEYS.applications, []);
  const withdrawals = () => get(STORE_KEYS.withdrawals, []);
  const disputes = () => get(STORE_KEYS.disputes, []);
  const settings = () => get(STORE_KEYS.settings, {coinRate: 1, platformFee: 10});
  const currentUser = () => get(STORE_KEYS.currentUser, null);
  const cart = () => get(STORE_KEYS.cart, []);
  const wishlist = () => get(STORE_KEYS.wishlist, []);

  function saveProducts(data){ set(STORE_KEYS.products, data); }
  function saveUsers(data){ set(STORE_KEYS.users, data); }
  function saveReviews(data){ set(STORE_KEYS.reviews, data); }
  function saveOrders(data){ set(STORE_KEYS.orders, data); }
  function saveTransactions(data){ set(STORE_KEYS.transactions, data); }
  function saveMessages(data){ set(STORE_KEYS.messages, data); }
  function saveApplications(data){ set(STORE_KEYS.applications, data); }
  function saveWithdrawals(data){ set(STORE_KEYS.withdrawals, data); }
  function saveDisputes(data){ set(STORE_KEYS.disputes, data); }

  const fmt = new Intl.NumberFormat('th-TH');
  const coin = (n) => `${fmt.format(Number(n || 0))} Coin`;
  const baht = (n) => `฿${fmt.format(Number(n || 0))}`;
  const today = () => new Date().toISOString().slice(0, 10);

  function getUserById(id){ return users().find(u => u.id === id); }
  function getProductById(id){ return products().find(p => p.id === id); }
  function roleLabel(role){ return {buyer:'ผู้ซื้อ', artist:'ศิลปิน', admin:'ผู้ดูแลระบบ'}[role] || 'ผู้ใช้ทั่วไป'; }

  function toast(text) {
    let el = $('#toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2200);
  }

  function requireRole(roles) {
    const user = currentUser();
    if (!user || !roles.includes(user.role)) {
      window.location.href = `login.html?next=${encodeURIComponent(location.pathname.split('/').pop() || 'index.html')}`;
      return false;
    }
    return true;
  }

  function buildHeader() {
    const user = currentUser();
    const cartCount = cart().reduce((sum, item) => sum + item.qty, 0);
    const wishCount = wishlist().length;
    const header = $('#siteHeader');
    if (!header) return;
    header.innerHTML = `
      <div class="topbar wrap">
        <a class="brand" href="index.html" aria-label="ArtVerse home">
          <span class="brand-mark">A</span>
          <span class="brand-name">ArtVerse</span>
        </a>
        <nav class="main-nav" id="mainNav">
          <a href="index.html">ตลาด</a>
          <a href="index.html#unique">หนึ่งเดียวในโลก</a>
          <a href="chat.html">แชท</a>
          <a href="wallet.html">Coin Wallet</a>
          ${user?.role === 'artist' ? '<a href="artist-dashboard.html">Artist Dashboard</a>' : ''}
          ${user?.role === 'admin' ? '<a href="admin-dashboard.html">Admin Dashboard</a>' : ''}
        </nav>
        <form class="search-box header-search" role="search">
          <span>⌕</span>
          <input type="search" id="globalSearch" placeholder="ค้นหาผลงาน ศิลปิน หมวดหมู่..." />
        </form>
        <div class="actions">
          <a class="pill hide-sm" href="wallet.html">THB / Coin</a>
          <a class="icon-link" href="buyer-dashboard.html#wishlist" title="Wishlist">♡<em>${wishCount}</em></a>
          <a class="icon-link" href="cart.html" title="Cart">🛒<em>${cartCount}</em></a>
          ${user ? `
            <div class="user-menu">
              <button class="avatar-btn" id="userMenuBtn">${user.avatar || '👤'} <span>${user.name}</span></button>
              <div class="user-pop" id="userPop">
                <strong>${user.name}</strong>
                <small>${roleLabel(user.role)} • ${coin(user.coins || 0)}</small>
                <a href="buyer-dashboard.html">Buyer Dashboard</a>
                <a href="artist-dashboard.html">Artist Dashboard</a>
                <a href="admin-dashboard.html">Admin Dashboard</a>
                <button id="logoutBtn">ออกจากระบบ</button>
              </div>
            </div>
          ` : '<a class="btn small" href="login.html">เข้าสู่ระบบ</a>'}
          <button class="menu-btn" id="menuBtn">☰</button>
        </div>
      </div>
      <nav class="category-nav wrap">
        <a href="index.html?category=ภาพวาด">ภาพวาด</a>
        <a href="index.html?category=ดิจิทัลอาร์ต">ดิจิทัลอาร์ต</a>
        <a href="index.html?category=ภาพพิมพ์">ภาพพิมพ์</a>
        <a href="index.html?category=หนังสือและอีบุ๊ก">หนังสือและอีบุ๊ก</a>
        <a href="index.html?category=พวงกุญแจ">พวงกุญแจ</a>
        <a href="index.html?category=สติกเกอร์">สติกเกอร์</a>
        <a href="index.html?category=VTuber%20%26%20Streamer">VTuber & Streamer</a>
      </nav>
    `;

    $('#globalSearch')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = e.target.value.trim();
        window.location.href = q ? `index.html?q=${encodeURIComponent(q)}` : 'index.html';
      }
    });
    $('#menuBtn')?.addEventListener('click', () => $('#mainNav')?.classList.toggle('open'));
    $('#userMenuBtn')?.addEventListener('click', () => $('#userPop')?.classList.toggle('show'));
    $('#logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem(STORE_KEYS.currentUser);
      toast('ออกจากระบบแล้ว');
      setTimeout(() => window.location.href = 'index.html', 400);
    });
  }

  function buildFooter() {
    const footer = $('#siteFooter');
    if (!footer) return;
    footer.innerHTML = `
      <div class="wrap footer-grid">
        <div>
          <div class="brand footer-brand"><span class="brand-mark">A</span><span class="brand-name">ArtVerse</span></div>
          <p>ต้นแบบแพลตฟอร์มขายผลงานศิลปะออนไลน์ พร้อมระบบซื้อขายด้วย Coin Wallet สำหรับโครงงาน</p>
        </div>
        <div><h4>ระบบหลัก</h4><a href="index.html">ตลาดผลงาน</a><a href="cart.html">ตะกร้า</a><a href="wallet.html">Coin Wallet</a><a href="chat.html">แชท</a></div>
        <div><h4>แดชบอร์ด</h4><a href="buyer-dashboard.html">ผู้ซื้อ</a><a href="artist-dashboard.html">ศิลปิน</a><a href="admin-dashboard.html">ผู้ดูแลระบบ</a></div>
        <div><h4>บัญชี Demo</h4><p>buyer@example.com<br>artist@example.com<br>admin@example.com<br>รหัสผ่าน 12345678</p></div>
      </div>
    `;
  }

  function productCard(p, options = {}) {
    const loved = wishlist().includes(p.id);
    return `
      <article class="product-card ${p.unique ? 'unique-card' : ''}" data-id="${p.id}" data-category="${p.category}">
        <a class="thumb" href="product.html?id=${p.id}">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
          ${p.unique ? '<span class="badge purple">หนึ่งเดียว</span>' : ''}
        </a>
        <div class="card-body">
          <div class="creator">${p.creator} ${p.verified ? '<span class="verified">✓</span>' : ''}</div>
          <h3><a href="product.html?id=${p.id}">${p.title}</a></h3>
          <button class="heart ${loved ? 'loved' : ''}" data-wishlist="${p.id}" aria-label="wishlist">${loved ? '♥' : '♡'}</button>
          <div class="price">${coin(p.priceCoins)}</div>
          <p class="meta"><span>★ ${p.rating}</span><span>ขายแล้ว ${fmt.format(p.sold)}</span></p>
          <p class="meta"><span>${p.type}</span><span>${p.delivery}</span></p>
          <div class="card-actions">
            <button class="btn ghost small" data-cart="${p.id}">เพิ่มตะกร้า</button>
            <a class="btn small" href="product.html?id=${p.id}">ดูรายละเอียด</a>
          </div>
        </div>
      </article>
    `;
  }

  function bindProductActions(root = document) {
    $$('[data-cart]', root).forEach(btn => {
      btn.addEventListener('click', () => addToCart(btn.dataset.cart, 1));
    });
    $$('[data-wishlist]', root).forEach(btn => {
      btn.addEventListener('click', () => toggleWishlist(btn.dataset.wishlist));
    });
  }

  function addToCart(productId, qty = 1) {
    const p = getProductById(productId);
    if (!p) return;
    if (p.stock <= 0 || p.status !== 'published') return toast('สินค้านี้ไม่พร้อมขาย');
    const data = cart();
    const found = data.find(i => i.productId === productId);
    if (found) found.qty += qty;
    else data.push({productId, qty});
    set(STORE_KEYS.cart, data);
    toast('เพิ่มลงตะกร้าแล้ว');
    buildHeader();
  }

  function toggleWishlist(productId) {
    const user = currentUser();
    if (!user) {
      toast('กรุณาเข้าสู่ระบบก่อนเพิ่ม Wishlist');
      return;
    }
    const data = wishlist();
    const idx = data.indexOf(productId);
    if (idx >= 0) {
      data.splice(idx, 1);
      toast('ลบออกจาก Wishlist แล้ว');
    } else {
      data.push(productId);
      toast('เพิ่มใน Wishlist แล้ว');
    }
    set(STORE_KEYS.wishlist, data);
    buildHeader();
    refreshCurrentPage();
  }

  function updateCurrentUser(newUser) {
    const all = users().map(u => u.id === newUser.id ? newUser : u);
    saveUsers(all);
    set(STORE_KEYS.currentUser, newUser);
  }

  function pageTitle(title, sub) {
    return `<div class="page-title"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
  }

  function renderHome() {
    const params = new URLSearchParams(location.search);
    const initialQ = params.get('q') || '';
    const initialCat = params.get('category') || 'ทั้งหมด';
    const all = products().filter(p => p.status === 'published');
    const categories = ['ทั้งหมด', ...new Set(all.map(p => p.category))];
    const container = $('#homeApp');
    if (!container) return;
    container.innerHTML = `
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow">Online Art Marketplace</span>
          <h1>ค้นหา ซื้อขาย และสนับสนุนผลงานศิลปะด้วยระบบ Coin</h1>
          <p>หน้าเว็บต้นแบบครบตามขอบเขตโครงงาน: ผู้ใช้ทั่วไป ผู้ซื้อ ศิลปิน และผู้ดูแลระบบ</p>
          <div class="hero-actions">
            <a class="btn" href="#market">เริ่มดูผลงาน</a>
            <a class="btn ghost" href="login.html?role=artist">สมัครเป็นศิลปิน</a>
          </div>
        </div>
        <div class="hero-panel">
          ${all.slice(0,4).map(p => `<img src="${p.image}" alt="${p.title}">`).join('')}
        </div>
      </section>

      <section class="section" id="market">
        <div class="section-head">
          <div><h2>ตลาดผลงานศิลปะ</h2><p>ค้นหาตามหมวดหมู่ ประเภท ศิลปิน ราคา และเงื่อนไขต่าง ๆ</p></div>
          <a href="login.html" class="btn ghost small">ลงทะเบียนใช้งานระบบซื้อ–ขาย</a>
        </div>
        <div class="filter-panel">
          <div class="field grow"><label>ค้นหา</label><input id="searchInput" type="search" value="${initialQ}" placeholder="ชื่อผลงาน / ศิลปิน / แท็ก"></div>
          <div class="field"><label>หมวดหมู่</label><select id="categorySelect">${categories.map(c => `<option ${c === initialCat ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
          <div class="field"><label>ประเภท</label><select id="typeSelect"><option>ทั้งหมด</option><option>สินค้าจัดส่ง</option><option>สินค้าดิจิทัล</option></select></div>
          <div class="field"><label>ราคาเหรียญสูงสุด</label><input id="maxPrice" type="number" min="0" placeholder="เช่น 500"></div>
          <button class="btn" id="applyFilter">ค้นหา</button>
        </div>
        <div class="chip-row" id="quickFilters">
          <button class="chip active" data-quick="all">Hot 🔥</button>
          <button class="chip" data-quick="featured">Featured</button>
          <button class="chip" data-quick="unique">หนึ่งเดียวในโลก</button>
          <button class="chip" data-quick="digital">สินค้าดิจิทัล</button>
          <button class="chip" data-quick="shipping">สินค้าจัดส่ง</button>
          <button class="chip" data-quick="low">ไม่เกิน 100 Coin</button>
        </div>
        <div class="grid products-grid" id="productGrid"></div>
      </section>

      <section class="section" id="unique">
        <div class="section-head"><div><h2>สินค้าหนึ่งเดียวในโลก</h2><p>ผลงานที่มีจำนวนจำกัดและเหมาะสำหรับนักสะสม</p></div></div>
        <div class="scroll-row">${all.filter(p => p.unique).map(productCard).join('')}</div>
      </section>

      <section class="role-section">
        <article><h3>Guest</h3><p>ดูผลงาน ค้นหา ดูรายละเอียด โปรไฟล์ศิลปิน และรีวิวได้โดยไม่ต้องสมัคร</p></article>
        <article><h3>Buyer</h3><p>เติมเหรียญ ซื้อสินค้า ติดตามคำสั่งซื้อ รีวิว แชท และแจ้งปัญหา</p></article>
        <article><h3>Artist</h3><p>อัปโหลดผลงาน ตั้งราคา จัดการคำสั่งซื้อ รับเหรียญ และถอนเป็นเงินบาท</p></article>
        <article><h3>Admin</h3><p>อนุมัติศิลปิน คัดกรองผลงาน จัดการ Coin ถอนเงิน ข้อพิพาท และรายงาน</p></article>
      </section>
    `;

    let quick = 'all';
    function apply() {
      const q = $('#searchInput').value.toLowerCase().trim();
      const cat = $('#categorySelect').value;
      const type = $('#typeSelect').value;
      const max = Number($('#maxPrice').value || 0);
      let data = all.filter(p => {
        const text = `${p.title} ${p.creator} ${p.category} ${p.tags.join(' ')}`.toLowerCase();
        if (q && !text.includes(q)) return false;
        if (cat !== 'ทั้งหมด' && p.category !== cat) return false;
        if (type !== 'ทั้งหมด' && p.type !== type) return false;
        if (max > 0 && p.priceCoins > max) return false;
        if (quick === 'featured' && !p.featured) return false;
        if (quick === 'unique' && !p.unique) return false;
        if (quick === 'digital' && p.type !== 'สินค้าดิจิทัล') return false;
        if (quick === 'shipping' && p.type !== 'สินค้าจัดส่ง') return false;
        if (quick === 'low' && p.priceCoins > 100) return false;
        return true;
      });
      $('#productGrid').innerHTML = data.length ? data.map(productCard).join('') : '<div class="empty">ไม่พบผลงานตามเงื่อนไขที่ค้นหา</div>';
      bindProductActions($('#productGrid'));
    }

    $('#applyFilter').addEventListener('click', apply);
    ['searchInput','categorySelect','typeSelect','maxPrice'].forEach(id => $('#'+id).addEventListener('input', apply));
    $$('#quickFilters .chip').forEach(chip => chip.addEventListener('click', () => {
      $$('#quickFilters .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      quick = chip.dataset.quick;
      apply();
    }));
    bindProductActions(container);
    apply();
  }

  function renderProductDetail() {
    const id = new URLSearchParams(location.search).get('id') || 'p001';
    const p = getProductById(id);
    const container = $('#productApp');
    if (!container) return;
    if (!p) {
      container.innerHTML = '<div class="empty">ไม่พบสินค้า</div>';
      return;
    }
    const artistProducts = products().filter(x => x.artistId === p.artistId && x.id !== p.id && x.status === 'published').slice(0, 4);
    const productReviews = reviews().filter(r => r.productId === p.id);
    const artist = getUserById(p.artistId) || {name:p.creator, bio:'ศิลปินบนแพลตฟอร์ม ArtVerse', coins:0};
    const loved = wishlist().includes(p.id);
    container.innerHTML = `
      <section class="product-detail">
        <div class="detail-gallery"><img src="${p.image}" alt="${p.title}"></div>
        <div class="detail-info">
          <div class="crumb">ตลาด / ${p.category} / ${p.type}</div>
          <h1>${p.title}</h1>
          <div class="creator big">${p.creator} ${p.verified ? '<span class="verified">✓</span>' : ''}</div>
          <div class="rating-line">★ ${p.rating} • ${p.reviews} รีวิว • ขายแล้ว ${fmt.format(p.sold)} ชิ้น</div>
          <div class="detail-price">${coin(p.priceCoins)} <small>${baht(p.priceBaht)}</small></div>
          <p>${p.description}</p>
          <div class="info-list">
            <span>สถานะ: ${p.stock > 0 ? 'พร้อมขาย' : 'ขายแล้ว'}</span>
            <span>คงเหลือ: ${p.stock}</span>
            <span>การรับสินค้า: ${p.delivery}</span>
            <span>แท็ก: ${p.tags.map(t => `#${t}`).join(' ')}</span>
          </div>
          <div class="detail-actions">
            <button class="btn" data-cart="${p.id}">เพิ่มลงตะกร้า</button>
            <button class="btn pink" id="buyNowBtn">ซื้อด้วยเหรียญทันที</button>
            <button class="btn ghost" data-wishlist="${p.id}">${loved ? '♥ อยู่ใน Wishlist' : '♡ เพิ่ม Wishlist'}</button>
          </div>
        </div>
      </section>

      <section class="section two-col">
        <div class="panel">
          <h2>รายละเอียดผลงาน</h2>
          <p>${p.description}</p>
          <ul class="check-list">
            <li>ผู้ใช้ทั่วไปสามารถเข้าดูรายละเอียดนี้ได้โดยไม่ต้องลงทะเบียน</li>
            <li>ผู้ซื้อสามารถเพิ่มตะกร้า ซื้อด้วยเหรียญ และรีวิวหลังได้รับสินค้า</li>
            <li>ศิลปินสามารถกำหนดราคา หมวดหมู่ แท็ก และสถานะการแสดงผลงาน</li>
          </ul>
        </div>
        <div class="panel artist-card">
          <h2>โปรไฟล์ศิลปิน</h2>
          <div class="artist-box"><div class="artist-avatar">${artist.avatar || '🎨'}</div><div><h3>${p.creator}</h3><p>${artist.bio || 'ศิลปินบนแพลตฟอร์ม ArtVerse'}</p><a class="btn ghost small" href="chat.html?artist=${p.artistId}">แชทกับศิลปิน</a></div></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>คะแนนและรีวิว</h2><p>รีวิวจากผู้ซื้อหลังได้รับสินค้า</p></div><button class="btn ghost small" id="reviewBtn">เขียนรีวิว</button></div>
        <div class="review-list" id="reviewList">
          ${productReviews.length ? productReviews.map(reviewCard).join('') : '<div class="empty">ยังไม่มีรีวิวสำหรับสินค้านี้</div>'}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>ผลงานอื่นจากศิลปิน</h2></div></div>
        <div class="scroll-row">${artistProducts.length ? artistProducts.map(productCard).join('') : '<div class="empty">ยังไม่มีผลงานอื่น</div>'}</div>
      </section>
    `;
    bindProductActions(container);
    $('#buyNowBtn')?.addEventListener('click', () => buyNow(p.id));
    $('#reviewBtn')?.addEventListener('click', () => addReviewFlow(p.id));
  }

  function reviewCard(r) {
    return `<article class="review-card"><div><strong>${r.user}</strong><span>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span></div><p>${r.text}</p>${r.reply ? `<blockquote>ศิลปินตอบกลับ: ${r.reply}</blockquote>` : ''}<small>${r.date}</small></article>`;
  }

  function buyNow(productId) {
    const user = currentUser();
    const p = getProductById(productId);
    if (!user) return window.location.href = `login.html?next=product.html?id=${productId}`;
    if (user.role !== 'buyer') return toast('บัญชีผู้ซื้้อเท่านั้นที่สามารถซื้อสินค้าได้');
    if ((user.coins || 0) < p.priceCoins) return toast('เหรียญไม่พอ กรุณาเติมเหรียญก่อน');
    const ok = confirm(`ยืนยันซื้อ ${p.title} ราคา ${coin(p.priceCoins)} ?`);
    if (!ok) return;
    user.coins -= p.priceCoins;
    updateCurrentUser(user);
    const fee = Math.round(p.priceCoins * (settings().platformFee / 100));
    const artist = getUserById(p.artistId);
    if (artist) {
      artist.coins = (artist.coins || 0) + (p.priceCoins - fee);
      saveUsers(users().map(u => u.id === artist.id ? artist : u));
    }
    const newOrder = {id:`ORD-${Date.now().toString().slice(-6)}`, buyerId:user.id, artistId:p.artistId, items:[{productId:p.id, qty:1, priceCoins:p.priceCoins}], totalCoins:p.priceCoins, status:'รอยืนยันคำสั่งซื้อ', tracking:'', date:today(), problem:false};
    saveOrders([newOrder, ...orders()]);
    saveTransactions([{id:`TX-${Date.now().toString().slice(-6)}`, userId:user.id, type:'ซื้อสินค้า', amount:-p.priceCoins, note:newOrder.id, date:today()}, ...transactions()]);
    toast('สั่งซื้อสำเร็จ');
    setTimeout(() => window.location.href = 'buyer-dashboard.html#orders', 700);
  }

  function addReviewFlow(productId) {
    const user = currentUser();
    if (!user) return window.location.href = `login.html?next=product.html?id=${productId}`;
    const text = prompt('เขียนรีวิวผลงานนี้');
    if (!text) return;
    const rating = Math.max(1, Math.min(5, Number(prompt('ให้คะแนน 1-5', '5') || 5)));
    saveReviews([{id:`R-${Date.now()}`, productId, user:user.name, rating, text, date:today(), reply:''}, ...reviews()]);
    toast('เพิ่มรีวิวแล้ว');
    renderProductDetail();
  }

  function renderLogin() {
    const container = $('#loginApp');
    if (!container) return;
    const params = new URLSearchParams(location.search);
    const selectedRole = params.get('role') || 'buyer';
    container.innerHTML = `
      <section class="auth-wrap">
        <div class="auth-copy">
          <span class="eyebrow">ArtVerse Account</span>
          <h1>เข้าสู่ระบบหรือสมัครสมาชิก</h1>
          <p>ใช้บัญชี Demo เพื่อทดลองทุกบทบาท</p>
          <div class="demo-box">
            <p><strong>Buyer:</strong> buyer@example.com / 12345678</p>
            <p><strong>Artist:</strong> artist@example.com / 12345678</p>
            <p><strong>Admin:</strong> admin@example.com / 12345678</p>
          </div>
        </div>
        <div class="auth-card">
          <div class="tabs"><button class="tab active" data-tab="loginPanel">เข้าสู่ระบบ</button><button class="tab" data-tab="registerPanel">สมัครสมาชิก</button></div>
          <form id="loginPanel" class="tab-panel active">
            <div class="field"><label>Email</label><input id="loginEmail" type="email" value="buyer@example.com" required></div>
            <div class="field"><label>Password</label><input id="loginPassword" type="password" value="12345678" required></div>
            <button class="btn full">เข้าสู่ระบบ</button>
          </form>
          <form id="registerPanel" class="tab-panel">
            <div class="field"><label>ชื่อผู้ใช้</label><input id="regName" required placeholder="เช่น Panitan"></div>
            <div class="field"><label>Email</label><input id="regEmail" type="email" required placeholder="you@example.com"></div>
            <div class="field"><label>Password</label><input id="regPassword" type="password" minlength="8" required placeholder="อย่างน้อย 8 ตัวอักษร"></div>
            <div class="field"><label>สมัครเป็น</label><select id="regRole"><option value="buyer">ผู้ซื้อ</option><option value="artist" ${selectedRole === 'artist' ? 'selected' : ''}>ศิลปิน / ผู้ขาย</option></select></div>
            <button class="btn full pink">สมัครสมาชิก</button>
          </form>
        </div>
      </section>
    `;
    $$('.tab').forEach(tab => tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.remove('active'));
      $$('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      $('#'+tab.dataset.tab).classList.add('active');
    }));
    $('#loginPanel').addEventListener('submit', e => {
      e.preventDefault();
      const email = $('#loginEmail').value.trim();
      const pass = $('#loginPassword').value;
      const user = users().find(u => u.email === email && u.password === pass);
      if (!user) return toast('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      set(STORE_KEYS.currentUser, user);
      const next = params.get('next');
      toast('เข้าสู่ระบบสำเร็จ');
      setTimeout(() => {
        if (next) location.href = next;
        else if (user.role === 'admin') location.href = 'admin-dashboard.html';
        else if (user.role === 'artist') location.href = 'artist-dashboard.html';
        else location.href = 'buyer-dashboard.html';
      }, 600);
    });
    $('#registerPanel').addEventListener('submit', e => {
      e.preventDefault();
      const role = $('#regRole').value;
      const user = {id:`${role[0]}${Date.now()}`, role, name:$('#regName').value.trim(), email:$('#regEmail').value.trim(), password:$('#regPassword').value, phone:'', address:'', coins: role === 'buyer' ? 100 : 0, status: role === 'artist' ? 'pending' : 'active', avatar: role === 'artist' ? '🎨' : '👤'};
      if (users().some(u => u.email === user.email)) return toast('อีเมลนี้ถูกใช้แล้ว');
      saveUsers([user, ...users()]);
      if (role === 'artist') saveApplications([{id:`APP-${Date.now().toString().slice(-5)}`, userId:user.id, name:user.name, portfolio:'รอกรอกข้อมูล Portfolio', status:'pending', date:today()}, ...applications()]);
      set(STORE_KEYS.currentUser, user);
      toast(role === 'artist' ? 'สมัครศิลปินแล้ว รอ Admin อนุมัติ' : 'สมัครสมาชิกสำเร็จ');
      setTimeout(() => location.href = role === 'artist' ? 'artist-dashboard.html' : 'buyer-dashboard.html', 700);
    });
  }

  function renderCart() {
    const container = $('#cartApp');
    if (!container) return;
    const items = cart().map(i => ({...i, product: getProductById(i.productId)})).filter(i => i.product);
    const total = items.reduce((sum, i) => sum + i.product.priceCoins * i.qty, 0);
    container.innerHTML = `
      ${pageTitle('ตะกร้าสินค้า', 'เพิ่มผลงานลงตะกร้าและชำระด้วยเหรียญในระบบ')}
      <section class="cart-layout">
        <div class="panel">
          ${items.length ? items.map(cartRow).join('') : '<div class="empty">ยังไม่มีสินค้าในตะกร้า</div>'}
        </div>
        <aside class="panel checkout-box">
          <h2>สรุปคำสั่งซื้อ</h2>
          <div class="summary-line"><span>จำนวนรายการ</span><strong>${items.length}</strong></div>
          <div class="summary-line"><span>ยอดรวม</span><strong>${coin(total)}</strong></div>
          <div class="summary-line"><span>ยอดเหรียญของคุณ</span><strong>${coin(currentUser()?.coins || 0)}</strong></div>
          <button class="btn full pink" id="checkoutBtn" ${items.length ? '' : 'disabled'}>ชำระเงินด้วย Coin</button>
          <a class="btn ghost full" href="wallet.html">เติมเหรียญ</a>
        </aside>
      </section>
    `;
    $$('.qty-btn').forEach(btn => btn.addEventListener('click', () => changeCartQty(btn.dataset.id, Number(btn.dataset.delta))));
    $$('.remove-cart').forEach(btn => btn.addEventListener('click', () => removeCartItem(btn.dataset.id)));
    $('#checkoutBtn')?.addEventListener('click', checkoutCart);
  }

  function cartRow(item) {
    return `<article class="cart-row"><img src="${item.product.image}" alt="${item.product.title}"><div><h3>${item.product.title}</h3><p>${item.product.creator} • ${item.product.delivery}</p><strong>${coin(item.product.priceCoins)}</strong></div><div class="qty"><button class="qty-btn" data-id="${item.productId}" data-delta="-1">−</button><span>${item.qty}</span><button class="qty-btn" data-id="${item.productId}" data-delta="1">+</button></div><button class="remove-cart" data-id="${item.productId}">ลบ</button></article>`;
  }

  function changeCartQty(productId, delta) {
    const data = cart().map(i => i.productId === productId ? {...i, qty: Math.max(1, i.qty + delta)} : i);
    set(STORE_KEYS.cart, data);
    renderCart();
    buildHeader();
  }

  function removeCartItem(productId) {
    set(STORE_KEYS.cart, cart().filter(i => i.productId !== productId));
    renderCart();
    buildHeader();
  }

  function checkoutCart() {
    const user = currentUser();
    if (!user) return location.href = 'login.html?next=cart.html';
    if (user.role !== 'buyer') return toast('บัญชีผู้ซื้อเท่านั้นที่สามารถชำระเงินได้');
    const items = cart().map(i => ({...i, product: getProductById(i.productId)})).filter(i => i.product);
    const total = items.reduce((sum, i) => sum + i.product.priceCoins * i.qty, 0);
    if ((user.coins || 0) < total) return toast('เหรียญไม่พอ กรุณาเติมเหรียญก่อน');
    if (!confirm(`ยืนยันชำระเงิน ${coin(total)} ?`)) return;
    user.coins -= total;
    updateCurrentUser(user);
    const byArtist = new Map();
    items.forEach(i => {
      if (!byArtist.has(i.product.artistId)) byArtist.set(i.product.artistId, []);
      byArtist.get(i.product.artistId).push(i);
    });
    const newOrders = [];
    byArtist.forEach((artistItems, artistId) => {
      const orderTotal = artistItems.reduce((sum, i) => sum + i.product.priceCoins * i.qty, 0);
      newOrders.push({id:`ORD-${Date.now().toString().slice(-6)}-${newOrders.length+1}`, buyerId:user.id, artistId, items: artistItems.map(i => ({productId:i.productId, qty:i.qty, priceCoins:i.product.priceCoins})), totalCoins:orderTotal, status:'รอยืนยันคำสั่งซื้อ', tracking:'', date:today(), problem:false});
    });
    saveOrders([...newOrders, ...orders()]);
    saveTransactions([{id:`TX-${Date.now().toString().slice(-6)}`, userId:user.id, type:'ซื้อสินค้า', amount:-total, note:`Checkout ${newOrders.length} order`, date:today()}, ...transactions()]);
    set(STORE_KEYS.cart, []);
    toast('ชำระเงินสำเร็จ');
    setTimeout(() => location.href = 'buyer-dashboard.html#orders', 700);
  }

  function renderWallet() {
    if (!requireRole(['buyer','artist','admin'])) return;
    const user = currentUser();
    const container = $('#walletApp');
    if (!container) return;
    const userTx = transactions().filter(t => t.userId === user.id);
    container.innerHTML = `
      ${pageTitle('Coin Wallet', 'ตรวจสอบยอดเหรียญ เติมเหรียญ และดูประวัติธุรกรรม')}
      <section class="wallet-grid">
        <div class="wallet-card">
          <span>ยอดเหรียญคงเหลือ</span>
          <strong>${coin(user.coins || 0)}</strong>
          <p>อัตราแลกเปลี่ยนปัจจุบัน 1 Coin = ${baht(settings().coinRate)}</p>
        </div>
        <div class="panel qr-panel">
          <h2>เติมเหรียญผ่าน QR Code</h2>
          <div class="qr-mock">QR<br>CODE</div>
          <div class="preset-row">
            <button class="chip" data-topup="100">100</button>
            <button class="chip" data-topup="300">300</button>
            <button class="chip" data-topup="500">500</button>
            <button class="chip" data-topup="1000">1,000</button>
          </div>
          <div class="field"><label>จำนวนเหรียญ</label><input id="topupAmount" type="number" min="1" value="300"></div>
          <button class="btn full" id="confirmTopup">ยืนยันเติมเหรียญจำลอง</button>
        </div>
      </section>
      <section class="section panel">
        <h2>ประวัติธุรกรรมเหรียญ</h2>
        <div class="table-wrap"><table><thead><tr><th>วันที่</th><th>ประเภท</th><th>จำนวน</th><th>หมายเหตุ</th></tr></thead><tbody>${userTx.map(txRow).join('') || '<tr><td colspan="4">ยังไม่มีธุรกรรม</td></tr>'}</tbody></table></div>
      </section>
    `;
    $$('[data-topup]').forEach(btn => btn.addEventListener('click', () => $('#topupAmount').value = btn.dataset.topup));
    $('#confirmTopup').addEventListener('click', () => {
      const amount = Number($('#topupAmount').value || 0);
      if (amount <= 0) return toast('กรุณากรอกจำนวนเหรียญ');
      user.coins = (user.coins || 0) + amount;
      updateCurrentUser(user);
      saveTransactions([{id:`TX-${Date.now().toString().slice(-6)}`, userId:user.id, type:'เติมเหรียญ', amount, note:'QR Code จำลอง', date:today()}, ...transactions()]);
      toast('เติมเหรียญสำเร็จ');
      renderWallet();
      buildHeader();
    });
  }

  function txRow(t) {
    return `<tr><td>${t.date}</td><td>${t.type}</td><td class="${t.amount >= 0 ? 'plus' : 'minus'}">${t.amount >= 0 ? '+' : ''}${coin(t.amount)}</td><td>${t.note}</td></tr>`;
  }

  function renderBuyerDashboard() {
    if (!requireRole(['buyer','artist','admin'])) return;
    const user = currentUser();
    const container = $('#buyerApp');
    if (!container) return;
    const myOrders = orders().filter(o => o.buyerId === user.id);
    const wishProducts = wishlist().map(getProductById).filter(Boolean);
    const userTx = transactions().filter(t => t.userId === user.id);
    container.innerHTML = `
      ${pageTitle('Buyer Dashboard', 'จัดการข้อมูลส่วนตัว คำสั่งซื้อ Wishlist รีวิว และใบเสร็จ')}
      <section class="dashboard-grid">
        <aside class="dash-menu panel"><a href="#profile">ข้อมูลส่วนตัว</a><a href="#orders">คำสั่งซื้อ</a><a href="#wishlist">Wishlist</a><a href="#history">ประวัติ Coin</a><a href="chat.html">แชท</a></aside>
        <div class="dash-content">
          <section class="panel" id="profile"><h2>ข้อมูลส่วนตัวและที่อยู่จัดส่ง</h2><form id="profileForm" class="form-grid"><div class="field"><label>ชื่อ</label><input id="profileName" value="${user.name}"></div><div class="field"><label>โทรศัพท์</label><input id="profilePhone" value="${user.phone || ''}"></div><div class="field full-field"><label>ที่อยู่จัดส่ง</label><textarea id="profileAddress">${user.address || ''}</textarea></div><button class="btn">บันทึกข้อมูล</button><button type="button" class="btn ghost" id="cancelAccountBtn">ยกเลิกบัญชีพร้อมเหตุผล</button></form></section>
          <section class="panel" id="orders"><h2>ข้อมูลคำสั่งซื้อและติดตามสถานะ</h2>${myOrders.length ? myOrders.map(orderCard).join('') : '<div class="empty">ยังไม่มีคำสั่งซื้อ</div>'}</section>
          <section class="panel" id="wishlist"><h2>รายการโปรด</h2><div class="grid products-grid mini">${wishProducts.length ? wishProducts.map(productCard).join('') : '<div class="empty">ยังไม่มี Wishlist</div>'}</div></section>
          <section class="panel" id="history"><h2>ประวัติการใช้เหรียญและใบเสร็จรับเงิน</h2><div class="table-wrap"><table><thead><tr><th>วันที่</th><th>ประเภท</th><th>จำนวน</th><th>หมายเหตุ</th></tr></thead><tbody>${userTx.map(txRow).join('') || '<tr><td colspan="4">ยังไม่มีประวัติ</td></tr>'}</tbody></table></div></section>
        </div>
      </section>
    `;
    bindProductActions(container);
    $('#profileForm').addEventListener('submit', e => {
      e.preventDefault();
      user.name = $('#profileName').value.trim();
      user.phone = $('#profilePhone').value.trim();
      user.address = $('#profileAddress').value.trim();
      updateCurrentUser(user);
      toast('บันทึกข้อมูลแล้ว');
      buildHeader();
    });
    $('#cancelAccountBtn').addEventListener('click', () => {
      const reason = prompt('ระบุเหตุผลการยกเลิกบัญชี');
      if (!reason) return;
      user.status = 'cancel_requested';
      user.cancelReason = reason;
      updateCurrentUser(user);
      toast('ส่งคำขอยกเลิกบัญชีแล้ว');
    });
    $$('.problem-btn').forEach(btn => btn.addEventListener('click', () => reportProblem(btn.dataset.order)));
  }

  function orderCard(order) {
    const itemNames = order.items.map(i => `${getProductById(i.productId)?.title || i.productId} x${i.qty}`).join(', ');
    return `<article class="order-card"><div><h3>${order.id}</h3><p>${itemNames}</p><small>${order.date}</small></div><div><strong>${coin(order.totalCoins)}</strong><p>${order.status}</p><p>${order.tracking ? 'เลขพัสดุ: '+order.tracking : 'ยังไม่มีเลขพัสดุ'}</p></div><div class="order-actions"><button class="btn ghost small problem-btn" data-order="${order.id}">แจ้งปัญหา/คืนสินค้า</button><a class="btn small" href="product.html?id=${order.items[0].productId}">รีวิวสินค้า</a></div></article>`;
  }

  function reportProblem(orderId) {
    const reason = prompt('ระบุปัญหาหรือเหตุผลการขอคืนสินค้า');
    if (!reason) return;
    const user = currentUser();
    saveDisputes([{id:`DP-${Date.now().toString().slice(-6)}`, orderId, buyer:user.name, reason, status:'open', date:today()}, ...disputes()]);
    saveOrders(orders().map(o => o.id === orderId ? {...o, problem:true, status:'มีข้อพิพาท'} : o));
    toast('ส่งเรื่องให้ผู้ดูแลระบบแล้ว');
    renderBuyerDashboard();
  }

  function renderArtistDashboard() {
    if (!requireRole(['artist','admin'])) return;
    const user = currentUser();
    const container = $('#artistApp');
    if (!container) return;
    const myProducts = products().filter(p => p.artistId === user.id || (user.email === 'artist@example.com' && p.artistId === 'a001'));
    const myOrders = orders().filter(o => o.artistId === user.id || (user.email === 'artist@example.com' && o.artistId === 'a001'));
    const myReviews = reviews().filter(r => myProducts.some(p => p.id === r.productId));
    container.innerHTML = `
      ${pageTitle('Artist Dashboard', 'จัดการโปรไฟล์ ผลงาน คำสั่งซื้อ รายได้ และถอนเงิน')}
      <section class="dashboard-grid">
        <aside class="dash-menu panel"><a href="#artistProfile">โปรไฟล์ศิลปิน</a><a href="#upload">อัปโหลดผลงาน</a><a href="#artworks">ผลงานของฉัน</a><a href="#sales">คำสั่งซื้อ/ยอดขาย</a><a href="#withdraw">ถอนเงิน</a><a href="#reviews">รีวิว</a></aside>
        <div class="dash-content">
          <section class="panel" id="artistProfile"><h2>โปรไฟล์ศิลปิน</h2><form id="artistProfileForm" class="form-grid"><div class="field"><label>ชื่อศิลปิน</label><input id="artistName" value="${user.name}"></div><div class="field"><label>สถานะ</label><input value="${user.status === 'pending' ? 'รออนุมัติจาก Admin' : 'อนุมัติแล้ว'}" disabled></div><div class="field full-field"><label>Bio</label><textarea id="artistBio">${user.bio || ''}</textarea></div><button class="btn">บันทึกโปรไฟล์</button><button type="button" class="btn ghost" id="artistCancelBtn">ยกเลิกบัญชีพร้อมเหตุผล</button></form></section>
          <section class="panel" id="upload"><h2>อัปโหลดและจัดการผลงาน</h2><form id="productForm" class="form-grid"><div class="field"><label>ชื่อผลงาน</label><input id="newTitle" required></div><div class="field"><label>ราคา Coin</label><input id="newPrice" type="number" min="1" value="100" required></div><div class="field"><label>หมวดหมู่</label><select id="newCategory"><option>ภาพวาด</option><option>ดิจิทัลอาร์ต</option><option>ภาพพิมพ์</option><option>หนังสือและอีบุ๊ก</option><option>สติกเกอร์</option><option>พวงกุญแจ</option><option>VTuber & Streamer</option></select></div><div class="field"><label>ประเภท</label><select id="newType"><option>สินค้าดิจิทัล</option><option>สินค้าจัดส่ง</option></select></div><div class="field"><label>รูปตัวอย่าง</label><select id="newImage">${Array.from({length:16}, (_,i)=>`<option value="assets/art_${String(i+1).padStart(2,'0')}.jpg">art_${String(i+1).padStart(2,'0')}.jpg</option>`).join('')}</select></div><div class="field"><label>สถานะ</label><select id="newStatus"><option value="draft">ไม่แสดง</option><option value="pending">รอคัดกรอง</option><option value="published">แสดง</option></select></div><div class="field full-field"><label>คำอธิบาย</label><textarea id="newDesc" required></textarea></div><button class="btn pink">เพิ่มผลงาน</button></form></section>
          <section class="panel" id="artworks"><h2>ผลงานของฉัน</h2><div class="grid products-grid mini">${myProducts.length ? myProducts.map(productCard).join('') : '<div class="empty">ยังไม่มีผลงาน</div>'}</div></section>
          <section class="panel" id="sales"><h2>รายการคำสั่งซื้อและข้อมูลการขาย</h2>${myOrders.length ? myOrders.map(artistOrderCard).join('') : '<div class="empty">ยังไม่มีคำสั่งซื้อ</div>'}<div class="sales-total"><strong>ยอดเหรียญในกระเป๋า:</strong> ${coin(user.coins || 0)}</div></section>
          <section class="panel" id="withdraw"><h2>ถอนเงินจากเหรียญสะสมเป็นเงินบาท</h2><form id="withdrawForm" class="form-grid"><div class="field"><label>จำนวน Coin</label><input id="withdrawCoins" type="number" min="1" value="500"></div><div class="field"><label>ช่องทางรับเงิน</label><select id="withdrawChannel"><option>บัญชีธนาคาร</option><option>PromptPay</option></select></div><button class="btn">ส่งคำขอถอนเงิน</button></form></section>
          <section class="panel" id="reviews"><h2>ความคิดเห็นและรีวิวจากผู้ซื้อ</h2><div class="review-list">${myReviews.length ? myReviews.map(reviewCard).join('') : '<div class="empty">ยังไม่มีรีวิว</div>'}</div></section>
        </div>
      </section>
    `;
    bindProductActions(container);
    $('#artistProfileForm').addEventListener('submit', e => {
      e.preventDefault();
      user.name = $('#artistName').value.trim();
      user.bio = $('#artistBio').value.trim();
      updateCurrentUser(user);
      toast('บันทึกโปรไฟล์ศิลปินแล้ว');
      buildHeader();
    });
    $('#artistCancelBtn').addEventListener('click', () => {
      const reason = prompt('ระบุเหตุผลการยกเลิกบัญชี');
      if (!reason) return;
      user.status = 'cancel_requested';
      user.cancelReason = reason;
      updateCurrentUser(user);
      toast('ส่งคำขอยกเลิกบัญชีแล้ว');
    });
    $('#productForm').addEventListener('submit', e => {
      e.preventDefault();
      const newProduct = {id:`p${Date.now()}`, image:$('#newImage').value, artistId:user.id, creator:user.name, verified:user.status === 'approved', title:$('#newTitle').value.trim(), category:$('#newCategory').value, type:$('#newType').value, tags:['new'], priceCoins:Number($('#newPrice').value), priceBaht:Number($('#newPrice').value), stock:1, sold:0, rating:0, reviews:0, status:$('#newStatus').value, featured:false, unique:true, badge:'ใหม่', delivery:$('#newType').value === 'สินค้าดิจิทัล' ? 'ดาวน์โหลดไฟล์' : 'สินค้าจัดส่ง', description:$('#newDesc').value.trim()};
      saveProducts([newProduct, ...products()]);
      toast('เพิ่มผลงานแล้ว');
      renderArtistDashboard();
    });
    $$('.confirm-order').forEach(btn => btn.addEventListener('click', () => confirmArtistOrder(btn.dataset.order)));
    $('#withdrawForm').addEventListener('submit', e => {
      e.preventDefault();
      const coins = Number($('#withdrawCoins').value || 0);
      if (coins <= 0 || coins > (user.coins || 0)) return toast('จำนวนเหรียญไม่ถูกต้อง');
      user.coins -= coins;
      updateCurrentUser(user);
      saveWithdrawals([{id:`WD-${Date.now().toString().slice(-6)}`, artistId:user.id, artist:user.name, coins, baht:coins * settings().coinRate, channel:$('#withdrawChannel').value, status:'pending', date:today()}, ...withdrawals()]);
      toast('ส่งคำขอถอนเงินแล้ว รอ Admin อนุมัติ');
      renderArtistDashboard();
      buildHeader();
    });
  }

  function artistOrderCard(order) {
    const itemNames = order.items.map(i => `${getProductById(i.productId)?.title || i.productId} x${i.qty}`).join(', ');
    return `<article class="order-card"><div><h3>${order.id}</h3><p>${itemNames}</p><small>${order.date}</small></div><div><strong>${coin(order.totalCoins)}</strong><p>${order.status}</p><p>${order.tracking || 'ยังไม่ระบุเลขพัสดุ'}</p></div><button class="btn small confirm-order" data-order="${order.id}">ยืนยัน/ใส่เลขพัสดุ</button></article>`;
  }

  function confirmArtistOrder(orderId) {
    const tracking = prompt('ระบุเลขพัสดุเพื่ออัปเดตสถานะจัดส่ง', 'TH');
    if (!tracking) return;
    saveOrders(orders().map(o => o.id === orderId ? {...o, tracking, status:'กำลังจัดส่ง'} : o));
    toast('อัปเดตคำสั่งซื้อแล้ว');
    renderArtistDashboard();
  }

  function renderAdminDashboard() {
    if (!requireRole(['admin'])) return;
    const container = $('#adminApp');
    if (!container) return;
    const allProducts = products();
    const pendingApps = applications();
    const pendingWithdrawals = withdrawals();
    const allDisputes = disputes();
    const stats = {
      products: allProducts.length,
      users: users().length,
      orders: orders().length,
      volume: orders().reduce((s,o)=>s+o.totalCoins,0)
    };
    container.innerHTML = `
      ${pageTitle('Admin Dashboard', 'ควบคุมระบบ อนุมัติศิลปิน คัดกรองผลงาน จัดการเหรียญ และรายงาน')}
      <section class="stat-grid"><article><span>ผู้ใช้ทั้งหมด</span><strong>${stats.users}</strong></article><article><span>ผลงานทั้งหมด</span><strong>${stats.products}</strong></article><article><span>คำสั่งซื้อ</span><strong>${stats.orders}</strong></article><article><span>มูลค่า Coin</span><strong>${coin(stats.volume)}</strong></article></section>
      <section class="dashboard-grid">
        <aside class="dash-menu panel"><a href="#apps">อนุมัติศิลปิน</a><a href="#moderate">คัดกรองผลงาน</a><a href="#coinAdmin">ระบบเหรียญ</a><a href="#withdrawAdmin">ถอนเงิน</a><a href="#disputesAdmin">ข้อพิพาท</a><a href="#reviewsAdmin">รีวิว</a><a href="#reportsAdmin">รายงาน</a></aside>
        <div class="dash-content">
          <section class="panel" id="apps"><h2>อนุมัติหรือปฏิเสธการสมัครศิลปิน</h2>${pendingApps.map(appCard).join('') || '<div class="empty">ไม่มีคำขอสมัครศิลปิน</div>'}</section>
          <section class="panel" id="moderate"><h2>ควบคุมการเผยแพร่และคัดกรองผลงาน</h2><div class="table-wrap"><table><thead><tr><th>ผลงาน</th><th>ศิลปิน</th><th>สถานะ</th><th>จัดการ</th></tr></thead><tbody>${allProducts.map(productModerateRow).join('')}</tbody></table></div></section>
          <section class="panel" id="coinAdmin"><h2>จัดการระบบเหรียญและค่าธรรมเนียม</h2><form id="settingsForm" class="form-grid"><div class="field"><label>อัตราแลกเปลี่ยน 1 Coin = บาท</label><input id="coinRate" type="number" min="1" value="${settings().coinRate}"></div><div class="field"><label>ค่าธรรมเนียมแพลตฟอร์ม (%)</label><input id="platformFee" type="number" min="0" max="100" value="${settings().platformFee}"></div><button class="btn">บันทึกการตั้งค่า</button></form></section>
          <section class="panel" id="withdrawAdmin"><h2>ตรวจสอบและอนุมัติรายการถอนเงิน</h2>${pendingWithdrawals.map(withdrawRow).join('') || '<div class="empty">ไม่มีรายการถอนเงิน</div>'}</section>
          <section class="panel" id="disputesAdmin"><h2>ข้อพิพาทและการขอคืนสินค้า</h2>${allDisputes.map(disputeRow).join('') || '<div class="empty">ไม่มีข้อพิพาท</div>'}</section>
          <section class="panel" id="reviewsAdmin"><h2>ตรวจสอบรีวิวที่ไม่เหมาะสม</h2><div class="review-list">${reviews().map(adminReviewCard).join('')}</div></section>
          <section class="panel" id="reportsAdmin"><h2>รายงานและสถิติภาพรวม</h2><div class="report-bars">${reportBar('ยอดผู้ใช้', stats.users, 30)}${reportBar('ผลงาน', stats.products, 40)}${reportBar('คำสั่งซื้อ', stats.orders, 20)}${reportBar('ธุรกรรม Coin', stats.volume, 4000)}</div></section>
        </div>
      </section>
    `;
    $$('.app-action').forEach(btn => btn.addEventListener('click', () => updateApplication(btn.dataset.id, btn.dataset.status)));
    $$('.publish-action').forEach(btn => btn.addEventListener('click', () => updateProductStatus(btn.dataset.id, btn.dataset.status)));
    $('#settingsForm').addEventListener('submit', e => {
      e.preventDefault();
      set(STORE_KEYS.settings, {coinRate:Number($('#coinRate').value), platformFee:Number($('#platformFee').value)});
      toast('บันทึกการตั้งค่าเหรียญแล้ว');
      renderAdminDashboard();
    });
    $$('.withdraw-action').forEach(btn => btn.addEventListener('click', () => updateWithdrawal(btn.dataset.id, btn.dataset.status)));
    $$('.dispute-action').forEach(btn => btn.addEventListener('click', () => updateDispute(btn.dataset.id, btn.dataset.status)));
    $$('.delete-review').forEach(btn => btn.addEventListener('click', () => deleteReview(btn.dataset.id)));
  }

  function appCard(app) {
    return `<article class="admin-row"><div><h3>${app.name}</h3><p>${app.portfolio}</p><small>${app.date} • ${app.status}</small></div><div><button class="btn small app-action" data-id="${app.id}" data-status="approved">อนุมัติ</button><button class="btn ghost small app-action" data-id="${app.id}" data-status="rejected">ปฏิเสธ</button></div></article>`;
  }

  function updateApplication(id, status) {
    const data = applications().map(a => a.id === id ? {...a, status} : a);
    saveApplications(data);
    const app = data.find(a => a.id === id);
    if (app) saveUsers(users().map(u => u.id === app.userId ? {...u, status: status === 'approved' ? 'approved' : 'rejected'} : u));
    toast('อัปเดตคำขอศิลปินแล้ว');
    renderAdminDashboard();
  }

  function productModerateRow(p) {
    return `<tr><td>${p.title}</td><td>${p.creator}</td><td>${p.status}</td><td><button class="btn small publish-action" data-id="${p.id}" data-status="published">เผยแพร่</button> <button class="btn ghost small publish-action" data-id="${p.id}" data-status="hidden">ซ่อน</button></td></tr>`;
  }
  function updateProductStatus(id, status) {
    saveProducts(products().map(p => p.id === id ? {...p, status} : p));
    toast('อัปเดตสถานะผลงานแล้ว');
    renderAdminDashboard();
  }
  function withdrawRow(w) {
    return `<article class="admin-row"><div><h3>${w.id} • ${w.artist}</h3><p>${coin(w.coins)} = ${baht(w.baht)} ผ่าน ${w.channel}</p><small>${w.date} • ${w.status}</small></div><div><button class="btn small withdraw-action" data-id="${w.id}" data-status="approved">อนุมัติ</button><button class="btn ghost small withdraw-action" data-id="${w.id}" data-status="rejected">ปฏิเสธ</button></div></article>`;
  }
  function updateWithdrawal(id, status) {
    saveWithdrawals(withdrawals().map(w => w.id === id ? {...w, status} : w));
    toast('อัปเดตรายการถอนเงินแล้ว');
    renderAdminDashboard();
  }
  function disputeRow(d) {
    return `<article class="admin-row"><div><h3>${d.id} • ${d.orderId}</h3><p>${d.reason}</p><small>${d.buyer} • ${d.date} • ${d.status}</small></div><div><button class="btn small dispute-action" data-id="${d.id}" data-status="resolved">ปิดเรื่อง</button><button class="btn ghost small dispute-action" data-id="${d.id}" data-status="reviewing">กำลังตรวจสอบ</button></div></article>`;
  }
  function updateDispute(id, status) {
    saveDisputes(disputes().map(d => d.id === id ? {...d, status} : d));
    toast('อัปเดตข้อพิพาทแล้ว');
    renderAdminDashboard();
  }
  function adminReviewCard(r) {
    return `<article class="review-card"><div><strong>${r.user}</strong><span>${'★'.repeat(r.rating)}</span></div><p>${r.text}</p><small>${r.date}</small><button class="btn ghost small delete-review" data-id="${r.id}">ลบรีวิวที่ไม่เหมาะสม</button></article>`;
  }
  function deleteReview(id) {
    saveReviews(reviews().filter(r => r.id !== id));
    toast('ลบรีวิวแล้ว');
    renderAdminDashboard();
  }
  function reportBar(label, value, max) {
    const width = Math.min(100, Math.round((value / max) * 100));
    return `<div class="report-row"><span>${label}</span><div><i style="width:${width}%"></i></div><strong>${fmt.format(value)}</strong></div>`;
  }

  function renderChat() {
    if (!requireRole(['buyer','artist','admin'])) return;
    const user = currentUser();
    const container = $('#chatApp');
    if (!container) return;
    const allMsgs = messages().filter(m => m.room === 'b001-a001' || m.from === user.id);
    container.innerHTML = `
      ${pageTitle('แชทติดต่อศิลปิน/ผู้ซื้อ', 'ระบบข้อความภายในแพลตฟอร์มสำหรับสอบถามงานและคำสั่งซื้อ')}
      <section class="chat-layout">
        <aside class="panel chat-list"><h2>ห้องแชท</h2><button class="chat-room active">RENKA / ผู้ซื้อ Demo</button><button class="chat-room">MochiMochi</button><button class="chat-room">Admin Support</button></aside>
        <div class="panel chat-window">
          <div class="chat-header"><strong>RENKA</strong><span>ออนไลน์เมื่อไม่นานมานี้</span></div>
          <div class="messages" id="messages">${allMsgs.map(messageBubble).join('')}</div>
          <form class="chat-form" id="chatForm"><input id="chatInput" placeholder="พิมพ์ข้อความ..."><button class="btn">ส่ง</button></form>
        </div>
      </section>
    `;
    $('#chatForm').addEventListener('submit', e => {
      e.preventDefault();
      const text = $('#chatInput').value.trim();
      if (!text) return;
      saveMessages([...messages(), {id:`m${Date.now()}`, room:'b001-a001', from:user.id, text, date:new Date().toLocaleString('th-TH')}]);
      $('#chatInput').value = '';
      renderChat();
    });
  }

  function messageBubble(m) {
    const user = currentUser();
    const mine = m.from === user?.id;
    const fromUser = getUserById(m.from);
    return `<div class="bubble ${mine ? 'mine' : ''}"><small>${fromUser?.name || 'ระบบ'} • ${m.date}</small><p>${m.text}</p></div>`;
  }

  function refreshCurrentPage() {
    if (page === 'home') renderHome();
    if (page === 'product') renderProductDetail();
    if (page === 'cart') renderCart();
    if (page === 'buyer') renderBuyerDashboard();
    if (page === 'artist') renderArtistDashboard();
    if (page === 'admin') renderAdminDashboard();
  }

  function init() {
    seedOnce();
    buildHeader();
    buildFooter();
    if (page === 'home') renderHome();
    if (page === 'product') renderProductDetail();
    if (page === 'login') renderLogin();
    if (page === 'cart') renderCart();
    if (page === 'wallet') renderWallet();
    if (page === 'buyer') renderBuyerDashboard();
    if (page === 'artist') renderArtistDashboard();
    if (page === 'admin') renderAdminDashboard();
    if (page === 'chat') renderChat();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
