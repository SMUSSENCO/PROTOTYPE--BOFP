'use strict';

/* ================= icons ================= */
const I = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
  table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 6h11M10 12h11M10 18h11"/><path d="M3.5 5 5 4v4M3.5 11.5h2.2l-2.2 2.5h2.2M3.5 17h2.2v4H3.5M3.8 19h1.9"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3zm0 4H6v1a2 2 0 0 0 1 1.7zm10 0v2.7A2 2 0 0 0 18 8V7z"/></svg>',
  ball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m12 7.5 4 2.9-1.5 4.7h-5L8 10.4z"/><path d="M12 7.5V3.2M16 10.4l4.2-1.3M14.5 15.1l2.6 3.6M9.5 15.1l-2.6 3.6M8 10.4 3.8 9.1"/></svg>',
  ucl: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 1.7 3.6 3.9.4-2.9 2.7.8 3.9L12 11.2l-3.5 1.9.8-3.9-2.9-2.7 3.9-.4z"/><path d="M4.5 13.5 6 16.6l3.4.4-2.5 2.3.7 3.4-3.1-1.7-3 1.7.7-3.4L-.3 17l3.4-.4z" transform="translate(2 -1) scale(.8)"/><path d="m19.5 13.5 1.5 3.1 3.4.4-2.5 2.3.7 3.4-3.1-1.7-3 1.7.7-3.4-2.5-2.3 3.4-.4z" transform="translate(-1 1) scale(.9)" opacity=".7"/></svg>',
  cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 13v4M8.5 20h7l-1-3h-5z"/></svg>',
  dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><g fill="currentColor" stroke="none"><circle cx="9" cy="9" r="1.4"/><circle cx="15" cy="15" r="1.4"/><circle cx="15" cy="9" r="1.4"/><circle cx="9" cy="15" r="1.4"/><circle cx="12" cy="12" r="1.4"/></g></svg>',
  /* custom auction gavel, filled so it reads at 16px */
  gavel: '<svg viewBox="0 0 24 24" fill="currentColor"><g transform="rotate(-42 11 9)"><rect x="5" y="5" width="11" height="6" rx="1.4"/><rect x="3.4" y="3.8" width="2.6" height="8.4" rx="1"/><rect x="15" y="3.8" width="2.6" height="8.4" rx="1"/><rect x="9.6" y="11" width="1.9" height="10" rx=".95"/></g><rect x="12" y="19.4" width="10" height="2.6" rx="1.3"/></svg>',
  coin: '<svg viewBox="0 0 24 24"><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4FF9A"/><stop offset="1" stop-color="#A9C21A"/></linearGradient></defs><circle cx="12" cy="12" r="11" fill="url(#cg)"/><circle cx="12" cy="12" r="8" fill="none" stroke="#141A03" stroke-opacity=".35" stroke-width="1.2"/><path d="M12 6.5 16.8 9.3v5.4L12 17.5l-4.8-2.8V9.3z" fill="#141A03" fill-opacity=".8"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.2-3.8 2.3-5 .3 1.6 1 2.4 1.9 2.8C11 8.5 11 6 12 3z"/></svg>',
  news: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
  cupTab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 13v4M8 20h8"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20c1.3-3.6 4-5 7.5-5s6.2 1.4 7.5 5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
};

/* flags used as the fading card backdrop for real competitions */
const FLAGS = {
  'gb-eng': '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="36" fill="#fff"/><path d="M26 0h8v36h-8zM0 14h60v8H0z" fill="#CE1124"/></svg>',
  es: '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="36" fill="#AA151B"/><rect y="9" width="60" height="18" fill="#F1BF00"/></svg>',
  it: '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="20" height="36" fill="#009246"/><rect x="20" width="20" height="36" fill="#fff"/><rect x="40" width="20" height="36" fill="#CE2B37"/></svg>',
  de: '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="12"/><rect y="12" width="60" height="12" fill="#DD0000"/><rect y="24" width="60" height="12" fill="#FFCE00"/></svg>',
  fr: '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="20" height="36" fill="#0055A4"/><rect x="20" width="20" height="36" fill="#fff"/><rect x="40" width="20" height="36" fill="#EF4135"/></svg>',
  eu: (() => {
    let s = '<svg viewBox="0 0 60 36" preserveAspectRatio="xMidYMid slice"><rect width="60" height="36" fill="#003399"/>';
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      s += `<circle cx="${(30 + Math.cos(a) * 11).toFixed(2)}" cy="${(18 + Math.sin(a) * 11).toFixed(2)}" r="1.6" fill="#FFCC00"/>`;
    }
    return s + '</svg>';
  })(),
};

/* ================= virtual clock: prototype lives on Wed 21 Aug 2024 ================= */
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

/* ================= player: the entities from the profile screen ================= */
const ME = {
  fanClub: 'Галатасарай',
  alliance: 'Eastern Green',
  team: 'Ұлы жүз',
};

