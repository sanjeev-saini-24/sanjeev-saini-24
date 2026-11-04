(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // scroll progress + sticky nav
  var bar = $('#progress'), nav = $('#nav');
  function onScroll() {
    var h = document.documentElement;
    var p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = (p * 100) + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
  var burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // typing effect
  var roles = ['B.A. Graduate', 'RS-CIT Certified', 'MS Office Skilled', 'Quick Learner'];
  var el = $('#typed'), ri = 0, ci = 0, del = false;
  function type() {
    var word = roles[ri];
    el.textContent = word.slice(0, ci);
    if (!del && ci === word.length) { del = true; return setTimeout(type, 1500); }
    if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    ci += del ? -1 : 1;
    setTimeout(type, del ? 40 : 85);
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = roles[0] + ' · ' + roles[1];
  } else { type(); }

  // reveal on scroll + counters
  function count(n) {
    var end = +n.dataset.count, cur = 0;
    var t = setInterval(function () {
      cur++; n.textContent = cur;
      if (cur >= end) clearInterval(t);
    }, 260);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      var c = $('[data-count]', e.target);
      if (c) count(c);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(function (r) { io.observe(r); });

  // 3D tilt on hover (pointer devices only)
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.tilt').forEach(function (t) {
      var base = t.style.transform;
      t.addEventListener('mousemove', function (e) {
        var r = t.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transition = 'transform .1s';
        t.style.transform = 'perspective(700px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-4px)';
      });
      t.addEventListener('mouseleave', function () {
        t.style.transition = 'transform .5s';
        t.style.transform = base;
      });
    });
  }

  // copy buttons
  var toast = $('#toast'), tt;
  $$('.copy[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.dataset.copy;
      var done = function () {
        toast.textContent = 'Copied: ' + v;
        toast.classList.add('show');
        clearTimeout(tt);
        tt = setTimeout(function () { toast.classList.remove('show'); }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, done);
      else done();
    });
  });
})();
