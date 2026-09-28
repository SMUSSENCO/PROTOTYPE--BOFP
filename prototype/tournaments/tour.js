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
  let hintTapped = false;

  const STEPS = [
    { el: () => [q('#catalogBtn')], wait: () => q('#drawer').classList.contains('show'),
      text: 'Начнём с хедера. Нажмите на кнопку «Все турниры» в левом углу.' },
    { el: () => [q('#drawer')], pad: 0,
      text: 'Здесь открывается глобальная ветка турниров: поиск любого турнира занимает 3 клика. Долгое нажатие на турнир добавит его в избранное — он появится вверху списка.' },
    { el: () => [q('#drawer .dr-rank'), q('#drawer [data-close]')], wait: () => !q('#drawer').classList.contains('show'),
      text: 'Здесь также находятся рейтинги футбола и тенниса (пока это заглушки). Закройте экран, чтобы продолжить.' },
    { el: () => [q('#dates')], pad: 0, before: () => centerDay(true),
      text: 'Календарь: можно переключиться на любой день. Сверху — число матчей, требующих прогноз, снизу — наличие аукционов.' },
    { el: () => [card('ucl')], before: () => { close('ucl'); into(card('ucl')); }, after: () => open('ucl'),
      text: 'Экран турниров построен по принципу статистических проектов со вшитой игровой механикой. На карточке — общее число матчей турнира на сегодня, число матчей в лайве и кнопка, чтобы сразу сделать прогноз. Нажмите на логотип, чтобы перейти в турнир, или разверните карточку и изучите матчи.' },
    { el: () => [q('.t[data-id="ucl"] .sw-row')], before: () => into(q('.t[data-id="ucl"] .sw-row')),
      text: 'Свитч переключает результаты реальных матчей на результаты игроков проекта.' },
    { el: () => [q('.t[data-id="ucl"] .tl')], after: () => close('ucl'),
      text: 'На таймлайне наглядно отображена стадия турнира.' },
    { el: () => [q('.t[data-id="ucl"] .t-head')], before: () => into(card('ucl')),
      text: 'Избранное: долгое нажатие на карточку добавляет турнир в избранное. Он переносится в отдельный блок «Избранные», который всегда стоит сверху, когда в турнире есть матчи. Повторное долгое нажатие убирает турнир из избранного.' },
    { el: () => [q('[data-fold="real"]'), q('[data-fold="series"]')], before: () => into(q('[data-fold="real"]'), 'start'),
      text: 'Все турниры проекта собраны в одном блоке. Блок горит жёлтым, так как требует действий в одном из турниров. Жёлтый цвет — единственный маркер, требующий предпринять действие.' },
    { el: () => [card('g5')], before: () => { close('g5'); into(card('g5')); }, wait: () => card('g5') && card('g5').classList.contains('open'),
      text: 'Опустимся к BIG 5. Разверните турнир.' },
    { el: () => [q('.t[data-id="g5"] .tl')],
      before: () => { state.stage.g5 = BIG5_STAGES.length - 1; rerenderCard('g5'); setTimeout(() => into(q('.t[data-id="g5"] .tl')), 60); },
      text: 'На таймлайне также отмечены аукционы, проходящие в турнирах.' },
    { el: () => [q('.t[data-id="g5"] .seg'), ...qa('.t[data-id="g5"] .lg-h')], before: () => { qa('.t[data-id="g5"] .lg.open .lg-h').forEach(h => h.click()); setTimeout(() => into(q('.t[data-id="g5"] .seg'), 'center'), 80); },
      after: () => { delete state.stage.g5; close('g5'); },
      text: 'Ваш турнир и конференция всегда выделены, а каждую лигу можно развернуть.' },
    { el: () => [q('#hintDn .key')], skip: () => !q('#hintDn').classList.contains('show'),
      before: () => { hintTapped = false; scrollTop(); setTimeout(updateHint, 500); }, wait: () => hintTapped, delay: 900,
      text: 'Эта кнопка переводит к турнирам, требующим действия, которые находятся ниже видимой части экрана. Нажмите на неё.' },
    { el: () => { const h = q('[data-fold="night"]'); return h ? [h, h.nextElementSibling] : []; }, skip: () => !q('[data-fold="night"]'),
      before: () => into(q('[data-fold="night"]'), 'start'),
      text: 'Фиксация составов в фан-клубах происходит за сутки, а ещё бывают турниры с матчами ночью. Поэтому создан специальный раздел, чтобы ничего не пропустить.' },
    { el: () => [q('#tabbar')],
      text: 'Вход в профиль перенесён в верхнюю часть экрана, поэтому здесь размещён переход в портфель акций.' },
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
      else go(i + 1);
    });
    // only the spotlighted controls stay tappable
    document.addEventListener('click', guard, true);
    q('#hintDn').addEventListener('click', () => { hintTapped = true; });
  }
  function guard(e) {
    if (i < 0 || !e.isTrusted || e.target.closest('.tour-tip')) return;
    const s = STEPS[i];
    if (s.wait && holes.some(r => e.clientX >= r.x && e.clientX <= r.x + r.w && e.clientY >= r.y && e.clientY <= r.y + r.h)) return;
    e.preventDefault(); e.stopPropagation();
  }

  function go(n) {
    const prev = STEPS[i];
    if (prev && prev.after) prev.after();
    i = n;
    while (i < STEPS.length && STEPS[i].skip && STEPS[i].skip()) i++;
    if (i >= STEPS.length) return finish();
    const s = STEPS[i];
    s._done = false;
    if (s.before) s.before();
    const last = i === STEPS.length - 1;
    root.querySelector('.tour-n').textContent = `Обучение · ${i + 1} из ${STEPS.length}`;
    root.querySelector('.tour-tx').textContent = s.text;
    root.querySelector('.tour-dots').innerHTML = STEPS.map((_, k) => `<i class="${k === i ? 'on' : k < i ? 'was' : ''}"></i>`).join('');
    root.querySelector('.tour-do').innerHTML = s.wait ? '<span class="tour-wait">Нажмите на выделенное</span>' : `<button class="tour-next" data-tour="next">${last ? 'Готово' : 'Далее'}</button>`;
    root.classList.toggle('waiting', !!s.wait);
    tip.classList.remove('in'); void tip.offsetWidth; tip.classList.add('in');
    if (!s.wait) setTimeout(() => { const b = root.querySelector('.tour-next'); if (b) b.focus({ preventScroll: true }); }, 50);
  }
  function finish() {
    const s = STEPS[i];
    if (s && s.after) s.after();
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
    if (!holes.length) y = (vh - th) / 2;
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
