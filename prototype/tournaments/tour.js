/* Guided tour of the tournaments screen: spotlight + tip, some steps wait for the user's tap.
   Starts on every open; add ?notour to the URL to skip it. */
(() => {
  if (/[?&]notour\b/.test(location.search)) return;

  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];
  const card = id => q(`.t[data-id="${id}"]`);
  const open = id => { const c = card(id); if (c && !c.classList.contains('open')) c.querySelector('[data-rail]').click(); };
  const close = id => { const c = card(id); if (c && c.classList.contains('open')) c.querySelector('[data-rail]').click(); };
  const into = (el, block = 'center') => el && el.scrollIntoView({ block, behavior: 'smooth' });
  const scrollTop = () => { const sc = q('#scroll'); sc.scrollTo({ top: 0, behavior: 'smooth' }); };
  let hintTapped = false, favAt = 0;
  const drawer = on => { if (q('#drawer').classList.contains('show') !== on) setDrawer(on); };
  const mode = (id, on) => { if (on) state.mode[id] = true; else delete state.mode[id]; rerenderCard(id); };

  // short, business-style copy in white; `act` (yellow) is what the visitor is asked to do.
  // every step has «Далее»; `wait` moves on by itself, `free` lets the visitor explore until `wait` holds,
  // `play` keeps the spotlight tappable without waiting
  const STEPS = [
    { el: () => [q('#catalogBtn')], before: () => drawer(false), wait: () => q('#drawer').classList.contains('show'),
      text: 'Каталог всех турниров.', act: 'Нажмите на кнопку.' },
    { el: () => [q('#drawer')], pad: 0, before: () => drawer(true),
      text: 'Любой турнир — за 3 клика.' },
    { el: () => [q('#drawer .dr-rank')], free: true, before: () => drawer(true), wait: () => !q('#drawer').classList.contains('show'),
      text: 'Рейтинги футбола и тенниса (заглушка). Долгое нажатие — турнир в избранное.', act: 'Изучите каталог и закройте его.' },
    { el: () => [q('#dates')], pad: 0, before: () => { drawer(false); centerDay(true); },
      text: 'Календарь. Сверху — матчи, ждущие прогноза. Снизу — аукционы.' },
    { el: () => [card('ucl')], before: () => { drawer(false); close('ucl'); into(card('ucl')); }, wait: () => card('ucl') && card('ucl').classList.contains('open'),
      text: 'Число матчей в турнире, матчи в лайве и кнопка прогноза — прямо на карточке. Клик на логотип — переход на экран турнира (заглушка).', act: 'Разверните турнир.' },
    { el: () => [q('.t[data-id="ucl"] .sw')], pad: 8,
      before: () => { open('ucl'); mode('ucl', false); setTimeout(() => into(q('.t[data-id="ucl"] .sw-row')), 60); },
      wait: () => !!state.mode.ucl, delay: 500,
      text: 'Реальные результаты или результаты игроков проекта.', act: 'Нажмите на свитч.' },
    { el: () => [q('.t[data-id="ucl"] .sw-row'), q('.t[data-id="ucl"] .matches')], play: true,
      before: () => { open('ucl'); if (!state.mode.ucl) mode('ucl', true); document.documentElement.classList.add('tour-score'); setTimeout(() => into(q('.t[data-id="ucl"] .matches')), 60); },
      text: 'Счёт меняется вместе со свитчем: реальные матчи или результаты игроков проекта.', act: 'Переключайте свитч.' },
    { el: () => [q('.t[data-id="ucl"] .tl')], before: () => { open('ucl'); setTimeout(() => into(q('.t[data-id="ucl"] .tl')), 60); },
      text: 'Таймлайн — текущая стадия турнира.' },
    { el: () => [q('.t[data-id="ucl"] .t-head')], before: () => { close('ucl'); favAt = FAV.cards.size; into(card('ucl')); },
      wait: () => FAV.cards.size !== favAt, delay: 700,
      text: 'Избранные турниры всегда сверху. Чтобы добавить турнир в избранное,', act: 'зажмите карточку турнира.' },
    { el: () => [card('g5')], before: () => { close('g5'); into(card('g5')); }, wait: () => card('g5') && card('g5').classList.contains('open'),
      text: 'BIG 5 — лиги игроков проекта.', act: 'Разверните турнир.' },
    { el: () => [q('.t[data-id="g5"] .tl')],
      before: () => { open('g5'); state.stage.g5 = BIG5_STAGES.length - 1; rerenderCard('g5'); setTimeout(() => into(q('.t[data-id="g5"] .tl')), 60); },
      text: 'Аукционы также отмечены на таймлайне.' },
    { el: () => [q('.t[data-id="g5"] .seg'), ...qa('.t[data-id="g5"] .lg-h')], free: true,
      before: () => { open('g5'); delete state.stage.g5; rerenderCard('g5'); qa('.t[data-id="g5"] .lg.open .lg-h').forEach(h => h.click()); setTimeout(() => into(q('.t[data-id="g5"] .seg'), 'center'), 80); },
      wait: () => !card('g5') || !card('g5').classList.contains('open'),
      text: 'Ваша лига и конференция выделены.', act: 'Разверните лиги, изучите и сверните турнир.' },
    { el: () => [q('#hintDn .key')], skip: () => !q('#hintDn').classList.contains('show'),
      before: () => { close('g5'); hintTapped = false; scrollTop(); setTimeout(updateHint, 500); }, wait: () => hintTapped, delay: 900,
      text: 'Переход к турнирам ниже экрана, где нужно действие.', act: 'Нажмите на кнопку.' },
    { el: () => { const h = q('[data-fold="night"]'); return h ? [h, h.nextElementSibling] : []; }, skip: () => !q('[data-fold="night"]'),
      before: () => into(q('[data-fold="night"]'), 'start'),
      text: 'Составы фиксируются за сутки, часть матчей — ночью. Отдельный блок, чтобы ничего не пропустить.' },
    { el: () => [q('[data-tab="wallet"]')], pad: 4,
      text: 'Здесь теперь — портфель акций.' },
  ];

  let i = -1, raf = 0, holes = [], root, tip;

  function build() {
    root = document.createElement('div');
    root.className = 'tour';
    root.innerHTML = `<svg class="tour-veil" aria-hidden="true"><defs><mask id="tourMask"><rect width="100%" height="100%" fill="#fff"/><g class="tour-cut"></g></mask></defs>
      <rect width="100%" height="100%" mask="url(#tourMask)"/><g class="tour-rings"></g></svg>
      <div class="tour-tip glass" role="dialog" aria-live="polite"><div class="tour-top"><span class="tour-n num"></span><button class="tour-skip" data-tour="skip">Пропустить</button></div>
      <p class="tour-tx"></p><div class="tour-ft"><span class="tour-dots"></span><span class="tour-do"></span></div></div>`;
    document.body.appendChild(root);
    tip = root.querySelector('.tour-tip');
    tip.addEventListener('click', e => {
      const b = e.target.closest('[data-tour]');
      if (!b) return;
      if (b.dataset.tour === 'skip') finish();
      else if (b.dataset.tour === 'back') go(i - 1, -1);
      else if (STEPS[i].free) root.classList.add('tipoff');
      else go(i + 1);
    });
    // only the spotlighted controls stay tappable
    document.addEventListener('click', guard, true);
    q('#hintDn').addEventListener('click', () => { hintTapped = true; });
  }
  function guard(e) {
    if (i < 0 || !e.isTrusted || e.target.closest('.tour-tip')) return;
    const s = STEPS[i];
    if (s.free) return;
    if ((s.wait || s.play) && holes.some(r => e.clientX >= r.x && e.clientX <= r.x + r.w && e.clientY >= r.y && e.clientY <= r.y + r.h)) return;
    e.preventDefault(); e.stopPropagation();
  }

  function go(n, dir = 1) {
    document.documentElement.classList.remove('tour-score');
    i = Math.max(0, n);
    while (i > 0 && i < STEPS.length && STEPS[i].skip && STEPS[i].skip()) i += dir;
    if (i >= STEPS.length) return finish();
    const s = STEPS[i];
    s._done = false;
    if (s.before) s.before();
    const last = i === STEPS.length - 1;
    root.querySelector('.tour-n').textContent = `Обучение · ${i + 1} из ${STEPS.length}`;
    const tx = root.querySelector('.tour-tx');
    tx.textContent = s.text;
    if (s.act) { const a = document.createElement('span'); a.className = 'tour-act'; a.textContent = ' ' + s.act; tx.appendChild(a); }
    root.querySelector('.tour-dots').innerHTML = STEPS.map((_, k) => `<i class="${k === i ? 'on' : k < i ? 'was' : ''}"></i>`).join('');
    root.querySelector('.tour-do').innerHTML = (i ? '<button class="tour-back" data-tour="back">Назад</button>' : '')
      + `<button class="tour-next" data-tour="next">${last ? 'Готово' : 'Далее'}</button>`;
    root.classList.toggle('waiting', !!s.wait);
    root.classList.toggle('free', !!s.free);
    root.classList.remove('tipoff');
    tip.classList.remove('in'); void tip.offsetWidth; tip.classList.add('in');
    setTimeout(() => { const b = root.querySelector('.tour-next'); if (b) b.focus({ preventScroll: true }); }, 50);
  }
  function finish() {
    document.documentElement.classList.remove('tour-score');
    i = -1;
    cancelAnimationFrame(raf);
    document.removeEventListener('click', guard, true);
    root.remove();
  }

  // follows the targets every frame: they move with scrolling, expanding and re-rendering
  function frame() {
    raf = requestAnimationFrame(frame);
    if (i < 0) return;
    const s = STEPS[i];
    if (s.wait && !s._done && s.wait()) { s._done = true; setTimeout(() => i >= 0 && STEPS[i] === s && go(i + 1), s.delay || 350); }
    const pad = s.pad ?? 6, vw = innerWidth, vh = innerHeight;
    holes = (s.el() || []).filter(Boolean).map(el => el.getBoundingClientRect()).filter(r => r.width && r.height)
      .map(r => ({ x: Math.max(0, r.left - pad), y: r.top - pad, w: Math.min(vw, r.right + pad) - Math.max(0, r.left - pad), h: r.height + pad * 2 }));
    const svgRect = h => `<rect x="${h.x}" y="${h.y}" width="${h.w}" height="${h.h}" rx="14"/>`;
    const key = holes.map(h => [h.x, h.y, h.w, h.h].map(Math.round).join()).join('|');
    if (key !== frame.key) {
      frame.key = key;
      root.querySelector('.tour-cut').innerHTML = holes.map(svgRect).join('');
      root.querySelector('.tour-rings').innerHTML = holes.map(svgRect).join('');
    }
    // tip goes below the spotlight when it fits, else above, else over the list
    const top = Math.min(...holes.map(h => h.y), vh), bottom = Math.max(...holes.map(h => h.y + h.h), 0);
    const th = tip.offsetHeight, gap = 14, bar = 96;
    let y;
    if (s.free) y = vh - th - 12;
    else if (!holes.length) y = (vh - th) / 2;
    else if (bottom + gap + th <= vh - bar) y = bottom + gap;
    else if (top - gap - th >= 8) y = top - gap - th;
    else y = Math.max(8, vh - bar - th - 8);
    tip.style.transform = `translate(-50%, ${Math.round(y)}px)`;
  }

  function start() {
    build();
    go(0);
    frame();
  }
  // wait until app.js has drawn the list
  const ready = setInterval(() => {
    if (typeof state === 'undefined' || !q('#list .t')) return;
    clearInterval(ready);
    setTimeout(start, 400);
  }, 100);
})();
