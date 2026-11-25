# Rising Together — Four-Episode LIFF-Ready App (Internal Review Only)

**Date:** 2026-11-25 (polish round; four-episode expansion of the bounded prototype of 2026-11-24)
**Status:** Internal review only. Not publication, not launch, not a live LINE app.
**Built from:** Integrated Findings §5–§6; Technical team §§4–5 (P-01–P-18, D-01–D-22);
Story team 9-shot storyboard; Visual team 7-layer stack and register system;
Four Episodes Shared Brief 2026-11-24 (`../episodes/shared-brief.md`).

## What was built

`~/workspace/goals/rising-together/prototype/`

- `index.html` — one page, four episodes plus two shared sections: an episode selector
  (1–4) at the top, switching scenes without a page reload; per-episode 2.5D scene,
  opening clip, and “Stand here” panorama; then a shared 2029 question in words only
  and shared notes + instrumentation log.
- `styles.css`, `app.js` — no external CSS/JS libraries. No CDN except YouTube, and only
  on demand (see below). Episode 2–4 scenes, posters, and panoramas are painted CSS
  (gradients) — no photographs, no yearbook images, no copied game or shop images.
- `assets/` (unchanged, Episode 1 only) — `opening-clip.mp4`, 12 s, 1280×720, 132 KB,
  painted frames only, **silent by design** (no audio track, no music, no clearance needed);
  `poster-field.png`, `poster-housing.png`, `poster-stadium.png`, `poster-japan.png`
  (painted posters, ~22–26 KB each); `panorama.png` (painted 360° still, 2400×600, 20 KB).

## The four episodes

| # | Episode | Scene | Clip | Panorama |
|---|---|---|---|---|
| 1 | Chofu — the field | Reuses the bounded prototype's painted 2.5D scene | Reuses the silent painted 12 s clip | Reuses the painted panorama still |
| 2 | Yokosuka — the street | New painted/CSS 2.5D scene, Dobuita street | Poster still + honest "clip not yet rendered" note — not a fake video | Painted still panorama from CSS/painted assets |
| 3 | Tachikawa — the park | New painted/CSS 2.5D scene, airfield → park | Poster still + honest "clip not yet rendered" note — not a fake video | Painted still panorama from CSS/painted assets |
| 4 | Tama — imagined | New painted/CSS 2.5D scene, civilian-era framing only, imagined | Poster still + honest "clip not yet rendered" note — not a fake video | Painted still panorama from CSS/painted assets, imagined |

Episode choice is agent-selected, pending Carl's review (see the shared brief, §1 and §8).
If Carl prefers Yokosuka first on the strength of its living street and Shenmue pilgrimage,
the evidence supports that as a defensible choice.

## The 2.5D scenes (all four episodes)

- 7-layer stack (Visual team §3.2), ratios 0.1 / 0.25 / 0.5 / 1.0 / 1.25 / 1.6:
  sky, far, mid-far, mid, figures, near, text/sound/mark.
- Scroll-driven zoom, 5 beats per episode, transform-only animation,
  `requestAnimationFrame`-throttled. Per-episode beat labels (e.g. Episode 2:
  street → harbour → shopfronts → sukajan → Yokosuka).
- Slow auto-drift, capped, pausable; drag-to-pan (per-episode pan state);
  respects `prefers-reduced-motion` (drift off, still alternative).
- Hotspots: max 3 per episode (12 total). Each opens a card with a one-sentence source line.
- Linear “Read the scene” mode per episode: the whole zoom as text, no panning or zooming required.
- Figures are drawn silhouettes from behind. No likeness of any real person, in any episode.
- Persistent register mark, always visible, the same in every episode:
  “Imagined, to be witnessed and experienced by everyone” (Carl, 2026-11-25 —
  it does not change between episodes, on scroll, or on a hotspot tap).
  “On the record” / “Not established” live inside hotspot cards only.
  “What am I looking at?” gives a three-line answer for the active episode.

## The opening clips

- Episode 1: the self-hosted MP4 above, `playsinline`, muted, poster shown,
  tap-to-play cover if autoplay is blocked. Muted autoplay is **attempted, not claimed** in LINE.
