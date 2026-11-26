# Rising Together — Bounded Prototype: Test Log

**Correction, 2026-11-24, Carl's words in substance:** do not use the label "Carl remembers" — among the hundreds of thousands, nothing is from his eyes until he witnesses it. The prototype's hotspot 1 was changed the same day from "Carl remembers" to "Imagined, not yet witnessed by Carl", then further to "Imagined, to be witnessed and experienced by everyone" — the imagined scenes are to be witnessed and experienced by everyone, not only by Carl. The register label "Carl remembers" is removed from this prototype; the Story team's register system that used it must be corrected the same way before any further build.

**Date:** 2026-11-24
**Prototype:** `~/workspace/goals/rising-together/prototype/` — `index.html`, `styles.css`, `app.js`, `assets/`
**Status:** Internal review only. Not publication, not launch, not a live LINE app.

## Visual rebuild — tested 2026-11-25 (this round)

**Verified live 2026-11-25:** GitHub Pages build "built" (commit 8038681bd8).
Live `index.html` 24,816 B with the `lk-note` present; all six web pictures
HTTP 200 with sizes matching local (locker-room 283,118 B; field-line
270,203 B; chofu-street 296,320 B; yokosuka-harbour 154,929 B;
tachikawa-park 134,683 B; tama-meadow 132,263 B); `styles.css` 15,112 B,
`play.css` 6,529 B, `locker.css` 9,612 B, `play.js` 33,394 B,
`phaser-game.js` 28,663 B — all matching local.