/* ================= timelines (real stage dates of the 2024/25 season) ================= */
const UCL_STAGES = [
  { n: 'Квалификация', f: '2024-07-09', t: '2024-08-14', ms: ['Три раунда, путь чемпионов и путь лиг'] },
  { n: 'Плей-офф квалификации', f: '2024-08-20', t: '2024-08-28', ms: ['Победители проходят в общий этап (36 команд)', 'Проигравшие уходят в общий этап Лиги Европы'] },
  { n: 'Общий этап', f: '2024-09-17', t: '2025-01-29', ms: ['8 матчей против 8 разных соперников', 'Места 1–8 — сразу в 1/8 финала', 'Места 9–24 — стыковые матчи', 'Места 25–36 — выбывают'] },
  { n: 'Стыковые матчи', f: '2025-02-11', t: '2025-02-19', ms: ['Два матча, победитель — в 1/8'] },
  { n: '1/8 финала', f: '2025-03-04', t: '2025-03-12', ms: ['Жеребьёвка по сетке, без группы'] },
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
  { n: 'Финал · Вроцлав', f: '2025-05-28', t: '2025-05-28', ms: [], final: true },
];
const league = (start, end, rounds) => [
  { n: 'Старт сезона', f: start, t: start, ms: [`${rounds} туров`] },
  { n: 'Закрытие летнего окна', f: '2024-08-30', t: '2024-08-30', ms: ['Последний день трансферов до зимы'] },
  { n: 'Первый круг', f: start, t: '2024-12-22', ms: [] },
  { n: 'Зимнее окно', f: '2025-01-01', t: '2025-02-03', ms: [] },
  { n: 'Весенний круг', f: '2025-01-04', t: end, ms: [] },
  { n: 'Последний тур', f: end, t: end, ms: ['Чемпион, еврокубки, вылет'], final: true },
];
const BIG5_STAGES = [
  { n: 'Осенний круг', f: '2024-08-17', t: '2024-12-08', ms: ['7 туров, дома и в гостях', 'West и East играют в один день'] },
  { n: 'Зимняя пауза', f: '2024-12-09', t: '2025-01-17', ms: ['Трансферный аукцион открыт'] },
  { n: 'Весенний круг', f: '2025-01-18', t: '2025-05-11', ms: [] },
  { n: 'Стыки', f: '2025-05-17', t: '2025-05-18', ms: ['Топ-2 каждой лиги поднимаются выше', 'Два последних — вниз'] },
  { n: 'Суперфинал', f: '2025-05-25', t: '2025-05-25', ms: ['Чемпион West против чемпиона East'], final: true },
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
  usc: { icon: I.cup, bg: 'eu', stages: [{ n: 'Финал · Варшава', f: '2024-08-14', t: '2024-08-14', ms: ['Победитель ЛЧ против победителя ЛЕ'], final: true }], start: '2024-08-14', end: '2024-08-14' },
  ucl: { icon: I.ucl, bg: 'eu', stages: UCL_STAGES },
  uel: { icon: I.ucl, bg: 'eu', stages: UEL_STAGES },
  uecl: { icon: I.ucl, bg: 'eu', stages: UECL_STAGES },
  epl: { icon: I.ball, bg: 'gb-eng', stages: league('2024-08-16', '2025-05-25', 38) },
  laliga: { icon: I.ball, bg: 'es', stages: league('2024-08-15', '2025-05-25', 38) },
  seriea: { icon: I.ball, bg: 'it', stages: league('2024-08-17', '2025-05-25', 38) },
  bundesliga: { icon: I.ball, bg: 'de', stages: league('2024-08-23', '2025-05-17', 34) },
  ligue1: { icon: I.ball, bg: 'fr', stages: league('2024-08-16', '2025-05-17', 34) },
};
const REAL_ORDER = ['usc', 'ucl', 'uel', 'uecl', 'epl', 'laliga', 'seriea', 'bundesliga', 'ligue1'];

/* ================= BofP series: our own tournaments on the real calendar ================= */
const A = 'assets/';
const ALLIANCE_TEAMS = ['Eastern Green', 'Bosphorus Lions', 'Nordic Vikings', 'Iberian Bulls', 'Balkan Wolves', 'Samba Kings', 'Red Dragons', 'Alpine Eagles',
  'Baltic Storm', 'Celtic Pride', 'Danube Stars', 'Atlas Lions', 'Carpathian Bears', 'Aegean Sharks', 'Rhine Titans', 'Seine Royals', 'Thames Legion',
  'Volga Riders', 'Tagus Falcons', 'Andes Condors', 'Pampas Tigers', 'Sahara Hawks', 'Nile Kings', 'Steppe Riders'];
const P1 = ['Steppe', 'Nomad', 'Altai', 'Caspian', 'Tengri', 'Irtysh', 'Aral', 'Burabay', 'Khan', 'Saryarka', 'Zhetysu', 'Tobol', 'Ishim', 'Balkhash', 'Turan', 'Kokshe', 'Oxus', 'Pamir', 'Sayram', 'Emba', 'Baikonur', 'Silk Road'];
const P2 = ['Wolves', 'Eagles', 'Lions', 'Titans', 'Storm', 'Kings', 'Riders', 'Falcons', 'Sharks', 'Bears', 'Rockets', 'United', 'Stars', 'Hawks', 'Tigers', 'Legion'];

