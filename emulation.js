/* Rising Together — EMULATION: the four districts as Phaser 3 places
 * (2026-11-26). Carl's clarification, in substance: "when I say
 * emulation, I really want the users to see or think they are in
 * something like a Sega and GTA look-a-like environments and people
 * popping sometimes."
 *
 * What this file does: it boots the data-driven engine (engine.js) as
 * the PLAY mode for ALL FOUR episodes — Chofu, Yokosuka, Tachikawa,
 * Tama — one walkable district per episode, switched by the episode
 * strip. The engine renders each district from its data file
 * (data/<id>.json): neon shop signs in our own words, lit windows,
 * lamps, people popping in and out (a tailor opens a shutter, a sailor
 * walks down the harbour steps, a kid chases a ball, a cat crosses the
 * street), and in Chofu a crowd that rises and cheers at the snap.
 *
 * Nothing here copies Sega or GTA: no art, character, music or
 * trademark of theirs. The feeling is stolen, never the picture.
 * Painted art only, drawn in code. No photographs, no likeness, no
 * real person's voice or dialogue, no music, no audio, no 2029
 * immersive scene. Silent by design. No server, no Service Worker.
 * Progress is kept on this device only (localStorage key
 * rising-together:v2 — a new key, so a visitor who finished The Lost
 * Ball in the old Chofu-only build (v1) starts fresh here; the street
 * below keeps its own progress). The register mark stays persistent
 * in the page header: "Imagined, to be witnessed and experienced by
 * everyone".
 *
 * This replaces phaser-game.js (Chofu-only, 2026-11-25), which is no
 * longer loaded. The CSS street below still works and is the fallback
 * if Phaser cannot start — the game is never a dead end.
 *
 * Interface kept for app.js / play.js (same as phaser-game.js):
 *   window.__rtPhaserBoot(), window.__rtPhaserSetEpisode(n),
 *   window.__rtPhaser { boot, setEpisode, game, ready, questStage, saveKey }
 * Test hooks: window.__rtEmulation { game, scene, districtId,
 *   spawnNpc(id), spawnWalker(), spawnCat(), doSnap(), npcCount() }. */

