/* Rising Together — Locker room (2026-11-25).
   Episode 1, Chofu: the championship game as an experience.
   Carl, 2026-11-25: locker room, names on their backs, CHOFU above their
   heads, zoom to the line of scrimmage, ball snaps, cheers.
   The visitor travels it: scroll or tap to move locker room → tunnel →
   line of scrimmage; tap to snap the ball; the play moves; the crowd rises.
   No faces, no likeness, no voice, no dialogue for any real person — the
   three players are shown from behind, names on jersey backs only.
   No music, no audio. Cheers are visual. Facts live behind "About this
   moment" only. Self-contained: no LIFF, no server. */
(function () {
  "use strict";
  var room = document.getElementById("locker-room");
  if (!room) return;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var states = ["locker", "tunnel", "line", "play", "cheers"];
  var stepText = {
    locker: "Before the game. Quiet. Three backs, names on their jerseys, CHOFU above their heads.",
    tunnel: "The door opens. Walk the tunnel toward the light.",
    line: "The line of scrimmage. The huddle breaks. Zoom in close.",
    play: "Ball snaps. The play moves.",
    cheers: "Cheers. The crowd rises."
  };
  var stepEl = document.getElementById("lk-step");
  var logEl = document.getElementById("event-log");
  function log(event, detail) {
    if (window.__rtLog) window.__rtLog.push({ t: new Date().toISOString(), event: "locker_" + event, detail: detail || "" });
    if (logEl) { var li = document.createElement("li"); li.textContent = new Date().toISOString() + " — locker_" + event + (detail ? " — " + detail : ""); logEl.appendChild(li); }
  }
  // One action per beat: locker → Open the door; tunnel → Walk the tunnel;
  // line → Snap the ball; play → cheers follow on their own; cheers → replay.
  var beatButton = { locker: "lk-go-locker", tunnel: "lk-go-tunnel", line: "lk-go-play", play: "lk-go-cheers", cheers: null };
  function showButtons(state) {
    ["lk-go-locker", "lk-go-tunnel", "lk-go-play", "lk-go-cheers"].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.hidden = (beatButton[state] !== id);
    });
  }
  function setState(state) {
    room.setAttribute("data-state", state);
    room.classList.remove("lk-walking");
    if (stepEl) stepEl.textContent = stepText[state] || "";
    showButtons(state);
    if (state === "tunnel") {
      // The team walks toward the light while you are in the tunnel.
      setTimeout(function () { room.classList.add("lk-walking"); }, 60);
    }
    if (state === "play" && !reduced) {
      setTimeout(function () { if (room.getAttribute("data-state") === "play") setState("cheers"); }, 1600);
    }
    if (state === "play" && reduced) setState("cheers");
    log("state", state);
  }
  function next() {
    var cur = room.getAttribute("data-state") || "locker";
    var i = states.indexOf(cur);
    if (i < 0) i = 0;
    if (cur === "play") { setState("cheers"); return; }
    if (cur === "cheers") return;
    setState(states[Math.min(i + 1, states.length - 1)]);
  }
  // Buttons: one action per beat.
  ["locker", "tunnel", "line"].forEach(function (s) {
    var b = document.getElementById("lk-go-" + s);
    if (b) b.addEventListener("click", function () { next(); });
  });
  var snap = document.getElementById("lk-go-play");
  if (snap) snap.addEventListener("click", function () { setState("play"); });
  var cheer = document.getElementById("lk-go-cheers");
  if (cheer) cheer.addEventListener("click", function () { setState("cheers"); });
  var replay = document.getElementById("lk-replay");
  if (replay) replay.addEventListener("click", function () { setState("locker"); });
  var walkOn = document.getElementById("lk-walk-on");
  if (walkOn) walkOn.addEventListener("click", function () {
    var stage = document.getElementById("stage");
    if (stage && stage.scrollIntoView) stage.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    log("walk_on", "locker room → field stage");
  });
  // Scroll / drag to travel: a wheel or swipe over the stage advances one beat.
  var stageEl = room.querySelector(".lk-stage");
  var lastAdvance = 0;
  function advanceGuard() {
    var now = Date.now();
    if (now - lastAdvance < 1200) return false;
    lastAdvance = now;
    return true;
  }
  if (stageEl) {
    stageEl.addEventListener("wheel", function () { if (advanceGuard()) next(); }, { passive: true });
    var touchY = null;
    stageEl.addEventListener("touchstart", function (e) { touchY = e.touches[0].clientY; }, { passive: true });
    stageEl.addEventListener("touchend", function (e) {
      if (touchY === null) return;
      var dy = touchY - e.changedTouches[0].clientY;
      touchY = null;
      if (Math.abs(dy) > 40 && advanceGuard()) next();
    }, { passive: true });
    stageEl.addEventListener("click", function (e) {
      if (e.target.closest("button")) return;
      if (advanceGuard()) next();
    });
  }
  // Episode switching: the locker room is the Chofu opening — hide it on
  // other episodes, show it again on Episode 1.
  document.querySelectorAll(".episode-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      room.hidden = (btn.getAttribute("data-episode") !== "1");
    });
  });
  setState("locker");
  log("ready", "locker room loaded — Chofu championship game, imagined");
})();