function teamPool(seed, n, forced) {
  const out = forced ? [forced] : [];
  let k = hash(seed);
  while (out.length < n) {
    const nm = `${P1[k % P1.length]} ${P2[(k >>> 7) % P2.length]}`;
    if (!out.includes(nm)) out.push(nm);
    k = Math.imul(k ^ (k >>> 13), 2654435761) >>> 0;
  }
  return out;
}
function fakeScore(id) {
  const h = hash(id), g = [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4];
  return [g[h % g.length], g[(h >>> 8) % g.length]];
}
function pairUp(teams, dayKey, times, comp, round, me) {
  // rotate pool so each round has different pairs, keep the player's team where requested
  const list = [...teams];
  const r = hash(dayKey) % (list.length - 1);
  const head = list.shift();
  for (let i = 0; i < r; i++) list.push(list.shift());
  list.unshift(head);
  const out = [];
  for (let i = 0; i < list.length / 2; i++) {
    const home = list[i], away = list[list.length - 1 - i];
    const id = `${comp}-${dayKey}-${i}`;
    out.push({ id, comp, round, home, away, kickoff: times[i % times.length], score: dayKey < TODAY ? fakeScore(id) : null, bofp: true });
  }
  const mine = m => (me && (m.home === me || m.away === me)) ? 1 : 0;
  return out.sort((a, b) => mine(b) - mine(a) || a.kickoff.localeCompare(b.kickoff));
}

const BOFP = [
  { code: 'bcl', name: 'BofP Champions League', short: 'BofP CL', kind: 'Фан-клубы', icon: A + 'bofp-champions-league-logo.webp', iconLogo: true, bg: A + 'bofp-champions-league-calendar.webp', stages: UCL_STAGES,
    days: ['2024-08-20', '2024-08-21', '2024-08-27', '2024-08-28'], clubs: true },
  { code: 'acl', name: 'Alliance Champions League', short: 'Alliance CL', kind: 'Альянсы', icon: A + 'alliance-champions-league-avatar.webp', bg: A + 'alliance-champions-league-calendar.webp', stages: UCL_STAGES,
    days: ['2024-08-20', '2024-08-21', '2024-08-27', '2024-08-28'], mine: { team: ME.alliance, days: ['2024-08-21', '2024-08-28'] } },
  { code: 'ael', name: 'Alliance Europe League', short: 'Alliance EL', kind: 'Альянсы', icon: A + 'alliance-europe-league-avatar.webp', bg: A + 'alliance-europe-league-calendar.webp', stages: UEL_STAGES, days: ['2024-08-22'] },
  { code: 'acol', name: 'Alliance Conference League', short: 'Alliance ECL', kind: 'Альянсы', icon: A + 'alliance-conference-league-avatar.webp', bg: A + 'alliance-conference-league-calendar.webp', stages: UECL_STAGES, days: ['2024-08-22'] },
  { code: 'rnd', name: 'Random Cup', short: 'Random Cup', kind: 'Кубок', iconSvg: I.dice, bgTint: 'linear-gradient(120deg,#3b2a6b,#8a3d7a 55%,#d8914a)', stages: RANDOM_STAGES,
    days: ['2024-08-18', '2024-08-24'], mine: { team: ME.team, days: ['2024-08-18', '2024-08-24'] } },
];
/* fan clubs that play BofP Champions League (crest slugs for clubs absent from the real August fixtures) */
const BCL_CLUBS = ['Галатасарай', 'Фенербахче', 'Бешикташ', 'Реал Мадрид', 'Барселона', 'Бавария', 'Боруссия Дортмунд', 'Ливерпуль',
  'Арсенал', 'Милан', 'Интер', 'Ювентус', 'ПСЖ', 'Бенфика', 'Порту', 'Аякс'];
const EXTRA_CRESTS = { 'Фенербахче': 'fenerbahce', 'Бешикташ': 'besiktasjk', 'Бенфика': 'sl-benfica', 'Порту': 'fc-porto', 'Аякс': 'ajax',
  'Боруссия Дортмунд': 'borussia-dortmund', 'Бавария': 'fc-bayern-munchen', 'ПСЖ': 'paris-saint-germain', 'Реал Мадрид': 'real-madrid',
  'Барселона': 'fc-barcelona', 'Ливерпуль': 'liverpool', 'Арсенал': 'arsenal', 'Милан': 'milan', 'Интер': 'inter', 'Ювентус': 'juventus', 'Галатасарай': 'galatasaray-as' };

