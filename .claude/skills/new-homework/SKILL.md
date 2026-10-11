---
name: new-homework
description: Turn this week's homework photos (in inbox/year6, inbox/year4) into a new interactive week on the homework helper site, check it, and publish it. Use when the parent says "new homework", "homework's in", "I've uploaded the photos", or similar.
---

# New homework from photos

The parent's whole job is dropping photos into `inbox/` and saying "new homework". Do everything else.
Children (ids used everywhere): **`year6`** (age 10) and **`year4`** (age 8). The site is public: refer to them only as
"Year 6" / "Year 4" in anything that gets published (files, commit messages), even if a sheet shows a name. UK primary maths: use UK words and methods
(column method, "exchange" not "borrow", bus stop division, bar models, number lines, "lots of", ones/tens/hundreds).

## 1. Find the photos
- Look in `inbox/year6/`, `inbox/year4/`, and loose files in `inbox/`.
- Loose file: work out whose sheet it is from the year/level printed on it or the maths (times tables/number bonds/simple clocks = year4; long multiplication/fractions/decimals = year6). If you really can't tell, ask.
- Nothing there? Tell the parent to drop photos in `inbox\year6` or `inbox\year4` and stop.

## 2. Read the photos
- Prep first (converts iPhone HEIC, fixes rotation, shrinks):
  `python -I tools/prep_photos.py inbox/<child> <scratchpad>/<child>`
  If Pillow is missing: `pip install pillow pillow-heif` (ask once before installing).
- Read every prepped image. Zoom in on anything small by reading again; don't guess digits.
- Transcribe **every** question in order, keeping the sheet's own numbering (1, 2, 3a, 3b…).
- Skip anything the child has already answered in pen only if the parent says so; by default include everything.
- If a digit, symbol or picture is genuinely unreadable, list it and ask the parent before going on. Never invent a question.
- Not maths (spellings, reading log, etc.)? Tell the parent; this site is for maths only.

## 3. Solve and double-check
- Solve each question. Then **verify every answer with Python** (one `python -c` with all the sums), comparing to your own answers. Fix any mismatch.
- For word problems, pictures, clocks, money, measures: write down the reasoning, then check the arithmetic in Python.

## 4. Write the week file
Week id = Monday of the current week, `YYYY-MM-DD` (if that id is already taken for this child, add `-2`).
Create `homework/<child>/<id>.js`. Copy patterns from `example-week.js` (younger-style, every answer type) and
`homework/year6/starter.js` (older-style: column methods, bus stop, place value grids, fraction bars). Helper reference: `visuals.md`.

```js
HW.week({child:'year4',id:'2026-10-12',
topics:[['Adding and taking away',[1,2,5]], ...],   // question POSITIONS (1-based) in the list below
questions:[
 {q:`47 + 25 = ${BOX}`,          // HTML shown big. ${BOX} = answer box, fr(3,4) = fraction, <sup>2</sup>
  ans:72,                        // see answer types below
  special:{62:"Close! ..."},     // predictable wrong answer -> targeted message (shown after help unlocks)
  hint:"Not quite. ...",         // shown for other wrong answers after help unlocks
  say:["step 1 ...", "step 2 ...", "Your turn! ..."],   // the walkthrough text, one per step
  draw(s){ return ... }          // picture for step s (0-based). Or omit draw and give notes:[...] (same length as say)
 },
```
Optional fields: `n:'3a'` (label when it isn't just the position), `long:true` (for sentence-length questions: smaller text),
`tile:'short text'` (shorter version for the home grid), `tip:'Write it like 3:30'` (shown under the answer box).

**Answer types**
- Number (default): `ans:72`. Accepts `£`, commas, spaces and units typed after (`72cm`). For money in pounds use pounds (`ans:2.5`) and say "in pounds" in the tip.
- Fraction: `frac:true, ans:[8,7]`. Any equivalent fraction or mixed number is accepted.
- Words/times: `text:true, ans:['3:30','half past 3','half past three']`. List every reasonable form. Case and trailing full stops are ignored.
- Multiple choice (odd/even, true/false, <, >, =, shape names): `choices:['odd','even'], ans:'odd'`.
- Can't be auto-marked ("explain", "draw", "show your working", reasoning): `open:true`. No `ans`/`hint` needed; help is available straight away.
- Several blanks in one question: split it into separate questions (`n:'4a'`, `n:'4b'`, …).

**Walkthrough rules (these matter most)**
- 3–6 steps. Teach the *method*, then stop at "Your turn!" **Never show or say the final answer** in `say` or `draw`. Leave the last step for the child.
- For method questions (column/bus stop/long multiplication), you may demo the first column or two; for "÷10/×10/×100" use a similar example with different numbers first (see starter.js Q4/Q8/Q18).
- Language: Year 4: short sentences, everyday words, one idea per step. Year 6: can be fuller. Bold the key idea with `<b>`.
- Each step's picture should change with `s`, building up (use `life()`/`s===k` animations like the examples).
- Add a `special` for the 1–3 most likely mistakes (forgot the carry, did the opposite operation, read ² as ×2, skipped a placeholder 0, swapped digits in subtraction, etc.).
- Match the method the sheet shows (e.g. if the worksheet prints a number line, use a number line).
- Topics: 3–8 short groups that make sense to a parent ("Times tables", "Telling the time"). A question may sit in two topics.

## 5. Add it to the list
In `homework/weeks.js`, append to that child's `weeks` (newest LAST):
`{id:'2026-10-12',title:'<short title, e.g. Adding & time>',date:'2026-10-12',file:'homework/year4/2026-10-12.js',count:<number of questions>,v:1}`
If you later change a published week file, bump its `v` so tablets fetch the new version.
If you ever change `app.js`, `visuals.js` or `style.css`, bump the `?v=` on them in `index.html` too.

## 6. Test it in the browser (required)
- `preview_start` with name `homework` (serves this folder on http://localhost:8765).
- Navigate to `http://localhost:8765/#<child>/<id>`, then run in the page:
  `await HW.selfTest('<child>','<id>')` → must return `[]`. Fix everything it reports.
- Check each answer really is accepted: for every question, `openQ(i)`, type the answer into `#a1` (or click the right `.choice`), `check()`, and confirm `fb.textContent` is praise. Then reset that week's progress so the child starts fresh:
  `localStorage.removeItem('hw-<child>-<id>-state')`.
- Screenshot a few walkthrough steps (especially new kinds of picture) to make sure they look right and nothing overflows at phone width (`resize_window` preset mobile, then back to desktop).

## 7. Tidy up and publish
- Move the used photos to `photos/<child>/<id>/` (that folder never goes online).
- Publish: `powershell -File tools/publish.ps1 "Add <Child> homework <id>"`.
  If it fails because git/GitHub isn't set up, tell the parent what's missing (see README.md "One-time setup") instead of retrying.
- Don't publish if you had to guess anything in step 2. Ask first.

## 8. Report to the parent (short)
- Which child, how many questions, the site link with `#year6` / `#year4`.
- A compact table: question → answer, so they can glance-check.
- Anything you weren't sure about, and anything skipped.
