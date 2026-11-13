/* Demo-mode loader — চালু থাকলে (config.js: demoMode:true এবং sheetEndpoint ফাঁকা) ব্রাউজারেই ডেমো ব্যাকএন্ড চালায়। */
(function () {
  var N = window.NG || {};
  if (!N.demoMode || N.sheetEndpoint) return;
  var s = document.currentScript, base = s.src.replace(/demo\.js(\?.*)?$/, '');
  window.NG_DEMO = true;
  ['demo-gas.js', 'demo-backend.js', 'demo-seed.js'].forEach(function (f) { document.write('<script src="' + base + f + '"><\/script>'); });
})();
