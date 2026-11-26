/*!
 * Pro Ads — publisher ad tag
 * Usage (generated for each unit in the Publisher dashboard):
 *   <div id="proad-UNIT_ID"></div>
 *   <script async src=".../proads.js" data-unit="UNIT_ID" data-api="https://script.google.com/macros/s/.../exec"></script>
 */
(function () {
  'use strict';
  var script = document.currentScript;
  if (!script) return;
  var unit = script.getAttribute('data-unit');
  var api = script.getAttribute('data-api');
  if (!unit || !api) return;

  var host = document.getElementById('proad-' + unit);
  if (!host) {
    host = document.createElement('div');
    script.parentNode.insertBefore(host, script);
  }

  var sep = api.indexOf('?') > -1 ? '&' : '?';
  var call = function (params) { return api + sep + params; };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function adHTML(a, size) {
    var p = size.split('x'), w = +p[0], h = +p[1], wide = w / h >= 3, tiny = h <= 60;
    var f = 'font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;';
    var img = a.imageUrl
      ? '<img src="' + esc(a.imageUrl) + '" alt="" referrerpolicy="no-referrer" style="' +
        (wide ? 'width:' + (h - 16) + 'px;height:' + (h - 16) + 'px;border-radius:6px;'
              : 'width:100%;height:' + Math.round(h * (h > 400 ? 0.34 : 0.46)) + 'px;') +
        'object-fit:cover;flex:none;display:block">'
      : '';
    var cta = '<span style="background:#3340d6;color:#fff;font-size:12px;font-weight:600;padding:' +
      (tiny ? '5px 9px' : '7px 12px') + ';border-radius:6px;white-space:nowrap;display:inline-block">Learn more</span>';
    var tag = '<span style="position:absolute;top:3px;right:4px;font-size:9px;color:#8a8f98;background:rgba(255,255,255,.85);padding:1px 4px;border-radius:3px;letter-spacing:.04em">AD</span>';
    var box = 'position:relative;box-sizing:border-box;width:' + w + 'px;height:' + h +
      'px;overflow:hidden;background:#fff;border:1px solid #e3e3e3;border-radius:8px;' + f;
    if (wide) {
      return '<div style="' + box + 'display:flex;align-items:center;gap:10px;padding:8px 10px">' + img +
        '<div style="flex:1;min-width:0"><div style="font-size:' + (tiny ? 13 : 15) +
        'px;font-weight:700;color:#14161a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(a.title) + '</div>' +
        (tiny ? '' : '<div style="font-size:12px;color:#5b6068;margin-top:2px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + esc(a.body) + '</div>') +
        '</div>' + cta + tag + '</div>';
    }
    return '<div style="' + box + 'display:flex;flex-direction:column">' + img +
      '<div style="padding:12px;display:flex;flex-direction:column;gap:6px;flex:1;min-height:0">' +
      '<div style="font-size:16px;font-weight:700;color:#14161a;line-height:1.25">' + esc(a.title) + '</div>' +
      '<div style="font-size:13px;color:#5b6068;line-height:1.4;overflow:hidden;flex:1">' + esc(a.body) + '</div>' +
      '<div>' + cta + '</div></div>' + tag + '</div>';
  }

  // Count the impression only when the ad is >=50% visible for 1 second.
  function whenViewable(el, done) {
    var fired = false, timer = null;
    var fire = function () { if (!fired) { fired = true; done(); } };
    if (!('IntersectionObserver' in window)) return fire();
    var io = new IntersectionObserver(function (entries) {
      var e = entries[0];
      if (e.isIntersecting && e.intersectionRatio >= 0.5) {
        if (!timer) timer = setTimeout(function () { fire(); io.disconnect(); }, 1000);
      } else if (timer) {
        clearTimeout(timer); timer = null;
      }
    }, { threshold: [0, 0.5, 1] });
    io.observe(el);
  }

  fetch(call('action=serve&unit=' + encodeURIComponent(unit) + '&r=' + Date.now()))
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (!j || !j.ok || !j.ad) return;
      var ad = j.ad;
      var link = document.createElement('a');
      link.href = ad.click;
      link.target = '_blank';
      link.rel = 'noopener sponsored nofollow';
      link.style.cssText = 'display:inline-block;text-decoration:none;line-height:0';
      link.innerHTML = adHTML(ad, ad.size);
      host.innerHTML = '';
      host.appendChild(link);
      whenViewable(link, function () {
        fetch(call('action=imp&t=' + encodeURIComponent(ad.token)), { mode: 'no-cors', keepalive: true }).catch(function () {});
      });
    })
    .catch(function () { /* fail silently: never break the host page */ });
})();
