// Quick check for the homework helper (index.html).
// Run:  npm install jsdom   then   node check-helper.js
// Optional: NAMES="name1,name2" node check-helper.js  -> fails if any of those names appear in index.html
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
let fails = 0;
const ok = (cond, msg) => { console.log((cond ? 'PASS  ' : 'FAIL  ') + msg); if (!cond) fails++; };

function load(pre = []) {
  const errors = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://example.github.io/Homework-Maths/',
    beforeParse(w) {
      pre.forEach(([k, v]) => w.localStorage.setItem(k, v));
      w.HTMLCanvasElement.prototype.getContext = () => null;
      w.scrollTo = () => {}; w.Element.prototype.scrollIntoView = () => {};
      w.SpeechSynthesisUtterance = function (t) { this.text = t; };
      w.speechSynthesis = { getVoices: () => [], speak: () => {}, cancel: () => {}, addEventListener: () => {} };
      w.addEventListener('error', e => errors.push(e.message));
    }
  });
  const w = dom.window, d = w.document;
  return { w, d, $: id => d.getElementById(id), errors };
}

// 0. no children's names
if (process.env.NAMES) {
  const found = process.env.NAMES.split(',').map(s => s.trim()).filter(Boolean)
    .filter(n => new RegExp(n, 'i').test(html));
  ok(found.length === 0, 'no listed names appear in index.html' + (found.length ? ' (found: ' + found.join(', ') + ')' : ''));
}

// 1. front page
{
  const { d, $, errors } = load();
  ok(!$('pick').hidden, 'opens on the front page');
  ok(d.querySelectorAll('.yearbtn').length === 2, 'front page has Year 4 and Year 6 buttons');
  ok(d.querySelectorAll('#tests .tcard').length >= 1, 'Test section has at least one question');
  ok(errors.length === 0, 'no script errors on load ' + errors.join(' | '));
}

// 2. every walkthrough step renders, and every stored answer is accepted by the checker
for (const y of ['y4', 'y6']) {
  const { w, d, $, errors } = load();
  d.querySelector(`.yearbtn[data-y="${y}"]`).click();
  const Q = w.eval(`YEARS.${y}.Q`);
  let bad = 0, steps = 0;
  Q.forEach((q, i) => { for (let s = 0; s < q.say.length; s++) { const h = q.draw(s); steps++; if (typeof h !== 'string' || /undefined|NaN|\[object/.test(h)) { bad++; console.log('   bad step', y, 'Q' + (i + 1), 's' + s); } } });
  ok(bad === 0, `${y}: all ${steps} walkthrough steps render`);
  let wrong = 0;
  Q.forEach((q, i) => {
    w.eval(`openQ(${i})`);
    if (q.frac && $('a2')) { $('a1').value = String(q.ans[0]); $('a2').value = String(q.ans[1]); }
    else if (q.frac) { $('a1').value = q.ans[0] + '/' + q.ans[1]; }
    else { $('a1').value = String(q.ans); }
    $('check').click();
    if (!/ok/.test($('fb').className)) { wrong++; console.log('   not accepted', y, 'Q' + (i + 1), $('fb').textContent); }
  });
  ok(wrong === 0, `${y}: all ${Q.length} answers accepted`);
  ok(errors.length === 0, `${y}: no script errors ` + errors.join(' | '));
}

// 3. spelling test: typing every word correctly gives full marks
for (const y of ['y4', 'y6']) {
  const { w, d, $, errors } = load();
  d.querySelector(`.yearbtn[data-y="${y}"]`).click();
  $('tabSpell').click(); $('spStart').click();
  const n = w.eval('SPS.run.order.length');
  for (let k = 0; k < n; k++) {
    const word = w.eval('curW().w');
    word.split('').forEach(c => d.querySelector(`#spKb [data-k="${c}"]`).click());
    $('spCheck').click(); $('spNext').click();
  }
  ok(!$('spellResults').hidden && $('sprScore').textContent === String(n), `${y}: spelling test full marks shows ${n}/${n}`);
  ok(errors.length === 0, `${y}: no spelling errors ` + errors.join(' | '));
}

// 4. front page test question: three wrong answers unlock help, then the right one solves it
{
  const { w, d, $, errors } = load();
  const T = w.eval('TESTS[0]');
  const wrongs = T.opts.map((_, i) => i).filter(i => i !== T.ans).slice(0, 3);
  wrongs.forEach(i => d.querySelector(`.opt[data-t="0"][data-o="${i}"]`).click());
  ok(!!d.querySelector('.thelp'), 'test: help unlocks after 3 wrong answers');
  d.querySelector(`.opt[data-t="0"][data-o="${T.ans}"]`).click();
  ok(/Solved/.test(d.querySelector('.tcard .thead').textContent), 'test: right answer marks it solved');
  ok(errors.length === 0, 'test: no script errors ' + errors.join(' | '));
}

console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks passed');
process.exit(fails ? 1 : 0);
