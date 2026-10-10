'use strict';

/* ================= icons ================= */
const I = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9z"/></svg>',
  rank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M9 21V9h6v12M3 21v-7h6M15 21v-9.5h6V21M2 21h20"/><path d="m12 2.5.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 4.6l2-.3z"/></svg>',
  table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 6h11M10 12h11M10 18h11"/><path d="M3.5 5 5 4v4M3.5 11.5h2.2l-2.2 2.5h2.2M3.5 17h2.2v4H3.5M3.8 19h1.9"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3zm0 4H6v1a2 2 0 0 0 1 1.7zm10 0v2.7A2 2 0 0 0 18 8V7z"/></svg>',
  ball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m12 7.5 4 2.9-1.5 4.7h-5L8 10.4z"/><path d="M12 7.5V3.2M16 10.4l4.2-1.3M14.5 15.1l2.6 3.6M9.5 15.1l-2.6 3.6M8 10.4 3.8 9.1"/></svg>',
  tennis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6c3.2 3.2 3.2 9.6 0 12.8M18.4 5.6c-3.2 3.2-3.2 9.6 0 12.8"/></svg>',
  ucl: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 1.7 3.6 3.9.4-2.9 2.7.8 3.9L12 11.2l-3.5 1.9.8-3.9-2.9-2.7 3.9-.4z"/><path d="M4.5 13.5 6 16.6l3.4.4-2.5 2.3.7 3.4-3.1-1.7-3 1.7.7-3.4L-.3 17l3.4-.4z" transform="translate(2 -1) scale(.8)"/><path d="m19.5 13.5 1.5 3.1 3.4.4-2.5 2.3.7 3.4-3.1-1.7-3 1.7.7-3.4-2.5-2.3 3.4-.4z" transform="translate(-1 1) scale(.9)" opacity=".7"/></svg>',
  cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 13v4M8.5 20h7l-1-3h-5z"/></svg>',
  dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><g fill="currentColor" stroke="none"><circle cx="9" cy="9" r="1.4"/><circle cx="15" cy="15" r="1.4"/><circle cx="15" cy="9" r="1.4"/><circle cx="9" cy="15" r="1.4"/><circle cx="12" cy="12" r="1.4"/></g></svg>',
  /* auction gavel, filled so it reads at 13–16px */
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  gavel: '<svg viewBox="0 0 24 24" fill="currentColor"><g transform="rotate(-42 11 9)"><rect x="5" y="5" width="11" height="6" rx="1.4"/><rect x="3.4" y="3.8" width="2.6" height="8.4" rx="1"/><rect x="15" y="3.8" width="2.6" height="8.4" rx="1"/><rect x="9.6" y="11" width="1.9" height="10" rx=".95"/></g><rect x="12" y="19.4" width="10" height="2.6" rx="1.3"/></svg>',
  /* "your match": a pitch with a ball on the centre spot */
  game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M12 5v14"/><circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none"/><path d="M2.5 9.5h3v5h-3M21.5 9.5h-3v5h3"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>',
  catalog: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12v2h3v2.5A4.5 4.5 0 0 1 16.9 12 5.5 5.5 0 0 1 13 15.4V18h3.5v3h-9v-3H11v-2.6A5.5 5.5 0 0 1 7.1 12 4.5 4.5 0 0 1 3 7.5V5h3zm0 4H5v.5A2.5 2.5 0 0 0 6.3 9.7 6 6 0 0 1 6 8zm12 0v1a6 6 0 0 1-.3 1.7A2.5 2.5 0 0 0 19 7.5V7z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  activity: '<svg class="ti ti-fire" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path class="f-out" d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.2-3.8 2.3-5 .3 1.6 1 2.4 1.9 2.8C11 8.5 11 6 12 3z"/><path class="f-in" d="M12 18.2a2 2 0 0 1-2-2c0-1.3.9-2 1.6-3 .5 1.1 2.4 1.8 2.4 3a2 2 0 0 1-2 2z"/><circle class="sp s1" cx="8" cy="7" r=".9" fill="currentColor" stroke="none"/><circle class="sp s2" cx="16.5" cy="6" r=".8" fill="currentColor" stroke="none"/><circle class="sp s3" cx="12" cy="2.5" r=".7" fill="currentColor" stroke="none"/></svg>',
  news: '<svg class="ti ti-news" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><g class="pg"><rect x="4" y="4" width="16" height="16" rx="3"/><path class="ln l1" pathLength="1" d="M8 9h8"/><path class="ln l2" pathLength="1" d="M8 13h8"/><path class="ln l3" pathLength="1" d="M8 17h5"/></g><path class="corner" d="M20 13.5 13.5 20H17a3 3 0 0 0 3-3z" fill="currentColor" stroke="none"/></svg>',
  cupTab: '<svg class="ti ti-cup" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><g class="cup"><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path class="h1" d="M7 6H4v1a3 3 0 0 0 3 3"/><path class="h2" d="M17 6h3v1a3 3 0 0 1-3 3"/><path d="M12 13v4M8 20h8"/></g><path class="st st1" d="M3.5 2.5v3M2 4h3" stroke-width="1.4"/><path class="st st2" d="M20.5 13v3M19 14.5h3" stroke-width="1.4"/><path class="st st3" d="M19.5 1.5v2.4M18.3 2.7h2.4" stroke-width="1.3"/></svg>',
  briefcase: '<svg class="ti ti-case" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><g class="coin"><circle cx="12" cy="9" r="3.2" fill="currentColor" stroke="none" opacity=".9"/></g><path class="hd" d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><g class="body"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M3 12.5h18"/><path class="lock" d="M11 12.5v1.6h2v-1.6"/></g></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20c1.3-3.6 4-5 7.5-5s6.2 1.4 7.5 5"/></svg>',
  menu: '<svg class="ti ti-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path class="m1" d="M4 7h16"/><path class="m2" d="M4 12h16"/><path class="m3" d="M4 17h16"/><circle class="dot" cx="20" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/></svg>',
  crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 8l4 4 4-7 4 7 4-4-2 11H6z"/></svg>',
};

/* flags: card backdrops for real competitions and country rows in the catalog */
const tri = (a, b, c, v) => `<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice">${v
  ? `<rect width="20" height="36" fill="${a}"/><rect x="20" width="20" height="36" fill="${b}"/><rect x="40" width="20" height="36" fill="${c}"/>`
  : `<rect width="60" height="12" fill="${a}"/><rect y="12" width="60" height="12" fill="${b}"/><rect y="24" width="60" height="12" fill="${c}"/>`}</svg>`;
const FLAGS = {
  'gb-eng': '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="36" fill="#fff"/><path d="M26 0h8v36h-8zM0 14h60v8H0z" fill="#CE1124"/></svg>',
  es: '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="36" fill="#AA151B"/><rect y="9" width="60" height="18" fill="#F1BF00"/></svg>',
  it: tri('#009246', '#fff', '#CE2B37', true),
  de: tri('#000', '#DD0000', '#FFCE00'),
  fr: tri('#0055A4', '#fff', '#EF4135', true),
  be: tri('#000', '#FDDA24', '#EF3340', true),
  nl: tri('#AE1C28', '#fff', '#21468B'),
  pt: '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="36" fill="#DA291C"/><rect width="24" height="36" fill="#046A38"/><circle cx="24" cy="18" r="7" fill="#FFE900"/></svg>',
  tr: '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="36" fill="#E30A17"/><circle cx="24" cy="18" r="9" fill="#fff"/><circle cx="26.5" cy="18" r="7.2" fill="#E30A17"/><path d="m35 18 3.5-1.1-2.2 3 0-3.8 2.2 3z" fill="#fff"/></svg>',
  us: '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="36" fill="#B22234"/>' + [1, 3, 5, 7, 9, 11].map(k => `<rect y="${k * 2.77}" width="60" height="2.77" fill="#fff"/>`).join('') + '<rect width="26" height="19.4" fill="#3C3B6E"/></svg>',
  conmebol: '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="36" fill="#0E3A74"/><circle cx="30" cy="18" r="10" fill="none" stroke="#F2C230" stroke-width="3"/></svg>',
  eu: (() => {
    let s = '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="36" fill="#003399"/>';
    for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; s += `<circle cx="${(30 + Math.cos(a) * 11).toFixed(2)}" cy="${(18 + Math.sin(a) * 11).toFixed(2)}" r="1.6" fill="#FFCC00"/>`; }
    return s + '</svg>';
  })(),
};

/* ================= virtual clock: Wed 21 Aug 2024, 21:12 Moscow ================= */
const TODAY = '2024-08-21';
const T0 = Date.parse('2024-08-21T21:12:10+03:00');
const boot = Date.now();
const now = () => T0 + (Date.now() - boot);
const at = (date, hm = '00:00') => Date.parse(`${date}T${hm}:00+03:00`);
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const WD = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
const wd = iso => WD[new Date(iso + 'T12:00:00Z').getUTCDay()];
const ddmm = iso => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
const ddmmyy = iso => `${ddmm(iso)}.${iso.slice(2, 4)}`;
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function fmtLeft(ms) {
  if (ms <= 0) return '00:00:00';
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
  const p = n => String(n).padStart(2, '0');
  return d > 0 ? `${d}д ${p(h)}:${p(m)}` : `${p(h)}:${p(m)}:${p(sec)}`;
}

/* ================= the player (entities from the profile screen) ================= */
const ME = { fanClub: 'Галатасарай', alliance: 'Eastern Green', team: 'Ұлы жүз' };

