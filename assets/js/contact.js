/* ============================================================
   SMILE CRAFT DENTAL — contact.js  (v3 — Updated for new form fields)
   ============================================================ */

'use strict';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycgnGu6yry59NWWGaSKcOKpnilW6VcFO2OVWYIaFQIV8zR6o1Mzeab6L-viV0thVMp/exec';

/* ── 1. HEADER SCROLL SHADOW ── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 2. SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.10, rootMargin: '0px 0px -72px 0px' }
  );
  els.forEach((el) => io.observe(el));
})();

/* ── 3. HERO PILL ENTRANCE ── */
(function () {
  const pills = document.querySelectorAll('.contact-pill');
  if (!pills.length) return;
  pills.forEach((pill, i) => {
    pill.style.opacity    = '0';
    pill.style.transform  = 'translateY(10px)';
    pill.style.transition = `opacity .4s ease ${i * 110 + 350}ms, transform .4s ease ${i * 110 + 350}ms`;
  });
  requestAnimationFrame(() => setTimeout(() => {
    pills.forEach((pill) => { pill.style.opacity = '1'; pill.style.transform = 'translateY(0)'; });
  }, 100));
})();

/* ── 4. QUICK CONTACT BUTTONS — stagger ── */
(function () {
  const btns = document.querySelectorAll('.quick-contact-btn');
  if (!btns.length) return;
  btns.forEach((btn, i) => {
    btn.style.opacity    = '0';
    btn.style.transform  = 'translateX(20px)';
    btn.style.transition = `opacity .45s ease ${i * 120}ms, transform .45s ease ${i * 120}ms`;
  });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateX(0)';
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.3 }
  );
  btns.forEach((btn) => io.observe(btn));
})();

/* ── 5. BRANCH CARD MAP — tap-to-activate on touch devices ── */
(function () {
  document.querySelectorAll('.branch-card-map').forEach((wrap) => {
    wrap.addEventListener('click', () => wrap.classList.add('is-active'));
  });
  // Desktop: iframe hover zoom
  document.querySelectorAll('.branch-card').forEach((card) => {
    const iframe = card.querySelector('iframe');
    if (!iframe) return;
    iframe.style.transition = 'transform .4s ease';
    card.addEventListener('mouseenter', () => { iframe.style.transform = 'scale(1.04)'; });
    card.addEventListener('mouseleave', () => { iframe.style.transform = 'scale(1)'; });
  });
})();

/* ── 6. FAQ STRIP — stagger on scroll ── */
(function () {
  const items = document.querySelectorAll('.faq-strip-item');
  if (!items.length) return;
  items.forEach((el, i) => { el.style.transitionDelay = `${i * 80}ms`; });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.15, rootMargin: '0px 0px -72px 0px' }
  );
  items.forEach((el) => io.observe(el));
})();

/* ── 7. CONTACT DETAIL ITEMS STAGGER ── */
(function () {
  const items = document.querySelectorAll('.contact-detail-item');
  if (!items.length) return;
  items.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateX(-14px)';
    el.style.transition = `opacity .45s ease ${i * 80}ms, transform .45s ease ${i * 80}ms`;
  });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateX(0)';
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.2, rootMargin: '0px 0px -72px 0px' }
  );
  items.forEach((el) => io.observe(el));
})();

/* ── 8. CONTACT DETAIL HOVER ICON ── */
(function () {
  document.querySelectorAll('.contact-detail-item').forEach((item) => {
    const icon = item.querySelector('.contact-detail-icon');
    if (!icon) return;
    icon.style.transition = 'transform .3s ease';
    item.addEventListener('mouseenter', () => { icon.style.transform = 'scale(1.15) rotate(-5deg)'; });
    item.addEventListener('mouseleave', () => { icon.style.transform = ''; });
  });
})();

/* ── 9. MIN DATE — today, skip Sundays ── */
(function () {
  const dateInput = document.getElementById('cpDate');
  if (!dateInput) return;
  const pad   = (n) => String(n).padStart(2, '0');
  const today = new Date();
  if (today.getDay() === 0) today.setDate(today.getDate() + 1);
  dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const max = new Date();
  max.setMonth(max.getMonth() + 3);
  dateInput.max = `${max.getFullYear()}-${pad(max.getMonth() + 1)}-${pad(max.getDate())}`;
})();

