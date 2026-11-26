/* Rising Together — PLAY mode (2026-11-25).
   The playable district. Carl, 2026-11-25: the app as built was a written
   book with old fashioned graphics and lots of text — reading, not
   experiencing — and nothing in it resembled GTA or Sega or anything
   popular. This module is the answer in the app itself, not in a document.
   Mechanisms stolen, never the picture: no GTA/Sega art, assets,
   characters, music, or trademarks anywhere here.
   What popular games do that this does:
   - GTA: move freely through a dense district, pick up a small job from a
     person, do it, see the world change.
   - Yakuza / Like a Dragon, Judgment, Shenmue: a dense district you walk,
     substories from named people on the street, side activities, a day
     system, relationships that grow, "look closely" details that reward
     exploring, humour and craziness in side streets.
   - Persona: a calendar — one choice a day, a routine to return to.
   - Generally: agency (I choose where to go), movement (I travel, not
     scroll a picture), progression (something changes because I did
     something), a world that reacts, a reason to return tomorrow.
   Constraints kept: painted / reconstructed only, no photographs, no
   likeness, no real person's voice or dialogue, no music, no 2029
   immersive scene, register mark small and persistent, no outside
   contract / permission / partnership claimed, no spend, no publication.
   Self-contained: no LIFF, no server. Progress is kept on this device
   only (localStorage, guarded — a fresh device starts fresh, honestly). */