/* ================= timelines: real 2024/25 stage dates ================= */
const UCL_STAGES = [
  { n: 'Квалификация', f: '2024-07-09', t: '2024-08-14', ms: ['Три раунда: путь чемпионов и путь лиг'] },
  { n: 'Плей-офф квалификации', f: '2024-08-20', t: '2024-08-28', ms: ['Победители проходят в общий этап (36 команд)', 'Проигравшие уходят в общий этап Лиги Европы'] },
  { n: 'Общий этап', f: '2024-09-17', t: '2025-01-29', ms: ['8 матчей против 8 разных соперников', 'Места 1–8 — сразу в 1/8 финала', 'Места 9–24 — стыковые матчи', 'Места 25–36 — выбывают'] },
  { n: 'Стыковые матчи', f: '2025-02-11', t: '2025-02-19', ms: ['Два матча, победитель — в 1/8'] },
  { n: '1/8 финала', f: '2025-03-04', t: '2025-03-12', ms: [] },
  { n: '1/4 финала', f: '2025-04-08', t: '2025-04-16', ms: [] },
  { n: '1/2 финала', f: '2025-04-29', t: '2025-05-07', ms: [] },
  { n: 'Финал · Мюнхен', f: '2025-05-31', t: '2025-05-31', ms: ['Альянц Арена'], final: true },
];
const UEL_STAGES = [
  { n: 'Квалификация', f: '2024-07-11', t: '2024-08-15', ms: [] },
  { n: 'Плей-офф квалификации', f: '2024-08-22', t: '2024-08-29', ms: ['Победители — в общий этап', 'Проигравшие — в общий этап Лиги конференций'] },
  { n: 'Общий этап', f: '2024-09-25', t: '2025-01-30', ms: ['8 туров, 36 команд', 'Места 1–8 — в 1/8 финала', 'Места 9–24 — стыковые матчи'] },
  { n: 'Стыковые матчи', f: '2025-02-13', t: '2025-02-20', ms: [] },
  { n: '1/8 финала', f: '2025-03-06', t: '2025-03-13', ms: [] },
  { n: '1/4 финала', f: '2025-04-10', t: '2025-04-17', ms: [] },
  { n: '1/2 финала', f: '2025-05-01', t: '2025-05-08', ms: [] },
  { n: 'Финал · Бильбао', f: '2025-05-21', t: '2025-05-21', ms: ['Сан-Мамес'], final: true },
];
const UECL_STAGES = [
  { n: 'Квалификация', f: '2024-07-11', t: '2024-08-15', ms: [] },
  { n: 'Плей-офф квалификации', f: '2024-08-22', t: '2024-08-29', ms: ['Победители — в общий этап (36 команд)'] },
  { n: 'Общий этап', f: '2024-10-03', t: '2024-12-19', ms: ['6 туров', 'Места 1–8 — в 1/8 финала', 'Места 9–24 — стыковые матчи'] },
  { n: 'Стыковые матчи', f: '2025-02-13', t: '2025-02-20', ms: [] },
  { n: '1/8 финала', f: '2025-03-06', t: '2025-03-13', ms: [] },
  { n: '1/4 финала', f: '2025-04-10', t: '2025-04-17', ms: [] },
  { n: '1/2 финала', f: '2025-05-01', t: '2025-05-08', ms: [] },
  { n: 'Финал · Вроцлав', f: '2025-05-28', t: '2025-05-28', ms: ['Тарчиньский Арена'], final: true },
];
/* FIFA international windows 2024/25: national leagues stop for them */
const FIFA_BREAKS = [['2024-09-02', '2024-09-10'], ['2024-10-07', '2024-10-15'], ['2024-11-11', '2024-11-19'], ['2025-03-17', '2025-03-25'], ['2025-06-02', '2025-06-10']];
/* domestic league: start, summer window close, international breaks, winter window, extra stages, last round */
function league(s) {
  const st = [{ n: 'Старт сезона', f: s.start, t: s.start, ms: [`${s.rounds} туров`] }];
  if (s.windowClose) st.push({ n: 'Закрытие летнего окна', f: s.windowClose, t: s.windowClose, ms: ['Последний день трансферов до зимы'] });
  if (s.winterFrom) st.push({ n: 'Зимнее трансферное окно', f: s.winterFrom, t: s.winterTo, ms: [] });
  for (const [f, t] of FIFA_BREAKS) if (f > s.start && f < s.end) st.push({ n: 'Пауза на матчи сборных', f, t, ms: ['Туры чемпионата не проводятся'], pause: true });
  for (const x of s.extra || []) st.push({ n: x.n, f: x.f, t: x.t || x.f, ms: [] });
  st.push({ n: 'Завершение чемпионата', f: s.end, t: s.end, ms: ['Последний тур, выдача наград'], final: true });
  return st.sort((a, b) => a.f.localeCompare(b.f) || !!a.final - !!b.final);
}
const ACL_STAGES = [
  { n: 'Аукцион квалификации', f: '2024-08-13', t: '2024-08-13', ms: ['4 места в квалификации разыгрываются на аукционе'], auction: true },
  { n: 'Квалификация', f: '2024-08-20', t: '2024-08-21', ms: ['3 победителя Лиги 1 Big5+ из альянсов 3–5 мест рейтинга', 'Команда со 2-го места Лиги 1 Big5+ альянса №1', '4 победителя аукциона', 'Один матч, 4 победителя проходят в групповой этап'] },
  { n: 'Групповой этап', f: '2024-08-27', t: '2024-09-10', ms: ['Победители прошлых Alliance CL и Alliance EL', '2 победителя Лиги 1 Big5+ из альянсов 1–2 мест', '4 победителя квалификации', 'Каждая команда играет 3 матча', 'Если победитель CL или EL — ещё и чемпион Big5+, его слот Big5+ уходит второму месту'] },
  { n: '1/4 финала', f: '2024-09-24', t: '2024-09-24', ms: ['Все 8 команд группы: 1-е место играет с 8-м, 2-е с 7-м', 'Один матч, пары без жеребьёвки'] },
  { n: '1/2 финала', f: '2024-10-08', t: '2024-10-08', ms: ['Плей-офф: один матч'] },
  { n: 'Финал', f: '2024-10-22', t: '2024-10-22', ms: ['Один матч'], final: true },
];
const BCL_STAGES = [
  { n: 'Квалификация, 1-й раунд', f: '2024-07-09', t: '2024-07-17', ms: ['144 команды стартуют с первого раунда', 'Проигравшие → 2-й квал. раунд Лиги конференций'] },
  { n: 'Квалификация, 2-й раунд', f: '2024-07-23', t: '2024-07-31', ms: ['Проигравшие → 3-й квал. раунд Лиги конференций'] },
  { n: 'Квалификация, 3-й раунд', f: '2024-08-06', t: '2024-08-14', ms: ['Проигравшие → 4-й квал. раунд Лиги конференций'] },
  { n: 'Квалификация, 4-й раунд', f: '2024-08-20', t: '2024-08-28', ms: ['16 победителей — в основной этап', 'Проигравшие → основной этап Лиги Европы', 'Ничья — серия пенальти'] },
  { n: 'Аукцион мест', f: '2024-09-10', t: '2024-09-10', ms: ['12 мест основного этапа разыгрываются на аукционе'], auction: true },
  { n: 'Основной этап', f: '2024-09-17', t: '2025-01-29', ms: ['36 команд: 8 из «Плей-офф основной фазы 26/27», 16 из квалификации, 12 с аукциона', '8 туров: победа 3, ничья 1, поражение 0', 'При равенстве очков: разница мячей, затем забитые', 'Места 1–8 — в 1/8, места 9–24 — в 1/16'] },
  { n: '1/16 плей-офф', f: '2025-02-11', t: '2025-02-19', ms: ['Команды с 9 по 24 место', 'Победитель пары — по забитым мячам, ничья — пенальти'] },
  { n: '1/8 финала', f: '2025-03-04', t: '2025-03-12', ms: [] },
  { n: '1/4 финала', f: '2025-04-08', t: '2025-04-16', ms: [] },
  { n: '1/2 финала', f: '2025-04-29', t: '2025-05-07', ms: [] },
  { n: 'Финал', f: '2025-05-31', t: '2025-05-31', ms: [], final: true },
];
/* BIG 5: 19 rounds, one a day inside a month; the auction closes the month */
const BIG5_STAGES = [
  { n: 'Тур 1', f: '2024-08-12', t: '2024-08-12', ms: ['20 команд в каждой лиге, 19 туров за месяц', 'Матчи каждый день'] },
  { n: 'Тур 5', f: '2024-08-16', t: '2024-08-16', ms: [] },
  { n: 'Тур 10 · экватор', f: '2024-08-21', t: '2024-08-21', ms: [] },
  { n: 'Тур 15', f: '2024-08-26', t: '2024-08-26', ms: [] },
  { n: 'Тур 19 · финиш', f: '2024-08-30', t: '2024-08-30', ms: [], final: true },
  { n: 'Аукцион', f: '2024-08-31', t: '2024-08-31', ms: ['Последний день месяца — аукцион за свободный слот в Первой лиге'], auction: true, go: true },
];
const RANDOM_STAGES = [
  { n: 'Жеребьёвка', f: '2024-08-10', t: '2024-08-10', ms: ['Соперников выбирает случай'] },
  { n: '1/16 финала', f: '2024-08-18', t: '2024-08-18', ms: [] },
  { n: '1/8 финала', f: '2024-08-24', t: '2024-08-24', ms: ['Проигравший выбывает, без переигровок'] },
  { n: '1/4 финала', f: '2024-09-07', t: '2024-09-07', ms: [] },
  { n: '1/2 финала', f: '2024-09-21', t: '2024-09-21', ms: [] },
  { n: 'Финал', f: '2024-10-05', t: '2024-10-05', ms: ['Кубок и 250 000 монет'], final: true },
];

const REAL_META = {
  usc: { icon: I.cup, bg: 'eu', short: 'Суперкубок УЕФА', stages: [{ n: 'Финал · Варшава', f: '2024-08-14', t: '2024-08-14', ms: ['Победитель ЛЧ против победителя ЛЕ'], final: true }] },
  ucl: { icon: I.ucl, bg: 'eu', short: 'Лига чемпионов', stages: UCL_STAGES },
  uel: { icon: I.ucl, bg: 'eu', short: 'Лига Европы', stages: UEL_STAGES },
  uecl: { icon: I.ucl, bg: 'eu', short: 'Лига конференций', stages: UECL_STAGES },
  epl: { icon: I.ball, bg: 'gb-eng', stages: league({ start: '2024-08-16', end: '2025-05-25', rounds: 38, windowClose: '2024-08-30', winterFrom: '2025-01-01', winterTo: '2025-02-03' }) },
  laliga: { icon: I.ball, bg: 'es', stages: league({ start: '2024-08-15', end: '2025-05-25', rounds: 38, windowClose: '2024-08-30', winterFrom: '2025-01-02', winterTo: '2025-02-03' }) },
  seriea: { icon: I.ball, bg: 'it', stages: league({ start: '2024-08-17', end: '2025-05-25', rounds: 38, windowClose: '2024-08-30', winterFrom: '2025-01-02', winterTo: '2025-02-03' }) },
  bundesliga: { icon: I.ball, bg: 'de', stages: league({ start: '2024-08-23', end: '2025-05-17', rounds: 34, windowClose: '2024-08-30', winterFrom: '2025-01-01', winterTo: '2025-02-03' }) },
  ligue1: { icon: I.ball, bg: 'fr', stages: league({ start: '2024-08-16', end: '2025-05-17', rounds: 34, windowClose: '2024-08-30', winterFrom: '2025-01-01', winterTo: '2025-02-03' }) },
};
const REAL_ORDER = ['usc', 'ucl', 'uel', 'uecl', 'epl', 'laliga', 'seriea', 'bundesliga', 'ligue1', 'tur', 'por', 'ned', 'bel'];
const NIGHT_REAL = ['lib'];

/* ================= BofP series ================= */
const A = 'assets/';
const ALLIANCE_TEAMS = ['Eastern Green', 'Bosphorus Lions', 'Nordic Vikings', 'Iberian Bulls', 'Balkan Wolves', 'Samba Kings', 'Red Dragons', 'Alpine Eagles',
  'Baltic Storm', 'Celtic Pride', 'Danube Stars', 'Atlas Lions', 'Carpathian Bears', 'Aegean Sharks', 'Rhine Titans', 'Seine Royals', 'Thames Legion', 'Volga Riders'];
const P1 = ['Steppe', 'Nomad', 'Altai', 'Caspian', 'Tengri', 'Irtysh', 'Aral', 'Burabay', 'Khan', 'Saryarka', 'Zhetysu', 'Tobol', 'Ishim', 'Balkhash', 'Turan', 'Kokshe', 'Oxus', 'Pamir', 'Sayram', 'Emba', 'Baikonur', 'Silk Road'];
const P2 = ['Wolves', 'Eagles', 'Lions', 'Titans', 'Storm', 'Kings', 'Riders', 'Falcons', 'Sharks', 'Bears', 'Rockets', 'United', 'Stars', 'Hawks', 'Tigers', 'Legion'];
let BOFP_TEAMS = []; // filled from data/bofp-teams.json: our project's teams with avatars

