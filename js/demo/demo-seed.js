/* Demo data + demo helper UI (demo only). কোনো লগইন নেই — শুধু চেকআউট ও ট্র্যাকিং টেস্ট করার জন্য। */
(function () {
  'use strict';
  var G = window.__GAS, N = window.NG || {};
  if (!G) return;
  var meta = null; try { meta = JSON.parse(localStorage.getItem('ng-demo-meta') || 'null'); } catch (e) {}

  function seed() {
    G.init();
    var prods = (N.products || []).filter(function (p) { return p.active !== false; });
    var pick = function (id) { return prods.filter(function (p) { return p.id === id; })[0]; };
    var reel = pick('r-animal') || prods.filter(function (p) { return p.type === 'reels'; })[0];
    var course = pick('c-graphic') || prods.filter(function (p) { return p.type === 'course'; })[0];
    var course2 = pick('c-freelance') || prods.filter(function (p) { return p.type === 'course'; })[1] || course;
    function item(p) { return { id: p.id, title: p.title, price: p.price, type: p.type, icon: p.icon }; }

    // CourseLinks/ReelLinks: অ্যাডমিন নিজে Sheet-এ গিয়ে এভাবেই লিংক বসাবেন — একটা আগে থেকে বসিয়ে রাখছি, রিলসের লিংক ইচ্ছাকৃতভাবে ফাঁকা (মিসিং-লিংক কেসটা দেখানোর জন্য)
    G.setLink('CourseLinks', course.id, course.title, 'https://drive.google.com/drive/folders/demo-course-link');

    // অর্ডার ১: শুধু কোর্স — এখনই Approve করে ইমেইল পাঠানো সিমুলেট করা হচ্ছে
    var o1 = G.call({ action: 'checkout', name: 'রাহাত হোসেন (ডেমো)', email: 'rahat.demo@example.com', phone: '01711000001', items: [item(course)], total: course.price, paymentMethod: 'bKash', paymentRef: 'TRXDEMO001' }).data;
    G.simulateApprove(o1.orderId);

    // অর্ডার ২: কোর্স + রিলস বান্ডেল একসাথে — Pending অবস্থায় রাখা (এখনো ভেরিফাই হয়নি)
    var o2 = G.call({ action: 'checkout', name: 'ফারিয়া আক্তার (ডেমো)', email: 'faria.demo@example.com', phone: '01711000002', items: [item(course2), item(reel)], total: course2.price + reel.price, paymentMethod: 'Nagad', paymentRef: 'TRXDEMO002' }).data;

    // অর্ডার ৩: বাতিল হওয়া অর্ডারের উদাহরণ
    var o3 = G.call({ action: 'checkout', name: 'নাজমুল করিম (ডেমো)', email: 'najmul.demo@example.com', phone: '01711000003', items: [item(reel)], total: reel.price, paymentMethod: 'Binance Pay (USDT)', paymentRef: 'bad-ref-demo' }).data;
    G.setStatus(o3.orderId, 'Rejected');

    meta = { o1: o1.orderId, o2: o2.orderId, o3: o3.orderId, email1: 'rahat.demo@example.com', email2: 'faria.demo@example.com', email3: 'najmul.demo@example.com' };
    localStorage.setItem('ng-demo-meta', JSON.stringify(meta)); localStorage.setItem('ng-demo-seeded', '1');
  }
  if (!meta || !localStorage.getItem('ng-demo-seeded')) { try { seed(); } catch (e) { console.error('demo seed failed', e); } }

  function box(html) { var d = document.createElement('div'); d.className = 'demo-box'; d.setAttribute('style', 'margin-top:16px;border:2px dashed #ffb020;background:rgba(255,176,32,.08);color:#ffd187;border-radius:12px;padding:12px 14px;font-size:.88rem;line-height:1.6;text-align:left'); d.innerHTML = html; return d; }
  function ui() {
    var b = document.createElement('div');
    b.setAttribute('style', 'position:fixed;left:12px;bottom:12px;z-index:99998;background:#ffb020;color:#1a1200;font:700 12px/1.4 sans-serif;padding:6px 12px;border-radius:99px;box-shadow:0 4px 14px rgba(0,0,0,.35)');
    b.innerHTML = '🧪 ডেমো মোড · <a href="#" id="demoReset" style="color:#1a1200;text-decoration:underline">ডেমো ডাটা রিসেট</a>'; document.body.appendChild(b);
    document.getElementById('demoReset').onclick = function (e) { e.preventDefault(); if (confirm('ডেমোর সব ডাটা মুছে নতুন করে শুরু হবে। নিশ্চিত?')) window.__GAS_DB_WIPE(); };
    var n = 0, iv = setInterval(function () {
      n++; if (n > 40) clearInterval(iv);
      var cf = document.getElementById('checkoutForm'), tf = document.getElementById('trackForm');
      if (cf && !cf.parentNode.querySelector('.demo-box') && meta) {
        var x = box('<b>🧪 ডেমো চেকআউট</b><br>যেকোনো নাম/ইমেইল দিয়ে অর্ডার করে দেখুন — তারপর নিচে "অর্ডার ট্র্যাক করুন" থেকে অবস্থা দেখুন।<br>বাস্তবে Google Sheet যুক্ত হলে, আপনি Sheet-এ গিয়ে Status "Approved" করলেই কাস্টমারের ইমেইলে লিংক চলে যাবে।');
        cf.parentNode.insertBefore(x, cf.nextSibling);
      }
      if (tf && !tf.parentNode.querySelector('.demo-box') && meta) {
        var y = box('<b>🧪 ডেমো অর্ডার:</b><br>• <a href="#" data-o="' + meta.o1 + '" data-e="' + meta.email1 + '">' + meta.o1 + '</a> (' + meta.email1 + ') — ইতিমধ্যে Approved, ইমেইল পাঠানো হয়েছে<br>' +
          '• <a href="#" data-o="' + meta.o2 + '" data-e="' + meta.email2 + '">' + meta.o2 + '</a> (' + meta.email2 + ') — এখনো Pending <button type="button" id="demoApprove2" class="btn btn-sm btn-outline" style="margin-left:6px">এখনই Approve করে দেখুন</button><br>' +
          '• <a href="#" data-o="' + meta.o3 + '" data-e="' + meta.email3 + '">' + meta.o3 + '</a> (' + meta.email3 + ') — Rejected উদাহরণ<br>' +
          '<button type="button" id="demoShowMail" class="btn btn-sm btn-outline" style="margin-top:8px">📧 সর্বশেষ ডেমো মেইল দেখুন</button>');
        tf.parentNode.insertBefore(y, tf.nextSibling);
        y.addEventListener('click', function (e) { var a = e.target.closest('[data-o]'); if (a) { e.preventDefault(); tf.oid.value = a.getAttribute('data-o'); tf.email.value = a.getAttribute('data-e'); tf.dispatchEvent(new Event('submit', { cancelable: true })); } });
        var ap2 = document.getElementById('demoApprove2');
        if (ap2) ap2.onclick = function () {
          var r = window.__GAS.simulateApprove(meta.o2);
          alert(r.ok ? 'Approved করা হলো! ইমেইলে (' + meta.email2 + ') লিংক পাঠানো সিমুলেট হয়েছে। এখন "সর্বশেষ ডেমো মেইল দেখুন" চাপুন অথবা আবার ট্র্যাক করুন।' : 'সমস্যা হয়েছে।');
        };
        var sm = document.getElementById('demoShowMail');
        if (sm) sm.onclick = function () {
          var log = window.__demoMailLog || [], last = log[log.length - 1];
          if (!last) { alert('এখনো কোনো ডেমো ইমেইল পাঠানো হয়নি।'); return; }
          alert('📧 ডেমো ইমেইল (আসলে পাঠানো হয়নি, এটা শুধু প্রিভিউ):\n\nTo: ' + last.to + '\nSubject: ' + last.subject + '\n\n' + last.body);
        };
      }
    }, 300);
  }
  window.__GAS_DB_WIPE = function () { window.__DEMO_DB.wipe(); location.href = location.href.split('#')[0]; };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ui); else ui();
})();
