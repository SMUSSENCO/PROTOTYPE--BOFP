/* Stocks market (footer tab «Портфель»): Summary / Market / Portfolio, a club's stock card,
   the buy/sell sheet, the shareholders leaderboard and another player's trading profile.
   Uses globals from app.js: I, FLAGS, A, esc, hash, rng, toast, crest, TEAM_IMG, BOFP_TEAMS, TODAY. */
(() => {
  const q = s => document.querySelector(s);
  const fmt = (n, d = 0) => Number(n).toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (v, d = 1) => `${v > 0 ? '+' : ''}${fmt(v, d)}%`;
  const tone = v => v > 0 ? 'up' : v < 0 ? 'dn' : '';
  const TOKEN_RATE = 32000; // 1 activity token = 32 000 coins
  const FEE = 0.005;

  /* ---------- icons ---------- */
  const ICO = {
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4 16 6-6 4 4 6-7M15 7h5v5"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4 8 6 6 4-4 6 7M15 17h5v-5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9z"/></svg>',
    starOn: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9z"/></svg>',
    buy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/></svg>',
    sell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 12h12"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 6v12M6 12h12"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6"/><circle cx="17" cy="9" r="2.4"/><path d="M15.6 14.6c2.3.1 4 1.5 4.6 4"/></svg>',
    cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v3M8 20h8M9.5 17h5"/></svg>',
  };
  // placeholder until the real art arrives: activity token
  const ACT = '<svg class="tkn" viewBox="0 0 24 24" aria-label="жетон активности"><path d="M12 2.5 20.2 7v10L12 21.5 3.8 17V7z" fill="#1FB5A8" stroke="#A8F0E8" stroke-width="1.2"/><path d="M13.2 6 8.5 13h3.2l-1 5 4.8-7.2h-3.3z" fill="#fff"/></svg>';
  const COIN = () => `<img class="cn" src="${A}buffs/coin.webp" alt="">`;

  /* ---------- data ---------- */
  const LEAGUES = [['all', 'Все', null], ['epl', 'АПЛ', 'gb-eng'], ['seriea', 'Серия А', 'it'], ['laliga', 'Ла Лига', 'es'], ['ligue1', 'Лига 1', 'fr'],
    ['bundesliga', 'Бундеслига', 'de'], ['por', 'Португалия', 'pt'], ['ned', 'Нидерланды', 'nl'], ['tur', 'Турция', 'tr']];
  // name, league, UEFA club ranking, price, 24h %, spread %, trades 24h, trades change %
  const RAW = [
    ['Реал Мадрид', 'laliga', 1, 14820, 0.4, 0.09, 312, 12.4], ['Арсенал', 'epl', 2, 12124, -0.2, 0.12, 205, -8.1], ['Бавария', 'bundesliga', 3, 13460, 0.8, 0.10, 288, 21.0],
    ['Ливерпуль', 'epl', 4, 11993, 1.1, 0.31, 274, 5.6], ['Интер', 'seriea', 5, 10870, -0.6, 0.44, 198, -12.3], ['Манчестер Сити', 'epl', 6, 7829, 45.0, 42.89, 380, 317.6],
    ['Барселона', 'laliga', 7, 12149, -0.1, 0.14, 244, 3.2], ['ПСЖ', 'ligue1', 8, 11320, 0.3, 0.52, 231, 9.9], ['Байер Леверкузен', 'bundesliga', 9, 9420, 1.6, 0.85, 176, 14.2],
    ['Боруссия Дортмунд', 'bundesliga', 10, 8710, -0.9, 0.73, 163, -5.5], ['Атлетико Мадрид', 'laliga', 11, 10505, 2.9, 2.23, 189, 33.0], ['Астон Вилла', 'epl', 12, 8449, 1.9, 1.92, 361, 447.0],
    ['Рома', 'seriea', 13, 6120, -1.2, 1.15, 97, -22.4], ['Тоттенхэм', 'epl', 14, 3168, 0.9, 2.49, 688, -74.4], ['Бенфика', 'por', 15, 6840, 0.5, 1.37, 121, 6.1],
    ['Порту', 'por', 16, 6215, -0.4, 1.62, 88, -14.0], ['Манчестер Юнайтед', 'epl', 17, 5605, 2.4, 1.05, 342, 51.7], ['Милан', 'seriea', 18, 8210, 0.2, 0.66, 154, 2.3],
    ['Челси', 'epl', 19, 5196, -1.9, 2.62, 488, -26.7], ['Наполи', 'seriea', 20, 7340, 1.3, 0.94, 132, 18.5], ['Ювентус', 'seriea', 21, 8030, -0.3, 0.58, 177, -3.9],
    ['Лацио', 'seriea', 22, 5476, 3.4, 1.88, 116, 64.2], ['Аталанта', 'seriea', 23, 5355, -1.4, 3.44, 616, 8.7], ['Спортинг', 'por', 24, 5992, 0.7, 1.21, 74, -9.8],
    ['Фейеноорд', 'ned', 25, 4410, -0.8, 2.05, 61, -31.2], ['ПСВ', 'ned', 26, 4675, 1.0, 1.74, 69, 11.4], ['Галатасарай', 'tur', 27, 4120, 2.2, 2.31, 145, 40.3],
    ['Фенербахче', 'tur', 28, 3890, -2.6, 2.77, 101, -17.6], ['Марсель', 'ligue1', 29, 5020, 0.1, 1.49, 58, -40.0], ['Лион', 'ligue1', 30, 4380, -0.5, 1.96, 33, -55.1],
    ['РБ Лейпциг', 'bundesliga', 33, 7120, 0.6, 0.97, 84, 4.4], ['Ньюкасл Юнайтед', 'epl', 34, 6640, 1.4, 1.33, 143, 27.9],
  ];
  const CLUBS = RAW.map(([n, lg, r, p, d, sp, tr, tc]) => ({ n, lg, r, p, d, sp, tr, tc }));
  const CLUB = Object.fromEntries(CLUBS.map(c => [c.n, c]));
  // the player's holdings: quantity and change against the average buy price
  const MINE = { 'Барселона': { q: 388, ch: 9.7 }, 'Челси': { q: 201, ch: 16.0 }, 'Астон Вилла': { q: 156, ch: 24.2 }, 'Ливерпуль': { q: 104, ch: 11.2 },
    'Лацио': { q: 20, ch: 291.2 }, 'Спортинг': { q: 19, ch: 3.4 }, 'Манчестер Юнайтед': { q: 4, ch: 35.4 } };
  let BALANCE = 10474725;
  const d0 = TODAY;
  const day = n => { const d = new Date(d0 + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const ORDERS = [
    { id: 75, side: 'sell', club: 'Барселона', price: 12400, done: 0, qty: 12, st: 'active', date: day(0) },
    { id: 74, side: 'buy', club: 'Спортинг', price: 5800, done: 19, qty: 80, st: 'active', date: day(-1) },
    { id: 71, side: 'sell', club: 'Манчестер Сити', price: 12090, done: 92, qty: 92, st: 'done', date: day(-1) },
    { id: 73, side: 'buy', club: 'Лацио', price: 4770, done: 0, qty: 100, st: 'active', date: day(-3) },
    { id: 72, side: 'buy', club: 'Лацио', price: 4770, done: 0, qty: 200, st: 'cancelled', date: day(-3) },
    { id: 70, side: 'buy', club: 'Челси', price: 5100, done: 201, qty: 201, st: 'done', date: day(-5) },
    { id: 69, side: 'sell', club: 'Арсенал', price: 12600, done: 0, qty: 30, st: 'cancelled', date: day(-6) },
    { id: 68, side: 'buy', club: 'Барселона', price: 11800, done: 120, qty: 120, st: 'done', date: day(-9) },
  ];
  // executed parts of an order: deterministic fills within the limit price
  const fills = o => {
    if (!o.done) return [];
    const r = rng('fill' + o.id), out = [];
    let left = o.done, t = Date.parse(`${o.date}T09:40:00+03:00`);
    while (left > 0) {
      const n = Math.min(left, 1 + Math.floor(r() * Math.max(1, o.done / 2)));
      left -= n; t += (15 + Math.floor(r() * 120)) * 60000;
      out.push({ t, n, p: Math.round(o.price * (o.side === 'buy' ? 1 - r() * 0.006 : 1 + r() * 0.006)) });
    }
    return out;
  };
  const plural = (n, one, few, many) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? one : m >= 2 && m <= 4 && (h < 12 || h > 14) ? few : many; };
  const reserved = club => ORDERS.filter(o => o.club === club && o.side === 'sell' && o.st === 'active').reduce((s, o) => s + o.qty - o.done, 0);
  const DIV = {
    month: { t: 'Месячные дивиденды', sub: '4 недели', rows: [['Барселона', 0, 12, 21340, 'Ла Лига, места 1–4', 5.5], ['Астон Вилла', 0, 5, 5772, 'АПЛ, места 5–8', 4.4], ['Спортинг', 0, 1, 475, 'Португалия, места 1–2', 4.2], ['Манчестер Юнайтед', 0, 1, 96, 'АПЛ, места 9–12', 3.9]] },
    quarter: { t: 'Квартальные дивиденды', sub: '13 недель', rows: [['Барселона', 3, 36, 64020, 'Ла Лига, места 1–4', 5.5], ['Ливерпуль', 2, 20, 31180, 'АПЛ, места 1–4', 6.0], ['Челси', 1, 15, 13510, 'АПЛ, места 5–8', 4.4]] },
    year: { t: 'Годовые дивиденды', sub: 'Сезон 2024/25', rows: [['Барселона', 5, 120, 236420, 'Чемпион Ла Лиги', 12.0], ['Ливерпуль', 4, 80, 112440, 'Чемпион АПЛ', 10.0], ['Лацио', 0, 30, 8760, 'Серия А, места 1–4', 6.5]] },
  };
  const watch = new Set(['Реал Мадрид', 'Бавария']);

  /* ---------- generated market details (deterministic per club) ---------- */
  const NICKS = ['Smussenko', 'GoldenBoot', 'KaspianWolf', 'Tengri', 'Nomad_77', 'AltaiBear', 'Aruzhan', 'BigAsh', 'Dimash_K', 'Zhenis', 'Saryarka', 'IrtyshFox',
    'Kokshe', 'PamirHawk', 'Bayterek', 'SteppeKing', 'AlmatyRider', 'Turan', 'Khan_Tengri', 'Oxus', 'Burabay', 'EmbaStar', 'Silk_Road', 'Balkhash', 'Ishim',
    'Tobol', 'Zhetysu', 'Aral', 'Medeu', 'Shymbulak', 'Kazygurt', 'Akmola', 'Atyrau', 'Taraz', 'Orda', 'Kulager', 'Baiga', 'Tulpar', 'Sunkar', 'Berkut'];
  const holders = club => {
    const c = CLUB[club], r = rng('holders' + club), total = Math.round(8000 + r() * 30000);
    const teams = (typeof BOFP_TEAMS !== 'undefined' && BOFP_TEAMS.length ? BOFP_TEAMS : [{ name: 'Томск' }]).map(t => t.name);
    let share = 6 + r() * 2;
    const list = Array.from({ length: 100 }, (_, i) => {
      const p = i === 0 ? share : (share = Math.max(0.04, share * (i < 3 ? 0.82 : 0.93 + r() * 0.04)));
      const nick = `${NICKS[(i * 7 + hash(club)) % NICKS.length]}${i > NICKS.length - 1 ? i : ''}`;
      return { nick, team: teams[(hash(club) + i * 5) % teams.length], pct: p, qty: Math.round(total * p / 100), ch: Math.round((r() * 60 - 18) * 10) / 10 };
    });
    list.sort((a, b) => b.pct - a.pct).forEach((h, i) => { h.pos = i + 1; h.val = h.qty * c.p; });
    return { total, list };
  };
  const playerBook = nick => {
    const r = rng('book' + nick), pool = [...CLUBS], out = {};
    const n = 4 + Math.floor(r() * 5);
    for (let i = 0; i < n; i++) { const c = pool.splice(Math.floor(r() * pool.length), 1)[0]; out[c.n] = { q: 5 + Math.floor(r() * 600), ch: Math.round((r() * 70 - 20) * 10) / 10 }; }
    return out;
  };
  const quotes = c => { const step = Math.max(1, Math.round(c.p * c.sp / 100 / 2)); return { bid: c.p - step, ask: c.p + step, high: Math.round(c.p * (1 + Math.abs(c.d) / 200 + 0.002)), low: Math.round(c.p * (1 - Math.abs(c.d) / 200 - 0.002)), vol: 20 + hash(c.n) % 160 }; };

  /* ---------- state ---------- */
  const S = { tab: 'portfolio', sum: 'most', sv: 'vol', sper: '24h', sdir: 'up', lg: 'all', mkt: 'stocks', side: 'all', st: 'all', pf: 'stocks', div: 'all',
    sort: { pf: { k: 'val', d: -1 }, mkt: { k: 'r', d: 1 }, lb: { k: 'pct', d: -1 }, other: { k: 'val', d: -1 } },
    open: new Set(), club: null, dTab: 'chart', period: '3m', dside: 'all', dst: 'all', trade: null, player: null, order: null, sel: null, selCtx: '', menu: null };

  /* ---------- small builders ---------- */
  const crestBox = c => `<span class="sx-crest">${crest(c.n)}<b class="num">${c.r}</b></span>`;
  const chips = (key, items, cur, cls = '') => `<div class="sx-chips ${cls}" role="tablist">${items.map(([k, l, extra]) => `<button class="sx-chip" data-${key}="${k}" aria-selected="${k === cur}">${l}${extra || ''}</button>`).join('')}</div>`;
  const leagueBar = () => `<div class="sx-lgs" role="tablist" aria-label="Лига">${LEAGUES.map(([k, l, f]) => `<button class="sx-lg" data-lg="${k}" aria-selected="${k === S.lg}"><span class="fl">${f ? FLAGS[f] : ICO.globe}</span>${l}</button>`).join('')}</div>`;
  const inLg = c => S.lg === 'all' || c.lg === S.lg;
  const sortHead = (key, cols) => `<div class="sx-th sx-${key}">${cols.map(([k, l, cls]) => k ? `<button class="${cls || ''} ${S.sort[key].k === k ? 'on' : ''}" data-sort="${key}:${k}">${l}<i>${S.sort[key].k === k ? (S.sort[key].d > 0 ? '↑' : '↓') : ''}</i></button>` : `<span class="${cls || ''}"></span>`).join('')}</div>`;
  const by = (key, get) => (a, b) => { const { k, d } = S.sort[key], x = get(a, k), y = get(b, k); return (typeof x === 'string' ? x.localeCompare(y, 'ru') : x - y) * d; };

  function clubRow(c, sub, attr = '', ch = c.d) {
    return `<button class="sx-row glass" data-club="${esc(c.n)}" ${attr}>${crestBox(c)}<span class="sx-nm"><b>${esc(c.n)}</b><small>${sub}</small></span>
      <span class="sx-sp num">${fmt(c.sp, 2)}%</span><span class="sx-pr num"><b>${fmt(c.p)}${COIN()}</b><small class="${tone(ch)}">${pct(ch)}</small></span></button>`;
  }
  // summary periods: shares in turnover and price change over the period (deterministic per club)
  const SPER = [['24h', '24 ч', 1, 'За 24 часа'], ['1w', 'Неделя', 7, 'За неделю'], ['1m', 'Месяц', 30, 'За месяц'], ['3m', '3 месяца', 90, 'За 3 месяца'], ['1y', 'Год', 365, 'За год']];
  const perOf = () => SPER.find(x => x[0] === S.sper);
  const volOf = (c, p) => { const days = SPER.find(x => x[0] === p)[2]; return Math.round(c.tr * 3 * (p === '24h' ? 1 : days * (0.55 + rng('v' + c.n + p)() * 0.9))); };
  const volChg = (c, p) => p === '24h' ? c.tc : Math.round((rng('vc' + c.n + p)() - 0.45) * 120 * 10) / 10;
  const chgOf = (c, p) => p === '24h' ? c.d : Math.round((rng('c' + c.n + p)() - 0.42) * Math.sqrt(SPER.find(x => x[0] === p)[2]) * 7 * 10) / 10;

  /* ---------- tabs ---------- */
  function summary() {
    const p = S.sper, vol = S.sv === 'vol';
    const head = `<div class="seg sx-sub" role="tablist">${[['vol', 'Объём торгов'], ['chg', 'Динамика цены']].map(([k, l]) => `<button role="tab" data-sv="${k}" aria-selected="${S.sv === k}">${l}</button>`).join('')}</div>`
      + `<div class="sx-chips2">${vol ? chips('sum', [['most', 'Больше всего'], ['least', 'Меньше всего']], S.sum, 'mini') : chips('sdir', [['up', `${ICO.up}Рост`], ['down', `${ICO.down}Падение`]], S.sdir, 'mini')}<span class="sep"></span>${chips('sper', SPER.map(([k, l]) => [k, l]), p, 'mini')}</div>`;
    const list = CLUBS.filter(inLg).sort((a, b) => vol ? (volOf(b, p) - volOf(a, p)) * (S.sum === 'most' ? 1 : -1) : (chgOf(b, p) - chgOf(a, p)) * (S.sdir === 'up' ? 1 : -1)).slice(0, 12);
    const rows = list.map(c => vol ? clubRow(c, `${fmt(volOf(c, p))} акций в обороте <span class="${tone(volChg(c, p))}">${pct(volChg(c, p))}</span>`, '', chgOf(c, p))
      : clubRow(c, `было ${fmt(Math.round(c.p / (1 + chgOf(c, p) / 100)))} → стало ${fmt(c.p)}`, '', chgOf(c, p)));
    return head + leagueBar() + `<h3 class="sx-h">${perOf()[3]}</h3><div class="sx-list">${rows.join('')}</div>`;
  }
  function market() {
    const activeN = ORDERS.filter(o => o.st === 'active').length;
    let body = '';
    if (S.mkt === 'stocks') {
      const list = CLUBS.filter(inLg).sort(by('mkt', (c, k) => c[k]));
      body = leagueBar() + sortHead('mkt', [['r', 'Рейтинг УЕФА', 'l'], ['sp', 'Спред'], ['p', 'Цена']])
        + `<div class="sx-list">${list.map(c => clubRow(c, MINE[c.n] ? `${fmt(MINE[c.n].q)} акций в портфеле` : '—')).join('')}</div>`;
    } else if (S.mkt === 'watch') {
      const list = CLUBS.filter(c => watch.has(c.n));
      body = list.length ? `<div class="sx-list">${list.map(c => clubRow(c, MINE[c.n] ? `${fmt(MINE[c.n].q)} акций в портфеле` : '—')).join('')}</div>`
        : '<p class="sx-empty">Добавьте акции звёздочкой в карточке клуба — они появятся здесь.</p>';
    } else body = ordersHTML(ORDERS);
    return chips('mkt', [['stocks', 'Акции'], ['watch', 'Избранное'], ['orders', 'Заявки', activeN ? `<i class="badge num">${activeN}</i>` : '']], S.mkt) + body;
  }
  function ordersHTML(list, pre = '') {
    const activeN = list.filter(o => o.st === 'active').length;
    const f = list.filter(o => (S[pre + 'side'] === 'all' || o.side === S[pre + 'side']) && (S[pre + 'st'] === 'all' || o.st === S[pre + 'st']));
    const groups = {};
    for (const o of f) (groups[o.date] ||= []).push(o);
    const rows = Object.keys(groups).sort().reverse().map(d => `<h3 class="sx-h">${new Date(d + 'T12:00:00Z').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</h3>`
      + groups[d].map(o => {
        const c = CLUB[o.club], prog = Math.round(o.done / o.qty * 100);
        const pick = S.sel && S.selCtx === pre, can = o.st === 'active', on = pick && S.sel.has(o.id);
        const card = `<div class="sx-ord glass ${o.side} ${o.st}" data-ord="${o.id}" role="button" tabindex="0"><div class="o1"><span class="oi">${o.side === 'buy' ? ICO.buy : ICO.sell}</span><span>Лимитная заявка <em class="num">#${o.id}</em></span><span class="od">${o.st === 'cancelled' ? 'Отменена' : o.st === 'done' ? 'Исполнена' : 'Активна'}</span></div>
          <div class="o2"><span class="oclub" data-oclub="${esc(c.n)}" role="link">${crest(c.n)}<b>${esc(c.n)}</b></span><span class="num">${o.side === 'buy' ? 'до' : 'от'} ${fmt(o.price)}${COIN()}</span><span class="oq num"><b>${o.done}</b> / ${o.qty}</span></div>
          <div class="ob"><i style="width:${prog}%"></i>${o.st === 'done' ? `<span class="ok">${ICO.check}</span>` : ''}</div></div>`;
        return pick ? `<div class="sx-pick${on ? ' on' : ''}${can ? '' : ' dis'}" data-ord="${o.id}"><span class="ck${can ? '' : ' dis'}">${on ? ICO.check : ''}</span>${card}</div>` : card;
      }).join('')).join('');
    return `<div class="sx-chips2">${chips(pre + 'side', [['all', 'Все'], ['buy', 'Покупка'], ['sell', 'Продажа']], S[pre + 'side'], 'mini')}<span class="sep"></span>
      ${chips(pre + 'st', [['all', 'Все'], ['active', 'Активные', activeN ? `<i class="badge num">${activeN}</i>` : ''], ['done', 'Исполненные'], ['cancelled', 'Отменённые']], S[pre + 'st'], 'mini')}</div>`
      + (rows || '<p class="sx-empty">Заявок нет</p>');
  }
  function bookTable(book, key) {
    const items = Object.entries(book).map(([n, h]) => ({ c: CLUB[n], q: h.q, ch: h.ch, val: h.q * CLUB[n].p, n }));
    items.sort(by(key, (x, k) => k === 'n' ? x.n : k === 'p' ? x.c.p : x[k]));
    const tq = items.reduce((s, x) => s + x.q, 0), tv = items.reduce((s, x) => s + x.val, 0);
    const tch = items.reduce((s, x) => s + x.ch * x.val, 0) / Math.max(1, tv);
    return sortHead(key, [['n', 'Клуб', 'l'], ['q', 'Кол.'], ['p', 'Цена'], ['val', 'Стоим.'], ['ch', 'Изм.']])
      + `<div class="sx-tbl">${items.map(x => `<button class="sx-tr" data-club="${esc(x.n)}"><span class="l">${crest(x.n)}<b>${esc(x.n)}</b></span><span class="num">${fmt(x.q)}</span><span class="num">${fmt(x.c.p)}</span><span class="num">${fmt(x.val)}</span><span class="num ${tone(x.ch)}">${pct(x.ch)}</span></button>`).join('')}
      <div class="sx-tr tot"><span class="l"><b>${items.length} клубов</b></span><span class="num">${fmt(tq)}</span><span></span><span class="num">${fmt(tv)}</span><span class="num ${tone(tch)}">${pct(tch)}</span></div></div>`;
  }
  function divBlock(key) {
    const d = DIV[key], total = d.rows.reduce((s, r) => s + r[3], 0);
    return `<section class="sx-div glass"><div class="dh"><div><b>${d.t}</b><small>${d.sub}</small></div><div class="dv"><b class="num">0${COIN()}</b><small>из ${fmt(total)} возможных</small></div></div>
      <div class="dth"><span>Клуб</span><span>Сделки</span><span>Кол-во</span><span>Дивиденды</span></div>
      ${d.rows.map(([n, done, need, sum, cond, rate]) => { const k = `${key}:${n}`, op = S.open.has(k); return `<button class="dtr" data-dopen="${esc(k)}" aria-expanded="${op}"><span class="l" data-club="${esc(n)}" role="link">${crest(n)}<b>${esc(n)}</b></span><span class="pill num"><i style="width:${Math.round(done / need * 100)}%"></i><em>${done}/${need}</em></span><span class="num">${fmt(MINE[n] ? MINE[n].q : 0)}</span><span class="num">${fmt(sum)}${ICO.chev}</span></button>
        ${op ? `<div class="dcond"><span>${esc(cond)}</span><span class="num">${fmt(rate, 1)}%</span><span class="num">${fmt(sum)}</span></div>` : ''}`; }).join('')}
      <div class="dtot"><span>${d.rows.length} клуба</span><span class="num">${fmt(d.rows.reduce((s, r) => s + (MINE[r[0]] ? MINE[r[0]].q : 0), 0))}</span><span class="num">${fmt(total)}</span></div></section>`;
  }
  function portfolio(book = MINE, key = 'pf') {
    if (S.pf === 'stocks' || key === 'other') return (key === 'pf' ? chips('pf', [['stocks', 'Акции'], ['div', 'Дивиденды']], S.pf) : '') + bookTable(book, key);
    const blocks = { month: divBlock('month'), quarter: divBlock('quarter'), year: divBlock('year') };
    return chips('pf', [['stocks', 'Акции'], ['div', 'Дивиденды']], S.pf)
      + chips('div', [['all', 'Все'], ['month', 'Месяц'], ['quarter', 'Квартал'], ['year', 'Год']], S.div, 'mini')
      + (S.div === 'all' ? Object.values(blocks).join('') : blocks[S.div]);
  }

  /* ---------- shell ---------- */
  function render() {
    const el = q('#stocks');
    const body = S.tab === 'summary' ? summary() : S.tab === 'market' ? market() : portfolio();
    el.innerHTML = `<div class="sx-top"><div class="sx-hd"><h1>Биржа акций</h1><div class="grp"><div class="balance glass num"><span>${fmt(BALANCE)}</span>${COIN()}</div><button class="icon-btn avatar" data-profile aria-label="Профиль">${AVATAR}</button></div></div>
      <div class="seg sx-seg" role="tablist">${[['summary', 'Сводка'], ['market', 'Рынок'], ['portfolio', 'Портфель']].map(([k, l]) => `<button role="tab" data-tab2="${k}" aria-selected="${k === S.tab}">${l}</button>`).join('')}</div></div>
      <div class="sx-scroll" id="sxScroll">${body}</div>`;
  }
  // re-rendering must not jump: keep the vertical position and every horizontal filter strip where it was
  const STRIPS = '.sx-chips,.sx-lgs,.sx-chips2';
  const keepScroll = (fn, root = '#stocks', sc = '#sxScroll') => {
    const box = q(sc), top = box ? box.scrollTop : 0, xs = [...document.querySelectorAll(`${root} :is(${STRIPS})`)].map(e => e.scrollLeft);
    fn();
    const n = q(sc); if (n) n.scrollTop = top;
    document.querySelectorAll(`${root} :is(${STRIPS})`).forEach((e, i) => { if (xs[i] != null) e.scrollLeft = xs[i]; });
  };

  /* ---------- stock card ---------- */
  /* full chart: price grid on the right, dates below, tap or drag to read any point */
  const PERIODS = { live: [40, 3 * 60e3], '1d': [48, 30 * 60e3], '1w': [56, 3 * 3600e3], '1m': [30, 864e5], '3m': [60, 1.5 * 864e5], '6m': [60, 3 * 864e5], '1y': [52, 7 * 864e5] };
  let SERIES = null;
  function series(c) {
    const [n, step] = PERIODS[S.period], r = rng(c.n + S.period), end = Date.parse(`${TODAY}T21:10:00+03:00`);
    const vol = { live: 0.002, '1d': 0.004, '1w': 0.009, '1m': 0.018, '3m': 0.03, '6m': 0.04, '1y': 0.05 }[S.period];
    const v = [c.p];
    for (let i = 1; i < n; i++) v.unshift(v[0] * (1 + (r() - 0.5) * vol * 2));
    // each point is one interval: open = first trade, close (the line) = last trade, high / low, volume
    return v.map((p, i) => {
      const c = Math.round(p), o = Math.round(i ? v[i - 1] : p * (1 + (r() - 0.5) * vol));
      return { t: end - (n - 1 - i) * step, p: c, o, h: Math.round(Math.max(o, c) * (1 + r() * vol * 0.5)), l: Math.round(Math.min(o, c) * (1 - r() * vol * 0.5)), vol: 1 + Math.floor(r() * 40) };
    });
  }
  const tLabel = (t, long) => new Date(t).toLocaleString('ru-RU', S.period === 'live' || S.period === '1d'
    ? { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow', ...(long ? { day: 'numeric', month: 'short' } : {}) }
    : S.period === '1y' && !long ? { month: 'short', year: 'numeric', timeZone: 'Europe/Moscow' }
    : { day: 'numeric', month: 'short', timeZone: 'Europe/Moscow', ...(long ? { weekday: 'short', ...(S.period === '6m' || S.period === '1y' ? { year: 'numeric' } : {}) } : {}) }).replace(' г.', '');
  const fmtBig = v => v >= 1e6 ? `${fmt(v / 1e6, 1)} М` : v >= 1e3 ? `${fmt(v / 1e3, 0)} к` : fmt(v);
  function chartSVG(c) {
    const pts = SERIES = series(c), n = pts.length;
    const lo = Math.min(...pts.map(x => x.p)), hi = Math.max(...pts.map(x => x.p));
    // round grid steps: 4 price lines that wrap the range
    const raw = (hi - lo) / 3 || 1, mag = 10 ** Math.floor(Math.log10(raw)), stepP = [1, 2, 2.5, 5, 10].map(k => k * mag).find(k => k >= raw);
    const g0 = Math.floor(lo / stepP) * stepP, grid = [0, 1, 2, 3, 4].map(i => g0 + i * stepP).filter(v => v <= hi + stepP);
    const min = grid[0], max = grid[grid.length - 1], H = 100;
    const y = v => (1 - (v - min) / Math.max(1, max - min)) * H;
    const line = pts.map((x, i) => `${i ? 'L' : 'M'}${(i / (n - 1) * 100).toFixed(2)} ${y(x.p).toFixed(2)}`).join('');
    const up = pts[n - 1].p >= pts[0].p, vmax = Math.max(...pts.map(x => x.vol));
    const ticks = [0.12, 0.5, 0.88].map(f => Math.round(f * (n - 1)));
    return `<div class="sx-cw ${up ? 'up' : 'dn'}" data-chart>
        <div class="plot"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true">
          ${grid.map(v => `<line class="gl" x1="0" x2="100" y1="${y(v)}" y2="${y(v)}"/>`).join('')}
          <path class="ar" d="${line}L100 ${H}L0 ${H}Z"/><path class="ln" d="${line}"/></svg>
          ${grid.map(v => `<span class="gy num" style="top:${y(v)}%">${fmt(v)}</span>`).join('')}
          ${ticks.map(i => `<span class="gx" style="left:${i / (n - 1) * 100}%"></span>`).join('')}
          <span class="cx" hidden></span><span class="cd" hidden></span><span class="ct" hidden></span></div>
        <div class="vols"><span class="vl">Объём</span><span class="vy num">${fmt(vmax)}</span><span class="vy0 num">0</span>${pts.map((x, i) => `<i class="${i && x.p < pts[i - 1].p ? 'r' : 'g'}" style="height:${x.vol / vmax * 100}%"></i>`).join('')}</div>
        <div class="dates num">${ticks.map(i => `<span style="left:${i / (n - 1) * 100}%">${tLabel(pts[i].t)}</span>`).join('')}</div>
      </div><div class="sx-vsum num"><span>Объём за период <b>${fmt(pts.reduce((a, x) => a + x.vol, 0))} акц.</b></span><span>Оборот <b>${fmtBig(pts.reduce((a, x) => a + x.vol * x.p, 0))}</b>${COIN()}</span></div>
      <p class="sx-hintc">Линия — цена закрытия интервала (последняя сделка). Нажмите или проведите по графику: открытие, закрытие, максимум, минимум и объём</p>`;
  }
  function pointAt(wrap, clientX) {
    const plot = wrap.querySelector('.plot'), r = plot.getBoundingClientRect(), n = SERIES.length;
    const i = Math.max(0, Math.min(n - 1, Math.round((clientX - r.left) / r.width * (n - 1)))), x = SERIES[i];
    const ys = [...plot.querySelectorAll('.gy')].map(e => [+e.textContent.replace(/\s/g, ''), parseFloat(e.style.top)]);
    const [vTop, pTop] = ys[ys.length - 1], [vBot, pBot] = ys[0];
    const top = pBot + (x.p - vBot) / (vTop - vBot || 1) * (pTop - pBot), left = i / (n - 1) * 100;
    const [cx, cd, ct] = ['.cx', '.cd', '.ct'].map(s2 => plot.querySelector(s2));
    cx.hidden = cd.hidden = ct.hidden = false;
    cx.style.left = cd.style.left = `${left}%`; cd.style.top = `${top}%`;
    ct.innerHTML = `<div class="ctd">${tLabel(x.t, true)}</div><div class="ohlc num">${[['Откр.', fmt(x.o)], ['Закр.', fmt(x.p)], ['Макс.', fmt(x.h)], ['Мин.', fmt(x.l)], ['Объём', `${fmt(x.vol)} акц.`]].map(([l, v]) => `<span><small>${l}</small><b>${v}</b></span>`).join('')}</div><div class="v num">Оборот ${fmtBig(x.vol * x.p)}${COIN()}</div>`;
    ct.classList.toggle('low', top < 55);
    wrap.querySelectorAll('.vols i').forEach((b, k) => b.classList.toggle('on', k === i));
  }
  function bookHTML(c) {
    const qt = quotes(c), step = Math.max(1, Math.round(c.p * 0.0015)), r = rng('ob' + c.n);
    const asks = Array.from({ length: 7 }, (_, i) => ({ p: qt.ask + i * step, s: 1 + Math.floor(r() * 40) })).reverse();
    const bids = Array.from({ length: 7 }, (_, i) => ({ p: qt.bid - i * step, s: 1 + Math.floor(r() * 40) }));
    const mx = Math.max(...asks.map(x => x.s), ...bids.map(x => x.s));
    const row = (x, cls) => `<div class="obr ${cls}"><i style="width:${x.s / mx * 100}%"></i><span class="num">${fmt(x.p)}</span><span class="num">${x.s}</span></div>`;
    return `<div class="sx-ob"><div class="obh"><span>Цена</span><span>Объём</span></div>${asks.map(x => row(x, 'a')).join('')}<div class="obm num">Спред ${fmt(qt.ask - qt.bid)}${COIN()} · ${fmt(c.sp, 2)}%</div>${bids.map(x => row(x, 'b')).join('')}</div>`;
  }
  function tradesHTML(c) {
    const r = rng('tr' + c.n); let t = Date.parse(`${TODAY}T21:10:00+03:00`), prev = c.p;
    const rows = Array.from({ length: 40 }, () => { t -= (1 + Math.floor(r() * 12)) * 60000; const p = Math.round(prev * (1 + (r() - 0.5) * 0.004)); const up = p >= prev; prev = p; return { t, s: 1 + Math.floor(r() * 4), p, up }; });
    return `<div class="sx-trades"><div class="trh"><span>Время</span><span>Объём</span><span>Цена</span></div><div class="trl">${rows.map(x => `<div class="trr"><span class="num">${new Date(x.t).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' })}</span><span class="num">${x.s}</span><span class="num ${x.up ? 'up' : 'dn'}">${fmt(x.p)}</span></div>`).join('')}</div></div>`;
  }
  function detail() {
    const c = CLUB[S.club]; if (!c) return;
    const qt = quotes(c), h = holders(c.n), mine = MINE[c.n] ? MINE[c.n].q : 0, res = reserved(c.n);
    const tabs = [['chart', 'График'], ['book', 'Стакан'], ['trades', 'Сделки'], ['orders', 'Заявки']];
    const mineOrders = ORDERS.filter(o => o.club === c.n);
    let pane = '';
    if (S.dTab === 'chart') pane = `<div class="sx-per">${chips('period', [['live', 'Live'], ['1d', '1 день'], ['1w', 'Неделя'], ['1m', 'Месяц'], ['3m', '3 месяца'], ['6m', '6 месяцев'], ['1y', 'Год']], S.period, 'mini')}</div>${chartSVG(c)}`;
    else if (S.dTab === 'book') pane = bookHTML(c);
    else if (S.dTab === 'trades') pane = tradesHTML(c);
    else pane = ordersHTML(mineOrders, 'd');
    const top3 = h.list.slice(0, 3);
    q('#sxCard').innerHTML = `<div class="sx-ch"><button class="ib" data-cclose aria-label="Назад">${ICO.back}</button><span class="ttl">${crest(c.n)}${esc(c.n)}</span>
        <button class="ib star ${watch.has(c.n) ? 'on' : ''}" data-watch aria-label="${watch.has(c.n) ? 'Убрать из избранного' : 'В избранное'}">${watch.has(c.n) ? ICO.starOn : ICO.star}</button></div>
      ${tasksHTML(c)}
      <div class="sx-cb" id="sxCardBody">
        <div class="sx-price"><div class="big num">${fmt(c.p)}<small>,00</small>${COIN()}</div><div class="kv"><span>Объём</span><b class="num">${qt.vol}</b></div><div class="kv"><span>24 ч</span><b class="num ${tone(c.d)}">${pct(c.d, 2)}</b></div></div>
        <div class="sx-q4">${[['Макс.', qt.high], ['Мин.', qt.low], ['Покупка', qt.bid, 'up'], ['Продажа', qt.ask, 'dn']].map(([l, v, t]) => `<div><span>${l}</span><b class="num ${t || ''}">${fmt(v)}</b></div>`).join('')}</div>
        <div class="sx-own">
          <div class="col"><span class="lb">Ваши акции</span><b class="num">${fmt(mine)}</b><span class="lb">В резерве</span><b class="num sm">${fmt(res)}</b><small>в активных заявках на продажу</small></div>
          <div class="col"><span class="lb">У игроков</span><b class="num">${fmt(h.total)}</b><span class="lb">Топ-3 акционера</span>
            ${top3.map(x => `<div class="t3"><span>${esc(x.nick)}</span><span class="num">${fmt(x.pct, 1)}%</span></div>`).join('')}
            <button class="more" data-lb>Подробнее${ICO.chev}</button></div></div>
        <div class="seg sx-dt" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-dtab="${k}" aria-selected="${k === S.dTab}">${l}${k === 'orders' && mineOrders.some(o => o.st === 'active') ? `<i class="badge num">${mineOrders.filter(o => o.st === 'active').length}</i>` : ''}</button>`).join('')}</div>
        <div class="sx-pane">${pane}</div>
      </div>
      <div class="sx-cta"><button class="b buy" data-trade="buy">${ICO.buy}Купить</button><button class="b sell" data-trade="sell">${ICO.sell}Продать</button></div>`;
  }
  // unfinished dividend tasks for a stock in the portfolio: trades still to make per period
  const DIV_N = { month: 'Месяц', quarter: 'Квартал', year: 'Год' };
  function tasksHTML(c) {
    if (!MINE[c.n]) return '';
    const t = Object.entries(DIV).map(([k, d]) => { const r = d.rows.find(x => x[0] === c.n); return r && r[1] < r[2] ? { n: DIV_N[k], done: r[1], need: r[2] } : null; }).filter(Boolean);
    if (!t.length) return '';
    return `<div class="sx-tasks" aria-label="Невыполненные задания на дивиденды"><span class="lb">${ICO.cup}Задания</span>${t.map(x => `<span class="tk"><i style="--p:${Math.round(x.done / x.need * 100)}%"></i>${x.n}<b class="num">${x.done}/${x.need}</b></span>`).join('')}<small>сделок</small></div>`;
  }
  function openCard(name) { S.club = name; S.dTab = 'chart'; detail(); q('#sxCard').classList.add('show'); q('#sxCard').setAttribute('aria-hidden', 'false'); }
  function closeCard() { if (S.sel && S.selCtx === 'd') { S.sel = null; selUI(); } q('#sxCard').classList.remove('show'); q('#sxCard').setAttribute('aria-hidden', 'true'); S.club = null; }

  /* ---------- shareholders leaderboard + player profile ---------- */
  function leaderboard() {
    const c = CLUB[S.club], h = holders(c.n);
    const list = [...h.list].sort(by('lb', (x, k) => x[k]));
    q('#sxModal').innerHTML = `<div class="sx-mh"><span class="ttl">${crest(c.n)}Акционеры · ${esc(c.n)}</span><button class="ib" data-mclose aria-label="Закрыть">${ICO.close}</button></div>
      <p class="sx-msub">Топ-100 игроков · всего у игроков ${fmt(h.total)} акций</p>
      ${sortHead('lb', [['pos', '#', 'c'], ['nick', 'Игрок', 'l'], ['pct', '%'], ['qty', 'Акц.'], ['val', 'Сумма'], ['ch', 'Изм.']])}
      <div class="sx-lbl">${list.map(x => `<button class="lbr" data-player="${esc(x.nick)}" data-team="${esc(x.team)}"><span class="num pos">${x.pos}</span><span class="l"><span class="av" style="--h:${hash(x.nick) % 360}">${esc(x.nick.slice(0, 2).toUpperCase())}</span><span class="who"><b>${esc(x.nick)}</b><small>${TEAM_IMG[x.team] ? `<img src="${A}teams/${TEAM_IMG[x.team]}.webp" alt="">` : ''}${esc(x.team)}</small></span></span><span class="num">${fmt(x.pct, 2)}</span><span class="num">${fmt(x.qty)}</span><span class="num">${x.val >= 1e6 ? `${fmt(x.val / 1e6, 1)} М` : `${fmt(x.val / 1e3, 0)} к`}</span><span class="num ${tone(x.ch)}">${pct(x.ch)}</span></button>`).join('')}</div>`;
  }
  function openModal() { leaderboard(); q('#sxModal').classList.add('show'); q('#sxScrim').classList.add('show'); }
  function closeModal() { q('#sxModal').classList.remove('show'); q('#sxScrim').classList.remove('show'); }
  function profile() {
    const p = S.player, book = playerBook(p.nick);
    q('#sxPlayer').innerHTML = `<div class="sx-pbar"><span class="av" style="--h:${hash(p.nick) % 360}">${esc(p.nick.slice(0, 2).toUpperCase())}</span><span class="who"><small>Торговый профиль игрока</small><b>${esc(p.nick)} · ${esc(p.team)}</b></span><button class="ib" data-pclose aria-label="Закрыть и вернуться в свой портфель">${ICO.close}</button></div>
      <div class="sx-scroll">${portfolio(book, 'other')}</div>`;
  }
  function openPlayer(nick, team) { S.player = { nick, team }; profile(); q('#sxPlayer').classList.add('show'); }
  function closePlayer() { q('#sxPlayer').classList.remove('show'); S.player = null; }

  /* ---------- buy / sell sheet ---------- */
  function tradeSheet() {
    const t = S.trade, c = CLUB[S.club], qt = quotes(c), owned = MINE[c.n] ? MINE[c.n].q - reserved(c.n) : 0;
    const price = t.type === 'market' ? (t.side === 'buy' ? qt.ask : qt.bid) : t.price;
    const sum = price * t.n * (t.side === 'buy' ? 1 + FEE : 1 - FEE);
    const tokens = t.side === 'buy' && t.type === 'market' && t.pay === 'tokens';
    const cost = tokens ? `${fmt(sum / TOKEN_RATE, 2)} ${ACT}` : `${fmt(sum, 2)}${COIN()}`;
    const cant = t.side === 'sell' ? t.n > owned : !tokens && sum > BALANCE;
    q('#sxTrade').innerHTML = `<div class="sx-mh"><span class="ttl">${crest(c.n)}${esc(c.n)}</span><button class="ib" data-tclose aria-label="Закрыть">${ICO.close}</button></div>
      <div class="sx-q4">${[['Макс.', qt.high], ['Мин.', qt.low], ['Покупка', qt.bid, 'up'], ['Продажа', qt.ask, 'dn']].map(([l, v, tn]) => `<div><span>${l}</span><b class="num ${tn || ''}">${fmt(v)}</b></div>`).join('')}</div>
      <p class="sx-hold num">Ваши акции: <b>${fmt(MINE[c.n] ? MINE[c.n].q : 0)}</b> · свободно для продажи: <b>${fmt(Math.max(0, owned))}</b></p>
      <span class="sx-lab">Тип сделки</span>
      <div class="sx-side"><button class="buy" data-tside="buy" aria-pressed="${t.side === 'buy'}">${ICO.buy}Купить</button><button class="sell" data-tside="sell" aria-pressed="${t.side === 'sell'}">${ICO.sell}Продать</button></div>
      <span class="sx-lab">Тип заявки</span>
      <div class="seg sx-type">${[['market', 'По рынку'], ['limit', 'Лимитная']].map(([k, l]) => `<button data-ttype="${k}" aria-selected="${t.type === k}">${l}</button>`).join('')}</div>
      <div class="sx-det"><span class="sx-lab">Детали заявки</span>${t.side === 'buy' && t.type === 'market' ? `<div class="sx-pay" role="radiogroup" aria-label="Чем платить"><button data-pay="coins" aria-checked="${t.pay === 'coins'}">${COIN()}Коины</button><button data-pay="tokens" aria-checked="${t.pay === 'tokens'}">${ACT}Жетоны</button></div>` : ''}</div>
      <div class="sx-step"><span>Количество</span><button class="sb" data-tn="-1" aria-label="Меньше">${ICO.minus}</button><b class="num">${t.n}</b><button class="sb" data-tn="1" aria-label="Больше">${ICO.plus}</button></div>
      ${t.type === 'limit' ? `<div class="sx-step"><span>Цена за акцию</span><button class="sb" data-tp="-1" aria-label="Дешевле">${ICO.minus}</button><b class="num">${fmt(t.price)}</b><button class="sb" data-tp="1" aria-label="Дороже">${ICO.plus}</button></div>` : ''}
      <p class="sx-note">Комиссия 0,5% от суммы исполненной заявки.${tokens ? ` Курс: 1 жетон активности = ${fmt(TOKEN_RATE)} коинов.` : ''}${cant ? `<br><b class="dn">${t.side === 'sell' ? 'Недостаточно свободных акций' : 'Недостаточно коинов'}</b>` : ''}</p>
      <button class="sx-go ${t.side}" data-tgo ${cant ? 'disabled' : ''}><span>${t.n} акц.</span><b>${t.side === 'buy' ? 'Купить' : 'Продать'}</b><span class="num">${cost}</span></button>`;
  }
  function openTrade(side) { const qt = quotes(CLUB[S.club]); S.trade = { side, type: 'market', n: 1, pay: 'coins', price: side === 'buy' ? qt.bid : qt.ask }; tradeSheet(); q('#sxTrade').classList.add('show'); q('#sxScrim').classList.add('show'); }
  function closeTrade() { q('#sxTrade').classList.remove('show'); q('#sxScrim').classList.remove('show'); S.trade = null; }
  function submit() {
    const t = S.trade, c = CLUB[S.club], qt = quotes(c);
    if (t.type === 'limit') {
      const id = Math.max(...ORDERS.map(o => o.id)) + 1;
      ORDERS.unshift({ id, side: t.side, club: c.n, price: t.price, done: 0, qty: t.n, st: 'active', date: TODAY });
      toast(`Заявка #${id} выставлена: ${t.side === 'buy' ? 'покупка' : 'продажа'} ${t.n} акц. ${c.n}`);
    } else {
      const price = t.side === 'buy' ? qt.ask : qt.bid, sum = price * t.n * (t.side === 'buy' ? 1 + FEE : 1 - FEE);
      const h = MINE[c.n] || (MINE[c.n] = { q: 0, ch: 0 });
      if (t.side === 'buy') { h.q += t.n; if (t.pay === 'coins') BALANCE -= Math.round(sum); }
      else { h.q -= t.n; BALANCE += Math.round(sum); if (!h.q) delete MINE[c.n]; }
      toast(t.side === 'buy' ? `Куплено ${t.n} акц. ${c.n}${t.pay === 'tokens' ? ` за ${fmt(sum / TOKEN_RATE, 2)} жетона` : ''}` : `Продано ${t.n} акц. ${c.n}`);
    }
    closeTrade(); detail(); keepScroll(render);
  }

  /* ---------- order: details sheet, long-press menu, multi-select cancel ---------- */
  const refresh = () => { keepScroll(render); if (S.club) keepScroll(detail, '#sxCard', '#sxCardBody'); };
  const longDate = d => new Date(d + 'T12:00:00Z').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  function orderSheet() {
    const o = ORDERS.find(x => x.id === S.order), c = CLUB[o.club], fl = fills(o);
    const tq = fl.reduce((a, x) => a + x.n, 0), tv = fl.reduce((a, x) => a + x.n * x.p, 0), left = o.qty - o.done;
    const st = { active: 'Активна', done: 'Исполнена', cancelled: 'Отменена' }[o.st];
    const lock = o.st !== 'active' ? (o.st === 'cancelled' ? `Заявка отменена. ${o.side === 'buy' ? 'Заблокированные коины возвращены на баланс' : 'Зарезервированные акции возвращены в портфель'}.` : 'Заявка исполнена полностью.')
      : o.side === 'buy' ? `<b>${fmt(left * o.price)}</b>${COIN()} заблокировано на Вашем балансе для этой заявки. При отмене они вернутся на баланс.`
      : `<b>${fmt(left)}</b> ${plural(left, 'акция зарезервирована', 'акции зарезервированы', 'акций зарезервировано')} для этой заявки. При отмене они вернутся в портфель.`;
    q('#sxOrder').innerHTML = `<div class="sx-mh"><span class="ttl num">#${o.id}<small style="margin-left:auto;font-size:13px;font-weight:600;color:var(--text-3)">${longDate(o.date)}</small></span><button class="ib" data-oclose aria-label="Закрыть">${ICO.close}</button></div>
      <div class="sx-osb"><div class="sx-os ${o.st}">
        <div class="oh ${o.side}"><span class="oi">${o.side === 'buy' ? ICO.buy : ICO.sell}</span><span><b>${o.side === 'buy' ? 'Покупка' : 'Продажа'}</b>, лимитная заявка</span><span class="st ${o.st}">${st}</span></div>
        <div class="o2"><span class="oclub" data-oclub="${esc(c.n)}" role="link">${crest(c.n)}<b>${esc(c.n)}</b></span><span class="num">${o.side === 'buy' ? 'до' : 'от'} ${fmt(o.price)}${COIN()}</span><span class="oq num"><b>${o.done}</b> / ${o.qty}</span></div>
        <div class="ob"><i style="width:${Math.round(o.done / o.qty * 100)}%"></i></div>
        <div class="ft"><div class="fr fh"><span>Дата</span><span>Объём</span><span>Цена за акцию</span></div>
          ${fl.length ? fl.map(x => `<div class="fr num"><span>${new Date(x.t).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' })}</span><span>${x.n}</span><span>${fmt(x.p)}</span></div>`).join('') : '<p class="fe">Сделок пока нет</p>'}
          <div class="fr tot num"><span>Итого</span><span>${tq}</span><span>${tq ? `${fmt(tv)}` : '—'}</span></div></div>
        <div class="sx-info"><p>Со всех сделок по заявке взимается комиссия 0,5%${tq ? `: <b>${fmt(tv * FEE, 2)}</b>${COIN()}` : ''}.</p><p>${lock}</p></div>
      </div></div>
      ${o.st === 'active' ? '<button class="sx-ocancel" data-ocancel>Отменить заявку</button>' : ''}`;
  }
  function openOrder(id) { S.order = +id; orderSheet(); q('#sxOrder').classList.add('show'); q('#sxScrim').classList.add('show'); }
  function closeOrder() { if (S.order == null) return; q('#sxOrder').classList.remove('show'); q('#sxScrim').classList.remove('show'); S.order = null; }
  function cancelOrders(ids) {
    ids.forEach(id => { const o = ORDERS.find(x => x.id === id); if (o && o.st === 'active') o.st = 'cancelled'; });
    toast(ids.length === 1 ? `Заявка #${ids[0]} отменена` : `Отменено ${ids.length} ${plural(ids.length, 'заявка', 'заявки', 'заявок')}`);
  }
  function selUI() {
    const on = !!S.sel, n = on ? S.sel.size : 0;
    document.documentElement.classList.toggle('sx-selecting', on);
    q('#sxSel').hidden = q('#sxSelGo').hidden = !on;
    if (!on) return;
    q('#sxSel').innerHTML = `<button data-selx>Отмена</button><b>${n} ${plural(n, 'заявка выбрана', 'заявки выбраны', 'заявок выбрано')}</b><span></span>`;
    q('#sxSelGo').innerHTML = `<button data-selgo ${n ? '' : 'disabled'}>Отменить ${n ? `${n} ${plural(n, 'заявку', 'заявки', 'заявок')}` : 'заявки'}</button>`;
  }
  function startSelect(ctx, id) { S.sel = new Set(id != null && ORDERS.find(o => o.id === id).st === 'active' ? [id] : []); S.selCtx = ctx; selUI(); refresh(); }
  function endSelect() { if (!S.sel) return; S.sel = null; selUI(); refresh(); }
  function toggleSel(id) {
    const o = ORDERS.find(x => x.id === id);
    if (!o || o.st !== 'active') return toast('Отменить можно только активную заявку');
    S.sel.has(id) ? S.sel.delete(id) : S.sel.add(id); selUI(); refresh();
  }
  function closeMenu() { q('#sxMenu').hidden = true; document.querySelectorAll('.sx-ord.held').forEach(e => e.classList.remove('held')); }
  function openMenu(el) {
    if (S.sel) return;
    const id = +el.dataset.ord, o = ORDERS.find(x => x.id === id), r = el.getBoundingClientRect();
    S.menu = { id, ctx: el.closest('#sxCard') ? 'd' : '' };
    el.classList.add('held');
    const m = q('#sxMenu');
    m.innerHTML = `<div class="mb" role="menu">${o.st === 'active' ? `<button class="x" role="menuitem" data-mcan>${ICO.close}Отменить заявку</button>` : `<button role="menuitem" data-mopen>${ICO.chev}Открыть заявку</button>`}<button role="menuitem" data-msel>${ICO.check}Выбрать несколько</button></div>`;
    m.hidden = false;
    const mb = m.firstElementChild, h = mb.offsetHeight, w = mb.offsetWidth;
    const top = r.bottom - 14 + h > innerHeight - 12 ? Math.max(12, r.top - h + 14) : r.bottom - 14;
    mb.style.top = `${top}px`; mb.style.left = `${Math.min(innerWidth - w - 12, r.left + 40)}px`;
  }
  // a tap on an order opens it, or ticks it while selecting several
  function orderTap(e) {
    const oc = !S.sel && e.target.closest('[data-oclub]');
    if (oc) { openCard(oc.dataset.oclub); return true; }
    const el = e.target.closest('[data-ord]'); if (!el) return false;
    if (S.sel) toggleSel(+el.dataset.ord); else openOrder(el.dataset.ord);
    return true;
  }

  /* ---------- show / hide with the footer ---------- */
  function show(on) {
    q('#stocks').hidden = !on;
    document.documentElement.classList.toggle('on-stocks', on);
    document.querySelectorAll('#tabbar .tab').forEach(b => b.toggleAttribute('aria-current', false));
    const cur = q(`#tabbar [data-tab="${on ? 'wallet' : 'cups'}"]`);
    if (cur) cur.setAttribute('aria-current', 'page');
    if (on) render(); else { closeMenu(); S.sel = null; selUI(); closeOrder(); closeCard(); closeModal(); closeTrade(); closePlayer(); }
  }

  function bind() {
    q('#tabbar').addEventListener('click', e => {
      const b = e.target.closest('[data-tab]');
      if (!b) return;
      if (b.dataset.tab === 'wallet') show(true);
      else if (b.dataset.tab === 'cups') show(false);
    });
    const root = q('#stocks');
    root.addEventListener('click', e => {
      if (orderTap(e)) return;
      if (e.target.closest('[data-profile]')) return toast('Откроется профиль');
      const t = e.target.closest('[data-tab2],[data-sum],[data-sv],[data-sper],[data-sdir],[data-lg],[data-mkt],[data-side],[data-st],[data-pf],[data-div],[data-sort],[data-dopen],[data-club]');
      if (!t) return;
      const d = t.dataset;
      if (d.club) return openCard(d.club);
      if (d.sort) { const [k, col] = d.sort.split(':'), s = S.sort[k]; s.d = s.k === col ? -s.d : (col === 'nick' || col === 'n' || col === 'r' || col === 'pos' ? 1 : -1); s.k = col; return keepScroll(render); }
      if (d.dopen) { S.open.has(d.dopen) ? S.open.delete(d.dopen) : S.open.add(d.dopen); return keepScroll(render); }
      if (d.tab2) { S.tab = d.tab2; return render(); }
      if (d.sv) { S.sv = d.sv; const top = q('#sxScroll').scrollTop; render(); q('#sxScroll').scrollTop = top; return; } // a new strip starts from the left
      for (const k of ['sum', 'sv', 'sper', 'sdir', 'lg', 'mkt', 'side', 'st', 'pf', 'div']) if (d[k] != null) { S[k] = d[k]; return keepScroll(render); }
    });
    const card = q('#sxCard');
    let dragging = false;
    card.addEventListener('pointerdown', e => { const w = e.target.closest('[data-chart]'); if (!w) return; dragging = true; pointAt(w, e.clientX); });
    card.addEventListener('pointermove', e => { const w = e.target.closest('[data-chart]'); if (w && (dragging || e.pointerType === 'mouse')) pointAt(w, e.clientX); });
    window.addEventListener('pointerup', () => { dragging = false; });
    q('#sxCard').addEventListener('click', e => {
      if (orderTap(e)) return;
      const t = e.target.closest('button'); if (!t) return;
      const d = t.dataset;
      if (d.cclose != null) return closeCard();
      if (d.watch != null) { watch.has(S.club) ? watch.delete(S.club) : watch.add(S.club); toast(watch.has(S.club) ? 'Добавлено в избранное' : 'Убрано из избранного'); detail(); return keepScroll(render); }
      if (d.lb != null) return openModal();
      if (d.trade) return openTrade(d.trade);
      const body = q('#sxCardBody'), top = body.scrollTop;
      if (d.dtab) S.dTab = d.dtab;
      else if (d.period) S.period = d.period;
      else if (d.dside) S.dside = d.dside;
      else if (d.dst) S.dst = d.dst;
      else return;
      keepScroll(detail, '#sxCard', '#sxCardBody');
    });
    q('#sxModal').addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t) return;
      if (t.dataset.mclose != null) return closeModal();
      if (t.dataset.sort) { const [k, col] = t.dataset.sort.split(':'), s = S.sort[k]; s.d = s.k === col ? -s.d : (col === 'nick' || col === 'pos' ? 1 : -1); s.k = col; const lb = q('.sx-lbl'), top = lb ? lb.scrollTop : 0; leaderboard(); q('.sx-lbl').scrollTop = top; return; }
      if (t.dataset.player) openPlayer(t.dataset.player, t.dataset.team);
    });
    q('#sxPlayer').addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t) return;
      // closing the other player's profile goes straight back to your own portfolio
      if (t.dataset.pclose != null) { closePlayer(); closeModal(); closeCard(); S.tab = 'portfolio'; S.pf = 'stocks'; return render(); }
      if (t.dataset.sort) { const [k, col] = t.dataset.sort.split(':'), s = S.sort[k]; s.d = s.k === col ? -s.d : (col === 'n' ? 1 : -1); s.k = col; return profile(); }
      if (t.dataset.club) toast(`Акции ${t.dataset.club} в портфеле игрока ${S.player.nick}`);
    });
    q('#sxTrade').addEventListener('click', e => {
      const t = e.target.closest('button'); if (!t || t.disabled) return;
      const d = t.dataset, tr = S.trade;
      if (d.tclose != null) return closeTrade();
      if (d.tgo != null) return submit();
      if (d.tside) { tr.side = d.tside; const qt = quotes(CLUB[S.club]); tr.price = tr.side === 'buy' ? qt.bid : qt.ask; }
      else if (d.ttype) tr.type = d.ttype;
      else if (d.pay) tr.pay = d.pay;
      else if (d.tn) tr.n = Math.max(1, tr.n + +d.tn);
      else if (d.tp) tr.price = Math.max(1, tr.price + +d.tp * Math.max(1, Math.round(CLUB[S.club].p * 0.001)));
      tradeSheet();
    });
    q('#sxScrim').addEventListener('click', () => { closeTrade(); closeModal(); closeOrder(); });
    q('#sxOrder').addEventListener('click', e => {
      const oc = e.target.closest('[data-oclub]'); if (oc) { closeOrder(); return openCard(oc.dataset.oclub); }
      const t = e.target.closest('button'); if (!t) return;
      if (t.dataset.oclose != null) return closeOrder();
      if (t.dataset.ocancel != null) { const id = S.order; cancelOrders([id]); orderSheet(); refresh(); }
    });
    longPress(root, '.sx-ord', openMenu);
    longPress(card, '.sx-ord', openMenu);
    q('#sxMenu').addEventListener('click', e => {
      const t = e.target.closest('button'), { id, ctx } = S.menu || {};
      closeMenu(); if (!t) return;
      if (t.dataset.mcan != null) { cancelOrders([id]); refresh(); }
      else if (t.dataset.mopen != null) openOrder(id);
      else if (t.dataset.msel != null) startSelect(ctx, id);
    });
    q('#sxSel').addEventListener('click', e => { if (e.target.closest('[data-selx]')) endSelect(); });
    q('#sxSelGo').addEventListener('click', e => {
      if (!e.target.closest('[data-selgo]') || !S.sel.size) return;
      const ids = [...S.sel]; S.sel = null; cancelOrders(ids); selUI(); refresh();
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape' || q('#stocks').hidden) return;
      if (!q('#sxMenu').hidden) closeMenu(); else if (S.order != null) closeOrder(); else if (S.sel) endSelect(); else if (S.trade) closeTrade(); else if (q('#sxModal').classList.contains('show')) closeModal(); else if (S.player) closePlayer(); else if (S.club) closeCard();
    });
  }

  // app.js and this file may load in any order on GitHub Pages
  const wait = setInterval(() => {
    if (typeof I === 'undefined' || typeof crest !== 'function' || !document.querySelector('#tabbar .tab') || !q('#stocks')) return;
    clearInterval(wait);
    bind();
    window.Stocks = { show, openCard, openOrder, S };
  }, 50);
})();
