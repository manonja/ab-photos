---
name: layout-studio
description: Build an interactive alignment artifact (column grid or golden-ratio guides) so Anton can visually position page blocks, then implement the saved numbers exactly in the site.
---

# Layout Studio

Workflow for iterating on page layout (title / date / subtitle / body placement)
through a self-saving artifact with alignment guides, instead of guessing CSS
values. Two variants exist; ask which (or infer from the request):

- **Grid studio** — N columns with gutters (like a print grid). State:
  `{ncols, gutter, marginL, marginR, <font sizes>, blocks: {name: {col, span, y, textCols}}}`.
  Implement as CSS grid (`lg:grid-cols-N`, `col-start/span`).
- **Golden studio** — guides at recursive golden-section cuts (0.382 / 0.618)
  of screen width AND height. State:
  `{marginL, marginR, spiral, <font sizes>, blocks: {name: {x0, x1, yr, textCols}}}`
  where x0/x1/yr are ratios. Implement as absolute positioning with `%` values
  (`lg:absolute lg:left-[47.214%] lg:top-[48.5%] lg:w-[38.197%]`).

Reference implementations (copy the whole file and adapt content/seed):
`references/7rad-grid-studio.html` and `references/7rad-golden-studio.html`
beside this skill; both are published artifacts (Grid Studio
`c6de436c-...`, Golden Studio `24c46fc0-...`).

## Building the artifact

1. Canvas: fixed-size div (`min(100%,1500px) × 1150px`) with a darkened
   project photo as background (extract the base64 `url(data:image/jpeg...)`
   from an existing studio file; don't re-encode). Real site copy in the
   blocks — title, date, subtitle, body — styled to match the site.
2. Top bar: range sliders for margins and every font size, each labeled with
   its px value; a Save button; a status `#msg` span.
3. Guides layer (`pointer-events:none`):
   - Grid variant: column bands + amber gutter bands + red margin bands.
   - Golden variant: vertical lines at depth-2 golden cuts, horizontal lines
     at **depth-4** cuts (users need many "threads"); label every horizontal
     line with `(r*100).toFixed(1) + '%'` of screen height, every vertical
     with its ratio. Brightness encodes depth.
4. Blocks: absolutely positioned, draggable. **Snapping must use the same
   ratio set as the drawn lines** (a coarse snap set with fine lines drawn
   was a real bug — blocks couldn't reach most lines). While dragging,
   highlight the snapped line (solid white + label) so the target is visible.
5. Precision controls (users find pure drag too fiddly):
   - Hover toolbar per block: ◀▶ / L− L＋ R− R＋ step edges, Y− Y＋ step the
     vertical thread, `text− / text＋` set 1–3 text columns on the body
     (text columns must be independent of block span — never derived).
   - Click selects a block (stays selected after mouse-up); arrow keys nudge
     one guide line at a time. Wrap `setPointerCapture` in try/catch.
6. Golden variant extra: Fibonacci-spiral overlay on a **2D canvas** element
   (quarter `ctx.arc()`s, radius shrinking by 1/φ, fitted to the largest
   golden rectangle, plus faint subdivision squares). A `spiral` button
   cycles off/↖/↗/↘/↙ via mirror transforms. Do NOT use SVG for the spiral —
   it silently failed inside the artifact frame; canvas 2D works.
7. Self-save: `capabilities: {artifact: {}}`; capture
   `TEMPLATE = '<!doctype html>\n' + document.documentElement.outerHTML`
   before any render; serialize by locating the FIRST
   `<script id="state" type="application/json">` with `indexOf` (never regex —
   the page JS contains the same string literal) and splicing in
   `JSON.stringify(state).replace(/</g, '\\u003c')`;
   `await (await claude.use('artifact')).publish(html)`.
8. Seed the state with the currently implemented site layout so the studio
   opens showing reality. Default `marginL === marginR` (asymmetric seeds get
   reported as "missing margin"). Guard new state fields with defaults after
   `JSON.parse` (older saved versions won't have them).
9. Test locally before publishing: `python3 -m http.server` in the scratchpad
   (file:// is blocked in Playwright) + `browser_evaluate` to click buttons /
   dispatch arrow keys, screenshot. Mojibake for arrows/− locally is just the
   bare server's missing charset; the artifact wrapper adds UTF-8.

## Iterating

- Publish, give Anton the URL, explain controls in one short list.
- A `task-notification: artifact-changed` means he saved. Re-read with
  `Artifact action:"read"` and grep the saved full-HTML file for
  `<script id="state"` to get the numbers. If watches died ("connection
  lost"), ask him to say "saved".
- Republish improvements from the local scratchpad file (same path → same
  URL). Read the live artifact first if a save may have happened; publishing
  stale content conflicts and hands you the live version to merge.

## Implementing the saved layout

- Site margins: root layout `main` has `p-6` (24px); reach other margins by
  adding the difference on the project block (e.g. 32px total → `lg:px-2` /
  `lg:inset-x-2`), and say so in a comment.
- Grid variant → CSS grid with explicit `row-start` so same-row blocks align
  by construction. Golden variant → `lg:absolute` children inside a
  `relative` full-height hero; x/width as % of the margin-inset box, y as %
  of hero height (`top-[41.6%]`).
- The studio canvas is 1150px tall but screens vary: fixed-px type chosen
  there must scale with viewport height to keep proportions —
  `fontSize: clamp(80px, min(24vw, 30svh), 350px)` (350/1150 ≈ 30svh).
- Keep the mobile (<lg) stacked flow untouched; apply studio geometry behind
  `lg:` only.
- JSX gotcha (hit twice): a `{/* comment */}` before the root element of a
  `return (...)` is a syntax error — put comments inside the element.
- Verify: biome, jest `src/app/work`, commit, push,
  `npm run deploy:preview`, then Playwright-screenshot the preview at a
  large viewport and compare against the studio before reporting done.
