# Walkthrough picture helpers (visuals.js)

All return HTML strings; concatenate them in `draw(s)`. `s` = current step (0-based). Most take a step `k` at which the
item first appears (it animates in when `s===k` and stays after).

## Basics
| Helper | What it does |
|---|---|
| `BOX` | empty answer box |
| `fr(n,d)` | stacked fraction |
| `NB` | non-breaking space for big numbers: `18${NB}238` |
| `MQ` | pink "?" |
| `pen(text, cls, anim, delay)` | handwritten note. `cls:'rose'` = pink; `anim:'write'` / `'fade'` |
| `D(t)` | `style="--d:t s"` animation delay |
| `life(s,k,r,ad,rd,a)` | appears at step k (anim a, default `'pop'`), fades away at step r. Returns `{c,d}` or null |
| `el(tag,cls,L,inner)` | element using a `life()` result |
| `notesDraw(q,s)` | used automatically when a question has `notes` and no `draw` |

## Column methods: `colm(cols, rows, cls)`
`cols` = number of columns, or an array like `['c','c','.','c']` where `'.'` is a narrow decimal-point column.
Rows: `R(...cells)` normal row, `CR(...cells)` small carry row above, `'-'` a ruled line. `cls:'tight'` for 6+ columns.
Cells: plain string, `QB` (dashed ? box), `hc(t,on)` (highlight when on), `wd(s,k,t,delay)` (handwritten digit from step k, `QB` before),
`carry(s,k,t,delay,hx,hy,on)` (carry digit hopping in), `rl('×6')` (row label), `{t:'8',c:'strike anim'}` (crossed out for exchanging).
See starter.js Q14 (800 − 524 exchange), Q19 (short ×), Q22/Q28 (long ×), Q21/Q23 (decimals), Q24.

## Bus stop division: `bus(s,{dv, ds, k0, top, carries, hl})`
`dv` divisor; `ds` digits inside; `top[i]` `{w:k,t:'0'}` written at step k or `{q:k}` ? box from step k; `carries` `[{i,t,k,d}]`; `hl(s)` index to highlight. See starter Q11, Q20, Q25, Q26.

## Place value grid: `pvGrid(s,{cols, from, shift, k0, kShift, zeros, faint})`
Digits slide left (`shift:-1` for ×10) or right (`shift:1`/`2` for ÷10/÷100). `cols` like `['H','T','O','.','t','h']`; `from` = {colIndex:'digit'}. See starter Q4, Q8, Q18.

## Bars
- `bar(s,k,whole,parts,kp)`: bar model, `parts=[{t,f,c}]`, `f` = relative width, `c:'hatch'|'shade'`. Missing-number and fraction-of questions.
- `splitBar(s,{n,m,shade,k0,kShade,kSplit})`: n pieces, shade some, then split each into m (equivalent fractions). Starter Q13/Q15.
- `plainBar(N,shaded,cls)`: plain fraction bar.

## Counting and arrays
- `deal(s,n,groups,kDeal,kPick,picks)`: n counters dealt into groups (sharing/division/fractions of amounts). Starter Q9, Q10.
- `counters(s,k,n,hl,perRow)`: a simple row/grid of n counters (pairs for odd/even: perRow 2; arrays for ×: perRow = columns).
- Squares grid: see starter Q2/Q5 (`.sqg` + `.tl` tiles). Cube: `isoCube()`.

## Younger (Year 4)
- `numLine(s,{a,b,step,labelEvery,k0,marks:[{v,t,k}],jumps:[{from,to,t,k,d}]})`: number line with hopping jumps (adding on, counting back, finding the difference).
- `clock(h,m)`: analogue clock face (use in the question `q` and in `draw`).
- `base10(s,k,h,t,o)`: hundreds flats, tens sticks, ones cubes.

## Anything else
Write inline SVG or HTML in `draw` (shapes, tally charts, bar charts, money coins). Use CSS variables for colour
(`var(--ink)`, `var(--ten)` blue, `var(--one)` amber, `var(--hun)` purple, `var(--rose)` pink, `var(--leaf)` green) so dark mode works.
Keep pictures under ~22rem wide so they fit a phone.
