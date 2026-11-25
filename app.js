/* Rising Together — experience-first rebuild, 2026-11-25.
   Visitor DOES first, reads only if they choose. Standalone first; LIFF
   endpoint at https://chwillpcs-task.github.io/rising-together/
   (LIFF app "Rising Together", ID 2012800911-7BPP3dHp, channel 2012800911).
   Instrumentation: client-side log only. No server, no personal data,
   no LIFF analytics claim. Painted/CSS/SVG only; no photographs; no
   likeness, voice, or dialogue for any real person; no music; no 2029
   immersive scene — 2029 stays a short text question only. */
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
  log("page_view", "experience-first rebuild, reduced-motion=" + reduced);

  /* ---- Episode configuration: districts to wander, not chapters to read ---- */
  var EPISODES = {
    "1": {
      name: "Chofu — the field", district: "The Tract",
      era: "1971 — CHOFU · warm, faded past",
      far: "Mt. Fuji, from the Chofu breezeway",
      beats: ["Beat 1 of 5 — The field", "Beat 2 of 5 — Track, soccer, football (same ground, re-dressed)",
        "Beat 3 of 5 — The housing fades, house by house (returned 1974)",
        "Beat 4 of 5 — Ajinomoto Stadium rises", "Beat 5 of 5 — Japan, today (painted map)"],
      read: ["The field, 1971 — imagined reconstruction.",
        "Same ground, three sports: track, soccer, football.",
        "The housing fades — Kanto Mura, about 880 homes, returned 1974.",
        "Ajinomoto Stadium stands here now, opened 10 March 2001.",
        "Japan today — Chofu, Tachikawa, Yokosuka, Tama, Tokachi."],
      what: "What you are looking at: a painted reconstruction of the Chofu field, 1971. " +
        "The team, names and 9–1 season record are on the record (Hosho 1972, pp. 96–99). " +
        "The moving game, faces and weather are imagined. The exact spot of the old field is not established.",
      contacts: ["Miki — drink stand", "Old Jiro — stadium steps", "Aya — kites"],
      hotspots: [
        { key: "ball", n: "1", x: "18%", y: "62%", title: "The Lost Ball",
          lines: ["A ball rolls off the field and into Miki's bottle crate.", "She keeps every ball that lands there.", "Bring one back — she tells you which way the wind runs."],
          choices: [{ label: "Chase the ball", act: "chase" }, { label: "Ask Miki", act: "talk", draft: "Miki, a ball landed in your crate. Which way does the wind run over this field?" }],
          about: "Chofu High School opened 1963, closed 1974, in the Kanto Mura Housing Annex. The field is an imagined reconstruction. The exact spot of the old field inside today's stadium area is not established." },
        { key: "season", n: "2", x: "52%", y: "48%", title: "The 1971 season",
          lines: ["Same ground, three sports. The football season is on the record.", "1971 Vikings, 9–1, Far East Champions.", "Tap About for the names — one line, facts only."],
          choices: [{ label: "Watch the runners", act: "watch" }, { label: "Walk the track", act: "walk", beat: 1 }],
          about: "John Okabayashi — Quarterback, Senior, Honolulu. Tony Reed — Running Back, Junior, San Francisco. Henry Williams — Junior, RB/DB, Honorable Mention, jersey 32. No likeness is drawn for any of them. Source: Hosho 1972, pp. 96–99." },
        { key: "kite", n: "3", x: "78%", y: "30%", title: "Aya's kite",
          lines: ["Aya flies kites over the field. One is stuck on the stadium roof.", "The chase runs field → housing rows → stadium.", "Or take the side street — the pigeon has other ideas."],
          choices: [{ label: "Chase the kite", act: "chase" }, { label: "Pigeon steals the ball", act: "side", side: "pigeon" }],
          about: "Aya is fictional, imagined, never a real person. The kite chase is play — imagined, not a real event." },
        { key: "housing", n: "4", x: "70%", y: "70%", title: "The houses fade",
          lines: ["Scroll and the housing rows fade, house by house.", "About 880 homes, about 4,500 people — returned in 1974.", "Which street do you walk down as they go?"],
          choices: [{ label: "Walk the station road", act: "walk", beat: 2 }, { label: "Walk the river path", act: "walk", beat: 2 }, { label: "Stay at the gate", act: "watch" }],
          about: "Kanto Mura housing: about 880 homes, about 4,500 people, fully returned to Japan in 1974. School, housing, airfield and stadium share the same returned 203.6-hectare tract." }
      ],
      sides: { pigeon: { title: "Pigeon Steals the Ball", lines: ["Mid-game, a pigeon takes the ball and the whole district chases it down the station road.", "The pigeon always wins."] } }
    },
    "2": {
      name: "Yokosuka — the street", district: "Dobuita & the harbour steps",
      era: "DOBUITA · painted street, present day",
      far: "Harbour light — Yokosuka, a working port town",
      beats: ["Beat 1 of 5 — Dobuita street", "Beat 2 of 5 — The harbour", "Beat 3 of 5 — Shopfronts, painted",
        "Beat 4 of 5 — The sukajan", "Beat 5 of 5 — Yokosuka, today (painted map)"],
      read: ["Dobuita street, Yokosuka — painted, not a photograph.",
        "A working port town, outside the base.",
        "Painted shopfronts — none a portrait of a real shop.",
        "The sukajan, as a painted object, in general terms.",
        "Yokosuka today — a painted map dot."],
      what: "What you are looking at: a painted reconstruction of Dobuita street, Yokosuka, outside the base. " +
        "The street is real and photographable today; this picture of it is painted, not a photograph. " +
        "No shop is named as participating, and no shopfront here is a portrait of a real shop.",
      contacts: ["Rin — tailor's apprentice", "Haru — knows every shop", "Mrs Umi — harbour café"],
      hotspots: [
        { key: "jacket", n: "1", x: "20%", y: "60%", title: "The Jacket That Fits Nobody",
          lines: ["Rin presses jackets. One sukajan fits nobody who tries it on.", "Wear it down the street and let the street measure you.", "Which door do you try first?"],
          choices: [{ label: "Try the tailor's door", act: "walk", beat: 2 }, { label: "Try the harbour door", act: "walk", beat: 1 }, { label: "Ask Rin", act: "talk", draft: "Rin, the jacket fits nobody. What does the street say about who it fits?" }],
          about: "Rin is fictional, imagined, never a real person. No shop is named as participating; no jacket design is reproduced." },
        { key: "cats", n: "2", x: "52%", y: "46%", title: "Haru's Three Cats",
          lines: ["Three painted cats hide on Dobuita. Find them all.", "Haru shows you the harbour steps and the view nobody photographs.", "Tap a cat when you spot one."],
          choices: [{ label: "Find the cats", act: "cats" }, { label: "Ask Haru", act: "talk", draft: "Haru, I found your cats. Show me the harbour steps." }],
          about: "Haru is fictional, imagined, never a real person. The cats are painted; the harbour steps are a painted place." },
        { key: "cafe", n: "3", x: "76%", y: "68%", title: "Mrs Umi's wall of promises",
          lines: ["Mrs Umi keeps every promise on her café wall.", "Three IOUs wait for visitors who promised to come back.", "Deliver one — or leave one of your own."],
          choices: [{ label: "Deliver an IOU", act: "walk", beat: 1 }, { label: "Leave a promise", act: "talk", draft: "Mrs Umi, I promise to come back to Dobuita. Keep this on your wall." }],
          about: "Mrs Umi is fictional, imagined, never a real person. Dobuita is a real street in Yokosuka; this picture of it is painted." },
        { key: "train", n: "4", x: "48%", y: "72%", title: "The train passes",
          lines: ["A train crosses the street and the whole district pauses.", "Watch it pass — then the street starts again.", "Which way does it go?"],
          choices: [{ label: "Watch the train pass", act: "train" }, { label: "Walk to the harbour steps", act: "walk", beat: 1 }],
          about: "Yokosuka is a working port town. No ship is named or depicted as a real vessel. No game image, screenshot, or logo is used here." }
      ],
      sides: { doors: { title: "The Alley of Doors", lines: ["Every door painted a different colour.", "One door, opened, plays harbour sound."] } }
    },
    "3": {
      name: "Tachikawa — the park", district: "The park, the runway line, the base town",
      era: "TACHIKAWA · airfield → park",
      far: "Park trees — Showa Kinen Park, present day",
      beats: ["Beat 1 of 5 — The airfield, 1977", "Beat 2 of 5 — The runways fall silent",
        "Beat 3 of 5 — The return (1977)", "Beat 4 of 5 — Showa Kinen Park, present",
        "Beat 5 of 5 — Tachikawa, today (painted map)"],
      read: ["The airfield in its last year, 1977 — imagined reconstruction.",
        "The runways fall silent. Base closed 30 September 1977.",
        "Full return to Japan, 1977.",
        "Showa Kinen Park opened 26 October 1983, on the former airfield.",
        "Tachikawa today — a painted map dot."],
      what: "What you are looking at: a painted reconstruction of Tachikawa, airfield to park. " +
        "The base closed 30 September 1977 and was fully returned that year; Showa Kinen Park opened 26 October 1983 — on the record. " +
        "The museum photograph of Akebonocho (c.1952) is not used here.",
      contacts: ["Sora — bicycle hire", "Mr Kaze — walks the runway line", "Nana — seed packets"],
      hotspots: [
        { key: "line", n: "1", x: "50%", y: "46%", title: "Walk the Line",
          lines: ["Mr Kaze walks the runway line every morning.", "Walk it and the painted runway appears under the grass.", "It fades after a few steps. Walk it again."],
          choices: [{ label: "Walk the line", act: "line" }, { label: "Ask Mr Kaze", act: "talk", draft: "Mr Kaze, I walked the runway line. What did the airfield see from here?" }],
          about: "Mr Kaze is fictional, imagined, never a real person. Tachikawa Air Base closed 30 September 1977, full return 1977; Showa Kinen Park opened 26 October 1983." },
        { key: "bike", n: "2", x: "20%", y: "60%", title: "The Squeaky Wheel",
          lines: ["Sora's hire bike squeaks. Follow the squeak.", "It leads you to the park's oldest tree.", "Ride, or walk beside it?"],
          choices: [{ label: "Follow the squeak", act: "walk", beat: 3 }, { label: "Ask Sora", act: "talk", draft: "Sora, your bike squeaks. Where does it lead?" }],
          about: "Sora is fictional, imagined, never a real person. The museum photograph is not used here — described in words only, not shown, copied, or traced." },
        { key: "seeds", n: "3", x: "76%", y: "68%", title: "Nana's seed packets",
          lines: ["Nana sells seed packets at the park gate, labelled with years.", "Plant one — imagined — and see, painted, what grew that year.", "Which year do you plant?"],
          choices: [{ label: "Plant 1977", act: "plant", year: "1977" }, { label: "Plant 1983", act: "plant", year: "1983" }, { label: "Ask Nana", act: "talk", draft: "Nana, I planted a packet. What grew in that year?" }],
          about: "Nana is fictional, imagined, never a real person. No claim is made about the exact footprint of base buildings inside today's park." },
        { key: "rain", n: "4", x: "62%", y: "30%", title: "The Rain Runway",
          lines: ["When it rains, the painted path shines like a runway.", "The park becomes an airfield for ten minutes.", "Children land paper planes on it."],
          choices: [{ label: "Make it rain", act: "rain" }, { label: "Enter the side street", act: "side", side: "rain" }],
          about: "The Rain Runway is imagined play — a side street, short, cleanly exited. No era is claimed beyond the record above." }
      ],
      sides: { rain: { title: "The Rain Runway", lines: ["Rain falls. The path shines like a runway.", "Land a paper plane on it — then the sun comes back."] } }
    },
    "4": {
      name: "Tama — imagined", district: "The meadow, the lake edge, the tree line",
      era: "TAMA · imagined — not a visit",
      far: "Hills — imagined, civilian-era framing only",
      beats: ["Beat 1 of 5 — Open grass, imagined", "Beat 2 of 5 — Trees and water",
        "Beat 3 of 5 — Recreation, imagined", "Beat 4 of 5 — The question of era",
        "Beat 5 of 5 — Tama, imagined — not a visit"],
      read: ["Open grass, imagined — civilian-era framing only.",
        "Trees and water, painted. No real facility is depicted.",
        "Leisure, imagined. No real person, no real event.",
        "Which era? Not established. The episode does not pick one.",
        "Tama is an active annex, ID/guest-only. Not a visit."],
      what: "What you are looking at: an imagined, civilian-era framing of Tama — open grass, trees, water. " +
        "Tama is an active annex, ID/guest-only access; it is not depicted as publicly visitable and no era is claimed. " +
        "The era question is not established.",
      contacts: ["Pip — counts ducks", "Mrs Mori — picnic for one", "The path-keeper — sweeps leaves"],
      hotspots: [
        { key: "ducks", n: "1", x: "48%", y: "58%", title: "The Duck Count",
          lines: ["Pip counts ducks that aren't there. The count is always wrong by one.", "The extra duck is the joke, and the lake keeps it.", "Count them yourself — tap a duck."],
          choices: [{ label: "Count the ducks", act: "ducks" }, { label: "Ask Pip", act: "talk", draft: "Pip, I counted the ducks. How many did you get?" }],
          about: "Pip is fictional, imagined, never a real person. Tama is an active annex, ID/guest-only access; this is imagined, not a visit." },
        { key: "picnic", n: "2", x: "22%", y: "62%", title: "The Picnic for One",
          lines: ["Mrs Mori sets a place for a guest who never arrives.", "Today, the visitor is the guest — once.", "Sit down, or keep walking?"],
          choices: [{ label: "Sit down", act: "watch" }, { label: "Keep walking", act: "walk", beat: 4 }],
          about: "Mrs Mori is fictional, imagined, never a real person. No facility, building, boundary, or interior is depicted." },
        { key: "path", n: "3", x: "74%", y: "66%", title: "The Path That Stops",
          lines: ["The path-keeper sweeps leaves off a path nobody walks.", "Help sweep to the soft edge — and stop where the sweeping stops.", "The soft edge is the point."],
          choices: [{ label: "Sweep to the edge", act: "walk", beat: 4 }, { label: "Turn back", act: "watch" }],
          about: "The path-keeper is fictional, imagined, never a real person. The era is unresolved and none is claimed." },
        { key: "era", n: "4", x: "60%", y: "36%", title: "Which era?",
          lines: ["Arsenal? Depot? 1980s recreation? Present?", "This episode does not pick an era by drawing one.", "Which would you choose — as a question, not a vote?"],
          choices: [{ label: "1980s recreation", act: "talk", draft: "For Tama, show the 1980s recreation era, because: " }, { label: "Keep it imagined", act: "talk", draft: "For Tama, keep it imagined and do not pick an era, because: " }],
          about: "The era question is not established. No choice here settles it — the era decision stays with Carl." }
      ],
      sides: { echo: { title: "The Echo Meadow", lines: ["Shout a word and the meadow returns a different one.", "The district keeps a list of the best returns."] } }
    }
  };
  var OLD_HOTSPOT = { "card-field": "ball", "card-season": "season", "card-spot": "housing", "card-e2-street": "jacket", "card-e2-real": "cafe", "card-e2-shops": "jacket", "card-e3-park": "line", "card-e3-photo": "bike", "card-e3-town": "seeds", "card-e4-imagined": "ducks", "card-e4-era": "era", "card-e4-access": "path" };
  var activeEpisode = "1";
  var stage = document.getElementById("stage");
  var travel = document.getElementById("travel");
  var hotspotsEl = document.getElementById("hotspots");
  var momentEl = document.getElementById("moment");
  var momentTitle = document.getElementById("moment-title");
  var momentLines = document.getElementById("moment-lines");
  var momentChoices = document.getElementById("moment-choices");
  var momentAbout = document.getElementById("moment-about");
  var beatLabel = document.getElementById("beat-label");
  var eraChip = document.getElementById("era-chip");
  var farLabel = document.getElementById("far-label");
  var progressEl = document.getElementById("scroll-progress");
  var dailyJobEl = document.getElementById("daily-job");
  var panX = 0, driftX = 0, driftDir = 1, beat = 0, progress = 0;
  var duckCount = 0, catsFound = 0, todaysJob = null;

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

  /* ---- Daily choice: one choice a day, a job to come back to ---- */
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function loadDaily() {
    try {
      var raw = window.localStorage && window.localStorage.getItem("rt-daily-" + todayKey());
      if (raw) { todaysJob = JSON.parse(raw); return; }
    } catch (e) { todaysJob = null; }
    var ep = EPISODES[activeEpisode];
    var day = new Date().getDate();
    todaysJob = { contact: ep.contacts[day % ep.contacts.length], done: false, episode: activeEpisode };
  }
  function renderDaily() {
    if (!dailyJobEl) return;
    var ep = EPISODES[activeEpisode];
    loadDaily();
    if (todaysJob.episode !== activeEpisode) {
      var day = new Date().getDate();
      todaysJob = { contact: ep.contacts[day % ep.contacts.length], done: false, episode: activeEpisode };
    }
    dailyJobEl.classList.toggle("done", !!todaysJob.done);
    dailyJobEl.innerHTML = "";
    var h = document.createElement("h2");
    h.textContent = todaysJob.done ? "Today's job — done. Come back tomorrow." : "Today's job — " + todaysJob.contact;
    var p = document.createElement("p");
    p.textContent = todaysJob.done
      ? "You did today's job in " + ep.district + ". Tomorrow a different contact hands out the work."
      : "One choice today. Pick who hands you the work — it changes what is open.";
    dailyJobEl.appendChild(h); dailyJobEl.appendChild(p);
    if (!todaysJob.done) {
      var wrap = document.createElement("div");
      wrap.className = "job-choices";
      ep.contacts.forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = c;
        b.addEventListener("click", function () {
          todaysJob = { contact: c, done: false, episode: activeEpisode };
          try { if (window.localStorage) window.localStorage.setItem("rt-daily-" + todayKey(), JSON.stringify(todaysJob)); } catch (e) {}
          log("daily_choice", "episode " + activeEpisode + " — today's contact: " + c);
          markJobHotspot(c);
          renderDaily();
        });
        wrap.appendChild(b);
      });
      dailyJobEl.appendChild(wrap);
    } else {
      var back = document.createElement("p");
      back.textContent = "Your return reason tomorrow: a new job, a chase, a cat to find.";
      dailyJobEl.appendChild(back);
    }
  }
  function markJobHotspot(contact) {
    var name = contact.split(" — ")[0];
    var map = { "Miki": "ball", "Old Jiro": "housing", "Aya": "kite", "Rin": "jacket", "Haru": "cats", "Mrs Umi": "cafe", "Sora": "bike", "Mr Kaze": "line", "Nana": "seeds", "Pip": "ducks", "Mrs Mori": "picnic", "The path-keeper": "path" };
    var key = map[name];
    if (!key) return;
    var btn = hotspotsEl.querySelector('[data-hotspot="' + key + '"]');
    if (btn) btn.classList.add("job-open");
  }
  function finishJob(label) {
    if (!todaysJob || todaysJob.done) return;
    todaysJob.done = true;
    try { if (window.localStorage) window.localStorage.setItem("rt-daily-" + todayKey(), JSON.stringify(todaysJob)); } catch (e) {}
    log("daily_job_done", label || todaysJob.contact);
    renderDaily();
  }

  /* ---- Hotspots: rendered per episode; tapping DOES something ---- */
  function renderHotspots() {
    if (!hotspotsEl) return;
    hotspotsEl.innerHTML = "";
    EPISODES[activeEpisode].hotspots.forEach(function (hs) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "hotspot"; b.style.left = hs.x; b.style.top = hs.y;
      b.setAttribute("data-hotspot", hs.key);
      b.setAttribute("aria-label", "Hotspot: " + hs.title);
      b.textContent = hs.n;
      b.addEventListener("click", function () { openMoment(hs, b); });
      hotspotsEl.appendChild(b);
    });
    if (todaysJob) markJobHotspot(todaysJob.contact);
  }
  function openMoment(hs, btn) {
    var t0 = performance.now();
    momentTitle.textContent = hs.title;
    momentLines.innerHTML = "";
    hs.lines.slice(0, 3).forEach(function (line, i) {
      var s = document.createElement("span");
      s.textContent = line + (i < hs.lines.length - 1 ? " " : "");
      momentLines.appendChild(s);
    });
    momentAbout.hidden = true;
    momentAbout.textContent = hs.about || "";
    document.getElementById("moment-about-btn").textContent = "About this place";
    momentChoices.innerHTML = "";
    hs.choices.forEach(function (ch) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = ch.label;
      b.addEventListener("click", function () { doChoice(ch, hs); });
      momentChoices.appendChild(b);
    });
    momentEl.hidden = false;
    if (momentEl.focus) momentEl.focus();
    log("hotspot_tap", hs.key + " opened in " + Math.round(performance.now() - t0) + " ms (episode " + activeEpisode + ")");
    /* Tapping a hotspot moves the camera toward it. */
    if (btn) { var x = parseFloat(btn.style.left) || 50; panX = Math.max(-120, Math.min(120, (50 - x) * 1.2)); applyCamera(); }
  }
  function doChoice(ch, hs) {
    log("moment_choice", (hs ? hs.key : "") + " — " + ch.label);
    if (ch.act === "chase") {
      stage.classList.remove("chasing"); void stage.offsetWidth; stage.classList.add("chasing");
      setTimeout(function () { stage.classList.remove("chasing"); }, 4200);
      finishJob("chase: " + (hs ? hs.title : ""));
    } else if (ch.act === "train") {
      stage.classList.remove("train-passing"); void stage.offsetWidth; stage.classList.add("train-passing");
      setTimeout(function () { stage.classList.remove("train-passing"); }, 5200);
      finishJob("train");
    } else if (ch.act === "line") {
      stage.classList.remove("line-visible"); void stage.offsetWidth; stage.classList.add("line-visible");
      setTimeout(function () { stage.classList.remove("line-visible"); }, 8200);
      finishJob("walk the line");
    } else if (ch.act === "rain") {
      stage.classList.add("rain");
      setTimeout(function () { stage.classList.remove("rain"); }, 9000);
      finishJob("rain runway");
    } else if (ch.act === "cats") {
      catsFound = 0;
      stage.classList.add("cats-found");
      momentLines.textContent = "Three cats, hiding in plain sight. Tap a cat in the scene when you spot one.";
      log("cats_start", "find the three cats on Dobuita");
    } else if (ch.act === "ducks") {
      duckCount = 0;
      stage.classList.add("ducks-out");
      momentLines.textContent = "Count them yourself — tap a duck in the scene. Pip says the count is always wrong by one.";
      log("duck_count_start", "tap the ducks to count");
    } else if (ch.act === "plant") {
      momentLines.textContent = "Planted " + ch.year + " — imagined. Painted green comes up where the runway was.";
      finishJob("plant " + ch.year);
    } else if (ch.act === "walk") {
      goToBeat(ch.beat || 0);
    } else if (ch.act === "talk") {
      var text = document.getElementById("contrib-text");
      if (text) text.value = ch.draft || "";
      var talk = document.getElementById("talkback");
      if (talk && talk.scrollIntoView) talk.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      log("two_way_choice", "episode " + activeEpisode + " — " + ch.label + " (draft only, nothing sent)");
      setTalk("Your words are written in the box below — edit them if you like, tick the box, then tap Send to TASK. Nothing has been sent yet.");
      closeMoment();
    } else if (ch.act === "side" && ch.side) {
      openSideStreet(ch.side);
    } else if (ch.act === "watch") {
      /* Watching IS doing here: the scene keeps moving; the moment closes. */
      closeMoment();
    }
  }
  function closeMoment() {
    if (momentEl) momentEl.hidden = true;
    log("hotspot_close", "moment closed");
  }
  document.getElementById("moment-leave").addEventListener("click", closeMoment);
  document.getElementById("moment-about-btn").addEventListener("click", function () {
    momentAbout.hidden = !momentAbout.hidden;
    this.textContent = momentAbout.hidden ? "About this place" : "Hide the facts";
    log("moment_about", momentAbout.hidden ? "hidden" : "shown");
  });
  /* Tappable cats and ducks in the scene itself */
  document.querySelectorAll(".fig.cat").forEach(function (cat) {
    cat.addEventListener("click", function () {
      if (!stage.classList.contains("cats-found")) return;
      catsFound += 1;
      log("cat_found", catsFound + " of 3");
      cat.style.opacity = "0.35";
      if (catsFound >= 3) {
        momentLines.textContent = "Three cats found. Haru shows you the harbour steps — and the view nobody photographs.";
        finishJob("Haru's three cats");
      } else {
        momentLines.textContent = catsFound + " of 3 cats found. Keep looking.";
      }
    });
  });
  document.querySelectorAll(".fig.duck").forEach(function (duck) {
    duck.addEventListener("click", function () {
      if (!stage.classList.contains("ducks-out")) return;
      duckCount += 1;
      log("duck_tapped", "count " + duckCount);
      duck.style.opacity = "0.35";
      momentLines.textContent = "You counted " + duckCount + ". Pip counted one more. The extra duck is the joke.";
      if (duckCount >= 3) finishJob("duck count");
    });
  });
  /* Side streets: labelled play, short, clean exit */
  function openSideStreet(key) {
    var ep = EPISODES[activeEpisode];
    var side = ep.sides && ep.sides[key];
    if (!side) { log("side_street_missing", key); return; }
    document.getElementById("sidestreet-title").textContent = side.title;
    document.getElementById("sidestreet-lines").textContent = side.lines.join(" ");
    document.getElementById("sidestreet").hidden = false;
    closeMoment();
    log("side_street", key + " entered (Imagined — play)");
  }
  document.getElementById("sidestreet-exit").addEventListener("click", function () {
    document.getElementById("sidestreet").hidden = true;
    log("side_street_exit", "back to the main road");
  });

  /* ---- Episode switching ---- */
  function switchEpisode(n, source) {
    if (!EPISODES[n]) return;
    if (n === activeEpisode && source === "select") return;
    var prev = activeEpisode;
    activeEpisode = n;
    document.body.setAttribute("data-episode", n);
    stage.setAttribute("data-episode", n);
    document.querySelectorAll(".episode-btn").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-episode") === n));
    });
    var ep = EPISODES[n];
    if (eraChip) eraChip.textContent = ep.era;
    if (farLabel) farLabel.textContent = ep.far;
    closeMoment();
    document.getElementById("sidestreet").hidden = true;
    stage.classList.remove("chasing", "train-passing", "line-visible", "cats-found", "ducks-out", "rain");
    renderHotspots();
    renderRead();
    renderDaily();
    if (window.__rtPlaySetEpisode) window.__rtPlaySetEpisode(n);
    log("episode_select", "episode " + n + " (" + ep.name + ") selected from " + (source || "unknown") + ", was " + prev);
    log("episode_entry", "episode " + n + " (" + ep.name + ")");
    onScroll();
    if (stage.scrollIntoView) stage.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
  window.__rtSwitchEpisode = switchEpisode;
  document.querySelectorAll(".episode-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { switchEpisode(btn.getAttribute("data-episode"), "selector"); });
  });

  /* ---- Read it: at most 5 one-line beats, hidden by default ---- */
  function renderRead() {
    var ol = document.getElementById("read-lines");
    if (!ol) return;
    ol.innerHTML = "";
    EPISODES[activeEpisode].read.slice(0, 5).forEach(function (line) {
      var li = document.createElement("li");
      li.textContent = line;
      ol.appendChild(li);
    });
  }
  var readMode = document.getElementById("read-mode");
  var readToggle = document.getElementById("read-toggle");
  function setRead(open) {
    readMode.hidden = !open;
    readToggle.setAttribute("aria-pressed", String(open));
    log("read_mode", (open ? "opened" : "closed") + " (episode " + activeEpisode + ")");
    if (open && readMode.scrollIntoView) readMode.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  readToggle.addEventListener("click", function () { setRead(readMode.hidden); });
  document.getElementById("read-close").addEventListener("click", function () { setRead(false); });

  /* rAF helper: jsdom / non-visual environments have no requestAnimationFrame */
  function raf(fn) {
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(fn);
    else fn();
  }
  var ticking = false;
  function applyCamera() {
    var layers = Array.prototype.slice.call(stage.querySelectorAll(".layer"));
    var scale = 1 + progress * 1.6;
    layers.forEach(function (layer) {
      var speed = parseFloat(layer.getAttribute("data-speed") || "1");
      var x = (driftX + panX + (progress * 40 * speed)) * -1;
      if (layer.classList.contains("layer-mid")) {
        layer.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0) scale(" + scale.toFixed(3) + ")";
      } else {
        layer.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0)";
      }
    });
    stage.style.setProperty("--colour", progress.toFixed(2));
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    raf(function () {
      ticking = false;
      var rect = travel.getBoundingClientRect();
      var total = travel.offsetHeight - window.innerHeight;
      progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      beat = Math.min(4, Math.floor(progress * 5));
      stage.setAttribute("data-beat", String(beat));
      if (beatLabel) beatLabel.textContent = EPISODES[activeEpisode].beats[beat];
      if (progressEl) progressEl.style.width = (progress * 100).toFixed(1) + "%";
      var midfar = document.getElementById("houses-layer");
      if (midfar) midfar.style.opacity = progress < 0.4 ? "0.45" : Math.max(0, 0.45 - (progress - 0.4) * 1.2).toFixed(2);
      applyCamera();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  function goToBeat(b) {
    var total = travel.offsetHeight - window.innerHeight;
    var y = travel.offsetTop + (b / 5) * total + 10;
    try { window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" }); } catch (e) { /* jsdom: no scrolling */ }
    log("camera_move", "to beat " + (b + 1));
  }

  /* Auto-drift: slow, capped, pauses on interaction / reduced motion */
  var driftOn = !reduced, lastDrift = 0;
  function drift(ts) {
    if (driftOn && ts - lastDrift > 50) {
      lastDrift = ts;
      driftX += 0.6 * driftDir;
      if (driftX > 60 || driftX < -60) driftDir *= -1;
      applyCamera();
    }
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(drift);
  }
  if (!reduced && typeof requestAnimationFrame === "function") requestAnimationFrame(drift);
  var driftToggle = document.getElementById("drift-toggle");
  if (reduced) { driftToggle.textContent = "Auto-drift off (reduced motion)"; driftToggle.setAttribute("aria-pressed", "false"); }
  driftToggle.addEventListener("click", function () {
    driftOn = !driftOn;
    driftToggle.setAttribute("aria-pressed", String(driftOn));
    driftToggle.textContent = driftOn ? "Pause drift" : "Resume drift";
    log("drift_toggle", driftOn ? "on" : "off");
    if (driftOn && !reduced && typeof requestAnimationFrame === "function") requestAnimationFrame(drift);
  });

  /* Drag to pan = walking */
  (function () {
    var dragging = false, startX = 0, startPan = 0;
    stage.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button")) return;
      dragging = true; startX = e.clientX; startPan = panX;
      if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      panX = Math.max(-120, Math.min(120, startPan + (e.clientX - startX) * 0.3));
      applyCamera();
    });
    ["pointerup", "pointercancel"].forEach(function (ev) {
      stage.addEventListener(ev, function () { dragging = false; });
    });
  })();

  /* Watch the field move: 12 s silent Chofu clip, poster first (ep 1 only) */
  var clipbox = document.getElementById("clipbox");
  var clip = document.getElementById("clip");
  var cover = document.getElementById("play-cover");
  var note = document.getElementById("video-note");
  var thresholds = [25, 50, 75, 100], hit = {};
  document.getElementById("watch-btn").addEventListener("click", function () {
    if (activeEpisode !== "1") {
      if (note) note.textContent = "Clip not yet rendered for Episode " + activeEpisode + ". The painted scene above is the whole opening for now — no video file exists for this episode.";
      log("clip_not_rendered", "episode " + activeEpisode + " — poster still only, no fake video");
    }
    clipbox.hidden = false;
    if (clipbox.scrollIntoView) clipbox.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    log("watch_open", "episode " + activeEpisode);
  });
  document.getElementById("clip-close").addEventListener("click", function () {
    clipbox.hidden = true;
    if (clip) clip.pause();
    if (stage.scrollIntoView) stage.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  });
  if (clip) {
    clip.muted = true;
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
  if (cover) cover.addEventListener("click", function () {
    if (activeEpisode !== "1") {
      if (note) note.textContent = "Clip not yet rendered for Episode " + activeEpisode + ". The poster still above is the whole opening for now — no video file exists for this episode.";
      log("clip_not_rendered", "episode " + activeEpisode + " — poster still only, no fake video");
      return;
    }
    var attempt = null;
    try { attempt = clip.play(); } catch (e) { attempt = null; log("video_autoplay_blocked", "play() threw — poster shown, tap-to-play cover active"); }
    if (attempt && attempt.catch) {
      attempt.then(function () {
        if (note) note.textContent = "Playing (muted, silent by design). Autoplay in LINE is NOT claimed.";
        if (cover) cover.hidden = true;
        log("video_play", "tap-to-play succeeded");
      }).catch(function () {
        if (note) note.textContent = "Play blocked in this browser — poster shown. Tap again to play. This is the expected fallback.";
        log("video_autoplay_blocked", "poster shown, tap-to-play cover active");
      });
    }
  });

  /* 2029 About (one line, behind a button) */
  document.getElementById("q-about-btn").addEventListener("click", function () {
    var el = document.getElementById("q-about");
    el.hidden = !el.hidden;
    this.textContent = el.hidden ? "About this question" : "Hide";
  });
  document.getElementById("talk-jump").addEventListener("click", function () {
    var talk = document.getElementById("talkback");
    if (talk && talk.scrollIntoView) talk.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  });

  /* ---- Two-way communication: LIFF -> chat, chat -> LIFF (2026-11-25) ----
     Preserved exactly in behaviour: liff.sendMessages() sends up to 5
     messages on behalf of the user to the chat room where the LIFF app was
     opened, ONLY in the LIFF browser, ONLY when launched from a 1:1, group,
     or multi-person chat, ONLY when chat_message.write is enabled AND
     granted. A TEXT message sent with sendMessages DOES trigger a webhook
     on the Messaging API channel; Flex/template does NOT — contributions
     are therefore sent as TEXT, never as Flex. */
  var LIFF_ID = "2012800911-7BPP3dHp";
  var LIFF_URL = "https://liff.line.me/" + LIFF_ID;
  var liffReady = false, liffInClient = false, liffScopes = [];
  var talkStatus = document.getElementById("talk-status");
  var sendBtn = document.getElementById("send-to-task");
  var withdrawBtn = document.getElementById("withdraw-btn");
  var contribText = document.getElementById("contrib-text");
  var contribType = document.getElementById("contrib-type");
  var contribOptin = document.getElementById("contrib-optin");
  var pendingList = document.getElementById("pending-list");
  var pending = [];
  function setTalk(msg) { if (talkStatus) talkStatus.textContent = msg; log("talkback_status", msg); }
  function renderPending() {
    if (!pendingList) return;
    pendingList.innerHTML = "";
    if (!pending.length) { pendingList.innerHTML = "<li>No contribution written yet. Nothing has been sent.</li>"; return; }
    pending.forEach(function (p) {
      var li = document.createElement("li");
      li.textContent = "[" + p.type + ", Episode " + p.episode + "] " + p.text + " — " + p.state;
      pendingList.appendChild(li);
    });
  }
  renderPending();
  /* Deep link in: ?episode=N&hotspot=key — from a bot Flex message
     (liff.state) or a plain LIFF URL query. Never trust it blindly:
     episode must be 1–4, hotspot must exist in that episode. Old card ids
     (card-field etc.) map to the new hotspot keys. */
  function parseDeepLink() {
    var q = new URLSearchParams(window.location.search || "");
    var state = q.get("liff.state");
    if (state) { try { q = new URLSearchParams(decodeURIComponent(state)); } catch (e) { q = new URLSearchParams(state); } }
    var ep = q.get("episode"), hs = q.get("hotspot");
    if (ep && EPISODES[ep]) {
      switchEpisode(ep, q.get("from") === "bot" ? "bot-deep-link" : "deep-link");
      if (hs) {
        var key = OLD_HOTSPOT[hs] || hs;
        var target = EPISODES[ep].hotspots.filter(function (h) { return h.key === key; })[0];
        if (target) {
          openMoment(target, null);
          log("deep_link_hotspot", key + " opened from " + (q.get("from") || "link"));
        } else { log("deep_link_hotspot_rejected", "unknown hotspot '" + hs + "' for episode " + ep); }
      }
    } else if (ep) { log("deep_link_episode_rejected", "unknown episode '" + ep + "'"); }
  }
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
        setTalk("Talk-back is not switched on for this LIFF app in this session: the chat_message.write permission is not enabled or not granted here. Your words are safe here — nothing has been sent, and the Send button will tell you this instead of failing silently.");
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
  var shareBtn = document.getElementById("share-btn");
  if (shareBtn) shareBtn.addEventListener("click", function () {
    if (typeof window.liff === "undefined" || !liffReady || !liffInClient) { setTalk("Sharing needs LINE: open this from the TASK chat in LINE. Nothing was shared."); log("share_blocked_not_in_line", "nothing shared"); return; }
    window.liff.shareTargetPicker([{ type: "text", text: "Rising Together — Episode " + activeEpisode + " (" + EPISODES[activeEpisode].name + "). " + LIFF_URL + "?episode=" + activeEpisode }]).then(function (res) {
      log("share_chosen", res ? "picker returned" : "picker closed");
      setTalk(res ? "Shared — thank you. How many people receive it is not counted, and never will be." : "Share picker closed — nothing was shared.");
    }).catch(function (err) { log("share_failed", err && err.code ? err.code : String(err)); setTalk("Sharing failed. Nothing was shared."); });
  });
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

  /* ---- Boot: stage first, no reading required ---- */
  renderHotspots();
  renderRead();
  renderDaily();
  log("episode_entry", "episode 1 (Chofu — the field)");
  onScroll();
  parseDeepLink();
})();
