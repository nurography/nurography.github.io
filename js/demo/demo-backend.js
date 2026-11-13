/* DEMO BACKEND — js/demo এর এই ফাইল Code.gs এর হুবহু কোড ব্রাউজারে চালায় (শুধু ডেমোর জন্য)। আসল সাইটে ডেমো বন্ধ থাকে। */
(function(){
/**
 * NUROGRAPHY — ব্যাকএন্ড (Google Apps Script + Google Sheet)  — সরলীকৃত ভার্সন
 * কোনো লগইন/অ্যাকাউন্ট/CMS নেই। প্রোডাক্ট GitHub-এ js/config.js এডিট করে বদলাবেন।
 * এই স্ক্রিপ্ট শুধু করে: ১) অর্ডার Sheet-এ জমা রাখা ২) আপনি Status "Approved" করলে
 * স্বয়ংক্রিয়ভাবে কাস্টমারের ইমেইলে Course/Reel Bundle লিংক পাঠানো।
 *
 * Design & Development: Md Farhad Badshah (mdfarhadbadshah.github.io)
 * ব্যবহার: SETUP-GUIDE.html এর ধাপগুলো অনুসরণ করুন।
 */

// ================= ১. সেটিংস =================
var SPREADSHEET_ID = '';          // ⚠️ আপনার Google Sheet এর ID এখানে বসান
var NOTIFY_EMAIL    = '';         // নতুন অর্ডার এলে আপনাকে ইমেইল জানাতে চাইলে নিজের ইমেইল দিন, না চাইলে '' রাখুন
var SHOP_NAME        = 'Nurography';
var ORDER_PREFIX      = 'NG';
var MAX_ITEMS_PER_ORDER = 20;

var TABLES = {
  Orders:     ['id', 'name', 'email', 'phone', 'items', 'total', 'paymentMethod', 'paymentRef', 'note', 'status', 'createdAt', 'mailSentAt'],
  CourseLinks: ['productId', 'title', 'driveLink'],
  ReelLinks:   ['productId', 'title', 'driveLink']
};

// ================= ২. প্রবেশদ্বার (ওয়েবসাইট থেকে আসা কল) =================
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    var d = JSON.parse((e && e.postData && e.postData.contents) ? e.postData.contents : '{}');
    if (d.action === 'checkout') return json_(checkout_(d));
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) { return json_(fail_(err)); } finally { try { lock.releaseLock(); } catch (x) {} }
}
function doGet(e) {
  var p = (e && e.parameter) || {};
  try { if (p.action === 'trackOrder') return json_({ ok: true, data: trackOrder_(p) }); } catch (err) { return json_(fail_(err)); }
  return ContentService.createTextOutput(SHOP_NAME + ' backend is running ✔ (simple edition)').setMimeType(ContentService.MimeType.TEXT);
}
function fail_(err) { return { ok: false, error: (err && err.message) ? err.message : String(err) }; }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// ================= ৩. অর্ডার জমা নেওয়া =================
function checkout_(d) {
  var name = c_(d.name), email = c_(d.email).toLowerCase(), phone = c_(d.phone);
  if (!name) throw new Error('নাম দিন');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('সঠিক ইমেইল দিন — এখানেই আপনার প্রোডাক্টের লিংক পাঠানো হবে');
  if (!Array.isArray(d.items) || !d.items.length) throw new Error('কার্ট খালি');
  if (d.items.length > MAX_ITEMS_PER_ORDER) throw new Error('একসাথে অনেক বেশি আইটেম');
  cooldown_('co_' + email, 15);      // একই ইমেইল থেকে ১৫ সেকেন্ডের মধ্যে বারবার অর্ডার জমা ঠেকানো (ডাবল-ক্লিক/স্প্যাম প্রতিরোধ)
  var items = d.items.slice(0, MAX_ITEMS_PER_ORDER).map(function (it) { return { id: c_(it.id), title: c_(it.title), price: Number(it.price) || 0, type: c_(it.type), icon: c_(it.icon) }; });
  var total = items.reduce(function (s, it) { return s + it.price; }, 0);
  var id; do { id = ORDER_PREFIX + '-' + rnd_(6); } while (all_('Orders').some(function (o) { return o.id === id; }));
  ins_('Orders', { id: id, name: name, email: email, phone: phone, items: JSON.stringify(items), total: total, paymentMethod: c_(d.paymentMethod), paymentRef: c_(d.paymentRef), note: c_(d.note), status: 'Pending', createdAt: nowStr_(), mailSentAt: '' });
  notify_('🆕 নতুন অর্ডার: ' + id, 'নাম: ' + name + '\nইমেইল: ' + email + '\nমোবাইল: ' + phone + '\nমোট: ৳' + total + '\nপেমেন্ট: ' + d.paymentMethod + ' (' + d.paymentRef + ')\nপ্রোডাক্ট: ' + items.map(function (i) { return i.title; }).join(', ') +
    '\n\nSheet-এ গিয়ে পেমেন্ট মিলিয়ে Status "Approved" করলেই কাস্টমারের ইমেইলে লিংক চলে যাবে।');
  return { ok: true, data: { orderId: id } };
}
function trackOrder_(p) {
  var o = all_('Orders').filter(function (x) { return x.id.toUpperCase() === c_(p.oid).toUpperCase() && x.email === c_(p.email).toLowerCase(); })[0];
  if (!o) return { found: false };
  return { found: true, id: o.id, status: o.status, total: o.total, createdAt: o.createdAt, items: JSON.parse(o.items || '[]') };
}

