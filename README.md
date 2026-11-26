# Rising Together — Four-Episode LIFF-Ready App (Internal Review Only)

**Date:** 2026-11-25 (polish round; four-episode expansion of the bounded prototype of 2026-11-24)
**Status:** Internal review only. Not publication, not launch, not a live LINE app.
**Built from:** Integrated Findings §5–§6; Technical team §§4–5 (P-01–P-18, D-01–D-22);
Story team 9-shot storyboard; Visual team 7-layer stack and register system;
Four Episodes Shared Brief 2026-11-24 (`../episodes/shared-brief.md`).

## What was built (experience-first rebuild, 2026-11-25)

`~/workspace/goals/rising-together/prototype/`

- `index.html` — one page. On load the visitor is IN an experience, not a book:
  the locker-room opening (other team's `locker.js`/`locker.css` — locker →
  tunnel → line, snap the ball, cheers, visual only), then a full-screen
  painted stage that is already moving, with a tiny HUD (4-episode strip +
  small persistent register mark) and nothing else up top. After the stage:
  the PLAY district (other team's `play.js`/`play.css`), the 2029 question
  in words only, a compact Talk back section, and Notes collapsed to a
  `<details>` with the event log. No big header, no intro paragraph, no
  episode-selector wall, no per-episode pilot essays, no YouTube harness,
  no panorama sections, no long Pinatubo note.
- `styles.css`, `app.js` — the stage, hotspots, daily job, side streets,
  Japan map, Read-it, clip, talk-back and LIFF. No external CSS/JS
  libraries. No photographs, no yearbook images, no copied game or shop
  images. PLAY mode and the locker room live in their own files
  (`play.js`/`play.css`, `locker.js`/`locker.css`); the Phaser districts
  live in `phaser.min.js` (vendored Phaser 3.80.1), `engine.js` (the
  data-driven district engine) and `emulation.js` (the loader), with the
  four districts as data in `data/*.json`. `app.js` keeps only the
  integration — episode switching calls `window.__rtPlaySetEpisode(n)` and
  `window.__rtPhaserSetEpisode(n)` when they exist. No duplicate wiring:
  each button has exactly one handler.
- The stage: scroll = travel through 5 beats per episode (field → same
  ground re-dressed → housing fading house by house → Ajinomoto Stadium
  rising → animated Japan map), drag-to-pan = walking, auto-drift and
  parallax layers, animated silhouettes (runners run, ball rolls, kite
  drifts), moving fog, warm faded past washing into full-colour present.
  Hotspots (4 per episode) DO something — ball chase, pigeon steals the
  ball, train passes, runway line appears, rain runway, tap-the-cats,
  tap-the-ducks — max 3 short lines per moment, facts only behind "About
  this place". One choice a day (which contact hands out the work) is the
  return reason. "Read it" shows at most 5 one-line beats, hidden by
  default. The 12 s silent Chofu clip is a "Watch the field move" tap,
  poster first. 2029 stays a short text question; Pinatubo one line behind
  "About this question".
- `assets/` (unchanged, Episode 1 only) — `opening-clip.mp4`, 12 s, 1280×720, 132 KB,
  painted frames only, **silent by design** (no audio track, no music, no clearance needed);
  `poster-field.png`, `poster-housing.png`, `poster-stadium.png`, `poster-japan.png`
  (painted posters, ~22–26 KB each); `panorama.png` (painted 360° still, 2400×600, 20 KB).

## The four episodes

| # | Episode | Scene | Clip | Panorama |
|---|---|---|---|---|
| 1 | Chofu — the field | Full-screen moving stage | Silent painted 12 s clip, tap to watch | Stage + PLAY district, no panorama |
| 2 | Yokosuka — the street | Full-screen moving stage, Dobuita street | Clip not rendered, said honestly | Stage + PLAY district, no panorama |
| 3 | Tachikawa — the park | Full-screen moving stage, airfield → park | Clip not rendered, said honestly | Stage + PLAY district, no panorama |
| 4 | Tama — imagined | Full-screen moving stage, civilian-era framing only, imagined | Clip not rendered, said honestly | Stage + PLAY district, no panorama |

Episode choice is agent-selected, pending Carl's review (see the shared brief, §1 and §8).
If Carl prefers Yokosuka first on the strength of its living street and Shenmue pilgrimage,
the evidence supports that as a defensible choice.

## Locker room — Episode 1 opening (2026-11-25, Carl's scene)

`locker.css`, `locker.js`, and the `#locker-room` section at the top of
`index.html`: Henry, John and Tony in the high school locker room before the
championship game — from behind, names on their backs (OKABAYASHI, REED,
WILLIAMS 32), CHOFU above their heads. The visitor travels it: scroll or tap
to move locker room → tunnel (door opens, team walks toward the light) →
line of scrimmage (camera zooms in, huddle breaks) → tap **Snap the ball** →
the play moves (Williams 32 breaks right) → the crowd rises, CHEERS. Replay,
or walk on to the field stage. Facts (9–1, Far East Champions, positions,
Hosho 1972 pp. 96–107, single visual read) live behind "About this moment"
only. Painted pictures as the scene backgrounds (2026-11-25 visual rebuild:
`assets/visuals/web/locker-room.jpg` for the locker room, `field-line.jpg`
for the line of scrimmage), no faces, no likeness, no voice, no dialogue, no
music, no audio — cheers are visual. Register mark persistent in the section
header. Hidden on Episodes 2–4, shown again on Episode 1.
**Known issue, stated in the app:** the painting invents details — only
WILLIAMS 32 is from the record; the other jersey numbers (12, 44) and the
team nickname ("Tornadoes") in the picture are invented by the painting, not
facts. The note is visible under the scene and inside "About this moment".

## GTA/Sega-style pilots (2026-11-25)

Each episode is built as a GTA/Sega-style pilot: a dense small district,
substories with named fictional contacts, "look closely" hotspots, labelled
"Imagined — play" side streets, and a calendar with one choice a day and
weekly rotation. Full pilot text lives in the episode files
(`../episodes/01-chofu/episode.md` through `../episodes/04-tama/episode.md`),
rewritten 2026-11-25 as playable do-steps (cut by half). In the app the pilots
are PLAYED, not read: hotspots do things, substories are jobs handed out by
contacts, side streets are entered by choice (`play.js` PLAY district,
`app.js` moment engine). Chofu: the Tract — field, fading Kanto Mura housing,
Ajinomoto Stadium present. Yokosuka: Dobuita and the harbour steps, working
port town outside the base. Tachikawa: park, runway line, base town; museum
photograph not used, permission not held. Tama: imagined, civilian-era
framing only, internal only. Fog is the feeling of moving, not a pilot. No
decision stops; no outside contract, permit, or permission needed or
claimed; no partnership, consent, or funding claimed. Painted only.

## The 2.5D scenes (all four episodes)

- 7-layer stack (Visual team §3.2), ratios 0.1 / 0.25 / 0.5 / 1.0 / 1.25 / 1.6:
  sky, far, mid-far, mid, figures, near, text/sound/mark.
- Scroll-driven zoom, 5 beats per episode, transform-only animation,
  `requestAnimationFrame`-throttled. Per-episode beat labels (e.g. Episode 2:
  street → harbour → shopfronts → sukajan → Yokosuka).
- Slow auto-drift, capped, pausable; drag-to-pan (per-episode pan state);
  respects `prefers-reduced-motion` (drift off, still alternative).
- Hotspots: 4 per episode (16 total). Each DOES something — a chase, a
  moment, a choice — max 3 short lines; facts only behind "About this place".
- "Read it" is a toggle showing at most 5 one-line beats, hidden by default.
  There is no long linear Read-the-scene mode as the main mode any more.
- Figures are drawn silhouettes from behind. No likeness of any real person, in any episode.
- Persistent register mark, always visible, the same in every episode:
  “Imagined, to be witnessed and experienced by everyone” (Carl, 2026-11-25 —
  it does not change between episodes, on scroll, or on a hotspot tap).
  “On the record” / “Not established” live inside hotspot cards only.
  “What am I looking at?” gives a three-line answer for the active episode.

## The opening clips

- Episode 1: the self-hosted MP4 above, `playsinline`, muted, poster shown,
  behind a "Watch the field move" tap. Muted autoplay is **attempted, not claimed** in LINE.
- Episodes 2–4: no video file exists. Each honestly says the clip is not
  rendered. No fake video is played.
- No YouTube harness in the app any more — removed in the experience-first
  rebuild. No panorama sections in the app any more — the stage and the PLAY
  district are the way around, not a still panorama.

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

## PLAY mode — walk the district (2026-11-25, Carl's challenge)

**Carl, 2026-11-25:** what of the app has any resemblance of GTA or Sega, or anything popular? Honest answer, given to him in chat: almost nothing in the built app — the resemblance was on paper only, names of mechanisms in documents, not in the experience. The app was a written book with old fashioned graphics and lots of text.

**What changed, in the app itself (`play.js` + `play.css`, section `#play` in `index.html`):** a walkable district under the stage, per episode. The visitor arrives, moves, meets someone, gets a small job, does it, and sees the district change — the GTA / Yakuza / Shenmue / Persona mechanics, stolen, never the picture (no GTA/Sega art, assets, characters, music, or trademarks):

- **Free movement:** tap the street to walk there, hold ◀ ▶, or arrow keys. A painted figure walks; the camera follows. Not scroll-a-picture.
- **Substories as missions:** 3 per episode, from the fictional contacts in the episode files (Miki / Old Jiro / Aya in Chofu; Rin / Haru / Mrs. Umi in Yokosuka; Mr. Kaze / Sora / Nana in Tachikawa; Mrs. Mori / Pip / the path-keeper in Tama). Each is 2–3 steps — talk, walk somewhere, tap a target, return — and the last step changes the scene and fills a trust heart.
- **Visible progression, not text:** HUD shows today's job (one a day, by weekday), a map of 4 places that lights up as you visit them, "Jobs done: n of 3", and a trust heart per contact. Progress is kept on this device only (localStorage, guarded).
- **Look closely:** 3 hidden details per episode; tapping one shows one line and marks it found.
- **Side streets, playable:** "Imagined — play", short, clean exit. Chofu: chase the pigeon (tap it 3 times — the pigeon always wins). Yokosuka: the Cat Mayor approves everyone. Tachikawa: make it rain, land 3 paper planes. Tama: shout a word, the meadow returns a different one.
- **First minute:** walk to Miki, take The Lost Ball, find the ball in the grass, bring it back — a complete loop in under a minute.

The sibling experience-first rebuild (same day, same files) already gave the stage: visitor in the scene on load, hotspots that do something (chase, train, runway line, rain, cats, ducks), a daily job, side streets as text, an animated Japan map. PLAY mode adds what that stage did not have: free walking, multi-step jobs, and a tracker you can see fill. The two layers are complementary, not duplicates. `app.js` `switchEpisode()` now also calls `window.__rtPlaySetEpisode(n)` so the district follows the episode.

**Emulation — all four districts as Phaser places (2026-11-26):** Carl's
clarification, in substance: "when I say emulation, I really want the
users to see or think they are in something like a Sega and GTA look-a-like
environments and people popping sometimes." The Phaser layer is now the
data-driven engine (`engine.js`, `data/*.json`, loaded by `emulation.js`)
for ALL FOUR episodes, replacing the Chofu-only `phaser-game.js` (removed
from the deploy; it survives in git history). What a visitor now sees:
a dense street with neon shop signs in our own words (RAMEN, TAILOR, CAFÉ
— no trademarks), warm-lit windows, street lamps, a vending machine, the
landmark alive (boats bobbing in the harbour, trees swaying in the park,
butterflies over the meadow, floodlights over the stadium); people popping
in and out — Kenji opens the shutter of the shuttered shop, Jin the sailor
walks down the harbour steps, Yuki chases a ball across the field, a cat
trots across the street, unnamed walkers cross and are gone; and in Chofu
a "Snap the ball" button — the ball snaps, a plain runner crosses, the
10-figure crowd rises and CHEERS! appears with confetti. No Sega or GTA
art, character, music or trademark is copied; the feeling is stolen, never
the picture. The crowd carries no numbers and no names — only WILLIAMS 32
is on the Hosho record, and it is not used here. All three jobs per
district play in the game (The Lost Ball included); finishing one marks
the day's job done in the stage above. The save key is now
`rising-together:v2` (per-district), so a visitor who finished The Lost
Ball in the old v1 build starts fresh here; the CSS street below keeps its
own progress and is still the fallback if Phaser cannot start. Verified
in this VM: `node --check` on all scripts, all four data files validate,
local HTTP 200s, and a real-browser Playwright run (Chromium, 390×844):
**47 checks, 0 failed** — boot, signs, NPC spawn/walk/despawn, walker,
cat, snap crowd, full Lost Ball playthrough, episode switches to Yokosuka,
Tachikawa and Tama, register mark, locker room and talk-back intact (see
`TEST-LOG.md`). The one console error in the run was the external LIFF SDK
(`static.line-scdn.net`) failing to load in this sandbox
(`ERR_TUNNEL_CONNECTION_FAILED`) — pre-existing, not part of this build.
**Not yet verified on a real phone, or in LINE's real WebView — device
test NOT RUN.** Frame rate was ~4 fps under SwiftShader in this VM; that
is a test-environment number, not a phone number, and is not claimed.

**Still not there (honest):** no real 3D, no vehicle, no other players, no multiplayer — LIFF cannot do those, and none is claimed. No music. No 2029 immersive scene. The district is 2D painted CSS, one street per episode, not an open city. The stage and the district are two separate places in one page; they do not yet share one camera or one player.
