/*!
 * Pro Ads — conversion tracking
 *
 * 1) On every page of your website (so the ad click is remembered):
 *      <script src=".../proconv.js" data-api="https://script.google.com/macros/s/.../exec"></script>
 * 2) On your thank-you / purchase-confirmation page, after the line above:
 *      <script>proconv.track(499);</script>      // order value; use proconv.track() for sign-ups
 */
(function () {
  'use strict';
  var script = document.currentScript;
  var api = script && script.getAttribute('data-api');
  var KEY = 'proclid', WINDOW = 30 * 864e5;

  function read() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || 'null');
      return o && o.id && Date.now() - o.t < WINDOW ? o.id : null;
    } catch (e) { return null; }
  }

  try {
    var id = new URLSearchParams(location.search).get('proclid');
    if (id && /^[a-f0-9]{16}$/.test(id)) localStorage.setItem(KEY, JSON.stringify({ id: id, t: Date.now() }));
  } catch (e) { /* storage blocked */ }

  window.proconv = {
    track: function (value) {
      var id = read();
      if (!id || !api) return;
      var v = Number(value) || 0, sep = api.indexOf('?') > -1 ? '&' : '?';
      fetch(api + sep + 'action=conv&c=' + encodeURIComponent(id) + '&v=' + encodeURIComponent(v),
        { mode: 'no-cors', keepalive: true }).catch(function () {});
    }
  };
})();
