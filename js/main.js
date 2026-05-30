'use strict';

/* ── NAV SCROLL ───────────────────────────────────────────── */
(function(){
  const nav = document.getElementById('nav');
  if(!nav) return;
  const fn = () => window.scrollY > 40 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled');
  window.addEventListener('scroll', fn, {passive:true});
  fn();
})();

/* ── MOBILE MENU ──────────────────────────────────────────── */
(function(){
  const btn = document.querySelector('.nav-hamburger');
  const mob = document.querySelector('.nav-mob');
  if(!btn||!mob) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    btn.classList.remove('open');
    mob.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

/* ── SCROLL REVEAL ────────────────────────────────────────── */
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, {threshold:0.10, rootMargin:'0px 0px -30px 0px'});
  els.forEach(el => obs.observe(el));
})();

/* ── SMOOTH SCROLL ────────────────────────────────────────── */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if(!t) return;
      e.preventDefault();
      const nh = document.getElementById('nav')?.offsetHeight || 68;
      window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - nh, behavior:'smooth'});
    });
  });
})();

/* ── COUNTERS ─────────────────────────────────────────────── */
(function(){
  const els = document.querySelectorAll('[data-count]');
  if(!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const el = e.target, end = parseInt(el.dataset.count), dur = 1800, t0 = performance.now();
      const step = now => {
        const p = Math.min((now-t0)/dur, 1), ease = 1 - Math.pow(1-p, 3);
        el.textContent = Math.floor(ease*end).toLocaleString('pt-BR');
        if(p < 1) requestAnimationFrame(step); else el.textContent = end.toLocaleString('pt-BR');
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, {threshold:0.5});
  els.forEach(el => obs.observe(el));
})();


/* ── HERO TYPEWRITER ─────────────────────────────────────── */
(function(){
  const el = document.querySelector('.hero-type');
  if(!el) return;
  let words = [];
  try { words = JSON.parse(el.getAttribute('data-words') || '[]'); } catch(e) { words = []; }
  if(!words.length) words = [el.textContent.trim()].filter(Boolean);
  let wi = 0, ci = words[0].length, deleting = false;
  el.textContent = words[0];

  const tick = () => {
    const word = words[wi];
    if(deleting) {
      ci = Math.max(0, ci - 1);
      el.textContent = word.slice(0, ci);
      if(ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    } else {
      const next = words[wi];
      ci = Math.min(next.length, ci + 1);
      el.textContent = next.slice(0, ci);
      if(ci === next.length) { setTimeout(() => { deleting = true; tick(); }, 1700); return; }
    }
    setTimeout(tick, deleting ? 42 : 78);
  };
  setTimeout(() => { deleting = true; tick(); }, 1800);
})();

/* ── BRANDS TICKER CLONE ──────────────────────────────────── */
(function(){
  const t = document.querySelector('.brands-track');
  if(!t) return;
  t.parentElement.appendChild(t.cloneNode(true));
})();

/* ── LEAD FORM ────────────────────────────────────────────── */
(function(){
  const form = document.getElementById('lead-form');
  const ok   = document.getElementById('form-ok');
  if(!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" style="width:17px;height:17px;fill:none;stroke:#fff;stroke-width:2;animation:spin .8s linear infinite"><circle cx="12" cy="12" r="10" stroke-opacity=".3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Enviando…';
    btn.disabled = true;

    const d = {
      nome: form.nome?.value?.trim() || '',
      tel:  form.telefone?.value?.trim() || '',
      vei:  form.veiculo?.value || '',
      srv:  form.servico?.value || '',
      msg:  form.mensagem?.value?.trim() || '',
    };

    const wa = `Ol%C3%A1!%20Vim%20pela%20p%C3%A1gina%20de%20Mec%C3%A2nica%20Geral.%0A%0A` +
      `*Nome:*%20${encodeURIComponent(d.nome)}%0A` +
      `*WhatsApp:*%20${encodeURIComponent(d.tel)}%0A` +
      `*Ve%C3%ADculo:*%20${encodeURIComponent(d.vei)}%0A` +
      `*Servi%C3%A7o:*%20${encodeURIComponent(d.srv)}` +
      (d.msg ? `%0A*Obs:*%20${encodeURIComponent(d.msg)}` : '');

    const waUrl = `https://wa.me/5545998566789?text=${wa}`;
    const opened = window.open(waUrl, '_blank', 'noopener');
    if (!opened) window.location.href = waUrl;

    form.style.display = 'none';
    ok.classList.add('show');

    btn.innerHTML = orig;
    btn.disabled = false;
  });

  // Phone mask
  const tel = form.querySelector('[name="telefone"]');
  if(tel) tel.addEventListener('input', () => {
    let v = tel.value.replace(/\D/g,'').slice(0,11);
    if(v.length > 10)      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/,'($1) $2-$3');
    else if(v.length > 6)  v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/,'($1) $2-$3');
    else if(v.length > 2)  v = v.replace(/^(\d{2})(\d{0,5})$/,'($1) $2');
    else if(v.length > 0)  v = '(' + v;
    tel.value = v;
  });
})();

/* ── PARALLAX HERO ────────────────────────────────────────── */
(function(){
  const bg = document.querySelector('.hero-photo');
  if(!bg || window.innerWidth < 900) return;
  window.addEventListener('scroll', () => {
    bg.style.transform = `translateY(${window.scrollY * 0.28}px) scale(1.05)`;
  }, {passive:true});
})();

/* spin keyframe */
const style = document.createElement('style');
style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(style);

console.log('%c🔧 Centro Automotivo Nova Geração', 'color:#FF370F;font-size:15px;font-weight:bold');
