# Homework helper (Year 6 10, Year 4 8)

Static site on GitHub Pages: `index.html` + `app.js` (engine) + `visuals.js` (walkthrough pictures) + `style.css`.
Each child's weekly homework is one file in `homework/<child>/<YYYY-MM-DD>.js`, listed in `homework/weeks.js`.

When the parent says "new homework" (or that they've added photos), follow the `new-homework` skill in `.claude/skills/new-homework/`.

- Photos in `inbox/` and `photos/` must never be committed (they're in .gitignore).
- Progress is saved in each tablet's browser per week (`hw-<child>-<id>-state`). Year 6's first set keeps the old key `y6old`.
- The site root (`index.html`) is the link the girls already use; it shows the "Who's doing homework?" picker.
- Local preview: launch config `homework` → http://localhost:8765