**Tested in this VM before deploy (headless Chromium 131, Playwright,
390×844 mobile emulation, `/tmp/rt-visual/test.js` + follow-ups): 31 of 33
checks passed on the first run; the two failures were test artefacts, both
re-probed to PASS.** Locker beats travel locker → tunnel → line → snap →
cheers → replay, with the painted locker room and field line as the scenes
and the honest note visible; stage ground layer and `#play-view` backdrop
show the right painting for every episode; locker hidden on Episodes 2–4,
shown again on Episode 1; Phaser canvas boots and the `chofu-street`
texture is present in the scene; Miki dialogue advances the quest to stage
1 with the ball visible and the status line updated; register mark exact;
Ajinomoto Stadium present; no `<audio>`. Failure 1 ("lk-facts carries
note") was the probe using `innerText` on a closed `<details>` — the note
is in the DOM and `textContent` confirms it. Failure 2 ("failed requests")
was the LINE LIFF SDK (`static.line-scdn.net`, unreachable from this VM —
pre-existing, external) and the clip's metadata preload being aborted by
the browser (the clip itself serves 200, untouched by this change). One
real-browser slowness note: at ~10 fps under SwiftShader, tap-to-walk
crosses the Phaser district slowly — the quest logic itself is verified;
walking speed on a real phone is unmeasured.

**NOT tested — and therefore NOT claimed:** no phone run, no LINE WebView
run. Device test in LINE's real WebView: **NOT RUN** for the new visuals.
The visual record for this rebuild is filed in Drive (Rising Together LINE
Research folder): "Rising Together Visual Rebuild - 2026-11-25.pdf".

**What changed (Carl failed the old visuals — CSS/SVG stick figures, nothing
recognisable):** six painted pictures, supplied as files, are now the scenes.
Full-size originals (~4 MB each) stay in `assets/visuals/`; the app serves
web copies in `assets/visuals/web/` — 1280 px wide JPEGs, ~130–300 KB each,
1.27 MB for all six. No new images were generated.

- **Locker room** (`locker-room.jpg`): the full scene background; the CSS/SVG
  lockers and stick players are hidden, the beat controls and state machine
  are untouched. The honest note is visible under the scene and inside
  "About this moment": "Painted and imagined. Only WILLIAMS 32 is from the
  record — the other jersey numbers and the team nickname in this picture
  are invented by the painting, not facts."
- **Line of scrimmage / field stage** (`field-line.jpg`): background of the
  locker line scene (CSS yard lines and lineman rows hidden — the painting
  already shows the line) and of the stage ground layer for Episode 1. Snap,
  runner break, cheers all still run over the picture.
- **Districts:** Chofu street is the Phaser Chofu district backdrop — loaded
  asynchronously as a texture behind the player, Miki and the ball, with the
  ground/sky/street/field shapes translucent so it shows through; if the
  picture never arrives the painted geometry is the scene and the quest
  still plays. Yokosuka harbour, Tachikawa park and Tama meadow are the
  stage ground layer for Episodes 2–4 and the `#play-view` backdrop behind
  the CSS street for those episodes. **No Phaser scene exists for Episodes
  2–4 — the picture is the stage background with the CSS play street on top,
  and that is what the app does; no Phaser is claimed there.**
- **Known issue, not hidden:** the locker-room painting invents jersey
  numbers 12 and 44, the "Tornadoes" nickname, and details like "1975",
  "vs El Monte", "Nov 20". The field painting invents lineman numbers
  72/76/64/55/63/78/74. Only WILLIAMS 32 is from the record (Hosho 1972).
- **First-3-seconds recognition (from looking at the pictures):** locker
  room — three players from behind, CHOFU sign, WILLIAMS 32, helmets on a
  bench, field through the door; field — seven linemen from behind, packed
  stands, floodlights, goalposts, sunset; Chofu street — cherry blossom,
  tiled-roof houses, drink stand, bicycles, fenced field; Yokosuka harbour
  — stone steps past tailor shops down to fishing boats and a grey naval
  ship at sunset; Tachikawa park — cherry-blossom park with a long concrete
  runway strip through it; Tama meadow — a misty path through tall grass
  to a still lake. **Still not recognisable:** the Tama meadow has no
  building, sign or landmark — nothing in it says Tama; it could be any
  misty lakeside meadow.

**NOT tested — and therefore NOT claimed:** no phone run, no LINE WebView
run. Device test in LINE's real WebView: **NOT RUN** for the new visuals.

## Device-test fixes — tested 2026-11-25 (evening, this round)

**What was wrong:** the real-browser device test the same evening (headless
Chromium 131, Playwright, 390×844 mobile emulation — full record in
`../tools/browser-test/evidence/RESULTS.md`) failed three rows: D-05 and D-08
(the hidden `#sidestreet` overlay covered the whole episode scene) and PH-05
(ArrowLeft/ArrowRight/A/D never reached Phaser), plus PH-13 on exact wording
only (em dash in the top register mark vs the comma in the pack and the PLAY
lede). The full pack was **not** re-run — only the failed rows were re-tested.

**Fixes (all in `prototype/`, redeployed to
https://chwillpcs-task.github.io/rising-together/ the same evening):**
1. **D-05/D-08 — overlay:** `styles.css` gained
   `.sidestreet[hidden]{display:none}` next to the `.sidestreet` rule, the
   same pattern the codebase already used for `.play-cover`. The author
   stylesheet's `display:flex` had beaten the UA stylesheet's
   `[hidden]{display:none}`. No other `[hidden]` element in the app has an
   explicit `display` rule, so no other overlay has this conflict.
2. **PH-05 — horizontal keys:** `play.js` no longer calls
   `e.preventDefault()` unconditionally for ArrowLeft/ArrowRight/A/D. Its
   document keydown handler now asks `phaserOwnsKeys()` first: when the
   Phaser wrap is shown, booted (`window.__rtPhaser.ready`), and on screen,
   the handler returns without claiming the keys or preventing default, so
   Phaser 3.80.1's keyboard plugin sees them. When the game is hidden
   (Episodes 2–4), not booted, or scrolled off screen, the DOM street owns
   the keys and `preventDefault` still stops the page scrolling under the
   walk. The `store.keys` movement itself is unchanged.
3. **PH-13 — register wording:** the top header mark (`index.html:23`) and
   the locker-room mark (`index.html:51`) changed from the em dash to the
   comma — "Imagined, to be witnessed and experienced by everyone" — so the
   mark is now identical everywhere it appears (header, locker room, PLAY
   lede). Substance was already passing (Ajinomoto Stadium, no likeness, no
   2029 in the game) and is untouched. The one remaining em-dash occurrence
   of the phrase is in this log's own historical prose (the rebuild section
   below, describing the mark as it was then) — a record, not app copy.

**Re-tested in the real browser against the live site, 2026-11-25 evening**
(`../tools/browser-test/retest-fixes.js`, `evidence/retest-fixes.json`,
`evidence/retest-stage.png`; forwarder on 127.0.0.1:18080, no orphan):
- **D-05/D-08 PASS:** with the side street closed, `#sidestreet`
  `hidden=true`, computed `display:none`, rect 0×0. `elementFromPoint` over
  hotspot "ball" returns the hotspot. A real touchscreen tap on it opens the
  moment ("The Lost Ball", 2 choices); a real tap on "Chase the ball" fires
  the choice — stage gains `.chasing`, `moment_choice` logged, daily job
  marked done; Leave closes the moment. Screenshot `retest-stage.png` shows
  the uncovered field, hotspots, and daily-job card. (One measurement note:
  the first re-test run reported the choice tap as FAIL because it checked
  for a change in the moment text — a chase choice changes the stage, not
  the text. Re-probed correctly with `retest-choice.js`: PASS.)
- **PH-05 PASS:** 1.5 s holds — ArrowLeft `isDown=true`, dx −38 px;
  ArrowRight `isDown=true`, dx +45 px; `a` `isDown=true`, dx −42 px; `d`
  `isDown=true`, dx +45 px (at ~10 fps under SwiftShader in this VM; the
  original failure was 0 px for all four). Tap-to-walk still works: tap at
  (195,600) arrived at (196,613).
- **DOM street regression check PASS:** on Episode 2 (Phaser wrap hidden),
  a 1.5 s ArrowRight hold moved the DOM street — `#play-street` transform
  `translateX(-43px)` → `translateX(-403px)` — so the scoping did not take
  the keys away from the street where it owns them.
- **PH-13 PASS:** header, locker, and PLAY-lede marks all read the comma
  wording; live `index.html` contains it 3 times and the em-dash version 0
  times.
- **Live deploy verified:** all 11 app URLs HTTP 200 via direct check
  through the forwarder (`index.html`, `styles.css`, `app.js`, `play.js`,
  `play.css`, `locker.js`, `locker.css`, `phaser.min.js`,
  `phaser-game.js`, `assets/opening-clip.mp4`, `assets/poster-field.png`);
  live files contain the fix strings (`.sidestreet[hidden]{display:none}`,
  `phaserOwnsKeys`, comma wording). Repo sizes now match local
  (`index.html` 24,194 B; `styles.css` 15,133 B; `play.js` 33,293 B).
  `node --check` OK on all four JS files. 0 console/page errors in the
  re-test run.
- **Nothing else regressed in the rows re-tested.** The rest of the pack
  was not re-run, so its earlier results stand as recorded in RESULTS.md.

**NOT tested — and therefore NOT claimed (unchanged):** no phone run, no
LINE WebView run. The re-test is headless Chromium on this VM, as before.

## Phaser PLAY mode — tested 2026-11-25 (this round)

**What changed:** Phaser 3.80.1 is now the PLAY mode for Episode 1 (Chofu).
`phaser.min.js` vendored into the app (1,181,917 B, SHA256
`62081f6a1b51d040473f919ffedef9009953c20833518e146da5a8d1c9405ea8` —
same file as the `tools/phaser-district` prototype, no CDN at runtime),
`phaser-game.js` adapted from that prototype's `game.js` (same scene, same
job "The Lost Ball", same save key `rising-together:v1`), `#phaser-wrap` /
`#phaser-game` at the top of the `#play` section, loaded after `locker.js`.
The game boots lazily (Episode 1 only, when the PLAY section comes into
view), pauses when another episode is chosen, and hides on Episodes 2–4,
which keep the CSS street district. Completing The Lost Ball fills the
trust heart, lights the district map, and marks the day's job done in the
stage above (`window.__rtFinishJob`, exposed by `app.js`; `app.js`
`switchEpisode()` also calls `window.__rtPhaserSetEpisode(n)`). The CSS
street district is kept below the game as "More jobs in this district"
(the other Chofu jobs, Old Jiro and Aya, and the full districts for
Episodes 2–4) — nothing was removed. If Phaser cannot load or no canvas
appears (4 s watchdog), the section says so honestly and the CSS district
still works. Silent, no server, no Service Worker, no downloads, no
offline claim. Locker room, stage, hotspots, daily job, 2029 text-only
question and Talk back are untouched.

