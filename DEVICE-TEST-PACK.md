# Rising Together — Device-Test Pack (ready to run)

**Date prepared:** 2026-11-25 (polish round)
**Status:** READY TO RUN — **NOT RUN.** No device test has been done in this round.
**App under test:** four-episode LIFF-ready app, `~/workspace/goals/rising-together/prototype/`
**Hosted endpoint:** https://chwillpcs-task.github.io/rising-together/
**LIFF URL:** https://liff.line.me/2012800911-7BPP3dHp (LIFF app "Rising Together", ID 2012800911-7BPP3dHp, channel 2012800911; scopes openid, profile, chat_message.write, per the 2026-11-25 record)
**Honest state going in:** 2.5D-first is NOT confirmed — 0 of 18 P-criteria fully passed on a device / in LINE. jsdom proves the code assembles and the interactions are wired; it proves nothing about LINE, LIFF, or phone performance.

## Before you start — read this first

1. **Carl's go is required** before running any of this. Do not run the pack on a live audience, do not publish, do not outreach, do not spend.
2. **Do not load-test LINE endpoints** in a prohibited way. Performance testing is of TASK's own hosted assets on TASK's own test devices, not of LINE's servers.
3. **Record for every run:** device (model), network (Wi-Fi / good 4G / throttled 4G / offline), LINE app version, LIFF SDK version, date/time, tester name. A single run is not a result — repeat timed tests and take the median of 3 runs where a time is claimed.
4. **Devices (proxy for an audience that does not exist yet):** current, previous, and older iPhones; flagship, mid-range, and low-end Android phones; PC LINE. Minimum for a usable result: one iPhone + one mid-range Android on Wi-Fi and on good 4G.
5. **Entry route for every D/P run unless stated otherwise:** open the LIFF URL from a chat message in the TASK chat in LINE (tap the link in chat). Never test by typing the endpoint URL into a browser — that is the external-browser case, not the LIFF case.
6. **Per-episode rule:** D-05–D-10 and the hotspot/read-mode checks run on **all four episodes** (Chofu, Yokosuka, Tachikawa, Tama), not just Episode 1. Episodes 2–4 have no rendered opening clip — their D-11/D-12/D-14 rows are "poster still + honest note", not a video result.
7. **D-15/D-16 (three.js vignette) are OUT OF SCOPE** unless a vignette is attempted. A failed vignette does not fail the 2.5D world and is gated separately. Do not run them.
8. **Exit rule:** Phase 2 closes only when all 18 P-criteria pass on a device in LINE. A failed test is written down honestly, never hidden, softened, or re-argued. If accessibility (P-15) fails, the app is not shippable in any form until it passes.

## How to use the boxes

For each row: tick **☐ Pass / ☐ Fail / ☐ Not run**, write the measured number where one is asked for, and add a one-line tester note. "Pass" means the expected result happened exactly as written, on the named device and network. "Partial" is not a pass — write what happened and mark Fail with a note.

---

## Part A — Device matrix D-01–D-22

### D-01 — LIFF URL from chat opens the LIFF browser
- **Devices / network:** All devices, Wi-Fi.
- **Steps:** 1) In the TASK chat in LINE, tap the LIFF URL (https://liff.line.me/2012800911-7BPP3dHp). 2) Note which browser opens. 3) In the app, open the notes section and read the instrumentation log for `liff_ready`.
- **Expected result:** The LIFF browser opens (not the in-app browser, not an external browser). `liff.getContext().type` is not `external`; `liff.isInClient()` is true. The external-browser fallback banner is hidden.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Device: ______ Network: ______ LINE: ______ Note: ______

### D-02 — LIFF URL from outside LINE (email, Safari/Chrome)
- **Devices / network:** iOS + Android, Wi-Fi.
- **Steps:** 1) Email the LIFF URL to yourself (or paste it into Safari/Chrome). 2) Tap/open it. 3) Record which environment actually opens.
- **Expected result:** Either the LIFF browser opens, or the designed external-browser fallback copy is shown ("External-browser fallback… open this app from the TASK chat in LINE"). Never a blank page, crash, or silent degradation.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Device: ______ Environment opened: ______ Note: ______

