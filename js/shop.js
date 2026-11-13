/* Nurography — Checkout & order-tracking script (কোনো লগইন/অ্যাকাউন্ট নেই — ইমেইলে অটো অ্যাক্সেস লিংক যায়)
   Design & Development: Md Farhad Badshah (mdfarhadbadshah.github.io) */
(function () {
  'use strict';
  var A = window.NGAPI, N = window.NG || {}, esc = A.esc, pg = document.body.getAttribute('data-page');
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ic = function (n, c) { return window.NG_ic ? window.NG_ic(n, c) : ''; };
  var bn = function (n) { return String(n).replace(/\d/g, function (d) { return '০১২৩৪৫৬৭৮৯'[d]; }); };
  var money = function (n) { return '৳' + bn(Number(n || 0).toLocaleString('en-IN')); };
  function ready(f) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', f); else f(); }
  function lastGuard(k) { k = 'ng-last-' + k; var t = +(localStorage.getItem(k) || 0); if (Date.now() - t < 10000) return false; localStorage.setItem(k, String(Date.now())); return true; }
  function toast(msg) { var t = document.createElement('div'); t.setAttribute('style', 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#14213d;color:#fff;padding:10px 18px;border-radius:10px;z-index:999'); t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 1800); }

  /* ================= CHECKOUT ================= */
  function initCheckout() {
    var Cart = window.NGCart, items = Cart.items();
    var sum = $('#orderSum'), form = $('#checkoutForm');
    if (!items.length) { $('#ckWrap').innerHTML = '<div class="empty rv">আপনার কার্ট খালি। <a href="index.html">প্রোডাক্ট দেখুন</a></div>'; return; }
    sum.innerHTML = items.map(function (p) { return '<div class="it"><span>' + p.icon + ' ' + esc(p.title) + '</span><span>' + money(p.price) + '</span></div>'; }).join('') + '<div class="tot"><span>সর্বমোট</span><span>' + money(Cart.total()) + '</span></div>';
    var pm = $('#pmGrid');
    pm.innerHTML = (N.paymentMethods || []).map(function (m, i) {
      return '<div class="pm' + (i === 0 ? ' on' : '') + '" data-pm="' + m.id + '"><label><input type="radio" name="pmethod" value="' + m.id + '"' + (i === 0 ? ' checked' : '') + '> ' + esc(m.label) + ' <small style="color:var(--muted);font-weight:500">(' + esc(m.type) + ')</small></label>' +
        '<div class="pm-detail"><div class="copy-row"><code id="num-' + m.id + '">' + esc(m.number) + '</code><button type="button" class="btn btn-sm btn-outline" data-copy="' + m.id + '">কপি</button></div><p style="margin-top:8px">' + esc(m.note) + '</p></div></div>';
    }).join('');
    pm.addEventListener('click', function (e) {
      var row = e.target.closest('.pm'); if (!row) return;
      $('input', row).checked = true; $$('.pm', pm).forEach(function (r) { r.classList.toggle('on', r === row); });
      var cp = e.target.closest('[data-copy]'); if (cp) { var t = $('#num-' + cp.getAttribute('data-copy')).textContent; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast('কপি হয়েছে'); }).catch(function () { prompt('কপি করুন:', t); }); }
    });
    liveValidate(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('[name=website]', form).value) return;
      if (!validate(form)) return;
      if (!lastGuard('ck')) { showAlert('অনুগ্রহ করে কয়েক সেকেন্ড পর আবার চেষ্টা করুন।', true); return; }
      var pmId = (form.querySelector('input[name=pmethod]:checked') || {}).value;
      var d = { name: form.name.value.trim(), email: form.email.value.trim().toLowerCase(), phone: form.phone.value.replace(/[\s-]/g, ''), items: items.map(function (p) { return { id: p.id, title: p.title, price: p.price, type: p.type, icon: p.icon }; }), total: Cart.total(), paymentMethod: pmId, paymentRef: form.paymentRef.value.trim(), note: form.note.value.trim() };
      var btn = $('button[type=submit]', form), old = btn.innerHTML; btn.disabled = true; btn.textContent = 'জমা দেওয়া হচ্ছে…';
      A.post('checkout', d).then(function (r) {
        Cart.clear();
        $('#ckWrap').innerHTML = '<div class="form-card success rv"><div class="tick">' + ic('check') + '</div><h2>অর্ডার জমা হয়েছে!</h2><p style="color:var(--muted)">আপনার অর্ডার আইডি</p><div class="oid">' + esc(r.orderId) + '</div>' +
          '<p style="color:var(--muted);margin-bottom:18px">পেমেন্ট যাচাই হলে <b>' + esc(d.email) + '</b> ইমেইলে আপনার প্রোডাক্টের অ্যাক্সেস লিংক স্বয়ংক্রিয়ভাবে চলে যাবে (স্প্যাম/জাঙ্ক ফোল্ডারও একবার দেখবেন)। অর্ডারের অবস্থা যেকোনো সময় ট্র্যাক করতে পারবেন।</p>' +
          '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="track.html?oid=' + encodeURIComponent(r.orderId) + '&email=' + encodeURIComponent(d.email) + '">অর্ডার ট্র্যাক করুন</a><a class="btn btn-wa" target="_blank" href="https://wa.me/' + N.whatsappIntl + '?text=' + encodeURIComponent('আসসালামু আলাইকুম, আমি অর্ডার করেছি।\nঅর্ডার আইডি: ' + r.orderId + '\nনাম: ' + d.name) + '">' + ic('wa') + ' WhatsApp এ জানান</a></div></div>';
      }).catch(function (err) {
        btn.disabled = false; btn.innerHTML = old;
        showAlert(err.message === 'NO_ENDPOINT' ? 'অনলাইন সার্ভার এখনো সংযুক্ত করা হয়নি। WhatsApp এ যোগাযোগ করুন: ' + esc(N.whatsapp) : err.message, true);
      });
    });
  }
  function showAlert(msg, bad) { var al = $('#ckAlert'); al.className = 'alert show ' + (bad ? 'err' : 'ok'); al.innerHTML = msg; al.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  function setErr(field, on, msg) { var w = field.closest('.field'); if (!w) return; w.classList.toggle('err', !!on); var m = $('.msg-err', w); if (m && msg) m.textContent = msg; }
  function checkField(el) {
    var v = (el.value || '').trim(), ok = true, msg = 'এই ঘরটি পূরণ করুন';
    if (el.hasAttribute('required') && !v) ok = false;
    else if (el.dataset.v === 'phone' && v && !/^01[3-9]\d{8}$/.test(v.replace(/[\s-]/g, ''))) { ok = false; msg = 'সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)'; }
    else if (el.dataset.v === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { ok = false; msg = 'সঠিক ইমেইল দিন — এখানেই অ্যাক্সেস লিংক পাঠানো হবে'; }
    setErr(el, !ok, msg); return ok;
  }
  function validate(root) {
    var ok = true, first = null;
    $$('input[required],select[required],textarea[required],input[data-v]', root).forEach(function (el) { if (el.type === 'radio') return; if (!checkField(el)) { ok = false; if (!first) first = el; } });
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return ok;
  }
  function liveValidate(form) {
    form.addEventListener('blur', function (e) { var t = e.target; if (t.matches && t.matches('input,select,textarea') && (t.hasAttribute('required') || t.dataset.v)) checkField(t); }, true);
    form.addEventListener('input', function (e) { var w = e.target.closest && e.target.closest('.field.err'); if (w) checkField(e.target); });
  }

  /* ================= ORDER TRACK (কোনো লগইন ছাড়াই — Order ID + Email) ================= */
  function pillFor(s) { var m = { Pending: ['wa', 'পেমেন্ট ভেরিফাই হচ্ছে'], Approved: ['ok', 'সম্পন্ন — ইমেইলে লিংক পাঠানো হয়েছে'], Rejected: ['bad', 'বাতিল হয়েছে'] }[s] || ['', s]; return '<span class="pill ' + m[0] + '">' + m[1] + '</span>'; }
  function initTrack() {
    var f = $('#trackForm'), box = $('#trackResult');
    function run(oid, email) {
      oid = (oid || '').trim(); email = (email || '').trim().toLowerCase(); if (!oid || !email) return;
      box.innerHTML = '<p class="center" style="padding:20px;color:var(--muted)">খোঁজা হচ্ছে…</p>';
      A.get({ action: 'trackOrder', oid: oid, email: email }).then(function (d) {
        if (!d.found) { box.innerHTML = '<div class="alert show err">এই তথ্যে কোনো অর্ডার পাওয়া যায়নি। অর্ডার আইডি ও ইমেইল আবার দেখুন।</div>'; return; }
        box.innerHTML = '<div class="order-card"><div class="oh"><div>অর্ডার: <b>' + esc(d.id) + '</b></div><div>' + pillFor(d.status) + '</div></div><p style="color:var(--muted)">' + A.fmtDateTime(d.createdAt) + ' • মোট ' + money(d.total) + '</p>' +
          '<div class="oitems" style="margin-top:10px">' + d.items.map(function (it) { return '<div class="oit"><div class="ic">' + (it.icon || '📦') + '</div><div class="in"><b>' + esc(it.title) + '</b></div></div>'; }).join('') + '</div>' +
          (d.status === 'Approved' ? '<p style="margin-top:14px;color:var(--muted)">লিংক আপনার ইমেইলে পাঠানো হয়েছে, স্প্যাম ফোল্ডারও দেখুন।</p>' : d.status === 'Pending' ? '<p style="margin-top:14px;color:var(--muted)">পেমেন্ট যাচাই চলছে, একটু অপেক্ষা করুন।</p>' : '<p style="margin-top:14px;color:var(--muted)">কোনো প্রশ্ন থাকলে WhatsApp-এ যোগাযোগ করুন: ' + esc(N.whatsapp) + '</p>') + '</div>';
      }).catch(function (e) {
        if (e.message === 'NO_ENDPOINT') { box.innerHTML = '<div class="alert show err">সার্ভার এখনো সংযুক্ত নেই। WhatsApp এ যোগাযোগ করুন: ' + esc(N.whatsapp) + '</div>'; return; }
        box.innerHTML = '<div class="alert show err">' + esc(e.message) + '</div>';
      });
    }
    f.addEventListener('submit', function (e) { e.preventDefault(); run(f.oid.value, f.email.value); });
    var p = new URLSearchParams(location.search), oid0 = p.get('oid'), email0 = p.get('email');
    if (oid0) f.oid.value = oid0; if (email0) f.email.value = email0;
    if (oid0 && email0) run(oid0, email0);
  }

  ready(function () { if (pg === 'checkout') initCheckout(); else if (pg === 'track') initTrack(); });
})();
