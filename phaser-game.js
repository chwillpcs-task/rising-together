/* Rising Together — PLAY mode: Phaser 3 Chofu district (2026-11-25).
 *
 * Phaser 3.80.1, vendored locally as phaser.min.js (no CDN at runtime).
 * Adapted from tools/phaser-district/game.js — same scene, same job
 * ("The Lost Ball": talk to Miki, find the ball, bring it back), same
 * localStorage save key (rising-together:v1). What changed for the live
 * app: the game boots lazily (only for Episode 1, Chofu, only when the
 * PLAY section is visible), it pauses when another episode is chosen,
 * it reports its quest stage to the page (status line + CustomEvent +
 * the app's event log), and completing the job marks the day's job done
 * in the stage above (window.__rtFinishJob, when the app exposes it).
 *
 * Painted art: the Chofu street painting (assets/visuals/web/chofu-street.jpg,
 * 2026-11-25 visual rebuild) is the district backdrop, loaded as a texture
 * behind the walkable player, Miki and the ball; the big ground/sky shapes
 * are translucent so the painting shows through, and the painted geometry
 * is the fallback if the picture never arrives. The figures themselves are
 * still painted in code. No photographs, no likeness, no real person's
 * voice or dialogue, no GTA/Sega art, characters, music or trademarks.
 * All people are fictional. Silent: no music, no audio. No server, no
 * Service Worker, no downloads.
 * If Phaser cannot load, the section says so honestly and the CSS
 * walkable street below still works — the game is never a dead end. */

