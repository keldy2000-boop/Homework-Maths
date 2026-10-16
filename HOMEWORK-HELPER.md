# Homework helper: handover notes

This repository hosts a homework helper for two children, one in Year 4 and one in Year 6 (UK primary school). It is published with GitHub Pages from the `main` branch, root folder:

https://keldy2000-boop.github.io/Homework-Maths/

## The one file that matters

Everything lives in **`index.html`**: one self-contained page with its own CSS and JavaScript. There is no build step and no other file is loaded, apart from two Google Fonts (Andika and Patrick Hand) with fallbacks.

The phone home-screen icon uses `apple-touch-icon.png` (iPhone), `icon-192.png` and `icon-512.png` (Android, via `manifest.webmanifest`) and `favicon-32.png` (browser tab). The manifest uses `"display": "browser"` on purpose: the icon opens the normal browser, so saved progress is the same whether the page is opened from the icon or a bookmark.

Other files in this repo (`app.js`, `style.css`, `visuals.js`, `homework/`, `tools/`) come from an earlier, separate version. `index.html` does not use them. Ask before deleting them.

## Rules to keep

1. **No children's names anywhere**: not in the page, the code, comments, storage keys or commit messages. Refer to the children as "Year 4" and "Year 6".
2. **Never show an answer up front.** Each maths question gives 3 tries before the step-by-step help unlocks. During those tries, feedback says only "not quite" and how many tries are left, with no hints.
3. **Walkthroughs stop just before the final answer** and end with "Your turn!". Where showing the method would reveal the answer (for example × 10 or ÷ 100), use a similar example with different numbers instead.
4. **UK English and UK school terms**: exchange, carry, bus stop method, rubber, Year 4 and Year 6.
5. **Mobile first.** The children use phones, so everything must work by touch and in light and dark mode.

## How the page is organised

**Screens** (`<section>` elements, shown one at a time):

- `#pick`: the front page. It has the Year 4 and Year 6 buttons and a **Test** section (`#tests`). The app always opens here.
- `#home`: a year's home page, with **Maths** and **Spellings** tabs.
- `#lesson`: one maths question. It has a squared-paper working-out pad (canvas), an answer box with 3 tries, and the animated walkthrough (`#how`), which unlocks after 3 tries.
- `#results`: the maths results page, with a score, a question grid and topics to practise.
- `#spellTest` and `#spellResults`: the spelling test and its results.

**Data in the script:**

- `Q4` and `Q6` hold the maths questions. Each is wrapped in its own function, so its drawing helpers don't clash. A question looks like this:
  - `q`: the question as HTML. `BOX` makes an empty answer box and `fr(n,d)` makes a fraction.
  - `ans`: a number, or `[top, bottom]` for fractions, which also need `frac:true`.
  - `hint`: shown after the help unlocks.
  - `special`: optional messages for common wrong answers, for example `{243: "…"}`.
  - `say`: an array of step texts. The last step is the "Your turn!" step.
  - `draw(s)`: returns the HTML for step `s`, built with that module's helpers (`life`, `pen`, `colm`, `bar` and others).
- `SPELL4` and `SPELL6` hold the spelling lists: `{focus:'inter', words:[{w, m, s}]}`, where `m` is the meaning and `s` is a sentence with `______` where the word goes.
- `TOPICS4` and `TOPICS6` hold the topic groups for the results page, as question numbers counted from 1.
- `YEARS` ties each year to its questions, spellings, topics and settings. Year 4 uses stacked boxes for fraction answers and has read-aloud in the walkthroughs. Year 6 types fractions like `1 3/4`.
- `TESTS` holds the front-page test questions:
  - `opts`: the answer cards.
  - `ans`: the index of the correct card.
  - `why`: a message for each wrong card, shown after the help unlocks.
  - `say` and `draw(s)`: the explainer, which uses a parallel example.

**Saved progress** is kept in `localStorage` on each device:

- `y4-*` and `y6-*` keys hold each year's state, working out, spellings and last tab.
- `hh-year` holds the last year chosen.
- `hh-test` holds the front-page test progress.

There is also a one-off migration from older storage names, so keep it.

## Adding things

- **A maths question:** add an object to `Q4` or `Q6`, and add its number to the right entries in `TOPICS4` or `TOPICS6`.
- **A whole new week of maths:** replace `Q4` or `Q6` and its `TOPICS`, then change that year's `wk` in `YEARS` (add one if it has none). When the year is next opened, each device clears the old answers and working out for that year only (saved as `y4-wk` / `y6-wk`). Also update the question count on the front-page year button.
- **A new spelling list:** replace the words in `SPELL4` or `SPELL6`, and update `spTitle` and `spRule` for that year in `YEARS`. Changing `spTitle` clears that year's saved spelling test on each device. If the words don't share a letter pattern, set `focus:''`.
- **A second set of maths in the same week:** add the new questions to the end of `Q4` or `Q6` (and to `TOPICS`), and leave `wk` unchanged so earlier answers are kept.
- **A front-page test question:** add an object to `TESTS`.

## Checking changes

Run the check script before every commit:

```
npm install jsdom
NAMES="name1,name2" node check-helper.js
```

The script:
- renders every walkthrough step for both years
- makes sure every stored answer is accepted
- runs both spelling tests and the front-page test
- with `NAMES` set, fails if any of those names appear in `index.html`

It should end with "All checks passed".

## Publishing

Commit and push to `main`. GitHub Pages updates within a couple of minutes, and the **Actions** tab shows "pages build and deployment". The file must stay named exactly `index.html` in the root folder.
