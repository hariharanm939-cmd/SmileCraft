/* ============================================================
   SMILE CRAFT DENTAL — book.js  (v2 — Google Sheets Integration)
   Book Appointment Page JavaScript
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   ★  REPLACE THIS URL with your deployed Apps Script Web App URL
      (Apps Script → Deploy → New Deployment → Web App)
────────────────────────────────────────────────────────────── */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycgnGu6yry59NWWGaSKcOKpnilW6VcFO2OVWYIaFQIV8zR6o1Mzeab6L-viV0thVMp/exec';

/* ── 1. HEADER SCROLL SHADOW ── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 2. MOBILE MENU TOGGLE ── */
(function () {
  const btn  = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.querySelector('.material-icons').textContent = isOpen ? 'close' : 'menu';
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelector('.material-icons').textContent = 'menu';
    }
  });
})();

/* ── 3. SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => io.observe(el));
})();

/* ── 4. MIN DATE — today, skip Sundays ── */
(function () {
  const dateInput = document.getElementById('bkDate');
  if (!dateInput) return;

  const pad = (n) => String(n).padStart(2, '0');
  const today = new Date();
  if (today.getDay() === 0) today.setDate(today.getDate() + 1);
  dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // Max: 3 months ahead
  const max = new Date();
  max.setMonth(max.getMonth() + 3);
  dateInput.max = `${max.getFullYear()}-${pad(max.getMonth() + 1)}-${pad(max.getDate())}`;

  dateInput.addEventListener('change', () => {
    const selected = new Date(dateInput.value + 'T00:00:00');
    if (selected.getDay() === 0) {
      showFieldError('err-date', 'We are closed on Sundays. Please select another day.');
      dateInput.classList.add('input-error');
    } else {
      clearFieldError('err-date');
      dateInput.classList.remove('input-error');
      dateInput.classList.add('input-success');
    }
  });
})();

/* ── 5. REAL-TIME INPUT VALIDATION ── */
(function () {
  const rules = {
    bkFullName: { el: document.getElementById('bkFullName'), errId: 'err-name',    test: (v) => v.trim().length >= 2,                               msg: 'Please enter your full name (min 2 characters).' },
    bkEmail:    { el: document.getElementById('bkEmail'),    errId: 'err-email',   test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),        msg: 'Please enter a valid email address.' },
    bkPhone:    { el: document.getElementById('bkPhone'),    errId: 'err-phone',   test: (v) => /^[\d\s\+\-\(\)]{7,15}$/.test(v.trim()),            msg: 'Please enter a valid phone number.' },
    bkBranch:   { el: document.getElementById('bkBranch'),   errId: 'err-branch',  test: (v) => v !== '',                                            msg: 'Please select a branch.' },
    bkDate:     { el: document.getElementById('bkDate'),     errId: 'err-date',    test: (v) => v !== '' && new Date(v + 'T00:00:00').getDay() !== 0, msg: 'Please select a valid date (not Sunday).' },
    bkService:  { el: document.getElementById('bkService'),  errId: 'err-service', test: (v) => v !== '',                                            msg: 'Please select a service.' },
  };

  Object.values(rules).forEach(({ el, errId, test, msg }) => {
    if (!el) return;
    const validate = () => {
      if (!el.value) return;
      if (test(el.value)) {
        clearFieldError(errId);
        el.classList.remove('input-error');
        el.classList.add('input-success');
      } else {
        showFieldError(errId, msg);
        el.classList.add('input-error');
        el.classList.remove('input-success');
      }
    };
    el.addEventListener('blur', validate);
    el.addEventListener('input', () => { if (el.classList.contains('input-error')) validate(); });
  });

  window._bookRules = rules;
})();

/* ── 6. MAP BRANCH SWITCHER ── */
(function () {
  const tabs         = document.querySelectorAll('.map-tab');
  const iframe       = document.getElementById('mapIframe');
  const address      = document.getElementById('mapAddress');
  const branchSelect = document.getElementById('bkBranch');

  const branches = {
    porur: {
      url:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.2!2d80.2142!3d13.0878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526f5f8c6e0001%3A0x1!2sAnna+Nagar+Chennai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
      addr: 'G9/1 Ground Floor, SSL Green Park, Mugalivakkam Main Road, Porur, Chennai – 600125',
    },
    Kolapakkam: {
      url:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9!2d80.2209!3d12.9788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d2a9c83a5c5%3A0x1!2sVelachery+Chennai!5e0!3m2!1sen!2sin!4v1700000000001!5m2!1sen!2sin',
      addr: 'Plot no.C2 & C3, 1st Main Rd, Maxworth Nagar Phase II, Kolapakkam, Chennai – 600128',
    },
  };

  function switchBranch(key) {
    if (!branches[key] || !iframe || !address) return;
    iframe.src = branches[key].url;
    address.innerHTML = `<span class="material-icons">location_on</span> ${branches[key].addr}`;
    tabs.forEach((t) => t.classList.toggle('map-tab--active', t.dataset.branch === key));
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => switchBranch(tab.dataset.branch)));

  if (branchSelect) {
    branchSelect.addEventListener('change', () => {
      if (branches[branchSelect.value]) switchBranch(branchSelect.value);
    });
  }
})();

