/* 크린고 입장 화면 — ENTER 버튼 또는 키보드 Enter 키로 홈페이지에 들어간다.
   입장하면 이 브라우저 탭에서는 다시 보이지 않고(sessionStorage), #앵커 주소로 들어오면 처음부터 건너뛴다.
   홈페이지 본문은 인트로 뒤에 그대로 있어서 검색 엔진과 스크린리더는 항상 전체 내용을 읽을 수 있다. */
(function () {
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  var enterButton = document.getElementById('intro-enter');
  if (!intro || !enterButton) return;

  var ENTERED_KEY = 'creango-intro-entered';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var closing = false;
  var finished = false;

  function isShowing() { return root.classList.contains('has-intro'); }

  function finish() {
    if (finished) return;
    finished = true;
    intro.hidden = true;
    intro.setAttribute('inert', '');
    root.classList.remove('has-intro');
    window.scrollTo(0, 0);
    var main = document.getElementById('main');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
    }
  }

  function enter() {
    if (closing || !isShowing()) return;
    closing = true;
    try { sessionStorage.setItem(ENTERED_KEY, '1'); } catch (error) { /* 저장이 막혀 있어도 입장은 된다 */ }
    if (reduceMotion) { finish(); return; }
    intro.classList.add('is-leaving');
    intro.addEventListener('transitionend', function (event) {
      if (event.target === intro && event.propertyName === 'transform') finish();
    });
    window.setTimeout(finish, 1100); // transitionend 가 오지 않는 브라우저 대비
  }

  enterButton.addEventListener('click', enter);
  document.addEventListener('keydown', function (event) {
    if (!isShowing()) return;
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      enter();
    }
  });

  if (isShowing()) enterButton.focus({ preventScroll: true });

  // 나중에 실제 촬영 영상이 준비되면 site-config.js 의 CREANGO_INTRO_VIDEO 에 파일 주소를 넣기만 하면 된다.
  // 영상이 재생 가능해지면 애니메이션 대신 영상이 나오고, 실패하면 애니메이션이 그대로 남는다.
  var videoSrc = window.CREANGO_INTRO_VIDEO;
  var scene = intro.querySelector('.intro-scene');
  if (videoSrc && scene && !reduceMotion) {
    var video = document.createElement('video');
    video.className = 'intro-video';
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.preload = 'metadata';
    if (window.CREANGO_INTRO_POSTER) video.poster = window.CREANGO_INTRO_POSTER;
    video.src = videoSrc;
    video.addEventListener('canplay', function () { scene.classList.add('has-video'); });
    scene.appendChild(video);
  }
})();