// ================= ৪. ⭐ মূল অটোমেশন: Status "Approved" হলে ইমেইলে লিংক পাঠানো =================
// এই ফাংশনটি নিজে থেকে চলে না — Apps Script → Triggers → Add Trigger দিয়ে
// "onEditInstallable" ফাংশনের জন্য একটি "On edit" installable trigger বসাতে হবে (ধাপ দেখুন SETUP-GUIDE.html এ)।
function onEditInstallable(e) {
  try {
    var sh = e.range.getSheet();
    if (sh.getName() !== 'Orders') return;
    var headers = TABLES.Orders, statusCol = headers.indexOf('status') + 1;
    if (e.range.getColumn() !== statusCol || e.range.getRow() < 2) return;      // শুধু Status কলামের বদল ধরবে
    var newVal = c_(e.value), oldVal = c_(e.oldValue);
    if (newVal !== 'Approved' || oldVal === 'Approved') return;                // বারবার মেইল যাওয়া ঠেকানো

    var row = e.range.getRow(), rec = sh.getRange(row, 1, 1, headers.length).getValues()[0];
    var order = {}; headers.forEach(function (k, i) { order[k] = rec[i]; });
    var items = JSON.parse(order.items || '[]');
    var lines = [], missing = [];
    items.forEach(function (it) {
      var link = findLink_(it.id, it.type);
      if (link) lines.push('• ' + it.title + '\n  ' + link);
      else { lines.push('• ' + it.title + '\n  (লিংক শীঘ্রই পাঠানো হবে, একটু অপেক্ষা করুন)'); missing.push(it.title); }
    });
    var body = 'আসসালামু আলাইকুম ' + order.name + ',\n\n' + SHOP_NAME + ' থেকে আপনার অর্ডার (' + order.id + ') নিশ্চিত হয়েছে। নিচে আপনার প্রোডাক্টের অ্যাক্সেস লিংক দেওয়া হলো:\n\n' + lines.join('\n\n') +
      '\n\nধন্যবাদ আমাদের সাথে থাকার জন্য।\n' + SHOP_NAME;
    MailApp.sendEmail({ to: order.email, subject: '✅ আপনার অর্ডার প্রস্তুত — ' + SHOP_NAME + ' (' + order.id + ')', body: body });
    sh.getRange(row, headers.indexOf('mailSentAt') + 1).setValue(nowStr_());
    if (missing.length) notify_('⚠️ লিংক পাওয়া যায়নি: ' + order.id, 'এই প্রোডাক্টগুলোর জন্য CourseLinks/ReelLinks শিটে এখনো লিংক দেওয়া নেই:\n' + missing.join('\n') + '\n\nলিংক বসিয়ে Status আবার "Pending" করে তারপর "Approved" করলে নতুন করে মেইল যাবে।');
  } catch (err) { notify_('❌ অটো-মেইল পাঠাতে সমস্যা হয়েছে', String(err)); }
}
function findLink_(productId, type) {
  var table = type === 'reels' ? 'ReelLinks' : 'CourseLinks';
  var row = all_(table).filter(function (r) { return r.productId === productId; })[0];
  return row ? c_(row.driveLink) : '';
}

// ================= ৫. সাহায্যকারী ফাংশন =================
function sheet_(name) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID), sh = ss.getSheetByName(name), H = TABLES[name];
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, H.length).setValues([H]).setFontWeight('bold').setBackground('#070a12').setFontColor('#2fe3b4');
    sh.setFrozenRows(1);
    if (name === 'Orders') {
      var statusCol = H.indexOf('status') + 1;
      var rule = SpreadsheetApp.newDataValidation().requireValueInList(['Pending', 'Approved', 'Rejected'], true).setAllowInvalid(false).build();
      sh.getRange(2, statusCol, 5000, 1).setDataValidation(rule);
    }
  }
  return sh;
}
function all_(name) {
  var sh = sheet_(name), H = TABLES[name], n = sh.getLastRow(); if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, H.length).getValues().map(function (r, i) { var o = { _row: i + 2 }; H.forEach(function (k, j) { o[k] = (r[j] === null || r[j] === undefined) ? '' : String(r[j]); }); return o; });
}
function ins_(name, o) { var sh = sheet_(name), H = TABLES[name], row = sh.getLastRow() + 1; sh.getRange(row, 1, 1, H.length).setNumberFormat('@').setValues([H.map(function (k) { return o[k] == null ? '' : String(o[k]); })]); return row; }
function upd_(name, row, o) { var sh = sheet_(name), H = TABLES[name], cur = sh.getRange(row, 1, 1, H.length).getValues()[0]; H.forEach(function (k, j) { if (o.hasOwnProperty(k)) cur[j] = o[k]; }); sh.getRange(row, 1, 1, H.length).setNumberFormat('@').setValues([cur.map(function (v) { return v == null ? '' : String(v); })]); }
function nowStr_() { return Utilities.formatDate(new Date(), 'Asia/Dhaka', 'yyyy-MM-dd HH:mm:ss'); }
function c_(v) { return (v === undefined || v === null) ? '' : String(v).trim().substring(0, 2000); }
function rnd_(n) { var ch = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = ''; for (var i = 0; i < n; i++) s += ch.charAt(Math.floor(Math.random() * ch.length)); return s; }
function cooldown_(key, seconds) {
  var k = 'cd_' + key, c = CacheService.getScriptCache(), last = Number(c.get(k) || 0), now = Date.now();
  if (now - last < seconds * 1000) throw new Error('একটু আগেই একটি অর্ডার জমা দিয়েছেন। অনুগ্রহ করে ' + seconds + ' সেকেন্ড পর আবার চেষ্টা করুন।');
  c.put(k, String(now), seconds + 5);
}
function notify_(subject, body) { if (!NOTIFY_EMAIL) return; try { MailApp.sendEmail(NOTIFY_EMAIL, '[' + SHOP_NAME + '] ' + subject, body); } catch (e) {} }