function rng(seed) { let k = hash(seed); return () => (k = Math.imul(k ^ (k >>> 15), 2246822507) ^ Math.imul(k ^ (k >>> 13), 3266489909), (k >>> 0) / 4294967296); }
function pick(list, seed, n, forced) {
  const r = rng(seed), pool = list.filter(x => x !== forced), out = forced ? [forced] : [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  return out;
}
function teamPool(seed, n, forced) {
  const out = forced ? [forced] : [];
  let k = hash(seed);
  while (out.length < n) { const nm = `${P1[k % P1.length]} ${P2[(k >>> 7) % P2.length]}`; if (!out.includes(nm)) out.push(nm); k = Math.imul(k ^ (k >>> 13), 2654435761) >>> 0; }
  return out;
}
function fakeScore(id) { const h = hash(id), g = [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4]; return [g[h % g.length], g[(h >>> 8) % g.length]]; }
function pairUp(teams, key, times, comp, round, me, date, meAt) {
  const list = [...teams], r = hash(key) % (list.length - 1), head = list.shift();
  for (let i = 0; i < r; i++) list.push(list.shift());
  list.unshift(head);
  const out = [];
  for (let i = 0; i < list.length / 2; i++) out.push({ id: `${comp}-${key}-${i}`, comp, round, home: list[i], away: list[list.length - 1 - i], kickoff: times[i % times.length], date, bofp: true });
  const mine = m => (me && (m.home === me || m.away === me)) ? 1 : 0;
  // the player's match takes the latest slot (a pick is still open) or the earliest one (a pick was missed)
  const mm = out.find(mine);
  if (mm) mm.kickoff = meAt === 'first' ? times[0] : times[times.length - 1];
  return out.sort((a, b) => mine(b) - mine(a) || a.kickoff.localeCompare(b.kickoff));
}

const BOFP = [
  { code: 'bcl', name: 'BofP Champions League', short: 'BofP CL', kind: 'BofP', round: 'Квал., 4-й раунд', icon: A + 'bofp-champions-league-logo.webp', iconLogo: true, bg: A + 'bofp-champions-league-calendar.webp', stages: BCL_STAGES,
    days: ['2024-08-20', '2024-08-21', '2024-08-27', '2024-08-28'], pool: 'bofp', size: 16, mine: { team: ME.team, days: ['2024-08-21'] } },
  { code: 'bel', name: 'BofP Europa League', short: 'BofP EL', kind: 'BofP', icon: A + 'bofp-europa-league-logo.webp', iconLogo: true, bg: A + 'bofp-europa-league-calendar.webp', stages: UEL_STAGES, days: ['2024-08-22'], pool: 'bofp', size: 12 },
  { code: 'becl', name: 'BofP Conference League', short: 'BofP ECL', kind: 'BofP', icon: A + 'bofp-conference-league-logo.webp', iconLogo: true, bg: A + 'bofp-conference-league-calendar.webp', stages: UECL_STAGES, days: ['2024-08-22'], pool: 'bofp', size: 12 },
  { code: 'acl', name: 'Alliance Champions League', short: 'Alliance CL', kind: 'Альянсы', icon: A + 'alliance-champions-league-avatar.webp', bg: A + 'alliance-champions-league-calendar.webp', stages: ACL_STAGES,
    days: ['2024-08-20', '2024-08-21', '2024-08-27', '2024-08-28'], pool: 'bofp', size: 4, rounds: { '2024-08-20': 'Квалификация', '2024-08-21': 'Квалификация', '2024-08-27': 'Группы, 1-й тур', '2024-08-28': 'Группы, 1-й тур' }, mine: { team: ME.alliance, days: ['2024-08-21', '2024-08-28'] } },
  { code: 'ael', name: 'Alliance Europa League', short: 'Alliance EL', kind: 'Альянсы', icon: A + 'alliance-europe-league-avatar.webp', bg: A + 'alliance-europe-league-calendar.webp', stages: UEL_STAGES, days: ['2024-08-22'], pool: 'alliance', size: 10 },
  { code: 'acol', name: 'Alliance Conference League', short: 'Alliance ECL', kind: 'Альянсы', icon: A + 'alliance-conference-league-avatar.webp', bg: A + 'alliance-conference-league-calendar.webp', stages: UECL_STAGES, days: ['2024-08-22'], pool: 'alliance', size: 10 },
  { code: 'rnd', name: 'Random Cup', short: 'Random Cup', kind: 'Кубок', iconSvg: I.dice, bgTint: 'linear-gradient(120deg,#3b2a6b,#8a3d7a 55%,#d8914a)', stages: RANDOM_STAGES,
    days: ['2024-08-18', '2024-08-24'], pool: 'random', size: 16, mine: { team: ME.team, days: ['2024-08-18', '2024-08-24'] } },
];
const BIG5 = [
  { code: 'g5', color: 'Green', img: 'green-big-5', mine: { side: 'West', liga: 2, team: ME.team, place: 5 } },
  { code: 'r5', color: 'Red', img: 'red-big-5' },
  { code: 'y5', color: 'Yellow', img: 'yellow-big-5' },
  { code: 'b5', color: 'Blue', img: 'blue-big-5' },
];
const BIG5_START = '2024-08-12', BIG5_END = '2024-08-30';
const big5Tour = day => Math.round((at(day, '12:00') - at(BIG5_START, '12:00')) / 864e5) + 1;
const NIGHT_MINE = { lib: 'Стронгест' };

/* player's situation per tournament/day. BofP tournaments never have lineup problems. */
const STATUS = {
  'ucl|2024-08-21': { kind: 'predict' },
  'acl|2024-08-21': { kind: 'predict' },
  'bcl|2024-08-21': { kind: 'missed' },
  'rnd|2024-08-24': { kind: 'predict' },
  'acl|2024-08-28': { kind: 'predict' },
};
const statusFor = (id, day) => STATUS[`${id}|${day}`] || (id === 'g5' && day >= TODAY && day <= BIG5_END ? { kind: day === TODAY ? 'picked' : 'predict' } : null);
/* lineup auctions: the player is out of the squad; the auction runs on `day` and closes at `end`,
   the match itself starts a day after the auction closes */
const AUCTION_LIST = [
  { comp: 'lib', day: '2024-08-21', team: 'Сан-Паулу', matchDate: '2024-08-23', end: ['2024-08-22', '01:00'], night: true },
  { comp: 'ucl', day: '2024-08-26', team: 'Галатасарай', matchDate: '2024-08-27', end: ['2024-08-26', '21:00'] },
];
const AUCTIONS = AUCTION_LIST.reduce((o, a) => (o[a.day] = (o[a.day] || 0) + 1, o), {});
const alertDay = () => AUCTION_LIST.some(a => a.day === TODAY && at(...a.end) > now() && at(...a.end) - now() <= 864e5) ? TODAY : null;
const BUFFS = [
  { f: 'forward', t: 'Бафф «Нападающий»' }, { f: 'change-score', t: 'Бафф «Смена счёта»' },
  { f: 'shield-golden-double', t: 'Бафф «Двойной щит»' }, { f: 'card-red', t: 'Красная карточка', card: true },
];

/* tennis: real 125+ events of the window; the switch shows BofP players' points instead of sets */
/* BofP users who play the tennis events; shown instead of the real players when the switch is on */
const BOFP_USERS = ['Смусенко', 'Ахметов', 'Ким', 'Орлова', 'Жумабаев', 'Лисицына', 'Нурланов', 'Беляев', 'Сейткали', 'Гарипова', 'Томпсон', 'Мукашев', 'Руденко', 'Есенова',
  'Каримов', 'Полякова', 'Абдрахман', 'Чен', 'Дюсенов', 'Соколова', 'Иманбаев', 'Литвин', 'Оспанова', 'Гуревич', 'Тулегенов', 'Власова', 'Бекмуханов', 'Зайцева'];
const PLAYERS = {
  ATP: ['Я. Синнер', 'К. Алькарас', 'А. Зверев', 'Д. Медведев', 'Т. Фриц', 'К. Рууд', 'Н. Джокович', 'А. де Минаур', 'А. Рублёв', 'Г. Димитров', 'Т. Пол', 'Х. Хуркач',
    'Б. Шелтон', 'Х. Руне', 'С. Циципас', 'К. Хачанов', 'У. Умбер', 'Ф. Тиафо', 'С. Корда', 'Л. Музетти', 'А. Попырин', 'Ф. Коболли', 'Дж. Дрейпер', 'Ф. Оже-Альяссим',
    'Л. Сонего', 'Ф. Черундоло', 'А. Фильс', 'Т. Махач', 'И. Лехечка', 'Н. Харри', 'Б. Накашима', 'Ё. Нисиока'],
  WTA: ['И. Швёнтек', 'А. Соболенко', 'К. Гауфф', 'Е. Рыбакина', 'Я. Паолини', 'Чжэн Циньвэнь', 'Дж. Пегула', 'М. Андреева', 'Б. Крейчикова', 'Д. Коллинз', 'М. Киз',
    'Е. Остапенко', 'Д. Касаткина', 'Л. Самсонова', 'Э. Наварро', 'Б. Хаддад Майя', 'А. Калинская', 'Д. Векич', 'М. Вондроушова', 'Л. Носкова', 'Д. Шнайдер', 'К. Мухова',
    'В. Азаренко', 'Э. Свитолина', 'М. Костюк', 'Ю. Путинцева', 'А. Павлюченкова', 'Л. Фернандес', 'П. Бадоса', 'Э. Радукану', 'М. Саккари', 'Э. Мертенс'],
};
const TENNIS_PRICE = { 'WTA 125': 20000, 'Challenger 125': 20000, 'Challenger 175': 25000, 'ATP 250': 40000, 'WTA 250': 40000, 'ATP 500': 80000, 'WTA 500': 80000,
  'Masters 1000': 150000, 'WTA 1000': 150000, 'Grand Slam': 300000 };
const ROUND_SIZE = { 'Финал': 1, '1/2 финала': 2, '1/4 финала': 4, '1/8 финала': 8 };

/* ================= state ================= */
let REAL = { competitions: {}, days: {} }, CRESTS = {}, TEAM_IMG = {}, TENNIS = [];
const state = { day: TODAY, open: new Set(), mode: {}, big5Side: {}, lgOpen: new Set(), stage: {}, folded: new Set(['custom']), more: new Set(), pages: {}, sports: new Set(['foot', 'tennis']), drOpen: new Set(['g0']), drSport: 'foot', drQ: null };

/* favourites: long press on a card or a catalog row; kept in this browser only */
const FAV = (() => {
  try { const v = JSON.parse(localStorage.getItem('bofp-fav')) || {}; return { cards: new Set(v.cards || []), cat: new Map(v.cat || []) }; }
  catch (e) { return { cards: new Set(), cat: new Map() }; }
})();
const FAV_MAX = 15;
function saveFav() { try { localStorage.setItem('bofp-fav', JSON.stringify({ cards: [...FAV.cards], cat: [...FAV.cat] })); } catch (e) { /* private mode */ } }
function longPress(root, sel, fn) {
  let timer = 0, x = 0, y = 0, fired = false;
  const stop = () => clearTimeout(timer);
  root.addEventListener('pointerdown', e => {
    fired = false; // a re-rendered target never gets its click, so the flag must not outlive the next press
    const el = e.target.closest(sel);
    if (!el || e.button) return;
    x = e.clientX; y = e.clientY; stop();
    timer = setTimeout(() => { fired = true; if (navigator.vibrate) navigator.vibrate(15); fn(el); }, 550);
  });
  root.addEventListener('pointermove', e => { if (Math.hypot(e.clientX - x, e.clientY - y) > 10) stop(); });
  root.addEventListener('pointerup', stop);
  root.addEventListener('pointercancel', stop);
  // the tap that ends a long press must not also open the card
  root.addEventListener('click', e => { if (fired) { fired = false; e.stopPropagation(); e.preventDefault(); } }, true);
  root.addEventListener('contextmenu', e => { if (e.target.closest(sel)) e.preventDefault(); });
}

/* ================= helpers ================= */
const EXTRA_CRESTS = { 'Фенербахче': 'fenerbahce', 'Бешикташ': 'besiktasjk', 'Бенфика': 'sl-benfica', 'Порту': 'fc-porto', 'Аякс': 'ajax', 'Галатасарай': 'galatasaray-as' };
function crest(name) {
  if (TEAM_IMG[name]) return `<img class="crest-img team" src="${A}teams/${TEAM_IMG[name]}.webp" alt="" loading="lazy">`;
  if (CRESTS[name]) return `<img class="crest-img" src="${A}clubs/${CRESTS[name]}.webp" alt="" loading="lazy">`;
  const pair = name.includes(' / ');
  const w = name.replace(/[^\p{L}\p{N} /-]/gu, '').split(/[\s/-]+/).filter(Boolean);
  const ini = (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
  return `<span class="crest ${pair ? 'pair' : ''}" style="--h:${hash(name) % 360}" aria-hidden="true">${esc(ini)}</span>`;
}
const isMine = (m, team) => !!team && (m.home === team || m.away === team);
const shortRound = r => (r || '').replace(/,\s*\d-й матч/, '');
const mDate = (m, day) => m.date || day;

/* players' results on a real match must visibly differ from the real score */
function matchState(m, day, playersMode) {
  const st = rawState(m, day, playersMode);
  if (playersMode && !m.bofp && !m.tennis && st.score) {
    const real = rawState(m, day, false).score;
    if (real && real[0] === st.score[0] && real[1] === st.score[1]) st.score = [st.score[0] + 1, st.score[1]];
  }
  return st;
}
function rawState(m, day, playersMode) {
  const d = mDate(m, day), ko = at(d, m.kickoff), el = (now() - ko) / 60000;
  const long = m.tennis ? 150 : 112;
  let final = m.bofp || playersMode ? fakeScore((playersMode && !m.bofp ? 'p' : '') + m.id) : m.score;
  // tennis: real sets, or BofP players' points (0–100) when the switch is on
  if (m.tennis) final = playersMode ? tennisPts(m.id) : m.sets;
  if (d < TODAY || (d === TODAY && el > long)) return { s: 'done', score: final };
  if (d > TODAY || el < 0) return { s: 'sched' };
  if (m.tennis && playersMode) { const f = Math.min(1, el / long); return { s: 'live', min: 'Live', score: final.map(v => Math.round(v * f)) }; }
  if (m.tennis) return { s: 'live', min: 'Live', score: m.sets.slice(0, Math.min(m.sets.length, 1 + Math.floor(el / 45))) };
  const min = el <= 45 ? Math.max(1, Math.ceil(el)) : el < 60 ? 'Пер.' : Math.min(90, Math.ceil(el - 15));
  const cur = typeof min === 'number' ? min : 45;
  const score = (final || [0, 0]).map((g, k) => { let n = 0; for (let i = 0; i < g; i++) if (1 + hash(`${playersMode ? 'p' : ''}${m.id}|${k}|${i}`) % 90 <= cur) n++; return n; });
  return { s: 'live', min: typeof min === 'number' ? `${min}'` : min, score };
}

function tennisPts(id) {
  const a = 12 + hash(id + '|pa') % 89; let b = 12 + hash(id + '|pb') % 89;
  if (b === a) b = a > 50 ? a - 7 : a + 7;
  return [a, b];
}

function mergeReal(a, b) {
  const days = { ...a.days };
  for (const [d, list] of Object.entries(b.days || {})) days[d] = [...(days[d] || []), ...list].sort((x, y) => x.kickoff.localeCompare(y.kickoff));
  return { competitions: { ...a.competitions, ...b.competitions }, days };
}
function metaFor(code) {
  if (REAL_META[code]) return REAL_META[code];
  const c = REAL.competitions[code] || {};
  const s = c.season;
  let stages;
  if (code === 'lib' && s) stages = [...(s.extra || []).map((x, i, arr) => ({ n: x.n, f: x.f, t: x.t || x.f, ms: [], final: i === arr.length - 1 }))];
  else if (s && s.start) stages = league(s);
  else stages = [{ n: 'Сезон', f: '2024-08-01', t: '2025-05-31', ms: [], final: true }];
  return REAL_META[code] = { icon: code === 'lib' ? I.cup : I.ball, bg: c.flag, stages, short: code === 'lib' ? 'Либертадорес' : undefined, country: code === 'lib' ? 'КОНМЕБОЛ' : undefined };
}
const isNight = m => NIGHT_REAL.includes(m.comp) && m.kickoff < '06:00';
function realByComp(day, night) {
  const by = {};
  // a night match belongs to two days: the evening before (to make the pick) and its own calendar day
  const src = night ? [...(REAL.days[day] || []).filter(isNight).map(m => ({ ...m, date: day })), ...(REAL.days[addDays(day, 1)] || []).filter(isNight).map(m => ({ ...m, date: addDays(day, 1) }))]
    : (REAL.days[day] || []).filter(m => !isNight(m));
  for (const m of src) (by[m.comp] ||= []).push(m);
  return by;
}

function realCard(code, matches, day, night) {
  const c = REAL.competitions[code] || {}, meta = metaFor(code);
  let mineTeam = matches.some(m => isMine(m, ME.fanClub)) ? ME.fanClub : null;
  if (!mineTeam && NIGHT_MINE[code] && matches.some(m => isMine(m, NIGHT_MINE[code]))) mineTeam = NIGHT_MINE[code];
  matches = [...matches].sort((a, b) => isMine(b, mineTeam) - isMine(a, mineTeam) || (a.date || '').localeCompare(b.date || '') || a.kickoff.localeCompare(b.kickoff));
  return { id: code, type: 'real', sport: 'foot', night, name: c.name || code, short: meta.short || c.name || code,
    sub: [meta.country || c.country, shortRound(matches[0].round || c.stage)].filter(Boolean).join(' · '), iconSvg: meta.icon, flag: meta.bg, flagIcon: FLAGS[meta.bg] && !['eu', 'conmebol'].includes(meta.bg) ? meta.bg : null, stages: meta.stages, matches, mineTeam };
}

function big5Card(b, day, tour, night, base = day) {
  const struct = {};
  for (const side of ['West', 'East']) {
    struct[side] = [1, 2, 3].map(liga => {
      const forced = b.mine && b.mine.side === side && b.mine.liga === liga ? b.mine.team : null;
      const date = night ? addDays(base, 1) : undefined;
      const matches = pairUp(teamPool(`${b.code}${side}${liga}`, 20, forced), base + side + liga, b.times || ['15:00', '17:30', '20:00', '22:30'], `${b.code}${side[0]}${liga}`, `Тур ${tour}`, forced, date);
      return { liga, matches, mine: !!forced, team: forced };
    });
  }
  const sub = b.mine ? `${{ West: 'Wst', East: 'Est' }[b.mine.side]} · L${b.mine.liga} · Pls ${b.mine.place}` : `Лиги BofP · Тур ${tour}`;
  return { id: b.code, type: 'big5', sport: 'foot', night, name: `${b.color} BIG 5`, short: `${b.color} BIG 5`, sub, icon: `${A}${b.img}-logo.webp`, iconLogo: true,
    bg: `${A}${b.img}-calendar.webp`, stages: BIG5_STAGES, struct, mineTeam: b.mine ? b.mine.team : null, mineSide: b.mine && b.mine.side, color: b.color };
}

function tennisCards(day) {
  const out = [];
  for (const t of TENNIS) {
    const round = t.days && t.days[day];
    if (!round) continue;
    const n = ROUND_SIZE[round] || 8;
    const r = rng(t.id + day);
    const pool = [...(PLAYERS[t.tour] || PLAYERS.ATP)], players = [];
    while (players.length < n * 2 && pool.length) players.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
    const upool = [...BOFP_USERS], users = [];
    while (users.length < n * 2 && upool.length) users.push(upool.splice(Math.floor(r() * upool.length), 1)[0]);
    const matches = Array.from({ length: n }, (_, i) => {
      const id = `${t.id}-${day}-${i}`, rr = rng(id), three = rr() < .4, firstWins = rr() < .5;
      const set = w => { const lo = Math.floor(rr() * 5); return w ? [6, lo] : [lo, 6]; };
      const seq = three ? [firstWins, !firstWins, firstWins] : [firstWins, firstWins];
      return { id, comp: t.id, round, home: players[i * 2], away: players[i * 2 + 1], users: [users[i * 2], users[i * 2 + 1]], kickoff: ['17:00', '18:30', '20:00', '21:30', '23:00'][i % 5], tennis: true, sets: seq.map(set) };
    });
    const stages = Object.entries(t.days).sort().map(([d, rn], i, arr) => ({ n: rn, f: d, t: d, ms: [], final: i === arr.length - 1 && rn === 'Финал' }));
    if (!stages.length || stages[0].f > t.start) stages.unshift({ n: 'Старт турнира', f: t.start, t: t.start, ms: [`Сетка на ${t.drawSize || '—'} участников`, t.surface || ''].filter(Boolean) });
    if (!stages.some(s => s.final)) stages.push({ n: 'Финал', f: t.end, t: t.end, ms: [], final: true });
    const fresh = addDays(t.start, 3) >= TODAY; // just started or upcoming
    out.push({ fresh, join: day > TODAY && t.tour === 'ATP' ? TENNIS_PRICE[t.category] || 20000 : null, id: t.id, type: 'tennis', sport: 'tennis', name: `${t.tour} ${t.name}`, short: `${t.tour} ${t.nameRu || t.name}`, sub: `${t.category} · ${round}`,
      iconSvg: I.tennis, bgTint: t.tour === 'WTA' ? 'linear-gradient(120deg,#3b1450,#9a4fc0)' : 'linear-gradient(120deg,#0b2a5b,#2a73cf)', stages, matches, mineTeam: null });
  }
  return out;
}

const CUSTOM = [
  { id: 'u1', name: 'Кубок друзей Смусенко', sub: 'Приватный · 8 участников', take: 5 },
  { id: 'u2', name: 'Офисная лига Astana Hub', sub: 'По приглашению · 24 участника', take: 7 },
  { id: 'u3', name: 'Лига выходного дня', sub: 'Открытый · 112 участников', take: 4 },
  { id: 'u4', name: 'Кубок Бурабая', sub: 'Открытый · 64 участника', take: 3 },
  { id: 'u5', name: 'Степные волки', sub: 'Приватный · 12 участников', take: 5 },
  { id: 'u6', name: 'Лига экспертов', sub: 'Открытый · 240 участников', take: 6 },
  { id: 'u7', name: 'Кубок полуночников', sub: 'Открытый · 38 участников', take: 4 },
  { id: 'u8', name: 'Семейный кубок', sub: 'Приватный · 6 участников', take: 3 },
  { id: 'u9', name: 'Лига прогнозистов KZ', sub: 'Открытый · 510 участников', take: 7 },
  { id: 'u10', name: 'Кубок новичков', sub: 'Открытый · 90 участников', take: 4 },
];
function customCards(day) {
  const pool = [...(REAL.days[day] || [])].filter(m => !isNight(m));
  if (!pool.length) return [];
  return CUSTOM.map(c => {
    const r = rng(c.id + day), list = [...pool], matches = [];
    while (matches.length < Math.min(c.take, pool.length)) matches.push({ ...list.splice(Math.floor(r() * list.length), 1)[0] });
    matches.sort((a, b) => a.kickoff.localeCompare(b.kickoff));
    return { join: 1000, id: c.id, type: 'custom', sport: 'foot', name: c.name, short: c.name, sub: c.sub, iconSvg: I.user, stages: null, matches, mineTeam: null };
  });
}
const CACHE = new Map();
function tournamentsFor(day) {
  const key = day + [...state.sports].sort().join();
  if (!CACHE.has(key)) CACHE.set(key, buildTournaments(day));
  return CACHE.get(key);
}
function buildTournaments(day) {
  const out = { real: [], series: [], night: [] };
  const by = realByComp(day);
  const auctions = AUCTION_LIST.filter(a => a.day === day).map(a => {
    const m = (REAL.days[a.matchDate] || []).find(x => x.comp === a.comp && (x.home === a.team || x.away === a.team));
    if (!m) return null;
    const card = realCard(a.comp, [{ ...m, date: a.matchDate }], day, !!a.night);
    return Object.assign(card, { mineTeam: a.team, auction: { kind: 'squad', deadline: a.end } });
  }).filter(Boolean);
  const auctioned = new Set(auctions.map(c => c.id));
  for (const code of REAL_ORDER) if (by[code] && !auctioned.has(code)) out.real.push(realCard(code, by[code], day, false));
  out.real.push(...auctions.filter(c => !c.night));
  for (const t of BOFP) {
    if (!t.days.includes(day)) continue;
    const mineTeam = t.mine && t.mine.days.includes(day) ? t.mine.team : null;
    let teams, round, times;
    if (t.pool === 'bofp') { teams = pick(BOFP_TEAMS.map(x => x.name), t.rounds ? t.code + day : t.code, t.size, mineTeam || (t.rounds ? null : t.mine && t.mine.team)); round = (t.rounds && t.rounds[day]) || t.round || 'Плей-офф'; times = ['19:45', '22:00']; }
    else if (t.pool === 'random') { teams = teamPool('rnd', 16, ME.team); round = day === '2024-08-18' ? '1/16' : '1/8'; times = ['16:00', '18:30', '21:00']; }
    else { teams = ALLIANCE_TEAMS.slice(0, t.size); round = 'Плей-офф'; times = ['19:45', '22:00']; }
    out.series.push({ id: t.code, type: 'bofp', sport: 'foot', name: t.name, short: t.short, sub: `${t.kind} · ${round}`, icon: t.icon, iconLogo: t.iconLogo, iconSvg: t.iconSvg,
      bg: t.bg, bgTint: t.bgTint, stages: t.stages, matches: pairUp(teams, day + t.code, times, t.code, round, mineTeam, undefined, (statusFor(t.code, day) || {}).kind === 'missed' ? 'first' : 'last'), mineTeam });
  }
  if (day >= BIG5_START && day <= BIG5_END) for (const b of BIG5) out.series.push(big5Card(b, day, big5Tour(day), false));
  out.series.push(...tennisCards(day));
  const nb = day !== TODAY ? {} : realByComp(day, true);
  for (const code of NIGHT_REAL) if (nb[code] && !auctioned.has(code)) out.night.push(realCard(code, nb[code], day, true));
  if (day === TODAY) out.night.push(...auctions.filter(c => c.night));
  out.custom = customCards(day);
  const needs = c => { const k = (c.auction || statusFor(c.id, day) || {}).kind; return c.mineTeam && (k === 'predict' || k === 'squad') ? 1 : 0; };
  // only a pending action lifts a tournament; once the pick is made it goes back to its usual place
  const order = (a, b) => (b.sport === 'foot') - (a.sport === 'foot') || needs(b) - needs(a);
  for (const k in out) out[k] = out[k].filter(c => state.sports.has(c.sport)).sort(order);
  return out;
}
const allMatches = t => t.type === 'big5' ? [...t.struct.West, ...t.struct.East].flatMap(l => l.matches) : t.matches;
const everyCard = day => { const t = tournamentsFor(day); return [...t.real, ...t.series, ...t.night, ...t.custom]; };
function myMatch(t) { return t.mineTeam ? allMatches(t).find(m => isMine(m, t.mineTeam)) : null; }
function statusOf(t, day) { return t.auction || (t.mineTeam ? statusFor(t.id, day) : null); }
function actionOf(t, day) { const s = statusOf(t, day); return s && (s.kind === 'predict' || s.kind === 'squad') ? s.kind : null; }
function playerMatchCount(day) {
  const keep = new Set(state.sports); state.sports = new Set(['foot', 'tennis']);
  // a night match is counted on the evening before, not again on its own date
  const n = everyCard(day).reduce((k, x) => k + (x.mineTeam && !x.auction ? allMatches(x).filter(m => isMine(m, x.mineTeam) && !(x.night && mDate(m, day) === day)).length : 0), 0);
  state.sports = keep;
  return n;
}
function deadlineOf(t, day) {
  const s = statusOf(t, day), mm = myMatch(t);
  if (s && s.deadline) return at(...s.deadline);
  return mm ? at(mDate(mm, day), mm.kickoff) : at(day, '20:00');
}

/* ---------- chip in the middle of the row ---------- */
const coin = `<img class="coin" src="${A}buffs/coin.webp" alt="монет">`;
const fmtPrice = n => n >= 1e4 ? `${Math.round(n / 1e3)}к` : n.toLocaleString('ru-RU');
function actionChip(t, day) {
  if (t.join && day >= TODAY) return `<button class="act join" data-act="join" data-price="${t.join}"><span class="l">Вступить</span><span class="tm num">${coin}${fmtPrice(t.join)}</span></button>`;
  const st = statusOf(t, day);
  if (!st) return '';
  if (st.kind === 'predict') return `<button class="act predict" data-act="predict" data-deadline="${deadlineOf(t, day)}"><span class="l">${I.game}Прогноз</span><span class="tm num" data-left></span></button>`;
  if (st.kind === 'squad') return `<button class="act squad" data-act="squad" data-deadline="${deadlineOf(t, day)}"><span class="l">${I.gavel}Вне состава</span><span class="tm num" data-left></span></button>`;
  if (st.kind === 'picked') return `<span class="act picked"><span class="l">Прогноз сделан</span></span>`;
  return '';
}

/* ---------- timeline ---------- */
function timelineHTML(t, day) {
  const st = t.stages;
  const d0 = at(st[0].f), dN = at(st[st.length - 1].t, '23:59');
  const span = Math.max(1, dN - d0);
  const pct = x => Math.min(100, Math.max(0, (x - d0) / span * 100));
  const pos = st.map((s, i) => i === st.length - 1 ? 100 : pct(at(s.f)));
  for (let i = 1; i < pos.length; i++) if (pos[i] - pos[i - 1] < 8) pos[i] = Math.min(100, pos[i - 1] + 8);
  for (let i = pos.length - 2; i >= 0; i--) if (pos[i + 1] - pos[i] < 8) pos[i] = Math.max(0, pos[i + 1] - 8);
  // the "now" line uses the same spacing as the nodes, so it stops inside the right stage
  const nowT = Math.min(Math.max(now(), at(day, '00:00')), at(day, '23:59'));
  let here;
  if (nowT <= at(st[0].f)) here = pos[0] * (nowT - d0) / Math.max(1, at(st[0].f) - d0);
  else if (nowT >= at(st[st.length - 1].f)) here = 100;
  else {
    const i = st.findIndex((s, k) => k < st.length - 1 && nowT >= at(s.f) && nowT < at(st[k + 1].f));
    here = pos[i] + (pos[i + 1] - pos[i]) * (nowT - at(st[i].f)) / (at(st[i + 1].f) - at(st[i].f));
  }
  let cur = st.findIndex(s => nowT >= at(s.f) && nowT <= at(s.t, '23:59'));
  if (cur < 0) cur = Math.max(0, st.findIndex(s => at(s.f) > nowT) - 1);
  const picked = state.stage[t.id], act = !!actionOf(t, day);
  const nodes = st.map((s, i) => {
    const passed = at(s.t, '23:59') < nowT;
    const cls = ['tl-node', s.final ? 'final' : '', s.auction ? 'auction' : '', s.pause ? 'pause' : '', passed && i !== cur ? 'passed' : '', i === cur ? 'cur' : '', i === cur && act ? 'act' : ''].join(' ');
    return `<button class="${cls}" style="left:${pos[i].toFixed(2)}%" data-stage="${i}" aria-pressed="${i === picked}" aria-label="${esc(s.n)} ${ddmm(s.f)}"><i>${s.final ? I.trophy : s.auction ? I.gavel : ''}</i></button>`;
  }).join('');
  let card = '';
  if (picked != null) {
    const s = st[picked], dates = s.f === s.t ? ddmmyy(s.f) : `${ddmmyy(s.f)} — ${ddmmyy(s.t)}`;
    card = `<div class="tl-card"><div class="n"><span>${esc(s.n)}${picked === cur ? ' · сейчас' : ''}</span>${s.go ? `<button class="tl-go" data-go>Перейти${I.right}</button>` : ''}</div><div class="d num">${dates}</div>${s.ms.length ? `<ul>${s.ms.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>`;
  }
  return `<div class="tl" style="--w:${here.toFixed(2)}%"><div class="tl-track"><div class="tl-line"></div><div class="tl-fill"></div>${nodes}</div>
    <div class="tl-dates num"><span>${ddmm(st[0].f)}</span>${st[st.length - 1].auction ? `<span class="auc">${I.gavel}${ddmm(st[st.length - 1].f)}</span>` : `<span>${ddmm(st[st.length - 1].t)}</span>`}</div>${card}</div>`;
}

/* ---------- match row ---------- */
function buffFor(m, side) {
  if (!m.bofp || m.tennis) return null;
  const h = hash(m.id + '|buff');
  if (h % 100 > 55 || (h >>> 8) % 2 !== side) return null;
  return BUFFS[(h >>> 12) % BUFFS.length];
}
function matchRow(m, day, mineTeam, t, playersMode) {
  const me = isMine(m, mineTeam), ms = matchState(m, day, playersMode);
  const st = me ? statusOf(t, day) || {} : {};
  let time;
  if (ms.s === 'sched') time = mDate(m, day) !== day ? `<span class="m-time dated num"><b>${ddmm(mDate(m, day))}</b>${esc(m.kickoff)}</span>` : `<span class="m-time num">${esc(m.kickoff)}</span>`;
  else if (ms.s === 'live') time = `<span class="m-time live num"><i></i>${esc(ms.min)}</span>`;
  else time = `<span class="m-time num"></span>`;
  let score = '';
  if (ms.score) {
    const fin = ms.s === 'done';
    if (m.tennis && !playersMode) {
      const row = k => ms.score.map(([a, b]) => { const v = k ? b : a, o = k ? a : b; return `<span class="set ${fin && v < o ? 'lose' : ''}">${v}</span>`; }).join('');
      score = `<div class="m-sc num ${ms.s}"><span>${row(0)}</span><span>${row(1)}</span></div>`;
    } else {
      const [h, a] = ms.score;
      score = `<div class="m-sc num ${ms.s}"><span class="${fin && h < a ? 'lose' : ''}">${h}</span><span class="${fin && a < h ? 'lose' : ''}">${a}</span>${m.pens ? `<span class="pen">пен. ${m.pens.join(':')}</span>` : ''}</div>`;
    }
  }
  const won = k => { if (ms.s !== 'done' || !ms.score) return true; if (m.tennis && !playersMode) { const w = ms.score.filter(([a, b]) => (k ? b > a : a > b)).length; return w * 2 > ms.score.length; } return ms.score[k] >= ms.score[1 - k]; };
  const showBuffs = ms.s === 'live' && (m.bofp || playersMode);
  const team = (name, k) => {
    let extra = '';
    if (me && name === mineTeam && st.kind === 'missed') extra = `<img class="bf card" src="${A}buffs/card-yellow.webp" alt="Прогноз пропущен" title="Прогноз пропущен">`;
    else if (showBuffs) { const b = buffFor(playersMode && !m.bofp ? { ...m, bofp: true } : m, k); if (b) extra = `<img class="bf ${b.card ? 'card' : ''}" src="${A}buffs/${b.f}.webp" alt="${b.t}" title="${b.t}">`; }
    return `<div class="m-team ${won(k) ? '' : 'lose'}">${crest(name)}<span class="nm">${esc(name)}</span>${extra}</div>`;
  };
  const [hn, an] = m.tennis && playersMode && m.users ? m.users : [m.home, m.away];
  const body = `${time}<div class="m-teams">${team(hn, 0)}${team(an, 1)}</div>${score}`;
  if (!me) return `<div class="m ${ms.s}">${body}</div>`;
  let cta = '';
  if (ms.s === 'sched' && st.kind === 'predict') cta = `<button class="act predict" data-act="predict" data-deadline="${at(mDate(m, day), m.kickoff)}"><span class="l">${I.game}Сделать прогноз</span><span class="tm num" data-left></span></button>`;
  else if (ms.s === 'sched' && st.kind === 'squad') cta = `<button class="act squad" data-act="squad" data-deadline="${deadlineOf(t, day)}"><span class="l">${I.gavel}Вне состава</span><span class="tm num" data-left></span></button>`;
  return `<div class="m me ${ms.s}"><span class="ring" aria-hidden="true"></span>${body}${cta ? `<div class="me-cta">${cta}</div>` : ''}</div>`;
}

const SHOW = 5;
function listHTML(key, rows) {
  if (rows.length <= SHOW + 1) return rows.join('');
  const all = state.more.has(key);
  return (all ? rows : rows.slice(0, SHOW)).join('') + `<button class="more" data-more="${key}" aria-expanded="${all}">${all ? 'Свернуть' : `Показать все ${rows.length}`}${I.chevron}</button>`;
}
function big5Body(t, day) {
  const side = state.big5Side[t.id] || t.mineSide || 'West';
  const tabs = ['West', 'East'].map(s => `<button role="tab" data-side="${s}" aria-selected="${s === side}">${s}${t.mineSide === s ? '<span class="me-dot" aria-label="ваша конференция"></span>' : ''}</button>`).join('');
  const lgs = [...t.struct[side]].sort((a, b) => b.mine - a.mine).map(lg => {
    const key = `${t.id}|${side}|${lg.liga}`;
    const open = state.lgOpen.has(key) || (lg.mine && !state.lgOpen.has('x' + key));
    const live = lg.matches.filter(m => matchState(m, day).s === 'live').length;
    return `<section class="lg ${open ? 'open' : ''} ${lg.mine ? 'me' : ''}">
      <button class="lg-h" data-lg="${key}" aria-expanded="${open}"><span class="ico"><img src="${esc(t.icon)}" alt=""></span>
        <span class="nm">${t.color} BIG 5 ${side} — Лига ${lg.liga}</span>${countHTML(lg.matches.length, live)}${I.chevron}</button>
      <div class="lg-b"><div>${listHTML(key, lg.matches.map(m => matchRow(m, day, lg.team, t, false)))}<button class="row-link" data-table>${I.table}<span class="sp">Таблица</span>${I.right}</button></div></div></section>`;
  }).join('');
  return `<div class="seg" role="tablist">${tabs}</div>${lgs}`;
}
/* the switch: real results vs BofP players; national leagues start on BofP */
const CUP_CODES = ['usc', 'ucl', 'uel', 'uecl', 'lib'];
const modeOf = t => t.type !== 'real' && t.type !== 'tennis' ? false : t.id in state.mode ? state.mode[t.id] : t.type === 'real' && !CUP_CODES.includes(t.id) && !t.auction;
const countHTML = (n, live) => `<span class="cnt-wrap num">${n}${live ? `<b class="lv" aria-label="в эфире ${live}">${live}</b>` : ''}</span>`;

function cardHTML(t, day) {
  const open = state.open.has(t.id), real = t.type === 'real', playersMode = modeOf(t);
  const ms = allMatches(t), live = ms.filter(m => matchState(m, day, playersMode).s === 'live').length;
  let art = '';
  if (t.bg) art = `<img src="${esc(t.bg)}" alt="">`;
  else if (t.flag && FLAGS[t.flag]) art = FLAGS[t.flag];
  else if (t.bgTint) art = `<div style="background:${t.bgTint}"></div>`;
  const icon = t.flagIcon ? `<span class="flag-sq">${FLAGS[t.flagIcon]}</span>` : t.icon ? `<img class="${t.iconLogo ? 'logo' : ''}" src="${esc(t.icon)}" alt="">` : (t.iconSvg || I.ball);
  let body = '';
  if (open && t.type === 'custom') body = `<div class="matches">${listHTML(t.id, t.matches.map(m => matchRow(m, day, null, t, false)))}</div>`;
  else if (open) {
    if (real || t.type === 'tennis') body += `<div class="sw-row"><button class="sw" role="switch" data-sw aria-checked="${playersMode}" aria-label="Результаты игроков BofP"><span class="k">${playersMode ? `<img src="${A}switch-on.webp" alt="">` : I.globe}</span></button>
      <span class="sw-note ${playersMode ? 'on' : ''}">${playersMode ? 'Результаты игроков BofP' : 'Реальные результаты'}</span></div>`;
    body += timelineHTML(t, day);
    body += t.type === 'big5' ? big5Body(t, day)
      : `<div class="matches">${listHTML(t.id, t.matches.map(m => matchRow(m, day, t.mineTeam, t, playersMode)))}</div><button class="row-link" data-table>${I.table}<span class="sp">${t.type === 'tennis' ? 'Сетка турнира' : t.stages.length > 6 ? 'Сетка и таблица' : 'Таблица'}</span>${I.right}</button>`;
  }
  const act = actionOf(t, day);
  return `<article class="t ${t.type === 'custom' ? 'plain' : 'glass'} ${t.mineTeam ? 'mine' : ''} ${open ? 'open' : ''} ${real ? '' : 'series'} ${act === 'squad' ? 'alarm' : ''}" data-id="${t.id}" ${act ? `data-action="${act}"` : ''}>
    ${t.mineTeam ? '<span class="ring" aria-hidden="true"></span>' : ''}${act === 'squad' ? '<span class="t-run" aria-hidden="true"></span>' : ''}
    ${art ? `<div class="t-art" aria-hidden="true">${art}</div>` : ''}
    <div class="t-head" data-toggle>
      <button class="t-icon ${t.flagIcon ? 'is-flag' : ''}" data-screen aria-label="Открыть турнир ${esc(t.name)}">${icon}</button>
      <div class="t-main"><span class="t-tr"><span class="t-title" title="${esc(t.name)}">${esc(t.short)}</span>${FAV.cards.has(t.id) ? `<span class="fav-star" aria-label="В избранном">${I.star}</span>` : ''}${t.fresh ? '<span class="new">NEW</span>' : ''}</span><span class="t-meta">${esc(t.sub)}</span></div>
      <div class="t-act">${actionChip(t, day)}</div>
      <button class="t-rail" data-rail aria-expanded="${open}" aria-label="${open ? 'Свернуть' : 'Развернуть'}: ${esc(t.name)}${live ? `, в эфире ${live}` : ''}">${I.chevron}${countHTML(ms.length, live)}</button>
    </div>
    <div class="t-body"><div class="in">${body}</div></div>
  </article>`;
}

/* ================= render ================= */
const $ = s => document.querySelector(s);

function renderDates() {
  const items = ['<span class="pad" id="pad" aria-hidden="true"></span>'];
  for (let i = -7; i <= 7; i++) {
    const d = addDays(TODAY, i), past = d < TODAY, today = d === TODAY;
    const cnt = past ? 0 : playerMatchCount(d), auc = past ? 0 : AUCTIONS[d] || 0, alert = d === alertDay();
    let frame = '', badges = '';
    if (cnt || auc) {
      // the mask breaks the stroke under the top badge and under the gavel
      const tw = cnt > 9 ? 40 : 32, bw = auc > 1 ? 34 : 26;
      frame = `<svg class="frame" viewBox="0 0 60 62" aria-hidden="true"><defs><mask id="mk${i}"><rect x="-4" y="-4" width="68" height="70" fill="#fff"/>${cnt ? `<rect x="${30 - tw / 2}" y="-4" width="${tw}" height="9" fill="#000"/>` : ''}${auc ? `<rect x="${30 - bw / 2}" y="57" width="${bw}" height="9" fill="#000"/>` : ''}</mask></defs>
        <rect class="base" x="1" y="1" width="58" height="60" rx="15" mask="url(#mk${i})"/>${alert ? `<rect class="runner" x="1" y="1" width="58" height="60" rx="15" pathLength="200" mask="url(#mk${i})"/>` : ''}</svg>`;
      badges = `${cnt ? `<span class="top-b num">${I.game}${cnt}</span>` : ''}${auc ? `<span class="bot-b num">${I.gavel}${auc > 1 ? auc : ''}</span>` : ''}`;
    }
    const pastMine = past && playerMatchCount(d) ? '<span class="mine-dot"></span>' : '';
    const label = `${today ? 'Сегодня' : wd(d)}, ${ddmm(d)}${cnt ? `, ваших матчей: ${cnt}` : ''}${auc ? `, аукционов: ${auc}` : ''}${alert ? ', требуется действие' : ''}`;
    items.push(`<button class="day ${past ? 'past' : ''} ${today ? 'today' : ''} ${alert ? 'alert' : ''} ${cnt || auc ? 'framed' : ''}" role="tab" data-day="${d}" aria-selected="${d === state.day}" aria-label="${label}">
      ${frame}<span class="wd">${today ? 'Сегодня' : wd(d)}</span><span class="dd num">${ddmm(d)}</span>${badges}${pastMine}</button>`);
  }
  $('#dates').innerHTML = items.join('');
  movePad(false);
}
function movePad(animate) {
  const pad = $('#pad'), el = $(`#dates [data-day="${state.day}"]`);
  if (!pad || !el) return;
  pad.style.transition = animate ? '' : 'none';
  pad.style.transform = `translateX(${el.offsetLeft}px)`;
  if (!animate) { void pad.offsetWidth; pad.style.transition = ''; }
}
function renderSports() {
  $('#sports').innerHTML = [['foot', 'Футбол', I.ball], ['tennis', 'Теннис', I.tennis]]
    .map(([k, l, ic]) => `<button class="chip" data-sport="${k}" aria-pressed="${state.sports.has(k)}" aria-label="${l}" title="${l}">${ic}</button>`).join('');
}

function section(key, title, cards, day, icon, pre = '', page = 0) {
  const hot = cards.some(c => c.mineTeam && (statusOf(c, day) || allMatches(c).some(m => isMine(m, c.mineTeam))));
  const folded = state.folded.has(key);
  // long blocks open five at a time
  const shown = page ? Math.min(cards.length, page * (1 + (state.pages[key] || 0))) : cards.length;
  const more = shown < cards.length ? `<button class="more block" data-page="${key}">Показать ещё ${Math.min(page, cards.length - shown)}${I.chevron}</button>`
    : page && cards.length > page ? `<button class="more block" data-page="${key}" data-reset aria-expanded="true">Свернуть${I.chevron}</button>` : '';
  return `<button class="section-h ${hot ? 'hot' : ''}" data-fold="${key}" aria-expanded="${!folded}">${icon ? `<span class="ic">${icon}</span>` : ''}<span>${title}</span><span class="n num">${cards.length}</span><span class="rule"></span>${I.chevron}</button>
    <div class="cards" ${folded ? 'hidden' : ''}>${pre}${cards.slice(0, shown).map(x => cardHTML(x, day)).join('')}${more}</div>`;
}
function renderList() {
  const day = state.day, all = tournamentsFor(day), parts = [];
  // favourites leave their blocks and always open the list (copies: tournamentsFor is cached)
  const fav = [], t = {};
  for (const k of ['real', 'series', 'night', 'custom']) t[k] = all[k].filter(c => FAV.cards.has(c.id) ? (fav.push(c), false) : true);
  if (fav.length) parts.push(section('fav', 'Избранные', fav, day, I.star));
  if (t.real.length) parts.push(section('real', 'Турниры', t.real, day));
  if (t.series.length) parts.push(section('series', 'BofP Series', t.series, day));
  if (t.night.length) {
    const auction = t.night.some(c => actionOf(c, day) === 'squad');
    parts.push(section('night', auction ? 'Ночные турниры и аукцион' : 'Ночные турниры', t.night, day, auction ? `${I.moon}${I.gavel}` : I.moon));
  }
  parts.push(section('custom', 'Пользовательские', t.custom, day, I.user, `<button class="create" data-create>${I.plus}Создать турнир</button>`, 5));
  if (parts.length === 1) parts.unshift(`<p class="empty">${state.sports.size ? 'В этот день матчей нет.<br>Выберите другую дату в календаре.' : 'Выберите вид спорта: футбол или теннис.'}</p>`);
  $('#list').innerHTML = parts.join('');
  tick();
  requestAnimationFrame(updateHint);
}

function tick() {
  const n = now();
  document.querySelectorAll('[data-deadline]').forEach(el => { const o = el.querySelector('[data-left]'); if (o) o.textContent = fmtLeft(+el.dataset.deadline - n); });
}
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('show'), 2600);
}
function centerDay(smooth) {
  const nav = $('#dates'), el = nav.querySelector(`[data-day="${state.day}"]`);
  if (el) nav.scrollTo({ left: el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2, behavior: smooth ? 'smooth' : 'auto' });
}

/* ---------- "action below" hint ---------- */
function hiddenActions() {
  const sc = $('#scroll'), limit = sc.getBoundingClientRect().bottom - 96;
  return [...document.querySelectorAll('.t[data-action]')].filter(el => !el.offsetParent || el.getBoundingClientRect().top > limit);
}
function updateHint() {
  const below = hiddenActions(), btn = $('#hintDn');
  const kinds = new Set(below.map(el => el.dataset.action));
  const show = below.length > 0;
  btn.classList.toggle('show', show);
  $('#hintGlow').classList.toggle('show', show);
  btn.tabIndex = show ? 0 : -1;
  if (!show) return;
  const key = [...kinds].sort().join();
  if (btn.dataset.k !== key) {
    btn.dataset.k = key;
    btn.setAttribute('aria-label', kinds.has('squad') && kinds.has('predict') ? 'Ниже: прогноз и аукцион' : kinds.has('squad') ? 'Ниже: аукцион, попадите в состав' : 'Ниже: нужен прогноз');
    btn.innerHTML = `<span class="key"><span class="arr">${I.chevron}</span><span class="ics">${kinds.has('predict') ? I.game : ''}${kinds.has('squad') ? `<span class="gv">${I.gavel}</span>` : ''}</span></span>`;
  }
}

function findCard(id) { return everyCard(state.day).find(x => x.id === id); }
function rerenderCard(id, animate) {
  const data = findCard(id), old = document.querySelector(`.t[data-id="${id}"]`);
  if (!data || !old) return;
  const wasOpen = old.classList.contains('open');
  const tmp = document.createElement('div');
  tmp.innerHTML = cardHTML(data, state.day);
  const fresh = tmp.firstElementChild;
  if (animate && !wasOpen && state.open.has(id)) {
    fresh.classList.remove('open');
    old.replaceWith(fresh);
    requestAnimationFrame(() => requestAnimationFrame(() => fresh.classList.add('open')));
  } else if (animate && wasOpen && !state.open.has(id)) {
    old.classList.remove('open');
    old.querySelector('[data-rail]').setAttribute('aria-expanded', 'false');
    setTimeout(() => { const cur = document.querySelector(`.t[data-id="${id}"]`); if (cur && !state.open.has(id)) cur.replaceWith(fresh); tick(); updateHint(); }, 360);
  } else { if (old.classList.contains('open')) fresh.classList.add('still'); old.replaceWith(fresh); }
  tick();
  setTimeout(updateHint, 400);
}

/* ================= catalog drawer ================= */
const big5Tree = c => ({ t: c, img: `${A}${c.toLowerCase()}-big-5-logo.webp`, kids: ['West', 'East'].map(s => ({ t: s, kids: ['BIG 5 · Лига 1', 'BIG 5 · Лига 2', 'BIG 5 · Лига 3', 'BIG 5 Cup'] })) });
const groups = (L, n) => Array.from({ length: n }, (_, i) => `Группа ${L}${i + 1}`);
const CATALOG = {
  foot: [
    { g: 'BofP Series', items: [
      ...['Green', 'Red', 'Yellow', 'Blue'].map(big5Tree),
      { t: 'Random Cup', icon: I.dice },
      { t: 'Сборные Альянсов', icon: I.shield },
    ] },
    { g: 'Еврокубки', items: [
      { t: 'BofP Еврокубки', icon: I.crown, kids: ['BofP Champions League', 'BofP Europa League', 'BofP Conference League', 'BofP Super Cup'] },
      { t: 'Альянс Еврокубки', icon: I.shield, kids: ['Alliance Champions League', 'Alliance Europa League', 'Alliance Conference League'] },
      { t: 'УЕФА Еврокубки', flag: 'eu', kids: ['UEFA Champions League', 'UEFA Europa League', 'UEFA Conference League', 'UEFA Super Cup'] },
    ] },
    { g: 'Фан Клубы', items: [
      { t: 'Англия', flag: 'gb-eng', kids: ['АПЛ', 'Кубок Англии', 'Кубок Лиги', 'Суперкубок'] },
      { t: 'Испания', flag: 'es', kids: ['Ла Лига', 'Кубок Короля', 'Суперкубок'] },
      { t: 'Германия', flag: 'de', kids: ['Бундеслига', 'Кубок Германии'] },
      { t: 'Италия', flag: 'it', kids: ['Серия А', 'Кубок Италии'] },
      { t: 'Франция', flag: 'fr', kids: ['Лига 1', 'Кубок Франции'] },
      { t: 'Турция', flag: 'tr', kids: ['Суперлига', 'Кубок Турции'] },
      { t: 'Португалия', flag: 'pt', kids: ['Примейра', 'Кубок Португалии'] },
      { t: 'Бельгия', flag: 'be', kids: ['Про-лига', 'Кубок Бельгии'] },
      { t: 'Нидерланды', flag: 'nl', kids: ['Эредивизи', 'Кубок Нидерландов'] },
    ] },
    { g: 'Конфедерации — сборные', items: [
      { t: 'FIFA', icon: I.globe, kids: ['Чемпионат мира', 'Клубный чемпионат мира', 'Товарищеские матчи сборных'] },
      { t: 'UEFA', flag: 'eu', kids: ['Чемпионат Европы', { t: 'Лига наций УЕФА', kids: [
        { t: 'Лига A', kids: groups('A', 4) }, { t: 'Лига B', kids: groups('B', 4) }, { t: 'Лига C', kids: groups('C', 4) }, { t: 'Лига D', kids: groups('D', 2) }] }] },
      { t: 'CONMEBOL', flag: 'conmebol', kids: ['Кубок Америки', 'Кубок Либертадорес'] },
      { t: 'CONCACAF', icon: I.globe, kids: ['Золотой кубок КОНКАКАФ', { t: 'Лига наций КОНКАКАФ', kids: [{ t: 'Лига A', kids: groups('A', 2) }, { t: 'Лига B', kids: groups('B', 4) }, { t: 'Лига C', kids: groups('C', 2) }] }] },
      { t: 'AFC', icon: I.globe, kids: [{ t: 'Кубок Азии', kids: groups('', 6).map((g, i) => `Группа ${'ABCDEF'[i]}`) }] },
      { t: 'CAF', icon: I.globe, kids: ['Кубок африканских наций'] },
      { t: 'OFC', icon: I.globe, kids: ['Кубок наций ОФК'] },
    ] },
  ],
  tennis: [],
};
/* tennis tree from data/tennis-catalog.json: [name, 'dd.mm-dd.mm'] per event */
function tennisTree(c) {
  const ev = list => (list || []).map(([t, dt]) => ({ t, dt }));
  const a = c.atp || {}, w = c.wta || {};
  return [
    { g: 'Мужчины · ATP', items: [
      { t: 'Турниры Большого шлема', icon: I.crown, kids: ev(a.gs) },
      { t: 'ATP Masters 1000', icon: I.tennis, kids: ev(a.m1000) },
      { t: 'ATP 500', icon: I.tennis, kids: ev(a.a500) },
      { t: 'ATP 250', icon: I.tennis, kids: ev(a.a250) },
      { t: 'ATP Challenger', icon: I.tennis, kids: ['175', '125', '100', '75', '50'].map(k => ({ t: `Challenger ${k}`, kids: ev(a[`ch${k}`]) })) },
    ] },
    { g: 'Женщины · WTA', items: [
      { t: 'Турниры Большого шлема', icon: I.crown, kids: ev(w.gs) },
      { t: 'WTA 1000', icon: I.tennis, kids: ev(w.w1000) },
      { t: 'WTA 500', icon: I.tennis, kids: ev(w.w500) },
      { t: 'WTA 250', icon: I.tennis, kids: ev(w.w250) },
      { t: 'WTA 125', icon: I.tennis, kids: ev(w.w125) },
    ] },
  ];
}
const RATINGS = { foot: ['Рейтинг альянсов', 'Рейтинг игроков / отбор в сборные альянсов'], tennis: ['Теннисный рейтинг'] };
function treeHTML(items, key, depth, trail = []) {
  return items.map((it, i) => {
    const node = typeof it === 'string' ? { t: it } : it, k = `${key}.${i}`, has = !!(node.kids && node.kids.length);
    const path = [...trail, node.t];
    const open = state.drOpen.has(k);
    const lead = node.flag ? `<span class="fl">${FLAGS[node.flag]}</span>` : node.img ? `<span class="fl ic"><img src="${esc(node.img)}" alt=""></span>`
      : depth === 0 ? `<span class="fl ic"><span class="g">${node.icon || I.cup}</span></span>` : '';
    return `<button class="node d${Math.min(depth, 3)}" ${has ? `data-dnode="${k}" aria-expanded="${open}"` : 'data-leaf'} data-fk="${k}" data-path="${esc(path.join(' · '))}">${lead}<span class="tx">${node.sm ? `<span class="sm">${esc(node.sm)}</span>` : ''}<span class="nm">${esc(node.t)}</span></span>${FAV.cat.has(k) ? `<span class="fav-star">${I.star}</span>` : ''}${node.dt ? `<span class="dt num">${node.dt}</span>` : ''}${has ? I.chevron : I.right}</button>
      ${has ? `<div class="kids" ${open ? '' : 'hidden'}>${treeHTML(node.kids, k, depth + 1, path)}</div>` : ''}`;
  }).join('');
}
function favBand(sport) {
  const list = [...FAV.cat].filter(([k]) => k.startsWith(sport));
  if (!list.length) return '';
  return `<div class="band fav-band"><span>Избранные</span>${I.star}</div>${list.map(([k, path]) => {
    const parts = path.split(' · '), nm = parts.pop();
    return `<button class="node d0 fav-node" data-leaf data-fk="${k}" data-path="${esc(path)}"><span class="fl ic"><span class="g">${I.star}</span></span><span class="tx">${parts.length ? `<span class="sm">${esc(parts.join(' · '))}</span>` : ''}<span class="nm">${esc(nm)}</span></span>${I.right}</button>`;
  }).join('')}`;
}
/* catalog search: every node of both trees, keyed like the tree so favourites work from results too */
function catIndex() {
  const out = [];
  for (const sport of ['foot', 'tennis']) CATALOG[sport].forEach((g, gi) => {
    const walk = (items, key, trail) => items.forEach((it, i) => {
      const node = typeof it === 'string' ? { t: it } : it, k = `${key}.${i}`, path = [...trail, node.t];
      out.push({ k, path, sport, dt: node.dt });
      if (node.kids) walk(node.kids, k, path);
    });
    walk(g.items, `${sport}g${gi}`, []);
  });
  return out;
}
function searchHTML(q) {
  const s = q.trim().toLowerCase();
  if (!s) return '<p class="dr-note">Введите название турнира, серии, страны или города</p>';
  const hits = catIndex().filter(n => n.path[n.path.length - 1].toLowerCase().includes(s));
  if (!hits.length) return `<p class="dr-note">Ничего не найдено по запросу «${esc(q.trim())}»</p>`;
  return hits.slice(0, 60).map(n => {
    const nm = n.path[n.path.length - 1], ctx = [n.sport === 'foot' ? 'Футбол' : 'Теннис', ...n.path.slice(0, -1)].join(' · ');
    return `<button class="node d0 hit" data-leaf data-fk="${n.k}" data-path="${esc(n.path.join(' · '))}"><span class="tx"><span class="sm">${esc(ctx)}</span><span class="nm">${esc(nm)}</span></span>${FAV.cat.has(n.k) ? `<span class="fav-star">${I.star}</span>` : ''}${n.dt ? `<span class="dt num">${n.dt}</span>` : ''}${I.right}</button>`;
  }).join('');
}
function renderDrawer() {
  const sport = state.drSport, groups = CATALOG[sport];
  if (state.drQ != null) {
    $('#drawer').innerHTML = `<div class="dr-h dr-find"><span class="dr-in">${I.search}<input id="drQ" type="search" placeholder="Поиск турнира" autocomplete="off" value="${esc(state.drQ)}" aria-label="Поиск турнира"></span><button class="dr-cancel" data-qclose>Отмена</button></div>
      <div class="dr-body" id="drHits">${searchHTML(state.drQ)}</div>`;
    return;
  }
  $('#drawer').innerHTML = `<div class="dr-h"><h2>Все турниры</h2><button class="icon-btn" data-qopen aria-label="Поиск турнира">${I.search}</button><button class="icon-btn" data-close aria-label="Закрыть">${I.close}</button></div>
    <div class="seg dr-seg" role="tablist">${[['foot', 'Футбол'], ['tennis', 'Теннис']].map(([k, l]) => `<button role="tab" data-drsport="${k}" aria-selected="${k === sport}">${l}</button>`).join('')}</div>
    <div class="dr-body"><div class="dr-rank">${RATINGS[sport].map(r => `<button class="rk" data-rank>${I.rank}<span class="nm">${r}</span>${I.right}</button>`).join('')}</div>${favBand(sport)}${groups.map((g, gi) => {
      const key = `${sport}g${gi}`, open = !state.drOpen.has('x' + key);
      return `<button class="band" data-band="${key}" aria-expanded="${open}"><span>${esc(g.g)}</span>${I.chevron}</button><div ${open ? '' : 'hidden'}>${treeHTML(g.items, key, 0)}</div>`;
    }).join('')}</div>`;
}
function setDrawer(open) {
  $('#drawer').classList.toggle('show', open);
  $('#scrim').classList.toggle('show', open);
  $('#drawer').setAttribute('aria-hidden', !open);
  $('#catalogBtn').setAttribute('aria-expanded', open);
  if (open) { if (!$('#drawer').firstChild) renderDrawer(); setTimeout(() => $('#drawer [data-close]').focus({ preventScroll: true }), 50); }
}
/* expand in place so the list keeps its scroll position */
function toggleIn(btn, key, openKeyIsCollapse) {
  const box = btn.nextElementSibling, open = box.hidden;
  box.hidden = !open;
  btn.setAttribute('aria-expanded', open);
  const k = openKeyIsCollapse ? 'x' + key : key;
  (open !== openKeyIsCollapse) ? state.drOpen.add(k) : state.drOpen.delete(k);
}

/* ================= events ================= */
function toggleCardFav(head) {
  const id = head.closest('.t').dataset.id, on = !FAV.cards.has(id);
  if (on && FAV.cards.size >= FAV_MAX) return toast(`В избранное можно добавить до ${FAV_MAX} турниров`);
  on ? FAV.cards.add(id) : FAV.cards.delete(id);
  saveFav();
  toast(on ? 'Турнир добавлен в избранное' : 'Турнир убран из избранного');
  renderList();
  const el = document.querySelector(`.t[data-id="${id}"]`);
  if (el) { el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
}
function toggleCatFav(node) {
  const k = node.dataset.fk, on = !FAV.cat.has(k);
  if (on && FAV.cat.size >= FAV_MAX) return toast(`В избранное можно добавить до ${FAV_MAX} турниров`);
  on ? FAV.cat.set(k, node.dataset.path) : FAV.cat.delete(k);
  saveFav();
  toast(on ? 'Добавлено в избранное' : 'Убрано из избранного');
  // keep the pressed row under the finger while the favourites band grows or shrinks
  const row = `#drawer .node:not(.fav-node)[data-fk="${k}"]`, before = $(row) && $(row).getBoundingClientRect().top;
  const top = $('#drawer .dr-body').scrollTop;
  renderDrawer();
  const body = $('#drawer .dr-body');
  body.scrollTop = top;
  if (before != null && $(row)) body.scrollTop += $(row).getBoundingClientRect().top - before;
}
function bind() {
  longPress($('#list'), '.t-head', toggleCardFav);
  longPress($('#drawer'), '.node', toggleCatFav);
  $('#dates').addEventListener('click', e => {
    const b = e.target.closest('[data-day]');
    if (!b || b.dataset.day === state.day) return;
    $(`#dates [data-day="${state.day}"]`).setAttribute('aria-selected', 'false');
    b.setAttribute('aria-selected', 'true');
    state.day = b.dataset.day;
    state.open.clear();
    movePad(true);
    centerDay(true);
    renderList();
    $('#scroll').scrollTop = 0;
  });
  $('#sports').addEventListener('click', e => {
    const b = e.target.closest('[data-sport]');
    if (!b) return;
    const k = b.dataset.sport;
    state.sports.has(k) ? state.sports.delete(k) : state.sports.add(k);
    CACHE.clear();
    b.setAttribute('aria-pressed', state.sports.has(k));
    renderList();
  });
  $('#scroll').addEventListener('scroll', () => { cancelAnimationFrame(updateHint.r); updateHint.r = requestAnimationFrame(updateHint); }, { passive: true });
  $('#hintDn').addEventListener('click', () => {
    const el = hiddenActions()[0];
    if (!el) return;
    const box = el.parentElement;
    if (box.hidden) { box.hidden = false; const h = box.previousElementSibling; state.folded.delete(h.dataset.fold); h.setAttribute('aria-expanded', 'true'); }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  });

  $('#list').addEventListener('click', e => {
    const fold = e.target.closest('[data-fold]');
    if (fold) {
      const k = fold.dataset.fold, cards = fold.nextElementSibling;
      state.folded.has(k) ? state.folded.delete(k) : state.folded.add(k);
      cards.hidden = state.folded.has(k);
      fold.setAttribute('aria-expanded', !cards.hidden);
      updateHint();
      return;
    }
    if (e.target.closest('[data-create]')) { toast('Откроется мастер создания турнира'); return; }
    const pg = e.target.closest('[data-page]');
    if (pg) { const k = pg.dataset.page; state.pages[k] = pg.hasAttribute('data-reset') ? 0 : (state.pages[k] || 0) + 1; renderList(); return; }
    const card = e.target.closest('.t');
    if (!card) return;
    const id = card.dataset.id;
    const more = e.target.closest('[data-more]');
    if (more) { const k = more.dataset.more; state.more.has(k) ? state.more.delete(k) : state.more.add(k); rerenderCard(id); return; }
    const act = e.target.closest('[data-act]');
    if (act) { toast(act.dataset.act === 'predict' ? 'Откроется ввод прогноза на ваш матч' : act.dataset.act === 'join' ? `Вступление в турнир за ${(+act.dataset.price).toLocaleString('ru-RU')} монет` : 'Откроется аукцион: выкупите место в составе до дедлайна'); return; }
    if (e.target.closest('[data-screen]')) { if (!(window.TN && TN.openCard(findCard(id)))) toast(`Откроется экран турнира «${findCard(id).name}»`); return; }
    if (e.target.closest('[data-go]')) { if (!(window.TN && TN.openCard(findCard(id), 'auction'))) toast('Переход на страницу аукциона'); return; }
    if (e.target.closest('[data-sw]')) { state.mode[id] = !modeOf(findCard(id)); rerenderCard(id); return; }
    const node = e.target.closest('[data-stage]');
    if (node) { const k = +node.dataset.stage; state.stage[id] = state.stage[id] === k ? undefined : k; rerenderCard(id); return; }
    const seg = e.target.closest('[data-side]');
    if (seg) { state.big5Side[id] = seg.dataset.side; rerenderCard(id); return; }
    const lg = e.target.closest('[data-lg]');
    if (lg) {
      const key = lg.dataset.lg, sec = lg.closest('.lg'), isOpen = sec.classList.contains('open');
      if (isOpen) { state.lgOpen.delete(key); state.lgOpen.add('x' + key); } else { state.lgOpen.add(key); state.lgOpen.delete('x' + key); }
      sec.classList.toggle('open', !isOpen);
      lg.setAttribute('aria-expanded', !isOpen);
      return;
    }
    const tb = e.target.closest('[data-table]');
    if (tb) {
      // a BIG 5 league row opens its own league
      const lgKey = tb.closest('.lg') && tb.closest('.lg').querySelector('[data-lg]').dataset.lg.split('|');
      if (!(window.TN && TN.openCard(findCard(id), 'table', lgKey ? { side: lgKey[1], liga: +lgKey[2] } : {}))) toast('Таблица турнира — отдельный экран');
      return;
    }
    if (e.target.closest('[data-toggle]')) { state.open.has(id) ? state.open.delete(id) : state.open.add(id); delete state.stage[id]; rerenderCard(id, true); }
  });

  $('#catalogBtn').addEventListener('click', () => { if (state.drQ != null) { state.drQ = null; renderDrawer(); } setDrawer(true); });
  $('#scrim').addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#drawer').classList.contains('show')) { setDrawer(false); $('#catalogBtn').focus(); } });
  $('#drawer').addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { setDrawer(false); $('#catalogBtn').focus(); return; }
    if (e.target.closest('[data-qopen]')) { state.drQ = ''; renderDrawer(); $('#drQ').focus(); return; }
    if (e.target.closest('[data-qclose]')) { state.drQ = null; renderDrawer(); return; }
    const sp = e.target.closest('[data-drsport]');
    if (sp) { state.drSport = sp.dataset.drsport; renderDrawer(); return; }
    const band = e.target.closest('[data-band]');
    if (band) { toggleIn(band, band.dataset.band, true); return; }
    const dn = e.target.closest('[data-dnode]');
    if (dn) { toggleIn(dn, dn.dataset.dnode, false); return; }
    const rk = e.target.closest('[data-rank]');
    if (rk) { toast(`Откроется «${rk.querySelector('.nm').textContent}»`); return; }
    const leaf = e.target.closest('[data-leaf]');
    if (leaf) { if (window.TN && TN.openPath(leaf.dataset.path.split(' · '))) setDrawer(false); else toast(`Откроется экран турнира «${leaf.querySelector('.nm').textContent}»`); }
  });

  $('#tabbar').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    // every tab icon plays its own vector animation on tap
    b.classList.remove('play'); void b.offsetWidth; b.classList.add('play');
    clearTimeout(b._anim); b._anim = setTimeout(() => b.classList.remove('play'), 1200);
    if (b.dataset.tab !== 'cups' && b.dataset.tab !== 'wallet') toast(`«${b.getAttribute('aria-label')}» — отдельный экран`);
  });
  // the wallet is a separate screen, not built yet
  document.addEventListener('click', e => { if (e.target.closest('.balance')) toast('Переход в кошелёк — заглушка'); });
  $('#drawer').addEventListener('input', e => { if (e.target.id === 'drQ') { state.drQ = e.target.value; $('#drHits').innerHTML = searchHTML(state.drQ); } });
  $('#drawer').addEventListener('keydown', e => { if (e.target.id === 'drQ' && e.key === 'Escape') { e.stopPropagation(); state.drQ = null; renderDrawer(); } });
  $('#profileBtn').addEventListener('click', () => toast('Откроется профиль'));
  window.addEventListener('resize', () => { movePad(false); updateHint(); });
  setInterval(tick, 1000);
}

