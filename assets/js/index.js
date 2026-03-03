/* ============================================================
   SMILE CRAFT DENTAL — index.js  (v2 — Google Sheets Integration)
   Pure Vanilla JavaScript | Homepage
   ============================================================ */

/* ──────────────────────────────────────────────────────────────
   ★  REPLACE THIS URL with your deployed Apps Script Web App URL
      Same URL used in book.js — keep them in sync.
────────────────────────────────────────────────────────────── */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyD-DmsZPcmN54qu8TFHIFpGx_sFZtVTDbS7SmMD0vsQAB562DbJzX53tkSxdd0Wbbx/exec';

document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────
     1. MOBILE MENU TOGGLE
  ────────────────────────────────────────────── */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu    = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      const icon = mobileMenuBtn.querySelector('.material-icons');
      if (icon) icon.textContent = isOpen ? 'close' : 'menu';
    });

    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuBtn.querySelector('.material-icons');
        if (icon) icon.textContent = 'menu';
      });
    });
  }

  /* ──────────────────────────────────────────────
     2. STICKY HEADER SHADOW ON SCROLL
  ────────────────────────────────────────────── */
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      siteHeader.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     3. SCROLL REVEAL
  ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ──────────────────────────────────────────────
     4. BOOKING POPUP
  ────────────────────────────────────────────── */
  const popup     = document.getElementById('bookPopup');
  const bkClose   = document.getElementById('bkClose');
  const bkForm    = document.getElementById('bkForm');
  const bkSuccess = document.getElementById('bkSuccess');

  function openPopup() {
    if (!popup) return;
    popup.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Auto-show after 8 seconds
  if (popup) setTimeout(openPopup, 8000);

  if (bkClose) bkClose.addEventListener('click', closePopup);

  if (popup) {
    popup.addEventListener('click', function (e) {
      if (e.target === popup) closePopup();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  // "Book Appointment" links open the popup (homepage only)
  if (document.body.dataset.page === 'home') {
    document.querySelectorAll('a[href="book.html"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openPopup();
      });
    });
  }

  /* ──────────────────────────────────────────────
     POPUP FORM — collect data (matches booking page fields)
  ────────────────────────────────────────────── */
  function collectPopupData() {
    const ref = 'SC-' + Math.floor(100000 + Math.random() * 900000);
    // Popup form field IDs (from index.html bkForm)
    const nameEl     = bkForm.querySelector('input[placeholder="Name"]');
    const phoneEl    = bkForm.querySelector('input[type="tel"]');
    const branchEl   = bkForm.querySelector('select');
    const dateEl     = bkForm.querySelector('input[type="date"]');

    return {
      ref,
      source:    'homepage-popup',
      fullName:  nameEl   ? nameEl.value   : '',
      email:     '',   // popup doesn't have email field
      phone:     phoneEl  ? phoneEl.value  : '',
      age:       '',
      branch:    branchEl ? branchEl.value : '',
      date:      dateEl   ? dateEl.value   : '',
      timeSlot:  '',
      service:   '',
      insurance: '',
      emi:       false,
      whatsapp:  false,
      notes:     '',
    };
  }

  /* ──────────────────────────────────────────────
     POPUP FORM SUBMIT → Google Sheets
  ────────────────────────────────────────────── */
  if (bkForm && bkSuccess) {
    bkForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = bkForm.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      const data = collectPopupData();

      try {
        await fetch(APPS_SCRIPT_URL, {
          method:  'POST',
          mode:    'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body:    JSON.stringify(data),
        });
      } catch (err) {
        console.warn('Popup form Sheets error (non-critical):', err);
      }

      // Show success state
      bkForm.classList.add('is-hidden');
      bkSuccess.classList.add('is-shown');

      // Auto-close after 3.5 seconds
      setTimeout(closePopup, 3500);

      // Reset after close animation
      setTimeout(function () {
        bkForm.classList.remove('is-hidden');
        bkSuccess.classList.remove('is-shown');
        bkForm.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Request'; }
      }, 4200);
    });
  }

  /* ──────────────────────────────────────────────
     5. CLINIC LOCATOR TAB SWITCHING
  ────────────────────────────────────────────── */
  const clinicItems = document.querySelectorAll('.clinic-item');
  clinicItems.forEach(function (item) {
    item.addEventListener('click', function () {
      clinicItems.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
    });
  });

  const locatorTabs = document.querySelectorAll('.locator-tab');
  locatorTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      locatorTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  });

  /* ──────────────────────────────────────────────
     6. STATS COUNTER ANIMATION
  ────────────────────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num');

  function animateCounter(el) {
    const target        = el.getAttribute('data-target');
    const suffix        = el.getAttribute('data-suffix') || '';
    const numericTarget = parseFloat(target);
    const duration      = 1800;
    const startTime     = performance.now();

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * numericTarget;

      el.textContent = (numericTarget % 1 === 0)
        ? Math.floor(current) + suffix
        : current.toFixed(1) + suffix;

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }

    requestAnimationFrame(step);
  }

  if (statNums.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { statsObserver.observe(el); });
  }

  /* ──────────────────────────────────────────────
     7. SMOOTH SCROLL
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ──────────────────────────────────────────────
     8. LOCATOR SEARCH (client-side filter)
  ────────────────────────────────────────────── */
  const locatorInput = document.querySelector('.locator-input');
  if (locatorInput && clinicItems.length > 0) {
    locatorInput.addEventListener('input', function () {
      const query = locatorInput.value.toLowerCase().trim();
      clinicItems.forEach(function (item) {
        const name = item.querySelector('.clinic-item-name');
        const addr = item.querySelector('.clinic-item-addr');
        const text = ((name ? name.textContent : '') + ' ' + (addr ? addr.textContent : '')).toLowerCase();
        item.style.display = (!query || text.includes(query)) ? '' : 'none';
      });
    });
  }

});