### D-03 — First paint: 2.5D scene, low-res base layer + text
- **Devices / network:** Mid-range Android + previous-gen iPhone, good 4G.
- **Steps:** 1) Clear the LINE WebView cache if the device allows it (or use a fresh install state). 2) Open the LIFF URL from chat. 3) Time from tap to first paint of scene + text (stopwatch, or Navigation Timing in-page). Repeat 3 times per device.
- **Expected result:** First paint ≤ 2 s (median of 3 runs) on each device.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — iPhone median: ______ s (runs: ___, ___, ___) — Android median: ______ s (runs: ___, ___, ___) — Note: ______

### D-04 — Full layers loaded: 2.5D scene
- **Devices / network:** Same as D-03.
- **Steps:** 1) Open the LIFF URL from chat on good 4G. 2) Time until all 7 layers are visible. 3) Watch for any layout shift after first paint.
- **Expected result:** Full layers ≤ 5 s on good 4G; no layout shift after first paint.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — iPhone: ______ s — Android: ______ s — Layout shift seen? ☐ Yes ☐ No — Note: ______

### D-05 — Scroll-driven zoom: field → stadium → Japan (one continuous scroll)
- **Devices / network:** All phones, Wi-Fi + 4G. **All four episodes.**
- **Steps:** 1) Open Episode 1. 2) Scroll slowly and continuously through the whole scene (field → housing → stadium → Japan). 3) Repeat for Episodes 2, 3, 4. 4) Note stutter, blank frames, or a zoom that does not complete. If frame measurement is available (in-page `requestAnimationFrame` deltas or remote debugging), record it; if not, record the tester's own-words judgement and mark the frame-time part as unmeasured.
- **Expected result:** No visible stutter (frame time ≤ 16.7 ms for ≥ 90% of frames over 30 s, measured); zoom completes; no blank frames. Beat label changes 1 → 5.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Ep1: ______ Ep2: ______ Ep3: ______ Ep4: ______ — Frame times measured? ☐ Yes (≥90% ≤16.7 ms: ☐ Yes ☐ No) ☐ No, tester judgement only — Note: ______

### D-06 — Auto-drift (fog movement) with no input, 60 s
- **Devices / network:** Mid-range Android, 4G. (Fog is the feeling of moving, not a pilot — this tests the drift movement only.)
- **Steps:** 1) Open Episode 1. 2) Put the phone down, touch nothing, for 60 s. 3) Watch the scene drift. 4) Note judder, stops, heat, or any thermal warning.
- **Expected result:** Sustained slow drift, no judder, no thermal warning. Battery/heat noted qualitatively.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Judder? ☐ Yes ☐ No — Thermal warning? ☐ Yes ☐ No — Heat/battery note: ______

### D-07 — Pan across wide layered scene (drag)
- **Devices / network:** All phones. **All four episodes.**
- **Steps:** 1) Open an episode. 2) Drag left and right across the scene, then drag to each edge. 3) Repeat for Episodes 2, 3, 4.
- **Expected result:** Pan follows the finger with no lag perceptible to the tester; layers stay aligned at all offsets.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Ep1: ______ Ep2: ______ Ep3: ______ Ep4: ______ — Note: ______

### D-08 — Tap hotspots ("look closely")
- **Devices / network:** All phones. **All 12 hotspots (3 per episode).**
- **Steps:** 1) Open Episode 1, tap hotspot 1, time to card opening; close it. Repeat for hotspots 2 and 3. 2) Repeat for Episodes 2, 3, 4. 3) Check focus is visible on each hotspot and each card is dismissible.
- **Expected result:** Every hotspot opens its card ≤ 500 ms after tap; focus visible; card dismissible.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Slowest hotspot: ______ ms (episode/hotspot: ______) — Any hotspot failed? ☐ No ☐ Yes: ______ — Focus visible? ☐ Yes ☐ No — Note: ______

