(function () {
  // Mobile menu
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Word-by-word highlight of the statement
  var big = document.getElementById('bigText');
  var words = big.textContent.trim().split(/\s+/);
  big.innerHTML = words.map(function (w) { return '<span>' + w + '</span>'; }).join(' ');
  var spans = big.querySelectorAll('span');
  function paint() {
    var r = big.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    var n = Math.round(p * spans.length);
    spans.forEach(function (s, i) { s.classList.toggle('on', i < n); });
  }
  window.addEventListener('scroll', paint, { passive: true });
  window.addEventListener('resize', paint);
  paint();

  // CV modal
  var cvModal = document.getElementById('cvModal');
  var cvFrame = document.getElementById('cvFrame');
  var viewCv = document.getElementById('viewCv');
  var cvClose = document.getElementById('cvClose');
  function openCv(e) {
    e.preventDefault();
    if (!cvFrame.getAttribute('src')) cvFrame.setAttribute('src', 'assets/cv.html');
    cvModal.hidden = false;
    document.body.classList.add('modal-open');
    cvClose.focus();
  }
  function closeCv() {
    cvModal.hidden = true;
    document.body.classList.remove('modal-open');
    viewCv.focus();
  }
  viewCv.addEventListener('click', openCv);
  cvClose.addEventListener('click', closeCv);
  cvModal.addEventListener('click', function (e) { if (e.target === cvModal) closeCv(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !cvModal.hidden) closeCv(); });

  // In-page links (nav + footer): scroll explicitly to the target section
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      try { history.replaceState(null, '', id); } catch (err) {}
    });
  });
})();
