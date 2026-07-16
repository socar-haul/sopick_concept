/* =========================================================================
   SOPICK Foundation — Interactions
   의존성 없음. DOMContentLoaded에서 자동 초기화. tokens/components.css와 함께 사용.
   ========================================================================= */
(function () {
  'use strict';
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- SegmentedControl ----------
     구조: .sf-seg > .sf-seg__ind + button[aria-selected]
     data-onchange 없이도 pill 이동 + aria-selected 토글. */
  function positionSeg(seg) {
    var ind = $('.sf-seg__ind', seg);
    var active = $('button[aria-selected="true"]', seg);
    if (!ind) return;
    if (!active || !active.offsetWidth) { ind.style.width = '0px'; return; }
    var sr = seg.getBoundingClientRect(), ar = active.getBoundingClientRect();
    var cs = getComputedStyle(seg);
    var bl = parseFloat(cs.borderLeftWidth) || 0, bt = parseFloat(cs.borderTopWidth) || 0;
    ind.style.width = ar.width + 'px';
    ind.style.height = ar.height + 'px';
    ind.style.transform = 'translate(' + (ar.left - sr.left - bl) + 'px,' + (ar.top - sr.top - bt) + 'px)';
  }
  function initSeg(seg) {
    if (!$('.sf-seg__ind', seg)) {
      var ind = document.createElement('span');
      ind.className = 'sf-seg__ind'; ind.setAttribute('aria-hidden', 'true');
      seg.insertBefore(ind, seg.firstChild);
    }
    $$('button', seg).forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        $$('button', seg).forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
        btn.setAttribute('aria-selected', 'true');
        positionSeg(seg);
        seg.dispatchEvent(new CustomEvent('sf:change', { detail: { index: i, value: btn.dataset.value } }));
      });
    });
    positionSeg(seg);
  }

  /* ---------- Tabs (언더라인) ---------- */
  function initTabs(tabs) {
    $$('button', tabs).forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        $$('button', tabs).forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
        btn.setAttribute('aria-selected', 'true');
        tabs.dispatchEvent(new CustomEvent('sf:change', { detail: { index: i, value: btn.dataset.value } }));
      });
    });
  }

  /* ---------- Chip (토글) ---------- */
  function initChip(chip) {
    chip.addEventListener('click', function () {
      var pressed = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', String(!pressed));
    });
  }

  /* ---------- Modal / BottomSheet ----------
     열기: [data-sf-open="modalId"] , 닫기: [data-sf-close] 또는 dim 클릭 */
  function openModal(id) { var m = document.getElementById(id); if (m) { m.classList.add('is-open'); document.body.style.overflow = 'hidden'; } }
  function closeModal(m) { m.classList.remove('is-open'); document.body.style.overflow = ''; }
  function initModals() {
    $$('[data-sf-open]').forEach(function (t) {
      t.addEventListener('click', function () { openModal(t.getAttribute('data-sf-open')); });
    });
    $$('.sf-modal, .sf-alert').forEach(function (m) {
      m.addEventListener('click', function (e) {
        if (e.target.classList.contains('sf-modal__dim') || e.target.classList.contains('sf-alert__dim') || e.target.hasAttribute('data-sf-close')) {
          closeModal(m);
        }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { $$('.sf-modal.is-open, .sf-alert.is-open').forEach(closeModal); }
    });
  }

  /* ---------- Input (clear 버튼 + has-value) ---------- */
  function initField(box) {
    var input = $('input', box);
    if (!input) return;
    var clear = $('.sf-field__clear', box);
    function sync() { box.classList.toggle('has-value', !!input.value); }
    input.addEventListener('input', sync);
    if (clear) clear.addEventListener('click', function () { input.value = ''; sync(); input.focus(); });
    sync();
  }

  /* ---------- Snackbar (프로그램 호출) ---------- */
  var snackTimer;
  window.sfSnackbar = function (message, opts) {
    opts = opts || {};
    var el = $('#sfSnackbar');
    if (!el) {
      el = document.createElement('div'); el.id = 'sfSnackbar'; el.className = 'sf-snackbar';
      el.innerHTML = '<span class="sf-snackbar__text"></span>';
      document.body.appendChild(el);
    }
    $('.sf-snackbar__text', el).textContent = message;
    el.classList.add('is-open');
    clearTimeout(snackTimer);
    snackTimer = setTimeout(function () { el.classList.remove('is-open'); }, opts.duration || 3000);
  };

  /* ---------- 공개 API ---------- */
  window.sfModal = { open: openModal, close: function (id) { var m = document.getElementById(id); if (m) closeModal(m); } };

  /* ---------- 자동 초기화 ---------- */
  function init() {
    $$('.sf-seg').forEach(initSeg);
    $$('.sf-tabs').forEach(initTabs);
    $$('.sf-chip').forEach(initChip);
    $$('.sf-field__box').forEach(initField);
    initModals();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { $$('.sf-seg').forEach(positionSeg); }, 80); });
  window.addEventListener('load', function () { $$('.sf-seg').forEach(positionSeg); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { $$('.sf-seg').forEach(positionSeg); });
})();