### D-09 — Pinch zoom / double-tap zoom
- **Devices / network:** iOS + Android.
- **Steps:** 1) Open Episode 1. 2) Pinch out on the scene. 3) Double-tap the scene. 4) Repeat on the other OS.
- **Expected result:** Record: works / partially works / blocked. If blocked, the custom scroll-zoom fallback still works (D-05 passes).
- **Result:** ☐ Pass (works) ☐ Partial ☐ Blocked, fallback works ☐ Blocked, fallback fails ☐ Not run — iOS: ______ Android: ______ — Note: ______

### D-10 — Panorama viewpoint ("stand here")
- **Devices / network:** Mid-range Android + iPhone, 4G. **All four episodes.**
- **Steps:** 1) Scroll to the panorama in Episode 1. 2) Drag left/right to look around. 3) Tap the "Jump to the field" hotspot. 4) Repeat for Episodes 2, 3, 4.
- **Expected result:** Panorama loads, look-around is smooth, hotspot jump works. GPU-memory behaviour noted (any blanking, reload, or crash).
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Ep1: ______ Ep2: ______ Ep3: ______ Ep4: ______ — GPU/memory note: ______

### D-11 — Pre-rendered opening clip in `<video>` (muted autoplay) — Episode 1 only
- **Devices / network:** All phones, Wi-Fi + 4G.
- **Steps:** 1) Open Episode 1 on Wi-Fi. 2) Note whether the 12 s clip starts on its own (muted) or shows the poster + tap-to-play cover. 3) Repeat on good 4G; time to first frame. 4) Let it play 60 s on Wi-Fi; count rebuffering stalls. 5) For Episodes 2–4, confirm the poster still + "clip not yet rendered" note appears and no fake video plays.
- **Expected result:** First frame ≤ 3 s on 4G; zero rebuffering in 60 s on Wi-Fi; poster shown immediately if autoplay is blocked. Episodes 2–4: honest "not yet rendered" note, no fake video.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Autoplay worked unaided? ☐ Yes ☐ No, tap needed — First frame on 4G: ______ s — Stalls in 60 s on Wi-Fi: ______ — Ep2–4 honest note shown? ☐ Yes ☐ No — Note: ______

### D-12 — Same clip, tap for sound — Episode 1 only
- **Devices / network:** All phones.
- **Steps:** 1) Open Episode 1, start the clip. 2) Tap for sound (unmute). 3) Note whether sound plays and whether iOS forces fullscreen.
- **Expected result:** Sound plays after tap; no fullscreen hijack on iOS (`playsinline` honoured). Record actual behaviour per device.
- **Note:** the opening clip is **silent by design** (no audio track, no music), so there is no audible sound to test from the clip itself. Record that fact; test tap-for-sound only through the YouTube harness if a cleared video has been selected — otherwise mark this row "not applicable to the clip as built".
- **Result:** ☐ Pass ☐ Fail ☐ Not applicable (clip silent by design) ☐ Not run — iOS fullscreen hijack? ☐ Yes ☐ No — Note: ______

### D-13 — Flex video card in chat → tap → LIFF
- **Devices / network:** All phones.
- **Steps:** 1) Send the Flex test message (design in `teams/phase-2-preparation.md` §1.3) to a test chat. 2) Check the preview image (correct, uncropped), the `altContent` on an old LINE version if one is available. 3) Tap the card's URI action.
- **Expected result:** Preview image correct and uncropped; `altContent` shown on old LINE; URI action opens the LIFF URL (not the endpoint URL).
- **Blocked until:** a Flex test message is sent — needs a real LINE test account. Do not run this row until then.
- **Result:** ☐ Pass ☐ Fail ☐ Blocked (no Flex sent yet) ☐ Not run — Preview correct? ☐ Yes ☐ No — URI opened LIFF URL? ☐ Yes ☐ No — Note: ______

