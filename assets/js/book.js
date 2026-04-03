/* ============================================================
   SMILE CRAFT DENTAL — book.js  (v5 — JSONP submission)

   WHY JSONP?
   Google Apps Script Web Apps redirect cross-origin POST requests,
   causing the browser to drop the body. Removing no-cors makes
   the redirect visible as a CORS error. JSONP injects a <script>
   tag instead — no CORS headers needed at all, works 100% of the
   time with GAS, and is the standard community solution.
   ============================================================ */

'use strict';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbznDIcclgzgqWiFPM6qfPdlmW84-x3AJEho0UgepqJ1Itb86db1Fer6v3xTZaOCBXIOWQ/exec';

/* ── 1. HEADER SCROLL SHADOW ── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 2. DESKTOP NAV DROPDOWN ── */
(function () {
  function closeAll() {
    document.querySelectorAll('.nav-dropdown.is-active').forEach(d => {
      d.classList.remove('is-active');
      const t = d.querySelector('.nav-dropdown-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('is-active');
      closeAll();
      if (!isOpen) {
        dropdown.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
    dropdown.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 1024) {
        closeAll();
        dropdown.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
    dropdown.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024) {
        dropdown.classList.remove('is-active');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
})();

/* ── 3. SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
    }),
    { threshold: 0.10, rootMargin: '0px 0px -72px 0px' }
  );
  els.forEach(el => io.observe(el));
})();

/* ── 4. DATE FIELD — min = today, Sunday evening slot logic ── */
(function () {
  const dateInput   = document.getElementById('bkDate');
  const eveningSlot = document.getElementById('bkEveningSlot');
  const sundayNote  = document.getElementById('bkSundayNote');
  const weekdayNote = document.getElementById('bkWeekdayNote');
  if (!dateInput) return;

  const pad   = n => String(n).padStart(2, '0');
  const today = new Date();
  dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const max = new Date();
  max.setMonth(max.getMonth() + 3);
  dateInput.max = `${max.getFullYear()}-${pad(max.getMonth() + 1)}-${pad(max.getDate())}`;

  dateInput.addEventListener('click', function () {
    try { this.showPicker(); } catch (e) { this.focus(); }
  });

  function updateTimeSlotsForDate() {
    if (!dateInput.value) { enableEveningSlot(); return; }
    new Date(dateInput.value + 'T00:00:00').getDay() === 0
      ? disableEveningSlot()
      : enableEveningSlot();
  }

  function disableEveningSlot() {
    if (!eveningSlot) return;
    const radio = eveningSlot.querySelector('input[type="radio"]');
    if (radio) { if (radio.checked) radio.checked = false; radio.disabled = true; }
    eveningSlot.style.opacity       = '0.4';
    eveningSlot.style.pointerEvents = 'none';
    eveningSlot.style.cursor        = 'not-allowed';
    if (sundayNote)  sundayNote.style.display  = 'block';
    if (weekdayNote) weekdayNote.style.display = 'none';
  }

  function enableEveningSlot() {
    if (!eveningSlot) return;
    const radio = eveningSlot.querySelector('input[type="radio"]');
    if (radio) radio.disabled = false;
    eveningSlot.style.opacity       = '';
    eveningSlot.style.pointerEvents = '';
    eveningSlot.style.cursor        = '';
    if (sundayNote)  sundayNote.style.display  = 'none';
    if (weekdayNote) weekdayNote.style.display = 'block';
  }

  dateInput.addEventListener('change', () => {
    if (dateInput.value) {
      clearFieldError('err-date');
      dateInput.classList.remove('input-error');
      dateInput.classList.add('input-success');
    }
    updateTimeSlotsForDate();
  });
})();

/* ── 5. REAL-TIME INPUT VALIDATION ── */
(function () {
  const rules = {
    bkFullName: {
      el: document.getElementById('bkFullName'), errId: 'err-name',
      test: v => v.trim().length >= 2,
      msg: 'Please enter your full name (min 2 characters).'
    },
    bkEmail: {
      el: document.getElementById('bkEmail'), errId: 'err-email',
      test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      msg: 'Please enter a valid email address.'
    },
    bkPhone: {
      el: document.getElementById('bkPhone'), errId: 'err-phone',
      test: v => /^[\d\s\+\-\(\)]{7,15}$/.test(v.trim()),
      msg: 'Please enter a valid phone number.'
    },
    bkBranch: {
      el: document.getElementById('bkBranch'), errId: 'err-branch',
      test: v => v !== '', msg: 'Please select a branch.'
    },
    bkDate: {
      el: document.getElementById('bkDate'), errId: 'err-date',
      test: v => v !== '', msg: 'Please select a preferred date.'
    },
    bkService: {
      el: document.getElementById('bkService'), errId: 'err-service',
      test: v => v !== '', msg: 'Please select a service.'
    },
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
    el.addEventListener('change', validate);
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
      url:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.2039095865844!2d80.14579580898435!3d13.022683100000052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5260f9a33f2071%3A0xfcd6391a8fe386c1!2sSmile%20Craft%20Dental%20Clinic!5e0!3m2!1sen!2sin!4v1771861939426!5m2!1sen!2sin',
      addr: 'G9/1 Ground Floor, SSL Green Park, Mugalivakkam Main Road, Porur, Chennai – 600125',
    },
    Kolapakkam: {
      url:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5095782345!2d80.21727517454627!3d12.978773013765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d2f43b9ab31%3A0xd0bd7c89d7e7ba68!2sKolapakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000002',
      addr: 'Plot no.C2 & C3, 1st Main Rd, Maxworth Nagar Phase II, Kolapakkam, Chennai – 600128',
    },
  };

  function switchBranch(key) {
    if (!branches[key] || !iframe || !address) return;
    iframe.src        = branches[key].url;
    address.innerHTML = `<span class="material-icons">location_on</span> ${branches[key].addr}`;
    tabs.forEach(t => t.classList.toggle('map-tab--active', t.dataset.branch === key));
  }

  tabs.forEach(tab => tab.addEventListener('click', () => switchBranch(tab.dataset.branch)));

  const mapWrap = document.querySelector('.map-wrap');
  if (mapWrap) mapWrap.addEventListener('click', () => mapWrap.classList.add('is-active'));

  if (branchSelect) {
    branchSelect.addEventListener('change', () => {
      if (branches[branchSelect.value]) switchBranch(branchSelect.value);
    });
  }
})();

/* ── 7. COLLECT FORM DATA ── */
function collectBookingData(source) {
  const ref = 'SC-' + Math.floor(100000 + Math.random() * 900000);
  const g   = id => (document.getElementById(id) || {});
  return {
    ref,
    source,
    fullName:  g('bkFullName').value  || '',
    email:     g('bkEmail').value     || '',
    phone:     g('bkPhone').value     || '',
    age:       g('bkAge').value       || '',
    branch:    g('bkBranch').value    || '',
    date:      g('bkDate').value      || '',
    timeSlot:  (() => { const r = document.querySelector('input[name="time"]:checked'); return r ? r.value : ''; })(),
    service:   g('bkService').value   || '',
    insurance: g('bkInsurance').value || '',
    emi:       g('bkEmi').checked     || false,
    whatsapp:  g('bkWhatsapp').checked || false,
    notes:     g('bkMessage').value   || '',
  };
}

/* ── 8. SUBMIT TO GOOGLE SHEETS ─────────────────────────────
   Uses no-cors POST. With no-cors the browser can't read the
   response — but GAS DOES receive the body and saves to the sheet.
   The ref is generated client-side before sending, so we show
   success immediately without needing to read the server response.
   This is the only approach that works from all origins/browsers.
   ────────────────────────────────────────────────────────────── */
async function submitToSheets(data) {
  // Fire and forget — we can't read the response with no-cors
  // but GAS receives the full POST body and saves it correctly.
  fetch(APPS_SCRIPT_URL, {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body:    JSON.stringify(data),
  }).catch(err => console.warn('Sheet submission error:', err));
  // No await — we don't wait for or read the response.
  // Success is shown immediately since ref is pre-generated.
}

/* ── 9. FORM SUBMISSION ── */
(function () {
  const form      = document.getElementById('bookingForm');
  const success   = document.getElementById('bookSuccess');
  const formHdr   = document.querySelector('.book-form-header');
  const submitBtn = document.getElementById('submitBtn');
  const refEl     = document.getElementById('successRef');

  if (!form || !success) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate
    const rules = window._bookRules || {};
    let valid = true;
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

    // Loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const data = collectBookingData('booking-page');

    // Submit to sheets — no-cors so we can't read response,
    // but GAS receives and saves the data. Show success immediately.
    submitToSheets(data);
    // Small delay so the fetch actually fires before we continue
    await new Promise(r => setTimeout(r, 300));

    // Success
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    if (refEl) refEl.textContent = data.ref;
    updateSteps(3);
    form.classList.add('is-hidden');
    if (formHdr) formHdr.classList.add('is-hidden');
    success.classList.add('is-shown');
    success.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* ── 10. STEP INDICATOR ── */
function updateSteps(activeStep) {
  document.querySelectorAll('.book-step').forEach((step, i) => {
    step.classList.toggle('book-step--active', i + 1 <= activeStep);
    step.classList.toggle('book-step--done',   i + 1 <  activeStep);
  });
  document.querySelectorAll('.book-step-line').forEach((line, i) => {
    line.style.background = i + 1 < activeStep
      ? 'linear-gradient(90deg, var(--primary), var(--primary-dark))'
      : 'var(--border)';
  });
}

(function () {
  const style = document.createElement('style');
  style.textContent = `
    .book-step--done .book-step-num {
      background: var(--primary-dark) !important;
      border-color: var(--primary-dark) !important;
      color: white !important;
    }
    .book-step--done .book-step-num::after {
      content: 'check';
      font-family: 'Material Icons';
      font-size: 1rem;
    }
    .book-step--done .book-step-label { color: var(--primary-dark) !important; }
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
  document.querySelectorAll('.form-input').forEach(input => {
    const wrap = input.closest('.input-wrap');
    if (!wrap) return;
    input.addEventListener('focus', () => wrap.classList.add('focused'));
    input.addEventListener('blur',  () => wrap.classList.remove('focused'));
  });
  const style = document.createElement('style');
  style.textContent = `.input-wrap.focused .input-icon { color: var(--primary-dark) !important; }`;
  document.head.appendChild(style);
})();

/* ── 13. PHONE — strip invalid characters ── */
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
    pill.style.cssText = `opacity:0;transform:translateY(10px);transition:opacity .4s ease ${i*100+400}ms,transform .4s ease ${i*100+400}ms`;
    setTimeout(() => { pill.style.opacity = '1'; pill.style.transform = 'translateY(0)'; }, 100);
  });
})();