- Episodes 2–4: no video file exists. Each shows a painted poster still with a
  tap-to-play cover; tapping it shows an honest "clip not yet rendered" note and
  logs `clip_not_rendered`. No fake video is played.
- YouTube: a test harness (Episode 1 only), not a selected video. No YouTube video is
  embedded by default — no video was selected and no rights were cleared. A reviewer
  can enter a video ID to load `youtube-nocookie.com/embed/<id>?playsinline=1&mute=1&autoplay=1&rel=0`.
  Sound requires a tap. Tapping the YouTube title leaves this page for YouTube.
  Embedding can be disabled by the owner; age-restricted videos will not embed.

## Register system

Persistent corner mark, always visible, the same in every episode:
“Imagined, to be witnessed and experienced by everyone” (Carl, 2026-11-25).
“On the record” / “Not established” live inside hotspot cards only. A “What am I looking at?”
button gives the three-line answer for the active episode. No scene is labelled “Photo” —
there are no photographs in this app, so nothing is presented as a photograph.

## Verified facts used, as text only

- Chofu High School 1963–1974, Kanto Mura Housing Annex; about 880 homes, about 4,500 people;
  fully returned to Japan in 1974; returned area 203.6 hectares.
- Ajinomoto Stadium (Tokyo Stadium), opened 10 March 2001, on the former Kanto Mura housing area.
- Chofu Vikings 1971, Far East Champions, 9–1, only loss 8–18 to Yamato.
  John Okabayashi — Quarterback, Senior, Honolulu, Hawaii.
  Tony Reed — Running Back, Junior, San Francisco, Calif.
  Henry Williams — Junior, RB/DB, Honorable Mention; jersey 32 in his portrait.
  Source: Hosho 1972, pp. 96–99, verified visual reading 2026-11-24.
- No exact school/field-equals-stadium footprint claim — regional relationship only.
- Tachikawa: base permanently closed 30 September 1977, full return 1977;
  Showa Kinen Park opened 26 October 1983. A c.1952 Akebonocho photograph exists,
  museum-held — **not used here**; the photograph is not shown, copied, or traced.
  It is described in words only.
- Yokosuka: Dobuita is a real street, photographable today; Shenmue's Dobuita was modelled
  on it. No shop is named as participating; no shop sign, logo, or jacket design is reproduced.
- Tama: an active annex, ID/guest-only access. The episode is imagined, civilian-era framing
  only; no era claimed; it is not depicted as publicly visitable and claims no access.

## Open questions (not decided in this app)

1. **Episode choice and order:** team decision (Chofu, Yokosuka, Tachikawa, Tama).
2. **Stadium naming — decided (Carl, 2026-11-25):** the stadium is Ajinomoto Stadium,
   the actual name, used everywhere in the app. There is no “present Olympic Stadium” option.
3. **Tama era:** no era claimed. Episode 4 stays an internal imagined study, civilian-era framing only.
4. **Tachikawa museum photograph:** not used in this app — described in words only, not shown,
   copied, or traced. No request drafted or sent. No outside contract, permit, or permission is
   needed to run this app, and none is being sought as a stop (Carl, 2026-11-25); no partnership,
   consent, or funding is claimed anywhere in it.
5. **Fog is not a pilot (Carl, 2026-11-25):** fog is the feeling of moving through a place,
   not a pilot and not a test. The pilots are what we pull from GTA and Sega styles and
   stories — a dense small district, substories, “look closely” hotspots, side streets,
   craziness in labelled play streets, a calendar with one choice a day, weekly rotation,
   named contacts handing out work, and visitor contributions — built and tested as
   episodes, measured per episode by returns, dwell, shares, and contributions.
6. **2029:** text question only. No immersive scene, video, or prediction — needs separate
   Carl go C-7, plus the nine presentation requirements and a test reading.
