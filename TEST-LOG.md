# Rising Together — Bounded Prototype: Test Log

**Correction, 2026-11-24, Carl's words in substance:** do not use the label "Carl remembers" — among the hundreds of thousands, nothing is from his eyes until he witnesses it. The prototype's hotspot 1 was changed the same day from "Carl remembers" to "Imagined, not yet witnessed by Carl", then further to "Imagined, to be witnessed and experienced by everyone" — the imagined scenes are to be witnessed and experienced by everyone, not only by Carl. The register label "Carl remembers" is removed from this prototype; the Story team's register system that used it must be corrected the same way before any further build.

**Date:** 2026-11-24
**Prototype:** `~/workspace/goals/rising-together/prototype/` — `index.html`, `styles.css`, `app.js`, `assets/`
**Status:** Internal review only. Not publication, not launch, not a live LINE app.

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