// the player's avatar: always in the header, a rounded square
const AVATAR = `<img src="${A}teams/t01.webp" alt="">`;
function renderChrome() {
  $('#catalogBtn').innerHTML = I.catalog;
  $('#searchBtn').innerHTML = I.search;
  $('#profileBtn').innerHTML = AVATAR;
  $('#tabbar').innerHTML = [['activity', 'Активность', I.activity], ['news', 'Новости', I.news], ['cups', 'Турниры', I.cupTab, true], ['wallet', 'Портфель', I.briefcase], ['menu', 'Меню', I.menu]]
    .map(([k, l, ic, cur]) => `<button class="tab" data-tab="${k}" ${cur ? 'aria-current="page"' : ''} aria-label="${l}">${ic}<span class="lb">${l}</span></button>`).join('');
  renderSports();
}

// light theme is parked for now: the prototype is dark only, whatever the device prefers
document.documentElement.dataset.theme = 'dark';

async function init() {
  renderChrome();
  const load = async (u, fb) => { try { const r = await fetch(u); if (!r.ok) throw new Error(r.status); return await r.json(); } catch (e) { console.warn(`${u} not loaded`, e); return fb; } };
  const [real, extra, crests, teams, tennis, tcat] = await Promise.all([
    load('data/real-matches.json', { competitions: {}, days: {} }), load('data/real-matches-extra.json', { competitions: {}, days: {} }),
    load('data/crests.json', {}), load('data/bofp-teams.json', []), load('data/tennis-calendar.json', { tournaments: [] }),
    load('data/tennis-catalog.json', {}),
  ]);
  CATALOG.tennis = tennisTree(tcat);
  REAL = mergeReal(real, extra);
  CRESTS = { ...EXTRA_CRESTS, ...crests };
  BOFP_TEAMS = teams;
  TEAM_IMG = Object.fromEntries(teams.map(t => [t.name, t.slug]));
  TENNIS = tennis.tournaments || [];
  renderDates();
  renderList();
  centerDay(false);
  bind();
}
init();
