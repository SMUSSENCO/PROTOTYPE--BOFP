// Visual + behaviour checks for prototype/tournaments. Run: npm test
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');

const ROOT = path.join(__dirname, '..', 'prototype', 'tournaments');
const SHOTS = path.join(__dirname, '__screenshots__');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp' };
// same wrapper the artifact host adds around the page
const wrap = body => `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>${body}</body></html>`;

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f)) { rsp.writeHead(404); return rsp.end(); }
      let body = fs.readFileSync(f);
      if (p === '/index.html') body = wrap(body.toString());
      rsp.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
      rsp.end(body);
    }).listen(0, () => res(srv));
  });
}

const results = [];
async function check(name, fn) {
  try { await fn(); results.push(['ok', name]); } catch (e) { results.push(['FAIL', name, e.message.split('\n')[0]]); }
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const srv = await serve();
  const url = `http://localhost:${srv.address().port}/`;
  const browser = await chromium.launch();

  for (const vp of [{ width: 390, height: 844 }, { width: 360, height: 740 }]) {
    const tag = `${vp.width}`;
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2, reducedMotion: 'reduce', ignoreHTTPSErrors: true, colorScheme: 'dark' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    // only our own files count; third-party font hosts can be unreachable in sandboxes
    page.on('console', m => m.type() === 'error' && (m.location().url || '').startsWith(url) && errors.push(m.text()));
    page.on('requestfailed', r => r.url().startsWith(url) && errors.push(`${r.url()} ${r.failure().errorText}`));
    page.on('response', r => r.url().startsWith(url) && r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
    await page.goto(url + '?notour');
    await page.waitForSelector('.t');
    await page.evaluate(() => document.fonts.ready);
    const box = sel => page.locator(sel).first().boundingBox();
    const ACCENT = 'rgb(255, 210, 63)';
    const day = async d => { await page.locator(`.day[data-day="${d}"]`).click(); await page.waitForTimeout(150); };

    await check(`[${tag}] no console errors or missing files`, async () => assert.deepEqual(errors, [], errors.join(' | ')));

    await check(`[${tag}] page never scrolls sideways`, async () => {
      const o = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth, document.querySelector('.scroll').scrollWidth, document.querySelector('.scroll').clientWidth]);
      assert.ok(o[0] <= o[1] && o[2] <= o[3], JSON.stringify(o));
    });

    await check(`[${tag}] header: catalog + search left, balance with coin + profile right, no title`, async () => {
      const c = await box('#catalogBtn'), s = await box('#searchBtn'), b = await box('.balance'), p = await box('#profileBtn');
      assert.ok(c.x < 24 && s.x > c.x && s.x < vp.width / 2, 'left group');
      assert.ok(Math.abs(p.x + p.width - (vp.width - 16)) < 2 && b.x + b.width < p.x, 'right group');
      assert.equal(await page.locator('.header h1').count(), 0, 'screen title must be gone');
      assert.match(await page.locator('.balance img').getAttribute('src'), /coin\.webp$/);
    });

    await check(`[${tag}] tab bar: portfolio instead of profile, no badges`, async () => {
      const labels = await page.locator('.tab').evaluateAll(t => t.map(x => x.getAttribute('aria-label')));
      assert.deepEqual(labels, ['Активность', 'Новости', 'Турниры', 'Портфель', 'Меню']);
      assert.equal(await page.locator('.tabbar .bd').count(), 0);
    });

    await check(`[${tag}] calendar: glass tile under the day, slides on select`, async () => {
      assert.equal(await page.locator('.day').count(), 15);
      const pad = await box('#pad'), t = await box('.day.today');
      assert.ok(Math.abs(pad.x - t.x) < 1);
      assert.ok(Math.abs(t.x + t.width / 2 - vp.width / 2) < 4, 'today not centred');
      await day('2024-08-22'); await page.waitForTimeout(450);
      assert.ok(Math.abs((await box('#pad')).x - (await box('.day[data-day="2024-08-22"]')).x) < 1, 'pad did not follow');
      await day('2024-08-21'); await page.waitForTimeout(450);
    });

    await check(`[${tag}] frames: thin glowing line, game icon + count on top, gavel (+count) below`, async () => {
      const sw = await page.locator('.frame .base').first().evaluate(e => parseFloat(getComputedStyle(e).strokeWidth));
      assert.ok(sw <= 1.8, `stroke ${sw}`);
      assert.match(await page.locator('.frame').first().evaluate(e => getComputedStyle(e).animationName), /breathe|none/);
      assert.equal(await page.locator('.day[data-day="2024-08-24"] .top-b svg').count(), 1, 'game icon missing');
      const d26 = page.locator('.day[data-day="2024-08-26"]');
      assert.equal(await d26.locator('.frame').count(), 1, 'auction day must be framed');
      assert.equal(await d26.locator('.bot-b svg').count(), 1, 'gavel missing');
      assert.equal((await d26.locator('.bot-b').innerText()).trim(), '', 'single auction shows no number');
      assert.equal(await page.locator('.day.alert .runner').count(), 1);
      assert.equal(await page.locator('.day.past .frame').count(), 0);
    });

    await check(`[${tag}] sport chips filter the list`, async () => {
      const tennis = page.locator('[data-sport="tennis"]');
      assert.ok(await page.locator('.t[data-id^="atp-"], .t[data-id^="wta-"]').count() > 0, 'no tennis events');
      assert.ok(await page.locator('.t[data-id="atp-us-open-2024"] .t-tr .new').count() === 1, 'new tennis event without the NEW badge');
      assert.equal(await page.locator('.t[data-id="atp-cincinnati-2024"] .new').count(), 0, 'old event marked NEW');
      await tennis.click();
      assert.equal(await tennis.getAttribute('aria-pressed'), 'false');
      assert.equal(await page.locator('.t[data-id^="atp-"], .t[data-id^="wta-"]').count(), 0, 'tennis still listed');
      await page.locator('[data-sport="foot"]').click();
      assert.match(await page.locator('.empty').innerText(), /вид спорта/);
      await page.locator('[data-sport="foot"]').click(); await tennis.click();
      const b = await box('[data-sport="foot"]');
      assert.ok(b.height <= 36 && b.height >= 30, `chip ${b.height}`);
      assert.equal((await page.locator('#sports').innerText()).trim(), '', 'chips must be icons only');
    });

    await check(`[${tag}] card row: one-line title, centred pastel chip, count + red live box without slash`, async () => {
      for (const el of await page.locator('.t-title').all()) { const b = await el.boundingBox(); if (b) assert.ok(b.height < 22, 'title wraps'); }
      const ucl = page.locator('.t[data-id="ucl"]');
      const head = await ucl.locator('.t-head').boundingBox(), a = await ucl.locator('.t-act .act').boundingBox();
      assert.ok(Math.abs(a.y + a.height / 2 - (head.y + head.height / 2)) < 2);
      const txt = await ucl.locator('.t-act .act').innerText();
      assert.match(txt, /Прогноз[\s\S]*\d{2}:\d{2}:\d{2}/i); assert.doesNotMatch(txt, /\+/);
      assert.match(await ucl.locator('.act.predict').evaluate(e => getComputedStyle(e).backgroundImage), /gradient/, 'button is not raised');
      assert.match(await page.locator('.balance').innerText(), /10,4 М/);
      const rail = (await ucl.locator('.t-rail .cnt-wrap').innerText()).replace(/\s/g, '');
      assert.match(rail, /^\d+\d$/); assert.doesNotMatch(rail, /\//);
      assert.ok((await ucl.locator('.t-rail').boundingBox()).width <= 54.5);
      for (const r of await page.locator('.t-rail').all()) { const b = await r.boundingBox(); if (b) assert.ok(Math.abs(b.x + 54 - vp.width) < 1.5, 'rail misaligned'); }
    });

    await check(`[${tag}] domestic leagues show a square flag as their icon`, async () => {
      await day('2024-08-17');
      const f = page.locator('.t[data-id="epl"] .t-icon .flag-sq');
      assert.equal(await f.count(), 1);
      const b = await f.boundingBox();
      assert.ok(Math.abs(b.width - b.height) < 1, 'flag is not square');
      assert.equal(await page.locator('.t[data-id="ucl"] .flag-sq').count(), 0, 'UEFA cups keep their own icon');
      await day('2024-08-21');
    });

    await check(`[${tag}] every open prediction still has time left`, async () => {
      for (const t of await page.locator('.act.predict .tm').allInnerTexts()) assert.notEqual(t.trim(), '00:00:00');
    });

    await check(`[${tag}] missed pick today: chip + yellow card next to my team`, async () => {
      const bcl = page.locator('.t[data-id="bcl"]');
      assert.doesNotMatch(await page.locator('#list').innerText(), /Пропуск/);
      assert.equal(await bcl.locator('.t-act .act').count(), 0);
      assert.match(await page.locator('.t[data-id="g5"] .act.picked').innerText(), /Прогноз сделан/);
      assert.equal(await bcl.locator('.t-head img[src*="card-"]').count(), 0, 'cards belong inside the expanded tournament only');
      await bcl.locator('[data-rail]').click(); await page.waitForTimeout(450);
      const me = bcl.locator('.m.me');
      assert.equal(await me.locator('img[src$="card-yellow.webp"]').count(), 1);
      const buffRows = await bcl.locator('.m-team .bf:not(.card)').evaluateAll(b => b.map(x => x.closest('.m').classList.contains('live')));
      assert.ok(buffRows.length > 0, 'no buffs in live BofP matches');
      assert.ok(buffRows.every(Boolean), 'buffs outside live matches');
      assert.equal(await bcl.locator('.m.done .m-time').first().innerText().catch(() => ''), '', 'finished match must show nothing');
      assert.equal(await bcl.locator('.sw').count(), 0, 'BofP card must not have the switch');
      assert.ok(await bcl.locator('.crest-img.team').count() > 5, 'BofP team avatars missing');
      await bcl.locator('[data-rail]').click(); await page.waitForTimeout(400);
    });

    await check(`[${tag}] real tournament: switch row, moving timeline, time column instead of star`, async () => {
      const ucl = page.locator('.t[data-id="ucl"]');
      await ucl.locator('[data-rail]').click(); await page.waitForTimeout(450);
      assert.equal(await ucl.locator('.m-star').count(), 0, 'star must be gone');
      const live = ucl.locator('.m.live').first();
      assert.match(await live.locator('.m-time').innerText(), /\d+'|Пер\./);
      assert.equal(await live.locator('.m-sc').evaluate(e => getComputedStyle(e).color), 'rgb(255, 94, 77)');
      assert.match(await ucl.locator('.m.sched .m-time').first().innerText(), /^\d{2}:\d{2}$/);
      const fill = await ucl.locator('.tl-fill').boundingBox(), nodes = await ucl.locator('.tl-node').evaluateAll(n => n.map(x => x.getBoundingClientRect().x + 15));
      const cx = fill.x + fill.width;
      assert.ok(cx > nodes[1] - 1 && cx < nodes[2], `the line must stop inside the play-off stage: ${cx} (${nodes[1]}..${nodes[2]})`);
      assert.equal(await ucl.locator('.tl-here').count(), 0, 'no separate "now" dot');
      assert.equal(await ucl.locator('.tl-node.cur').count(), 1, 'exactly one current-stage dot');
      assert.match(await ucl.locator('.tl-fill').evaluate(e => getComputedStyle(e).animationName), /tlgrow|none/);
      assert.equal(await ucl.locator('.m.me .ring').count(), 1);
      const mask = await ucl.locator('.m.me .ring').evaluate(e => getComputedStyle(e).webkitMaskImage || getComputedStyle(e).maskImage);
      assert.match(mask, /linear-gradient/, 'outline does not fade to the right');
      await ucl.locator('.sw').click();
      assert.match(await page.locator('.t[data-id="ucl"] .sw-note').innerText(), /Результаты игроков BofP/);
      assert.equal(await page.locator('.t[data-id="ucl"] .tl-fill').evaluate(e => getComputedStyle(e).animationName), 'none', 'switch must not replay the timeline');
      const liveOnly = await page.locator('.t[data-id="ucl"] .m-team .bf:not(.card)').evaluateAll(b => b.every(x => x.closest('.m').classList.contains('live')));
      assert.ok(liveOnly, 'buffs outside live matches');
      await page.screenshot({ path: path.join(SHOTS, `${tag}-expanded.png`) });
      await page.locator('.t[data-id="ucl"] .sw').click();
      await page.locator('.t[data-id="ucl"] [data-rail]').click(); await page.waitForTimeout(400);
    });

    await check(`[${tag}] night block at the bottom; hint above the tab bar scrolls to it`, async () => {
      assert.ok(await page.locator('[data-fold="night"]').count(), 'night block missing');
      assert.equal(await page.locator('.t[data-id="n5"]').count(), 0, 'Night BIG 5 must be gone');
      assert.equal(await page.locator('[data-fold="night"] + .cards .t[data-id="lib"]').count(), 1, 'night cup missing');
      const hint = page.locator('#hintDn');
      await page.locator('.scroll').evaluate(n => { n.style.scrollBehavior = 'auto'; n.scrollTop = 0; });
      await page.waitForTimeout(200);
      assert.ok(await hint.evaluate(e => e.classList.contains('show')), 'hint not shown');
      assert.ok(await hint.locator('svg').count() >= 2, 'hint icons missing');
      const hb = await box('#hintDn .key'), tb = await box('.tabbar'), mound = await box('#hintDn');
      assert.ok(hb.y + hb.height <= tb.y + 2, 'hint key must sit above the tab bar');
      assert.ok(mound.y + mound.height > tb.y, 'the mound must melt into the tab bar');
      assert.ok(Math.abs(hb.x + hb.width / 2 - vp.width / 2) < 2, 'hint not centred');
      await page.screenshot({ path: path.join(SHOTS, `${tag}-today.png`) });
      await hint.click(); await page.waitForTimeout(900);
      const first = page.locator('.t[data-action]').last();
      const fb = await first.boundingBox();
      assert.ok(fb.y < vp.height - 100 && fb.y > 0, `did not scroll to the action: ${await first.getAttribute('data-id')} y=${fb.y}`);
      await page.locator('.scroll').evaluate(n => { n.scrollTop = 0; n.style.scrollBehavior = ''; });
    });

    await check(`[${tag}] auction: only my match, dated a day after the auction, "Вне состава"`, async () => {
      const lib = page.locator('[data-fold="night"] + .cards .t[data-id="lib"]');
      await lib.locator('[data-rail]').click(); await page.waitForTimeout(450);
      assert.equal(await lib.locator('.m').count(), 1, 'auction card must show only my match');
      assert.match(await lib.locator('.m.me .m-time').innerText(), /23\.08\s*01:00/);
      assert.match(await lib.locator('.me-cta').innerText(), /вне состава/i);
      assert.doesNotMatch(await lib.innerText(), /Попасть|Фан-клуб не выставил/);
      await lib.locator('[data-rail]').click(); await page.waitForTimeout(400);
    });

    await check(`[${tag}] squad actions carry a gavel; BofP Series never has lineup states`, async () => {
      await day('2024-08-26');
      const sq = page.locator('.t[data-id="ucl"] .act.squad');
      assert.equal(await sq.count(), 1);
      assert.equal(await sq.locator('svg').count(), 1, 'gavel missing on the button');
      assert.equal(await page.locator('.t.series .act.squad, .t.series .act.in').count(), 0);
      await page.screenshot({ path: path.join(SHOTS, `${tag}-alert-day.png`) });
    });

    await check(`[${tag}] BIG 5: West, my league first and open, white headings`, async () => {
      await day('2024-08-24');
      const card = page.locator('.t[data-id="g5"]');
      assert.match(await card.locator('.t-meta').innerText(), /^Wst · L2 · Pls \d+$/);
      await card.locator('[data-rail]').click(); await page.waitForTimeout(450);
      assert.equal(await card.locator('.seg [aria-selected="true"]').innerText(), 'West');
      assert.equal(await card.locator('.lg.open').count(), 1);
      assert.match(await card.locator('.lg-h .nm').first().innerText(), /Лига 2/);
      assert.notEqual(await card.locator('.lg-h .nm').first().evaluate(e => getComputedStyle(e).color), ACCENT);
      assert.match(await card.locator('.lg.open .m').first().getAttribute('class'), /\bme\b/);
      await page.screenshot({ path: path.join(SHOTS, `${tag}-big5.png`) });
    });

    await check(`[${tag}] past day: final scores, tennis sets, no chips`, async () => {
      await day('2024-08-17');
      assert.equal(await page.locator('.t .t-act .act').count(), 0);
      for (const n of await page.locator('.t-rail .cnt-wrap').allInnerTexts()) assert.ok(parseInt(n) > 0, 'empty tournament listed');
      const ten = page.locator('.t[data-id^="atp-"], .t[data-id^="wta-"]').first();
      if (await ten.count()) {
        await ten.locator('[data-rail]').click(); await page.waitForTimeout(450);
        assert.ok(await ten.locator('.m-sc .set').count() >= 4, 'no set scores');
        assert.doesNotMatch(await ten.locator('.m-team .nm').first().innerText(), / \/ /, 'tennis sides are real players');
        const id = await ten.getAttribute('data-id');
        const realNames = await ten.locator('.m-team .nm').allInnerTexts();
        await ten.locator('.sw').click();
        const t2 = page.locator(`.t[data-id="${id}"]`);
        assert.match(await t2.locator('.sw-note').innerText(), /игроков BofP/);
        assert.equal(await t2.locator('.m-sc .set').count(), 0, 'BofP mode shows points, not sets');
        const bofpNames = await t2.locator('.m-team .nm').allInnerTexts();
        assert.ok(bofpNames.every(n => !realNames.includes(n)), 'the switch must swap real players for BofP players');
        for (const v of await t2.locator('.m-sc span').allInnerTexts()) assert.ok(+v >= 0 && +v <= 100, `points out of range: ${v}`);
      }
      const epl = page.locator('.t[data-id="epl"]');
      if (await epl.count()) {
        await epl.locator('[data-rail]').click(); await page.waitForTimeout(450);
        assert.equal(await epl.locator('.sw').getAttribute('aria-checked'), 'true', 'national league must start on BofP');
        assert.equal(await epl.locator('.tl-node.pause').count(), 4, 'Sep, Oct, Nov and March international breaks');
        await epl.locator('.tl-node.final').click();
        assert.match(await page.locator('.t[data-id="epl"] .tl-card').innerText(), /Завершение чемпионата[\s\S]*выдача наград/);
      }
      await page.screenshot({ path: path.join(SHOTS, `${tag}-past.png`) });
      await day('2024-08-21');
    });

    await check(`[${tag}] catalog drawer slides in with football/tennis trees`, async () => {
      await page.locator('#catalogBtn').click(); await page.waitForTimeout(500);
      const d = await box('#drawer');
      assert.ok(d.x >= -1 && d.x < 2, `drawer x=${d.x}`);
      const txt = await page.locator('#drawer').innerText();
      assert.match(txt, /Рейтинг альянсов[\s\S]*Рейтинг игроков \/ отбор в сборные альянсов[\s\S]*BofP Series/i);
      assert.match(txt, /Сборные Альянсов[\s\S]*BofP Еврокубки[\s\S]*Альянс Еврокубки[\s\S]*УЕФА Еврокубки/);
      assert.match(txt, /Конференции\s[\s\S]*Конфедерации — сборные/i);
      const body = page.locator('#drawer .dr-body');
      const bfp = page.locator('#drawer [data-dnode]', { hasText: 'BofP Еврокубки' });
      await bfp.click();
      assert.match(await bfp.locator('xpath=following-sibling::div[1]').innerText(), /BofP Champions League[\s\S]*BofP Super Cup/);
      const green = page.locator('#drawer [data-dnode]', { hasText: /^Green$/ });
      await green.click();
      const gk = green.locator('xpath=following-sibling::div[1]');
      assert.match(await gk.innerText(), /West[\s\S]*East/);
      assert.doesNotMatch(await page.locator('#drawer').innerText(), /Night BIG 5/);
      await gk.locator('[data-dnode]').first().click();
      assert.match(await gk.innerText(), /BIG 5 Cup/);
      await body.evaluate(n => (n.scrollTop = n.scrollHeight));
      const fifa = page.locator('#drawer [data-dnode]', { hasText: 'UEFA' }).last();
      const before = await body.evaluate(n => n.scrollTop);
      await fifa.click();
      assert.ok(Math.abs(await body.evaluate(n => n.scrollTop) - before) < 2, 'catalog jumped when a row was expanded');
      const nl = page.locator('#drawer [data-dnode]', { hasText: 'Лига наций УЕФА' });
      await nl.click();
      await page.locator('#drawer [data-dnode]', { hasText: 'Лига A' }).first().click();
      assert.match(await page.locator('#drawer').innerText(), /Группа A1/);
      await page.locator('#drawer [data-drsport="tennis"]').click();
      assert.match(await page.locator('#drawer').innerText(), /Теннисный рейтинг[\s\S]*ATP Masters 1000[\s\S]*WTA 125/i);
      assert.doesNotMatch(await page.locator('#drawer').innerText(), /Рейтинг альянсов/i);
      assert.doesNotMatch(await page.locator('#drawer').innerText(), /ITF/);
      await page.locator('#drawer [data-dnode]', { hasText: 'ATP Masters 1000' }).click();
      assert.match(await page.locator('#drawer').innerText(), /Индиан-Уэллс\s*04\.03-15\.03[\s\S]*Цинциннати\s*13\.08-23\.08/);
      await page.locator('#drawer [data-dnode]', { hasText: 'ATP Challenger' }).click();
      await page.locator('#drawer [data-dnode]', { hasText: 'Challenger 175' }).click();
      assert.match(await page.locator('#drawer').innerText(), /Challenger 175[\s\S]*\d{2}\.\d{2}-\d{2}\.\d{2}/);
      await page.screenshot({ path: path.join(SHOTS, `${tag}-drawer.png`) });
      await page.keyboard.press('Escape'); await page.waitForTimeout(450);
      assert.ok((await box('#drawer')).x < -100, 'drawer did not close');
    });

    await check(`[${tag}] dark theme only for now`, async () => {
      await page.locator('[data-tab="menu"]').click();
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(10, 10, 8)');
    });

    await check(`[${tag}] user tournaments: bottom block, folded, create button first, no backgrounds`, async () => {
      const h = page.locator('[data-fold="custom"]');
      assert.equal(await h.getAttribute('aria-expanded'), 'false');
      const last = await page.locator('.section-h').last().getAttribute('data-fold');
      assert.equal(last, 'custom', 'custom block must be the last one');
      await h.click();
      const box1 = h.locator('xpath=following-sibling::div[1]');
      assert.match(await box1.locator('> *').first().innerText(), /Создать/);
      const card = box1.locator('.t').first();
      assert.equal(await card.locator('.t-art').count(), 0);
      await card.locator('[data-rail]').click(); await page.waitForTimeout(400);
      assert.equal(await card.locator('.sw').count(), 0);
      assert.ok(await card.locator('.m').count() > 0);
      await h.click();
    });

    await check(`[${tag}] timelines: auction node in BofP CL and at the end of BIG 5`, async () => {
      const bcl = page.locator('.t[data-id="bcl"]');
      await bcl.locator('[data-rail]').click(); await page.waitForTimeout(400);
      assert.equal(await bcl.locator('.tl-node.auction').count(), 1);
      await bcl.locator('[data-rail]').click(); await page.waitForTimeout(400);
      const g5 = page.locator('.t[data-id="g5"]');
      await g5.locator('[data-rail]').click(); await page.waitForTimeout(400);
      assert.equal(await g5.locator('.tl-node.auction').count(), 1);
      assert.match(await g5.locator('.tl-dates .auc').innerText(), /31\.08/);
      assert.match(await g5.locator('.more').first().innerText(), /Показать все \d+/);
      const n0 = await g5.locator('.lg.open .m').count();
      await g5.locator('.more').first().click();
      assert.ok(await page.locator('.t[data-id="g5"] .lg.open .m').count() > n0, 'show-all did not expand');
      await page.locator('.t[data-id="g5"] .more').first().click();
      assert.equal(await page.locator('.t[data-id="g5"] .lg.open .m').count(), n0);
      await page.locator('.t[data-id="g5"] [data-rail]').click(); await page.waitForTimeout(400);
    });

    await check(`[${tag}] opening a card folds its chip; the big button says "Сделать прогноз"; Alliance CL follows its rules`, async () => {
      const acl = page.locator('.t[data-id="acl"]');
      await acl.locator('[data-rail]').click(); await page.waitForTimeout(600);
      assert.ok(await acl.locator('.m-team .crest-img.team').count() > 0, 'Alliance CL must use BofP team avatars');
      const w = await acl.locator('.t-act').evaluate(e => e.getBoundingClientRect().width);
      assert.ok(w < 2, `chip still visible (${w}px)`);
      assert.match(await acl.locator('.me-cta .act').textContent(), /Сделать прогноз/);
      assert.equal(await acl.locator('.tl-node.auction').count(), 1, 'qualification auction missing on the timeline');
      await acl.locator('.tl-node.auction').scrollIntoViewIfNeeded();
      await page.locator('.scroll').evaluate(n => (n.scrollTop += 0));
      await acl.locator('.tl-node.auction').click();
      assert.match(await page.locator('.t[data-id="acl"] .tl-card').innerText(), /аукцион/i);
      await page.locator('.t[data-id="acl"] [data-rail]').click(); await page.waitForTimeout(500);
      assert.ok(await page.locator('.t[data-id="acl"] .t-act').evaluate(e => e.getBoundingClientRect().width) > 60, 'chip must come back when folded');
      const series = await page.locator('[data-fold="series"] + .cards > .t').evaluateAll(t => t.map(x => x.dataset.action || ''));
      const firstPlain = series.findIndex(a => !a);
      assert.ok(series.slice(firstPlain).every(a => !a), 'tournaments waiting for a pick must be on top');
    });

    await check(`[${tag}] night block is also on the next day; it names the auction`, async () => {
      assert.match(await page.locator('[data-fold="night"]').innerText(), /аукцион/i);
      for (const d of ['2024-08-22', '2024-08-20']) { await day(d); assert.equal(await page.locator('[data-fold="night"]').count(), 0, `night block on ${d}`); }
      await day('2024-08-21');
    });

    await check(`[${tag}] join buttons: user tournaments 1 000, tennis priced by level on future days`, async () => {
      const h = page.locator('[data-fold="custom"]');
      if (await h.getAttribute('aria-expanded') === 'false') await h.click();
      const box1 = h.locator('xpath=following-sibling::div[1]');
      assert.ok(await box1.isVisible(), 'custom block did not open');
      assert.equal(await h.locator('.n').innerText(), '10');
      assert.equal(await box1.locator('.t').count(), 5, 'first five only');
      assert.match(await page.locator('[data-fold="custom"] + .cards .act.join').first().textContent(), /Вступить[\s\S]*1\s000/);
      await box1.locator('[data-page]').click();
      assert.equal(await page.locator('[data-fold="custom"] + .cards .t').count(), 10);
      await page.locator('[data-fold="custom"] + .cards [data-page]').click();
      if (await page.locator('[data-fold="custom"]').getAttribute('aria-expanded') === 'true') await page.locator('[data-fold="custom"]').click();
      await day('2024-08-22');
      const t = page.locator('.t[data-id^="atp-"]').first();
      assert.match(await t.locator('.act.join').textContent(), /Вступить[\s\S]*\d+к/);
      assert.equal(await page.locator('.t[data-id^="wta-"] .act.join').count(), 0, 'WTA cannot be joined');
      await day('2024-08-21');
    });

    await check(`[${tag}] calendar animation only today; past days have no night block; selected day glows`, async () => {
      assert.equal(await page.locator('.day.alert').getAttribute('data-day'), '2024-08-21');
      assert.equal(await page.locator('#pad').evaluate(e => getComputedStyle(e).outlineStyle), 'none', 'tile must be plain glass');
      await day('2024-08-20');
      assert.equal(await page.locator('[data-fold="night"]').count(), 0);
      await day('2024-08-21');
    });

    await check(`[${tag}] favourites: long press moves a card to the top block and back; catalog too`, async () => {
      const hold = async loc => { await loc.scrollIntoViewIfNeeded(); const b = await loc.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(750); await page.mouse.up(); await page.waitForTimeout(250); };
      await hold(page.locator('.t[data-id="g5"] .t-main'));
      assert.equal(await page.locator('.section-h').first().getAttribute('data-fold'), 'fav', 'favourites must open the list');
      assert.equal(await page.locator('[data-fold="fav"] + .cards .t[data-id="g5"]').count(), 1);
      assert.equal(await page.locator('[data-fold="series"] + .cards .t[data-id="g5"]').count(), 0, 'favourite must leave its block');
      assert.equal(await page.locator('.t[data-id="g5"]').evaluate(e => e.classList.contains('open')), false, 'long press must not open the card');
      await page.screenshot({ path: path.join(SHOTS, `${tag}-favourites.png`) });
      await hold(page.locator('.t[data-id="ucl"] .t-main'));
      assert.deepEqual((await page.locator('[data-fold="fav"] + .cards .t').evaluateAll(a => a.map(x => x.dataset.id))).sort(), ['g5', 'ucl'], 'several favourites must stay together');
      await hold(page.locator('.t[data-id="ucl"] .t-main'));
      await hold(page.locator('.t[data-id="g5"] .t-main'));
      assert.equal(await page.locator('[data-fold="fav"]').count(), 0);
      await page.locator('#catalogBtn').click(); await page.waitForTimeout(450);
      assert.notEqual(await page.locator('#drawer .rk svg').first().evaluate(e => getComputedStyle(e).color), ACCENT, 'ratings must not be yellow');
      await page.locator('#drawer [data-drsport="foot"]').click();
      await hold(page.locator('#drawer .node', { hasText: 'Random Cup' }));
      assert.match(await page.locator('#drawer .fav-band + .fav-node').innerText(), /Random Cup/);
      await hold(page.locator('#drawer .fav-node'));
      assert.equal(await page.locator('#drawer .fav-band').count(), 0);
      await page.locator('#drawer [data-qopen]').click();
      await page.locator('#drQ').fill('цинц');
      const hits = await page.locator('#drHits .node .nm').allInnerTexts();
      assert.ok(hits.length >= 2 && hits.every(h => /Цинциннати/.test(h)), `search results: ${hits}`);
      assert.match(await page.locator('#drHits').innerText(), /ATP Masters 1000[\s\S]*WTA 1000/i);
      await page.locator('#drQ').fill('zzz');
      assert.match(await page.locator('#drHits').innerText(), /Ничего не найдено/);
      await page.locator('[data-qclose]').click();
      assert.equal(await page.locator('#drawer h2').innerText(), 'Все турниры');
      await page.keyboard.press('Escape'); await page.waitForTimeout(450);
      await page.locator('#searchBtn').click(); await page.waitForTimeout(300);
      assert.match(await page.locator('#toast').innerText(), /Глобальный поиск/, 'header search is a stub for the global search');
    });

    await check(`[${tag}] stocks: portfolio tab, sorting, dividends, stock card, leaderboard, player profile, trade sheet`, async () => {
      await page.locator('[data-tab="wallet"]').click(); await page.waitForTimeout(300);
      assert.equal(await page.locator('#stocks').isVisible(), true, 'the portfolio tab opens the stocks market');
      const names = () => page.locator('#stocks .sx-tbl .sx-tr:not(.tot) .l b').allInnerTexts();
      assert.equal((await names())[0], 'Барселона', 'portfolio sorted by value by default');
      await page.locator('[data-sort="pf:q"]').click();
      const qs = await page.locator('#stocks .sx-tbl .sx-tr:not(.tot) span:nth-child(2)').allInnerTexts();
      const nums = qs.map(x => +x.replace(/\s/g, ''));
      assert.deepEqual(nums, [...nums].sort((a, b) => b - a), 'sort by quantity');
      await page.locator('[data-sort="pf:q"]').click();
      const up = (await page.locator('#stocks .sx-tbl .sx-tr:not(.tot) span:nth-child(2)').allInnerTexts()).map(x => +x.replace(/\s/g, ''));
      assert.deepEqual(up, [...up].sort((a, b) => a - b), 'second click reverses');
      await page.locator('[data-pf="div"]').click();
      assert.doesNotMatch(await page.locator('#stocks').innerText(), /Чемпионские/i, 'championship dividends are gone');
      await page.locator('[data-tab2="market"]').click();
      assert.match(await page.locator('#stocks .sx-th').innerText(), /Рейтинг УЕФА/i);
      await page.locator('[data-mkt="orders"]').click();
      await page.locator('#stocks .sx-chips2').evaluate(e => (e.scrollLeft = 200));
      const x0 = await page.locator('#stocks .sx-chips2').evaluate(e => e.scrollLeft);
      await page.locator('#stocks [data-st="cancelled"]').evaluate(e => e.click());
      assert.equal(await page.locator('#stocks .sx-chips2').evaluate(e => e.scrollLeft), x0, 'filters stay where they were');
      await page.locator('[data-st="all"]').click(); await page.locator('[data-mkt="stocks"]').click();
      await page.locator('[data-lg="epl"]').click();
      assert.ok(await page.locator('#stocks .sx-row[data-club="Арсенал"]').count() && !(await page.locator('#stocks .sx-row[data-club="Барселона"]').count()), 'league filter');
      await page.locator('[data-mkt="orders"]').click();
      assert.match(await page.locator('#stocks [data-st="active"]').innerText(), /\d/, 'active filter shows a counter');
      const gray = await page.locator('#stocks .sx-ord.cancelled .o2').first().evaluate(e => getComputedStyle(e).filter);
      assert.match(gray, /grayscale/, 'cancelled orders are black and white');
      assert.doesNotMatch(await page.locator('#stocks .sx-ord.cancelled .oi').first().evaluate(e => getComputedStyle(e).filter), /grayscale/, 'icon keeps colour');
      await page.locator('[data-tab2="portfolio"]').click(); await page.locator('[data-pf="stocks"]').click();
      await page.locator('#stocks [data-club="Барселона"]').click(); await page.waitForTimeout(450);
      assert.match(await page.locator('#sxCard .sx-own').innerText(), /Ваши акции[\s\S]*388[\s\S]*В резерве[\s\S]*12[\s\S]*У игроков[\s\S]*Топ-3/i);
      { await page.locator('#sxCard .sx-cw .plot').evaluate(e => e.scrollIntoView({ block: 'center' })); const plot = await page.locator('#sxCard .sx-cw .plot').boundingBox();
        assert.ok(await page.locator('#sxCard .sx-cw .gy').count() >= 3 && await page.locator('#sxCard .sx-cw .dates span').count() === 3, 'price lines and dates');
        await page.mouse.click(plot.x + plot.width * 0.4, plot.y + plot.height / 2);
        assert.match(await page.locator('#sxCard .sx-cw .ct').innerText(), /\d[\s\S]*([а-я]{3}\.?|\d{2}:\d{2})/, 'tapping the chart shows price and date');
        assert.match(await page.locator('#sxCard .sx-cw .ct').innerText(), /Откр[\s\S]*Закр[\s\S]*Макс[\s\S]*Мин[\s\S]*Объём\s+\d+ акц/, 'tooltip shows OHLC and the traded volume');
        await page.locator('#sxCard [data-period="1y"]').evaluate(e => e.click());
        assert.match(await page.locator('#sxCard .sx-cw .dates').innerText(), /20\d\d/, 'the year chart labels months with the year');
        assert.ok(await page.locator('#sxCard [data-period="6m"]').count(), 'six months period');
        assert.match(await page.locator('#sxCard .sx-vsum').innerText(), /Объём за период[\s\S]*Оборот/); }
      await page.locator('#sxCard [data-lb]').click(); await page.waitForTimeout(450);
      assert.equal(await page.locator('#sxModal .lbr').count(), 100, 'top-100 leaderboard');
      await page.locator('#sxModal [data-sort="lb:qty"]').click();
      await page.locator('#sxModal .lbr').first().click(); await page.waitForTimeout(450);
      assert.match(await page.locator('#sxPlayer .sx-pbar').innerText(), /Торговый профиль игрока/i);
      await page.locator('#sxPlayer [data-pclose]').click(); await page.waitForTimeout(450);
      assert.equal(await page.locator('#sxPlayer.show').count() + await page.locator('#sxModal.show').count() + await page.locator('#sxCard.show').count(), 0, 'closing returns to my portfolio');
      await page.locator('#stocks [data-club="Барселона"]').click(); await page.waitForTimeout(450);
      await page.locator('#sxCard [data-trade="buy"]').click(); await page.waitForTimeout(450);
      const green = await page.locator('#sxTrade .sx-go').evaluate(e => getComputedStyle(e).backgroundImage);
      assert.match(green, /70, 227, 160/, 'buy is green');
      await page.locator('#sxTrade [data-pay="tokens"]').click();
      assert.match(await page.locator('#sxTrade .sx-go').innerText(), /0,38/, '12 158 × 1,005 / 32 000 ≈ 0,38 tokens');
      await page.locator('#sxTrade [data-tside="sell"]').click();
      assert.match(await page.locator('#sxTrade .sx-go').evaluate(e => getComputedStyle(e).backgroundImage), /255, 122, 107/, 'sell is red');
      await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.waitForTimeout(400);
      // orders: tap opens the order, long press offers cancel / select several
      await page.locator('[data-tab2="market"]').click(); await page.locator('[data-mkt="orders"]').click();
      await page.locator('#stocks .sx-ord[data-ord="74"]').click(); await page.waitForTimeout(450);
      assert.match(await page.locator('#sxOrder').innerText(), /#74[\s\S]*Покупка[\s\S]*Дата[\s\S]*Объём[\s\S]*Цена за акцию[\s\S]*Итого\s+19[\s\S]*0,5%[\s\S]*заблокировано/, 'order details: fills, total, commission, blocked coins');
      await page.locator('#sxOrder [data-oclose]').click(); await page.waitForTimeout(400);
      const hold = async id => { const b = await page.locator(`#stocks .sx-ord[data-ord="${id}"]`).boundingBox(); await page.mouse.move(b.x + 40, b.y + 20); await page.mouse.down(); await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(150); };
      await hold(75);
      assert.equal(await page.locator('#sxMenu').isVisible(), true, 'long press opens the menu');
      await page.locator('#sxMenu [data-msel]').click();
      assert.match(await page.locator('#sxSel').innerText(), /1 заявка выбрана/);
      await page.locator('#stocks .sx-pick[data-ord="73"]').click();
      assert.match(await page.locator('#sxSel').innerText(), /2 заявки выбраны/);
      assert.match(await page.locator('#sxSelGo').innerText(), /Отменить 2 заявки/);
      await page.locator('#sxSelGo [data-selgo]').click();
      assert.equal(await page.locator('#stocks .sx-ord.cancelled[data-ord="75"]').count() + await page.locator('#stocks .sx-ord.cancelled[data-ord="73"]').count(), 2, 'both orders cancelled');
      assert.equal(await page.locator('#sxSel').isVisible(), false);
      await page.locator('[data-tab="cups"]').click(); await page.waitForTimeout(300);
      assert.equal(await page.locator('#stocks').isVisible(), false);
    });

    await check(`[${tag}] touch targets ≥ 44px`, async () => {
      for (const sel of ['#catalogBtn', '#searchBtn', '#profileBtn', '.day', '.t-rail', '.t-icon', '.tab', '.section-h']) {
        const b = await box(sel);
        assert.ok(b.width >= 44 && b.height >= 44, `${sel} ${b.width}x${b.height}`);
      }
    });

    await page.close();
  }

  // the guided tour, walked end to end like a first-time visitor
  for (const vp of [{ width: 390, height: 844 }, { width: 360, height: 740 }]) {
    const tag = `${vp.width}`;
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2, reducedMotion: 'reduce', ignoreHTTPSErrors: true, colorScheme: 'dark' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url);
    await check(`[${tag}] tour: 16 steps, «Далее» everywhere, yellow only for the action`, async () => {
      const tip = page.locator('.tour-tip');
      await tip.waitFor();
      const step = async n => { await page.waitForFunction(n => document.querySelector('.tour-n')?.textContent.includes(`${n} из`), n, { timeout: 8000 }); await page.waitForTimeout(700); };
      const next = async () => page.locator('.tour-next').click();
      const onScreen = async n => {
        await page.screenshot({ path: path.join(SHOTS, `${tag}-tour-${String(n).padStart(2, '0')}.png`) });
        const b = await tip.boundingBox();
        assert.ok(b.y >= 0 && b.y + b.height <= vp.height, `step ${n}: tip off screen (${b.y})`);
        assert.equal(await page.locator('.tour-next').count(), 1, `step ${n}: «Далее» missing`);
        const col = await page.evaluate(() => [getComputedStyle(document.querySelector('.tour-n')).color, getComputedStyle(document.querySelector('.tour-tx')).color]);
        assert.ok(col.every(c => c !== ACCENT_TXT), `step ${n}: only the action may be yellow`);
      };
      const ACCENT_TXT = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent-text').trim() === '#FFD23F' ? 'rgb(255, 210, 63)' : '');
      const hold = async loc => { await loc.scrollIntoViewIfNeeded(); const b = await loc.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(750); await page.mouse.up(); };
      await step(1); await onScreen(1);
      assert.match(await page.locator('.tour-tx .tour-act').textContent(), /Нажмите/);
      await page.locator('#searchBtn').click({ force: true });
      assert.match(await page.locator('.tour-n').textContent(), /1 из 16/, 'a tap outside the spotlight must be ignored');
      await page.locator('#catalogBtn').click();
      await step(2); await onScreen(2); await next();
      await step(3); await onScreen(3);
      await next();
      assert.ok(await page.locator('.tour.tipoff').count(), '«Далее» on the free step hides the tip');
      await page.locator('#drawer [data-drsport="tennis"]').click();
      await page.locator('#drawer [data-dnode]', { hasText: 'ATP 500' }).click();
      assert.match(await page.locator('#drawer').innerText(), /Роттердам/, 'free play must let the catalog work');
      await page.locator('#drawer [data-drsport="foot"]').click();
      await page.locator('#drawer [data-close]').click();
      await step(4); await onScreen(4);
      await page.locator('.tour-back').click();
      await step(3);
      assert.ok(await page.locator('#drawer.show').count(), 'back must reopen the catalog');
      await page.locator('#drawer [data-close]').click();
      await step(4); await next();
      await step(5); await onScreen(5);
      assert.match(await page.locator('.tour-tx').textContent(), /Число матчей[\s\S]*заглушка[\s\S]*Разверните турнир/);
      await page.locator('.t[data-id="ucl"] [data-rail]').click();
      await step(6); await onScreen(6);
      const real = await page.locator('.t[data-id="ucl"] .m-sc').allInnerTexts();
      await page.locator('.t[data-id="ucl"] .sw').click();
      await step(7); await onScreen(7);
      { const t = await tip.boundingBox(), m = await page.locator('.t[data-id="ucl"] .matches').boundingBox();
        assert.ok(t.y + t.height <= m.y + 2, 'the tip must not cover the matches on step 7'); }
      assert.notDeepEqual(await page.locator('.t[data-id="ucl"] .m-sc').allInnerTexts(), real, 'scores must change with the switch');
      await page.locator('.t[data-id="ucl"] .sw').click();
      assert.deepEqual(await page.locator('.t[data-id="ucl"] .m-sc').allInnerTexts(), real, 'the switch must stay playable on step 7');
      await page.locator('.t[data-id="ucl"] .sw').click();
      await next();
      await step(8);
      await page.locator('.t[data-id="ucl"] .tl-node').nth(2).click();
      await page.waitForTimeout(300);
      assert.equal(await page.locator('.t[data-id="ucl"] .tl-card').count(), 1, 'milestones must open their notes during the tour');
      await onScreen(8);
      const sc = await page.locator('#scroll').evaluate(n => n.scrollTop);
      await page.mouse.wheel(0, 600); await page.waitForTimeout(300);
      assert.equal(await page.locator('#scroll').evaluate(n => n.scrollTop), sc, 'the screen must not scroll during a spotlight step');
      await next();
      await step(9); await onScreen(9);
      assert.match(await page.locator('.tour-act').textContent(), /Зажмите карточку турнира и добавьте свой первый турнир/);
      await hold(page.locator('.t[data-id="ucl"] .t-main'));
      await step(10); await onScreen(10);
      assert.equal(await page.locator('[data-fold="fav"] + .cards .t[data-id="ucl"]').count(), 1, 'the long press must add to favourites');
      assert.match(await page.locator('.tour-tx').textContent(), /Избранные[\s\S]*так же/);
      await next();
      await step(11); await onScreen(11);
      await page.locator('.t[data-id="g5"] [data-rail]').click();
      await step(12); await onScreen(12);
      assert.match(await page.locator('.tour-tx').textContent(), /также отмечены/);
      await page.locator('.tour-back').click();
      await step(11);
      assert.equal(await page.locator('.t[data-id="g5"].open').count(), 1, 'a card the visitor opened must stay open');
      await next();
      await step(12);
      await next();
      await step(13); await onScreen(13);
      await page.locator('.t[data-id="g5"] .lg-h').nth(1).click();
      assert.ok(await page.locator('.t[data-id="g5"] .lg.open').count(), 'leagues must open during the free step');
      assert.match(await page.locator('.tour-n').textContent(), /13 из/);
      await next();
      await step(14); await onScreen(14);
      assert.equal(await page.locator('.t[data-id="g5"].open').count(), 0, '«Далее» must fold BIG 5');
      await page.locator('#hintDn').click();
      await step(15); await onScreen(15); await next();
      await step(16); await onScreen(16);
      assert.match(await page.locator('.tour-tx').textContent(), /Здесь теперь — портфель акций/);
      await page.locator('.tour-next', { hasText: 'Готово' }).click();
      await page.waitForTimeout(300);
      assert.equal(await page.locator('.tour').count(), 0, 'tour did not close');
      await hold(page.locator('.t[data-id="ucl"] .t-main'));
      await page.waitForTimeout(300);
      assert.equal(await page.locator('[data-fold="real"] + .cards .t[data-id="ucl"]').count(), 1, 'a removed favourite must return to its block');
      assert.deepEqual(errors, [], errors.join(' | '));
    });
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(url);
    await check('[390] tour can be skipped at any step', async () => {
      await page.locator('.tour-skip').click();
      await page.waitForTimeout(200);
      assert.equal(await page.locator('.tour').count(), 0);
      await page.locator('.t[data-id="ucl"] [data-rail]').click();
      await page.waitForTimeout(300);
      assert.ok(await page.locator('.t[data-id="ucl"].open').count(), 'the screen must work after skipping');
    });
    await page.close();
  }

  await browser.close();
  srv.close();
  for (const r of results) console.log(r[0] === 'ok' ? '  ✓' : '  ✗', r[1], r[2] ? `— ${r[2]}` : '');
  const failed = results.filter(r => r[0] !== 'ok').length;
  console.log(`\n${results.length - failed}/${results.length} passed. Screenshots: tests/__screenshots__/`);
  process.exit(failed ? 1 : 0);
})();
