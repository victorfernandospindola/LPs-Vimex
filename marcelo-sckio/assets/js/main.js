/* =========================================================
   Marcelo Sckio — interações do site
   Vanilla JS, sem dependências.
   ========================================================= */
(function () {
  'use strict';

  var WHATSAPP = '5519988364023';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ano no rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Header sticky ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    };
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) closeNav();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Fallback de imagens externas ---------- */
  document.querySelectorAll('img[src^="https://"]').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('is-broken');
      if (img.parentElement) img.parentElement.classList.add('is-broken');
    });
  });

  /* ---------- Calculadora ---------- */
  var brl = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0
  });
  var num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

  var onlyDigits = function (value) { return (value || '').replace(/\D/g, ''); };
  var toNumber = function (input) { return parseInt(onlyDigits(input.value), 10) || 0; };

  var calc = document.getElementById('calc');
  if (calc) {
    var faturamento = document.getElementById('faturamento');
    var custo = document.getElementById('custo');
    var perda = document.getElementById('perda');
    var reducao = document.getElementById('reducao');
    var perdaOut = document.getElementById('perdaOut');
    var reducaoOut = document.getElementById('reducaoOut');
    var elValor = document.getElementById('calcValor');
    var elTexto = document.getElementById('calcTexto');
    var elPerdas = document.getElementById('calcPerdas');
    var elMes = document.getElementById('calcMes');
    var elMargem = document.getElementById('calcMargem');

    var maskMoney = function (input) {
      var digits = onlyDigits(input.value).slice(0, 12);
      input.value = digits ? num.format(parseInt(digits, 10)) : '';
    };

    var update = function () {
      var fat = toNumber(faturamento);
      var cus = toNumber(custo);
      var pPerda = parseInt(perda.value, 10) || 0;
      var pRed = parseInt(reducao.value, 10) || 0;

      perdaOut.textContent = pPerda + '%';
      reducaoOut.textContent = pRed + '%';

      var perdasAno = cus * (pPerda / 100) * 12;
      var ganhoAno = perdasAno * (pRed / 100);
      var ganhoMes = ganhoAno / 12;
      var fatAno = fat * 12;
      var margem = fatAno > 0 ? (ganhoAno / fatAno) * 100 : 0;

      elValor.textContent = brl.format(Math.round(ganhoAno));
      elTexto.textContent = 'Uma redução de ' + pRed + '% nessas perdas poderia representar aproximadamente ' +
        brl.format(Math.round(ganhoAno)) + ' por ano.';
      elPerdas.textContent = brl.format(Math.round(perdasAno));
      elMes.textContent = brl.format(Math.round(ganhoMes));
      elMargem.textContent = (margem > 0 ? '+' : '') +
        margem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' p.p.';
    };

    [faturamento, custo].forEach(function (input) {
      input.addEventListener('input', function () { maskMoney(input); update(); });
      input.addEventListener('blur', function () { maskMoney(input); update(); });
    });
    [perda, reducao].forEach(function (input) {
      input.addEventListener('input', update);
    });
    calc.addEventListener('submit', function (e) { e.preventDefault(); });
    update();
  }

  /* ---------- Formulário -> WhatsApp ---------- */
  var form = document.getElementById('leadForm');
  if (form) {
    var status = document.getElementById('formStatus');
    var required = ['nome', 'empresa', 'whatsapp'];

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalid = null;

      required.forEach(function (name) {
        var field = form.elements[name];
        var wrapper = field.closest('.field');
        var ok = field.value.trim().length > 1;
        if (wrapper) wrapper.classList.toggle('is-invalid', !ok);
        if (!ok && !invalid) invalid = field;
      });

      if (invalid) {
        status.textContent = 'Preencha nome, empresa e WhatsApp para continuar.';
        invalid.focus();
        return;
      }

      var get = function (name) {
        var el = form.elements[name];
        return el && el.value.trim() ? el.value.trim() : '—';
      };

      var linhas = [
        'Vim pelo site e gostaria de conversar sobre a minha operação.',
        '',
        'Nome: ' + get('nome'),
        'Empresa: ' + get('empresa'),
        'Cargo: ' + get('cargo'),
        'Segmento: ' + get('segmento'),
        'Cidade: ' + get('cidade'),
        'Colaboradores: ' + get('colaboradores'),
        'WhatsApp: ' + get('whatsapp'),
        'E-mail: ' + get('email'),
        '',
        'Principal desafio da operação:',
        get('desafio')
      ];

      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(linhas.join('\n'));
      status.textContent = 'Tudo certo. Abrindo o WhatsApp de Marcelo...';

      var win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url;
    });

    form.addEventListener('input', function (e) {
      var wrapper = e.target.closest('.field');
      if (wrapper) wrapper.classList.remove('is-invalid');
    });
  }

  /* ---------- WhatsApp flutuante: não cobre CTAs finais ---------- */
  var wa = document.getElementById('whatsappFloat');
  var zonas = ['#contato', '#visita'].map(function (sel) { return document.querySelector(sel); })
    .filter(Boolean);

  if (wa && zonas.length && 'IntersectionObserver' in window) {
    var visiveis = new Set();
    var zoneObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visiveis.add(entry.target);
        else visiveis.delete(entry.target);
      });
      wa.classList.toggle('is-hidden', visiveis.size > 0);
    }, { rootMargin: '-45% 0px -10% 0px' });
    zonas.forEach(function (zona) { zoneObserver.observe(zona); });
  }
})();
