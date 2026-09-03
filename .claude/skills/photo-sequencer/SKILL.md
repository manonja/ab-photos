---
name: photo-sequencer
description: Interactively curate a project's photo set (add/remove/reorder/recaption) via a drag-and-drop artifact, then apply the saved plan to R2, production D1, and seed.sql. Use when Anton wants to add photos to a project or change its sequence/captions.
---

# Photo sequencer workflow

Curate the photos of one portfolio project (e.g. `7-rad`, `pyrenees`) through a self-saving
artifact editor, then apply the result everywhere it lives.

## 1. Gather current state

- Fetch current rows: `curl -s -A "Mozilla/5.0" https://bossenbroek.photo/api/photos/<slug>`
  (assets.bossenbroek.photo returns **403 without a browser User-Agent** — always pass `-A`).
- Photo row shape: `id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id`.
  Only `desktop_blob` is ever rendered; `mobile_blob`/`gallery_blob` stay `''`.

## 2. Build the editor artifact

- Template: `scratchpad/7rad-sequence-editor.html` from session 765de404 (or rebuild: dark
  single-theme list; rows = drag handle / seq number / thumbnail / caption input / remove toggle;
  removed rows grouped under a divider; counts + Save button in a sticky bar).
- Thumbnails must be **embedded data URIs** (artifact CSP blocks external images):
  `sips --resampleWidth 360 -s format jpeg -s formatOptions 55` → base64. ~18KB each.
- State lives in `<script id="state" type="application/json">…</script>`. Item fields:
  `id, caption, sequence, url, status ('existing'|'new'), source (local path, new only),
  removed (bool), thumbData`.
- Declare `capabilities: {artifact: {}}`; the page saves by republishing itself
  (`claude.use('artifact')` → `artifact.publish(rebuilt html)`), which notifies the session.
- **Injection gotcha**: the page JS contains the literal string `<script id="state"…>` — never
  regex-replace state with a pattern that can match inside the JS (it once clobbered the whole
  script). Use `str.index()` of the first occurrence, or a `__STATE_JSON__` placeholder in a
  clean template. Escape `<` as `<` in the injected JSON.

## 3. Iterate rounds

On each save notification: re-read the artifact, extract state, re-sort (keepers by sequence,
removed at bottom), republish the tidied view, and summarize the plan back. Offer caption fixes:
derive date/time from the filename pattern `YYYY-MM-DD HH.MM.SS…` → `H:MM, D Month YYYY`
(capitalized month); keep Anton's place text. Only apply when Anton explicitly says so.

## 4. Apply (only on explicit go-ahead)

1. **Backup** current rows to scratchpad JSON:
   `npx wrangler d1 execute ab-photos --remote --json --command "SELECT … WHERE project_id='<slug>'"`.
2. **R2 upload** new files to bucket `ab-photos-images`, key `<slug-nodash>/fullscreen/<name>`
   with spaces → `+` (matches historic keys, e.g. `7rad/fullscreen/2024-03-05+05.35…jpg`):
   `npx wrangler r2 object put "ab-photos-images/<key>" --file "<local>" --content-type image/jpeg --remote`.
   Public URL = `https://assets.bossenbroek.photo/` + URL-encoded key (`+` → `%2B`).
3. **D1**: one SQL file — `INSERT OR REPLACE` all keeper rows (new ids via uuid4) then
   `DELETE … WHERE id IN (…)` for removals; run with
   `npx wrangler d1 execute ab-photos --remote --file=…`.
4. **seed.sql**: replace the project's photo INSERT lines in `src/db/seed.sql` so repo matches
   production (blog:publish never deletes, so seed.sql alone can't remove rows).
5. **Verify**: `curl https://bossenbroek.photo/api/photos/<slug>` — count, order, captions.
   Site pages revalidate hourly, so the /work page may lag the API.
6. Commit seed.sql.

## Auth gotcha

Wrangler OAuth expires; on `Authentication error [code: 10000]`, ask Anton to run
`! npx wrangler login` and **pick the personal Gmail account** (the studio account has an empty
duplicate DB — see memory `cloudflare-accounts`).