### D-14 — Same clip, weak 4G / throttled — Episode 1 only
- **Devices / network:** Mid-range Android, throttled 4G.
- **Steps:** 1) Throttle the connection (device data-saver / throttled 4G). 2) Open Episode 1. 3) Time to first frame; count stalls. 4) Note whether the scene (still + text) stays usable if the video stalls.
- **Expected result:** Stall count and time-to-first-frame recorded. Scene remains usable (still images + text) even if video stalls.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — First frame: ______ s — Stalls: ______ — Scene usable with video stalled? ☐ Yes ☐ No — Note: ______

### D-15 — three.js vignette (ONE courtyard/room, low-poly) — ONLY IF ATTEMPTED
- **Devices / network:** Mid-range Android + previous-gen iPhone, Wi-Fi.
- **Expected result:** Draw calls < 100, triangles < 100k, DPR ≤ 2, frame time ≤ 33 ms sustained 60 s, zero context-loss events.
- **Result:** ☐ Pass ☐ Fail ☐ Out of scope — not attempted ☐ Not run — Note: ______

### D-16 — Same vignette on low-end Android — ONLY IF ATTEMPTED
- **Devices / network:** Low-end Android, Wi-Fi.
- **Expected result:** Record: passes / falls back to 2.5D still / crashes. A crash is a fail of the vignette, not of the prototype — the fallback must trigger.
- **Result:** ☐ Pass ☐ Falls back to 2.5D still ☐ Crashes (vignette fail) ☐ Out of scope — not attempted ☐ Not run — Note: ______

### D-17 — WebGL unavailable / context lost
- **Devices / network:** One iOS + one Android.
- **Steps:** 1) Simulate by blocking WebGL or by memory pressure (as the device allows). 2) Open the LIFF URL from chat.
- **Expected result:** 2.5D fallback appears automatically; visitor is never shown a blank canvas.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Device: ______ Method used: ______ Note: ______

### D-18 — Offline / airplane mode on LIFF open
- **Devices / network:** One iOS + one Android, airplane mode.
- **Steps:** 1) Turn on airplane mode. 2) Open the LIFF URL from chat (or reopen the app).
- **Expected result:** Honest failure copy shown; no infinite spinner; no crash.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — iOS: ______ Android: ______ — Note: ______

### D-19 — Japanese vs English LINE language; long Japanese strings
- **Devices / network:** iOS + Android, LINE language JP + EN.
- **Steps:** 1) Set LINE language to Japanese; open the app; read every episode, the Talk back section, and the 2029 question. 2) Repeat in English. 3) Check the Flex card (D-13) in both languages if it exists.
- **Expected result:** No truncation/overflow beyond the known Flex rendering variation; scene text legible in both languages.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — JP: ______ EN: ______ — Truncation seen? ☐ No ☐ Yes: ______ — Note: ______

### D-20 — Screen reader + reduced motion on
- **Devices / network:** iOS (VoiceOver) + Android (TalkBack), Wi-Fi.
- **Steps:** 1) Turn on VoiceOver/TalkBack and reduced motion. 2) Open the app. 3) Check: drift honours `prefers-reduced-motion` (still alternative offered); hotspots are announced; the linear "Read the scene" mode is usable end-to-end (all four episodes).
- **Expected result:** Drift honours reduced motion; hotspots announced; "Read the scene" usable end-to-end.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — iOS: ______ Android: ______ — Read mode end-to-end? ☐ Yes ☐ No — Note: ______

### D-21 — Low-power mode (iOS) / data-saver (Android) on
- **Devices / network:** One iOS + one Android.
- **Steps:** 1) Turn on low-power mode / data-saver. 2) Open Episode 1. 3) Note autoplay behaviour; tap the tap-to-play cover.
- **Expected result:** Autoplay behaviour recorded; the tap-to-play cover works in both modes.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — iOS autoplay: ______ Android autoplay: ______ — Tap-to-play works? ☐ Yes ☐ No — Note: ______

