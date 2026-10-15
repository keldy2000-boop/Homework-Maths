# Homework helper (Year 6, age 10 · Year 4, age 8)

Static site on GitHub Pages from `main`, root folder (https://keldy2000-boop.github.io/Homework-Maths/). Full handover notes: `HOMEWORK-HELPER.md`.

**The live site is `index.html` alone**: one self-contained page with its own CSS and JS, no build step (only Google Fonts Andika and Patrick Hand load from outside). It must stay named `index.html` in the root.
`app.js`, `style.css`, `visuals.js`, `homework/`, `tools/` and the `new-homework` skill in `.claude/skills/` belong to an earlier version that `index.html` does not use. Ask the parent before deleting them, and before following that skill (it builds weeks for the old version).

## Rules
- The site and repo are public: no children's names anywhere (page, code, comments, storage keys, commit messages). Say "Year 4" / "Year 6".
- Never show an answer up front: 3 tries per maths question, feedback only "not quite" + tries left, then the step-by-step help unlocks.
- Walkthroughs stop just before the final answer and end with "Your turn!". If the method would give the answer away (e.g. × 10, ÷ 100), use a similar example with different numbers.
- UK English and school terms: exchange, carry, bus stop method, rubber, Year 4 / Year 6.
- Mobile first: everything works by touch, in light and dark mode.
- Photos in `inbox/` and `photos/` must never be committed (they're in .gitignore).

## How index.html is organised
- Screens (`<section>`, one shown at a time): `#pick` front page (year buttons + `#tests` Test section; app always opens here), `#home` (Maths / Spellings tabs), `#lesson` (one question: squared-paper pad, answer box, `#how` walkthrough), `#results`, `#spellTest`, `#spellResults`.
- `Q4` / `Q6`: maths questions, each in its own function. Fields: `q` (HTML; `BOX` = answer box, `fr(n,d)` = fraction), `ans` (number, or `[top,bottom]` with `frac:true`), `hint`, optional `special` (messages for common wrong answers), `say` (step texts, last is "Your turn!"), `draw(s)` (HTML for step `s`).
- `SPELL4` / `SPELL6`: `{focus, words:[{w, m, s}]}` (`s` has `______` for the word). `TOPICS4` / `TOPICS6`: topic groups by 1-based question number.
- `YEARS` ties each year together (Year 4: stacked fraction boxes + read-aloud; Year 6 types fractions like `1 3/4`). `TESTS`: front-page questions (`opts`, `ans` index, `why` per wrong card, `say`/`draw`).
- Progress is in each device's `localStorage`: `y4-*` / `y6-*`, `hh-year`, `hh-test`. Keep the one-off migration from older storage names.

## Adding things
- Maths question: add to `Q4`/`Q6` and its number to `TOPICS4`/`TOPICS6`.
- A new week's maths (replacing all of `Q4`/`Q6`): also change that year's `wk` in `YEARS` (add one if missing), so each device clears last week's answers and working out for that year (`y4-wk` / `y6-wk`). Update the question count on the front-page year button.
- Spelling list: replace words in `SPELL4`/`SPELL6`; update `spTitle`/`spRule` in `YEARS`.
- Front-page test question: add to `TESTS`.

## Before every commit
Run `node check-helper.js` (needs `jsdom`; keep `node_modules` out of the repo). It should end "All checks passed". Setting `NAMES="a,b"` makes it fail if those names appear in `index.html`. Pass the names only on the command line, never in a file.
After pushing, GitHub Pages updates in a couple of minutes (Actions tab: "pages build and deployment").