const BIG5 = [
  { code: 'g5', color: 'Green', img: 'green-big-5', mine: { side: 'West', liga: 2, team: ME.team, place: 5 } },
  { code: 'r5', color: 'Red', img: 'red-big-5' },
  { code: 'y5', color: 'Yellow', img: 'yellow-big-5' },
  { code: 'b5', color: 'Blue', img: 'blue-big-5' },
];
const BIG5_DAYS = ['2024-08-17', '2024-08-24'];

/* the player's situation per tournament and day; BofP tournaments never have a lineup problem */
const STATUS = {
  'ucl|2024-08-21': { kind: 'predict' },
  'ucl|2024-08-27': { kind: 'squad', deadlineHm: '20:00', text: 'Фан-клуб не выставил тебя в состав. Открыт аукцион.' },
  'acl|2024-08-21': { kind: 'predict' },
  'acl|2024-08-28': { kind: 'predict' },
  'rnd|2024-08-24': { kind: 'predict' },
  'g5|2024-08-24': { kind: 'in' },
};
const AUCTION_DAYS = new Set(['2024-08-24', '2024-08-27']);
const ALERT_DAY = '2024-08-27';
const SHORT = { ucl: 'Лига чемпионов', usc: 'Суперкубок УЕФА', uel: 'Лига Европы', uecl: 'Лига конференций' };

/* ================= state ================= */
let REAL = null;
let CRESTS = {};
const state = { day: TODAY, open: new Set(), mode: {}, big5Side: {}, lgOpen: new Set(), stage: {}, stars: new Set(), folded: new Set() };