### D-22 — Cache: publish an update, reopen LIFF
- **Devices / network:** One iOS + one Android.
- **Steps:** 1) Note the app version/content on screen. 2) Publish a small visible update to the hosted app. 3) Reopen the LIFF app from chat. 4) Note whether the fresh content appears, and after what interval.
- **Expected result:** Fresh content served (or stale content with a named `Cache-Control` cause); no user-visible stale scene after a named interval.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Fresh content seen? ☐ Yes ☐ No — Interval: ______ — Cache cause if stale: ______ — Note: ______

---

## Part B — Pass criteria P-01–P-18 (each maps to D rows; the 2.5D-first design is confirmed only if ALL 18 pass)

| # | Criterion | Maps to | How it passes (pre-stated) | Result |
|---|---|---|---|---|
| P-01 | Opens in the LIFF browser | D-01 | LIFF URL from chat opens the LIFF browser on every matrix device; `liff.getContext().type` is not `external` | ☐ Pass ☐ Fail ☐ Not run |
| P-02 | Opens from outside LINE | D-02 | LIFF URL from email/Safari/Chrome either opens the LIFF browser or shows the designed external-browser fallback on every matrix device | ☐ Pass ☐ Fail ☐ Not run |
| P-03 | First paint | D-03 | Median first paint (low-res base + text) ≤ 2 s on 4G good, mid-range Android and previous-gen iPhone | ☐ Pass ☐ Fail ☐ Not run |
| P-04 | Full load | D-04 | Full layers ≤ 5 s on 4G good; no layout shift after first paint | ☐ Pass ☐ Fail ☐ Not run |
| P-05 | Zoom smoothness | D-05, D-07, D-09 | Scroll-driven zoom: frame time ≤ 16.7 ms for ≥ 90% of frames over 30 s, mid-range Android | ☐ Pass ☐ Fail ☐ Not run |
| P-06 | Drift smoothness | D-06 | 60 s auto-drift with no judder and no thermal warning on mid-range Android | ☐ Pass ☐ Fail ☐ Not run |
| P-07 | Hotspots | D-08 | Every hotspot opens its card ≤ 500 ms after tap on every matrix device; card dismissible; focus visible | ☐ Pass ☐ Fail ☐ Not run |
| P-08 | Video | D-11, D-14, D-21 | First frame ≤ 3 s on 4G; zero rebuffering in 60 s on Wi-Fi; poster shown immediately if autoplay blocked | ☐ Pass ☐ Fail ☐ Not run |
| P-09 | Sound | D-12 | Tap-for-sound plays audio; no fullscreen hijack on iOS. **Note:** the clip is silent by design, so this is not applicable to the clip as built; test only via the YouTube harness with a cleared video, or record "not applicable". If iOS forces fullscreen, that is a fail of the inline-sound design. | ☐ Pass ☐ Fail ☐ N/A (clip silent) ☐ Not run |
| P-10 | Panorama | D-10 | Panorama loads, look-around smooth, hotspot jump works on mid-range Android and iPhone | ☐ Pass ☐ Fail ☐ Not run |
| P-11 | Flex card | D-13, D-19 | Preview image correct and uncropped; `altContent` shown on old LINE; URI action opens the LIFF URL | ☐ Pass ☐ Fail ☐ Not run |
| P-12 | Return + resume | D-22 + two-way checks | `liff.closeWindow()` returns to chat; reopening from history <12 h resumes, >12 h reloads as documented, with no crash and no lost server-side progress | ☐ Pass ☐ Fail ☐ Not run |
| P-13 | Share | Two-way checks | ShareTargetPicker opens, message appears as the user's, in a group and to a friend; the test log records that the recipient *count* is unknowable (not a failure — a confirmed limit) | ☐ Pass ☐ Fail ☐ Not run |
| P-14 | Consent decline | Two-way checks | Declining `profile` / `chat_message.write` degrades gracefully — no crash, story still readable, re-prompt path works | ☐ Pass ☐ Fail ☐ Not run |
| P-15 | Accessibility | D-20, D-19 | Reduced-motion still alternative offered and honoured; hotspots announced by screen reader; linear "Read the scene" mode usable end-to-end. **If this fails, the app is not shippable in any form until it passes.** | ☐ Pass ☐ Fail ☐ Not run |
| P-16 | Offline | D-18 | Airplane-mode open shows honest failure copy, no infinite spinner, no crash | ☐ Pass ☐ Fail ☐ Not run |
| P-17 | Instrumentation | — | Every event is logged server-side with the correct scene/event, on every matrix device, after `liff.init()` resolves. **Current state: deliberate deviation — the app logs client-side only (console + on-page list, no server, no personal data). This row CANNOT pass until server-side instrumentation is built by the teams and tested.** | ☐ Pass ☐ Fail (deviation) ☐ Not run |
| P-18 | Weak network | D-14, D-17 | On throttled 4G, the scene remains usable (still images + text) even if video stalls; stall count and time-to-first-frame recorded | ☐ Pass ☐ Fail ☐ Not run |