**Tested in this VM, 2026-11-25:** `node --check` OK on `app.js`,
`play.js`, `locker.js`, `phaser-game.js`, `phaser.min.js`. Local HTTP: all
files 200 (`index.html` 24,200 B; `app.js` 48,939 B; `play.css` 5,874 B;
`phaser.min.js` 1,181,917 B; `phaser-game.js` 26,592 B; clip 200). jsdom
41 (`/tmp/rt-test/phaser-integration-test.js`, jsdom + node-canvas with a
`CanvasRenderingContext2D` shim jsdom itself lacks): **41 checks passed,
0 failed.** Verified: Phaser 3.80.1 boots, canvas renders in
`#phaser-game`, ChofuDistrict scene active, Ajinomoto Stadium labelled,
Miki present, ball hidden at stage 0; full play-through of The Lost Ball
(talk → stage 1, ball visible, save written; pick up ball → stage 2;
return to Miki → stage 3, trust heart red, map lit, save stage 3, daily
job marked done); houses fade near the stadium; reset returns to stage 0;
Phaser hides on Episode 2 and shows again on Episode 1; locker room,
stage hotspots, daily job, Talk back (opt-in, 500 max), register mark and
2029 text-only all intact; no page JS errors. Two bugs found and fixed in
this round: (1) the scene's prototype chain touched `Phaser.Scene` at
script load, so a missing Phaser crashed `phaser-game.js` before its
fallback could run — now guarded at load with the honest fallback;
(2) Phaser boots asynchronously, so a boot failure escaped the
try/catch — a 4 s no-canvas watchdog now shows the fallback instead of a
blank box.

**NOT tested — and therefore NOT claimed:** no real browser play-through
(the jsdom run proves the scene builds and the quest logic runs in code,
with real canvas drawing via node-canvas — it proves nothing about how
the district feels, its frame rate, or touch handling on a phone); no
phone run; no test in LINE's real WebView. **Device test in LINE's real
WebView: NOT RUN.** The hosted endpoint was redeployed with this build on
2026-11-25: all 12 app URLs HTTP 200 with sizes matching local
(`index.html` 24,200 B; `app.js` 48,939 B; `play.css` 5,874 B;
`phaser.min.js` 1,181,917 B; `phaser-game.js` 26,592 B; clip 200); Pages
build served the new `index.html` on the third poll (~40 s after push).

## Locker-room scene — tested 2026-11-25 (this round)