/* ── 7. COLLECT FORM DATA ── */
function collectBookingData(source) {
  const ref = 'SC-' + Math.floor(100000 + Math.random() * 900000);
  return {
    ref,
    source,
    fullName:  (document.getElementById('bkFullName')  || {}).value || '',
    email:     (document.getElementById('bkEmail')     || {}).value || '',
    phone:     (document.getElementById('bkPhone')     || {}).value || '',
    age:       (document.getElementById('bkAge')       || {}).value || '',
    branch:    (document.getElementById('bkBranch')    || {}).value || '',
    date:      (document.getElementById('bkDate')      || {}).value || '',
    timeSlot:  (() => { const r = document.querySelector('input[name="time"]:checked'); return r ? r.value : ''; })(),
    service:   (document.getElementById('bkService')   || {}).value || '',
    insurance: (document.getElementById('bkInsurance') || {}).value || '',
    emi:       (document.getElementById('bkEmi')       || {}).checked || false,
    whatsapp:  (document.getElementById('bkWhatsapp')  || {}).checked || false,
    notes:     (document.getElementById('bkMessage')   || {}).value || '',
  };
}

/* ── 8. SUBMIT TO GOOGLE SHEETS ── */
async function submitToGoogleSheets(data) {
  // Uses no-cors because Apps Script Web Apps don't support CORS preflight properly.
  // We fire-and-forget; success is assumed if no network error.
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode:   'no-cors',   // Required for Apps Script cross-origin
    headers: { 'Content-Type': 'text/plain' },  // text/plain avoids OPTIONS preflight
    body:   JSON.stringify(data),
  });
}

/* ── 9. BOOKING PAGE FORM SUBMISSION ── */
(function () {
  const form      = document.getElementById('bookingForm');
  const success   = document.getElementById('bookSuccess');
  const header    = document.querySelector('.book-form-header');
  const submitBtn = document.getElementById('submitBtn');
  const refEl     = document.getElementById('successRef');

  if (!form || !success) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const rules = window._bookRules || {};
    let   valid = true;

    Object.values(rules).forEach(({ el, errId, test, msg }) => {
      if (!el) return;
      if (!test(el.value)) {
        showFieldError(errId, msg);
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

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const data = collectBookingData('booking-page');

    try {
      await submitToGoogleSheets(data);
    } catch (err) {
      console.warn('Sheets submission error (non-critical):', err);
      // We still show success — the no-cors fetch may throw but data is sent
    }

    // Update ref number display
    if (refEl) refEl.textContent = data.ref;

    // Update step indicator
    updateSteps(3);

    // Show success state
    form.classList.add('is-hidden');
    if (header) header.classList.add('is-hidden');
    success.classList.add('is-shown');
    success.scrollIntoView({ behavior: 'smooth', block: 'start' });

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  });
})();

/* ── 10. STEP INDICATOR ── */
function updateSteps(activeStep) {
  const steps = document.querySelectorAll('.book-step');
  const lines = document.querySelectorAll('.book-step-line');
  steps.forEach((step, i) => {
    step.classList.toggle('book-step--active', i + 1 <= activeStep);
    step.classList.toggle('book-step--done',   i + 1 <  activeStep);
  });
  lines.forEach((line, i) => {
    line.style.background = i + 1 < activeStep
      ? 'linear-gradient(90deg, var(--mint), var(--mint-dark))'
      : 'var(--border)';
  });
}

// Done state + shake CSS
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .book-step--done .book-step-num {
      background: var(--mint-dark) !important;
      border-color: var(--mint-dark) !important;
      color: white !important;
    }
    .book-step--done .book-step-num::after {
      content: 'check';
      font-family: 'Material Icons';
      font-size: 1rem;
    }
    .book-step--done .book-step-label { color: var(--mint-dark) !important; }
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

/* ── 11. HELPER FUNCTIONS ── */
function showFieldError(errId, msg) {
  const el = document.getElementById(errId);
  if (el) el.textContent = msg;
}
function clearFieldError(errId) {
  const el = document.getElementById(errId);
  if (el) el.textContent = '';
}

/* ── 12. INPUT FOCUS GLOW ── */
(function () {
  document.querySelectorAll('.form-input').forEach((input) => {
    const wrap = input.closest('.input-wrap');
    if (!wrap) return;
    input.addEventListener('focus', () => wrap.classList.add('focused'));
    input.addEventListener('blur',  () => wrap.classList.remove('focused'));
  });
  const style = document.createElement('style');
  style.textContent = `.input-wrap.focused .input-icon { color: var(--mint-dark) !important; }`;
  document.head.appendChild(style);
})();

/* ── 13. PHONE — auto format ── */
(function () {
  const phone = document.getElementById('bkPhone');
  if (!phone) return;
  phone.addEventListener('input', () => {
    phone.value = phone.value.replace(/[^\d\+\s\-]/g, '');
  });
})();

/* ── 14. HERO PILLS animation ── */
(function () {
  document.querySelectorAll('.book-pill').forEach((pill, i) => {
    pill.style.cssText = `opacity:0;transform:translateY(10px);transition:opacity .4s ease ${i * 100 + 400}ms,transform .4s ease ${i * 100 + 400}ms`;
    setTimeout(() => { pill.style.opacity = '1'; pill.style.transform = 'translateY(0)'; }, 100);
  });
})();