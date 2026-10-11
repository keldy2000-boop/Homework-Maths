# Homework helper (Year 6, age 10 · Year 4, age 8)

Static site on GitHub Pages (https://keldy2000-boop.github.io/Homework-Maths/): `index.html` + `app.js` (engine) + `visuals.js` (walkthrough pictures) + `style.css`.
Each child's weekly homework is one file in `homework/<year6|year4>/<YYYY-MM-DD>.js`, listed in `homework/weeks.js`.

When the parent says "new homework" (or that they've added photos), follow the `new-homework` skill in `.claude/skills/new-homework/`.

- The site is public: show children only as "Year 6" / "Year 4". Never put their names in site files, week files or commit messages.
- Photos in `inbox/` and `photos/` must never be committed (they're in .gitignore).
- Progress is saved in each tablet's browser per week (`hw-<child>-<id>-state`). Year 6's first set keeps its old storage key `y6old` (don't change it, or saved progress is lost).
- The site root (`index.html`) is the link the children already use; it shows the "Who's doing homework?" picker.
- Local preview: launch config `homework` → http://localhost:8765