**Tally (fill in after the run):** ______ of 18 fully passed on a device / in LINE. 2.5D-first confirmed? ☐ Yes (all 18) ☐ No.

---

## Part C — Two-way checks (Talk back, share, close, deep links, bot reply loop)

Run these in LINE's real WebView, from the TASK chat, on one iPhone and one Android. The LIFF app scopes are openid, profile, `chat_message.write` (per the 2026-11-25 record — if a send fails 403, record the actual scope state shown by the app instead of assuming the record).

### C-1 — `liff.init` in LINE
- **Steps:** 1) Open the LIFF URL from the TASK chat. 2) Read the Talk back status line and the instrumentation log.
- **Expected result:** Status reads "You are in LINE, in the TASK chat…". Log shows `liff_ready` with `inClient=true` and scopes including `chat_message.write`. The external-browser banner is hidden.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — iPhone: ______ Android: ______ — Scopes actually shown: ______ — Note: ______

### C-2 — Talk back: choice writes a draft, sends nothing
- **Steps:** 1) In each episode, tap one two-way choice button (12 total across the four episodes — test at least one per episode). 2) Check the Talk back form and the pending list.
- **Expected result:** The choice fills the text box as a draft; the status says nothing has been sent; the pending list shows nothing sent.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Ep1: ______ Ep2: ______ Ep3: ______ Ep4: ______ — Note: ______

### C-3 — Talk back: send blocked without opt-in; send works with opt-in
- **Steps:** 1) Write words in the Talk back box. 2) Tap **Send to TASK** WITHOUT ticking the box. 3) Tick the box, tap **Send to TASK** again. 4) Check the TASK chat on a second device / in the chat view.
- **Expected result:** Without the tick, nothing is sent and the app says "Tick the box first". With the tick, one TEXT message arrives in the TASK chat, carrying the episode, the kind (memory / place-note / question), and the visitor's words. Pending list shows "SENT TO TASK CHAT".
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Blocked without tick? ☐ Yes ☐ No — Message arrived in chat? ☐ Yes ☐ No — Text correct? ☐ Yes ☐ No — Note: ______

### C-4 — Talk back: send from Keep Memo / recent-services list fails honestly
- **Steps:** 1) Open the app from Keep Memo (or the recent-services list) instead of from a chat. 2) Try to send.
- **Expected result:** Send does not work from there; the app says so honestly ("open it from the TASK chat") instead of failing silently. Nothing is sent.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Note: ______

### C-5 — Withdraw: unsent draft deleted; sent note withdrawn by message
- **Steps:** 1) Write a draft, tap **Withdraw** — draft is deleted on the device, nothing sent. 2) Send a note (C-3), then tap **Withdraw** — a withdrawal TEXT message arrives in the TASK chat.
- **Expected result:** Unsent draft deleted, status confirms nothing was ever sent. After a send, a withdrawal text is sent and the app confirms a person will remove the earlier note.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Draft deleted? ☐ Yes ☐ No — Withdrawal text arrived? ☐ Yes ☐ No — Note: ______

