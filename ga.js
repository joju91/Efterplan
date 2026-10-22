/* Efterplan — Google Analytics 4, cookielöst.
 *
 * GA4 har ingen inbyggd "inga cookies"-inställning som behåller datan i
 * rapporterna: client_storage: 'none' ignoreras, Consent Mode "denied" gör
 * att datan inte syns, och blockeras cookien helt skickar GA ingenting.
 * Därför skrivs GA:s egna cookies (_ga, _ga_<id>) här till en burk i minnet
 * i stället för till webbläsaren. GA kan läsa tillbaka dem under
 * sidladdningen, men inget sparas på besökarens enhet — så ingen
 * samtyckesbanner behövs. Varje sidladdning blir en ny anonym besökare:
 * "användare" överräknas vid flersidesbesök, men sidvisningar och event
 * stämmer. Google Ads-cookien (_gcl_au) påverkas inte.
 *
 * Laddas med defer i <head> på alla sidor, före app.js. På index.html finns
 * redan en statisk Google Ads-tagg som definierar gtag — då återanvänds den.
 */
(function () {
  var GA_ID = 'G-T1T40TYPQB';
  var GA_COOKIE = /^\s*_ga(_|=)/;
  var jar = {};

  var desc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  if (desc && desc.get && desc.set) {
    // Rensa ev. _ga-cookies från tidigare GA-perioder (före 2026-09).
    desc.get.call(document).split(';').forEach(function (c) {
      if (!GA_COOKIE.test(c)) return;
      var name = c.split('=')[0].trim();
      var host = location.hostname.replace(/^www\./, '');
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        desc.set.call(document, name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d);
      });
    });

    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: function () {
        var real = desc.get.call(document).split(';')
          .map(function (c) { return c.trim(); })
          .filter(function (c) { return c && !GA_COOKIE.test(c); });
        Object.keys(jar).forEach(function (n) { real.push(n + '=' + jar[n]); });
        return real.join('; ');
      },
      set: function (v) {
        v = String(v);
        if (!GA_COOKIE.test(v)) { desc.set.call(document, v); return; }
        var parts = v.split(';');
        var eq = parts[0].indexOf('=');
        var name = parts[0].slice(0, eq).trim();
        var value = parts[0].slice(eq + 1).trim();
        var expired = parts.slice(1).some(function (a) {
          a = a.trim().toLowerCase();
          if (a.indexOf('max-age=') === 0) return parseInt(a.slice(8), 10) <= 0;
          if (a.indexOf('expires=') === 0) return new Date(a.slice(8)).getTime() < Date.now();
          return false;
        });
        if (expired || !value) delete jar[name]; else jar[name] = value;
      },
    });
  }

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
  }
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  window.gtag('config', GA_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  // Skicka ett GA4-event till enbart GA4 (inte Ads). No-op-säker.
  window.gaEvent = function (name, params) {
    try {
      var p = Object.assign({ send_to: GA_ID }, params || {});
      window.gtag('event', name, p);
    } catch (e) {}
  };
})();
