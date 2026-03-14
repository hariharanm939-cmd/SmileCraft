/* ============================================================
   SMILE CRAFT DENTAL — index.js  (v6 — Updated)
   ============================================================ */

'use strict';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycgnGu6yry59NWWGaSKcOKpnilW6VcFO2OVWYIaFQIV8zR6o1Mzeab6L-viV0thVMp/exec';

document.addEventListener('DOMContentLoaded', function () {

  /* ══════════════════════════════════════════════════════
     1. DOCTOR INTRO SLIDESHOW — continuous loop
  ══════════════════════════════════════════════════════ */
  (function initIntroSlideshow() {
    const DURATION = 6500;
    const TOTAL    = 2;

    const docData = [
      { name: 'Dr. Rishikumar A',    role: 'Orthodontist · Both Branches',   yrs: '11+' },
      { name: 'Dr. Rupha Lakshmi U', role: 'Dental Surgeon · Both Branches', yrs: '11+' }
    ];

    let current = 0;
    let startTs  = null;
    let rafId    = null;
    let paused   = false;

    function switchDoc(idx) {
      current = ((idx % TOTAL) + TOTAL) % TOTAL;

      for (let i = 0; i < TOTAL; i++) {
        const p = document.getElementById('sc-portrait-' + i);
        if (p) {
          p.classList.toggle('active', i === current);
          p.setAttribute('aria-hidden', String(i !== current));
        }
        const b = document.getElementById('sc-bio-' + i);
        if (b) b.classList.toggle('active', i === current);
      }

      document.querySelectorAll('.sc-doc-tab').forEach((tab, k) => {
        tab.classList.toggle('active', k === current);
        tab.setAttribute('aria-selected', String(k === current));
      });

      document.querySelectorAll('.sc-prog-bar').forEach((bar, k) => {
        bar.classList.toggle('active', k === current);
        const fill = document.getElementById('sc-fill-' + k);
        if (fill) fill.style.width = (k < current ? '100%' : '0%');
      });

      const d = docData[current];
      const nameEl = document.getElementById('sc-card-name');
      const roleEl = document.getElementById('sc-card-role');
      const yrsEl  = document.getElementById('sc-card-yrs');
      if (nameEl) nameEl.textContent = d.name;
      if (roleEl) roleEl.textContent = d.role;
      if (yrsEl)  yrsEl.textContent  = d.yrs;
    }

    function startTick() {
      cancelAnimationFrame(rafId);
      startTs = null;

      function tick(ts) {
        if (!startTs) startTs = ts;
        const elapsed = ts - startTs;
        const pct     = Math.min((elapsed / DURATION) * 100, 100);

        const fill = document.getElementById('sc-fill-' + current);
        if (fill) fill.style.width = pct + '%';

        if (elapsed >= DURATION) {
          switchDoc(current + 1);
          if (!paused) startTick();
          return;
        }
        rafId = requestAnimationFrame(tick);
      }

      rafId = requestAnimationFrame(tick);
    }

    const panel = document.getElementById('sc-portrait-panel');
    if (panel) {
      panel.addEventListener('mouseenter', () => { paused = true; cancelAnimationFrame(rafId); });
      panel.addEventListener('mouseleave', () => { paused = false; startTick(); });
      panel.addEventListener('click', () => { switchDoc(current + 1); startTick(); });
    }

    window.scSwitchDoc = function (idx) { switchDoc(idx); startTick(); };
    startTick();
  })();

  /* ══════════════════════════════════════════════════════
     2. STICKY HEADER SHADOW
  ══════════════════════════════════════════════════════ */
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     3. DESKTOP NAV DROPDOWN
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('is-active');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.is-active').forEach(d => {
      d.classList.remove('is-active');
      const t = d.querySelector('.nav-dropdown-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });

  /* ══════════════════════════════════════════════════════
     4. SCROLL REVEAL
  ══════════════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -72px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ══════════════════════════════════════════════════════
     5. BOOKING POPUP
     - Opens automatically after 3 seconds (once per session)
     - Navbar "Book an Appointment" button links directly to book.html
     - All other "Book" links on the page open the popup
  ══════════════════════════════════════════════════════ */
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

  // Auto-show after 3 seconds — every page load (no session guard)
  if (popup) {
    setTimeout(openPopup, 3000);
  }

  if (bkClose) bkClose.addEventListener('click', closePopup);
  if (popup) {
    popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });

  // Intercept book.html links to open popup — EXCEPT the navbar header CTA
  // and the mobile nav CTA (those navigate directly to book.html)
  if (document.body.dataset.page === 'home') {
    document.querySelectorAll('a[href="book.html"]').forEach(link => {
      // Skip the header nav CTA and mobile nav CTA — let them navigate normally
      if (link.id === 'headerBookBtn' || link.classList.contains('pmn-cta')) return;
      link.addEventListener('click', e => {
        e.preventDefault();
        openPopup();
      });
    });
  }

  /* ── Branch card visual selector ── */
  window.bkSelectBranch = function (value, el) {
    document.querySelectorAll('.bk-branch-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    const inp = document.getElementById('bkPopupBranch');
    if (inp) inp.value = value;
  };

  document.querySelectorAll('.bk-branch-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

  /* ── Date field min = today ── */
  const dateEl = document.getElementById('bkPopupDate');
  if (dateEl) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateEl.min  = `${yyyy}-${mm}-${dd}`;
  }

  /* ── Collect and submit form ── */
  function collectPopupData() {
    const ref      = 'SC-' + Math.floor(100000 + Math.random() * 900000);
    const nameEl   = document.getElementById('bkPopupName');
    const phoneEl  = document.getElementById('bkPopupPhone');
    const branchEl = document.getElementById('bkPopupBranch');
    const dateEl2  = document.getElementById('bkPopupDate');
    return {
      ref,
      source:   'homepage-popup',
      fullName: nameEl   ? nameEl.value.trim()  : '',
      email:    '',
      phone:    phoneEl  ? phoneEl.value.trim() : '',
      age:      '',
      branch:   branchEl ? branchEl.value        : '',
      date:     dateEl2  ? dateEl2.value         : '',
      timeSlot: '', service: '', insurance: '',
      emi: false, whatsapp: false, notes: '',
    };
  }

  if (bkForm && bkSuccess) {
    bkForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = document.getElementById('bkSubmitBtn');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      try {
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(collectPopupData()),
        });
      } catch (err) {
        console.warn('Popup form Sheets error (non-critical):', err);
      }

      bkForm.classList.add('is-hidden');
      bkSuccess.classList.add('is-shown');
      setTimeout(closePopup, 3500);

      setTimeout(() => {
        bkForm.classList.remove('is-hidden');
        bkSuccess.classList.remove('is-shown');
        bkForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="material-icons" style="font-size:1rem!important">check_circle</span> Confirm Appointment';
        }
        document.querySelectorAll('.bk-branch-card').forEach(c => c.classList.remove('selected'));
        const bi = document.getElementById('bkPopupBranch');
        if (bi) bi.value = '';
      }, 4200);
    });
  }

  /* ══════════════════════════════════════════════════════
     6. MAP — tap to activate iframe on touch
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('.branch-card-map').forEach(wrap => {
    wrap.addEventListener('click', () => wrap.classList.add('is-active'));
  });

  /* ══════════════════════════════════════════════════════
     7. STATS COUNTER ANIMATION
  ══════════════════════════════════════════════════════ */
  const statNums = document.querySelectorAll('.stat-num');

  function animateCounter(el) {
    const target        = el.getAttribute('data-target');
    const suffix        = el.getAttribute('data-suffix') || '';
    const numericTarget = parseFloat(target);
    const duration      = 1800;
    const startTime     = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const val      = eased * numericTarget;
      el.textContent = (numericTarget % 1 === 0)
        ? Math.floor(val) + suffix
        : val.toFixed(1) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }

    requestAnimationFrame(step);
  }

  if (statNums.length > 0 && 'IntersectionObserver' in window) {
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounter(entry.target); statsObs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statsObs.observe(el));
  }

  /* ══════════════════════════════════════════════════════
     8. SMOOTH SCROLL
  ══════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ══════════════════════════════════════════════════════
     9. CLINIC LOCATOR (if present)
  ══════════════════════════════════════════════════════ */
  const clinicItems = document.querySelectorAll('.clinic-item');
  clinicItems.forEach(item => {
    item.addEventListener('click', () => {
      clinicItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  document.querySelectorAll('.locator-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.locator-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  const locatorInput = document.querySelector('.locator-input');
  if (locatorInput && clinicItems.length > 0) {
    locatorInput.addEventListener('input', () => {
      const query = locatorInput.value.toLowerCase().trim();
      clinicItems.forEach(item => {
        const name = item.querySelector('.clinic-item-name');
        const addr = item.querySelector('.clinic-item-addr');
        const text = ((name ? name.textContent : '') + ' ' + (addr ? addr.textContent : '')).toLowerCase();
        item.style.display = (!query || text.includes(query)) ? '' : 'none';
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     10. SWIPER — testimonials
  ══════════════════════════════════════════════════════ */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.js-testmonials-slider', {
      grabCursor: true,
      loop: true,
      spaceBetween: 30,
      pagination: { el: '.js-testmonials-pagination', clickable: true },
      breakpoints: { 767: { slidesPerView: 3 } }
    });
  }

}); // end DOMContentLoaded