7. **PAS amount:** not quoted as a settled figure in this app. See TEST-LOG.md / fact-fix note.
8. **LIFF ID now exists:** LINE Login channel "Rising Together" 2012800911 (TASK L3C, Developing) and LIFF app "Rising Together" 2012800911-7BPP3dHp, https://liff.line.me/2012800911-7BPP3dHp, endpoint https://chwillpcs-task.github.io/rising-together/, scopes openid, profile, chat_message.write (per the 2026-11-25 progress-tracker record; not re-verified in the LINE console in the polish round — the app checks the scope at run time and reports honestly if it is missing or not granted). Loading in LINE is still untested. **Two-way (2026-11-25):** Talk back is built and guarded in code (`liff.sendMessages()`, text only, one tap, opt-in, ≤500 chars; share picker; withdraw; real `liff.closeWindow()` in LINE). The bot-side reply (Flex deep link) is drafted in `../teams/two-way-communication.md`, not deployed to the live webhook.

## Device-test pack (2026-11-25 polish round)

`DEVICE-TEST-PACK.md` — ready to run by the teams. One document: D-01–D-22 and
P-01–P-18, each with exact steps, expected result, and a pass/fail box, plus the two-way
checks (`liff.init`, `sendMessages`, `shareTargetPicker`, `closeWindow`, deep links
`?episode=&hotspot=`, bot reply loop). **Not run** — no phone, no LINE WebView test, no
deployment to the live webhook in this round. See `TEST-LOG.md` for the honest state:
2.5D-first is NOT confirmed, 0 of 18 P-criteria fully passed on a device / in LINE.

## Two-way communication (2026-11-25)

One two-way moment per episode (Chofu: "Did a school field ever matter to you?"; Yokosuka: "What caught your eye on this street?"; Tachikawa: "Which do you see — the airfield, or the park?"; Tama: "Which era should this be?"), plus a shared Talk back section. A choice only writes a draft; nothing is sent until the visitor ticks the opt-in box and taps **Send to TASK**. Contributions are text only, human-reviewed before anything is ever shown, and reversible (withdraw deletes an unsent draft, or sends a withdrawal text after sending). See `../teams/two-way-communication.md` for the full design, the webhook draft, and the contribution rules.

## Pinatubo — internal note only

Included as a text panel in the notes section: Pinatubo June 1991, Operation Fiery Vigil
(~20,000 evacuated from Clark and Subic), Clark turned over 1991-11-26, Philippine Senate
rejected a new bases treaty 12–11 on 1991-09-16, Subic closed 1992-11-24 — political as much
as environmental. Not built as a scene, not a prediction about Japan.

## Out of scope (not built)

Real-time 3D, Unity WebGL, Genesis live, in-app purchase, service messages, MINI App features,
multi-place world, calendar, multiplayer, live broadcast, any public sharing,
any 2029 immersive scene, any likeness / voice / dialogue for a named real person,
yearbook photos, music, the “9 million abandoned houses” figure as public copy,
any rendered opening clip for Episodes 2–4, any use of the Tachikawa museum photograph,
any depiction of a Tama facility interior, any shop participation in Yokosuka.
(LIFF ID and the LIFF app now exist — see open question 8 above — but loading in LINE is untested, and the bot-side reply is drafted, not deployed.)

## How to open it

Serve the folder over HTTP (not `file://`, so the video and assets load as they would from a
host) and open `index.html` in a browser:

```bash
cd ~/workspace/goals/rising-together/prototype
python3 -m http.server 8000
# open http://localhost:8000/
```

## Instrumentation

Client-side log only (browser console + the on-page log in the notes section).
Events: page_view, episode_select, episode_entry, scene_entry,
hotspot_tap / hotspot_close, drift_toggle, read_mode, video_play / video_play_25/50/75/100,
video_pause, video_autoplay_blocked, video_error, clip_not_rendered,
youtube_load / youtube_clear / youtube_empty,
panorama_loaded, panorama_hotspot_jump, offline, return (simulated, or real `liff.closeWindow()` in LINE),
liff_ready / liff_not_present / liff_init_failed / liff_scope_missing,
two_way_choice, talkback_status, send_to_task / send_blocked_not_in_line / send_blocked_scope / send_failed,
share_chosen / share_blocked_not_in_line / share_failed,
withdraw_draft / withdraw_sent / withdraw_failed,
deep_link_hotspot / deep_link_hotspot_rejected / deep_link_episode_rejected.
No server, no personal data, no LIFF analytics claim. Retention: this page session only.
