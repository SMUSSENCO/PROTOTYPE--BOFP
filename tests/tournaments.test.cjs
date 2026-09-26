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

    const WHITE = 'rgb(241, 244, 234)', ACCENT = 'rgb(220, 242, 62)';

    await check(`[${tag}] glass tile sits under the selected day and slides to a new one`, async () => {
      const pad = await box('#pad'), today = await box('.day.today');
      assert.ok(Math.abs(pad.x - today.x) < 1 && Math.abs(pad.y - today.y) < 1, 'pad not under today');
      await page.locator('.day[data-day="2024-08-22"]').click();
      await page.waitForTimeout(500);
      const p2 = await box('#pad'), d2 = await box('.day[data-day="2024-08-22"]');
      assert.ok(Math.abs(p2.x - d2.x) < 1, `pad did not follow: ${p2.x} vs ${d2.x}`);
      await page.locator('.day[data-day="2024-08-21"]').click();
      await page.waitForTimeout(500);
    });

    await check(`[${tag}] titles stay on one line; chip is centred in the row`, async () => {
      for (const el of await page.locator('.t-title').all()) assert.ok((await el.boundingBox()).height < 22, 'title wraps');
      const card = page.locator('.t.mine').first();
      const head = await card.locator('.t-head').boundingBox(), a = await card.locator('.t-act .act').boundingBox(), tt = await card.locator('.t-title').boundingBox();
      assert.ok(Math.abs(a.y + a.height / 2 - (head.y + head.height / 2)) < 2, 'chip not vertically centred');
      assert.ok(a.x >= tt.x + tt.width - 1, 'chip overlaps the title');
      assert.match(await card.locator('.t-act .act').innerText(), /\+ прогноз/i);
      assert.match(await card.locator('.t-act .act').innerText(), /\d{2}:\d{2}/, 'timer missing in button');
      const ic = await card.locator('.t-icon').boundingBox();
      assert.ok(ic.width >= 48 && head.height <= 70, `icon ${ic.width}, row ${head.height}`);
    });

    await check(`[${tag}] live matches: total/live in the rail, red counter`, async () => {
      const ucl = page.locator('.t[data-id="ucl"]');
      const txt = (await ucl.locator('.t-rail .cnt-wrap').innerText()).replace(/\s/g, '');
      assert.match(txt, /^\d+\/\d+$/, `rail shows "${txt}"`);
      const bg = await ucl.locator('.t-rail .lv').evaluate(e => getComputedStyle(e).backgroundColor);
      assert.equal(bg, 'rgb(255, 106, 85)');
      const rail = await ucl.locator('.t-rail').boundingBox();
      assert.ok(rail.width <= 54.5, `rail widened to ${rail.width}`);
    });

    await check(`[${tag}] section headers: accent only where you play, and they fold`, async () => {
      const colors = await page.locator('.section-h').evaluateAll(els => els.map(e => [e.classList.contains('hot'), getComputedStyle(e).color]));
      for (const [hot, c] of colors) assert.equal(c, hot ? ACCENT : WHITE);
      const h = page.locator('.section-h').first();
      await h.click();
      assert.equal(await h.getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('.cards').first().isVisible(), false, 'block did not fold');
      await h.click();
      assert.ok(await page.locator('.cards').first().isVisible());
    });

    await check(`[${tag}] player's tournament is outlined in accent and listed first in its section`, async () => {
      assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.t.mine')).borderTopColor), ACCENT);
      for (const c of await page.locator('.cards').all()) {
        if (await c.locator('.t.mine').count()) assert.match(await c.locator('.t').first().getAttribute('class'), /mine/);
      }
    });

    await check(`[${tag}] tournament icon opens the tournament screen, not the accordion`, async () => {
      const card = page.locator('.t[data-id="ucl"]');
      await card.locator('.t-icon').click();
      assert.match(await page.locator('#toast').innerText(), /экран турнира/i);
      assert.doesNotMatch(await card.getAttribute('class'), /\bopen\b/);
    });

    await check(`[${tag}] real tournament: switch under the row with its note, white timeline, my match first`, async () => {
      const card = page.locator('.t[data-id="ucl"]');
      const h0 = (await card.boundingBox()).height;
      await card.locator('[data-rail]').click();
      await page.waitForTimeout(450);
      assert.ok((await card.boundingBox()).height > h0 + 150, 'did not expand');
      const sw = await card.locator('.sw').boundingBox(), head = await card.locator('.t-head').boundingBox(), tl = await card.locator('.tl').boundingBox();
      assert.ok(sw.y > head.y + head.height && sw.y < tl.y, 'switch must sit between the row and the timeline');
      assert.ok(sw.x < head.x + 40, 'switch must be on the left');
      assert.equal(await card.locator('.tl-card').count(), 0, 'stage details must wait for a tap');
      const fill = await card.locator('.tl-fill').evaluate(e => getComputedStyle(e).backgroundImage);
      assert.doesNotMatch(fill, /220, 242, 62/, 'timeline must be white');
      assert.match(await card.locator('.matches .m').first().getAttribute('class'), /\bme\b/, 'my match is not first');
      assert.equal(await card.locator('.m.me').innerText().then(t => /Твой матч|Фан-клуб/.test(t)), false, 'owner label must be gone');
      await card.locator('.sw').click();
      assert.match(await page.locator('.t[data-id="ucl"] .sw-note').innerText(), /Результаты игроков BofP/);
      assert.equal(await page.locator('.t[data-id="ucl"] .sw .k img').count(), 1, 'on-state icon missing');
      await page.screenshot({ path: path.join(SHOTS, `${tag}-expanded.png`) });
      await page.locator('.t[data-id="ucl"] .sw').click();
    });

    await check(`[${tag}] live row: time/status top-right, red score`, async () => {
      const row = page.locator('.t[data-id="ucl"] .m.live').first();
      assert.ok(await row.count(), 'no live match in UCL today');
      const st = await row.locator('.m-st').boundingBox(), r = await row.boundingBox();
      assert.ok(st.y - r.y < 14 && r.x + r.width - (st.x + st.width) < 20, 'status not in the top-right corner');
      assert.equal(await row.locator('.m-sc').evaluate(e => getComputedStyle(e).color), 'rgb(255, 106, 85)');
      const sched = page.locator('.t[data-id="ucl"] .m.sched .m-st').first();
      assert.match(await sched.innerText(), /^\d{2}:\d{2}$/);
    });

    await check(`[${tag}] timeline node toggles its stage card`, async () => {
      const card = page.locator('.t[data-id="ucl"]');
      await card.locator('.tl-node.final').click();
      const det = page.locator('.t[data-id="ucl"] .tl-card');
      assert.ok(await det.isVisible(), 'stage details did not open');
      assert.match(await det.locator('.n').innerText(), /Финал/);
      await page.locator('.t[data-id="ucl"] .tl-node.final').click();
      assert.equal(await page.locator('.t[data-id="ucl"] .tl-card').count(), 0, 'second tap should close details');
    });

    await check(`[${tag}] BofP Series cards have no switch; BofP Champions League is on UCL days`, async () => {
      assert.equal(await page.locator('.t[data-id="bcl"]').count(), 1, 'BofP Champions League missing');
      for (const id of ['acl', 'bcl']) {
        await page.locator(`.t[data-id="${id}"] [data-rail]`).click();
        await page.waitForTimeout(400);
        assert.equal(await page.locator(`.t[data-id="${id}"] .sw`).count(), 0, `${id} has a switch`);
      }
      assert.ok(await page.locator('.t[data-id="bcl"] .crest-img').count() > 5, 'fan-club crests missing');
    });

    await check(`[${tag}] touch targets ≥ 44px`, async () => {
      for (const sel of ['#searchBtn', '.day', '.t-rail', '.t-icon', '.t.open .m-star', '.tab', '.section-h']) {
        const b = await box(sel);
        assert.ok(b.width >= 44 && b.height >= 44, `${sel} ${b.width}x${b.height}`);
      }
    });

    await page.locator('.scroll').evaluate(n => (n.scrollTop = 0));
    await page.screenshot({ path: path.join(SHOTS, `${tag}-today.png`) });

    await check(`[${tag}] BIG 5: West, my league first and open, white headings, short subtitle`, async () => {
      await page.locator('.day[data-day="2024-08-24"]').click();
      await page.waitForSelector('.t[data-id="g5"]');
      const card = page.locator('.t[data-id="g5"]');
      assert.match(await card.locator('.t-meta').innerText(), /^Wst · L2 · Pls \d+$/);
      assert.match(await page.locator('.t[data-id="r5"] .t-meta').innerText(), /^Лиги BofP · Тур \d$/);
      await card.locator('[data-rail]').click();
      await page.waitForTimeout(450);
      assert.equal(await card.locator('.seg [aria-selected="true"]').innerText(), 'West');
      assert.equal(await card.locator('.lg.open').count(), 1, 'only my league should be open');
      assert.match(await card.locator('.lg').first().locator('.nm').innerText(), /Лига 2/);
      assert.equal(await card.locator('.lg .nm').first().evaluate(e => getComputedStyle(e).color), WHITE);
      assert.doesNotMatch(await card.innerText(), /Твоя лига|Ұлы жүз ·/i);
      assert.match(await card.locator('.lg.open .m').first().getAttribute('class'), /\bme\b/);
      for (const n of await card.locator('.lg .cnt-wrap').allInnerTexts()) assert.ok(+n.split('/')[0] > 0, 'empty league listed');
      await card.locator('.seg [data-side="East"]').click();
      assert.equal(await page.locator('.t[data-id="g5"] .seg [aria-selected="true"]').innerText(), 'East');
      await page.locator('.t[data-id="g5"] .seg [data-side="West"]').click();
      await page.locator('.t[data-id="g5"]').scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.join(SHOTS, `${tag}-big5.png`) });
    });

    await check(`[${tag}] every listed tournament has matches that day`, async () => {
      for (const d of ['2024-08-17', '2024-08-18', '2024-08-22', '2024-08-25', '2024-08-28']) {
        await page.locator(`.day[data-day="${d}"]`).click();
        await page.waitForTimeout(100);
        for (const n of await page.locator('.t-rail .cnt-wrap').allInnerTexts()) assert.ok(+n.split('/')[0] > 0, `${d}: empty tournament`);
      }
    });

    await check(`[${tag}] past day: final scores, no prediction chips or picks`, async () => {
      await page.locator('.day[data-day="2024-08-17"]').click();
      await page.waitForSelector('.t');
      assert.equal(await page.locator('.t .t-act .act').count(), 0, 'past day shows chips');
      await page.locator('.t.mine [data-rail]').first().click();
      await page.waitForTimeout(450);
      const me = page.locator('.t.open .m.me').first();
      assert.doesNotMatch(await me.innerText(), /прогноз/i, 'my match still shows a pick');
      assert.match(await me.locator('.m-st').innerText(), /Завершён/);
      await page.screenshot({ path: path.join(SHOTS, `${tag}-past.png`) });
    });

    await check(`[${tag}] alert day: lineup action is only on the real tournament`, async () => {
      await page.locator('.day[data-day="2024-08-27"]').click();
      await page.waitForSelector('.t.mine');
      assert.equal(await page.locator('.t[data-id="ucl"] .act.squad').count(), 1, 'no "Не в составе" chip');
      assert.equal(await page.locator('.t.series .act.squad').count(), 0, 'BofP Series cannot have a lineup problem');
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