// ================= ৬. একবার চালানোর ফাংশন =================
/** SPREADSHEET_ID বসানোর পর একবার চালান — পারমিশন দেয় ও সব শিট/হেডার/ড্রপডাউন তৈরি করে */
function authorizeOnce() {
  if (!SPREADSHEET_ID) throw new Error('আগে উপরের SPREADSHEET_ID বসান');
  SpreadsheetApp.openById(SPREADSHEET_ID).getName();
  if (NOTIFY_EMAIL) MailApp.getRemainingDailyQuota();
  Object.keys(TABLES).forEach(function (t) { sheet_(t); });
  Logger.log('✔ পারমিশন ঠিক আছে এবং Orders/CourseLinks/ReelLinks শিট তৈরি হয়েছে। এবার Triggers মেনু থেকে onEditInstallable ট্রিগার বসান (গাইড দেখুন)।');
}
/** টেস্ট করতে: কোনো অর্ডার আইডি দিয়ে ম্যানুয়ালি মেইল আবার পাঠাতে চাইলে এই ফাংশনে আইডি বসিয়ে Run করুন */
function resendMailManually() {
  var ORDER_ID_TO_RESEND = 'NG-XXXXXX';     // ⚠️ এখানে অর্ডার আইডি বসান
  var o = all_('Orders').filter(function (x) { return x.id === ORDER_ID_TO_RESEND; })[0];
  if (!o) { Logger.log('অর্ডার পাওয়া যায়নি'); return; }
  var sh = sheet_('Orders'), col = TABLES.Orders.indexOf('status') + 1;
  sh.getRange(o._row, col).setValue('Pending');                 // নকল onEdit ঘটানোর জন্য আগে Pending করা হচ্ছে
  onEditInstallable({ range: sh.getRange(o._row, col), value: 'Approved', oldValue: 'Pending' });
  sh.getRange(o._row, col).setValue('Approved');
  Logger.log('✔ আবার মেইল পাঠানো হয়েছে (যদি লিংক পাওয়া যায়)');
}

window.__GAS={
  call:function(o){return JSON.parse(doPost({postData:{contents:JSON.stringify(o)}}).getContent());},
  get:function(q){return JSON.parse(doGet({parameter:q}).getContent());},
  init:function(){SPREADSHEET_ID='demo';authorizeOnce();},
  /* ডেমো-অনলি হেল্পার: আসল Code.gs-এ নেই — Sheet-এ হাতে Status বদলানো ও অটো-মেইল ট্রিগার সিমুলেট করতে */
  simulateApprove:function(orderId){
    var sh=sheet_('Orders'), col=TABLES.Orders.indexOf('status')+1, rows=all_('Orders'), o=rows.filter(function(x){return x.id===orderId})[0];
    if(!o) return {ok:false,error:'order not found'};
    var oldVal=o.status, range=sh.getRange(o._row,col);
    range.setValue('Approved');
    onEditInstallable({range:range, value:'Approved', oldValue:oldVal});
    var updated=all_('Orders').filter(function(x){return x.id===orderId})[0];
    return {ok:true, status:updated.status, mailSentAt:updated.mailSentAt};
  },
  setStatus:function(orderId,status){
    var sh=sheet_('Orders'), col=TABLES.Orders.indexOf('status')+1, o=all_('Orders').filter(function(x){return x.id===orderId})[0];
    if(!o) return {ok:false,error:'order not found'};
    var oldVal=o.status, range=sh.getRange(o._row,col);
    range.setValue(status);
    onEditInstallable({range:range, value:status, oldValue:oldVal});
    return {ok:true, status:status};
  },
  setLink:function(table,productId,title,link){
    var rows=all_(table), ex=rows.filter(function(r){return r.productId===productId})[0];
    if(ex) upd_(table, ex._row, {driveLink:link});
    else ins_(table,{productId:productId,title:title,driveLink:link});
    return {ok:true};
  }
};
})();