**What changed (Carl's scene, 2026-11-25):** the Episode 1 opening is now the
championship-game locker room as an experience, not a paragraph — `locker.css`,
`locker.js`, `#locker-room` in `index.html`. Henry, John and Tony from behind,
names on jersey backs, CHOFU above their heads; door opens, tunnel, zoom to
the line of scrimmage, tap to snap the ball, play moves, crowd rises, CHEERS.
Facts behind "About this moment" only (Hosho 1972, single visual read).
No faces, likeness, voice, dialogue, music, or audio; cheers are visual.

**Tested in this VM, 2026-11-25:** `node --check locker.js` — syntax OK.
jsdom 24 (`/tmp/rt-locker/test-locker.js`): **19 checks passed, 0 failed.**
Verified: locker room loads in locker state; register mark exact; three names
on backs, jersey 32, CHOFU; no `<audio>`, no `<img>` in the scene; facts
hidden behind details and naming Hosho; door → tunnel → line → snap → play →
cheers → replay returns to the locker room; hidden on Episode 2, shown again
on Episode 1. The rest of the app was not re-run in this round — see the
polish round above (37 checks, 0 failed, before this change).

**NOT tested — and therefore NOT claimed (unchanged):** no real browser run;
no phone, no LINE, no LIFF browser run. The 2.5D-first design is **still not
confirmed: 0 of 18 P-criteria fully passed on a device / in LINE.** Device
test in LINE's real WebView: NOT RUN.

## Polish round — tested 2026-11-25 (this round)

**What changed (Carl's corrections, 2026-11-25, applied, not asked):**
- **Register mark is now persistent and exact:** the header mark reads "Imagined, to be witnessed and experienced by everyone" in every episode and never changes — not on episode switch, not on scroll, not on a hotspot tap (`app.js` `setRegister()` now always sets that phrase; "On the record" / "Not established" live inside hotspot cards only). The old mark "Imagined — to bring the place alive" is gone from `index.html`, `app.js`, and `README.md` (0 occurrences left).
- **Stadium is Ajinomoto Stadium, the actual name, everywhere:** the Episode 1 read-mode beat that kept a "present Olympic Stadium" naming question open is rewritten — Ajinomoto Stadium (Tokyo Stadium), opened 10 March 2001, on the record, no option offered. No "present Olympic Stadium" remains in the app code.
- **Fog is not a pilot:** the app now says so in the "What this app does not do" list and after the 2029 question — fog is the feeling of moving through the place, not a pilot; the pilots are the GTA/Sega styles and stories, built and tested as episodes. `README.md` open question 5 rewritten the same way.
- **No outside contract, permit, or permission is needed to run this app, and none is claimed:** permission-as-a-stop language removed — Yokosuka shop card (no sign/logo/jacket reproduced, no shop named as participating), Tachikawa museum photograph (not used here, described in words only; "permission not held / permission required" wording removed), Tama interior (no facility, building, boundary, or interior is shown). No partnership, consent, or funding is claimed anywhere in the app. Rights honesty is kept by *not using* the material, not by stopping for permission.
- **LIFF scope copy corrected to the current record:** the Talk back copy and `README.md` now state the LIFF app scopes as openid, profile, `chat_message.write`, per the 2026-11-25 progress-tracker record. **Discrepancy noted, not hidden:** the two-way round's log (same day, earlier) recorded `chat_message.write` as NOT enabled. That state was verified in the LINE console by the browser step at 12:41 CST on 25 November 2026 (scopes read openid, profile, chat_message.write on the LIFF detail page), so the discrepancy is settled — the scope is enabled. The app keeps its run-time check — `liff.getContext().scope` decides what the visitor sees, and a missing/ungranted scope is still reported honestly instead of failing silently. The stale `app.js` header comment ("No LIFF ID exists") and the stale "the team has prepared the exact change to switch it on" send message were corrected the same way.
- **Device-test pack prepared:** `DEVICE-TEST-PACK.md` (new) — D-01–D-22 and P-01–P-18, each with exact steps, expected result, and a pass/fail box, plus two-way checks C-1–C-10 (`liff.init`, `sendMessages`, `shareTargetPicker`, `closeWindow`, deep links `?episode=&hotspot=`, bot reply loop). Ready to run by the teams. **Not run** — no phone, no LINE WebView test, no deployment to the live webhook in this round.

**Tested in this VM, 2026-11-25:**
- `node --check app.js` — syntax OK.
- Local HTTP (`python3 -m http.server`): all 11 files 200 with sizes matching local — `index.html` 61,349 B; `styles.css` 10,589 B; `app.js` 33,089 B; `assets/opening-clip.mp4` 134,962 B; all four posters 200; `panorama.png` 19,916 B; `README.md` 12,418 B.
- **Parallel-team merge, same evening:** while this round ran, another team added the GTA/Sega-style pilot work to the same files — one `<section class="pilot">` per episode (dense small district, substories, "look closely" hotspots, side streets, calendar, named contacts, visitor contributions) plus `.pilot` CSS. No hotspots were added (still 12), nothing was removed, and the pilot sections carry the same corrections (persistent register mark, fog as feeling not a pilot, no outside permission claimed). One line in the new Episode 3 pilot mark reintroduced "permission not held" for the museum photograph; it was aligned to the correction ("The museum photograph is not used here.") — the only change made to the other team's copy. The jsdom run and the HTTP check above were both re-run on the merged files, after that one-line fix.
- jsdom 24 (Node, `/tmp/rt-polish/test-polish.js`): **37 checks passed, 0 failed**, in four runs — (a) standalone (no `liff`), (b) deep link `?episode=3&hotspot=card-e3-park`, (c) reduced-motion, (d) stubbed `liff` with `chat_message.write` granted. Verified: 4 episodes, 4 selector buttons, 28 layers (7 × 4), 12 hotspots and 12 cards, 4 read-mode blocks, 4 panoramas, 12 two-way buttons; register mark exact and unchanged after switching to Episode 2; Episode 2 hotspot opens its card; Episode 2 Read the scene opens; clip-not-rendered cover shows the honest note; a two-way choice fills a draft and sends nothing; send blocked without opt-in; YouTube empty-submit keeps the still fallback, load creates the expected `youtube-nocookie` iframe, clear restores the fallback; deep link opens Episode 3 + card; reduced-motion run reports drift off; stubbed `liff`: init resolves, one text message sent carrying episode + kind, pending list shows SENT, Return calls `liff.closeWindow()`, share picker resolves, Withdraw after a send sends a withdrawal text. Static checks: Ajinomoto Stadium named, no "present Olympic Stadium", no "permission not held", no "Carl remembers", fog-as-feeling wording present, no 2029 scene, no `<audio>`, no photograph `<img>` in any viewport.
- `styles.css` grew in this round only through the parallel team's `.pilot` rules (10,336 → 10,589 B); this round itself needed no CSS change.

**NOT tested — and therefore NOT claimed (unchanged):** no real browser run; jsdom is not a browser (cannot play video, cannot measure paint/frame times, does not implement `scrollIntoView` — guarded in code). No phone, no LINE, no LIFF browser run. The 2.5D-first design is **still not confirmed: 0 of 18 P-criteria fully passed on a device / in LINE.** The LIFF scope state was verified enabled in the LINE console at 12:41 CST on 25 November 2026 (see discrepancy note above, now settled). The bot reply loop (pack C-9) is blocked until the webhook draft is deployed with Carl's go — it was not deployed here, and the live PythonAnywhere app directory was not touched.

**Bugs found in this round:** none in the jsdom run (37 of 37 on first run). The stale-copy items above (old register phrase, stadium naming question, "No LIFF ID exists" comment, scope copy) were corrected as polish, not as test failures.

**P-01–P-18 status:** unchanged — 0 of 18 fully passed on a device / in LINE; 3 partial in jsdom (P-07, P-10, P-15), 1 passes by design (P-14), 1 deliberate deviation (P-17, client-side log only), rest untested. **D-01–D-22:** all untested in LINE's real WebView; the pack to run them is `DEVICE-TEST-PACK.md`.

## Two-way communication — tested 2026-11-25 (this round)

**What changed:** LIFF init (guarded), Talk back section, one two-way moment per episode (12 choice buttons), Send to TASK via `liff.sendMessages()` (text only, one tap, opt-in, ≤500 chars), Share via `liff.shareTargetPicker()`, Withdraw, real `liff.closeWindow()` in LINE, deep-link in (`?episode=&hotspot=`, via query or `liff.state`). Full design, webhook draft, and contribution rules in `../teams/two-way-communication.md`. LIFF app 2012800911-7BPP3dHp exists (scopes openid, profile, chat_message.write — enabled 25 November 2026). Sending in LINE is still untested on a device.

**Tested in this VM, 2026-11-25:** `node --check app.js` — syntax OK. jsdom 24 (`/tmp/rt2way/test-two-way.js`): **23 checks passed, 0 failed**, in two runs — (a) no `liff` object (standalone) and (b) stubbed `liff` with `chat_message.write` granted. Verified: 12 two-way buttons; Talk back elements present; deep link `?episode=2&hotspot=card-e2-real` switched to Episode 2 and opened that card; a choice fills a draft and sends nothing; send blocked without opt-in; with the scope granted, one text message is sent, carrying episode + kind, and `send_to_task` is logged; Return calls `liff.closeWindow()`; Withdraw deletes an unsent draft, and after a send it sends a withdrawal text. Standalone run: no send without `liff`, `liff_not_present` logged, pending list shows NOT SENT. A stubbed `liff` proves the guarded code paths, not LINE behaviour.

**NOT tested — and therefore NOT claimed:** no test in LINE's real WebView; `liff.init()`, `liff.sendMessages()`, share picker, `closeWindow()`, and the deep link have not been run in LINE, with the scope on or off. The webhook draft has not been deployed; no message has been sent to any real visitor and no bot reply has been sent. The hosted endpoint **was** redeployed with the two-way build on 25 November 2026 — live sizes match local (index.html 48,804 B, app.js 32,752 B, styles.css 10,336 B), latest Pages build "built". 2.5D-first remains NOT confirmed: 0 of 18 P-criteria fully passed on a device / in LINE.

## Four-episode expansion — tested 2026-11-24 (this round)

**What changed:** the single-episode bounded prototype was expanded in place into a
four-episode LIFF-ready web app (`index.html`, `app.js`, `styles.css` rewritten/extended;
no second app started). Episode 1 (Chofu) is the original prototype, rebuilt as Episode 1.
Episodes 2 (Yokosuka), 3 (Tachikawa), 4 (Tama) are new: painted/CSS 2.5D scenes,
poster still + honest "clip not yet rendered" note (no fake video), painted CSS still
panoramas. Episode selector (1–4) switches scenes without a page reload.
Instrumentation extended with `episode_select`, `episode_entry`, `clip_not_rendered`.

**Tested in this VM, 2026-11-24:**
- HTTP server (`python3 -m http.server 8123`): `index.html` 200, 40,137 B;
  `styles.css` 200, 9,466 B; `app.js` 200, 18,551 B;
  `assets/opening-clip.mp4` 200, 134,962 B; all four posters 200; `panorama.png` 200;
  `README.md` and `TEST-LOG.md` 200.
- `node --check app.js` — syntax OK.
- jsdom 24 (Node, `/tmp/jsdom-test2`, test script `/tmp/jsdom-test2/test-four-episodes.js`):
  **44 checks passed, 0 failed.** `app.js` evaluated without error. Verified in jsdom:
  4 episode containers, 4 selector buttons, 4 viewports, 28 layers (7 × 4),
  12 hotspots (3 × 4) and 12 cards, 4 read-the-scene blocks, 4 panoramas,
  3 clip-not-rendered covers (Episodes 2–4) and 1 real clip (Episode 1);
  episode switching (selector and nav) hides/shows episodes, updates `aria-pressed`,
  and logs `episode_select` / `episode_entry`; hotspots in Episodes 1–4 opened their
  cards in 1–2 ms in jsdom; read-the-scene opened in Episodes 2 and 4;
  clip-not-rendered cover showed the honest note and logged `clip_not_rendered`
  (no `<video>` element in Episodes 2–4); YouTube empty-submit kept the still fallback;
  YouTube load with a test ID created the expected `youtube-nocookie` iframe
  (`playsinline=1&mute=1&autoplay=1&rel=0`); YouTube clear restored the still fallback;
  drift toggle and simulated return logged; reduced-motion run (`matches=true`)
  reported auto-drift off. Static checks: Ajinomoto Stadium named; Hosho facts present;
  no yearbook image, no music, no LIFF ID / `liff.init`, no 2029 scene,
  no "Carl remembers" label, no “9 million abandoned houses” headline as public copy
  in the page; Tachikawa "permission not held, not used" and Tama "not depicted as
  publicly visitable" notes present.

**NOT tested — and therefore NOT claimed (unchanged from the bounded prototype):**
- No real browser run. The VM's Chromium still refuses to start here. jsdom is not a
  browser: it cannot play video (its `play()` was stubbed to resolve, so the
  `video_play` event logged in jsdom proves nothing about real autoplay), cannot
  measure paint / frame times, and does not implement `scrollIntoView` (guarded in code).
- No phone, no LINE, no LIFF browser, no LIFF ID, no LINE account. Every P-criterion
  that requires a device, a network, or LINE is therefore **UNTESTED** for all four
  episodes, however well the code reads. The 2.5D-first design is **still not confirmed**:
  0 of 18 P-criteria are fully passed on a device / in LINE for any episode.
  The jsdom results above prove the code assembles, the episode switching works, and
  the interactions are wired; they prove nothing about LINE, LIFF, or phone performance.
- No Flex Message was sent, no ShareTargetPicker was opened, no `liff.closeWindow()`
  was called — there is no LIFF channel to call them from.
- Episodes 2–4 have no rendered opening clip and no device test of any kind; their
  scroll-zoom feel, panorama drag smoothness, and paint times are unmeasured.

**Bugs found in this round:** none. The jsdom run passed 44 of 44 checks on its first run.
Two design points were handled in the code from the start, not as bug fixes: the
panorama handler was written to handle both `<img>` (Episode 1) and `.pano-strip`
CSS panoramas (Episodes 2–4), including keyboard look-around; and panorama jump
buttons use per-episode `data-pano-jump` targets instead of a fixed Episode 1 target.

**P-01–P-18 status for the four-episode app:** unchanged from the bounded prototype
table below — 0 of 18 fully passed on a device / in LINE; 3 partial in jsdom
(P-07, P-10, P-15), 1 passes by design (P-14), 1 is a deliberate deviation (P-17, local only),
and the rest are untested. Per-episode, the jsdom evidence is: Episode 1 — hotspot,
YouTube harness, drift toggle, return all ran in jsdom (read mode ran in the bounded
prototype round); Episodes 2 and 4 — hotspot and read mode ran in jsdom; Episode 3 —
hotspot ran in jsdom, read mode was not clicked in this round's jsdom run (it shares
the code path with Episodes 2 and 4, which were clicked). None of that is a device result.

## How it was tested — and what was NOT tested

Tested in this VM, 2026-11-24:
- HTTP server (`python3 -m http.server 8123`): `index.html` 200, 16,761 B;
  `assets/opening-clip.mp4` 200, 134,962 B; `styles.css` and `app.js` 200.
- `node --check app.js` — syntax OK.
- jsdom 24 (Node, `/tmp/jsdom-test`): `app.js` evaluated without error;
  7 layers, 3 hotspots, register mark present; hotspot “1971 season” opened in 2 ms
  in jsdom; “Read the scene” opened; YouTube empty-submit kept the still fallback;
  YouTube load with a test ID created the expected `youtube-nocookie` iframe
  (`playsinline=1&mute=1&autoplay=1&rel=0`); panorama jump logged.
- Static content checks (Python): Hosho facts present; Ajinomoto Stadium named;
  no yearbook image, no music, no LIFF ID / `liff.init`, no 2029 scene,
  no “9 million abandoned houses” as public copy in the page.

**NOT tested — and therefore NOT claimed:**
- No real browser run. The VM’s Chromium (`/opt/meta-chromium/chrome`) refuses to start
  here (“Hatch WebGL domain policy is required for browser startup”, exit 13, both
  `--headless=new` and with `--user-data-dir`). No other browser is installed in this VM.
  jsdom is not a browser: it cannot play video, cannot measure paint / frame times,
  and does not implement `scrollIntoView` (guarded in code) or `HTMLMediaElement.play`.
- No phone, no LINE, no LIFF browser, no LIFF ID, no LINE account. Every P-criterion
  that requires a device, a network, or LINE is therefore **UNTESTED**, however well
  the code reads. That is the honest result for this stage.
- No Flex Message was sent, no ShareTargetPicker was opened, no `liff.closeWindow()`
  was called — there is no LIFF channel to call them from.

## P-01–P-18 (Technical team §5, pass criteria in §4.4)

| # | Criterion | Result | Evidence / note |
|---|---|---|---|
| P-01 | Opens in the LIFF browser | **UNTESTED** | LIFF ID exists (2012800911-7BPP3dHp); no LINE device run. External-browser fallback copy is built in and shown in standalone use. |
| P-02 | Opens from outside LINE | **UNTESTED** | Same as P-01. Fallback copy present; no external-browser run. |
| P-03 | First paint ≤ 2 s on 4G good | **UNTESTED** | Local assets are small (page 17 KB, posters ~25 KB each, clip 132 KB, panorama 20 KB), but no 4G / phone measurement was made. No time is claimed. |
| P-04 | Full layers ≤ 5 s on 4G; no layout shift | **UNTESTED** | Same as P-03. No measurement. |
| P-05 | Scroll zoom: frame ≤ 16.7 ms for ≥ 90% of frames over 30 s | **UNTESTED** | Implementation is transform-only, `requestAnimationFrame`-throttled. No frame-time measurement exists. jsdom ran the scroll handler without error; that proves nothing about smoothness. |
| P-06 | Auto-drift 60 s, no judder, no thermal warning | **UNTESTED** | Drift logic exists (slow, capped, pausable) and ran in jsdom with a stubbed rAF. No device run. |
| P-07 | Hotspots open ≤ 500 ms, dismissible, focus visible | **PARTIAL — passed in jsdom, untested on a phone** | In jsdom, hotspot 2 opened its card in 2 ms; cards are dismissible; buttons have `aria-label` and `:focus-visible` styling. No phone timing. |
| P-08 | Video first frame ≤ 3 s on 4G; zero rebuffering in 60 s on Wi-Fi; poster if autoplay blocked | **UNTESTED** | MP4 is 12 s, 132 KB, served 200 over local HTTP. jsdom cannot play video. Poster + tap-to-play cover are built in. No 4G / Wi-Fi run. |
| P-09 | Sound: tap-for-sound plays; no fullscreen hijack on iOS | **UNTESTED — and not applicable to the clip as built** | The opening clip is **silent by design** (no audio track, no music). There is therefore no audible sound to test from the clip. The YouTube harness has a tap-for-sound path (unmute on tap), but no YouTube video was selected, so that path is also untested. If a future version needs sound, it needs a cleared audio source and a LINE device test; do not claim P-09 from this prototype. |
| P-10 | Panorama loads, look-around smooth, hotspot jump works | **PARTIAL — passed in jsdom, untested on a phone** | Panorama image (20 KB) loads over HTTP; drag / keyboard look-around handlers and the jump-to-field button ran in jsdom and logged. No phone smoothness measurement. |
| P-11 | Flex card: preview correct, `altContent` shown, URI opens LIFF URL | **UNTESTED — not built** | No Flex Message exists for this prototype (no LINE account / channel). No test message was sent. |
| P-12 | Return + resume: `liff.closeWindow()`, <12 h resume / >12 h reload | **UNTESTED** | Return is simulated only: the button logs `return` and explains that `liff.closeWindow()` is not available in the standalone prototype. No LINE run. |
| P-13 | Share: ShareTargetPicker opens, recipient count unknowable | **UNTESTED — not built** | No ShareTargetPicker in a standalone page. No claim is made about recipients. |
| P-14 | Consent decline degrades gracefully | **PASS by design, untested in LINE** | The prototype asks for no scopes and requires no consent to read the scene; there is no consent prompt to decline. That degrades to “story still readable” by construction. No LINE consent flow was run. |
| P-15 | Accessibility: reduced-motion alternative, screen-reader announcements, linear “read the scene” mode | **PARTIAL — code present, untested with a screen reader / in LINE** | `prefers-reduced-motion` disables auto-drift (verified in jsdom with `matches=true`); linear “Read the scene” mode opens (jsdom); hotspots are real `<button>`s with labels; focus-visible styling exists. VoiceOver / TalkBack in LINE’s WebView: **untested**. |
| P-16 | Offline: honest failure copy, no infinite spinner, no crash | **PARTIAL — code present, not exercised in a browser** | `navigator.onLine` listener + offline banner with honest copy; no Service Worker (correct — LIFF does not support them); no spinner is used. No actual offline run was made. |
| P-17 | Instrumentation: every event logged server-side after `liff.init()` | **DEVIATION — passed locally, not server-side** | The task for this prototype specified **client-side log only** (console + on-page list, no server, no personal data). That is what was built, and it works in jsdom (page_view, scene_entry, hotspot_tap, read_mode, video_*, youtube_*, panorama_*, return). The original P-17 requirement (server-side logging after `liff.init()`) is **not met** by this prototype, by design of the task, and must be built and tested separately before any LIFF deployment. |
| P-18 | Weak network: scene usable (still + text) even if video stalls | **UNTESTED** | Still-image + text fallbacks are built in (poster, still fallback for YouTube, 2.5D still if a layer fails). No throttled-4G run was made. |

**Decision rule (Technical team):** the 2.5D-first design is confirmed only if P-01–P-18 **all** pass.
**Result: not confirmed.** 0 of 18 are fully passed on a device / in LINE. 3 are partial in jsdom
(P-07, P-10, P-15), 1 passes by design (P-14), 1 is a deliberate deviation (P-17, local only),
and the rest are untested. This prototype proves the *code assembles and the interactions are wired*;
it proves nothing about LINE, LIFF, or phone performance.

## D-01–D-22

All **UNTESTED** in LINE’s real WebView on a phone. No device matrix was run (no iPhone,
no Android, no PC LINE, no Wi-Fi / 4G / throttled / offline runs). D-15/D-16 (three.js vignette)
are out of scope and were not attempted, as specified.

## Bugs found in testing, and fixed

1. `scrollIntoView` is not implemented in jsdom and would throw there; guarded in `app.js`
   (`if (…scrollIntoView) …`) in both the read-mode and panorama-jump handlers.
   In a real browser `scrollIntoView` is standard; the guard is harmless there.
2. `clip.play()` could throw synchronously in a non-browser environment; wrapped in
   `try/catch`, with the poster / tap-to-play fallback logged.
3. `clip.muted = true` is now set in JS as well as in the `muted` attribute, so the
   muted-autoplay attempt does not depend on attribute parsing.
4. The page’s internal vacancy note quoted the headline “9 million abandoned houses” phrase
   while prohibiting it; the quoted phrase was removed from `index.html`. The broken-down
   figures (9.0 million vacant, 3.85 million with no plan to rent or sell) remain in the
   internal note only. Mentions of “Unity” / “Genesis” in the page are in the
   “What this prototype does not do” list only — neither is built or loaded.

## What even a fully passing prototype would not prove

Enjoyment, return, audience size, sponsor funding, second-place cost, Genesis fidelity,
or commercial viability. Those need real-visitor testing with consent, not this prototype.

## What still needs Carl’s go before any next step

- Any likeness; building the 2029 scene (C-7); publication (C-11); any spend (C-12); Carl's own story, photographs, or family material, each specific use his call (C-6).
- The stadium is Ajinomoto Stadium — the actual name. There is no naming option.
- A device test in LINE’s real WebView on a phone (D-01–D-22), server-side instrumentation (P-17 as originally specified), and a Flex Message test (P-11) — team work, still untested. The LIFF ID and LINE channel already exist (channel 2012800911, LIFF app 2012800911-7BPP3dHp).
- The Hosho correction in the Drive finals was applied 24 November 2026 (C-16, Docs 01, 03, 04, 10), including the stale unknowns paragraph in Docs 03 and 04.

## GTA/Sega-style pilots (2026-11-25)

Pilot sections built for all four episodes, in the episode files
(`episodes/01-chofu/episode.md` through `episodes/04-tama/episode.md`, one
`## The pilot` section each) and as one `<section class="pilot">` per episode
in `index.html` plus `.pilot` styles in `styles.css`. Each pilot: dense small
district, 3 substories with named fictional contacts (labelled fictional,
never real people), "look closely" details, "Imagined — play" side streets
(craziness millions enjoy, short, cleanly exited, no crime/violence/
interpersonal conflict as entertainment), calendar with one choice a day and
weekly rotation. Register "Imagined, to be witnessed and experienced by
everyone"; fog is the feeling of moving, not a pilot; Ajinomoto Stadium is
the name everywhere, no "present Olympic Stadium" option; no decision stops;
no outside contract, permit, or permission needed or claimed; no
partnership/consent/funding claimed. Painted only; no photographs, no
likeness/voice/dialogue for real people, no yearbook photos, no music, no
2029 immersive scene (2029 text only, imagined future/what-if).
Tama stays imagined, civilian-era framing only, internal only, no era
claimed, no access claimed. Tachikawa museum photograph not used:
permission not held, not used.

Verification, 2026-11-25: `node --check app.js` OK. jsdom 24: page loads,
4 pilot sections, 4 episodes, 12 hotspots (max 3 per episode intact),
episode switching works (episode 2 shown, episode 1 hidden), no "Carl
remembers" / "present Olympic Stadium" in page text. Local HTTP 200 for all
10 URLs. Live GitHub Pages verified: all 10 URLs HTTP 200 with sizes
matching local (index.html 61,349 B; styles.css 10,589 B; app.js 33,089 B;
assets unchanged), Pages build status "built", 4 pilot sections and
`.pilot` CSS present in the live files, "Ajinomoto Stadium" present, no
forbidden phrases. Repo main and local files verified byte-identical (md5).
Device test in LINE's real WebView still untested (P-01–P-18, D-01–D-22).

## PLAY mode — tested 2026-11-25 (this round)

**What changed:** `play.js` (new, 32 KB) + `play.css` (new, 5 KB) + `#play` section in `index.html` + one line in `app.js` `switchEpisode()` calling `window.__rtPlaySetEpisode(n)`. No other app.js behaviour changed; the sibling experience-first rebuild (stage, hotspots, daily job, side streets, Japan map) is intact underneath.

**Tested in this VM, 2026-11-25:**
- `node --check app.js` and `node --check play.js` — syntax OK.
- jsdom 24 (Node, `/tmp/rt-play-test/test.js`, `pretendToBeVisual`): **28 checks passed, 0 failed.** Full playthrough, episode 1: play section loads; stage hotspots render (4); daily job renders; HUD shows day, 4 map dots, "Jobs done: 0 of 3"; talking to Miki starts The Lost Ball (step 2 shown); walking right with ArrowRight makes the ball target glow when near; tapping the ball advances to "Bring it back to Miki"; walking left back to Miki completes the job — counter 1 of 3, Miki ♥, map dots lit. A look-closely detail shows its one-line effect. Side street opens; pigeon tapped 3 times — "The pigeon wins." Episode switch to Yokosuka: district switches, counter resets 0 of 3, Rin present, stage hotspots re-rendered (4). Static checks: no "Carl remembers", no "present Olympic Stadium", register mark present.
- **NOT tested — and therefore NOT claimed:** no real browser run; jsdom is not a browser (no paint/frame times, no touch). No phone, no LINE, no LIFF browser run. 2.5D-first still **not confirmed: 0 of 18 P-criteria fully passed on a device / in LINE.** The playthrough above proves the mechanics run in code; it proves nothing about how the district feels on a phone in LINE.

**Merge, same evening — duplicate play wiring removed:** while this round ran, a sibling team wrote a second, simpler wiring of the same `#play` section inside `app.js` (percentage walking, Chofu only, one job) plus duplicate `#play` CSS in `styles.css`. Two wirings drove the same player and HUD and would have fought. The duplicate was removed (app.js IIFE lines 763–883 and the `#play` block in styles.css); the full `play.js`/`play.css` implementation is now the single wiring. The sibling's locker-room scene (`locker.js`, `locker.css`, `#locker-room`) was left untouched. Re-tested after the merge: jsdom 28 of 28 still pass, and a combined load (app.js + locker.js + play.js) shows locker, play, and stage all present with no errors.

## Experience-first rebuild — tested 2026-11-25 (this round)

**What changed:** `index.html`, `styles.css`, `app.js` rebuilt experience-first (Carl, 2026-11-25: the app as built was a written book — reading, not experiencing). The long book is gone as the main mode: no big header, no intro paragraph, no episode-selector wall, no per-episode pilot essays, no YouTube test harness, no panorama sections, no long Pinatubo note, no long Notes section. What the visitor gets instead, on load: the locker-room opening (other team's `locker.js`/`locker.css`, Carl's scene — locker → tunnel → line, snap, cheers, visual only), then a full-screen painted stage that is already moving — auto-drift, parallax layers, runners running across, a ball rolling, a kite drifting, moving fog, warm faded past washing into full-colour present as you scroll-travel through 5 beats per episode (field → same ground re-dressed → housing fading house by house → Ajinomoto Stadium rising → animated Japan map). Drag-to-pan is walking. A tiny HUD holds the 4-episode strip and the small persistent register mark "Imagined — to be witnessed and experienced by everyone". Hotspots (4 per episode, 16 total) DO something: chase the ball, pigeon steals the ball, train passes, runway line appears under the grass, rain runway, find Haru's three cats by tapping them in the scene, count Pip's ducks by tapping them — each moment max 3 short lines, facts only behind "About this place". Side streets labelled "Imagined — play", short, clean exit. A daily job (one choice a day, which contact hands out the work) is the return reason; progress kept on this device only. "Read it" is a toggle showing at most 5 one-line beats, hidden by default. The 12 s silent Chofu clip is a "Watch the field move" tap, poster first; episodes 2–4 honestly say the clip is not rendered. 2029 stays a short text question (3 paths, 3 lines each max), Pinatubo one line behind "About this question". Notes collapsed to a `<details>` with the event log and one honest line: device test in LINE's real WebView NOT RUN. Preserved exactly: LIFF init, `liff.sendMessages` talk-back (opt-in, ≤500 chars, never silent, text only so the webhook fires), shareTargetPicker, withdraw, closeWindow, deep links `?episode=&hotspot=` (old card ids map to the new hotspot keys), episode switching, offline honesty, register-mark text, Ajinomoto Stadium everywhere, no "Carl remembers", no claim of consent/funding/partnership, no outside-permission language as a blocker. No photographs, no likeness/voice/dialogue for any real person (Okabayashi, Reed, Henry Williams appear only as one-line facts behind "About this place"), no music, no 2029 immersive scene.

**Concurrent work, handled:** while this rebuild ran, the other team landed PLAY mode (`play.js`/`play.css`, `#play` section, `__rtPlaySetEpisode` hook in `app.js` `switchEpisode()`) and the locker room (`locker.js`/`locker.css`, `#locker-room` section) in the same three files. This rebuild first wired those two sections itself, then found their modules and **removed its own duplicate wiring** (Play IIFE and Locker IIFE from `app.js`, matching CSS from `styles.css`) so no button has two handlers — PLAY and the locker room are owned by their files; the stage, hotspots, daily job, side streets, map, Read-it, clip, talk-back and LIFF stay in `app.js`/`styles.css`. The other team also removed this rebuild's Play wiring from `app.js`/`styles.css` at one point; the final state below is verified, not assumed.

**Tested in this VM, 2026-11-25:**
- `node --check app.js`, `node --check play.js`, `node --check locker.js` — syntax OK.
- jsdom 24 (Node, `/tmp/rt-test/test.js`, `pretendToBeVisual`, all three scripts loaded in page order): **61 checks passed, 0 failed.** First 30 seconds: locker room first (experience, not text), 3 players from behind, facts behind `<details>`; then the stage moving on load (runners, ball, kite, fog), 4 hotspots, daily job shown, moment sheet / Read-it / clipbox all hidden, 2029 in 3 short paths, log collapsed. First minute: hotspot 1 opens a ≤3-line moment with choices; Chase the ball animates the chase and finishes today's job; cats found by tapping (3 of 3); Walk the Line makes the runway appear; ducks counted by tapping (3); train passes in Yokosuka; pigeon side street opens and exits cleanly; Read-it shows exactly 5 one-line beats; Watch the field opens the clipbox poster-first; holding Walk right moves the player down the street (200px → 336px); locker sequence locker → tunnel → line → play → cheers (auto, 1.6 s) → replay; locker room hides on Episode 2, returns on Episode 1. First return / links: deep link `?episode=3&hotspot=line` opens the moment; old `?episode=1&hotspot=card-season` still maps; bad episode rejected and logged; talk-back send outside LINE blocked honestly (`send_blocked_not_in_line`, nothing sent). Static: no "Carl remembers", no "present Olympic Stadium", no YouTube form, no `.pilot` sections; Ajinomoto Stadium present.
- Local HTTP (python http.server): 200 for `index.html` (23,063 B), `styles.css` (15,099 B), `app.js` (48,834 B), `play.js`, `locker.js`, `play.css`, `locker.css`, `assets/poster-field.png`, `assets/opening-clip.mp4`.
- **NOT tested — and therefore NOT claimed:** no real browser run; jsdom is not a browser (no paint/frame times, no touch, no scroll physics). No phone, no LINE, no LIFF browser run, no device test in LINE's real WebView (NOT RUN). The checks above prove the mechanics run in code; they prove nothing about how the district feels on a phone in LINE.

**What still reads like a book (honest):** the "Read it" 5 lines and the "About this place" facts are still text — but both are hidden until the visitor asks. The talk-back form and the 2029 question are still text by design (2029 is words only, by Carl's rule). Everything else the visitor meets first is motion, choice, or a job to do.
