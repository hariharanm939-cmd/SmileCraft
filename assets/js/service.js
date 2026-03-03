/* ============================================================
   SMILE CRAFT DENTAL — services.js
   Pure Vanilla JavaScript | Services Page
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────
     1. STICKY HEADER SHADOW
  ────────────────────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     2. MOBILE MENU TOGGLE
  ────────────────────────────────────────────── */
  const menuBtn  = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      const icon = menuBtn.querySelector('.material-icons');
      if (icon) icon.textContent = isOpen ? 'close' : 'menu';
    });
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        const icon = menuBtn.querySelector('.material-icons');
        if (icon) icon.textContent = 'menu';
      });
    });
  }

  /* ──────────────────────────────────────────────
     3. SCROLL REVEAL
  ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }
  /* ──────────────────────────────────────────────
   BEFORE & AFTER DRAG SLIDER
────────────────────────────────────────────── */
(function () {
  function initSlider(slider) {
    var beforeDiv = slider.querySelector('.ba-before');
    var beforeImg = slider.querySelector('.ba-before img');
    var handle    = slider.querySelector('.ba-handle');
    var active    = false;

    function syncWidths() {
      var w = slider.getBoundingClientRect().width;
      if (!w) return;
      // Tell the image to always be the full slider width
      beforeImg.style.width = w + 'px';
      // Start at 50%
      var half = w * 0.5;
      beforeDiv.style.width = half + 'px';
      handle.style.left     = half + 'px';
      handle.style.transform = 'translateX(-50%)';
    }

    function update(clientX) {
      var rect = slider.getBoundingClientRect();
      var px   = clientX - rect.left;
      px = Math.min(Math.max(px, 4), rect.width - 4);

      beforeDiv.style.width  = px + 'px';
      beforeImg.style.width  = rect.width + 'px'; // always full width
      handle.style.left      = px + 'px';
      handle.style.transform = 'translateX(-50%)';
    }

    // Init on load + resize
    if (document.readyState === 'complete') {
      syncWidths();
    } else {
      window.addEventListener('load', syncWidths);
    }
    window.addEventListener('resize', syncWidths);

    // Mouse events
    slider.addEventListener('mousedown', function (e) {
      active = true;
      update(e.clientX);
      e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
      if (active) update(e.clientX);
    });
    document.addEventListener('mouseup', function () {
      active = false;
    });

    // Touch events
    slider.addEventListener('touchstart', function (e) {
      active = true;
      update(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('touchmove', function (e) {
      if (active) {
        update(e.touches[0].clientX);
        e.preventDefault();
      }
    }, { passive: false });

    slider.addEventListener('touchend', function () {
      active = false;
    });
  }

  // Init all sliders
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    initSlider(slider);
  });
})();
  /* ──────────────────────────────────────────────
     4. FAQ ACCORDION
  ────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (i) {
        i.classList.remove('open');
        const b = i.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ──────────────────────────────────────────────
     5. NEWSLETTER FORM
  ────────────────────────────────────────────── */
  const nlForm = document.getElementById('nlForm');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input  = nlForm.querySelector('.nl-input');
      const button = nlForm.querySelector('.nl-btn');
      if (!input || !button) return;

      button.textContent = 'Subscribed! ✓';
      button.style.background = 'var(--mint-dark)';
      button.disabled = true;
      input.value = '';

      setTimeout(function () {
        button.textContent = 'Subscribe';
        button.style.background = '';
        button.disabled = false;
      }, 4000);
    });
  }

  /* ──────────────────────────────────────────────
     6. SMOOTH SCROLL for anchor links
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────────────
     7. SERVICE CARD HOVER — subtle tilt effect
  ────────────────────────────────────────────── */
  document.querySelectorAll('.svc-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX  = +(y * 6).toFixed(2);
      const tiltY  = -(x * 6).toFixed(2);
      card.style.transform = 'translateY(-8px) perspective(600px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ──────────────────────────────────────────────
     8. PRICING CARD HIGHLIGHT ON HOVER
  ────────────────────────────────────────────── */
  document.querySelectorAll('.pricing-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      document.querySelectorAll('.pricing-card').forEach(function (c) {
        if (c !== card && !c.classList.contains('pricing-card--featured')) {
          c.style.opacity = '0.7';
        }
      });
    });
    card.addEventListener('mouseleave', function () {
      document.querySelectorAll('.pricing-card').forEach(function (c) {
        c.style.opacity = '';
      });
    });
  });

  /* ──────────────────────────────────────────────
     9. ACTIVE NAV LINK on scroll (highlight section)
  ────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(function (s) { sectionObs.observe(s); });
  }

});