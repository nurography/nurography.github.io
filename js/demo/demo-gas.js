/* Browser-side stand-ins for Google Apps Script services (demo only). Data is kept in this browser's localStorage. */
(function (g) {
  'use strict';
  var KEY = 'ng-demo-db', CK = 'ng-demo-cache', PK = 'ng-demo-props';
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var sheets = load(KEY, {}), props = load(PK, {}), cache = load(CK, {});
  function persist() { save(KEY, sheets); }
  function mkSheet(name) {
    var s = sheets[name] || (sheets[name] = { data: [] });
    var o = {
      getLastRow: function () { var n = s.data.length; while (n > 0 && s.data[n - 1].every(function (v) { return v === '' || v == null; })) n--; return n; },
      getMaxRows: function () { return Math.max(1000, s.data.length); },
      setFrozenRows: function () {}, hideColumns: function () {}, deleteRow: function (r) { s.data.splice(r - 1, 1); persist(); },
      appendRow: function (a) { s.data.push(a.slice()); persist(); },
      getName: function () { return name; },
      getRange: function (r, c, nr, nc) {
        nr = nr || 1; nc = nc || 1;
        var R = {
          getRow: function () { return r; }, getColumn: function () { return c; }, getSheet: function () { return o; },
          getValues: function () { var out = []; for (var i = 0; i < nr; i++) { var row = []; for (var j = 0; j < nc; j++) { var v = (s.data[r - 1 + i] || [])[c - 1 + j]; row.push(v == null ? '' : v); } out.push(row); } return out; },
          setValues: function (v) { for (var i = 0; i < nr; i++) { s.data[r - 1 + i] = s.data[r - 1 + i] || []; for (var j = 0; j < nc; j++) s.data[r - 1 + i][c - 1 + j] = v[i][j]; } persist(); return R; },
          setValue: function (v) { s.data[r - 1] = s.data[r - 1] || []; s.data[r - 1][c - 1] = v; persist(); return R; },
          setNumberFormat: function () { return R; }, setFontWeight: function () { return R; }, setBackground: function () { return R; }, setFontColor: function () { return R; }, setDataValidation: function () { return R; }
        };
        R.getDisplayValues = R.getValues; return R;
      }
    };
    return o;
  }
  var ss = { getName: function () { return 'demo'; }, getSheetByName: function (n) { return sheets[n] ? mkSheet(n) : null; }, insertSheet: function (n) { sheets[n] = { data: [] }; persist(); return mkSheet(n); } };

  /* ---- sync SHA-256 ---- */
  var K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  function sha256(bytes) {
    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19], l = bytes.length, m = bytes.slice(), i, j;
    m.push(0x80); while (m.length % 64 !== 56) m.push(0);
    var hi = Math.floor(l * 8 / 4294967296), lo = (l * 8) >>> 0;
    m.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255, (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
    var rr = function (x, n) { return (x >>> n) | (x << (32 - n)); };
    for (i = 0; i < m.length; i += 64) {
      var w = new Array(64);
      for (j = 0; j < 16; j++) w[j] = (m[i + 4 * j] << 24) | (m[i + 4 * j + 1] << 16) | (m[i + 4 * j + 2] << 8) | m[i + 4 * j + 3];
      for (j = 16; j < 64; j++) { var s0 = rr(w[j - 15], 7) ^ rr(w[j - 15], 18) ^ (w[j - 15] >>> 3), s1 = rr(w[j - 2], 17) ^ rr(w[j - 2], 19) ^ (w[j - 2] >>> 10); w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0; }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], gg = H[6], h = H[7];
      for (j = 0; j < 64; j++) {
        var S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25), ch = (e & f) ^ (~e & gg), t1 = (h + S1 + ch + K[j] + w[j]) | 0, S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) | 0;
        h = gg; gg = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + gg) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = []; H.forEach(function (x) { out.push((x >>> 24) & 255, (x >>> 16) & 255, (x >>> 8) & 255, x & 255); }); return out;
  }
  function uuid() { var h = '0123456789abcdef', s = ''; for (var i = 0; i < 36; i++) { s += (i === 8 || i === 13 || i === 18 || i === 23) ? '-' : i === 14 ? '4' : h[Math.floor(Math.random() * 16)]; } return s; }

  g.SpreadsheetApp = { openById: function () { return ss; }, newDataValidation: function () { var b = { requireValueInList: function () { return b; }, setAllowInvalid: function () { return b; }, build: function () { return {}; } }; return b; } };
  g.CacheService = { getScriptCache: function () { return {
    get: function (k) { var e = cache[k]; if (!e) return null; if (e[1] < Date.now()) { delete cache[k]; return null; } return e[0]; },
    put: function (k, v, ttl) { cache[k] = [v, Date.now() + (ttl || 600) * 1000]; save(CK, cache); },
    remove: function (k) { delete cache[k]; save(CK, cache); } }; } };
  g.PropertiesService = { getScriptProperties: function () { return { getProperty: function (k) { return props[k] == null ? null : props[k]; }, setProperty: function (k, v) { props[k] = v; save(PK, props); } }; } };
  g.LockService = { getScriptLock: function () { return { waitLock: function () {}, releaseLock: function () {} }; } };
  g.__demoMailLog = []; g.MailApp = { sendEmail: function () { var m; if (arguments.length === 1 && typeof arguments[0] === 'object') m = arguments[0]; else m = { to: arguments[0], subject: arguments[1], body: arguments[2] }; g.__demoMailLog.push(m); return m; }, getRemainingDailyQuota: function () { return 100; } };
  g.Logger = { log: function () {} };
  g.DriveApp = { getRootFolder: function () { return { getName: function () { return 'demo'; } }; }, getFoldersByName: function () { return { hasNext: function () { return false; } }; }, createFolder: function () { return { createFile: function () { return { getUrl: function () { return '#demo'; }, getId: function () { return 'DEMO'; }, setSharing: function () {} }; } }; }, Access: {}, Permission: {} };
  g.ContentService = { MimeType: { JSON: 'json', TEXT: 'text' }, createTextOutput: function (t) { return { t: t, setMimeType: function () { return this; }, getContent: function () { return this.t; } }; } };
  g.Utilities = {
    formatDate: function (d, tz, f) { var x = new Date(d.getTime() + 6 * 3600e3), p = function (n) { return ('0' + n).slice(-2); }; return f.replace('yyyy', x.getUTCFullYear()).replace('MM', p(x.getUTCMonth() + 1)).replace('dd', p(x.getUTCDate())).replace('HH', p(x.getUTCHours())).replace('mm', p(x.getUTCMinutes())).replace('ss', p(x.getUTCSeconds())); },
    getUuid: uuid, DigestAlgorithm: { SHA_256: 'sha256' },
    computeDigest: function (a, s) { var bytes = Array.prototype.slice.call(new TextEncoder().encode(s)); return sha256(bytes).map(function (b) { return b > 127 ? b - 256 : b; }); },
    base64Decode: function (s) { return Array.prototype.slice.call(Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); })); },
    newBlob: function (b, t, n) { return { b: b, t: t, n: n }; }
  };
  g.__DEMO_DB = { wipe: function () { [KEY, CK, PK, 'ng-demo-meta', 'ng-demo-seeded', 'ng-content', 'ng-admin', 'ng-customer', 'ng-cart'].forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} }); } };
})(window);