/* ================= helpers ================= */
function crest(name) {
  const slug = CRESTS[name];
  if (slug) return `<img class="crest-img" src="${A}clubs/${slug}.webp" alt="" loading="lazy">`;
  const w = name.replace(/[^\p{L}\p{N} -]/gu, '').split(/[\s-]+/).filter(Boolean);
  const ini = (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
  return `<span class="crest" style="--h:${hash(name) % 360}" aria-hidden="true">${esc(ini)}</span>`;
}
const isMine = (m, team) => !!team && (m.home === team || m.away === team);
const shortRound = r => (r || '').replace(/,\s*\d-й матч/, '');

/* scheduled / live / finished, with a live score that grows as the virtual clock runs */
function matchState(m, day, playersMode) {
  const ko = at(day, m.kickoff), el = (now() - ko) / 60000;
  const final = m.bofp || playersMode ? fakeScore((playersMode && !m.bofp ? 'p' : '') + m.id) : m.score;
  if (day < TODAY || (day === TODAY && el > 112)) return { s: 'done', score: final };
  if (day > TODAY || el < 0) return { s: 'sched' };
  const min = el <= 45 ? Math.max(1, Math.ceil(el)) : el < 60 ? 'HT' : Math.min(90, Math.ceil(el - 15));
  const cur = typeof min === 'number' ? min : 45;
  const score = (final || [0, 0]).map((g, k) => {
    let n = 0;
    for (let i = 0; i < g; i++) if (1 + hash(`${m.id}|${k}|${i}`) % 90 <= cur) n++;
    return n;
  });
  return { s: 'live', min, score };
}

function realMatchesFor(day) {
  const by = {};
  for (const m of (REAL && REAL.days[day]) || []) (by[m.comp] ||= []).push(m);
  return by;
}

function tournamentsFor(day) {
  const out = { real: [], series: [] };
  const by = realMatchesFor(day);
  for (const code of REAL_ORDER) {
    if (!by[code]) continue;
    const c = REAL.competitions[code] || {};
    const meta = REAL_META[code];
    const mineTeam = by[code].some(m => isMine(m, ME.fanClub)) ? ME.fanClub : null;
    const matches = [...by[code]].sort((a, b) => isMine(b, mineTeam) - isMine(a, mineTeam) || a.kickoff.localeCompare(b.kickoff));
    out.real.push({ id: code, type: 'real', name: c.name || code, short: SHORT[code] || c.name || code,
      sub: [c.country, shortRound(matches[0].round)].filter(Boolean).join(' · '),
      iconSvg: meta.icon, flag: meta.bg, stages: meta.stages, matches, mineTeam });
  }
  for (const t of BOFP) {
    if (!t.days.includes(day)) continue;
    const mineTeam = t.mine && t.mine.days.includes(day) ? t.mine.team : null;
    let teams, round, times;
    if (t.clubs) { teams = BCL_CLUBS; round = 'Плей-офф'; times = ['19:45', '22:00']; }
    else if (t.code === 'rnd') { teams = teamPool('rnd', 16, ME.team); round = day === '2024-08-18' ? '1/16' : '1/8'; times = ['16:00', '18:30', '21:00']; }
    else { teams = ALLIANCE_TEAMS.slice(0, t.code === 'acl' ? 12 : 10); round = 'Плей-офф'; times = ['19:45', '22:00']; }
    const matches = pairUp(teams, day + t.code, times, t.code, round, mineTeam);
    out.series.push({ id: t.code, type: 'bofp', name: t.name, short: t.short, sub: `${t.kind} · ${round}`, icon: t.icon, iconLogo: t.iconLogo, iconSvg: t.iconSvg,
      bg: t.bg, bgTint: t.bgTint, stages: t.stages, matches, mineTeam });
  }
  if (BIG5_DAYS.includes(day)) {
    const tour = BIG5_DAYS.indexOf(day) + 1;
    for (const b of BIG5) {
      const struct = {};
      for (const side of ['West', 'East']) {
        struct[side] = [1, 2, 3].map(liga => {
          const forced = b.mine && b.mine.side === side && b.mine.liga === liga ? b.mine.team : null;
          const matches = pairUp(teamPool(`${b.code}${side}${liga}`, 8, forced), day + side + liga, ['15:00', '17:30', '20:00'], `${b.code}${side[0]}${liga}`, `Тур ${tour}`, forced);
          return { liga, matches, mine: !!forced, team: forced };
        });
      }
      const mineTeam = b.mine ? b.mine.team : null;
      const sub = b.mine ? `${{ West: 'Wst', East: 'Est' }[b.mine.side]} · L${b.mine.liga} · Pls ${b.mine.place}` : `Лиги BofP · Тур ${tour}`;
      out.series.push({ id: b.code, type: 'big5', name: `${b.color} BIG 5`, short: `${b.color} BIG 5`, sub,
        icon: `${A}${b.img}-logo.webp`, iconLogo: true, bg: `${A}${b.img}-calendar.webp`, stages: BIG5_STAGES, struct, mineTeam,
        mineSide: b.mine && b.mine.side, color: b.color });
    }
  }
  const mineFirst = (a, b) => !!b.mineTeam - !!a.mineTeam;
  out.real.sort(mineFirst);
  out.series.sort(mineFirst);
  return out;
}
const allMatches = t => t.type === 'big5' ? [...t.struct.West, ...t.struct.East].flatMap(l => l.matches) : t.matches;

function playerMatchCount(day) {
  const t = tournamentsFor(day);
  return [...t.real, ...t.series].reduce((n, x) => n + (x.mineTeam ? allMatches(x).filter(m => isMine(m, x.mineTeam)).length : 0), 0);
}

function myMatch(t) { return t.mineTeam ? allMatches(t).find(m => isMine(m, t.mineTeam)) : null; }
function needsAction(t, day) { const st = t.mineTeam && STATUS[`${t.id}|${day}`]; return !!st && (st.kind === 'predict' || st.kind === 'squad'); }

/* ---------- chip in the middle of the row ---------- */
function actionChip(t, day) {
  const st = t.mineTeam && STATUS[`${t.id}|${day}`];
  if (!st) return '';
  const mm = myMatch(t);
  const ko = mm ? at(day, mm.kickoff) : at(day, '20:00');
  if (st.kind === 'predict') return `<button class="act predict" data-act="predict" data-deadline="${ko}"><span class="l">+ прогноз</span><span class="tm num" data-left></span></button>`;
  if (st.kind === 'squad') return `<button class="act squad" data-act="squad" data-deadline="${at(day, st.deadlineHm)}"><span class="l">Не в составе</span><span class="tm num" data-left></span></button>`;
  if (st.kind === 'in') return `<span class="act in">${I.check}<span class="l">В составе</span></span>`;
  return '';
}

/* ---------- timeline: white; accent only where an action is waiting ---------- */
function timelineHTML(t, day) {
  const st = t.stages;
  const start = at(st[0].f), end = at(st[st.length - 1].t);
  const span = Math.max(1, end - start);
  const nowT = at(day, '12:00');
  const pct = x => Math.min(100, Math.max(0, (x - start) / span * 100));
  const pos = st.map(s => pct(at(s.f)));
  for (let i = 1; i < pos.length; i++) if (pos[i] - pos[i - 1] < 8) pos[i] = Math.min(100, pos[i - 1] + 8);
  for (let i = pos.length - 2; i >= 0; i--) if (pos[i + 1] - pos[i] < 8) pos[i] = Math.max(0, pos[i + 1] - 8);
  let cur = st.findIndex(s => nowT >= at(s.f) && nowT <= at(s.t, '23:59'));
  if (cur < 0) cur = Math.max(0, st.findIndex(s => at(s.f) > nowT) - 1);
  const picked = state.stage[t.id];
  const act = needsAction(t, day);
  const nodes = st.map((s, i) => {
    const cls = ['tl-node', s.final ? 'final' : '', i === cur ? 'now' : (at(s.t, '23:59') < nowT ? 'passed' : ''), i === cur && act ? 'act' : ''].join(' ');
    return `<button class="${cls}" style="left:${pos[i]}%" data-stage="${i}" aria-pressed="${i === picked}" aria-label="${esc(s.n)}"><i>${s.final ? I.trophy : ''}</i></button>`;
  }).join('');
  let card = '';
  if (picked != null) {
    const s = st[picked];
    const dates = s.f === s.t ? ddmmyy(s.f) : `${ddmmyy(s.f)} — ${ddmmyy(s.t)}`;
    card = `<div class="tl-card"><div class="n">${esc(s.n)}${picked === cur ? ' · сейчас' : ''}</div><div class="d num">${dates}</div>${s.ms.length ? `<ul>${s.ms.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>`;
  }
  return `<div class="tl">
    <div class="tl-track"><div class="tl-line"></div><div class="tl-fill" style="width:${pct(nowT)}%"></div>${nodes}</div>
    <div class="tl-dates num"><span>${ddmm(st[0].f)}</span><span>${ddmm(st[st.length - 1].t)}</span></div>${card}
  </div>`;
}

/* ---------- match row: time/status top-right, score beside the teams ---------- */
function matchRow(m, day, mineTeam, t, playersMode) {
  const me = isMine(m, mineTeam);
  const ms = matchState(m, day, playersMode);
  let status, score = '';
  if (ms.s === 'sched') status = `<span class="m-st num">${esc(m.kickoff)}</span>`;
  else if (ms.s === 'live') status = `<span class="m-st live num"><i></i>${ms.min === 'HT' ? 'Перерыв' : ms.min + "'"}</span>`;
  else status = `<span class="m-st num">Завершён</span>`;
  if (ms.score) {
    const [h, a] = ms.score, fin = ms.s === 'done';
    score = `<div class="m-sc num ${ms.s}"><span class="${fin && h < a ? 'lose' : ''}">${h}</span><span class="${fin && a < h ? 'lose' : ''}">${a}</span>${m.pens ? `<span class="pen">пен. ${m.pens.join(':')}</span>` : ''}</div>`;
  }
  const lose = k => ms.s === 'done' && ms.score && ms.score[k] < ms.score[1 - k] ? 'lose' : '';
  const row = `${status}<button class="m-star" data-star="${esc(m.id)}" aria-pressed="${state.stars.has(m.id)}" aria-label="В избранное">${I.star}</button>
    <div class="m-teams"><div class="m-team ${lose(0)}">${crest(m.home)}<span>${esc(m.home)}</span></div><div class="m-team ${lose(1)}">${crest(m.away)}<span>${esc(m.away)}</span></div></div>${score}`;
  if (!me) return `<div class="m ${ms.s}">${row}</div>`;
  const st = ms.s === 'sched' ? STATUS[`${t.id}|${day}`] || {} : {};
  let cta = '';
  if (st.kind === 'predict') cta = `<button class="act predict" data-act="predict" data-deadline="${at(day, m.kickoff)}"><span class="l">+ прогноз</span><span class="tm num" data-left></span></button>`;
  else if (st.kind === 'squad') cta = `<button class="act squad" data-act="squad" data-deadline="${at(day, st.deadlineHm)}"><span class="l">Попасть в состав</span><span class="tm num" data-left></span></button><span class="hint">${esc(st.text)}</span>`;
  return `<div class="m me ${ms.s}">${row}${cta ? `<div class="me-cta">${cta}</div>` : ''}</div>`;
}

function big5Body(t, day) {
  const side = state.big5Side[t.id] || t.mineSide || 'West';
  const tabs = ['West', 'East'].map(s => `<button role="tab" data-side="${s}" aria-selected="${s === side}">${s}${t.mineSide === s ? '<span class="me-dot" aria-label="твоя конференция"></span>' : ''}</button>`).join('');
  const lgs = [...t.struct[side]].sort((a, b) => b.mine - a.mine).map(lg => {
    const key = `${t.id}|${side}|${lg.liga}`;
    const open = state.lgOpen.has(key) || (lg.mine && !state.lgOpen.has('x' + key));
    const live = lg.matches.filter(m => matchState(m, day).s === 'live').length;
    return `<section class="lg ${open ? 'open' : ''} ${lg.mine ? 'me' : ''}">
      <button class="lg-h" data-lg="${key}" aria-expanded="${open}"><span class="ico"><img src="${esc(t.icon)}" alt=""></span>
        <span class="nm">${t.color} BIG 5 ${side} — Лига ${lg.liga}</span>${countHTML(lg.matches.length, live)}${I.chevron}</button>
      <div class="lg-b"><div>${lg.matches.map(m => matchRow(m, day, lg.team, t, false)).join('')}<button class="row-link" data-table>${I.table}<span class="sp">Таблица</span>${I.right}</button></div></div></section>`;
  }).join('');
  return `<div class="seg" role="tablist">${tabs}</div>${lgs}`;
}

const countHTML = (n, live) => `<span class="cnt-wrap num">${live ? `${n}/<b class="lv">${live}</b>` : n}</span>`;

function cardHTML(t, day) {
  const open = state.open.has(t.id);
  const real = t.type === 'real';
  const playersMode = real && !!state.mode[t.id];
  const ms = allMatches(t);
  const live = ms.filter(m => matchState(m, day, playersMode).s === 'live').length;
  let art = '';
  if (t.bg) art = `<img src="${esc(t.bg)}" alt="">`;
  else if (t.flag) art = FLAGS[t.flag];
  else if (t.bgTint) art = `<div style="background:${t.bgTint}"></div>`;
  const icon = t.icon ? `<img class="${t.iconLogo ? 'logo' : ''}" src="${esc(t.icon)}" alt="">` : (t.iconSvg || I.ball);

  let body = '';
  if (open) {
    if (real) {
      body += `<div class="sw-row"><button class="sw" role="switch" data-sw aria-checked="${playersMode}" aria-label="Результаты игроков BofP"><span class="k">${playersMode ? `<img src="${A}switch-on.webp" alt="">` : I.globe}</span></button>
        <span class="sw-note ${playersMode ? 'on' : ''}">${playersMode ? 'Результаты игроков BofP' : 'Реальные результаты'}</span></div>`;
    }
    body += timelineHTML(t, day);
    body += t.type === 'big5' ? big5Body(t, day)
      : `<div class="matches">${t.matches.map(m => matchRow(m, day, t.mineTeam, t, playersMode)).join('')}</div><button class="row-link" data-table>${I.table}<span class="sp">${t.stages.length > 6 ? 'Сетка и таблица' : 'Таблица'}</span>${I.right}</button>`;
  }
  return `<article class="t glass ${t.mineTeam ? 'mine' : ''} ${open ? 'open' : ''} ${real ? '' : 'series'}" data-id="${t.id}">
    <div class="t-art" aria-hidden="true">${art}</div>
    <div class="t-head" data-toggle>
      <button class="t-icon" data-screen aria-label="Открыть турнир ${esc(t.name)}">${icon}</button>
      <div class="t-main"><span class="t-title" title="${esc(t.name)}">${esc(t.short)}</span><span class="t-meta">${esc(t.sub)}</span></div>
      <div class="t-act">${actionChip(t, day)}</div>
      <button class="t-rail" data-rail aria-expanded="${open}" aria-label="${open ? 'Свернуть' : 'Развернуть'}: ${esc(t.name)}${live ? `, в эфире ${live}` : ''}">${I.chevron}${countHTML(ms.length, live)}</button>
    </div>
    <div class="t-body"><div class="in">${body}</div></div>
  </article>`;
}

/* ================= render ================= */
const $ = s => document.querySelector(s);

function renderDates() {
  const nav = $('#dates');
  const items = ['<span class="pad glass" id="pad" aria-hidden="true"></span>'];
  for (let i = -7; i <= 7; i++) {
    const d = addDays(TODAY, i);
    const past = d < TODAY, today = d === TODAY;
    const cnt = past ? 0 : playerMatchCount(d);
    const alert = d === ALERT_DAY;
    let frame = '', badge = '';
    if (cnt) {
      const gavel = AUCTION_DAYS.has(d);
      // the mask cuts the stroke under the count (top) and under the gavel (bottom)
      frame = `<svg class="frame" viewBox="0 0 60 62" aria-hidden="true"><defs><mask id="mk${i}"><rect x="-4" y="-4" width="68" height="70" fill="#fff"/><rect x="21" y="-4" width="18" height="9" fill="#000"/>${gavel ? '<rect x="20" y="57" width="20" height="9" fill="#000"/>' : ''}</mask></defs>
        <rect class="base" x="1.3" y="1.3" width="57.4" height="59.4" rx="15" mask="url(#mk${i})"/>${alert ? `<rect class="runner" x="1.3" y="1.3" width="57.4" height="59.4" rx="15" pathLength="200" mask="url(#mk${i})"/>` : ''}</svg>`;
      badge = `<span class="cnt num">${cnt}</span>${gavel ? `<span class="gavel">${I.gavel}</span>` : ''}`;
    }
    const pastMine = past && playerMatchCount(d) ? '<span class="mine-dot"></span>' : '';
    const label = `${today ? 'Сегодня' : wd(d)}, ${ddmm(d)}${cnt ? `, твоих матчей: ${cnt}` : ''}${alert ? ', требуется действие' : ''}`;
    items.push(`<button class="day ${past ? 'past' : ''} ${today ? 'today' : ''} ${alert ? 'alert' : ''} ${cnt ? 'framed' : ''}" role="tab" data-day="${d}" aria-selected="${d === state.day}" aria-label="${label}">
      ${frame}<span class="wd">${today ? 'Сегодня' : wd(d)}</span><span class="dd num">${ddmm(d)}</span>${badge}${pastMine}</button>`);
  }
  nav.innerHTML = items.join('');
  movePad(false);
}

function movePad(animate) {
  const pad = $('#pad'), el = $(`#dates [data-day="${state.day}"]`);
  if (!pad || !el) return;
  pad.style.transition = animate ? '' : 'none';
  pad.style.transform = `translateX(${el.offsetLeft}px)`;
  if (!animate) { void pad.offsetWidth; pad.style.transition = ''; }
}

function section(key, title, cards, day, series) {
  const hot = cards.some(c => c.mineTeam || needsAction(c, day));
  const folded = state.folded.has(key);
  return `<button class="section-h ${hot ? 'hot' : ''}" data-fold="${key}" aria-expanded="${!folded}"><span>${title}</span><span class="n num">${cards.length}</span><span class="rule"></span>${I.chevron}</button>
    <div class="cards ${folded ? 'folded' : ''}" ${folded ? 'hidden' : ''}>${cards.map(x => cardHTML(x, day)).join('')}</div>`;
}

function renderList() {
  const day = state.day;
  const t = tournamentsFor(day);
  const parts = [];
  if (t.real.length) parts.push(section('real', 'Турниры', t.real, day));
  if (t.series.length) parts.push(section('series', 'BofP Series', t.series, day, true));
  if (!parts.length) parts.push(`<p class="empty">В этот день матчей нет.<br>Выбери другую дату в календаре.</p>`);
  $('#list').innerHTML = parts.join('');
  tick();
}

function tick() {
  const n = now();
  document.querySelectorAll('[data-deadline]').forEach(el => {
    const out = el.querySelector('[data-left]');
    if (out) out.textContent = fmtLeft(+el.dataset.deadline - n);
  });
}

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('show'), 2600);
}

function centerDay(smooth) {
  const nav = $('#dates');
  const el = nav.querySelector(`[data-day="${state.day}"]`);
  if (el) nav.scrollTo({ left: el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2, behavior: smooth ? 'smooth' : 'auto' });
}

function findCard(id) { const t = tournamentsFor(state.day); return [...t.real, ...t.series].find(x => x.id === id); }

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
    setTimeout(() => { const cur = document.querySelector(`.t[data-id="${id}"]`); if (cur && !state.open.has(id)) cur.replaceWith(fresh); }, 360);
  } else old.replaceWith(fresh);
  tick();
}

