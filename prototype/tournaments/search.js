/* Global search (header magnifier): tournaments, players, teams, fan clubs, national teams, alliance teams.
   Recent picks are kept per device. Uses globals from app.js: I, FLAGS, A, esc, toast, crest, CATALOG, catIndex,
   BOFP_TEAMS, ALLIANCE_TEAMS, CRESTS, TEAM_IMG; and TN (tournament.js) when it is there. */
(() => {
  const q = s => document.querySelector(s);
  const CATS = [['all', 'Все'], ['tour', 'Турниры'], ['player', 'Игроки'], ['team', 'Команды'], ['fan', 'Фан Клубы'], ['nat', 'Нац. сборные'], ['ally', 'Сборные альянсов']];
  const CAT_NAME = Object.fromEntries(CATS);
  const PLACEHOLDER = { all: 'Поиск по BofP', tour: 'Поиск турниров', player: 'Поиск игроков', team: 'Поиск команд', fan: 'Поиск фан-клубов', nat: 'Поиск сборных', ally: 'Поиск сборных альянсов' };
  const NATIONS = [['Казахстан', 'kz'], ['Франция', 'fr'], ['Бельгия', 'be'], ['Италия', 'it'], ['Турция', 'tr'], ['Хорватия', 'hr'], ['Испания', 'es'], ['Англия', 'gb-eng'], ['Чехия', 'cz'],
    ['Германия', 'de'], ['Португалия', 'pt'], ['Нидерланды', 'nl'], ['Аргентина', 'ar'], ['Бразилия', 'br'], ['Узбекистан', 'uz'], ['Грузия', 'ge'], ['Сербия', 'rs'], ['Польша', 'pl'], ['Швейцария', 'ch'], ['Дания', 'dk']];
  const KEY = 'bofp-recent';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(recent)); } catch (e) { /* private mode */ } };
  let recent = load() || [{ cat: 'tour', name: 'Alliance Champions League', sub: 'Еврокубки · Альянс Еврокубки', path: ['Альянс Еврокубки', 'Alliance Champions League'] }];
  const S = { cat: 'all', q: '' };

  let INDEX = null;
  function index() {
    if (INDEX) return INDEX;
    const out = [];
    // tournaments: catalog leaves, named with their context
    const all = catIndex(), parents = new Set(all.map(n => n.path.slice(0, -1).join('|')));
    for (const n of all) if (!parents.has(n.path.join('|'))) out.push({ cat: 'tour', name: n.path[n.path.length - 1], sub: n.path.slice(0, -1).join(' · ') || (n.sport === 'tennis' ? 'Теннис' : 'Футбол'), path: n.path });
    const ppl = window.TN ? TN.players() : [];
    for (const p of ppl) out.push({ cat: 'player', name: p.name, sub: p.team, team: p.team });
    for (const t of BOFP_TEAMS) out.push({ cat: 'team', name: t.name, sub: 'Команда BofP' });
    for (const n of Object.keys(CRESTS)) out.push({ cat: 'fan', name: n, sub: 'Фан-клуб' });
    for (const [n, f] of NATIONS) out.push({ cat: 'nat', name: n, sub: 'Национальная сборная', flag: f });
    for (const n of ALLIANCE_TEAMS) out.push({ cat: 'ally', name: n, sub: 'Сборная альянса' });
    return INDEX = out;
  }
  const icon = it => it.cat === 'nat' ? `<span class="sr-fl">${FLAGS[it.flag] || I.globe}</span>`
    : it.cat === 'tour' ? `<span class="sr-ic">${I.cup}</span>`
    : it.cat === 'player' ? `<span class="sr-av" style="--h:${hash(it.name) % 360}">${esc(it.name.split(' ').map(w => w[0]).join('').slice(0, 2))}</span>`
    : crest(it.name);
  const row = (it, i, rec) => `<div class="sr-row" ><button class="sr-go" data-pick="${i}" ${rec ? 'data-rec' : ''}>${icon(it)}<span class="tx"><b>${esc(it.name)}</b><small>${esc(CAT_NAME[it.cat])}${it.sub ? ` · ${esc(it.sub)}` : ''}</small></span></button>${rec ? `<button class="sr-x" data-drop="${i}" aria-label="Убрать из недавних">${I.close}</button>` : ''}</div>`;
  let shown = [];
  function results() {
    const qq = S.q.trim().toLowerCase();
    if (!qq) {
      shown = recent;
      return `<div class="sr-h"><h3>Недавние</h3>${recent.length ? '<button data-clear>Очистить</button>' : ''}</div>`
        + (recent.length ? `<div class="sr-list">${recent.map((it, i) => row(it, i, true)).join('')}</div>` : '<p class="sr-empty">Здесь появится то, что Вы открывали через поиск</p>');
    }
    const hits = index().filter(it => (S.cat === 'all' || it.cat === S.cat) && it.name.toLowerCase().includes(qq));
    if (!hits.length) { shown = []; return '<p class="sr-empty">Ничего не найдено</p>'; }
    if (S.cat !== 'all') { shown = hits.slice(0, 60); return `<div class="sr-list">${shown.map((it, i) => row(it, i)).join('')}</div>`; }
    shown = [];
    return CATS.slice(1).map(([k, l]) => {
      const part = hits.filter(h => h.cat === k).slice(0, 4);
      if (!part.length) return '';
      const html = `<div class="sr-h"><h3>${l}</h3><button data-scat="${k}">Все ${hits.filter(h => h.cat === k).length}</button></div><div class="sr-list">${part.map(it => row(it, shown.length + part.indexOf(it))).join('')}</div>`;
      shown.push(...part);
      return html;
    }).join('');
  }
  function render() {
    q('#srch').innerHTML = `<div class="sr-top"><button class="ib" data-sback aria-label="Назад">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>'}</button>
      <label class="sr-in">${I.search}<input id="srQ" type="search" autocomplete="off" placeholder="${PLACEHOLDER[S.cat]}" value="${esc(S.q)}"></label></div>
      <div class="sr-cats" role="tablist">${CATS.map(([k, l]) => `<button role="tab" data-scat="${k}" aria-selected="${S.cat === k}">${l}</button>`).join('')}</div>
      <div class="sr-res" id="srRes">${results()}</div>`;
  }
  const refresh = () => { q('#srRes').innerHTML = results(); };
  function show(on) {
    q('#srch').hidden = !on;
    document.documentElement.classList.toggle('on-srch', on);
    if (on) { render(); setTimeout(() => q('#srQ') && q('#srQ').focus(), 50); }
  }
  function choose(it) {
    recent = [it, ...recent.filter(x => !(x.cat === it.cat && x.name === it.name))].slice(0, 10); save();
    if (it.cat === 'tour' && window.TN && TN.openPath(it.path)) { show(false); return; }
    toast(it.cat === 'tour' ? `Откроется экран турнира «${it.name}»` : `Откроется профиль «${it.name}»`);
    refresh();
  }
  function bind() {
    q('#searchBtn').addEventListener('click', () => show(true));
    const root = q('#srch');
    root.addEventListener('input', e => { if (e.target.id === 'srQ') { S.q = e.target.value; refresh(); } });
    root.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const d = b.dataset;
      if (d.sback != null) return show(false);
      if (d.scat) { S.cat = d.scat; const sx = q('.sr-cats').scrollLeft; render(); q('.sr-cats').scrollLeft = sx; return; }
      if (d.clear != null) { recent = []; save(); return refresh(); }
      if (d.drop != null) { recent.splice(+d.drop, 1); save(); return refresh(); }
      if (d.pick != null) return choose(shown[+d.pick]);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !q('#srch').hidden) show(false); });
    q('#tabbar').addEventListener('click', e => { if (e.target.closest('[data-tab]')) show(false); });
  }
  const wait = setInterval(() => {
    if (typeof I === 'undefined' || typeof catIndex !== 'function' || !q('#srch') || !q('#searchBtn')) return;
    clearInterval(wait);
    bind();
    window.Search = { show };
  }, 50);
})();
