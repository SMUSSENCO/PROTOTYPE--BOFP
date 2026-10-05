/* Tournament screen («внутрянка турнира»): a hero with the logo, the selectors and the timeline,
   then sticky tabs — table, calendar, players, auction, summary. The hero scrolls away, the tabs stay.
   Uses globals from app.js: I, FLAGS, A, esc, hash, rng, toast, crest, TEAM_IMG, BOFP_TEAMS, TODAY, state, BIG5,
   BIG5_STAGES, BOFP, REAL, metaFor, pairUp, teamPool, pick, fakeScore, matchState, addDays, at, now, fmtLeft, ME,
   ALLIANCE_TEAMS, timelineHTML, AUCTION_LIST, NIGHT_MINE, AVATAR. */
(() => {
  const q = s => document.querySelector(s);
  const fmt = (n, d = 0) => Number(n).toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtK = v => v >= 1e6 ? `${fmt(v / 1e6, 1)}М` : v >= 1e4 ? `${fmt(v / 1e3, v >= 1e5 ? 0 : 1)}К` : fmt(v);
  const plural = (n, one, few, many) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? one : m >= 2 && m <= 4 && (h < 12 || h > 14) ? few : many; };
  const COIN = `<img class="cn" src="${A}buffs/coin.webp" alt="коинов">`;
  // placeholder until the real art arrives: activity token
  const TKN = '<svg class="tkn" viewBox="0 0 24 24" aria-label="жетонов"><path d="M12 2.5 20.2 7v10L12 21.5 3.8 17V7z" fill="#1FB5A8" stroke="#A8F0E8" stroke-width="1.2"/><path d="M13.2 6 8.5 13h3.2l-1 5 4.8-7.2h-3.3z" fill="#fff"/></svg>';
  const ICO = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    caret: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 10 5 5 5-5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    boot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"><path d="M6 3h6v7l6.5 3.2A3 3 0 0 1 20 16v2H4V5a2 2 0 0 1 2-2z"/><path d="M4 18v2h16v-2M9 7h3M9 10h3"/></svg>',
    swipe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 7-5 5 5 5M18 7l-5 5 5 5"/></svg>',
  };

  /* ---------- calendar of months ---------- */
  const MN = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const MS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const CUR = TODAY.slice(0, 7);
  const mAdd = (m, n) => { let [y, mo] = m.split('-').map(Number); mo += n; while (mo < 1) { mo += 12; y--; } while (mo > 12) { mo -= 12; y++; } return `${y}-${String(mo).padStart(2, '0')}`; };
  const mName = m => `${MN[+m.slice(5) - 1]} ${m.slice(0, 4)}`;
  const mShort = m => `${MS[+m.slice(5) - 1]}'${m.slice(2, 4)}`;
  const mRange = (a, b) => { const out = []; for (let m = a; m <= b; m = mAdd(m, 1)) out.push(m); return out; };
  const SEASONS = { S2425: { n: 'Сезон 2024/25', months: mRange('2024-07', CUR) }, S2324: { n: 'Сезон 2023/24', months: mRange('2023-08', '2024-06') } };
  const HISTORY = Array.from({ length: 12 }, (_, i) => mAdd(CUR, -1 - i)); // finished months, newest first
  const periodName = p => SEASONS[p] ? SEASONS[p].n : mName(p);
  const monthsOf = p => SEASONS[p] ? SEASONS[p].months : [p];
  const dayLong = d => new Date(d + 'T12:00:00Z').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short', timeZone: 'UTC' });
  const dayShort = d => new Date(d + 'T12:00:00Z').toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', timeZone: 'UTC' }).replace('.', '');

  /* ---------- BIG 5 structure ---------- */
  const COLORS = [['Red', 'Красный', '#E5484D'], ['Blue', 'Синий', '#3E7BFA'], ['Green', 'Зелёный', '#2FB46E'], ['Yellow', 'Жёлтый', '#F2C230']];
  const SIDES = [['West', 'Запад'], ['East', 'Восток']];
  const LIGAS = [1, 2, 3];
  const B5 = c => BIG5.find(b => b.color === c);
  const MINE5 = () => BIG5.find(b => b.mine);
  const colorRu = c => (COLORS.find(x => x[0] === c) || [, c])[1];
  const sideRu = s => (SIDES.find(x => x[0] === s) || [, s])[1];

  const CACHE = new Map();
  const memo = (key, fn) => { if (!CACHE.has(key)) CACHE.set(key, fn()); return CACHE.get(key); };
  const withDate = (list, date) => list.map(m => ({ ...m, date }));

  // one BIG 5 league for one month: 20 teams, 19 rounds, a round a day from the 12th (as on the tournaments screen)
  const b5League = (color, side, liga, month) => memo(`b5|${color}|${side}|${liga}|${month}`, () => {
    const b = B5(color), forced = b.mine && b.mine.side === side && b.mine.liga === liga ? b.mine.team : null;
    const teams = teamPool(`${b.code}${side}${liga}`, 20, forced);
    const rounds = Array.from({ length: 19 }, (_, i) => {
      const date = addDays(`${month}-12`, i), n = `Тур ${i + 1}`;
      return { n, date, month, matches: withDate(pairUp(teams, date + side + liga, b.times || ['15:00', '17:30', '20:00', '22:30'], `${b.code}${side[0]}${liga}`, n, forced), date) };
    });
    return { teams, rounds, mine: forced, color, side, liga };
  });
  const STAGE_OF = (stages, d) => (stages.find(s => d >= s.f && d <= s.t) || {}).n;
  const bofpLeague = code => memo(`bofp|${code}`, () => {
    const t = BOFP.find(x => x.code === code), mine = t.mine ? t.mine.team : null;
    const teams = t.pool === 'random' ? teamPool('rnd', 16, ME.team) : t.pool === 'alliance' ? ALLIANCE_TEAMS.slice(0, t.size) : pick(BOFP_TEAMS.map(x => x.name), t.code, t.size, mine);
    const rounds = t.days.map(d => { const n = (t.rounds && t.rounds[d]) || STAGE_OF(t.stages, d) || t.round || 'Плей-офф'; return { n, date: d, matches: withDate(pairUp(teams, d + t.code, ['19:45', '22:00'], t.code, n, mine), d) }; });
    const last = t.days[t.days.length - 1];
    for (const s of t.stages) if (s.f > last) rounds.push({ n: s.n, date: s.f, matches: [], note: s.auction ? 'Аукцион мест' : 'Пары определятся после жеребьёвки' });
    return { teams, rounds, mine };
  });
  const LEAGUE_ROUNDS = { epl: 38, laliga: 38, seriea: 38, bundesliga: 34, ligue1: 34 };
  const realLeague = code => memo(`real|${code}`, () => {
    const c = REAL.competitions[code] || {}, by = new Map();
    for (const [d, list] of Object.entries(REAL.days)) for (const m of list) if (m.comp === code) { const k = m.round || 'Матчи'; if (!by.has(k)) by.set(k, []); by.get(k).push({ ...m, date: m.date || d }); }
    const teams = [...new Set([...by.values()].flat().flatMap(m => [m.home, m.away]))];
    let rounds = [...by.entries()].map(([n, ms]) => ({ n, date: ms.map(m => m.date).sort()[0], matches: ms.sort((a, b) => (a.date + a.kickoff).localeCompare(b.date + b.kickoff)) }));
    const num = n => +(/^Тур (\d+)$/.exec(n) || [])[1];
    const known = rounds.filter(r => num(r.n));
    const total = (c.season && c.season.rounds) || LEAGUE_ROUNDS[code];
    if (known.length && total) {
      const k0 = num(known[0].n), d0 = known[0].date, have = new Set(known.map(r => num(r.n)));
      for (let n = 1; n <= total; n++) if (!have.has(n)) { const date = addDays(d0, (n - k0) * 7); rounds.push({ n: `Тур ${n}`, date, matches: withDate(pairUp(teams, code + n, ['16:00', '18:30', '21:00'], code, `Тур ${n}`, null), date) }); }
    } else {
      const last = rounds.map(r => r.date).sort().pop() || TODAY;
      for (const s of metaFor(code).stages) if (s.f > last && !s.pause) rounds.push({ n: s.n, date: s.f, matches: [], note: 'Пары определятся после жеребьёвки' });
    }
    rounds.sort((a, b) => a.date.localeCompare(b.date));
    const au = AUCTION_LIST.find(a => a.comp === code);
    const mine = (au && au.team) || (teams.includes(ME.fanClub) ? ME.fanClub : null) || (NIGHT_MINE[code] && teams.includes(NIGHT_MINE[code]) ? NIGHT_MINE[code] : null);
    return { teams, rounds, mine };
  });

  /* ---------- results, table, players ---------- */
  const resOf = m => m.date < TODAY ? { s: 'done', score: m.score || fakeScore(m.id) } : matchState(m, m.date);
  const xg = (id, k, g) => Math.max(0.2, g * 0.8 + (hash(`${id}|xg${k}`) % 160) / 100 - 0.4);
  function standings(leagues) {
    const T = new Map(), row = n => { if (!T.has(n)) T.set(n, { n, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, xg: 0, xga: 0, pts: 0, form: [] }); return T.get(n); };
    for (const L of leagues) {
      L.teams.forEach(row);
      for (const r of L.rounds) for (const m of r.matches) {
        const st = resOf(m); if (st.s !== 'done' || !st.score) continue;
        const [h, a] = st.score, H = row(m.home), W = row(m.away), xh = xg(m.id, 0, h), xa = xg(m.id, 1, a);
        H.mp++; W.mp++; H.gf += h; H.ga += a; W.gf += a; W.ga += h; H.xg += xh; H.xga += xa; W.xg += xa; W.xga += xh;
        if (h > a) { H.w++; W.l++; H.pts += 3; H.form.push('w'); W.form.push('l'); } else if (h < a) { W.w++; H.l++; W.pts += 3; H.form.push('l'); W.form.push('w'); } else { H.d++; W.d++; H.pts++; W.pts++; H.form.push('d'); W.form.push('d'); }
      }
    }
    return [...T.values()].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || a.n.localeCompare(b.n));
  }
  const FN_M = ['Алексей', 'Дмитрий', 'Тимур', 'Арман', 'Ерлан', 'Данияр', 'Максим', 'Никита', 'Виктор', 'Руслан', 'Азамат', 'Олжас', 'Кирилл', 'Егор', 'Нурлан', 'Санжар', 'Михаил', 'Артём', 'Павел', 'Бекзат', 'Ильяс', 'Денис', 'Марат', 'Игорь'];
  const FN_F = ['Анна', 'Мария', 'Айгерим', 'Дана', 'Ольга', 'Софья', 'Алия', 'Жанна', 'Камила', 'Ирина'];
  const LN = ['Ким', 'Ахметов', 'Смирнов', 'Нурланов', 'Беляев', 'Сейткали', 'Орлов', 'Жумабаев', 'Лисицын', 'Мукашев', 'Руденко', 'Есенов', 'Гарипов', 'Волков', 'Абенов', 'Кузнецов',
    'Тулегенов', 'Попов', 'Сагинтаев', 'Морозов', 'Касымов', 'Фёдоров', 'Омаров', 'Соколов', 'Байжанов', 'Лебедев', 'Искаков', 'Козлов', 'Утепов', 'Титов', 'Игонин', 'Воронин', 'Боргин'];
  const ME_NAME = 'Юрий Смусенко';
  const roster = team => memo(`ros|${team}`, () => {
    const r = rng('roster' + team), out = team === ME.team ? [{ name: ME_NAME, team, base: 1800, me: true }] : [];
    while (out.length < 5) {
      const f = r() < 0.22, last = LN[Math.floor(r() * LN.length)];
      const name = `${(f ? FN_F : FN_M)[Math.floor(r() * (f ? FN_F : FN_M).length)]} ${f && /(ов|ев|ин)$/.test(last) ? last + 'а' : last}`;
      if (!out.some(p => p.name === name)) out.push({ name, team, base: 400 + Math.floor(r() * 32) * 100 });
    }
    return out;
  });
  function players(leagues) {
    const P = new Map(), rec = p => { const k = `${p.name}|${p.team}`; if (!P.has(k)) P.set(k, { ...p, mp: 0, g: 0, a: 0, rs: 0, sal: 0 }); return P.get(k); };
    for (const L of leagues) {
      L.teams.forEach(t => roster(t).forEach(rec));
      for (const r of L.rounds) for (const m of r.matches) {
        const st = resOf(m); if (st.s !== 'done' || !st.score) continue;
        [m.home, m.away].forEach((team, k) => {
          const on = roster(team).filter(p => hash(`${m.id}|on|${p.name}`) % 100 < 86).map(rec);
          if (!on.length) return;
          const gl = new Map(), as = new Map();
          for (let i = 0; i < st.score[k]; i++) {
            const s = on[hash(`${m.id}|g${k}|${i}`) % on.length]; s.g++; gl.set(s, (gl.get(s) || 0) + 1);
            if (on.length > 1 && hash(`${m.id}|a${k}|${i}`) % 10 < 7) { const x = on.filter(p => p !== s)[hash(`${m.id}|ap${k}|${i}`) % (on.length - 1)]; x.a++; as.set(x, (as.get(x) || 0) + 1); }
          }
          const won = st.score[k] > st.score[1 - k], lost = st.score[k] < st.score[1 - k];
          for (const p of on) { p.mp++; p.sal += p.base; p.rs += Math.min(10, 6.1 + (won ? 0.45 : lost ? -0.35 : 0) + (hash(`${m.id}|r|${p.name}`) % 13) / 10 - 0.5 + 0.8 * (gl.get(p) || 0) + 0.45 * (as.get(p) || 0)); }
        });
      }
    }
    return [...P.values()].map(p => ({ ...p, ga: p.g + p.a, avg: p.mp ? p.rs / p.mp : 0 }));
  }

  /* ---------- state ---------- */
  const S = { kind: null, code: null, color: 'Green', side: 'West', liga: 2, period: CUR, tab: 'table', cal: 'all', rd: {}, pf: 'all', pteam: null, psort: { k: 'ga', d: -1 },
    more: new Set(), aucSub: 'auction', aucRound: 0, sheet: null };
  const isB5 = () => S.kind === 'big5';
  const aggregated = () => isB5() && (S.side === 'all' || S.color === 'all');
  const b5Sel = () => {
    const sides = S.side === 'all' ? SIDES.map(s => s[0]) : [S.side], colors = S.color === 'all' ? COLORS.map(c => c[0]) : [S.color];
    return sides.flatMap(side => colors.map(color => ({ side, color })));
  };
  // the leagues in view: one league (or its months for a season); first leagues of every alliance for the overall summary
  function leagues(period = S.period) {
    if (isB5()) {
      const liga = aggregated() ? 1 : S.liga;
      return b5Sel().flatMap(({ side, color }) => monthsOf(period).map(m => b5League(color, side, liga, m)));
    }
    return [S.kind === 'bofp' ? bofpLeague(S.code) : realLeague(S.code)];
  }
  const mineTeam = () => isB5() ? (aggregated() ? MINE5().mine.team : (leagues()[0] || {}).mine) : leagues()[0].mine;

  function desc() {
    if (isB5()) {
      const b = B5(S.color === 'all' ? MINE5().color : S.color);
      return { id: b.code, name: S.color === 'all' ? 'BIG 5' : `${b.color} BIG 5`, crumb: ['BofP Series', 'BIG 5'], logo: `${A}${b.img}-logo.webp`, bg: `${A}${b.img}-calendar.webp`, stages: BIG5_STAGES, mineTeam: b.mine ? b.mine.team : null, auctionName: 'Аукцион' };
    }
    if (S.kind === 'bofp') {
      const t = BOFP.find(x => x.code === S.code);
      const crumb = t.kind === 'BofP' ? ['Еврокубки', 'BofP Еврокубки'] : t.kind === 'Альянсы' ? ['Еврокубки', 'Альянс Еврокубки'] : ['BofP Series'];
      return { id: t.code, name: t.name, crumb, logo: t.icon, logoSvg: t.iconSvg, bg: t.bg, tint: t.bgTint, stages: t.stages, mineTeam: t.mine ? t.mine.team : null, auctionName: 'Аукцион' };
    }
    const c = REAL.competitions[S.code] || {}, meta = metaFor(S.code), cups = ['ucl', 'uel', 'uecl', 'usc'];
    const crumb = cups.includes(S.code) ? ['Еврокубки', 'УЕФА Еврокубки'] : S.code === 'lib' ? ['Конфедерации — сборные', 'CONMEBOL'] : ['Фан Клубы', c.country || ''];
    return { id: S.code, name: c.name || S.code, crumb, flag: c.flag, logoSvg: meta.icon, stages: meta.stages, mineTeam: realLeague(S.code).mine, auctionName: 'Рейтинг и аукцион' };
  }

  /* ---------- hero ---------- */
  function hero() {
    const d = desc(), b5 = isB5(), sum = S.tab === 'sum';
    const logo = d.logo ? `<img src="${esc(d.logo)}" alt="">` : d.flag && FLAGS[d.flag] ? `<span class="fl">${FLAGS[d.flag]}</span>` : (d.logoSvg || I.ball);
    const art = d.bg ? `<img src="${esc(d.bg)}" alt="">` : d.flag && FLAGS[d.flag] ? FLAGS[d.flag] : `<div style="background:${d.tint || 'linear-gradient(120deg,#1d2b4f,#3a2a5b)'}"></div>`;
    const sub = b5 ? [S.side === 'all' ? 'Запад и Восток' : sideRu(S.side), S.color === 'all' ? 'все альянсы' : `альянс ${colorRu(S.color).toLowerCase()}`, aggregated() ? 'первые лиги' : `Лига ${S.liga}`].join(' · ') : periodName(S.period);
    let sel = '';
    if (b5) {
      const mine = MINE5().mine;
      const sides = (sum ? [['all', 'Все']] : []).concat(SIDES);
      const colors = (sum ? [['all', 'Все', 'conic-gradient(#E5484D 0 25%,#3E7BFA 0 50%,#2FB46E 0 75%,#F2C230 0)']] : []).concat(COLORS);
      sel = `<div class="tn-sel">
        <div class="seg tn-side" role="tablist" aria-label="Конференция">${sides.map(([k, l]) => `<button role="tab" data-tside="${k}" aria-selected="${S.side === k}">${l}${mine.side === k ? '<i class="me-dot" aria-label="ваша конференция"></i>' : ''}</button>`).join('')}</div>
        <div class="tn-colors" role="radiogroup" aria-label="Цвет альянса">${colors.map(([k, l, c]) => `<button role="radio" data-tcolor="${k}" aria-checked="${S.color === k}" style="--c:${c}"><i></i>${l}${MINE5().color === k ? '<b class="me-dot"></b>' : ''}</button>`).join('')}</div>
        <div class="tn-dd">${aggregated() ? '<span class="dd off">Первые лиги</span>' : `<button class="dd" data-dd="liga" aria-haspopup="listbox">Лига ${S.liga}${ICO.caret}</button>`}<button class="dd" data-dd="period" aria-haspopup="listbox">${periodName(S.period)}${ICO.caret}</button></div></div>`;
    } else sel = `<div class="tn-sel"><div class="tn-dd"><button class="dd" data-dd="period" aria-haspopup="listbox">${periodName(S.period)}${ICO.caret}</button></div></div>`;
    const tl = (b5 ? S.period === CUR : true) && d.stages ? `<div class="tn-tl">${timelineHTML({ id: 'tn-' + d.id, stages: d.stages, mineTeam: null }, TODAY)}</div>` : '';
    return `<header class="tn-hero"><div class="tn-art" aria-hidden="true">${art}</div>
      <nav class="tn-crumb" aria-label="Раздел">${d.crumb.filter(Boolean).map(esc).join('<i>›</i>')}</nav>
      <div class="tn-id"><span class="tn-logo ${d.logo ? '' : 'svg'}">${logo}</span><div class="tx"><h1>${esc(d.name)}</h1><p>${esc(sub)}</p></div></div>
      ${sel}${tl}</header>`;
  }
  const TABS = () => [['table', 'Таблица'], ['cal', 'Календарь'], ['players', 'Игроки'], ['auction', desc().auctionName], ['sum', 'Сводка']];

  /* ---------- table ---------- */
  const zone = i => i < 3 ? ` z${i + 1}` : '';
  function tablePane() {
    if (aggregated()) return '';
    const rows = standings(leagues()), me = mineTeam();
    const played = rows.some(r => r.mp);
    return `<p class="tn-swipe">${ICO.swipe}Листайте влево — победы, ничьи, поражения и xG</p>
      <div class="tb"><table><thead><tr><th class="s p">#</th><th class="s n">Команда</th><th>И</th><th>Мячи</th><th>О</th><th>В</th><th>Н</th><th>П</th><th>xG</th><th>xGA</th><th class="fm">Форма</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr class="${r.n === me ? 'me' : ''}"><td class="s p"><span class="pos${played ? zone(i) : ''}">${i + 1}</span></td><td class="s n"><span class="tm">${crest(r.n)}<b>${esc(r.n)}</b></span></td>
        <td>${r.mp}</td><td>${r.gf}-${r.ga}</td><td class="pts">${r.pts}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${fmt(r.xg, 1)}</td><td>${fmt(r.xga, 1)}</td>
        <td class="fm"><span class="form">${r.form.slice(-5).map(f => `<i class="${f}">${{ w: 'В', d: 'Н', l: 'П' }[f]}</i>`).join('')}</span></td></tr>`).join('')}</tbody></table></div>`;
  }

  /* ---------- calendar ---------- */
  function matchHTML(m, me) {
    const st = resOf(m), mine = m.home === me || m.away === me;
    const sc = st.score ? `<span class="sc num ${st.s}">${st.score[0]}<i>:</i>${st.score[1]}</span>` : `<span class="sc num tm">${esc(m.kickoff || '')}</span>`;
    const lost = k => st.s === 'done' && st.score && st.score[k] < st.score[1 - k] ? ' lose' : '';
    return `<div class="mr ${mine ? 'me' : ''} ${st.s}">${st.s === 'live' ? `<span class="lv num">${esc(st.min)}</span>` : ''}
      <span class="h${lost(0)}"><b>${esc(m.home)}</b>${crest(m.home)}</span>${sc}<span class="a${lost(1)}">${crest(m.away)}<b>${esc(m.away)}</b></span></div>`;
  }
  function calPane() {
    if (aggregated()) return '';
    const L = leagues(), me = mineTeam(), multi = L.length > 1;
    let rounds = L.flatMap(l => l.rounds.map(r => ({ ...r, n: multi ? `${mShort(l.rounds[0].month)} · ${r.n}` : r.n })));
    const cur = rounds.findIndex(r => r.date >= TODAY);
    const state0 = r => r.date < TODAY ? 'done' : r.date === TODAY ? 'today' : 'next';
    const list = rounds.map((r, i) => ({ r, i })).filter(({ r }) => S.cal === 'all' || (S.cal === 'next' ? r.date >= TODAY : S.cal === 'done' ? r.date <= TODAY && state0(r) !== 'next' : r.matches.some(m => m.home === me || m.away === me)));
    const chipsHTML = `<div class="tn-chips" role="tablist">${[['all', 'Все туры'], ['next', 'Предстоящие'], ['done', 'Результаты'], ...(me ? [['mine', 'Мои матчи']] : [])].map(([k, l]) => `<button class="chip2" data-cal="${k}" aria-selected="${S.cal === k}">${l}</button>`).join('')}</div>`;
    const body = list.map(({ r, i }) => {
      const key = `${S.code}|${S.period}|${i}`, open = key in S.rd ? S.rd[key] : (S.cal === 'mine' || i === (cur < 0 ? rounds.length - 1 : cur));
      const s = state0(r), mineM = me ? r.matches.find(m => m.home === me || m.away === me) : null;
      const ms = S.cal === 'mine' ? r.matches.filter(m => m === mineM) : r.matches;
      const tag = s === 'done' ? 'Завершён' : s === 'today' ? 'Сегодня' : r.note ? esc(r.note) : 'Скоро';
      return `<section class="rd ${open ? 'open' : ''} ${s}"><button class="rd-h" data-rd="${esc(key)}" aria-expanded="${open}"><span class="nm"><b>${esc(r.n)}</b><small>${dayLong(r.date)}</small></span><span class="tg ${s}">${tag}</span>${I.chevron}</button>
        ${open ? `<div class="rd-b">${ms.length ? ms.map(m => matchHTML(m, me)).join('') : `<p class="tn-empty sm">${esc(r.note || 'Матчи появятся позже')}</p>`}</div>` : ''}</section>`;
    }).join('');
    return chipsHTML + (body || '<p class="tn-empty">Матчей нет</p>');
  }

  /* ---------- players ---------- */
  const PCOLS = [['mp', 'И'], ['g', 'Г'], ['a', 'П'], ['ga', 'Г+П'], ['avg', 'Оценка'], ['base', 'ЗП/матч'], ['sal', 'Зарплата']];
  const pval = (p, k) => k === 'avg' ? (p.mp ? fmt(p.avg, 2) : '—') : k === 'base' || k === 'sal' ? fmtK(p[k]) : p[k];
  function playersTable(list, opts = {}) {
    const { cols = PCOLS, sortable = true, limit = 50, key = 'pl', pin = true } = opts;
    const shown = S.more.has(key) ? list : list.slice(0, limit);
    const meIdx = list.findIndex(p => p.me), mePinned = pin && meIdx >= shown.length;
    const head = cols.map(([k, l]) => sortable ? `<th><button data-psort="${k}" class="${S.psort.k === k ? 'on' : ''}">${S.psort.k === k ? (S.psort.d < 0 ? '↓' : '↑') : ''}${l}</button></th>` : `<th>${l}</th>`).join('');
    const row = (p, i, cls = '') => `<tr class="${p.me ? 'me' : ''} ${cls}"><td class="s p">${i + 1}</td><td class="s n"><span class="pl"><span class="av" style="--h:${hash(p.name) % 360}">${esc(p.name.split(' ').map(w => w[0]).join('').slice(0, 2))}</span><span class="who"><b>${esc(p.name)}${p.me ? ' <em>Вы</em>' : ''}</b><small>${TEAM_IMG[p.team] ? `<img src="${A}teams/${TEAM_IMG[p.team]}.webp" alt="">` : ''}${esc(p.team)}</small></span></span></td>${cols.map(([k]) => `<td class="${k === opts.hl ? 'pts' : ''}">${pval(p, k)}</td>`).join('')}</tr>`;
    return `<div class="tb pl"><table><thead><tr><th class="s p">#</th><th class="s n">Игрок</th>${head}</tr></thead><tbody>${shown.map((p, i) => row(p, i)).join('')}${mePinned ? row(list[meIdx], meIdx, 'pin') : ''}</tbody></table></div>
      ${list.length > limit ? `<button class="tn-more" data-more="${key}">${S.more.has(key) ? 'Свернуть' : `Показать всех · ${list.length}`}${I.chevron}</button>` : ''}`;
  }
  const sortPlayers = (list, k, d) => [...list].sort((a, b) => (b[k] - a[k]) * -d || b.ga - a.ga || b.g - a.g || a.name.localeCompare(b.name));
  function playersPane() {
    if (aggregated()) return '';
    const me = mineTeam();
    let list = players(leagues());
    if (S.pf === 'mine' && me) list = list.filter(p => p.team === me);
    if (S.pf === 'team' && S.pteam) list = list.filter(p => p.team === S.pteam);
    list = sortPlayers(list, S.psort.k, S.psort.d);
    const chipsHTML = `<div class="tn-chips">${[['all', 'Все игроки'], ...(me ? [['mine', 'Моя команда']] : [])].map(([k, l]) => `<button class="chip2" data-pf="${k}" aria-selected="${S.pf === k}">${l}</button>`).join('')}
      <button class="chip2 dd2" data-dd="team" aria-selected="${S.pf === 'team'}">${S.pf === 'team' && S.pteam ? esc(S.pteam) : 'Команда'}${ICO.caret}</button></div>`;
    return chipsHTML + `<p class="tn-swipe">${ICO.swipe}Листайте влево — средняя оценка и зарплаты игроков</p>` + playersTable(list, { hl: S.psort.k });
  }

  /* ---------- auction: team slots (BofP Series, BofP and Alliance cups) ---------- */
  const MY_TOKENS = 129;
  const lastDay = m => addDays(`${mAdd(m, 1)}-01`, -1);
  // bidders come from the lower leagues of the same alliance; the price climbs by 5 tokens
  const slotAuction = (color, side, month) => memo(`auc|${color}|${side}|${month}`, () => {
    const r = rng(`auc${color}${side}${month}`), date = lastDay(month);
    const pool = [...b5League(color, side, 2, month).teams.map(n => [n, 2]), ...b5League(color, side, 3, month).teams.map(n => [n, 3])];
    const bidders = [];
    while (bidders.length < 3 + Math.floor(r() * 3)) { const x = pool.splice(Math.floor(r() * pool.length), 1)[0]; bidders.push(x); }
    const n = 18 + Math.floor(r() * 26), start = 40 + Math.floor(r() * 30) * 5, bids = [];
    let mins = 10 * 60 + Math.floor(r() * 120), prev = -1;
    for (let i = 0; i < n; i++) {
      let k = Math.floor(r() * bidders.length); if (k === prev) k = (k + 1) % bidders.length; prev = k;
      mins += 3 + Math.floor(r() * 25);
      bids.push({ team: bidders[k][0], liga: bidders[k][1], amount: start + i * 5, time: `${String(Math.floor(mins / 60) % 24).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`, date });
    }
    bids.reverse();
    return { date, bids, win: bids[0], month };
  });
  const bidRow = (b, ok) => `<div class="bid ${ok ? 'win' : ''}"><span class="dt num">${dayShort(b.date)}</span><span class="who">${crest(b.team)}<b>${esc(b.team)}</b><small>· Лига ${b.liga}</small></span><span class="am num">${b.amount}${TKN}</span>${ok ? `<span class="ok">${ICO.check}</span>` : '<span class="ok"></span>'}</div>`;
  function teamAuctionB5() {
    const color = S.color, side = S.side, month = SEASONS[S.period] ? CUR : S.period;
    const cur = month === CUR, a = slotAuction(color, side, month), prevA = slotAuction(color, side, mAdd(month, -1));
    const end = at(a.date, '23:59'), started = now() >= at(a.date, '00:00');
    const head = `<div class="au-h"><div><b>Аукцион BIG 5</b><small>${colorRu(color)} · ${sideRu(side)} · слот в Первой лиге</small></div><span class="bal num">${MY_TOKENS}${TKN}</span></div>`;
    const done = A0 => `<div class="au-card"><div class="lg"><span class="lg-l"><img src="${A}${B5(color).img}-logo.webp" alt=""></span><b>BIG 5 · Лига 1</b><button class="bids" data-bids="${color}|${side}|${A0.month}">${A0.bids.length} ${plural(A0.bids.length, 'ставка', 'ставки', 'ставок')}${I.right}</button></div>${bidRow(A0.win, true)}</div>`;
    let body = '';
    if (cur && !started) body = `<h3 class="tn-h">Ближайший аукцион <small>${dayLong(a.date)}</small></h3>
      <div class="au-next"><span class="ic">${I.gavel}</span><div><b>Свободный слот в Первой лиге</b><small>Ставки принимаются в последний день месяца. Шаг ставки — 5 жетонов</small></div><span class="left num" data-left="${at(a.date, '00:00')}">${fmtLeft(at(a.date, '00:00') - now())}</span></div>
      <h3 class="tn-h">Прошлый аукцион <small>завершён ${Math.round((now() - at(prevA.date, '23:59')) / 864e5)} ${plural(Math.round((now() - at(prevA.date, '23:59')) / 864e5), 'день', 'дня', 'дней')} назад</small></h3>${done(prevA)}`;
    else body = `<h3 class="tn-h">Аукцион <small>${mName(month)} · ${end < now() ? 'завершён' : 'идёт'}</small></h3>${done(a)}`;
    const hist = HISTORY.map(m => slotAuction(color, side, m));
    const best = hist.reduce((x, y) => y.win.amount > x.win.amount ? y : x);
    body += `<h3 class="tn-h">Рекорды</h3><p class="tn-cap">Самая высокая ставка за всё время</p>
      <div class="au-rec"><span class="who">${crest(best.win.team)}<b>${esc(best.win.team)}</b><small>· ${mShort(best.month)}</small></span><span class="big num">${best.win.amount}</span>${TKN}</div>
      <p class="tn-cap">Победители прошлых аукционов</p><div class="au-list">${hist.slice(0, 6).map(h => `<div class="au-w"><span class="m">${mShort(h.month)}</span><span class="who">${crest(h.win.team)}<b>${esc(h.win.team)}</b><small>· Лига ${h.win.liga}</small></span><button class="bids sm" data-bids="${color}|${side}|${h.month}">${h.bids.length}</button><span class="am num">${h.win.amount}${TKN}</span></div>`).join('')}</div>`;
    return head + body;
  }
  // BofP / Alliance cups: places in a stage are sold at an auction (stage flagged `auction`)
  function teamAuctionCup() {
    const d = desc(), st = (d.stages || []).find(s => s.auction);
    if (!st) return `<div class="au-next"><span class="ic">${I.gavel}</span><div><b>Аукционов в турнире пока нет</b><small>Расписание аукционов появится вместе с календарём следующего этапа</small></div></div>`;
    const places = +((/(\d+)\s+мест/.exec(st.ms.join(' ')) || [])[1] || 4);
    const r = rng('cupauc' + d.id), teams = pick(BOFP_TEAMS.map(x => x.name), 'cupauc' + d.id, 12, ME.team);
    const bids = teams.map((t, i) => ({ team: t, liga: 1 + Math.floor(r() * 3), amount: 60 + Math.floor(r() * 50) * 5, date: st.f, time: '' })).sort((a, b) => b.amount - a.amount);
    const done = at(st.t, '23:59') < now();
    const head = `<div class="au-h"><div><b>${esc(st.n)}</b><small>${esc(d.name)} · ${places} ${plural(places, 'место', 'места', 'мест')}</small></div><span class="bal num">${MY_TOKENS}${TKN}</span></div>`;
    if (!done) return head + `<div class="au-next"><span class="ic">${I.gavel}</span><div><b>${dayLong(st.f)}</b><small>${esc(st.ms.join('. '))}</small></div><span class="left num" data-left="${at(st.f, '00:00')}">${fmtLeft(at(st.f, '00:00') - now())}</span></div>`;
    return head + `<h3 class="tn-h">Выигравшие ставки <i class="cnt">${places}</i></h3><div class="au-list">${bids.slice(0, places).map(b => bidRow(b, true)).join('')}</div>
      <h3 class="tn-h">Перебитые ставки <i class="cnt">${bids.length - places}</i></h3><div class="au-list">${bids.slice(places).map(b => bidRow(b, false)).join('')}</div>`;
  }

  /* ---------- rating & auction: individual tournaments (fan clubs, national teams, UEFA cups) ---------- */
  // every round the squad slots of a fan club are sold to its members; 5 winners make the line-up
  const SLOTS = 5;
  const squadAuction = (team, round) => memo(`sq|${team}|${round.n}`, () => {
    const r = rng(`sq${team}${round.n}`), people = Array.from({ length: 9 }, (_, i) => { const p = roster(team + ' фан-клуб')[i % 5]; return i < 5 ? p.name : `${FN_M[Math.floor(r() * FN_M.length)]} ${LN[Math.floor(r() * LN.length)]}`; });
    if (team === realLeague(S.code).mine && !people.includes(ME_NAME)) people[3] = ME_NAME;
    const bids = [];
    let t = 16 * 60 + Math.floor(r() * 60);
    for (let i = 0; i < 24 + Math.floor(r() * 8); i++) { t += Math.floor(r() * 5); bids.push({ who: people[Math.floor(r() * people.length)], amount: Math.round((20 + r() * 110) * 10) * 100, time: `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}` }); }
    bids.sort((a, b) => b.amount - a.amount);
    const seen = new Set(), win = [];
    for (const b of bids) if (!seen.has(b.who) && win.length < SLOTS) { seen.add(b.who); win.push(b); }
    return { win, beaten: bids.filter(b => !win.includes(b)), end: at(addDays(round.date, -1), '21:00') };
  });
  const ago = ms => { const h = Math.round(ms / 36e5); return h < 24 ? `${Math.max(1, h)} ${plural(Math.max(1, h), 'час', 'часа', 'часов')} назад` : `${Math.round(h / 24)} ${plural(Math.round(h / 24), 'день', 'дня', 'дней')} назад`; };
  function individualAuction() {
    const L = realLeague(S.code), me = L.mine;
    const sub = `<div class="seg tn-sub" role="tablist">${[['auction', 'Аукцион'], ['rating', 'Рейтинг']].map(([k, l]) => `<button role="tab" data-asub="${k}" aria-selected="${S.aucSub === k}">${l}</button>`).join('')}</div>`;
    const near = L.rounds.filter(r => r.matches.length && r.date <= addDays(TODAY, 7)).slice(-4).reverse();
    if (!near.length) return sub + '<p class="tn-empty">Аукционов пока не было</p>';
    const round = near[Math.min(S.aucRound, near.length - 1)];
    if (S.aucSub === 'rating') {
      const team = me || L.teams[0], ppl = roster(team + ' фан-клуб').concat(roster(team + ' резерв')).map((p, i) => ({ ...p, me: false, pts: 0 }));
      if (me) ppl[6] = { name: ME_NAME, me: true };
      const list = ppl.map(p => ({ ...p, pts: 400 + hash(p.name + team + 'rt') % 900, mp: 4 + hash(p.name + 'mp') % 12 })).sort((a, b) => b.pts - a.pts);
      return sub + `<p class="tn-cap">${me ? `Рейтинг фан-клуба «${esc(team)}»` : `Рейтинг фан-клуба «${esc(team)}» · Ваш фан-клуб в турнире не участвует`}. Первые ${SLOTS} — в составе на тур без аукциона</p>
        <div class="rt">${list.map((p, i) => `<div class="rt-r ${p.me ? 'me' : ''} ${i < SLOTS ? 'in' : ''}"><span class="p num">${i + 1}</span><span class="av" style="--h:${hash(p.name) % 360}">${esc(p.name.split(' ').map(w => w[0]).join('').slice(0, 2))}</span><b>${esc(p.name)}${p.me ? ' <em>Вы</em>' : ''}</b><span class="mp num">${p.mp} ${plural(p.mp, 'тур', 'тура', 'туров')}</span><span class="pt num">${fmt(p.pts)}</span></div>`).join('')}</div>`;
    }
    const chipsHTML = `<div class="tn-chips">${near.map((r, i) => `<button class="chip2" data-around="${i}" aria-selected="${i === Math.min(S.aucRound, near.length - 1)}">${esc(r.n)}</button>`).join('')}</div>`;
    const team = me || L.teams[0], a = squadAuction(team, round), done = a.end < now();
    const all = L.teams.map(t => ({ t, b: squadAuction(t, round).win[0] })).sort((x, y) => y.b.amount - x.b.amount)[0];
    const row = (b, ok) => `<div class="bid ${ok ? 'win' : ''} ${b.who === ME_NAME ? 'me' : ''}"><span class="dt num">${b.time}</span><span class="who"><span class="av" style="--h:${hash(b.who) % 360}">${esc(b.who.split(' ').map(w => w[0]).join('').slice(0, 2))}</span><b>${esc(b.who)}</b></span><span class="am num">${fmtK(b.amount)}${COIN}</span>${ok ? `<span class="ok">${ICO.check}</span>` : '<span class="ok"></span>'}</div>`;
    return sub + chipsHTML + `<h3 class="tn-h">Аукцион <small>${done ? `завершён ${ago(now() - a.end)}` : `идёт · до конца ${fmtLeft(a.end - now())}`}</small></h3>
      <div class="au-top"><span class="who">${crest(team)}<span><b>${esc(a.win[0].who)}</b><small>${esc(team)} · крупнейшая ставка в ${me ? 'Вашей команде' : 'команде'}</small></span></span><span class="big num">${fmtK(a.win[0].amount)}</span>${COIN}</div>
      <h3 class="tn-h">Выигравшие ставки <i class="cnt">${a.win.length}</i></h3><div class="au-list">${a.win.map(b => row(b, true)).join('')}</div>
      <h3 class="tn-h">Перебитые ставки <i class="cnt">${a.beaten.length}</i></h3><div class="au-list">${a.beaten.map(b => row(b, false)).join('')}</div>
      <h3 class="tn-h">Самая крупная ставка турнира</h3>
      <div class="au-rec"><span class="who">${crest(all.t)}<span><b>${esc(all.b.who)}</b><small>${esc(all.t)} · ${esc(round.n)}</small></span></span><span class="big num">${fmtK(all.b.amount)}</span>${COIN}</div>`;
  }
  function auctionPane() {
    if (isB5()) return teamAuctionB5();
    return S.kind === 'bofp' ? teamAuctionCup() : individualAuction();
  }

  /* ---------- summary ---------- */
  const champOf = L => standings([L])[0];
  function holder() {
    // a finished month (or season) crowns its leader; the current month shows the reigning champion
    if (isB5()) {
      const prev = S.period === CUR ? mAdd(CUR, -1) : S.period;
      return b5Sel().map(({ side, color }) => {
        const liga = aggregated() ? 1 : S.liga, ls = monthsOf(prev).map(m => b5League(color, side, liga, m));
        const top = standings(ls)[0], best = sortPlayers(players(monthsOf(S.period).map(m => b5League(color, side, liga, m))), 'ga', -1)[0];
        return { side, color, team: top.n, pts: top.pts, best, when: S.period === CUR ? `Чемпион · ${mName(prev)}` : SEASONS[S.period] ? (S.period === 'S2425' ? 'Лидер сезона' : 'Чемпион сезона') : `Чемпион · ${mName(prev)}` };
      });
    }
    const L = leagues(), teams = L[0].teams, ex = teams[hash(S.code + 'champ') % teams.length];
    return [{ team: ex, when: 'Действующий чемпион · сезон 2023/24', best: sortPlayers(players(L), 'ga', -1)[0] }];
  }
  function board(title, k, list, cols, hl) {
    return `<section class="tn-board"><h3 class="tn-h">${title}</h3>${playersTable(sortPlayers(list, k, -1), { cols, sortable: false, limit: 5, key: 'b' + k, pin: false, hl })}</section>`;
  }
  function sumPane() {
    const hs = holder(), many = hs.length > 1;
    const top = `<div class="tn-tops ${many ? 'many' : ''}">${hs.map(h => `<div class="top-c">${h.color ? `<span class="al" style="--c:${COLORS.find(c => c[0] === h.color)[2]}">${colorRu(h.color)} · ${sideRu(h.side)}</span>` : ''}
        <div class="tc">${crest(h.team)}<span><small>${h.when}</small><b>${esc(h.team)}</b></span>${I.trophy}</div>
        ${h.best ? `<div class="tc pl"><span class="av" style="--h:${hash(h.best.name) % 360}">${esc(h.best.name.split(' ').map(w => w[0]).join('').slice(0, 2))}</span><span><small>Лучший игрок · гол+пас</small><b>${esc(h.best.name)}</b><em>${esc(h.best.team)}</em></span><span class="ga num">${h.best.ga}<small>${h.best.g}+${h.best.a}</small></span></div>` : ''}</div>`).join('')}</div>`;
    // champions of the finished months (BIG 5) or seasons, and the most decorated team
    let champs = '', titles = '';
    if (isB5()) {
      const sel = b5Sel(), liga = aggregated() ? 1 : S.liga;
      const rows = HISTORY.map(m => ({ m, list: sel.map(({ side, color }) => ({ side, color, team: champOf(b5League(color, side, liga, m)).n })) }));
      const count = new Map(); rows.forEach(r => r.list.forEach(x => count.set(x.team, (count.get(x.team) || 0) + 1)));
      const most = [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, many ? 5 : 3);
      titles = `<div class="tn-titles">${most.map(([t, n], i) => `<div class="tt ${i ? '' : 'gold'}">${crest(t)}<b>${esc(t)}</b><span class="num">${n} ${plural(n, 'титул', 'титула', 'титулов')}</span></div>`).join('')}</div>`;
      champs = many ? '' : `<div class="au-list">${rows.map(r => `<div class="ch"><span class="m">${mName(r.m)}</span><span class="who">${crest(r.list[0].team)}<b>${esc(r.list[0].team)}</b></span>${I.trophy}</div>`).join('')}</div>`;
    } else {
      const teams = leagues()[0].teams, seasons = ['2023/24', '2022/23', '2021/22', '2020/21', '2019/20', '2018/19'];
      const rows = seasons.map((s, i) => ({ s, team: teams[(hash(S.code + 'champ' + (i ? s : '')) % teams.length)] }));
      rows[0].team = hs[0].team;
      const count = new Map(); rows.forEach(r => count.set(r.team, (count.get(r.team) || 0) + 1));
      titles = `<div class="tn-titles">${[...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t, n], i) => `<div class="tt ${i ? '' : 'gold'}">${crest(t)}<b>${esc(t)}</b><span class="num">${n} ${plural(n, 'титул', 'титула', 'титулов')}</span></div>`).join('')}</div>`;
      champs = `<div class="au-list">${rows.map(r => `<div class="ch"><span class="m">Сезон ${r.s}</span><span class="who">${crest(r.team)}<b>${esc(r.team)}</b></span>${I.trophy}</div>`).join('')}</div>`;
    }
    const ps = players(leagues());
    const base = [['mp', 'И'], ['g', 'Г'], ['a', 'П'], ['ga', 'Г+П']];
    return top + `<h3 class="tn-h">Больше всего титулов <small>${isB5() ? 'за 12 месяцев' : 'за 6 сезонов'}</small></h3>${titles}`
      + (champs ? `<h3 class="tn-h">Все чемпионы</h3>${champs}` : '')
      + board('Лучшие бомбардиры', 'g', ps, base, 'g') + board('Лучшие ассистенты', 'a', ps, base, 'a') + board('Гол + пас', 'ga', ps, base, 'ga')
      + board('Лучшая средняя оценка', 'avg', ps.filter(p => p.mp >= 3), [['mp', 'И'], ['ga', 'Г+П'], ['avg', 'Оценка']], 'avg')
      + board('Самые высокие зарплаты', 'sal', ps, [['mp', 'И'], ['base', 'ЗП/матч'], ['sal', 'Зарплата']], 'sal');
  }

  /* ---------- shell ---------- */
  function pane() {
    if (aggregated() && S.tab !== 'sum') { S.side = S.side === 'all' ? MINE5().mine.side : S.side; S.color = S.color === 'all' ? MINE5().color : S.color; }
    return { table: tablePane, cal: calPane, players: playersPane, auction: auctionPane, sum: sumPane }[S.tab]();
  }
  function render(keep) {
    const root = q('#tn'), sc = q('#tnScroll'), heroH = sc ? q('.tn-hero').offsetHeight : 0, stuck = sc && sc.scrollTop >= heroH, top = sc ? sc.scrollTop : 0;
    const body = pane(), d = desc();
    root.innerHTML = `<div class="tn-bar"><button class="ib" data-tback aria-label="Назад">${ICO.back}</button><span class="ttl"><b>${esc(d.name)}</b></span><button class="icon-btn avatar" data-tprof aria-label="Профиль">${AVATAR}</button></div>
      <div class="tn-scroll" id="tnScroll">${hero()}
        <nav class="tn-tabs" role="tablist">${TABS().map(([k, l]) => `<button role="tab" data-ttab="${k}" aria-selected="${S.tab === k}">${l}</button>`).join('')}</nav>
        <div class="tn-pane">${body}</div></div>`;
    const n = q('#tnScroll');
    if (keep) n.scrollTop = stuck ? Math.max(q('.tn-hero').offsetHeight, top) : top;
    onScroll();
    const tabs = q('.tn-tabs [aria-selected="true"]'); if (tabs) tabs.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  function onScroll() { const sc = q('#tnScroll'), h = q('.tn-hero'); if (sc && h) q('#tn').classList.toggle('stuck', sc.scrollTop > h.offsetHeight - 10); }

  /* ---------- sheets: dropdowns and bid history ---------- */
  function sheet(html) { q('#tnSheet').innerHTML = `<span class="grab"></span>${html}`; q('#tnSheet').classList.add('show'); q('#tnScrim').classList.add('show'); }
  function closeSheet() { q('#tnSheet').classList.remove('show'); q('#tnScrim').classList.remove('show'); S.sheet = null; }
  function dropdown(kind) {
    S.sheet = kind;
    let items = [], title = '';
    if (kind === 'liga') { title = 'Лига'; const m = MINE5().mine; items = LIGAS.map(l => [l, `Лига ${l}`, S.color === MINE5().color && S.side === m.side && m.liga === l ? 'Ваша лига' : '']); }
    if (kind === 'period') { title = 'Период'; items = isB5() ? [[CUR, mName(CUR), 'Текущий месяц'], ...HISTORY.slice(0, 4).map(m => [m, mName(m), '']), ['S2425', SEASONS.S2425.n, 'Все месяцы сезона'], ['S2324', SEASONS.S2324.n, 'Архив']] : [['S2425', 'Сезон 2024/25', 'Текущий'], ['S2324', 'Сезон 2023/24', 'Архив']]; }
    if (kind === 'team') { title = 'Команда'; items = leagues()[0].teams.map(t => [t, t, t === mineTeam() ? 'Ваша команда' : '']); }
    const cur = kind === 'liga' ? S.liga : kind === 'period' ? S.period : S.pteam;
    sheet(`<h3 class="sh-t">${title}</h3><div class="sh-l" role="listbox">${items.map(([k, l, note]) => `<button role="option" data-opt="${esc(k)}" aria-selected="${String(k) === String(cur)}">${kind === 'team' ? crest(k) : ''}<span>${esc(l)}${note ? `<small>${note}</small>` : ''}</span>${String(k) === String(cur) ? ICO.check : ''}</button>`).join('')}</div>`);
  }
  function bidsSheet(key) {
    const [color, side, month] = key.split('|'), a = slotAuction(color, side, month);
    sheet(`<h3 class="sh-t">BIG 5 · Лига 1 · аукцион ${mShort(month)}</h3><div class="sh-sc">
      <h4 class="tn-h">Выигравшая ставка <i class="cnt">1</i></h4><div class="au-list">${bidRow(a.win, true)}</div>
      <h4 class="tn-h">Перебитые ставки <i class="cnt">${a.bids.length - 1}</i></h4><div class="au-list">${a.bids.slice(1).map(b => bidRow(b, false)).join('')}</div></div>`);
  }

  /* ---------- open / close ---------- */
  function show(on) {
    q('#tn').hidden = !on;
    document.documentElement.classList.toggle('on-tn', on);
    if (!on) closeSheet();
  }
  function open(o) {
    Object.assign(S, { tab: o.tab || 'table', cal: 'all', pf: 'all', pteam: null, aucSub: 'auction', aucRound: 0, period: CUR, rd: {} });
    S.more.clear();
    if (o.kind === 'big5') {
      const b = BIG5.find(x => x.code === o.code) || MINE5(), m = b.mine;
      S.kind = 'big5'; S.code = 'big5'; S.color = b.color; S.side = o.side || (m ? m.side : 'West'); S.liga = o.liga || (m && m.side === S.side ? m.liga : 1);
    } else { S.kind = o.kind; S.code = o.code; S.period = 'S2425'; } // cups and leagues run a whole season
    render(); q('#tnScroll').scrollTop = 0; show(true); onScroll();
    return true;
  }
  // a card from the tournaments screen
  function openCard(t, tab, extra = {}) {
    if (t.type === 'big5') return open({ kind: 'big5', code: t.id, side: extra.side || state.big5Side[t.id] || t.mineSide, liga: extra.liga, tab });
    if (t.type === 'bofp') return open({ kind: 'bofp', code: t.id, tab });
    if (t.type === 'real' && REAL.competitions[t.id]) return open({ kind: 'real', code: t.id, tab });
    return false;
  }
  // a catalog path: Green › West › BIG 5 · Лига 2, Фан Клубы › Англия › АПЛ …
  const LEAF = { 'АПЛ': 'epl', 'Ла Лига': 'laliga', 'Серия А': 'seriea', 'Бундеслига': 'bundesliga', 'Лига 1': 'ligue1', 'Суперлига': 'tur', 'Примейра': 'por', 'Про-лига': 'bel', 'Эредивизи': 'ned',
    'UEFA Champions League': 'ucl', 'UEFA Europa League': 'uel', 'UEFA Conference League': 'uecl', 'UEFA Super Cup': 'usc', 'Кубок Либертадорес': 'lib' };
  const BLEAF = { 'BofP Champions League': 'bcl', 'BofP Europa League': 'bel', 'BofP Conference League': 'becl', 'Alliance Champions League': 'acl', 'Alliance Europa League': 'ael', 'Alliance Conference League': 'acol', 'Random Cup': 'rnd' };
  function openPath(path) {
    const last = path[path.length - 1], b = BIG5.find(x => x.color === path[0]);
    if (b) { const lg = /Лига (\d)/.exec(last); if (!lg) return false; open({ kind: 'big5', code: b.code, side: path[1], liga: +lg[1] }); return true; }
    if (BLEAF[last]) { open({ kind: 'bofp', code: BLEAF[last] }); return true; }
    if (LEAF[last] && REAL.competitions[LEAF[last]]) { open({ kind: 'real', code: LEAF[last] }); return true; }
    return false;
  }

  function bind() {
    const root = q('#tn');
    root.addEventListener('scroll', onScroll, true);
    root.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const d = b.dataset;
      if (d.tback != null) return show(false);
      if (d.tprof != null) return toast('Откроется профиль');
      if (d.ttab) { S.tab = d.ttab; render(true); return; }
      if (d.tside) { S.side = d.tside; S.pteam = null; return render(true); }
      if (d.tcolor) { S.color = d.tcolor; S.pteam = null; return render(true); }
      if (d.dd) return dropdown(d.dd);
      if (d.stage != null) { const id = 'tn-' + desc().id, k = +d.stage; state.stage[id] = state.stage[id] === k ? undefined : k; return render(true); }
      if (d.go != null) { S.tab = 'auction'; return render(true); }
      if (d.cal) { S.cal = d.cal; S.rd = {}; return render(true); }
      if (d.rd) { const el = b.closest('.rd'); S.rd[d.rd] = !el.classList.contains('open'); return render(true); }
      if (d.pf) { S.pf = d.pf; return render(true); }
      if (d.psort) { const k = d.psort; S.psort = { k, d: S.psort.k === k ? -S.psort.d : -1 }; return render(true); }
      if (d.more) { S.more.has(d.more) ? S.more.delete(d.more) : S.more.add(d.more); return render(true); }
      if (d.asub) { S.aucSub = d.asub; return render(true); }
      if (d.around) { S.aucRound = +d.around; return render(true); }
      if (d.bids) return bidsSheet(d.bids);
    });
    q('#tnSheet').addEventListener('click', e => {
      const o = e.target.closest('[data-opt]'); if (!o) return;
      const v = o.dataset.opt;
      if (S.sheet === 'liga') S.liga = +v;
      else if (S.sheet === 'period') { if (!isB5()) { closeSheet(); if (v !== 'S2425') toast(`${SEASONS[v].n}: архив — заглушка`); return; } S.period = v; }
      else if (S.sheet === 'team') { S.pf = 'team'; S.pteam = v; }
      closeSheet(); render(true);
    });
    q('#tnScrim').addEventListener('click', closeSheet);
    document.addEventListener('keydown', e => { if (e.key !== 'Escape' || q('#tn').hidden) return; if (q('#tnSheet').classList.contains('show')) closeSheet(); else show(false); });
    // any footer tab leaves the tournament screen
    q('#tabbar').addEventListener('click', e => { if (e.target.closest('[data-tab]')) show(false); });
    setInterval(() => { if (q('#tn').hidden) return; document.querySelectorAll('#tn [data-left]').forEach(el => { el.textContent = fmtLeft(+el.dataset.left - now()); }); }, 1000);
  }

  // app.js and this file may load in any order on GitHub Pages
  const wait = setInterval(() => {
    if (typeof I === 'undefined' || typeof timelineHTML !== 'function' || !q('#tn') || !q('#tabbar .tab')) return;
    clearInterval(wait);
    bind();
    window.TN = { open, openCard, openPath, show, S, players: () => [...new Set(BIG5.flatMap(b => SIDES.flatMap(([s]) => LIGAS.flatMap(l => b5League(b.color, s, l, CUR).teams))))].flatMap(roster) };
  }, 50);
})();