/* ================= events ================= */
function bind() {
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

  $('#list').addEventListener('click', e => {
    const fold = e.target.closest('[data-fold]');
    if (fold) {
      const k = fold.dataset.fold, cards = fold.nextElementSibling;
      state.folded.has(k) ? state.folded.delete(k) : state.folded.add(k);
      const f = state.folded.has(k);
      cards.hidden = f;
      fold.setAttribute('aria-expanded', !f);
      return;
    }
    const card = e.target.closest('.t');
    if (!card) return;
    const id = card.dataset.id;
    const act = e.target.closest('[data-act]');
    if (act) { toast(act.dataset.act === 'predict' ? 'Откроется ввод прогноза на твой матч' : 'Откроется аукцион: выкупи место в составе до дедлайна'); return; }
    if (e.target.closest('[data-screen]')) { toast(`Откроется экран турнира «${findCard(id).name}»`); return; }
    const sw = e.target.closest('[data-sw]');
    if (sw) { state.mode[id] = !state.mode[id]; rerenderCard(id); return; }
    const node = e.target.closest('[data-stage]');
    if (node) { const k = +node.dataset.stage; state.stage[id] = state.stage[id] === k ? undefined : k; rerenderCard(id); return; }
    const star = e.target.closest('[data-star]');
    if (star) {
      const k = star.dataset.star;
      state.stars.has(k) ? state.stars.delete(k) : state.stars.add(k);
      star.setAttribute('aria-pressed', state.stars.has(k));
      return;
    }
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
    if (e.target.closest('[data-table]')) { toast('Таблица турнира — отдельный экран'); return; }
    if (e.target.closest('[data-toggle]')) {
      state.open.has(id) ? state.open.delete(id) : state.open.add(id);
      rerenderCard(id, true);
    }
  });

  window.addEventListener('resize', () => movePad(false));
  setInterval(tick, 1000);
}

