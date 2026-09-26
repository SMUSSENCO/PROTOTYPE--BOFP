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
  try { await fn(); results.push(['ok', name]); }
  catch (e) { results.push(['FAIL', name, e.message.split('\n')[0]]); }
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const srv = await serve();
  const url = `http://localhost:${srv.address().port}/`;
  const browser = await chromium.launch();

  for (const vp of [{ width: 390, height: 844 }, { width: 360, height: 740 }]) {
    const tag = `${vp.width}`;
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2, reducedMotion: 'reduce', ignoreHTTPSErrors: true });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    // only our own files count; third-party font hosts can be unreachable in CI sandboxes
    page.on('console', m => m.type() === 'error' && (m.location().url || '').startsWith(url) && errors.push(m.text()));
    page.on('requestfailed', r => r.url().startsWith(url) && errors.push(`${r.url()} ${r.failure().errorText}`));
    await page.goto(url);
    await page.waitForSelector('.t');
    await page.evaluate(() => document.fonts.ready);
    const box = sel => page.locator(sel).first().boundingBox();

    await check(`[${tag}] no console errors`, async () => assert.deepEqual(errors, [], errors.join(' | ')));

    await check(`[${tag}] page never scrolls sideways`, async () => {
      const o = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth, document.querySelector('.scroll').scrollWidth, document.querySelector('.scroll').clientWidth]);
      assert.ok(o[0] <= o[1], `document ${o[0]} > viewport ${o[1]}`);
      assert.ok(o[2] <= o[3], `list ${o[2]} > ${o[3]}`);
    });

    await check(`[${tag}] header: search left, title centred, balance right`, async () => {
      const s = await box('#searchBtn'), h = await box('.header h1'), b = await box('.balance');
      assert.ok(s.x < 24, `search x=${s.x}`);
      assert.ok(Math.abs(h.x + h.width / 2 - vp.width / 2) < 2, 'title off-centre');
      assert.ok(Math.abs(b.x + b.width - (vp.width - 16)) < 2, `balance right edge ${b.x + b.width}`);
      assert.ok(Math.abs((s.y + s.height / 2) - (b.y + b.height / 2)) < 2, 'search and balance not vertically aligned');
      assert.match(await page.locator('.balance').innerText(), /10 474 725/);
    });

    await check(`[${tag}] calendar: 15 days, scrolls, today centred and labelled`, async () => {
      assert.equal(await page.locator('.day').count(), 15);
      const o = await page.evaluate(() => { const n = document.querySelector('#dates'); return [n.scrollWidth, n.clientWidth]; });
      assert.ok(o[0] > o[1], 'strip does not overflow, cannot scroll');
      const t = await box('.day.today');
      assert.ok(Math.abs(t.x + t.width / 2 - vp.width / 2) < 4, `today not centred: ${t.x + t.width / 2}`);
      assert.match(await page.locator('.day.today').innerText(), /Сегодня/i);
      assert.equal(await page.locator('.day.today').getAttribute('aria-selected'), 'true');
    });

    await check(`[${tag}] future player days: framed, count on top, gavel below`, async () => {
      const framed = await page.locator('.day:not(.past) .frame').count();
      assert.ok(framed >= 3, `framed days: ${framed}`);
      assert.equal(await page.locator('.day.past .frame').count(), 0, 'past days must not be framed');
      const d = page.locator('.day[data-day="2024-08-24"]');
      assert.equal((await d.locator('.cnt').innerText()).trim(), '2');
      const db = await d.boundingBox(), cb = await d.locator('.cnt').boundingBox(), gb = await d.locator('.gavel').boundingBox();
      assert.ok(cb.y < db.y + 2, 'count must sit on the top edge');
      assert.ok(gb.y + gb.height > db.y + db.height - 2, 'gavel must sit on the bottom edge');
    });

    await check(`[${tag}] one day calls for action: running line + gavel`, async () => {
      assert.equal(await page.locator('.day.alert').count(), 1);
      assert.equal(await page.locator('.day.alert .runner').count(), 1);
      assert.equal(await page.locator('.day.alert .gavel').count(), 1);
      const anim = await page.evaluate(() => getComputedStyle(document.querySelector('.runner')).animationName);
      // reduced motion disables it in this run; the rule itself must exist
      const hasRule = await page.evaluate(() => [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => r.name === 'run'); } catch { return false; } }));
      assert.ok(hasRule, `no @keyframes run (computed ${anim})`);
    });

    await check(`[${tag}] cards: round left, square right, touch the screen edge`, async () => {
      const c = await box('.t');
      assert.ok(Math.abs(c.x + c.width - vp.width) < 1, `card right edge ${c.x + c.width} != ${vp.width}`);
      const r = await page.evaluate(() => { const s = getComputedStyle(document.querySelector('.t')); return [s.borderTopLeftRadius, s.borderTopRightRadius, s.backdropFilter || s.webkitBackdropFilter]; });
      assert.notEqual(r[0], '0px');
      assert.equal(r[1], '0px');
      assert.match(r[2], /blur/, 'card is not frosted glass');
    });

    await check(`[${tag}] action button sits on the title line`, async () => {
      const card = page.locator('.t.mine').first();
      const tt = await card.locator('.t-title').boundingBox(), a = await card.locator('.act').boundingBox();
      assert.ok(a.x > tt.x + tt.width - 1, 'button not right of title');
      assert.ok(a.y < tt.y + tt.height && a.y + a.height > tt.y, 'button not on title row');
      assert.match(await card.locator('.act').innerText(), /\d{2}:\d{2}/, 'timer missing in button');
    });

    await check(`[${tag}] player's tournament is outlined in accent and listed first in its section`, async () => {
      const color = await page.evaluate(() => getComputedStyle(document.querySelector('.t.mine')).borderTopColor);
      assert.equal(color, 'rgb(220, 242, 62)');
      const firstInSeries = await page.locator('.cards').last().locator('.t').first().getAttribute('class');
      assert.match(firstInSeries, /mine/);
    });

    await check(`[${tag}] expand: timeline, switch on the row, my match on top`, async () => {
      const card = page.locator('.t.mine').first();
      const h0 = (await card.boundingBox()).height;
      await card.locator('[data-rail]').click();
      await page.waitForTimeout(450);
      const h1 = (await card.boundingBox()).height;
      assert.ok(h1 > h0 + 150, `did not expand: ${h0} -> ${h1}`);
      assert.ok(await card.locator('.tl-node').count() >= 3, 'timeline nodes missing');
      assert.equal(await card.locator('.tl-node.final').count(), 1, 'trophy node missing');
      const sw = await card.locator('.sw').boundingBox(), head = await card.locator('.t-head').boundingBox();
      assert.ok(sw && sw.y >= head.y && sw.y + sw.height <= head.y + head.height, 'switch is not inside the tournament row');
      const first = card.locator('.matches .m').first();
      assert.match(await first.getAttribute('class'), /\bme\b/, 'my match is not first');
      await page.screenshot({ path: path.join(SHOTS, `${tag}-expanded.png`) });
    });

    await check(`[${tag}] timeline node shows its stage`, async () => {
      const card = page.locator('.t.open').first();
      assert.equal(await card.locator('.tl-card').isVisible(), false, 'stage details should wait for a tap');
      await card.locator('.tl-node.final').click();
      const det = page.locator('.t.open .tl-card').first();
      assert.ok(await det.isVisible(), 'stage details did not open');
      assert.match(await det.locator('.n').innerText(), /Финал/);
      await page.screenshot({ path: path.join(SHOTS, `${tag}-stage.png`) });
      await page.locator('.t.open .tl-node.final').first().click();
      assert.equal(await page.locator('.t.open .tl-card').first().isVisible(), false, 'second tap should close details');
    });

    await check(`[${tag}] switch flips to BofP players and back`, async () => {
      const card = page.locator('.t.open').first();
      const was = await card.locator('.sw').getAttribute('aria-checked');
      await card.locator('.sw').click();
      assert.notEqual(await page.locator('.t.open .sw').first().getAttribute('aria-checked'), was);
      await page.locator('.t.open .sw').first().click();
      assert.equal(await page.locator('.t.open .sw').first().getAttribute('aria-checked'), was);
    });

    await check(`[${tag}] touch targets ≥ 44px`, async () => {
      for (const sel of ['#searchBtn', '.day', '.t-rail', '.t.open .m-star', '.tab']) {
        const b = await box(sel);
        assert.ok(b.width >= 44 && b.height >= 44, `${sel} ${b.width}x${b.height}`);
      }
    });

    await page.locator('.scroll').evaluate(n => (n.scrollTop = 0));
    await page.screenshot({ path: path.join(SHOTS, `${tag}-today.png`) });

    await check(`[${tag}] BIG 5 opens West, my league expanded, my match first`, async () => {
      await page.locator('.day[data-day="2024-08-24"]').click();
      await page.waitForSelector('.t[data-id="g5"]');
      await page.locator('.t[data-id="g5"] [data-rail]').click();
      await page.waitForTimeout(450);
      const card = page.locator('.t[data-id="g5"]');
      assert.equal(await card.locator('.seg [aria-selected="true"]').innerText(), 'West');
      const open = card.locator('.lg.open');
      assert.equal(await open.count(), 1, 'only my league should be open');
      assert.match(await open.locator('.nm').innerText(), /Лига 2/);
      assert.match(await open.locator('.m').first().getAttribute('class'), /\bme\b/);
      await card.locator('.lg:not(.open) .lg-h').first().click();
      assert.equal(await card.locator('.lg.open').count(), 2, 'league accordion does not open');
      await card.locator('.seg [data-side="East"]').click();
      assert.equal(await page.locator('.t[data-id="g5"] .seg [aria-selected="true"]').innerText(), 'East');
      await page.locator('.t[data-id="g5"] .seg [data-side="West"]').click();
      await page.locator('.t[data-id="g5"]').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(SHOTS, `${tag}-big5.png`) });
    });

    await check(`[${tag}] past day shows final scores`, async () => {
      await page.locator('.day[data-day="2024-08-17"]').click();
      await page.waitForSelector('.t');
      await page.locator('.t').first().locator('[data-rail]').click();
      await page.waitForTimeout(450);
      const sides = await page.locator('.t.open .m-side').first().innerText();
      assert.match(sides, /^\d+\s+\d+/, `no score: ${sides}`);
      await page.screenshot({ path: path.join(SHOTS, `${tag}-past.png`) });
    });

    await check(`[${tag}] alert day: squad action on my match`, async () => {
      await page.locator('.day[data-day="2024-08-27"]').click();
      await page.waitForSelector('.t.mine');
      const act = page.locator('.t.mine .act.squad').first();
      assert.equal(await act.count(), 1, 'no "Не в составе" chip');
      assert.match(await act.innerText(), /Не в составе/i);
      await page.screenshot({ path: path.join(SHOTS, `${tag}-alert-day.png`) });
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