(function () {
  "use strict";

  var SAVE_KEY = "rising-together:v1";
  var WORLD_W = 390;
  var WORLD_H = 844;
  var PLAYER_SPEED = 150;

  var wrap = document.getElementById("phaser-wrap");
  var container = document.getElementById("phaser-game");
  var statusEl = document.getElementById("phaser-status");
  var fallbackEl = document.getElementById("phaser-fallback");
  var logEl = document.getElementById("event-log");
  var booted = false;
  var game = null;
  var currentEpisode = (document.body && document.body.getAttribute("data-episode")) || "1";
  var lastNotifiedStage = null;

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

  /* Called whenever the quest stage changes (centrally, from
     refreshQuestUI): mirrors the objective to the page, logs it, and on
     completion marks the day's job done in the stage above. */
  function notifyStage(stage, objective) {
    if (stage === lastNotifiedStage) return;
    lastNotifiedStage = stage;
    setStatus("The Lost Ball — " + objective);
    log("quest_stage_" + stage, objective);
    try {
      window.dispatchEvent(new window.CustomEvent("rt-phaser-quest", { detail: { stage: stage, objective: objective } }));
    } catch (e) { /* jsdom / old browsers: the status line above is the record */ }
    if (stage === 3 && typeof window.__rtFinishJob === "function") {
      try { window.__rtFinishJob("The Lost Ball (Phaser, Chofu)"); } catch (e) {}
    }
  }

  function loadSave() {
    try {
      var raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) { return { version: 1, questStage: 0 }; }
      var parsed = JSON.parse(raw);
      return {
        version: 1,
        questStage: (typeof parsed.questStage === "number") ? parsed.questStage : 0
      };
    } catch (e) {
      return { version: 1, questStage: 0 };
    }
  }

  function writeSave(state) {
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify({
        version: 1,
        questStage: state.questStage
      }));
    } catch (e) {
      /* Storage unavailable (private mode, quota, etc.) — game still plays. */
    }
  }

  /* ---------- painted figures (silhouettes, from behind, no faces) ---------- */

  function makePlayerFigure(scene) {
    var c = scene.add.container(0, 0);
    var g = scene.add.graphics();
    // legs
    g.fillStyle(0x2b3a55, 1);
    g.fillRoundedRect(-8, 2, 6, 16, 2);
    g.fillRoundedRect(2, 2, 6, 16, 2);
    // body (jacket, seen from behind) + backpack
    g.fillStyle(0x22304a, 1);
    g.fillRoundedRect(-11, -18, 22, 22, 6);
    g.fillStyle(0x3d5a80, 1);
    g.fillRoundedRect(-7, -14, 14, 14, 4);
    // arms
    g.fillStyle(0x22304a, 1);
    g.fillRoundedRect(-15, -16, 5, 18, 2);
    g.fillRoundedRect(10, -16, 5, 18, 2);
    // head: hair only, from behind; small cap
    g.fillStyle(0x1c1a17, 1);
    g.fillCircle(0, -26, 9);
    g.fillStyle(0xd94f3d, 1);
    g.fillRoundedRect(-9, -33, 18, 5, 2);
    c.add(g);
    return c;
  }

  function makeMikiFigure(scene) {
    var c = scene.add.container(0, 0);
    var g = scene.add.graphics();
    // legs
    g.fillStyle(0x37474f, 1);
    g.fillRoundedRect(-8, 2, 6, 16, 2);
    g.fillRoundedRect(2, 2, 6, 16, 2);
    // body (teal coat, seen from behind)
    g.fillStyle(0x0f766e, 1);
    g.fillRoundedRect(-11, -18, 22, 22, 6);
    // scarf
    g.fillStyle(0xf59e0b, 1);
    g.fillRoundedRect(-9, -18, 18, 5, 2);
    // arms
    g.fillStyle(0x0f766e, 1);
    g.fillRoundedRect(-15, -16, 5, 18, 2);
    g.fillRoundedRect(10, -16, 5, 18, 2);
    // head: hair only, from behind, with a bun
    g.fillStyle(0x2d1f16, 1);
    g.fillCircle(0, -26, 9);
    g.fillCircle(0, -36, 4);
    c.add(g);
    return c;
  }

  /* ---------- scene ---------- */
  /* Phaser must exist before the scene class is defined: the prototype
     chain touches Phaser.Scene at load time, so a missing Phaser (script
     failed, no canvas in this environment) must bail out here, before
     any Phaser reference — with the honest fallback, not a crash. */
  if (typeof Phaser === "undefined") {
    showFallback("The game could not load in this browser (Phaser did not start). The walkable street below still works — nothing here is lost.");
    log("failed", "Phaser undefined at load — fallback shown, CSS district still works");
    window.__rtPhaserBoot = function () { showFallback("The game could not load in this browser (Phaser did not start). The walkable street below still works — nothing here is lost."); };
    window.__rtPhaserSetEpisode = function (n) {
      currentEpisode = String(n);
      if (wrap) wrap.hidden = (currentEpisode !== "1");
    };
    window.__rtPhaser = {
      boot: window.__rtPhaserBoot,
      setEpisode: window.__rtPhaserSetEpisode,
      get game() { return null; },
      get ready() { return false; },
      get questStage() { return lastNotifiedStage; },
      saveKey: SAVE_KEY
    };
    if (wrap) wrap.hidden = (currentEpisode !== "1");
    return;
  }

  function ChofuDistrict() {
    Phaser.Scene.call(this, { key: "ChofuDistrict" });
  }
  ChofuDistrict.prototype = Object.create(Phaser.Scene.prototype);
  ChofuDistrict.prototype.constructor = ChofuDistrict;

  ChofuDistrict.prototype.create = function () {
    var self = this;
    this.save = loadSave();
    this.questStage = this.save.questStage;
    this.walkTarget = null;
    this.dialogueOpen = false;
    this.dialogueLines = [];
    this.dialogueIndex = 0;
    this.dialogueAfter = null;

    /* --- painted district, south (bottom) to north (top) --- */

    /* Painted Chofu street as the backdrop (2026-11-25 visual rebuild).
       It loads asynchronously, outside Phaser's loader, so a missing or
       slow picture can never block the boot or the quest: the game starts
       on the painted geometry below, and the picture is placed behind
       everything (depth -10) the moment it arrives. If it never arrives,
       the geometry is the scene — nothing is lost. */
    (function loadStreetBackdrop() {
      function place() {
        try {
          if (!self.textures.exists("chofu-street")) return;
          var src = self.textures.get("chofu-street").getSourceImage();
          var w = (src && src.width) || 1280, h = (src && src.height) || 853;
          var s = Math.max(WORLD_W / w, WORLD_H / h);
          self.add.image(WORLD_W / 2, WORLD_H / 2, "chofu-street").setScale(s).setDepth(-10);
        } catch (e) { /* backdrop stays off; geometry is the fallback */ }
      }
      if (self.textures.exists("chofu-street")) { place(); return; }
      if (typeof Image === "undefined") return;
      var img = new Image();
      img.onload = function () {
        try { self.textures.addImage("chofu-street", img); place(); } catch (e) { /* backdrop stays off */ }
      };
      img.onerror = function () { /* backdrop stays off; geometry is the fallback */ };
      img.src = "assets/visuals/web/chofu-street.jpg";
    })();

    // sky (translucent — the painting's sky shows through when it arrives)
    this.add.rectangle(0, 0, WORLD_W, 160, 0xbfd9e8).setOrigin(0, 0).setAlpha(0.35);
    // sun
    this.add.circle(330, 42, 20, 0xffe08a);
    this.add.circle(330, 42, 13, 0xffeeb0);

    // Ajinomoto Stadium (present day), north end
    var st = this.add.graphics();
    st.fillStyle(0x8fa3b8, 1);
    st.fillRoundedRect(45, 62, 300, 78, 10);          // bowl
    st.fillStyle(0x6b7f95, 1);
    st.fillRoundedRect(45, 62, 300, 16, { tl: 10, tr: 10, bl: 0, br: 0 }); // rim
    st.fillStyle(0xe8eef2, 1);
    for (var i = 0; i < 9; i++) {                       // stand windows
      st.fillRoundedRect(62 + i * 31, 92, 18, 22, 3);
    }
    st.fillStyle(0x3f6d4e, 1);
    st.fillRoundedRect(95, 118, 200, 22, 4);           // pitch
    st.lineStyle(2, 0xffffff, 0.9);
    st.strokeCircle(195, 129, 8);
    this.add.text(195, 46, "AJINOMOTO STADIUM", {
      fontSize: "13px", fontStyle: "bold", color: "#33506b"
    }).setOrigin(0.5, 0.5);
    this.add.text(195, 152, "present day", {
      fontSize: "10px", color: "#5b7186"
    }).setOrigin(0.5, 0.5);

    // ground (translucent — the painting's street shows through)
    this.add.rectangle(0, 160, WORLD_W, WORLD_H - 160, 0x9db98a).setOrigin(0, 0).setAlpha(0.45);

    // houses (fade as you walk toward the stadium)
    this.houseRects = [
      { x: 18,  y: 178, w: 96, h: 74 },
      { x: 147, y: 178, w: 96, h: 74 },
      { x: 276, y: 178, w: 96, h: 74 }
    ];
    this.houseGroup = this.add.container(0, 0);
    this.houseRects.forEach(function (r) {
      var g = self.add.graphics();
      g.fillStyle(0xf3e3c2, 1);                          // walls
      g.fillRoundedRect(r.x, r.y + 22, r.w, r.h - 22, 3);
      g.fillStyle(0xb8543f, 1);                          // roof
      g.fillTriangle(r.x - 6, r.y + 26, r.x + r.w / 2, r.y, r.x + r.w + 6, r.y + 26);
      g.fillStyle(0x7fa8c9, 1);                          // windows
      g.fillRoundedRect(r.x + 12, r.y + 38, 18, 16, 2);
      g.fillRoundedRect(r.x + r.w - 30, r.y + 38, 18, 16, 2);
      g.fillStyle(0x6b4a2f, 1);                          // door
      g.fillRoundedRect(r.x + r.w / 2 - 9, r.y + 40, 18, 34, 2);
      self.houseGroup.add(g);
    });
    this.add.text(195, 262, "houses of the district", {
      fontSize: "10px", color: "#4c6440"
    }).setOrigin(0.5, 0.5);

    // street (translucent — the painting's road shows through)
    this.add.rectangle(0, 282, WORLD_W, 62, 0x8d8d94).setOrigin(0, 0).setAlpha(0.6);
    this.add.rectangle(0, 282, WORLD_W, 4, 0xffffff).setOrigin(0, 0);
    this.add.rectangle(0, 340, WORLD_W, 4, 0xffffff).setOrigin(0, 0);
    for (var d = 0; d < 7; d++) {
      this.add.rectangle(30 + d * 55, 311, 26, 4, 0xffe08a).setOrigin(0.5, 0.5);
    }

    // field (translucent — the painting shows through)
    var f = this.add.graphics();
    f.fillStyle(0x5da24a, 0.55);
    f.fillRoundedRect(20, 372, 350, 300, 8);
    f.lineStyle(3, 0xffffff, 0.85);
    f.strokeRect(20, 372, 350, 300);
    f.strokeCircle(195, 522, 42);
    f.lineBetween(20, 522, 370, 522);
    f.strokeRect(120, 372, 150, 48);
    f.strokeRect(120, 624, 150, 48);
    this.add.text(195, 700, "the field", {
      fontSize: "11px", color: "#e8f3e2"
    }).setOrigin(0.5, 0.5);

    // footpath at the south edge (translucent — the painting shows through)
    this.add.rectangle(0, 726, WORLD_W, WORLD_H - 726, 0xcbb89a).setOrigin(0, 0).setAlpha(0.6);
    this.add.text(195, 742, "Chofu — a district to walk", {
      fontSize: "11px", color: "#6b5a3e"
    }).setOrigin(0.5, 0.5);

    /* --- people --- */

    // Miki, a fictional neighbour, by the field gate
    this.miki = makeMikiFigure(this);
    this.miki.setPosition(78, 420);
    this.add.text(78, 448, "Miki", {
      fontSize: "12px", fontStyle: "bold", color: "#123f3a",
      backgroundColor: "rgba(255,255,255,0.75)", padding: { x: 4, y: 1 }
    }).setOrigin(0.5, 0.5);
    this.mikiBubble = this.add.text(78, 384, "!", {
      fontSize: "20px", fontStyle: "bold", color: "#b45309",
      backgroundColor: "#fef3c7", padding: { x: 6, y: 1 }
    }).setOrigin(0.5, 0.5);
    this.miki.setInteractive(
      new Phaser.Geom.Rectangle(-20, -42, 40, 64), Phaser.Geom.Rectangle.Contains
    );
    this.miki.on("pointerdown", function () { self.tryTalkToMiki(); });

    // the player, silhouette from behind
    this.player = makePlayerFigure(this);
    this.player.setPosition(195, 790);
    this.playerName = this.add.text(195, 818, "you", {
      fontSize: "11px", color: "#22304a",
      backgroundColor: "rgba(255,255,255,0.7)", padding: { x: 4, y: 1 }
    }).setOrigin(0.5, 0.5);

    // the lost ball (hidden until Miki asks for help)
    this.ball = this.add.container(292, 566);
    var bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.fillCircle(0, 0, 11);
    bg.fillStyle(0x334155, 1);
    bg.fillCircle(0, 0, 4);
    bg.fillCircle(-6, -5, 2);
    bg.fillCircle(6, -5, 2);
    bg.fillCircle(-6, 5, 2);
    bg.fillCircle(6, 5, 2);
    this.ball.add(bg);
    this.ball.setVisible(this.questStage === 1);
    this.ball.setInteractive(
      new Phaser.Geom.Circle(0, 0, 22), Phaser.Geom.Circle.Contains
    );
    this.ball.on("pointerdown", function () {
      self.walkTarget = { x: 292, y: 566 };
    });
    if (this.questStage === 1) {
      this.tweens.add({ targets: this.ball, scale: 1.18, duration: 500, yoyo: true, repeat: -1 });
    }

    /* --- HUD: trust heart, district map, objective --- */

    this.add.rectangle(0, 0, WORLD_W, 30, 0x000000, 0.25).setOrigin(0, 0);
    this.trustLabel = this.add.text(10, 8, "Trust", {
      fontSize: "13px", fontStyle: "bold", color: "#ffffff"
    });
    this.trustHeart = this.add.text(52, 6, "♥", { fontSize: "17px", color: "#9aa0a6" });
    this.trustBarBg = this.add.rectangle(76, 15, 62, 8, 0xffffff, 0.35).setOrigin(0, 0.5);
    this.trustBar = this.add.rectangle(76, 15, 0, 8, 0xe5484d).setOrigin(0, 0.5);

    // district map (lights up when the job is done)
    this.mapPanel = this.add.rectangle(WORLD_W - 96, 4, 88, 58, 0x000000, 0.45).setOrigin(0, 0);
    this.mapTitle = this.add.text(WORLD_W - 92, 7, "DISTRICT MAP", {
      fontSize: "8px", fontStyle: "bold", color: "#ffffff"
    });
    this.mapGfx = this.add.graphics();
    this.mapPlayerDot = this.add.circle(0, 0, 3, 0xffffff);
    this.drawMap();

    this.objective = this.add.text(10, WORLD_H - 118, "", {
      fontSize: "12px", color: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.45)", padding: { x: 6, y: 3 }
    });

    this.hint = this.add.text(195, WORLD_H - 96, "Tap to walk  •  Arrow keys / WASD to move  •  Tap Miki to talk", {
      fontSize: "10px", color: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.4)", padding: { x: 6, y: 3 }
    }).setOrigin(0.5, 0.5);

    // reset (for testing)
    this.resetBtn = this.add.text(WORLD_W - 10, WORLD_H - 96, "↺ reset", {
      fontSize: "10px", color: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.5)", padding: { x: 6, y: 3 }
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    this.resetBtn.on("pointerdown", function () {
      self.questStage = 0;
      self.save.questStage = 0;
      writeSave(self.save);
      self.ball.setVisible(false);
      self.refreshQuestUI();
      self.showDialogue([{ who: "Miki", text: "Progress reset. The district is as it was." }]);
    });

    // tap-to-walk anywhere on the ground
    this.input.on("pointerdown", function (pointer) {
      if (self.dialogueOpen) { return; }
      self.walkTarget = { x: pointer.x, y: pointer.y };
    });

    // keyboard: arrows + WASD + E / Space to talk
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D,E,SPACE");

    this.refreshQuestUI();
  };

  ChofuDistrict.prototype.drawMap = function () {
    var lit = this.questStage >= 3;
    var g = this.mapGfx;
    g.clear();
    // panel glow when lit
    this.mapPanel.setFillStyle(lit ? 0x7c5a10 : 0x000000, lit ? 0.75 : 0.45);
    this.mapTitle.setText(lit ? "DISTRICT MAP  ✦ lit" : "DISTRICT MAP");
    // stadium
    g.fillStyle(lit ? 0xfbbf24 : 0x8fa3b8, 1);
    g.fillRect(306, 10, 68, 8);
    // houses
    g.fillStyle(lit ? 0xfbbf24 : 0xf3e3c2, 1);
    g.fillRect(308, 22, 18, 4);
    g.fillRect(330, 22, 18, 4);
    g.fillRect(352, 22, 18, 4);
    // street
    g.fillStyle(0x9aa0a6, 1);
    g.fillRect(306, 30, 68, 3);
    // field
    g.fillStyle(lit ? 0x4ade80 : 0x5da24a, 1);
    g.fillRect(306, 36, 68, 20);
  };

  ChofuDistrict.prototype.refreshQuestUI = function () {
    var stage = this.questStage;
    var objectives = [
      "Explore the district — say hello to Miki",
      "Find the lost ball on the field",
      "Bring the ball back to Miki",
      "The district lights up — thank you!"
    ];
    this.objective.setText(objectives[stage]);
    this.trustHeart.setColor(stage >= 3 ? "#e5484d" : "#9aa0a6");
    this.trustBar.width = (stage / 3) * 62;
    this.mikiBubble.setVisible(stage === 0 || stage === 2);
    this.mikiBubble.setText(stage === 0 ? "!" : "♥");
    this.ball.setVisible(stage === 1);
    this.drawMap();
    notifyStage(stage, objectives[stage]);
  };

  ChofuDistrict.prototype.showDialogue = function (lines, after) {
    var self = this;
    this.dialogueLines = lines;
    this.dialogueIndex = 0;
    this.dialogueAfter = after || null;
    this.dialogueOpen = true;
    this.walkTarget = null;

    if (!this.dialogueBox) {
      this.dialogueBox = this.add.container(0, 0).setDepth(10);
      var panel = this.add.rectangle(0, 0, WORLD_W - 20, 96, 0xffffff, 0.97)
        .setOrigin(0, 0).setStrokeStyle(2, 0x22304a);
      var name = this.add.text(14, 10, "", { fontSize: "12px", fontStyle: "bold", color: "#0f766e" });
      var body = this.add.text(14, 30, "", {
        fontSize: "14px", color: "#1f2937", wordWrap: { width: WORLD_W - 48 }
      });
      var next = this.add.text(WORLD_W - 34, 74, "tap ▸", { fontSize: "11px", color: "#6b7280" });
      this.dialogueBox.add([panel, name, body, next]);
      this.dialogueBox.setPosition(10, WORLD_H - 106);
      this.dialogueName = name;
      this.dialogueBody = body;
      this.dialogueBox.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, WORLD_W - 20, 96), Phaser.Geom.Rectangle.Contains
      );
      this.dialogueBox.on("pointerdown", function () { self.advanceDialogue(); });
    }
    this.dialogueBox.setVisible(true);
    this.renderDialogueLine();
  };

  ChofuDistrict.prototype.renderDialogueLine = function () {
    var line = this.dialogueLines[this.dialogueIndex];
    this.dialogueName.setText(line.who);
    this.dialogueBody.setText(line.text);
  };

  ChofuDistrict.prototype.advanceDialogue = function () {
    this.dialogueIndex += 1;
    if (this.dialogueIndex < this.dialogueLines.length) {
      this.renderDialogueLine();
      return;
    }
    this.dialogueBox.setVisible(false);
    this.dialogueOpen = false;
    var after = this.dialogueAfter;
    this.dialogueAfter = null;
    if (after) { after(); }
  };

  ChofuDistrict.prototype.nearMiki = function () {
    return Phaser.Math.Distance.Between(
      this.player.x, this.player.y, this.miki.x, this.miki.y
    ) < 80;
  };

  ChofuDistrict.prototype.tryTalkToMiki = function () {
    if (this.dialogueOpen) { return; }
    if (!this.nearMiki()) {
      this.walkTarget = { x: this.miki.x + 30, y: this.miki.y + 46 };
      this.pendingTalk = true;
      return;
    }
    this.talkToMiki();
  };

  ChofuDistrict.prototype.talkToMiki = function () {
    var self = this;
    if (this.questStage === 0) {
      this.showDialogue([
        { who: "Miki", text: "Hello! I’m Miki. I live just up the street, by the field." },
        { who: "Miki", text: "My little brother’s ball rolled away during practice. It’s somewhere on the field — could you find it for me?" },
        { who: "You", text: "Of course. I’ll look on the field." }
      ], function () {
        self.questStage = 1;
        self.save.questStage = 1;
        writeSave(self.save);
        self.refreshQuestUI();
        self.tweens.add({ targets: self.ball, scale: 1.18, duration: 500, yoyo: true, repeat: -1 });
      });
    } else if (this.questStage === 1) {
      this.showDialogue([
        { who: "Miki", text: "The ball is white, somewhere on the green. Tap it when you see it!" }
      ]);
    } else if (this.questStage === 2) {
      this.showDialogue([
        { who: "Miki", text: "You found it! Thank you — he’ll be so happy at practice tomorrow." },
        { who: "Miki", text: "You’re welcome here any time. This district looks after its own." }
      ], function () {
        self.questStage = 3;
        self.save.questStage = 3;
        writeSave(self.save);
        self.refreshQuestUI();
      });
    } else {
      this.showDialogue([
        { who: "Miki", text: "The field lights look brighter tonight, don’t they? That’s what a neighbour does." },
        { who: "Miki", text: "Come by again — there’s always a game, and always a place for you." }
      ]);
    }
  };

  ChofuDistrict.prototype.update = function (time, delta) {
    var dt = Math.min(delta / 1000, 0.05);
    var px = this.player.x;
    var py = this.player.y;
    var vx = 0;
    var vy = 0;

    if (!this.dialogueOpen) {
      var left = this.cursors.left.isDown || this.keys.A.isDown;
      var right = this.cursors.right.isDown || this.keys.D.isDown;
      var up = this.cursors.up.isDown || this.keys.W.isDown;
      var down = this.cursors.down.isDown || this.keys.S.isDown;

      if (left || right || up || down) {
        this.walkTarget = null;
        vx = (right ? 1 : 0) - (left ? 1 : 0);
        vy = (down ? 1 : 0) - (up ? 1 : 0);
        var len = Math.hypot(vx, vy) || 1;
        vx = vx / len * PLAYER_SPEED;
        vy = vy / len * PLAYER_SPEED;
      } else if (this.walkTarget) {
        var dx = this.walkTarget.x - px;
        var dy = this.walkTarget.y - py;
        var dist = Math.hypot(dx, dy);
        if (dist < 6) {
          this.walkTarget = null;
        } else {
          vx = dx / dist * PLAYER_SPEED;
          vy = dy / dist * PLAYER_SPEED;
        }
      }

      // E / Space to talk when near Miki
      if (Phaser.Input.Keyboard.JustDown(this.keys.E) ||
          Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
        if (this.nearMiki()) { this.talkToMiki(); }
      }
    }

    // move with simple collision (houses + stadium wall + world bounds)
    var nx = Phaser.Math.Clamp(px + vx * dt, 12, WORLD_W - 12);
    var ny = Phaser.Math.Clamp(py + vy * dt, 168, WORLD_H - 18);
    if (!this.hitsHouse(nx, py)) { px = nx; }
    if (!this.hitsHouse(px, ny)) { py = ny; }
    this.player.setPosition(px, py);
    this.playerName.setPosition(px, py + 28);

    // houses fade as you walk toward Ajinomoto Stadium
    var t = Phaser.Math.Clamp((py - 170) / (790 - 170), 0, 1);
    this.houseGroup.setAlpha(0.25 + 0.75 * t);

    // arrived at Miki after tapping her from afar
    if (this.pendingTalk && this.nearMiki() && !this.dialogueOpen) {
      this.pendingTalk = false;
      this.walkTarget = null;
      this.talkToMiki();
    }

    // arrived at the ball: pick it up
    if (this.questStage === 1 && this.ball.visible) {
      var bd = Phaser.Math.Distance.Between(px, py, this.ball.x, this.ball.y);
      if (bd < 42) {
        this.questStage = 2;
        this.save.questStage = 2;
        writeSave(this.save);
        this.ball.setVisible(false);
        this.tweens.killTweensOf(this.ball);
        this.refreshQuestUI();
        this.showDialogue([
          { who: "You", text: "Found it — the white ball, right by the centre circle." },
          { who: "You", text: "Better take it back to Miki." }
        ]);
      }
    }

    // district-map player dot
    this.mapPlayerDot.setPosition(
      WORLD_W - 96 + 6 + (px / WORLD_W) * 76,
      4 + 4 + (py / WORLD_H) * 50
    );
  };

  ChofuDistrict.prototype.hitsHouse = function (x, y) {
    // player is a point at the feet; houses block with a small margin
    for (var i = 0; i < this.houseRects.length; i++) {
      var r = this.houseRects[i];
      if (x > r.x - 8 && x < r.x + r.w + 8 &&
          y > r.y - 6 && y < r.y + r.h + 6) {
        return true;
      }
    }
    return false;
  };

  /* ---------- boot: lazy, Chofu only, honest fallback ---------- */

  function boot() {
    if (booted || !container) return;
    booted = true;
    if (typeof Phaser === "undefined") {
      showFallback("The game could not load in this browser (Phaser did not start). The walkable street below still works — nothing here is lost.");
      log("failed", "Phaser undefined — fallback shown, CSS district still works");
      return;
    }
    try {
      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: "phaser-game",
        width: WORLD_W,
        height: WORLD_H,
        backgroundColor: "#9db98a",
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: ChofuDistrict
      });
      log("ready", "Phaser 3.80.1 Chofu district started (vendored, silent, no server)");
      /* Watchdog: Phaser boots asynchronously, so a boot failure throws
         outside this try/catch. If no canvas appears, say so honestly
         instead of leaving a blank box. */
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

  var observed = false;
  function maybeBoot() {
    if (booted || currentEpisode !== "1" || !wrap || wrap.hidden) return;
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

  function setEpisode(n) {
    currentEpisode = String(n);
    if (wrap) wrap.hidden = (currentEpisode !== "1");
    if (!game) { maybeBoot(); return; }
    try {
      if (currentEpisode === "1") {
        game.scene.resume("ChofuDistrict");
        maybeBoot();
      } else {
        game.scene.pause("ChofuDistrict");
      }
    } catch (e) { /* scene not started yet — nothing to pause */ }
    log("episode", "Phaser district " + (currentEpisode === "1" ? "shown (Chofu)" : "hidden — episode " + currentEpisode + " uses the street below"));
  }

  window.__rtPhaserBoot = boot;
  window.__rtPhaserSetEpisode = setEpisode;
  window.__rtPhaser = {
    boot: boot,
    setEpisode: setEpisode,
    get game() { return game; },
    get ready() { return booted && !!game; },
    get questStage() { return lastNotifiedStage; },
    saveKey: SAVE_KEY
  };

  if (!wrap) { log("no_container", "no #phaser-wrap in page — Phaser not started"); return; }
  wrap.hidden = (currentEpisode !== "1");
  setStatus("The Lost Ball — walk the Chofu district, talk to Miki, find the ball, bring it back.");
  maybeBoot();
})();
