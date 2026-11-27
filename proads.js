/*!
 * Pro Ads — publisher ad tag (display banners + sponsored search)
 * Generated for each unit in the Publisher dashboard:
 *   <div id="proad-UNIT_ID"></div>
 *   <script async src=".../proads.js" data-unit="UNIT_ID" data-api="https://script.google.com/macros/s/.../exec"></script>
 * Optional (search units): data-input="#my-search-box" to show ads for an existing search field on your page.
 */
(function () {
  'use strict';
  var script = document.currentScript;
  if (!script) return;
  var unit = script.getAttribute('data-unit');
  var api = script.getAttribute('data-api');
  var inputSel = script.getAttribute('data-input');
  if (!unit || !api) return;

  var host = document.getElementById('proad-' + unit);
  if (!host) {
    host = document.createElement('div');
    script.parentNode.insertBefore(host, script);
  }

  var dev = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  var sep = api.indexOf('?') > -1 ? '&' : '?';
  var call = function (params) { return api + sep + params; };
  var beacon = function (params) { fetch(call(params), { mode: 'no-cors', keepalive: true }).catch(function () {}); };
  var getJSON = function (params) { return fetch(call(params)).then(function (r) { return r.json(); }); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Count an impression only when the element is >=50% visible for 1 second.
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

  function track(el, token) {
    whenViewable(el, function () { beacon('action=imp&t=' + encodeURIComponent(token)); });
    var sent = false;
    var onClick = function () { if (!sent) { sent = true; beacon('action=click&t=' + encodeURIComponent(token)); } };
    el.addEventListener('click', onClick);
    el.addEventListener('auxclick', onClick);
  }

  /* ------------------------------ Display banner ------------------------------ */
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

  function showDisplay(ad) {
    var link = document.createElement('a');
    link.href = ad.url;
    link.target = '_blank';
    link.rel = 'noopener sponsored nofollow';
    link.style.cssText = 'display:inline-block;text-decoration:none;line-height:0';
    link.innerHTML = adHTML(ad, ad.size);
    host.innerHTML = '';
    host.appendChild(link);
    track(link, ad.token);
  }

  /* ------------------------------ Sponsored search ------------------------------ */
  var CSS =
    ':host{display:block}' +
    '.w{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:640px;color:#202124}' +
    '.sb{display:flex;gap:8px;margin:0 0 12px}' +
    '.sb input{flex:1;min-width:0;padding:10px 16px;border:1px solid #dadce0;border-radius:24px;font-size:15px;outline:none}' +
    '.sb input:focus{box-shadow:0 1px 6px rgba(32,33,36,.28);border-color:transparent}' +
    '.sb button{border:0;background:#3340d6;color:#fff;padding:0 20px;border-radius:24px;font-weight:600;font-size:14px;cursor:pointer}' +
    '.ad{display:block;text-decoration:none;color:inherit;padding:10px 4px 12px;border-bottom:1px solid #f1f3f4}' +
    '.top{font-size:12px;color:#3c4043;display:flex;gap:6px;align-items:center}' +
    '.tag{font-weight:700;border:1px solid #3c4043;border-radius:4px;padding:0 4px;font-size:10px;line-height:14px}' +
    '.h{color:#1a0dab;font-size:19px;line-height:1.3;margin:2px 0}' +
    '.ad:hover .h{text-decoration:underline}' +
    '.d{font-size:14px;color:#4d5156;line-height:1.5}' +
    '.none{font-size:13px;color:#70757a;padding:8px 2px}' +
    '.foot{font-size:11px;color:#9aa0a6;margin-top:6px}';

  function mountSearch() {
    var existing = inputSel ? document.querySelector(inputSel) : null;
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    root.innerHTML = '<style>' + CSS + '</style><div class="w">' +
      (existing ? '' : '<form class="sb" role="search"><input type="search" placeholder="Search…" aria-label="Search"><button type="submit">Search</button></form>') +
      '<div class="res" aria-live="polite"></div><div class="foot">Sponsored results by Pro Ads</div></div>';
    var res = root.querySelector('.res'), seq = 0;

    function render(ads) {
      if (!ads.length) { res.innerHTML = '<div class="none">No sponsored results for this search.</div>'; return; }
      res.innerHTML = ads.map(function (a) {
        return '<a class="ad" target="_blank" rel="noopener sponsored nofollow" href="' + esc(a.url) + '">' +
          '<div class="top"><span class="tag">Ad</span><span>' + esc(a.host) + '</span></div>' +
          '<div class="h">' + esc(a.title) + (a.title2 ? ' | ' + esc(a.title2) : '') + '</div>' +
          '<div class="d">' + esc(a.body) + '</div></a>';
      }).join('');
      var els = res.querySelectorAll('a.ad');
      for (var i = 0; i < els.length; i++) track(els[i], ads[i].token);
    }

    function run(q) {
      q = (q || '').trim();
      var my = ++seq;
      if (!q) { res.innerHTML = ''; return; }
      getJSON('action=search&unit=' + encodeURIComponent(unit) + '&dev=' + dev + '&q=' + encodeURIComponent(q) + '&r=' + Date.now())
        .then(function (j) { if (my === seq) render((j && j.ok && j.ads) || []); })
        .catch(function () { /* fail silently */ });
    }

    if (existing) {
      existing.addEventListener('keydown', function (e) { if (e.key === 'Enter') run(existing.value); });
      existing.addEventListener('search', function () { run(existing.value); });
      var form = existing.form;
      if (form) form.addEventListener('submit', function () { run(existing.value); });
    } else {
      var input = root.querySelector('input');
      root.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); run(input.value); });
    }
  }

  getJSON('action=serve&unit=' + encodeURIComponent(unit) + '&dev=' + dev + '&r=' + Date.now())
    .then(function (j) {
      if (!j || !j.ok) return;
      if (j.kind === 'search') return mountSearch();
      if (j.ad) showDisplay(j.ad);
    })
    .catch(function () { /* fail silently: never break the host page */ });
})();