(function () {
  "use strict";
  var STREET_W = 2200;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Data: one walkable district per episode.
     Contacts and jobs are the fictional ones from the episode files.
     Real people appear nowhere here — the 1971 players are facts on the
     record only, in the text below, never characters. ---- */
  var PLAY = {
    "1": {
      name: "Chofu — The Tract",
      dayJobs: ["Sunday — kite day", "Monday — practice", "Tuesday — the field rests", "Wednesday — market on the station road", "Thursday — practice", "Friday — night game under the lights", "Saturday — the field rests"],
      places: [
        { id: "field", x: 200, label: "The field" },
        { id: "housing", x: 780, label: "Housing rows — fading" },
        { id: "stadium", x: 1360, label: "Ajinomoto Stadium" },
        { id: "station", x: 1900, label: "Station road" }
      ],
      contacts: [
        { id: "miki", name: "Miki", x: 330, place: "field", job: "Drink stand by the field gate",
          mission: { title: "The Lost Ball", steps: [
            { kind: "talk", x: 330, label: "Talk to Miki", hint: "Balls keep landing in her bottle crate." },
            { kind: "tap", x: 560, target: "ball", label: "Find the lost ball", hint: "Tap the ball in the grass." },
            { kind: "go", x: 330, label: "Bring it back to Miki", hint: "Walk back to the drink stand." } ],
            done: "Ball back in play. Miki tells you which way the wind runs today." } },
        { id: "jiro", name: "Old Jiro", x: 1360, place: "stadium", job: "Sweeps the stadium steps",
          mission: { title: "The Step That Is Always Dusty", steps: [
            { kind: "talk", x: 1360, label: "Talk to Old Jiro", hint: "One step is always dusty." },
            { kind: "tap", x: 1440, target: "step", label: "Sweep the dusty step", hint: "Tap the dusty step — sweep it with him." },
            { kind: "go", x: 1360, label: "Stand back and look", hint: "It clears, then dusts over again." } ],
            done: "The step is clean, for a beat. The district remembers a gone house, then lets go." } },
        { id: "aya", name: "Aya", x: 780, place: "housing", job: "Flies kites over the field",
          mission: { title: "The Kite on the Roof", steps: [
            { kind: "talk", x: 780, label: "Talk to Aya", hint: "Her kite is stuck on the stadium roof." },
            { kind: "go", x: 1360, label: "Follow the kite — field to stadium", hint: "Walk the chase: housing rows, then the stadium." },
            { kind: "tap", x: 1420, target: "kite", label: "Bring the kite down", hint: "Tap the kite on the roof." } ],
            done: "The kite comes down. The view stays: field, fading houses, stadium, Japan beyond." } }
      ],
      finds: [
        { id: "chalk", x: 430, label: "Chalk line", effect: "The chalk line never quite fades. It redraws itself overnight." },
        { id: "number", x: 900, label: "House number", effect: "A house number, painted on a wall where the house is gone." },
        { id: "seat", x: 1500, label: "Blank seat", effect: "One seat in Ajinomoto Stadium has no number. Kept blank on purpose." }
      ],
      side: { title: "Pigeon Steals the Ball", kind: "pigeon", intro: "A pigeon takes the ball down the station road. Chase it — tap it 3 times." }
    },
    "2": {
      name: "Yokosuka — Dobuita",
      dayJobs: ["Sunday — the harbour is quiet", "Monday — morning at the harbour", "Tuesday — tailor row", "Wednesday — tailor row", "Thursday — harbour steps", "Friday — evening neon on Dobuita", "Saturday — the street fills"],
      places: [
        { id: "dobuita", x: 200, label: "Dobuita street" },
        { id: "tailors", x: 780, label: "Tailor row" },
        { id: "harbour", x: 1360, label: "Harbour steps" },
        { id: "station", x: 1900, label: "Station slope" }
      ],
      contacts: [
        { id: "rin", name: "Rin", x: 780, place: "tailors", job: "Tailor's apprentice — presses jackets",
          mission: { title: "The Jacket That Fits Nobody", steps: [
            { kind: "talk", x: 780, label: "Talk to Rin", hint: "A jacket that fits nobody who tries it on." },
            { kind: "tap", x: 860, target: "jacket", label: "Put the jacket on", hint: "Tap the jacket in the window." },
            { kind: "go", x: 200, label: "Walk Dobuita in it", hint: "Walk the street and let the street measure you." } ],
            done: "By the end it fits the street itself. Rin hangs it in the window as the street's jacket." } },
        { id: "haru", name: "Haru", x: 200, place: "dobuita", job: "Knows every shop — charges in stories",
          mission: { title: "Haru's Three Cats", steps: [
            { kind: "talk", x: 200, label: "Talk to Haru", hint: "Three painted cats hide on Dobuita." },
            { kind: "tap", x: 620, target: "cat1", label: "Find cat 1 of 3", hint: "Tap a painted cat." },
            { kind: "tap", x: 1100, target: "cat2", label: "Find cat 2 of 3", hint: "Another painted cat hides down the street." },
            { kind: "tap", x: 1680, target: "cat3", label: "Find cat 3 of 3", hint: "The last cat is near the harbour steps." } ],
            done: "All three found. Haru shows you the harbour steps — and the view nobody photographs." } },
        { id: "umi", name: "Mrs. Umi", x: 1360, place: "harbour", job: "Runs the harbour café",
          mission: { title: "The Wall of Promises", steps: [
            { kind: "talk", x: 1360, label: "Talk to Mrs. Umi", hint: "Three IOUs on her wall, from visitors who promised to come back." },
            { kind: "tap", x: 1440, target: "iou", label: "Deliver the IOUs", hint: "Tap the wall — deliver all three, one tap each." },
            { kind: "go", x: 1360, label: "Back to the café", hint: "The wall gets shorter. The café gets louder." } ],
            done: "Nobody on the wall is real — and every promise on it is kept." } }
      ],
      finds: [
        { id: "button", x: 900, label: "Anchor button", effect: "A jacket button in the gutter, shaped like an anchor. The awnings lift, briefly, like a salute." },
        { id: "sign", x: 500, label: "Painted-over sign", effect: "A shop sign painted over three times. Three names show through; the oldest glows at dusk." },
        { id: "chalkfish", x: 1500, label: "Chalk fish", effect: "A tailor's chalk mark, shaped like a fish. Step on it and a painted fish swims a circle round your feet." }
      ],
      side: { title: "The Cat Mayor", kind: "cat", intro: "A stray cat sits on the same step every day. Present your day to the cat before continuing." }
    },
    "3": {
      name: "Tachikawa — Airfield to Park",
      dayJobs: ["Sunday — the park rests", "Monday — walk the line", "Tuesday — bicycle hire", "Wednesday — seed packets", "Thursday — walk the line", "Friday — the park at dusk", "Saturday — the park fills"],
      places: [
        { id: "park", x: 200, label: "Showa Kinen Park" },
        { id: "runway", x: 780, label: "Runway line — ghost line" },
        { id: "town", x: 1360, label: "Base town" },
        { id: "gate", x: 1900, label: "Park gate" }
      ],
      contacts: [
        { id: "kaze", name: "Mr. Kaze", x: 780, place: "runway", job: "Walks the runway line every morning",
          mission: { title: "Walk the Line", steps: [
            { kind: "talk", x: 780, label: "Talk to Mr. Kaze", hint: "He walks the runway line every morning." },
            { kind: "go", x: 200, label: "Walk the line, end to end", hint: "Walk from the runway to the park." },
            { kind: "tap", x: 780, target: "runway", label: "Stand on the ghost line", hint: "Tap the runway line under the grass." } ],
            done: "The painted runway appears for a few steps, then fades. A park that remembers it was an airfield." } },
        { id: "sora", name: "Sora", x: 200, place: "park", job: "Runs the park bicycle hire",
          mission: { title: "The Squeaky Wheel", steps: [
            { kind: "talk", x: 200, label: "Talk to Sora", hint: "One hire bike has a squeaky wheel." },
            { kind: "tap", x: 320, target: "bike", label: "Take the squeaky bike", hint: "Tap the bike." },
            { kind: "go", x: 1360, label: "Follow the squeak", hint: "It leads to the park's oldest tree." } ],
            done: "The squeak stops, once, at the tree. The tree does not explain itself." } },
        { id: "nana", name: "Nana", x: 1900, place: "gate", job: "Sells seed packets, labelled with years",
          mission: { title: "The Seed Packets", steps: [
            { kind: "talk", x: 1900, label: "Talk to Nana", hint: "Pick a packet labelled with a year." },
            { kind: "tap", x: 1980, target: "seed", label: "Plant a packet — imagined", hint: "Tap a seed packet." },
            { kind: "go", x: 200, label: "See what grew", hint: "Walk back to the park and look." } ],
            done: "Blossom, lawn, leaves, bare branches. Every year grows something; no year grows nothing." } }
      ],
      finds: [
        { id: "bench", x: 1100, label: "Backwards bench", effect: "A bench that faces the wrong way. Sit on it backwards and you see the park the way the airfield saw it." },
        { id: "kite", x: 1500, label: "Permanent kite", effect: "A kite stuck in the same tree. By now it is part of the tree — the district votes every spring to leave it." },
        { id: "rain", x: 700, label: "Rain runway", effect: "When it rains, the painted path shines like a runway under your feet." }
      ],
      side: { title: "The Rain Runway", kind: "rain", intro: "When it rains, the painted path shines like a runway. Make it rain, then land 3 paper planes." }
    },
    "4": {
      name: "Tama — Imagined",
      dayJobs: ["Sunday — the meadow rests", "Monday — sweep the path", "Tuesday — count the ducks", "Wednesday — picnic for one", "Thursday — sweep the path", "Friday — echo meadow", "Saturday — the meadow rests"],
      places: [
        { id: "meadow", x: 200, label: "The meadow" },
        { id: "lake", x: 780, label: "Lake edge" },
        { id: "trees", x: 1360, label: "Tree line" },
        { id: "edge", x: 1900, label: "The soft edge — the path stops here" }
      ],
      contacts: [
        { id: "mori", name: "Mrs. Mori", x: 200, place: "meadow", job: "Brings a picnic for one",
          mission: { title: "The Picnic for One", steps: [
            { kind: "talk", x: 200, label: "Talk to Mrs. Mori", hint: "She sets a place for a guest who never arrives." },
            { kind: "tap", x: 300, target: "cup", label: "Sit down as her guest, once", hint: "Tap the second cup." },
            { kind: "go", x: 200, label: "Stay a moment", hint: "She packs up, satisfied." } ],
            done: "The company, not the meal. The second cup stays warm in the painting." } },
        { id: "pip", name: "Pip", x: 780, place: "lake", job: "Counts ducks that aren't there",
          mission: { title: "The Duck Count", steps: [
            { kind: "talk", x: 780, label: "Talk to Pip", hint: "Help count the ducks on the lake edge." },
            { kind: "tap", x: 880, target: "duck", label: "Count the ducks", hint: "Tap the ducks — count them." },
            { kind: "go", x: 780, label: "Tell Pip the count", hint: "It is always wrong by one." } ],
            done: "The count is wrong by one. The extra duck is the joke, and the lake keeps it." } },
        { id: "keeper", name: "The path-keeper", x: 1360, place: "trees", job: "Sweeps leaves off a path nobody walks",
          mission: { title: "The Path That Stops", steps: [
            { kind: "talk", x: 1360, label: "Talk to the path-keeper", hint: "Help sweep the path to the soft edge." },
            { kind: "go", x: 1900, label: "Sweep to the soft edge", hint: "Walk to where the path stops." },
            { kind: "tap", x: 1900, target: "broom", label: "Stop where the sweeping stops", hint: "Tap the broom — and stop." } ],
            done: "You reached the edge and stopped, because nothing is beyond it and this does not pretend otherwise." } }
      ],
      finds: [
        { id: "leaf", x: 1500, label: "One-leaf tree", effect: "One leaf falls a day, on schedule, from the same tree. Nobody has ever caught it." },
        { id: "echo", x: 500, label: "Echo meadow", effect: "Shout a word and the meadow returns a different one." },
        { id: "sky", x: 900, label: "Upside-down lake", effect: "The painted water shows the sky upside down." }
      ],
      side: { title: "The Echo Meadow", kind: "echo", intro: "Shout a word. The meadow returns a different one. The list of best returns is the whole game." }
    }
  };

  /* ---- State (this device only) ---- */
  var store = { ep: "1", x: 200, targetX: null, walking: false, keys: {},
    visited: {}, missions: {}, finds: {}, trust: {}, activeMission: null };
  try {
    var saved = window.localStorage && window.localStorage.getItem("rt-play-v1");
    if (saved) { var s = JSON.parse(saved); if (s && s.visited) store = s; }
  } catch (e) { /* fresh start, honestly — no storage, no progress kept */ }
  function save() {
    try { if (window.localStorage) window.localStorage.setItem("rt-play-v1", JSON.stringify(store)); } catch (e) {}
  }
  function epState() {
    store.visited[store.ep] = store.visited[store.ep] || {};
    store.missions[store.ep] = store.missions[store.ep] || {};
    store.finds[store.ep] = store.finds[store.ep] || {};
    store.trust[store.ep] = store.trust[store.ep] || {};
    return PLAY[store.ep];
  }
  function missionState(id) {
    var m = store.missions[store.ep][id];
    if (!m) { m = { step: 0, done: false }; store.missions[store.ep][id] = m; }
    return m;
  }

  /* ---- DOM ---- */
  var root = document.getElementById("play");
  if (!root) return;
  var hud = document.getElementById("play-hud");
  var view = document.getElementById("play-view");
  var street = document.getElementById("play-street");
  var player = document.getElementById("play-player");
  var missionBox = document.getElementById("play-mission");
  var toast = document.getElementById("play-toast");
  var sideBox = document.getElementById("play-side");
  var dayEl = document.getElementById("play-day");
  var mapEl = document.getElementById("play-map");
  var countEl = document.getElementById("play-count");
  var trustEl = document.getElementById("play-trust");
  var titleEl = document.getElementById("play-h");
  var logEl = document.getElementById("event-log");
  function log(event, detail) {
    if (window.__rtLog) window.__rtLog.push({ t: new Date().toISOString(), event: "play_" + event, detail: detail || "" });
    if (logEl) { var li = document.createElement("li"); li.textContent = new Date().toISOString() + " — play_" + event + (detail ? " — " + detail : ""); logEl.appendChild(li); }
  }
  var toastTimer = null;
  function say(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 4500);
  }

  /* ---- Build the district for the active episode ---- */
  function build() {
    var ep = epState();
    if (view) view.setAttribute("data-episode", store.ep); // painted district backdrop (2026-11-25)
    titleEl.textContent = "Play — " + ep.name;
    var day = new Date().getDay();
    dayEl.textContent = "Today: " + ep.dayJobs[day] + " — one job a day, your pick.";
    street.innerHTML = "";
    // place zones
    ep.places.forEach(function (p, i) {
      var z = document.createElement("button");
      z.type = "button"; z.className = "play-place p" + (i % 4);
      z.style.left = (p.x - 110) + "px";
      z.setAttribute("data-place", p.id);
      z.innerHTML = "<span>" + p.label + "</span>";
      z.addEventListener("click", function (e) { e.stopPropagation(); goTo(p.x, p.id); });
      street.appendChild(z);
    });
    // look-closely finds (hidden details)
    ep.finds.forEach(function (f) {
      if (store.finds[store.ep][f.id]) return;
      var d = document.createElement("button");
      d.type = "button"; d.className = "play-find"; d.style.left = f.x + "px";
      d.setAttribute("aria-label", "Look closely: " + f.label);
      d.textContent = "?";
      d.addEventListener("click", function (e) {
        e.stopPropagation();
        store.finds[store.ep][f.id] = true; save();
        say(f.label + " — " + f.effect);
        log("find", f.id + " (" + ep.name + ")");
        build(); render();
      });
      street.appendChild(d);
    });
    // contacts
    ep.contacts.forEach(function (c) {
      var ms = missionState(c.id);
      var b = document.createElement("button");
      b.type = "button"; b.className = "play-contact" + (ms.done ? " done" : "") + (store.activeMission === c.id ? " active" : "");
      b.style.left = c.x + "px";
      b.setAttribute("data-contact", c.id);
      b.innerHTML = "<span class=\"pc-face\"></span><span class=\"pc-name\">" + c.name + "</span><span class=\"pc-job\">" + c.job + "</span>";
      b.addEventListener("click", function (e) { e.stopPropagation(); talkTo(c); });
      street.appendChild(b);
    });
    // mission targets (only the current step's target, if it is a tap step)
    renderTargets();
    renderHud();
    renderMission();
  }

  function renderTargets() {
    street.querySelectorAll(".play-target").forEach(function (n) { n.remove(); });
    var ep = epState();
    if (!store.activeMission) return;
    var c = null;
    ep.contacts.forEach(function (x) { if (x.id === store.activeMission) c = x; });
    if (!c) return;
    var ms = missionState(c.id);
    if (ms.done) return;
    var step = c.mission.steps[ms.step];
    if (!step || step.kind !== "tap") return;
    var t = document.createElement("button");
    t.type = "button"; t.className = "play-target t-" + step.target; t.style.left = step.x + "px";
    t.textContent = step.target === "cat1" || step.target === "cat2" || step.target === "cat3" ? "cat" : step.target;
    t.setAttribute("aria-label", step.label);
    t.addEventListener("click", function (e) { e.stopPropagation(); tapTarget(c, step); });
    street.appendChild(t);
  }

  function renderHud() {
    var ep = epState();
    mapEl.innerHTML = "";
    ep.places.forEach(function (p) {
      var d = document.createElement("span");
      d.className = "play-dot" + (store.visited[store.ep][p.id] ? " on" : "");
      d.textContent = "●";
      d.title = p.label;
      mapEl.appendChild(d);
    });
    var done = 0;
    ep.contacts.forEach(function (c) { if (missionState(c.id).done) done++; });
    countEl.textContent = "Jobs done: " + done + " of 3";
    trustEl.innerHTML = "";
    ep.contacts.forEach(function (c) {
      var s = document.createElement("span");
      s.className = "play-trust-one";
      s.textContent = c.name + " " + (missionState(c.id).done ? "♥" : "♡");
      trustEl.appendChild(s);
    });
  }

  function renderMission() {
    var ep = epState();
    if (!store.activeMission) {
      missionBox.innerHTML = "<strong>No job yet.</strong> Walk to someone and tap them — they will give you a small job. Today: " + ep.dayJobs[new Date().getDay()] + ".";
      return;
    }
    var c = null;
    ep.contacts.forEach(function (x) { if (x.id === store.activeMission) c = x; });
    if (!c) { store.activeMission = null; renderMission(); return; }
    var ms = missionState(c.id);
    if (ms.done) {
      missionBox.innerHTML = "<strong>" + c.mission.title + " — done.</strong> " + c.mission.done + " Pick another person.";
      return;
    }
    var step = c.mission.steps[ms.step];
    missionBox.innerHTML = "<strong>Job: " + c.mission.title + "</strong> — " + c.name + " · step " + (ms.step + 1) + " of " + c.mission.steps.length + "<br>" + step.label + " — " + step.hint;
  }

  /* ---- Movement: walk, don't scroll ---- */
  var lastTs = 0;
  function frame(ts) {
    var dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016);
    lastTs = ts;
    var speed = 300;
    if (store.keys.ArrowLeft || store.keys.a) { store.targetX = null; store.x = Math.max(40, store.x - speed * dt); store.walking = true; }
    else if (store.keys.ArrowRight || store.keys.d) { store.targetX = null; store.x = Math.min(STREET_W - 40, store.x + speed * dt); store.walking = true; }
    else if (store.targetX !== null) {
      var dx = store.targetX - store.x;
      if (Math.abs(dx) < 8) { store.targetX = null; store.walking = false; arrive(); }
      else { store.x += Math.sign(dx) * Math.min(Math.abs(dx), speed * dt); store.walking = true; }
    } else store.walking = false;
    render();
    requestAnimationFrame(frame);
  }
  function render() {
    if (!player || !street) return;
    var vw = view.clientWidth || 800;
    var cam = Math.max(0, Math.min(STREET_W - vw, store.x - vw / 2));
    player.style.left = (store.x - cam) + "px";
    player.classList.toggle("walking", !!store.walking);
    street.style.transform = "translateX(" + (-cam) + "px)";
    // visited places
    var ep = epState();
    var changed = false;
    ep.places.forEach(function (p) {
      if (Math.abs(store.x - p.x) < 150 && !store.visited[store.ep][p.id]) { store.visited[store.ep][p.id] = true; changed = true; }
    });
    if (changed) { save(); renderHud(); }
    // mission step readiness: go/talk steps complete by arriving
    checkStep();
    // target glow when near
    var t = street.querySelector(".play-target");
    if (t) {
      var step = currentStep();
      if (step && Math.abs(store.x - step.x) < 160) t.classList.add("ready");
      else t.classList.remove("ready");
    }
  }
  function currentStep() {
    if (!store.activeMission) return null;
    var ep = epState(), c = null;
    ep.contacts.forEach(function (x) { if (x.id === store.activeMission) c = x; });
    if (!c) return null;
    var ms = missionState(c.id);
    return ms.done ? null : c.mission.steps[ms.step];
  }
  var stepStartX = null; /* where you were when this step started.
     A go step completes on arrival — but only if you actually travelled:
     if the target is far from where you started, you must have walked
     at least 150px. If the target is right where you stand ("stand back
     and look"), it completes at once. Walking is the job; standing still
     is not a walk. */
  function checkStep() {
    var step = currentStep();
    if (!step || step.kind === "tap") return;
    if (stepStartX === null) stepStartX = store.x;
    var d = Math.abs(store.x - step.x);
    var travelled = Math.abs(store.x - stepStartX);
    var farStart = Math.abs(step.x - stepStartX) > 200;
    if (d < 120 && (travelled > 150 || !farStart)) advanceStep();
  }
  function arrive() { checkStep(); }
  function goTo(x, placeId) {
    store.targetX = Math.max(40, Math.min(STREET_W - 40, x));
    if (placeId) log("walk_to", placeId + " (episode " + store.ep + ")");
  }
  function advanceStep() {
    var ep = epState(), c = null;
    ep.contacts.forEach(function (x) { if (x.id === store.activeMission) c = x; });
    if (!c) return;
    var ms = missionState(c.id);
    ms.step++;
    stepStartX = null;

    if (ms.step >= c.mission.steps.length) {
      ms.done = true;
      store.trust[store.ep][c.id] = 1;
      say(c.mission.title + " — done. " + c.mission.done);
      log("mission_done", c.id + " (" + ep.name + ")");
    } else {
      var next = c.mission.steps[ms.step];
      say(next.label + " — " + next.hint);
    }
    save(); build(); render();
  }
  function talkTo(c) {
    var ms = missionState(c.id);
    if (ms.done) { say(c.name + ": " + c.mission.done); return; }
    if (store.activeMission && store.activeMission !== c.id) {
      say("Finish the job you are on first — or tap it again to hear it once more.");
    }
    store.activeMission = c.id;
    if (ms.step === 0) {
      // Tapping the person IS the talk — that step is done the moment
      // they speak. The next step is the walk.
      say(c.name + ": " + c.mission.title + " — " + c.mission.steps[0].label + ". " + c.mission.steps[0].hint);
      log("mission_start", c.id + " (" + epState().name + ")");
      ms.step = 1; stepStartX = null;
      save(); build(); render();
      var next = c.mission.steps[1];
      if (next) say(next.label + " — " + next.hint);
      return;
    } else {
      var step = c.mission.steps[ms.step];
      say(c.mission.title + " — " + step.label + ". " + step.hint);
    }
    save(); build(); render();
  }
  function tapTarget(c, step) {
    if (Math.abs(store.x - step.x) > 200) { say("Too far. Walk closer first — the target lights up when you are near."); return; }
    log("mission_step", c.id + " step " + (missionState(c.id).step + 1) + " tapped " + step.target);
    advanceStep();
  }

  /* ---- Side streets: "Imagined — play", short, exits cleanly ---- */
  function openSide() {
    var ep = epState();
    var s = ep.side;
    sideBox.hidden = false;
    var body = document.getElementById("play-side-body");
    body.innerHTML = "<h3>" + s.title + " — Imagined, play</h3><p>" + s.intro + "</p><div id=\"play-side-game\"></div><p><button type=\"button\" id=\"play-side-exit\">Leave the side street — back to the district</button></p>";
    document.getElementById("play-side-exit").addEventListener("click", function () { sideBox.hidden = true; log("side_exit", s.title); });
    var game = document.getElementById("play-side-game");
    if (s.kind === "pigeon") {
      var n = 0;
      var pen = document.createElement("div"); pen.className = "play-pen";
      var p = document.createElement("button"); p.type = "button"; p.className = "play-pigeon"; p.textContent = "pigeon";
      pen.appendChild(p); game.appendChild(pen);
      var note = document.createElement("p"); note.textContent = "Caught: 0 of 3."; game.appendChild(note);
      p.addEventListener("click", function () {
        n++;
        if (n >= 3) { note.textContent = "The pigeon wins. Everyone laughs. The ball comes back."; log("side_done", s.title); p.disabled = true; return; }
        note.textContent = "Caught: " + n + " of 3.";
        p.style.left = (10 + Math.random() * 70) + "%";
        p.style.top = (10 + Math.random() * 60) + "%";
      });
    } else if (s.kind === "cat") {
      ["I walked the whole street.", "I found the harbour steps.", "I bought nothing and saw everything."].forEach(function (line) {
        var b = document.createElement("button"); b.type = "button"; b.className = "play-choice"; b.textContent = line;
        b.addEventListener("click", function () { game.querySelectorAll(".play-choice").forEach(function (x) { x.disabled = true; }); var r = document.createElement("p"); r.textContent = "The cat approves everyone. Your day is approved."; game.appendChild(r); log("side_done", s.title); });
        game.appendChild(b);
      });
    } else if (s.kind === "rain") {
      var b = document.createElement("button"); b.type = "button"; b.className = "play-choice"; b.textContent = "Make it rain";
      var planes = 0, note2 = document.createElement("p");
      b.addEventListener("click", function () {
        b.disabled = true;
        street.classList.add("raining");
        note2.textContent = "It rains. The path shines like a runway. Land 3 paper planes — tap them.";
        game.appendChild(note2);
        for (var i = 0; i < 3; i++) {
          var pl = document.createElement("button"); pl.type = "button"; pl.className = "play-plane"; pl.textContent = "plane " + (i + 1);
          pl.style.left = (10 + i * 30) + "%";
          pl.addEventListener("click", function () {
            this.disabled = true; this.textContent = "landed";
            planes++;
            if (planes >= 3) { note2.textContent = "All three planes land. The planes always land."; log("side_done", s.title); }
          });
          game.appendChild(pl);
        }
      });
      game.appendChild(b);
    } else if (s.kind === "echo") {
      var returns = { "hello": "hollow", "field": "yield", "home": "hollow, again" };
      Object.keys(returns).forEach(function (w) {
        var b = document.createElement("button"); b.type = "button"; b.className = "play-choice"; b.textContent = "Shout: " + w;
        b.addEventListener("click", function () {
          var r = document.createElement("p"); r.textContent = "You shout \"" + w + "\". The meadow returns: \"" + returns[w] + "\".";
          game.appendChild(r); log("side_done", s.title + " — " + w);
        });
        game.appendChild(b);
      });
    }
    log("side_enter", s.title);
  }

  /* ---- Wiring ---- */
  street.addEventListener("click", function (e) {
    var rect = street.getBoundingClientRect();
    var cam = 0;
    var m = /translateX\((-?[\d.]+)px\)/.exec(street.style.transform || "");
    if (m) cam = -parseFloat(m[1]);
    goTo(cam + (e.clientX - rect.left));
  });
  document.getElementById("play-left").addEventListener("pointerdown", function () { store.keys.ArrowLeft = true; });
  document.getElementById("play-left").addEventListener("pointerup", function () { store.keys.ArrowLeft = false; });
  document.getElementById("play-left").addEventListener("pointerleave", function () { store.keys.ArrowLeft = false; });
  document.getElementById("play-right").addEventListener("pointerdown", function () { store.keys.ArrowRight = true; });
  document.getElementById("play-right").addEventListener("pointerup", function () { store.keys.ArrowRight = false; });
  document.getElementById("play-right").addEventListener("pointerleave", function () { store.keys.ArrowRight = false; });
  document.getElementById("play-side-btn").addEventListener("click", openSide);
  /* The Phaser game is the active keyboard surface whenever its wrap is
     shown, booted, and on screen (Episode 1). Phaser 3.80.1's keyboard
     plugin drops any keydown whose default was prevented, so when the game
     owns the keys this handler must neither preventDefault nor claim them
     — otherwise ArrowLeft/ArrowRight/A/D never reach Phaser (real-browser
     device test, 2026-11-25, PH-05). When the game is hidden (Episodes
     2–4), not booted, or scrolled off screen, the DOM street owns the keys
     and preventDefault stops the page scrolling under the walk. */
  function phaserOwnsKeys() {
    var wrap = document.getElementById("phaser-wrap");
    if (!wrap || wrap.hidden) return false;
    if (!window.__rtPhaser || !window.__rtPhaser.ready) return false;
    var r = wrap.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }
  document.addEventListener("keydown", function (e) {
    if (e.target && (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT")) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "a" || e.key === "d") {
      if (phaserOwnsKeys()) return; // Phaser takes the key; do not preventDefault.
      store.keys[e.key] = true; e.preventDefault();
    }
  });
  document.addEventListener("keyup", function (e) { store.keys[e.key] = false; });

  window.__rtPlaySetEpisode = function (n) {
    if (!PLAY[n]) return;
    store.ep = n; store.x = 200; store.targetX = null; store.activeMission = null;
    save(); build(); render();
    log("episode", "play district: " + PLAY[n].name);
  };
  // Episode buttons in the existing app switch the district too.
  document.querySelectorAll(".episode-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { window.__rtPlaySetEpisode(btn.getAttribute("data-episode")); });
  });

  build();
  render();
  requestAnimationFrame(frame);
  log("play_ready", "playable district loaded — " + epState().name + ", reduced-motion=" + reduced);
})();