### C-6 — Share via `shareTargetPicker`
- **Steps:** 1) In LINE, tap **Share this episode instead**. 2) Pick a friend and a group. 3) Check the message appears as the user's.
- **Expected result:** Picker opens; message appears as the user's in both a group and to a friend. The log records that the recipient **count** is unknowable — never record a count (it is unknowable by design, not a failure).
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Picker opened? ☐ Yes ☐ No — Friend: ______ Group: ______ — Count claimed? ☐ No (correct) ☐ Yes (FAIL — do not claim counts) — Note: ______

### C-7 — Return to chat via `closeWindow`, and resume / reload
- **Steps:** 1) Tap **Return to chat** — the LIFF window closes and you are back in the TASK chat. 2) Reopen the LIFF app from history within 12 h — it resumes. 3) Reopen after more than 12 h — it reloads as documented. 4) Note any crash or lost progress.
- **Expected result:** `closeWindow()` returns to chat. <12 h resume / >12 h reload, no crash, no lost server-side progress.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Close worked? ☐ Yes ☐ No — <12 h resume? ☐ Yes ☐ No — >12 h reload? ☐ Yes ☐ No — Note: ______

### C-8 — Deep links: `?episode=&hotspot=`, direct and via `liff.state`
- **Steps:** 1) Open the LIFF URL with `?episode=2&hotspot=card-e2-real` appended (plain query). 2) Open a LIFF URL whose `liff.state` carries `?episode=4&hotspot=card-e4-access` (as a bot Flex message would send it). 3) Open a bad deep link (`?episode=9&hotspot=nope`) and confirm it is rejected honestly.
- **Expected result:** Each good link opens the right episode and the right hotspot card. The bad link opens Episode 1 (default) and logs a rejection; no crash, no wrong card.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Plain query: ______ — Via `liff.state`: ______ — Bad link rejected: ☐ Yes ☐ No — Note: ______

### C-9 — Bot reply loop (chat → LIFF → chat → reply)
- **Blocked until:** the bot-side reply is deployed to the live TASK webhook — the draft exists in `teams/two-way-communication.md`, it is NOT deployed. Do not run this check until that deployment has Carl's go and is done.
- **Steps:** 1) Send a Talk back text from the LIFF app (C-3). 2) Confirm it arrives in the TASK chat and triggers the webhook. 3) Confirm the bot replies in chat within the ~60 s reply-token window, with a Flex message carrying a deep link back into the LIFF app. 4) Tap the Flex link; confirm the LIFF app reopens at the right episode and hotspot.
- **Expected result:** Text arrives; bot reply arrives in chat (reply token, free — not a push); Flex deep link reopens LIFF at the right episode + hotspot.
- **Result:** ☐ Pass ☐ Fail ☐ Blocked (webhook not deployed) ☐ Not run — Reply arrived in: ______ s — Flex link reopened correctly? ☐ Yes ☐ No — Note: ______

### C-10 — Consent decline degrades gracefully (P-14)
- **Steps:** 1) Decline the `profile` / `chat_message.write` permission when LINE asks (or revoke it and reopen). 2) Read the scene. 3) Try to send; follow the re-prompt path.
- **Expected result:** No crash; the story stays readable; sending explains the missing permission honestly; a re-prompt path works.
- **Result:** ☐ Pass ☐ Fail ☐ Not run — Story readable after decline? ☐ Yes ☐ No — Re-prompt works? ☐ Yes ☐ No — Note: ______

---

## Run record

| Run | Date | Tester | Device | Network | LINE version | LIFF SDK | Result summary |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |

**Final tally after the run:** D: ______ of 22 passed (D-15/D-16 out of scope unless attempted) · P: ______ of 18 passed · Two-way C-1–C-10: ______ of 10 passed.
**2.5D-first confirmed?** ☐ Yes — all 18 P passed on a device / in LINE. ☐ No — list the failures: ______

**What even a fully passing run would not prove:** enjoyment, return, audience size, sponsor funding, second-place cost, Genesis fidelity, or commercial viability. Those need real-visitor testing with consent, not this pack.
