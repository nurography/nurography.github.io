/* Nurography — Main script. Design & Development: Md Farhad Badshah (mdfarhadbadshah.github.io) */
(function () {
  'use strict';
  var N = window.NG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var bn = function (n) { return String(n).replace(/\d/g, function (d) { return '০১২৩৪৫৬৭৮৯'[d]; }); };
  var money = function (n) { return '৳' + bn(Number(n).toLocaleString('en-IN')); };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  var P = {
    phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
    cart: 'M3 3h2l2.4 12.2A2 2 0 0 0 9.4 17H18a2 2 0 0 0 2-1.6L22 7H6',
    check: 'M20 6 9 17l-5-5', chevron: 'm6 9 6 6 6-6', menu: 'M3 6h18M3 12h18M3 18h18', x: 'M18 6 6 18M6 6l12 12',
    sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z', up: 'm18 15-6-6-6 6', wa: 'M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.3A8.4 8.4 0 1 1 21 11.5z',
    facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', instagram: 'M17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM16 11.4a4 4 0 1 1-7.9 1.2 4 4 0 0 1 7.9-1.2z',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4', users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    bolt: 'M13 2 4 14h6l-1 8 9-12h-6z', trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6'
  };
  function ic(n, cls) { return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (P[n] || '') + '"/></svg>'; }
  window.NG_ic = ic;
  function prodVisual(p) {
    if (p && p.image) return '<img src="' + esc(p.image) + '" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">';
    return (p && p.icon) || '📦';
  }
  window.NG_visual = prodVisual;
  window.NG_ic = ic;

  var theme = store.get('ng-theme') || 'dark'; document.documentElement.setAttribute('data-theme', theme);
  var page = document.body.getAttribute('data-page') || 'home';
  var NAV = [['home', 'index.html', 'হোম'], ['reels', 'reels.html', 'রিলস বান্ডেল'], ['courses', 'courses.html', 'অনলাইন কোর্স'], ['about', 'about.html', 'আমাদের সম্পর্কে'], ['contact', 'contact.html', 'যোগাযোগ']];
  function tel(n) { return 'tel:+' + n; }
  function waLink(msg) { return 'https://wa.me/' + N.whatsappIntl + (msg ? '?text=' + encodeURIComponent(msg) : ''); }

  /* ---------- Cart ---------- */
  var Cart = {
    get: function () { try { return JSON.parse(store.get('ng-cart') || '[]'); } catch (e) { return []; } },
    save: function (c) { store.set('ng-cart', JSON.stringify(c)); renderCartBadge(); },
    add: function (id) { var c = Cart.get(); if (c.indexOf(id) < 0) c.push(id); Cart.save(c); openCart(); },
    remove: function (id) { Cart.save(Cart.get().filter(function (x) { return x !== id; })); },
    clear: function () { Cart.save([]); },
    items: function () { var ids = Cart.get(); return (N.products || []).filter(function (p) { return ids.indexOf(p.id) >= 0; }); },
    total: function () { return Cart.items().reduce(function (s, p) { return s + Number(p.price); }, 0); }
  };
  window.NGCart = Cart;
  function renderCartBadge() { var n = Cart.get().length; $$('.cart-count').forEach(function (b) { b.textContent = bn(n); b.style.display = n ? '' : 'none'; }); }
  
  /* কার্ট আইটেমে ডিলিট বা রিমুভ বাটন যুক্ত করা হলো */
  function cartIt(p) { 
    return '<div class="cart-it" data-id="' + p.id + '">' +
           '<div class="ic">' + prodVisual(p) + '</div>' +
           '<div class="in"><b>' + esc(p.title) + '</b><span>' + money(p.price) + ' • ' + (p.type === 'reels' ? 'রিলস বান্ডেল' : 'কোর্স') + '</span></div>' +
           '<button type="button" class="cart-remove-btn" aria-label="সরান" style="background:none;border:none;cursor:pointer;color:var(--danger, #ff4d4f);padding:6px;display:flex;align-items:center;justify-content:center;">' + ic('trash') + '</button>' +
           '</div>'; 
  }
  
  function renderCart() {
    var box = $('#cartItems'); if (!box) return;
    var items = Cart.items();
    box.innerHTML = items.length ? items.map(cartIt).join('') : '<p class="empty">কার্ট খালি — রিলস বান্ডেল বা কোর্স যোগ করুন।</p>';
    
    // কার্ট থেকে রিমুভ করার বাটনগুলোর জন্য ক্লিক ইভেন্ট বাইন্ড করা হলো
    $$('.cart-it', box).forEach(function (el) {
      var btn = el.querySelector('.cart-remove-btn');
      if (btn) {
        btn.onclick = function () {
          var id = el.getAttribute('data-id');
          Cart.remove(id);
          renderCart();
        };
      }
    });

    var tot = $('#cartTotal'); if (tot) tot.textContent = money(Cart.total());
    var go = $('#cartCheckout'); if (go) go.style.opacity = items.length ? 1 : .5;
  }
  function openCart() { $('#cartOv').classList.add('open'); $('#cartDr').classList.add('open'); document.body.style.overflow = 'hidden'; renderCart(); }
  function closeCart() { $('#cartOv').classList.remove('open'); $('#cartDr').classList.remove('open'); document.body.style.overflow = ''; }
  window.NGOpenCart = openCart;

  /* ---------- Chrome ---------- */
  function renderChrome() {
    var h = $('#site-header');
    if (h) {
      h.innerHTML =
        '<div class="topbar"><div class="container"><div class="tb-l"><a href="' + waLink('আসসালামু আলাইকুম, আমি Nurography থেকে প্রোডাক্ট সম্পর্কে জানতে চাই।') + '" target="_blank" rel="noopener">' + ic('wa') + esc(N.whatsapp) + '</a></div>' +
        '<div class="tb-r"><a href="track.html">' + ic('bolt') + 'অর্ডার ট্র্যাক করুন</a></div></div></div>' +
        '<header class="header" id="hdr"><div class="container">' +
        '<a class="brand" href="index.html"><img src="resources/logo.jpg" alt="Logo" width="46" height="46"><span><b>' + esc(N.name) + '</b><small>' + esc(N.tagline) + '</small></span></a>' +
        '<nav class="nav" id="nav">' + NAV.map(function (n) { return '<a href="' + n[1] + '"' + (n[0] === page ? ' class="active"' : '') + '>' + n[2] + '</a>'; }).join('') + '<a class="m-only" href="track.html">অর্ডার ট্র্যাক করুন</a></nav>' +
        '<div class="hdr-actions"><button class="icon-btn" id="themeBtn" aria-label="থিম">' + ic(theme === 'dark' ? 'sun' : 'moon') + '</button>' +
        '<button class="icon-btn" id="cartBtn" aria-label="কার্ট">' + ic('cart') + '<span class="cart-count"></span></button>' +
        '<button class="icon-btn burger" id="burger" aria-label="মেনু">' + ic('menu') + '</button></div></div></header>';
    }
    var f = $('#site-footer');
    if (f) {
      var soc = (N.facebook ? '<a href="' + esc(N.facebook) + '" target="_blank" rel="noopener" aria-label="facebook">' + ic('facebook') + '</a>' : '') + (N.instagram ? '<a href="' + esc(N.instagram) + '" target="_blank" rel="noopener" aria-label="instagram">' + ic('instagram') + '</a>' : '');
      f.innerHTML = '<footer class="footer"><div class="container"><div class="foot-grid">' +
        '<div><a class="brand" href="index.html"><img src="resources/logo.jpg" alt="Logo" width="46" height="46"><span><b>' + esc(N.name) + '</b></span></a><p>' + esc(N.tagline) + '।</p><p style="margin-top:6px">' + esc(N.address) + '</p>' + (soc ? '<div class="socials">' + soc + '</div>' : '') + '</div>' +
        '<div><h4>প্রোডাক্ট</h4><ul><li><a href="reels.html">রিলস বান্ডেল</a></li><li><a href="courses.html">অনলাইন কোর্স</a></li><li><a href="track.html">অর্ডার ট্র্যাক করুন</a></li></ul></div>' +
        '<div><h4>যোগাযোগ</h4><ul><li><a href="' + waLink() + '" target="_blank" rel="noopener">WhatsApp: ' + esc(N.whatsapp) + '</a></li>' + (N.facebook ? '<li><a href="' + esc(N.facebook) + '" target="_blank" rel="noopener">Facebook পেজ</a></li>' : '') + (N.instagram ? '<li><a href="' + esc(N.instagram) + '" target="_blank" rel="noopener">Instagram</a></li>' : '') + '<li><a href="track.html">অর্ডার ট্র্যাক করুন</a></li></ul></div></div></div>' +
        '<div class="foot-bot"><div class="container"><span>© ' + new Date().getFullYear() + ' ' + esc(N.name) + '. সর্বস্বত্ব সংরক্ষিত।</span><span><a href="track.html">অর্ডার ট্র্যাক করুন</a></span></div></div></footer>' +
        '<div class="cart-ov" id="cartOv"></div><div class="cart-dr" id="cartDr"><div class="cart-h"><b>🛒 আপনার কার্ট</b><button id="cartX" aria-label="বন্ধ">×</button></div><div class="cart-items" id="cartItems"></div><div class="cart-foot"><div class="cart-tot"><span>সর্বমোট</span><span id="cartTotal">৳০</span></div><a class="btn btn-primary btn-block" id="cartCheckout" href="checkout.html">চেকআউট করুন</a></div></div>';
    }
    if (!$('.fab')) {
      var fab = document.createElement('div'); fab.className = 'fab';
      fab.innerHTML = '<a class="wa" href="' + waLink('আসসালামু আলাইকুম, আমি Nurography থেকে একটি প্রোডাক্ট সম্পর্কে জানতে চাই।') + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ic('wa') + '</a><button class="top" id="toTop" aria-label="উপরে">' + ic('up') + '</button>';
      document.body.appendChild(fab);
    }
  }
  function bindChrome() {
    var hdr = $('#hdr'), nav = $('#nav'), burger = $('#burger'), tb = $('#themeBtn'), top = $('#toTop'), cb = $('#cartBtn');
    if (burger) burger.onclick = function () { nav.classList.toggle('open'); burger.innerHTML = ic(nav.classList.contains('open') ? 'x' : 'menu'); };
    if (nav) $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });
    if (tb) tb.onclick = function () { theme = theme === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', theme); store.set('ng-theme', theme); tb.innerHTML = ic(theme === 'dark' ? 'sun' : 'moon'); };
    if (top) top.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    if (cb) cb.onclick = openCart;
    var cx = $('#cartX'); if (cx) cx.onclick = closeCart; var co = $('#cartOv'); if (co) co.onclick = closeCart;
    window.addEventListener('scroll', function () { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 10); if (top) top.classList.toggle('show', window.scrollY > 500); }, { passive: true });
    renderCartBadge();
  }

  function reveal() {
    var els = $$('.rv'); if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }
  function counters() {
    var els = $$('[data-count]'); if (!els.length) return;
    var run = function (el) { var to = +el.getAttribute('data-count'), suf = el.getAttribute('data-suf') || '', t0 = null; (function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1200, 1); el.textContent = bn(Math.floor(to * (1 - Math.pow(1 - p, 3)))) + (p === 1 ? suf : ''); if (p < 1) requestAnimationFrame(step); })(performance.now()); };
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }); }, { threshold: .4 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Products ---------- */
  function pcard(p) {
    return '<article class="pcard rv"><div class="top">' + prodVisual(p) + (p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : '') + '<span class="tag">' + (p.type === 'reels' ? 'রিলস' : 'কোর্স') + '</span></div>' +
      '<div class="body"><h3>' + esc(p.title) + '</h3><p>' + esc(p.desc) + '</p>' +
      '<div class="price"><b>' + money(p.price) + '</b>' + (p.oldPrice ? '<s>' + money(p.oldPrice) + '</s><em>' + bn(Math.round((1 - p.price / p.oldPrice) * 100)) + '% ছাড়</em>' : '') + '</div>' +
      '<div class="row"><a class="btn btn-outline" href="product.html?id=' + encodeURIComponent(p.id) + '">বিস্তারিত</a><button class="btn btn-primary" data-add="' + p.id + '">কার্টে যোগ</button></div></div></article>';
  }
  function bindAddButtons(root) { $$('[data-add]', root).forEach(function (b) { b.onclick = function () { Cart.add(b.getAttribute('data-add')); }; }); }
  function homeFeatured() {
    var g1 = $('#homeReels'), g2 = $('#homeCourses');
    if (g1) { g1.innerHTML = (N.products || []).filter(function (p) { return p.type === 'reels' && p.active !== false; }).slice(0, 4).map(pcard).join(''); bindAddButtons(g1); }
    if (g2) { g2.innerHTML = (N.products || []).filter(function (p) { return p.type === 'course' && p.active !== false; }).slice(0, 4).map(pcard).join(''); bindAddButtons(g2); }
  }
  function catalogPage(type) {
    var box = $('#catBox'), tabs = $('#catTabs'); if (!box) return;
    var all = (N.products || []).filter(function (p) { return p.type === type && p.active !== false; });
    var cats = []; all.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
    var labels = { funny: 'মজার', lifestyle: 'লাইফস্টাইল', gaming: 'গেমিং', food: 'ফুড', edu: 'সায়েন্স', art: 'আর্ট', quotes: 'উক্তি', design: 'ডিজাইন', marketing: 'মার্কেটিং', dev: 'টেক', business: 'বিজনেস', academic: 'একাডেমিক' };
    if (tabs) tabs.innerHTML = '<button class="tab on" data-c="all">সব</button>' + cats.map(function (c) { return '<button class="tab" data-c="' + c + '">' + (labels[c] || c) + '</button>'; }).join('');
    function draw(c) { var list = c === 'all' ? all : all.filter(function (p) { return p.cat === c; }); box.innerHTML = list.map(pcard).join('') || '<p class="empty">কোনো প্রোডাক্ট নেই।</p>'; bindAddButtons(box); reveal(); }
    if (tabs) tabs.onclick = function (e) { var b = e.target.closest('.tab'); if (!b) return; $$('.tab', tabs).forEach(function (t) { t.classList.remove('on'); }); b.classList.add('on'); draw(b.getAttribute('data-c')); };
    draw('all');
  }
  function productDetail() {
    var box = $('#pdBox'); if (!box) return;
    var id = new URLSearchParams(location.search).get('id'), p = (N.products || []).filter(function (x) { return x.id === id; })[0];
    if (!p) { box.innerHTML = '<p class="empty">প্রোডাক্ট খুঁজে পাওয়া যায়নি। <a href="index.html">হোমে ফিরুন</a></p>'; return; }
    document.title = p.title + ' | ' + N.name;
    box.innerHTML = '<div class="pd"><div class="pd-icon rv">' + prodVisual(p) + '</div><div class="rv"><span class="eyebrow">' + (p.type === 'reels' ? 'রিলস বান্ডেল' : 'অনলাইন কোর্স') + '</span><h1>' + esc(p.title) + '</h1><p style="color:var(--muted);margin-bottom:14px">' + esc(p.desc) + '</p>' +
      '<div class="price"><b>' + money(p.price) + '</b>' + (p.oldPrice ? '<s>' + money(p.oldPrice) + '</s><em>' + bn(Math.round((1 - p.price / p.oldPrice) * 100)) + '% ছাড়</em>' : '') + '</div>' +
      '<ul class="pd-points">' + (p.type === 'reels' ? ['১০০% কপিরাইট-মুক্ত কনটেন্ট', 'পেমেন্ট ভেরিফাই হলেই Drive/TeraBox লিংক', 'যেকোনো সোশ্যাল পেজে আপলোডের উপযোগী'] : ['আজীবন অ্যাক্সেস (একবার কিনলে বারবার দেখা যাবে)', 'পেমেন্ট ভেরিফাই হলেই অ্যাকাউন্টে লিংক', 'যেকোনো প্রশ্নে WhatsApp সাপোর্ট']).map(function (t) { return '<li>' + ic('check') + '<span>' + t + '</span></li>'; }).join('') + '</ul>' +
      '<div class="row" style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-primary" data-add="' + p.id + '">' + ic('cart') + ' কার্টে যোগ করুন</button><a class="btn btn-outline" href="checkout.html" id="buyNow">এখনই কিনুন</a></div></div></div>';
    $('#buyNow').onclick = function () { Cart.add(p.id); };
    bindAddButtons(box);
    var rel = (N.products || []).filter(function (x) { return x.type === p.type && x.id !== p.id && x.active !== false; }).slice(0, 4);
    var rb = $('#pdRelated'); if (rb && rel.length) { rb.innerHTML = rel.map(pcard).join(''); bindAddButtons(rb); }
  }

  /* ---------- FAQ ---------- */
  function faq() {
    var box = $('#faqBox'); if (!box) return;
    box.innerHTML = (N.faqs || []).map(function (f) { return '<div class="faq-i rv"><button class="faq-q" aria-expanded="false">' + esc(f.q) + ic('chevron') + '</button><div class="faq-a"><p>' + esc(f.a) + '</p></div></div>'; }).join('');
    box.onclick = function (e) {
      var q = e.target.closest('.faq-q'); if (!q) return; var item = q.parentNode, a = $('.faq-a', item), open = item.classList.contains('open');
      $$('.faq-i.open', box).forEach(function (o) { o.classList.remove('open'); $('.faq-a', o).style.maxHeight = 0; $('.faq-q', o).setAttribute('aria-expanded', 'false'); });
      if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; q.setAttribute('aria-expanded', 'true'); }
    };
  }

  /* ---------- নোটিশ বার (সম্পূর্ণ config.js থেকে — কোনো রিমোট সিঙ্ক নেই, GitHub-এ N.announcement বদলালেই হবে) ---------- */
  function announce() {
    var old = $('#annBar'); if (old) old.parentNode.removeChild(old);
    if (!N.announcement) return;
    var d = document.createElement('div'); d.id = 'annBar'; d.className = 'ann'; d.innerHTML = '<span>📢 ' + esc(N.announcement) + '</span><button aria-label="বন্ধ">×</button>';
    document.body.insertBefore(d, document.body.firstChild); $('button', d).onclick = function () { d.remove(); };
  }

  function staticFills() {
    $$('.ic-i').forEach(function (el) { el.outerHTML = ic(el.getAttribute('data-ic')); });
    var w = $('#ctWa'); if (w) w.href = waLink('আসসালামু আলাইকুম, আমি Nurography থেকে প্রোডাক্ট সম্পর্কে জানতে চাই।');
    var fb = $('#ctFb'); if (fb) { if (N.facebook) fb.href = N.facebook; else fb.closest('.pcard').style.display = 'none'; }
    var ig = $('#ctIg'); if (ig) { if (N.instagram) ig.href = N.instagram; else ig.closest('.pcard').style.display = 'none'; }
    var ad = $('#ctAddr'); if (ad) ad.textContent = N.address || '';
    var sp = $('#statProd'); if (sp) sp.setAttribute('data-count', (N.products || []).filter(function (p) { return p.active !== false; }).length);
  }

  function boot() {
    announce(); renderChrome(); bindChrome(); staticFills();
    homeFeatured(); if (page === 'reels') catalogPage('reels'); if (page === 'courses') catalogPage('course'); if (page === 'product') productDetail();
    faq(); reveal(); counters();
    window.__NGMain = 1;
    setTimeout(function () {
      if (window.__ngG) return;
      var o = document.createElement('div');
      o.setAttribute('style', 'position:fixed;inset:0;z-index:2147483647;background:#070a12;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font:18px/1.7 sans-serif');
      o.innerHTML = 'Required integrity script (js/guard.js) was removed or blocked.<br>Developer credit: <a style="color:#2fe3b4" href="https://mdfarhadbadshah.github.io">Md Farhad Badshah</a>';
      document.body.appendChild(o);
    }, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();