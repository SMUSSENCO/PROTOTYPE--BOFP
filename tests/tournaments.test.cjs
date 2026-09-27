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
    await page.goto(url);
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
      const here = await ucl.locator('.tl-here').boundingBox(), nodes = await ucl.locator('.tl-node').evaluateAll(n => n.map(x => x.getBoundingClientRect().x + 15));
      const cx = here.x + here.width / 2;
      assert.ok(cx > nodes[1] - 1 && cx < nodes[2], `"now" marker ${cx} is not inside the play-off stage (${nodes[1]}..${nodes[2]})`);
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
        assert.match(await ten.locator('.m-team .nm').first().innerText(), / \/ /, 'tennis sides must be pairs');
      }
      await page.screenshot({ path: path.join(SHOTS, `${tag}-past.png`) });
      await day('2024-08-21');
    });

    await check(`[${tag}] catalog drawer slides in with football/tennis trees`, async () => {
      await page.locator('#catalogBtn').click(); await page.waitForTimeout(500);
      const d = await box('#drawer');
      assert.ok(d.x >= -1 && d.x < 2, `drawer x=${d.x}`);
      assert.match(await page.locator('#drawer').innerText(), /BofP Еврокубки[\s\S]*Альянс Еврокубки[\s\S]*УЕФА Еврокубки/);
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
      assert.match(await page.locator('#drawer').innerText(), /ATP Masters 1000[\s\S]*WTA 125/);
      assert.doesNotMatch(await page.locator('#drawer').innerText(), /ITF/);
      await page.locator('#drawer [data-dnode]', { hasText: 'ATP Masters 1000' }).click();
      assert.match(await page.locator('#drawer').innerText(), /Индиан-Уэллс[\s\S]*Цинциннати/);
      await page.screenshot({ path: path.join(SHOTS, `${tag}-drawer.png`) });
      await page.keyboard.press('Escape'); await page.waitForTimeout(450);
      assert.ok((await box('#drawer')).x < -100, 'drawer did not close');
    });

    await check(`[${tag}] light theme from the menu tab`, async () => {
      await page.locator('[data-tab="menu"]').click();
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'light');
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      assert.equal(bg, 'rgb(242, 240, 232)');
      await page.screenshot({ path: path.join(SHOTS, `${tag}-light.png`) });
      await page.locator('[data-tab="menu"]').click();
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
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
      const t = page.locator('.t[data-id^="atp-"], .t[data-id^="wta-"]').first();
      assert.match(await t.locator('.act.join').textContent(), /Вступить[\s\S]*\d+к/);
      await day('2024-08-21');
    });

    await check(`[${tag}] calendar animation only today; past days have no night block; selected day glows`, async () => {
      assert.equal(await page.locator('.day.alert').getAttribute('data-day'), '2024-08-21');
      assert.equal(await page.locator('#pad').evaluate(e => getComputedStyle(e).outlineStyle), 'none', 'tile must be plain glass');
      await day('2024-08-20');
      assert.equal(await page.locator('[data-fold="night"]').count(), 0);
      await day('2024-08-21');
    });

    await check(`[${tag}] touch targets ≥ 44px`, async () => {
      for (const sel of ['#catalogBtn', '#searchBtn', '#profileBtn', '.day', '.t-rail', '.t-icon', '.tab', '.section-h']) {
        const b = await box(sel);
        assert.ok(b.width >= 44 && b.height >= 44, `${sel} ${b.width}x${b.height}`);
      }
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
