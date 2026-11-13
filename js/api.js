/* Nurography — API client (কোনো লগইন/সেশন নেই, সব কল সরাসরি পাবলিক)
   Design & Development: Md Farhad Badshah (mdfarhadbadshah.github.io) */
(function (g) {
  'use strict';
  var N = g.NG || {};
  function endpoint() { return N.sheetEndpoint; }
  function demoOn() { return !!(N.demoMode && !N.sheetEndpoint && g.__GAS); }
  function unwrap(j) { if (!j.ok) { var e = new Error(j.error || 'অজানা ত্রুটি'); e.code = j.error; throw e; } return j.data; }
  function parse(r) {
    return r.text().then(function (t) {
      var j; try { j = JSON.parse(t); } catch (e) { throw new Error('সার্ভার থেকে সঠিক উত্তর আসেনি'); }
      return unwrap(j);
    });
  }
  function net(e) { if (e && e.code) throw e; if (e && e.message && e.message !== 'Failed to fetch' && e.message !== 'NO_ENDPOINT') throw e; throw new Error(e && e.message === 'NO_ENDPOINT' ? 'NO_ENDPOINT' : 'ইন্টারনেট সংযোগ সমস্যা — আবার চেষ্টা করুন'); }
  function post(action, data) {
    if (demoOn()) return Promise.resolve().then(function () { return unwrap(g.__GAS.call(Object.assign({ action: action }, data || {}))); });
    if (!endpoint()) return Promise.reject(new Error('NO_ENDPOINT'));
    return fetch(endpoint(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ action: action }, data || {})) }).then(parse).catch(net);
  }
  function get(q) {
    if (demoOn()) return Promise.resolve().then(function () { return unwrap(g.__GAS.get(q)); });
    if (!endpoint()) return Promise.reject(new Error('NO_ENDPOINT'));
    return fetch(endpoint() + (endpoint().indexOf('?') < 0 ? '?' : '&') + new URLSearchParams(q).toString()).then(parse).catch(net);
  }
  g.NGAPI = {
    post: post, get: get, demoOn: demoOn,
    fmtDate: function (s) { if (!s) return '—'; var d = new Date(String(s).slice(0, 19).replace(' ', 'T')); if (isNaN(d)) return s; try { return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return s; } },
    fmtDateTime: function (s) { if (!s) return '—'; var d = new Date(String(s).slice(0, 19).replace(' ', 'T')); if (isNaN(d)) return s; try { return d.toLocaleString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return s; } },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  };
})(window);
