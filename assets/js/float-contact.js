/**
 * float-contact.js
 * Global floating Call + Message widget logic.
 * Handles open/close of branch-selection popups for both buttons.
 *
 * Numbers:
 *   Porur      : +91 88257 45091  (tel:+918825745091)
 *   Kolapakkam : +91 63824 73705  (tel:+916382473705)
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    var callBtn    = document.getElementById('fcCallBtn');
    var callPopup  = document.getElementById('fcCallPopup');
    var msgBtn     = document.getElementById('fcMsgBtn');
    var msgPopup   = document.getElementById('fcMsgPopup');
    var backdrop   = document.getElementById('fcBackdrop');

    if (!callBtn || !callPopup || !msgBtn || !msgPopup) return;

    /* ── helpers ── */
    function openPopup(popup, btn) {
      popup.classList.add('is-open');
      btn.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-active');
    }

    function closeAll() {
      callPopup.classList.remove('is-open');
      msgPopup.classList.remove('is-open');
      callBtn.classList.remove('is-open');
      msgBtn.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-active');
    }

    /* ── Call button toggle ── */
    callBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = callPopup.classList.contains('is-open');
      closeAll();
      if (!isOpen) openPopup(callPopup, callBtn);
    });

    /* ── Message button toggle ── */
    msgBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = msgPopup.classList.contains('is-open');
      closeAll();
      if (!isOpen) openPopup(msgPopup, msgBtn);
    });

    /* ── Backdrop click closes everything ── */
    if (backdrop) {
      backdrop.addEventListener('click', closeAll);
    }

    /* ── Escape key closes everything ── */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });

    /* ── Prevent popup clicks from bubbling to document ── */
    callPopup.addEventListener('click', function (e) { e.stopPropagation(); });
    msgPopup.addEventListener('click',  function (e) { e.stopPropagation(); });

    /* ── Document click closes everything (fallback) ── */
    document.addEventListener('click', closeAll);

  });
})();