function renderChrome() {
  $('#searchBtn').innerHTML = I.search;
  $('.balance').insertAdjacentHTML('beforeend', I.coin);
  $('#tabbar').innerHTML = [
    ['Активность', I.activity, 1], ['Новости', I.news, 180], ['Турниры', I.cupTab, 0, true], ['Профиль', I.user, 2], ['Меню', I.menu, 0],
  ].map(([l, ic, bd, cur]) => `<button class="tab" ${cur ? 'aria-current="page"' : ''} aria-label="${l}">${ic}<span class="lb">${l}</span>${bd ? `<span class="bd num">${bd > 99 ? '99+' : bd}</span>` : ''}</button>`).join('');
  $('#searchBtn').addEventListener('click', () => toast('Поиск — отдельный экран, делаем позже'));
}

async function init() {
  renderChrome();
  const load = async (u, fb) => { try { const r = await fetch(u); if (!r.ok) throw new Error(r.status); return await r.json(); } catch (e) { console.error(`${u} failed to load`, e); return fb; } };
  [REAL, CRESTS] = await Promise.all([load('data/real-matches.json', { competitions: {}, days: {} }), load('data/crests.json', {})]);
  CRESTS = { ...EXTRA_CRESTS, ...CRESTS };
  renderDates();
  renderList();
  centerDay(false);
  bind();
}
init();