(function () {
  "use strict";

  var EPISODES = { "1": "chofu", "2": "yokosuka", "3": "tachikawa", "4": "tama" };
  var SAVE_KEY = "rising-together:v2";

  var wrap = document.getElementById("phaser-wrap");
  var container = document.getElementById("phaser-game");
  var statusEl = document.getElementById("phaser-status");
  var fallbackEl = document.getElementById("phaser-fallback");
  var logEl = document.getElementById("event-log");
  var booted = false;
  var booting = false;
  var game = null;
  var scene = null;
  var districtId = null;
  var currentEpisode = (document.body && document.body.getAttribute("data-episode")) || "1";
  var lastNotified = null;
  var doneCount = 0; // missions completed in the current district (this visit)

  function log(event, detail) {
    if (window.__rtLog) window.__rtLog.push({ t: new Date().toISOString(), event: "phaser_" + event, detail: detail || "" });
    if (logEl) { var li = document.createElement("li"); li.textContent = new Date().toISOString() + " — phaser_" + event + (detail ? " — " + detail : ""); logEl.appendChild(li); }
    if (window.console) console.log("[rising-together] phaser_" + event, detail || "");
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function showFallback(text) {
    if (fallbackEl) { fallbackEl.hidden = false; fallbackEl.textContent = text; }
    setStatus("The game did not start — the walkable street below still works.");
  }

  function districtName(id) {
    return { chofu: "Chofu", yokosuka: "Yokosuka", tachikawa: "Tachikawa", tama: "Tama" }[id] || id;
  }

  /* Load one district's data and boot (or re-boot) the game on it. */
  function loadDistrict(id, done) {
    if (typeof fetch === "undefined") {
      showFallback("This browser cannot load the district data. The walkable street below still works.");
      log("failed", "fetch unavailable — fallback shown");
      if (done) done(null);
      return;
    }
    fetch("data/" + id + ".json").then(function (r) {
      if (!r.ok) { throw new Error("HTTP " + r.status); }
      return r.json();
    }).then(function (d) {
      var errs = (typeof RT !== "undefined" && RT.validateDistrict) ? RT.validateDistrict(d) : ["engine not loaded"];
      if (errs.length) {
        showFallback("The " + districtName(id) + " district data did not validate: " + errs.join("; ") + ". The walkable street below still works.");
        log("failed", "district " + id + " invalid: " + errs.join("; "));
        if (done) done(null);
        return;
      }
      if (done) done(d);
    }).catch(function (err) {
      showFallback("Could not load the " + districtName(id) + " district (" + err.message + "). The walkable street below still works.");
      log("failed", "fetch data/" + id + ".json: " + err.message);
      if (done) done(null);
    });
  }

  function startGame(d) {
    if (typeof Phaser === "undefined" || typeof RT === "undefined") {
      showFallback("The game could not load in this browser (Phaser did not start). The walkable street below still works — nothing here is lost.");
      log("failed", "Phaser or engine undefined at load — fallback shown, CSS district still works");
      return;
    }
    try {
      game = RT.createGame(d, {
        parent: "phaser-game",
        onMissionDone: function (contact, dist) {
          doneCount += 1;
          lastNotified = doneCount;
          var label = contact.mission.title + " (Phaser, " + districtName(dist.id) + ")";
          setStatus(label + " — done. " + contact.mission.done);
          log("mission_done", label);
          if (typeof window.__rtFinishJob === "function") {
            try { window.__rtFinishJob(label); } catch (e) {}
          }
        },
        onSnap: function (dist) {
          setStatus("Snap the ball — the crowd rises! CHEERS in Chofu.");
          log("snap_cheers", "crowd rose at the snap, " + districtName(dist.id));
        },
        onEvent: function (event, detail) {
          log(event, detail || "");
        }
      });
      scene = null;
      districtId = d.id;
      doneCount = 0;
      lastNotified = 0;
      // The SceneManager adds the scene on the next frame, not in the
      // Game constructor — resolve it by polling, so the test hooks and
      // the status line never read a scene that is not there yet.
      var tries = 0;
      var resolveScene = function () {
        var s = null;
        try { s = game && game.scene && game.scene.scenes && game.scene.scenes[0]; } catch (e) {}
        if (s) { scene = s; }
        else if (tries < 25) { tries++; window.setTimeout(resolveScene, 200); }
      };
      resolveScene();
      var today = new Date();
      var job = (RT.dayJobFor ? RT.dayJobFor(d, today) : d.dayJobs[today.getDay()]);
      setStatus(d.name + " — Today: " + job + ". People pop in and out — tap one to say hello. Tap to walk, arrow keys / WASD to move.");
      log("ready", "Phaser 3.80.1 " + d.name + " district started (vendored, silent, no server)");
      window.setTimeout(function () {
        if (container && !container.querySelector("canvas")) {
          showFallback("The game did not start in this browser — no game canvas appeared. The walkable street below still works.");
          log("failed", "no canvas after boot watchdog");
        }
      }, 4000);
    } catch (e) {
      showFallback("The game could not start in this browser (" + (e && e.message ? e.message : "unknown error") + "). The walkable street below still works.");
      log("failed", e && e.message ? e.message : String(e));
    }
  }

  function boot() {
    if (booted || booting || !container) return;
    booting = true;
    loadDistrict(EPISODES[currentEpisode] || "chofu", function (d) {
      booting = false;
      if (!d) { return; }
      booted = true;
      startGame(d);
    });
  }

  var observed = false;
  function maybeBoot() {
    if (booted || booting || !wrap || wrap.hidden) return;
    if (typeof window.IntersectionObserver === "function" && !observed) {
      observed = true;
      var io = new window.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { boot(); io.disconnect(); }
        });
      }, { rootMargin: "200px" });
      io.observe(wrap);
      return;
    }
    boot();
  }

  /* Episode switch: destroy the old district's game and boot the new
     one. The wrap stays visible — the Phaser district IS the episode's
     place now, for all four episodes. */
  function setEpisode(n) {
    n = String(n);
    if (!EPISODES[n]) { return; }
    var changed = (n !== currentEpisode);
    currentEpisode = n;
    if (!booted && !booting) { maybeBoot(); return; }
    if (!changed) { return; }
    if (game) {
      try { game.destroy(true); } catch (e) { /* already gone */ }
      game = null;
      scene = null;
    }
    booted = false;
    booting = false;
    if (fallbackEl) { fallbackEl.hidden = true; }
    setStatus("Walking to " + districtName(EPISODES[n]) + "…");
    log("episode", "Phaser district switched to " + districtName(EPISODES[n]));
    loadDistrict(EPISODES[n], function (d) {
      if (!d) { return; }
      booted = true;
      startGame(d);
    });
  }

  window.__rtPhaserBoot = boot;
  window.__rtPhaserSetEpisode = setEpisode;
  window.__rtPhaser = {
    boot: boot,
    setEpisode: setEpisode,
    get game() { return game; },
    get ready() { return booted && !!game; },
    get questStage() { return lastNotified; },
    saveKey: SAVE_KEY
  };
  window.__rtEmulation = {
    get game() { return game; },
    get scene() { return scene; },
    get districtId() { return districtId; },
    spawnNpc: function (id) { return scene ? scene.spawnNpcById(id) : null; },
    spawnWalker: function () { return scene ? scene.spawnWalker() : null; },
    spawnCat: function () { return scene ? scene.spawnCat() : null; },
    doSnap: function () { if (scene) { scene.doSnap(); } },
    npcCount: function () { return scene ? scene.npcCount() : 0; }
  };

  if (!wrap) { log("no_container", "no #phaser-wrap in page — Phaser not started"); return; }
  setStatus("Chofu — walk the district. People pop in and out — tap one to say hello.");
  maybeBoot();
})();
