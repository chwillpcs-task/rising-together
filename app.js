/* Rising Together — four-episode LIFF-ready web app, internal review only.
   Standalone first; loadable later as a LIFF endpoint. No LIFF ID exists.
   Instrumentation: client-side log only. No server, no personal data,
   no LIFF analytics claim. */
(function () {
  "use strict";
  var logEl = document.getElementById("event-log");
  var events = [];
  function log(event, detail) {
    var entry = { t: new Date().toISOString(), event: event, detail: detail || "" };
    events.push(entry);
    console.log("[rising-together]", entry.t, entry.event, entry.detail);
    if (logEl) {
      if (events.length === 1) logEl.innerHTML = "";
      var li = document.createElement("li");
      li.textContent = entry.t + " — " + entry.event + (entry.detail ? " — " + entry.detail : "");
      logEl.appendChild(li);
    }
  }
  window.__rtLog = events;

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  log("page_view", "standalone browser, no LIFF, reduced-motion=" + reduced);

  /* ---- Episode configuration ---- */
  var EPISODES = {
    "1": {
      name: "Chofu — the field",
      mark: "Imagined — to bring the place alive",
      beats: [
        "Beat 1 of 5 — The field",
        "Beat 2 of 5 — Track, soccer, football (same ground, re-dressed)",
        "Beat 3 of 5 — The housing disappears (returned 1974)",
        "Beat 4 of 5 — The present stadium: Ajinomoto Stadium",
        "Beat 5 of 5 — Japan, today (painted map)"
      ],
      what: "What you are looking at: a painted reconstruction of the Chofu field, 1971. " +
        "The team, names and 9–1 season record are on the record (Hosho 1972, pp. 96–99). " +
        "The moving game, faces and weather are imagined. The exact spot of the old field is not established."
    },
    "2": {
      name: "Yokosuka — the street",
      mark: "Imagined — to bring the place alive",
      beats: [
        "Beat 1 of 5 — Dobuita street",
        "Beat 2 of 5 — The harbour",
        "Beat 3 of 5 — Shopfronts, painted",
        "Beat 4 of 5 — The sukajan",
        "Beat 5 of 5 — Yokosuka, today (painted map)"
      ],
      what: "What you are looking at: a painted reconstruction of Dobuita street, Yokosuka, outside the base. " +
        "The street is real and photographable today; this picture of it is painted, not a photograph. " +
        "No shop is named as participating, and no shopfront here is a portrait of a real shop."
    },
    "3": {
      name: "Tachikawa — the park",
      mark: "Imagined — to bring the place alive",
      beats: [
        "Beat 1 of 5 — The airfield, 1977",
        "Beat 2 of 5 — The runways fall silent",
        "Beat 3 of 5 — The return (1977)",
        "Beat 4 of 5 — Showa Kinen Park, present",
        "Beat 5 of 5 — Tachikawa, today (painted map)"
      ],
      what: "What you are looking at: a painted reconstruction of Tachikawa, airfield to park. " +
        "The base closed 30 September 1977 and was fully returned that year; Showa Kinen Park opened 26 October 1983 — on the record. " +
        "The museum photograph of Akebonocho (c.1952) is not used here: permission not held."
    },
    "4": {
      name: "Tama — imagined",
      mark: "Imagined — to bring the place alive",
      beats: [
        "Beat 1 of 5 — Open grass, imagined",
        "Beat 2 of 5 — Trees and water",
        "Beat 3 of 5 — Recreation, imagined",
        "Beat 4 of 5 — The question of era",
        "Beat 5 of 5 — Tama, imagined — not a visit"
      ],
      what: "What you are looking at: an imagined, civilian-era framing of Tama — open grass, trees, water. " +
        "Tama is an active annex, ID/guest-only access; it is not depicted as publicly visitable and no era is claimed. " +
        "The era question is not established."
    }
  };
  var activeEpisode = "1";
  var epState = {};
  Object.keys(EPISODES).forEach(function (n) {
    epState[n] = { driftX: 0, driftDir: 1, entered: false };
  });

  function episodeEl(n) { return document.querySelector('.episode[data-episode="' + n + '"]'); }
  function activeViewport() {
    var ep = episodeEl(activeEpisode);
    return ep ? ep.querySelector(".viewport") : null;
  }

  /* Offline honesty */
  var offlineBanner = document.getElementById("offline-banner");
  function setOffline() {
    var off = !navigator.onLine;
    if (offlineBanner) offlineBanner.hidden = !off;
    if (off) log("offline", "navigator.onLine=false — honest failure copy shown, no spinner");
  }
  window.addEventListener("online", setOffline);
  window.addEventListener("offline", setOffline);
  setOffline();

  /* Register mark + "What am I looking at?" (per episode) */
  var registerText = document.getElementById("register-text");
  function setRegister(key) {
    if (!registerText) return;
    if (key === "record") { registerText.textContent = "On the record"; return; }
    if (key === "notestablished") { registerText.textContent = "Not established — we don't know this yet"; return; }
    registerText.textContent = EPISODES[activeEpisode].mark;
  }
  var whatBtn = document.getElementById("what-am-i");
  if (whatBtn) whatBtn.addEventListener("click", function () {
    alert(EPISODES[activeEpisode].what);
    log("what_am_i", "three-line answer shown, episode " + activeEpisode);
  });

  /* Episode switching (no page reload) */
  function switchEpisode(n, source) {
    if (!EPISODES[n] || n === activeEpisode && source === "select") {
      if (n === activeEpisode) return;
    }
    if (!EPISODES[n]) return;
    var prev = activeEpisode;
    activeEpisode = n;
    document.querySelectorAll(".episode").forEach(function (el) {
      el.hidden = el.getAttribute("data-episode") !== n;
    });
    document.querySelectorAll(".episode-btn").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-episode") === n));
    });
    setRegister("field");
    log("episode_select", "episode " + n + " (" + EPISODES[n].name + ") selected from " + (source || "unknown") + ", was " + prev);
    log("episode_entry", "episode " + n + " (" + EPISODES[n].name + ")");
    var ep = episodeEl(n);
    if (ep && ep.scrollIntoView) ep.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    onScroll();
  }
  window.__rtSwitchEpisode = switchEpisode;
  document.querySelectorAll(".episode-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { switchEpisode(btn.getAttribute("data-episode"), "selector"); });
  });
  document.querySelectorAll("[data-episode-link]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      switchEpisode(a.getAttribute("data-episode-link"), "nav");
    });
  });
  log("episode_entry", "episode 1 (Chofu — the field)");

  /* Scroll-driven zoom: 5 beats, transform-only, rAF-throttled (active episode) */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var viewport = activeViewport();
      if (!viewport) return;
      var ep = episodeEl(activeEpisode);
      var progress = ep ? ep.querySelector(".scroll-progress") : null;
      var zoomLabel = ep ? ep.querySelector(".zoom-label") : null;
      var layers = Array.prototype.slice.call(ep.querySelectorAll(".layer"));
      var st = epState[activeEpisode];
      var rect = viewport.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var total = vh * 3;
      var p = Math.min(1, Math.max(0, (vh - rect.top) / total));
      if (progress) progress.style.width = (p * 100).toFixed(1) + "%";
      var beat = Math.min(4, Math.floor(p * 5));
      if (zoomLabel) zoomLabel.textContent = EPISODES[activeEpisode].beats[beat];
      setRegister("field");
      var scale = 1 + p * 1.6;
      layers.forEach(function (layer) {
        var speed = parseFloat(layer.getAttribute("data-speed") || "1");
        var x = (st.driftX + (p * 40 * speed)) * -1;
        if (layer.classList.contains("layer-mid")) {
          layer.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0) scale(" + scale.toFixed(3) + ")";
        } else {
          layer.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0)";
        }
      });
      /* Housing / mid-far layer fades as we pass beat 3 (Chofu only has the housing image;
         other episodes fade their mid-far painted layer the same way) */
      var midfar = ep.querySelector(".layer-midfar");
      if (midfar) midfar.style.opacity = p < 0.4 ? "0.45" : Math.max(0, 0.45 - (p - 0.4) * 1.2).toFixed(2);
      if (!st.entered && rect.top < vh && rect.bottom > 0) {
        st.entered = true;
        log("scene_entry", "episode " + activeEpisode + " (" + EPISODES[activeEpisode].name + "), beat 1");
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Auto-drift: slow, capped, pauses on interaction / reduced motion */
  var driftOn = !reduced, lastDrift = 0;
  function drift(ts) {
    if (driftOn && ts - lastDrift > 50) {
      lastDrift = ts;
      var st = epState[activeEpisode];
      st.driftX += 0.6 * st.driftDir;
      if (st.driftX > 60 || st.driftX < -60) st.driftDir *= -1;
      onScroll();
    }
    requestAnimationFrame(drift);
  }
  requestAnimationFrame(drift);
  document.querySelectorAll(".drift-toggle").forEach(function (btn) {
    if (reduced) { btn.textContent = "Auto-drift off (reduced motion)"; btn.setAttribute("aria-pressed", "false"); }
    btn.addEventListener("click", function () {
      driftOn = !driftOn;
      document.querySelectorAll(".drift-toggle").forEach(function (b) {
        b.setAttribute("aria-pressed", String(driftOn));
        b.textContent = driftOn ? "Pause auto-drift" : "Resume auto-drift";
      });
      log("drift_toggle", driftOn ? "on" : "off");
    });
  });

  /* Drag to pan (per viewport, per-episode drift state) */
  document.querySelectorAll(".viewport").forEach(function (viewport) {
    var dragging = false, startX = 0, startDrift = 0;
    var n = viewport.getAttribute("data-episode");
    viewport.addEventListener("pointerdown", function (e) {
      dragging = true; startX = e.clientX; startDrift = epState[n].driftX;
      if (viewport.setPointerCapture) viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      epState[n].driftX = Math.max(-120, Math.min(120, startDrift + (e.clientX - startX) * 0.3));
      if (n === activeEpisode) onScroll();
    });
    ["pointerup", "pointercancel"].forEach(function (ev) {
      viewport.addEventListener(ev, function () { dragging = false; });
    });
  });

  /* Hotspots: max 3 per episode, open ≤500ms target, dismissible, focus visible */
  document.querySelectorAll(".hotspot[data-card]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var t0 = performance.now();
      var card = document.getElementById(btn.getAttribute("data-card"));
      document.querySelectorAll(".card").forEach(function (c) { c.hidden = true; });
      if (card) {
        card.hidden = false;
        card.focus();
        var ms = Math.round(performance.now() - t0);
        log("hotspot_tap", btn.getAttribute("data-card") + " opened in " + ms + " ms (episode " + activeEpisode + ")");
      }
    });
  });
  document.querySelectorAll(".close-card").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".card");
      if (card) card.hidden = true;
      log("hotspot_close", card ? card.id : "");
    });
  });

  /* Read the scene — linear mode (per episode) */
  document.querySelectorAll(".read-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wrap = btn.closest(".scene-wrap");
      var readMode = wrap ? wrap.parentElement.querySelector(".read-mode") : null;
      if (!readMode) return;
      var open = readMode.hidden;
      readMode.hidden = !open;
      btn.setAttribute("aria-pressed", String(open));
      log("read_mode", (open ? "opened" : "closed") + " (episode " + activeEpisode + ")");
      if (open && readMode.scrollIntoView) readMode.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  });

  /* Opening clip, Episode 1 only: muted autoplay attempted, poster fallback, tap-to-play */
  var clip = document.getElementById("clip");
  var cover = document.getElementById("play-cover");
  var note = document.getElementById("video-note");
  var thresholds = [25, 50, 75, 100], hit = {};
  if (clip) {
    clip.muted = true; // enforce muted autoplay attempt, regardless of attribute parsing
    var playAttempt = null;
    try { playAttempt = clip.play(); } catch (e) { playAttempt = null; log("video_autoplay_blocked", "play() threw — poster shown, tap-to-play cover active"); }
    if (playAttempt && playAttempt.catch) {
      playAttempt.then(function () {
        if (note) note.textContent = "Playing (muted autoplay worked in this browser). Autoplay in LINE is NOT claimed.";
        if (cover) cover.hidden = true;
        log("video_play", "muted autoplay succeeded in this browser");
      }).catch(function () {
        if (note) note.textContent = "Autoplay blocked in this browser — poster shown. Tap to play. This is the expected fallback.";
        log("video_autoplay_blocked", "poster shown, tap-to-play cover active");
      });
    }
    clip.addEventListener("timeupdate", function () {
      if (!clip.duration) return;
      var pct = (clip.currentTime / clip.duration) * 100;
      thresholds.forEach(function (t) {
        if (pct >= t && !hit[t]) { hit[t] = true; log("video_play_" + t, "clip " + t + "%"); }
      });
    });
    clip.addEventListener("play", function () { if (cover) cover.hidden = true; log("video_play", "tap-to-play"); });
    clip.addEventListener("pause", function () { log("video_pause", "at " + Math.round(clip.currentTime) + "s"); });
    clip.addEventListener("error", function () {
      if (note) note.textContent = "Video failed to load in this browser. Still fallback: poster image above.";
      log("video_error", "MP4 failed — still fallback shown");
    });
  }
  if (cover) cover.addEventListener("click", function () { if (clip) clip.play(); });

  /* Episodes 2–4: clip not yet rendered — honest note, never a fake video */
  document.querySelectorAll(".clip-not-rendered").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wrap = btn.closest(".video-wrap");
      var n = wrap ? wrap.querySelector(".video-note") : null;
      if (n) n.textContent = "Clip not yet rendered for Episode " + btn.getAttribute("data-episode") + ". The poster still above is the whole opening for now — no video file exists for this episode.";
      log("clip_not_rendered", "episode " + btn.getAttribute("data-episode") + " — poster still only, no fake video");
    });
  });

  /* YouTube embed — test harness (Episode 1), no video selected by default */
  var ytForm = document.getElementById("yt-form");
  var ytSlot = document.getElementById("yt-slot");
  if (ytForm) ytForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var id = document.getElementById("yt-id").value.trim().replace(/[^A-Za-z0-9_-]/g, "").slice(0, 20);
    if (!id) { log("youtube_empty", "no video ID — still fallback remains"); return; }
    ytSlot.innerHTML = "";
    var frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?playsinline=1&mute=1&autoplay=1&rel=0";
    frame.title = "YouTube video (test embed — ID supplied by reviewer)";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.setAttribute("loading", "lazy");
    ytSlot.appendChild(frame);
    log("youtube_load", "embed loaded for ID " + id + " — autoplay/sound in LINE untested");
  });
  var ytClear = document.getElementById("yt-clear");
  if (ytClear) ytClear.addEventListener("click", function () {
    ytSlot.innerHTML = '<p class="still-fallback">Still fallback: <a href="assets/poster-field.png">poster still image</a>. No YouTube video loaded.</p>';
    log("youtube_clear", "embed removed, still fallback restored");
  });

  /* Panoramas: drag look-around + one hotspot jump (all episodes) */
  document.querySelectorAll(".pano").forEach(function (pano) {
    var inner = pano.querySelector("img") || pano.querySelector(".pano-strip");
    var panoX = 0, panoDrag = false, panoStart = 0;
    if (!inner) return;
    pano.addEventListener("pointerdown", function (e) { panoDrag = true; panoStart = e.clientX - panoX; if (pano.setPointerCapture) pano.setPointerCapture(e.pointerId); });
    pano.addEventListener("pointermove", function (e) {
      if (!panoDrag) return;
      panoX = Math.max(-1600, Math.min(0, e.clientX - panoStart));
      inner.style.transform = "translateX(" + panoX + "px)";
    });
    ["pointerup", "pointercancel"].forEach(function (ev) { pano.addEventListener(ev, function () { panoDrag = false; }); });
    pano.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { panoX = Math.max(-1600, panoX - 120); inner.style.transform = "translateX(" + panoX + "px)"; }
      if (e.key === "ArrowRight") { panoX = Math.min(0, panoX + 120); inner.style.transform = "translateX(" + panoX + "px)"; }
    });
    log("panorama_loaded", "panorama ready (" + (inner.tagName === "IMG" ? "painted still image" : "painted CSS still") + ")");
  });
  document.querySelectorAll("[data-pano-jump]").forEach(function (jump) {
    jump.addEventListener("click", function () {
      var target = jump.getAttribute("data-pano-jump");
      var el = target === "scene" ? document.getElementById("scene") : document.getElementById(target);
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      log("panorama_hotspot_jump", "jump to " + target);
    });
  });

  /* ---- Two-way communication: LIFF -> chat, chat -> LIFF (2026-11-25) ----
     Carl: "I'm still not sure that feels limiting and only one way
     communication." He is right: LIFF alone is a web view — a visitor can
     look, tap, and scroll, but nothing comes back unless we build a return
     path. This section builds it, guarded, never silent.
     Verified LINE rules (developers.line.biz, LIFF API reference, read
     2026-11-25):
     - liff.sendMessages() sends up to 5 messages on behalf of the user to
       the chat room where the LIFF app was opened, ONLY in the LIFF browser,
       ONLY when launched from a 1:1, group, or multi-person chat, ONLY when
       the chat_message.write scope is enabled AND granted by the visitor.
       Otherwise it fails with 403 "user doesn't grant required permissions
       yet". It does NOT work from Keep Memo, from the recently-used-services
       list, or from an external-browser redirect.
     - A TEXT message sent with sendMessages DOES trigger a webhook on the
       Messaging API channel. A Flex/template message sent the same way does
       NOT trigger a webhook. Contributions are therefore sent as TEXT, never
       as Flex, so TASK's bot can answer them.
     - A bot reply made with the webhook's single-use replyToken is FREE and
       does not count against the Official Account's monthly free messages.
       Push / multicast / broadcast DO count. Reply tokens expire in about
       60 seconds and can be used once — the bot must answer fast, or fall
       back to push (which costs quota, 0/500 used this month, Communication
       plan, no additional messages).
     - liff.permanentLink.createUrlBy(endpointUrl + "?episode=N&hotspot=X")
       returns a LIFF URL whose liff.state carries that query, so a bot Flex
       message can re-open the LIFF app at the right episode and hotspot.
     CURRENT LIVE STATE (2026-11-25): LIFF app 2012800911-7BPP3dHp has
     scopes openid, profile ONLY. chat_message.write is NOT enabled.
     Until the parent browser step adds it (see two-way-communication.md
     §1, exact change), every send attempt in LINE will fail with 403 and
     this code MUST say so honestly, never pretend it sent. */
  var LIFF_ID = "2012800911-7BPP3dHp";
  var LIFF_URL = "https://liff.line.me/" + LIFF_ID;
  var ENDPOINT_URL = "https://chwillpcs-task.github.io/rising-together/";
  var liffReady = false, liffInClient = false, liffScopes = [];
  var talkStatus = document.getElementById("talk-status");
  var sendBtn = document.getElementById("send-to-task");
  var withdrawBtn = document.getElementById("withdraw-btn");
  var contribText = document.getElementById("contrib-text");
  var contribType = document.getElementById("contrib-type");
  var contribOptin = document.getElementById("contrib-optin");
  var pendingList = document.getElementById("pending-list");
  var pending = []; /* in-memory only, this session only; never persisted */
  function setTalk(msg) { if (talkStatus) talkStatus.textContent = msg; log("talkback_status", msg); }
  function renderPending() {
    if (!pendingList) return;
    pendingList.innerHTML = "";
    if (!pending.length) { pendingList.innerHTML = "<li>No contribution written yet. Nothing has been sent.</li>"; return; }
    pending.forEach(function (p, i) {
      var li = document.createElement("li");
      li.textContent = "[" + p.type + ", Episode " + p.episode + "] " + p.text + " — " + p.state;
      pendingList.appendChild(li);
    });
  }
  renderPending();
  /* Deep link in: ?episode=N&hotspot=card-id[&from=bot] — from a bot Flex
     message (liff.state) or a plain LIFF URL query. Never trust it blindly:
     episode must be 1–4, hotspot must be a card that exists in that episode. */
  function parseDeepLink() {
    var q = new URLSearchParams(window.location.search || "");
    var state = q.get("liff.state");
    if (state) { try { q = new URLSearchParams(decodeURIComponent(state)); } catch (e) { q = new URLSearchParams(state); } }
    var ep = q.get("episode"), hs = q.get("hotspot");
    if (ep && EPISODES[ep]) {
      switchEpisode(ep, q.get("from") === "bot" ? "bot-deep-link" : "deep-link");
      if (hs) {
        var card = document.getElementById(hs);
        if (card && card.closest(".episode").getAttribute("data-episode") === ep) {
          document.querySelectorAll(".card").forEach(function (c) { c.hidden = true; });
          card.hidden = false; card.focus();
          log("deep_link_hotspot", hs + " opened from " + (q.get("from") || "link"));
        } else { log("deep_link_hotspot_rejected", "unknown hotspot '" + hs + "' for episode " + ep); }
      }
    } else if (ep) { log("deep_link_episode_rejected", "unknown episode '" + ep + "'"); }
  }
  /* LIFF init, guarded: no liff object in a standalone browser is normal,
     not an error. Never call sendMessages before init resolves. */
  function initLiff() {
    if (typeof window.liff === "undefined") {
      setTalk("You are in a regular browser, not LINE. Talk-back needs LINE: open this app from the TASK chat in LINE, and the Send button will work there. Nothing has been sent.");
      log("liff_not_present", "standalone browser — send/return are simulated only");
      return;
    }
    window.liff.init({ liffId: LIFF_ID }).then(function () {
      liffReady = true;
      liffInClient = window.liff.isInClient();
      try { liffScopes = window.liff.getContext().scope || []; } catch (e) { liffScopes = []; }
      var granted = [];
      try { granted = window.liff.permission ? window.liff.permission.getGrantedAll() : []; } catch (e) { granted = []; }
      log("liff_ready", "inClient=" + liffInClient + ", scopes=" + liffScopes.join(",") + ", granted=" + (granted.join ? granted.join(",") : granted));
      var banner = document.getElementById("external-banner");
      if (banner && liffInClient) banner.hidden = true;
      if (!liffInClient) { setTalk("You opened this outside LINE's chat view. Talk-back needs the LIFF browser: open the link from inside the TASK chat in LINE. Nothing has been sent."); return; }
      if (liffScopes.indexOf("chat_message.write") === -1) {
        setTalk("Talk-back is not switched on yet for this LIFF app: the chat_message.write permission is not enabled on it. Your words are safe here — nothing has been sent, and the Send button will tell you this instead of failing silently. The team has prepared the exact change to switch it on.");
        log("liff_scope_missing", "chat_message.write not in LIFF scopes — send will fail 403 until the console change is made");
        return;
      }
      if (granted && granted.indexOf && granted.indexOf("chat_message.write") === -1) {
        setTalk("LINE is asking for one permission before you can send: 'Send messages to chat'. Grant it on the permission screen when it appears, or tap Send again. Nothing has been sent yet.");
        return;
      }
      setTalk("You are in LINE, in the TASK chat. Tap Send to TASK to send your words back — one tap, nothing silent, and TASK will answer here in chat.");
    }).catch(function (err) {
      log("liff_init_failed", err && err.message ? err.message : String(err));
      setTalk("LINE could not start here (" + (err && err.code ? err.code : "init failed") + "). Nothing has been sent. Try opening the link again from inside the TASK chat in LINE.");
    });
  }
  initLiff();
  parseDeepLink();
  /* Two-way moments: a choice in an episode fills the talk-back form and
     takes the visitor to it. A choice is a draft, not a send. */
  document.querySelectorAll("[data-two-way]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var ep = btn.getAttribute("data-episode") || activeEpisode;
      var choice = btn.getAttribute("data-choice") || "";
      var prompt = btn.getAttribute("data-prompt") || "";
      if (contribText) contribText.value = prompt;
      if (contribType) contribType.value = btn.getAttribute("data-kind") || "question";
      var talk = document.getElementById("talkback");
      if (talk && talk.scrollIntoView) talk.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      log("two_way_choice", "episode " + ep + " — " + choice + " (draft only, nothing sent)");
      setTalk("Your choice is written in the box below — '" + choice + "'. Edit it if you like, tick the box to say you are happy for TASK to keep it, then tap Send to TASK. Nothing has been sent yet.");
    });
  });
  /* Send to TASK — one explicit tap, text only (so the webhook fires),
     max 1 message, never silent, never automatic. */
  if (sendBtn) sendBtn.addEventListener("click", function () {
    var text = contribText ? contribText.value.trim() : "";
    var kind = contribType ? contribType.value : "question";
    if (!text) { setTalk("Write a few words first — the box is empty, so nothing was sent."); return; }
    if (text.length > 500) { setTalk("That is over 500 characters. Please shorten it — nothing was sent."); return; }
    if (!contribOptin || !contribOptin.checked) { setTalk("Tick the box first, to say you are happy for TASK to keep and read your words. Nothing was sent."); return; }
    var msg = "Rising Together — Episode " + activeEpisode + " (" + EPISODES[activeEpisode].name + "), " + kind + ": " + text;
    if (typeof window.liff === "undefined" || !liffReady || !liffInClient) {
      pending.push({ type: kind, episode: activeEpisode, text: text, state: "NOT SENT — you are not in LINE's chat view. Open this from the TASK chat to send it." });
      renderPending(); log("send_blocked_not_in_line", "draft kept on this device only, nothing sent");
      setTalk("Not sent — you are not in LINE's chat view. Your words are kept only on this device, this session. Open this app from the TASK chat in LINE and tap Send again.");
      return;
    }
    if (liffScopes.indexOf("chat_message.write") === -1) {
      pending.push({ type: kind, episode: activeEpisode, text: text, state: "NOT SENT — chat_message.write not enabled on this LIFF app yet." });
      renderPending(); log("send_blocked_scope", "chat_message.write not enabled — nothing sent");
      setTalk("Not sent — talk-back is not switched on yet for this LIFF app. Your words are kept only on this device, this session. The team has prepared the exact change to switch it on.");
      return;
    }
    window.liff.sendMessages([{ type: "text", text: msg }]).then(function () {
      pending.push({ type: kind, episode: activeEpisode, text: text, state: "SENT TO TASK CHAT — awaiting a human reply. Not published, not shared." });
      renderPending(); log("send_to_task", "text message sent via liff.sendMessages, episode " + activeEpisode + ", kind " + kind);
      setTalk("Sent to the TASK chat. TASK will answer you here in chat — a person reads it first, and nothing you wrote is published or shared. Thank you.");
      if (contribText) contribText.value = "";
    }).catch(function (err) {
      log("send_failed", err && err.code ? err.code + " " + (err.message || "") : String(err));
      setTalk("Send failed (" + (err && err.code ? err.code : "unknown") + "). Nothing was sent. This usually means the permission was not granted, or the app was opened from Keep Memo or the recent-services list instead of from a chat — open it from the TASK chat and try again.");
    });
  });
  /* Share instead: pick a friend or group to send the LIFF link to. Also
     needs chat_message.write, also guarded, also one explicit tap. */
  var shareBtn = document.getElementById("share-btn");
  if (shareBtn) shareBtn.addEventListener("click", function () {
    if (typeof window.liff === "undefined" || !liffReady || !liffInClient) { setTalk("Sharing needs LINE: open this from the TASK chat in LINE. Nothing was shared."); log("share_blocked_not_in_line", "nothing shared"); return; }
    window.liff.shareTargetPicker([{ type: "text", text: "Rising Together — Episode " + activeEpisode + " (" + EPISODES[activeEpisode].name + "). " + LIFF_URL + "?episode=" + activeEpisode }]).then(function (res) {
      log("share_chosen", res ? "picker returned" : "picker closed");
      setTalk(res ? "Shared — thank you. How many people receive it is not counted, and never will be." : "Share picker closed — nothing was shared.");
    }).catch(function (err) { log("share_failed", err && err.code ? err.code : String(err)); setTalk("Sharing failed. Nothing was shared."); });
  });
  /* Withdraw: before sending, delete the draft on this device. After
     sending, send a second TEXT message asking TASK to withdraw it — the
     only honest withdrawal once words are in a chat. */
  if (withdrawBtn) withdrawBtn.addEventListener("click", function () {
    var sent = pending.filter(function (p) { return p.state.indexOf("SENT") === 0; });
    if (!sent.length) {
      pending.length = 0; if (contribText) contribText.value = ""; renderPending();
      log("withdraw_draft", "unsent draft deleted on this device");
      setTalk("Draft deleted from this device. Nothing was ever sent.");
      return;
    }
    if (typeof window.liff === "undefined" || !liffReady || !liffInClient) { setTalk("To withdraw what you already sent, open this from the TASK chat in LINE and tap Withdraw again — it sends TASK a withdrawal note. Your sent words stay in the chat until a person at TASK removes them."); return; }
    window.liff.sendMessages([{ type: "text", text: "Rising Together — please withdraw my earlier note from Episode " + activeEpisode + ". Please do not keep or show it." }]).then(function () {
      log("withdraw_sent", "withdrawal note sent via liff.sendMessages");
      setTalk("Withdrawal note sent to TASK. A person will remove your earlier note and confirm back here in chat.");
    }).catch(function (err) { log("withdraw_failed", err && err.code ? err.code : String(err)); setTalk("Withdrawal note failed to send. Please write to TASK in chat and ask them to remove it."); });
  });

  /* Return to chat — real in LIFF, simulated standalone */
  var returnBtn = document.getElementById("return-btn");
  if (returnBtn) returnBtn.addEventListener("click", function () {
    if (typeof window.liff !== "undefined" && liffReady && liffInClient) {
      log("return", "liff.closeWindow() called");
      window.liff.closeWindow();
      return;
    }
    log("return", "simulated — liff.closeWindow() not available in standalone app");
    alert("In a real LIFF browser this would return to chat. Here there is no LIFF, so this only logs the event.");
  });
})();
