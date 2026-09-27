// 방문 집계 — 개인을 식별하는 정보는 보내지 않고, 날짜·페이지·유입 사이트 종류만 센다.
(function () {
  try {
    var host = location.hostname;
    if (host !== 'creango.kr' && host !== 'www.creango.kr') return;
    if (navigator.doNotTrack === '1') return;
    var today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
    var unique = false;
    try {
      unique = localStorage.getItem('creango_visit_day') !== today;
      if (unique) localStorage.setItem('creango_visit_day', today);
    } catch (e) { unique = false; }
    var source = 'direct';
    if (document.referrer) {
      try {
        var refHost = new URL(document.referrer).hostname;
        if (refHost === host || refHost === 'www.' + host) source = 'internal';
        else if (/(^|\.)naver\.com$/.test(refHost)) source = 'naver';
        else if (/(^|\.)google\./.test(refHost)) source = 'google';
        else if (/(^|\.)(daum\.net|kakao\.com)$/.test(refHost)) source = 'daum';
        else source = 'other';
      } catch (e) { source = 'other'; }
    }
    fetch('https://api.creango.kr/api/site-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: location.pathname, source: source, unique: unique }),
      keepalive: true
    }).catch(function () {});
  } catch (e) {}
})();