/* ── 10. REAL-TIME FORM VALIDATION ── */
const _contactValidators = {
  cpName   : { test: (v) => v.trim().length >= 2,                        msg: 'Please enter your full name.',         errId: 'err-name'    },
  cpEmail  : { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.',  errId: 'err-email'   },
  cpPhone  : { test: (v) => /^[\d\s\+\-\(\)]{7,15}$/.test(v.trim()),    msg: 'Please enter a valid phone number.',   errId: 'err-phone'   },
  cpBranch : { test: (v) => v !== '',                                     msg: 'Please select a branch.',             errId: 'err-branch'  },
  cpService: { test: (v) => v !== '',                                     msg: 'Please select a service.',            errId: 'err-service' },
  cpMessage: { test: (v) => v.trim().length >= 10,                       msg: 'Please write at least 10 characters.', errId: 'err-message' },
};

Object.entries(_contactValidators).forEach(([id, { test, msg, errId }]) => {
  const el = document.getElementById(id);
  if (!el) return;
  const validate = () => {
    if (!el.value) return;
    if (test(el.value)) {
      _clearErr(errId); el.classList.remove('input-error'); el.classList.add('input-success');
    } else {
      _showErr(errId, msg); el.classList.add('input-error'); el.classList.remove('input-success');
    }
  };
  el.addEventListener('blur', validate);
  el.addEventListener('input', () => { if (el.classList.contains('input-error')) validate(); });
});

/* ── 11. PHONE AUTO-FORMAT ── */
(function () {
  const phone = document.getElementById('cpPhone');
  if (!phone) return;
  phone.addEventListener('input', () => {
    phone.value = phone.value.replace(/[^\d\+\s\-]/g, '');
  });
})();

/* ── 12. FORM SUBMISSION ── */
(function () {
  const form      = document.getElementById('contactForm');
  const success   = document.getElementById('contactSuccess');
  const formTop   = document.getElementById('contactFormTop');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form || !success) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    let valid = true;
    Object.entries(_contactValidators).forEach(([id, { test, msg, errId }]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!test(el.value)) {
        _showErr(errId, msg);
        el.classList.add('input-error');
        el.classList.remove('input-success');
        valid = false;
      }
    });

    if (!valid) {
      const firstErr = form.querySelector('.input-error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      submitBtn.classList.add('shake');
      setTimeout(() => submitBtn.classList.remove('shake'), 600);
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Collect data — same structure as book.js
    const ref  = 'SC-MSG-' + Math.floor(100000 + Math.random() * 900000);
    const data = {
      ref,
      source:    'contact-page',
      fullName:  (document.getElementById('cpName')     || {}).value || '',
      email:     (document.getElementById('cpEmail')    || {}).value || '',
      phone:     (document.getElementById('cpPhone')    || {}).value || '',
      age:       (document.getElementById('cpAge')      || {}).value || '',
      branch:    (document.getElementById('cpBranch')   || {}).value || '',
      date:      (document.getElementById('cpDate')     || {}).value || '',
      timeSlot:  (() => { const r = document.querySelector('input[name="time"]:checked'); return r ? r.value : ''; })(),
      service:   (document.getElementById('cpService')  || {}).value || '',
      insurance: (document.getElementById('cpInsurance')|| {}).value || '',
      notes:     (document.getElementById('cpMessage')  || {}).value || '',
      emi:       (document.getElementById('cpEmi')      || {}).checked || false,
      whatsapp:  (document.getElementById('cpWhatsapp') || {}).checked || false,
    };

    try {
      await fetch(APPS_SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body:    JSON.stringify(data),
      });
    } catch (err) {
      console.warn('Contact form submission error (non-critical):', err);
    }

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;

    form.classList.add('is-hidden');
    if (formTop) formTop.classList.add('is-hidden');
    success.classList.add('is-shown');
    success.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* ── 13. INPUT FOCUS GLOW ── */
(function () {
  document.querySelectorAll('.form-input').forEach((input) => {
    const wrap = input.closest('.input-wrap');
    if (!wrap) return;
    input.addEventListener('focus', () => wrap.classList.add('focused'));
    input.addEventListener('blur',  () => wrap.classList.remove('focused'));
  });
  const style = document.createElement('style');
  style.textContent = `.input-wrap.focused .input-icon { color: var(--primary) !important; }`;
  document.head.appendChild(style);
})();

/* ── 14. SHAKE ANIMATION ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
    .shake { animation: shake 0.5s ease; }
  `;
  document.head.appendChild(style);
})();

/* ── HELPER FUNCTIONS ── */
function _showErr(errId, msg) {
  const el = document.getElementById(errId); if (el) el.textContent = msg;
}
function _clearErr(errId) {
  const el = document.getElementById(errId); if (el) el.textContent = '';
}