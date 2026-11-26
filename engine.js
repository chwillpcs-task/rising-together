/* Rising Together — data-driven district / mission / calendar engine
 * Phaser 3.80.1 (vendored locally, no CDN at runtime). LIFF-safe:
 * no Service Worker, no server, no WASM, no audio, silent by design.
 *
 * Episodes are DATA, not code: a district JSON file describes the
 * painted place, its fictional contacts, their 2-3 step substory
 * missions, look-closely details, a side-street play moment, the
 * daily job / calendar, and the 2029 text question. This file renders
 * ANY district that validates against RT.validateDistrict().
 *
 * Constraints kept in every district this engine renders:
 * - Painted / reconstructed only. No photographs. No likeness, voice
 *   or dialogue for any real person — every contact is fictional.
 * - No music, no audio. No GTA/Sega art, characters, music or
 *   trademarks. No outside contract, permission or partnership claimed.
 * - No 2029 immersive scene: 2029 is text only (district.future2029).
 * - Register mark is "Imagined, to be witnessed and experienced by everyone"
 *   (the page footer in index.html), persistent.
 * - Progress is kept on this device only (localStorage, versioned
 *   key rising-together:v2, try/catch, merged with defaults).
 *
 * Emulation (2026-11-26, Carl's clarification): the district must FEEL
 * like a Sega / GTA place at first glance — a dense street, neon shop
 * signs in our own words (no trademarks), lit windows, lamps, people
 * popping in and out — without copying any art, character, music or
 * trademark from Sega or GTA. Steal the feeling, never the picture.
 * - `paint.signs`: neon-style shop signs (generic words only).
 * - `npcs`: fictional people who pop in, walk a route, pause (wave /
 *   sit / open a shutter / stand), then walk off and disappear.
 *   Ambient walkers cross the street; a cat trots across sometimes.
 * - `crowd` (Chofu only): a small stand of plain figures beside the
 *   field who rise and cheer when the visitor snaps the ball. The
 *   figures carry no numbers and no names — only WILLIAMS 32 is on the
 *   Hosho record, and it is not used here.
 *
 * Pure logic (validation, calendar, mission machine) is exported for
 * Node testing: in Node, require('./engine.js') gives
 * { validateDistrict, dayJobFor, dailyContactFor, advanceMission, ... }.
 * In the browser it attaches as window.RT and createGame() boots Phaser.
 */

(function (root) {
  'use strict';

  var SAVE_KEY = 'rising-together:v2';
  var WORLD_W = 390;
  var WORLD_H = 844;
  var PLAYER_SPEED = 150;
  var STEP_KINDS = ['talk', 'tap', 'go'];

  /* ---------- pure logic: validation ---------- */

  function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function isNonEmptyStr(v) { return typeof v === 'string' && v.trim().length > 0; }
  function inWorld(x, y) { return typeof x === 'number' && typeof y === 'number' && x >= 0 && x <= WORLD_W && y >= 0 && y <= WORLD_H; }

  // Returns an array of error strings; empty array = valid.
  function validateDistrict(d) {
    var errs = [];
    if (!isObj(d)) { return ['district must be an object']; }
    if (!isNonEmptyStr(d.id)) { errs.push('id: required, non-empty string'); }
    if (!isNonEmptyStr(d.name)) { errs.push('name: required, non-empty string'); }
    if (!isNonEmptyStr(d.subtitle)) { errs.push('subtitle: required, non-empty string'); }
    if (!isObj(d.paint)) { errs.push('paint: required object'); }
    else {
      ['sky', 'ground', 'street'].forEach(function (k) {
        if (!isNonEmptyStr(d.paint[k])) { errs.push('paint.' + k + ': required colour string'); }
      });
      if (!isNonEmptyStr(d.paint.landmark)) { errs.push('paint.landmark: required, one of stadium|harbour|park|meadow'); }
      else if (['stadium', 'harbour', 'park', 'meadow'].indexOf(d.paint.landmark) === -1) {
        errs.push('paint.landmark: unknown type "' + d.paint.landmark + '"');
      }
      if (!isNonEmptyStr(d.paint.landmarkLabel)) { errs.push('paint.landmarkLabel: required string'); }
      if (!Array.isArray(d.paint.buildings)) { errs.push('paint.buildings: required array'); }
      else d.paint.buildings.forEach(function (b, i) {
        if (!isObj(b) || !inWorld(b.x, b.y) || typeof b.w !== 'number' || typeof b.h !== 'number') {
          errs.push('paint.buildings[' + i + ']: needs x,y inside the world and numeric w,h');
        }
      });
    }
    if (!Array.isArray(d.dayJobs) || d.dayJobs.length !== 7) { errs.push('dayJobs: required array of exactly 7 strings (Sunday first)'); }
    else d.dayJobs.forEach(function (j, i) { if (!isNonEmptyStr(j)) { errs.push('dayJobs[' + i + ']: required string'); } });
    if (!Array.isArray(d.places) || d.places.length === 0) { errs.push('places: required non-empty array'); }
    else d.places.forEach(function (p, i) {
      if (!isNonEmptyStr(p.id) || !isNonEmptyStr(p.label) || !inWorld(p.x, 400)) {
        errs.push('places[' + i + ']: needs id, label, x inside the world');
      }
    });
    if (!Array.isArray(d.contacts) || d.contacts.length === 0) { errs.push('contacts: required non-empty array'); }
    else d.contacts.forEach(function (c, i) {
      var pre = 'contacts[' + i + '] (' + (c.name || '?') + ')';
      if (!isNonEmptyStr(c.id)) { errs.push(pre + ': id required'); }
      if (!isNonEmptyStr(c.name)) { errs.push(pre + ': name required'); }
      if (!isNonEmptyStr(c.job)) { errs.push(pre + ': job required'); }
      if (!inWorld(c.x, c.y)) { errs.push(pre + ': x,y must be inside the world'); }
      if (!isObj(c.palette) || typeof c.palette.coat !== 'number') { errs.push(pre + ': palette.coat required (hex number, e.g. 0x0f766e)'); }
      if (!isObj(c.mission)) { errs.push(pre + ': mission required'); return; }
      if (!isNonEmptyStr(c.mission.title)) { errs.push(pre + ': mission.title required'); }
      if (!Array.isArray(c.mission.introLines) || c.mission.introLines.length === 0) { errs.push(pre + ': mission.introLines required (array of {who,text})'); }
      else c.mission.introLines.forEach(function (l, j) {
        if (!isObj(l) || !isNonEmptyStr(l.who) || !isNonEmptyStr(l.text)) { errs.push(pre + ': introLines[' + j + '] needs who and text'); }
      });
      if (!isNonEmptyStr(c.mission.done)) { errs.push(pre + ': mission.done required'); }
      if (!Array.isArray(c.mission.steps) || c.mission.steps.length < 2 || c.mission.steps.length > 4) {
        errs.push(pre + ': mission.steps must be 2-4 steps');
      } else {
        if (c.mission.steps[0].kind !== 'talk') { errs.push(pre + ': steps[0] must be kind "talk"'); }
        c.mission.steps.forEach(function (s, j) {
          if (STEP_KINDS.indexOf(s.kind) === -1) { errs.push(pre + ': steps[' + j + '] unknown kind "' + s.kind + '"'); }
          if (!isNonEmptyStr(s.label) || !isNonEmptyStr(s.hint)) { errs.push(pre + ': steps[' + j + '] needs label and hint'); }
          if (!inWorld(s.x, 400)) { errs.push(pre + ': steps[' + j + '] x must be inside the world'); }
          if (s.kind === 'tap' && !isNonEmptyStr(s.target)) { errs.push(pre + ': steps[' + j + '] tap step needs a target id'); }
        });
      }
      if (c.idleLines && !Array.isArray(c.idleLines)) { errs.push(pre + ': idleLines must be an array'); }
    });
    if (!Array.isArray(d.finds)) { errs.push('finds: required array (may be empty)'); }
    else d.finds.forEach(function (f, i) {
      if (!isNonEmptyStr(f.id) || !isNonEmptyStr(f.label) || !isNonEmptyStr(f.effect) || !inWorld(f.x, 400)) {
        errs.push('finds[' + i + ']: needs id, label, effect, x inside the world');
      }
    });
    if (!isObj(d.side)) { errs.push('side: required object (side-street play moment)'); }
    else {
      if (!isNonEmptyStr(d.side.title) || !isNonEmptyStr(d.side.intro) || !isNonEmptyStr(d.side.result)) {
        errs.push('side: needs title, intro and result strings');
      }
      if (!Array.isArray(d.side.choices) || d.side.choices.length === 0) { errs.push('side.choices: required non-empty array of strings'); }
    }
    if (d.future2029 && !isNonEmptyStr(d.future2029)) { errs.push('future2029: must be a string when present (text only, never a scene)'); }
    if (d.internalOnly !== undefined && typeof d.internalOnly !== 'boolean') { errs.push('internalOnly: must be boolean when present'); }
    // Emulation (optional): neon shop signs, popping NPCs, snap crowd.
    if (d.paint && Array.isArray(d.paint.signs)) {
      d.paint.signs.forEach(function (s, i) {
        if (!isObj(s) || !inWorld(s.x, 400) || !isNonEmptyStr(s.text)) {
          errs.push('paint.signs[' + i + ']: needs x inside the world and a text string');
        }
      });
    }
    if (d.npcs !== undefined) {
      if (!Array.isArray(d.npcs)) { errs.push('npcs: must be an array when present'); }
      else d.npcs.forEach(function (n, i) {
        var pre = 'npcs[' + i + '] (' + (n.name || '?') + ')';
        if (!isNonEmptyStr(n.id)) { errs.push(pre + ': id required'); }
        if (!isNonEmptyStr(n.name)) { errs.push(pre + ': name required (fictional only)'); }
        if (!isNonEmptyStr(n.job)) { errs.push(pre + ': job required'); }
        if (!isNonEmptyStr(n.line)) { errs.push(pre + ': line required (one line of dialogue)'); }
        if (!isObj(n.palette) || typeof n.palette.coat !== 'number') { errs.push(pre + ': palette.coat required (hex number)'); }
        if (!Array.isArray(n.route) || n.route.length < 2) { errs.push(pre + ': route needs at least 2 waypoints'); }
        else n.route.forEach(function (w, j) {
          if (!inWorld(w.x, w.y)) { errs.push(pre + ': route[' + j + '] x,y must be inside the world'); }
          if (w.pause !== undefined && typeof w.pause !== 'number') { errs.push(pre + ': route[' + j + '] pause must be seconds (number)'); }
          if (w.act !== undefined && ['wave', 'sit', 'shutter', 'stand'].indexOf(w.act) === -1) {
            errs.push(pre + ': route[' + j + '] unknown act "' + w.act + '"');
          }
        });
      });
    }
    if (d.crowd !== undefined) {
      if (!isObj(d.crowd) || !inWorld(d.crowd.x, d.crowd.y) ||
          typeof d.crowd.rows !== 'number' || typeof d.crowd.cols !== 'number' ||
          d.crowd.rows < 1 || d.crowd.rows > 4 || d.crowd.cols < 1 || d.crowd.cols > 8) {
        errs.push('crowd: needs x,y inside the world and rows 1-4, cols 1-8');
      }
    }
    return errs;
  }

  /* ---------- pure logic: calendar ---------- */

  function dayJobFor(district, date) {
    return district.dayJobs[date.getDay()];
  }

  function dayOfYear(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    return Math.floor((date - start) / 86400000);
  }

  // One featured contact a day, rotating through the district's contacts.
  function dailyContactFor(district, date) {
    return district.contacts[dayOfYear(date) % district.contacts.length];
  }

  function todayKey(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  /* ---------- pure logic: mission machine ---------- */

  // state = { step: number, done: boolean }. Returns { state, done, event }.
  // event: 'advanced' | 'completed' | 'already-done'.
  function advanceMission(mission, state) {
    if (state.done) { return { state: state, done: true, event: 'already-done' }; }
    var next = { step: state.step + 1, done: false };
    if (next.step >= mission.steps.length) {
      next.done = true;
      next.step = mission.steps.length;
      return { state: next, done: true, event: 'completed' };
    }
    return { state: next, done: false, event: 'advanced' };
  }

  function defaultDistrictSave() {
    return { visited: {}, missions: {}, finds: {}, trust: {}, sideDone: false, daysPlayed: [] };
  }

  function loadSave() {
    try {
      var raw = root.localStorage && root.localStorage.getItem(SAVE_KEY);
      if (!raw) { return {}; }
      var parsed = JSON.parse(raw);
      return isObj(parsed) ? parsed : {};
    } catch (e) { return {}; }
  }

  function writeSave(all) {
    try {
      if (root.localStorage) { root.localStorage.setItem(SAVE_KEY, JSON.stringify(all)); }
    } catch (e) { /* storage unavailable — game still plays */ }
  }

  function districtSave(all, districtId) {
    if (!isObj(all[districtId])) { all[districtId] = defaultDistrictSave(); }
    var s = all[districtId];
    s.visited = isObj(s.visited) ? s.visited : {};
    s.missions = isObj(s.missions) ? s.missions : {};
    s.finds = isObj(s.finds) ? s.finds : {};
    s.trust = isObj(s.trust) ? s.trust : {};
    s.daysPlayed = Array.isArray(s.daysPlayed) ? s.daysPlayed : [];
    return s;
  }

  function missionStateFor(save, contactId) {
    if (!isObj(save.missions[contactId])) { save.missions[contactId] = { step: 0, done: false }; }
    return save.missions[contactId];
  }

  /* ---------- painted figures (silhouettes from behind, no faces) ---------- */

  function makeFigure(scene, palette) {
    var c = scene.add.container(0, 0);
    var g = scene.add.graphics();
    g.fillStyle(0x37474f, 1);
    g.fillRoundedRect(-8, 2, 6, 16, 2);
    g.fillRoundedRect(2, 2, 6, 16, 2);
    g.fillStyle(palette.coat, 1);
    g.fillRoundedRect(-11, -18, 22, 22, 6);
    if (palette.scarf) {
      g.fillStyle(palette.scarf, 1);
      g.fillRoundedRect(-9, -18, 18, 5, 2);
    }
    g.fillStyle(palette.coat, 1);
    g.fillRoundedRect(-15, -16, 5, 18, 2);
    g.fillRoundedRect(10, -16, 5, 18, 2);
    g.fillStyle(palette.hair || 0x2d1f16, 1);
    g.fillCircle(0, -26, 9);
    if (palette.bun) { g.fillCircle(0, -36, 4); }
    if (palette.cap) {
      g.fillStyle(palette.cap, 1);
      g.fillRoundedRect(-9, -33, 18, 5, 2);
    }
    c.add(g);
    return c;
  }

  function makePlayerFigure(scene) {
    return makeFigure(scene, { coat: 0x22304a, hair: 0x1c1a17, cap: 0xd94f3d });
  }

  // Small painted target shapes, one per target id; unknown ids get a
  // glowing diamond with a label so new districts never break the scene.
  function drawTarget(scene, targetId, x, y) {
    var c = scene.add.container(x, y);
    var g = scene.add.graphics();
    if (targetId === 'ball') {
      g.fillStyle(0xffffff, 1); g.fillCircle(0, 0, 11);
      g.fillStyle(0x334155, 1); g.fillCircle(0, 0, 4);
    } else if (targetId === 'jacket') {
      g.fillStyle(0x7c2d12, 1); g.fillRoundedRect(-14, -12, 28, 26, 4);
      g.fillStyle(0xfbbf24, 1); g.fillTriangle(-14, -12, 0, 2, 14, -12);
    } else if (targetId === 'cat1' || targetId === 'cat2' || targetId === 'cat3') {
      g.fillStyle(0x3f3f46, 1);
      g.fillTriangle(-8, -6, -4, -14, 0, -6);
      g.fillTriangle(0, -6, 4, -14, 8, -6);
      g.fillCircle(0, 0, 9);
      g.fillStyle(0xfbbf24, 1); g.fillCircle(-3, -1, 1.5); g.fillCircle(3, -1, 1.5);
    } else if (targetId === 'iou') {
      g.fillStyle(0xfef9c3, 1); g.fillRoundedRect(-11, -14, 22, 28, 2);
      g.lineStyle(1, 0x92400e, 0.8);
      g.lineBetween(-7, -6, 7, -6); g.lineBetween(-7, 0, 7, 0); g.lineBetween(-7, 6, 2, 6);
    } else if (targetId === 'kite') {
      g.fillStyle(0xef4444, 1); g.fillTriangle(0, -16, -12, 0, 12, 0);
      g.fillStyle(0x3b82f6, 1); g.fillTriangle(-12, 0, 0, 14, 12, 0);
    } else if (targetId === 'step') {
      g.fillStyle(0xd6d3d1, 1); g.fillRoundedRect(-18, -6, 36, 12, 3);
      g.fillStyle(0xa8a29e, 1); g.fillCircle(-6, 0, 3); g.fillCircle(4, -2, 2); g.fillCircle(10, 2, 2);
    } else if (targetId === 'duck') {
      g.fillStyle(0xfde68a, 1); g.fillCircle(0, 0, 9);
      g.fillStyle(0xf59e0b, 1); g.fillTriangle(8, -2, 14, 0, 8, 3);
    } else if (targetId === 'cup') {
      g.fillStyle(0xffffff, 1); g.fillRoundedRect(-8, -8, 16, 14, 3);
      g.fillStyle(0x92400e, 1); g.fillRoundedRect(-6, -6, 12, 4, 2);
    } else if (targetId === 'seed') {
      g.fillStyle(0xdcfce7, 1); g.fillRoundedRect(-10, -13, 20, 26, 2);
      g.fillStyle(0x16a34a, 1); g.fillCircle(0, -4, 4); g.fillCircle(0, 6, 4);
    } else if (targetId === 'broom') {
      g.fillStyle(0x92400e, 1); g.fillRoundedRect(-2, -16, 4, 22, 2);
      g.fillStyle(0xf59e0b, 1); g.fillTriangle(-8, 6, 8, 6, 0, 18);
    } else if (targetId === 'bike') {
      g.lineStyle(3, 0x334155, 1);
      g.strokeCircle(-9, 6, 7); g.strokeCircle(9, 6, 7);
      g.lineBetween(-9, 6, 0, -6); g.lineBetween(9, 6, 0, -6); g.lineBetween(-4, -8, 6, -8);
    } else if (targetId === 'runway') {
      g.fillStyle(0xfacc15, 1); g.fillRoundedRect(-16, -4, 32, 8, 2);
      g.fillStyle(0x111827, 1); g.fillCircle(-8, 0, 2); g.fillCircle(0, 0, 2); g.fillCircle(8, 0, 2);
    } else {
      g.fillStyle(0xfbbf24, 1);
      g.fillPoints([{ x: 0, y: -14 }, { x: 10, y: 0 }, { x: 0, y: 14 }, { x: -10, y: 0 }], true);
    }
    c.add(g);
    return c;
  }

  /* ---------- the Phaser scene, built from district data ---------- */

  // Phaser-dependent scene: defined only when Phaser is present, so the
  // pure logic above stays testable in Node without a browser.
  var DistrictScene = null;
  if (typeof Phaser !== 'undefined') {
  DistrictScene = function (district, opts) {
    Phaser.Scene.call(this, { key: 'DistrictScene' });
    this.district = district;
    this.opts = opts || {};
  };
  DistrictScene.prototype = Object.create(Phaser.Scene.prototype);
  DistrictScene.prototype.constructor = DistrictScene;

  DistrictScene.prototype.create = function () {
    var self = this;
    var d = this.district;
    this.allSave = loadSave();
    this.save = districtSave(this.allSave, d.id);
    this.activeMission = null;
    this.walkTarget = null;
    this.pendingTalk = null;
    this.dialogueOpen = false;
    this.stepStartX = null;
    this.sideOpen = false;

    // Record today's visit (calendar: a reason to return tomorrow).
    var tk = todayKey(new Date());
    if (this.save.daysPlayed.indexOf(tk) === -1) { this.save.daysPlayed.push(tk); }
    this.persist();

    this.paintDistrict(d);

    // Contacts (fictional people only).
    this.contactObjs = {};
    d.contacts.forEach(function (c) {
      var fig = makeFigure(self, c.palette);
      fig.setPosition(c.x, c.y);
      self.add.text(c.x, c.y + 28, c.name, {
        fontSize: '12px', fontStyle: 'bold', color: '#123f3a',
        backgroundColor: 'rgba(255,255,255,0.75)', padding: { x: 4, y: 1 }
      }).setOrigin(0.5, 0.5);
      var ms = missionStateFor(self.save, c.id);
      var bubble = self.add.text(c.x, c.y - 42, ms.done ? '♥' : '!', {
        fontSize: '18px', fontStyle: 'bold', color: ms.done ? '#b91c1c' : '#b45309',
        backgroundColor: '#fef3c7', padding: { x: 6, y: 1 }
      }).setOrigin(0.5, 0.5);
      fig.setInteractive(new Phaser.Geom.Rectangle(-20, -42, 40, 64), Phaser.Geom.Rectangle.Contains);
      fig.on('pointerdown', function () { self.tryTalk(c); });
      self.contactObjs[c.id] = { data: c, fig: fig, bubble: bubble };
    });

    // The player, silhouette from behind. Starts low enough that the
    // figure never stands on the hint bar at the bottom of the screen.
    this.player = makePlayerFigure(this);
    this.player.setPosition(195, 800);
    this.playerName = this.add.text(195, 828, 'you', {
      fontSize: '11px', color: '#22304a',
      backgroundColor: 'rgba(255,255,255,0.7)', padding: { x: 4, y: 1 }
    }).setOrigin(0.5, 0.5);

    // Look-closely finds ("?" markers).
    this.findObjs = {};
    d.finds.forEach(function (f) {
      if (self.save.finds[f.id]) { return; }
      var mark = self.add.text(f.x, 500, '?', {
        fontSize: '16px', fontStyle: 'bold', color: '#1e3a5f',
        backgroundColor: 'rgba(255,255,255,0.85)', padding: { x: 7, y: 2 }
      }).setOrigin(0.5, 0.5).setInteractive({ useHandCursor: true });
      mark.on('pointerdown', function () {
        self.save.finds[f.id] = true;
        self.persist();
        mark.destroy();
        self.showDialogue([{ who: f.label, text: f.effect }]);
      });
      self.findObjs[f.id] = mark;
    });

    this.buildHud(d);
    this.buildDialogue();
    this.renderTargets();

    // Emulation: people popping in and out, and (Chofu) the snap crowd.
    this.npcs = [];
    this.walkers = [];
    this.cat = null;
    this.npcIndex = 0;
    this.npcNextAt = 3500;
    this.walkerNextAt = 8000;
    this.catNextAt = 15000;
    this.snapBusy = false;
    this.buildEmulation(d);

    // Tap-to-walk anywhere on the ground.
    this.input.on('pointerdown', function (pointer) {
      if (self.dialogueOpen || self.sideOpen) { return; }
      self.walkTarget = { x: pointer.x, y: pointer.y };
    });
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE');
    this.refreshHud();
  };

  DistrictScene.prototype.persist = function () {
    writeSave(this.allSave);
  };

  DistrictScene.prototype.paintDistrict = function (d) {
    var self = this;
    var p = d.paint;
    // Sky + sun.
    this.add.rectangle(0, 0, WORLD_W, 160, parseInt(p.sky.replace('#', '0x'), 16)).setOrigin(0, 0);
    this.add.circle(330, 42, 20, 0xffe08a);
    this.add.circle(330, 42, 13, 0xffeeb0);
    // Landmark at the north end.
    this.paintLandmark(p.landmark, p.landmarkLabel);
    // Ground.
    this.add.rectangle(0, 160, WORLD_W, WORLD_H - 160, parseInt(p.ground.replace('#', '0x'), 16)).setOrigin(0, 0);
    // Buildings (shops / houses) — collision rects, fading toward the landmark.
    this.buildingRects = p.buildings.map(function (b) {
      return { x: b.x, y: b.y, w: b.w, h: b.h };
    });
    this.buildingGroup = this.add.container(0, 0);
    p.buildings.forEach(function (b) {
      var g = self.add.graphics();
      g.fillStyle(parseInt((b.wall || '#f3e3c2').replace('#', '0x'), 16), 1);
      g.fillRoundedRect(b.x, b.y + 22, b.w, b.h - 22, 3);
      g.fillStyle(parseInt((b.roof || '#b8543f').replace('#', '0x'), 16), 1);
      g.fillTriangle(b.x - 6, b.y + 26, b.x + b.w / 2, b.y, b.x + b.w + 6, b.y + 26);
      // Windows: one warm-lit (someone is home), one cool.
      g.fillStyle(0xffd27a, 1);
      g.fillRoundedRect(b.x + 12, b.y + 38, 18, 16, 2);
      g.fillStyle(0x7fa8c9, 1);
      g.fillRoundedRect(b.x + b.w - 30, b.y + 38, 18, 16, 2);
      g.fillStyle(0x6b4a2f, 1);
      g.fillRoundedRect(b.x + b.w / 2 - 9, b.y + 40, 18, 34, 2);
      if (b.label) {
        self.add.text(b.x + b.w / 2, b.y + b.h + 12, b.label, {
          fontSize: '10px', color: '#4c6440'
        }).setOrigin(0.5, 0.5);
      }
      self.buildingGroup.add(g);
    });
    // Street.
    var streetY = p.streetY || 282;
    this.add.rectangle(0, streetY, WORLD_W, 62, parseInt(p.street.replace('#', '0x'), 16)).setOrigin(0, 0);
    this.add.rectangle(0, streetY, WORLD_W, 4, 0xffffff).setOrigin(0, 0);
    this.add.rectangle(0, streetY + 58, WORLD_W, 4, 0xffffff).setOrigin(0, 0);
    for (var i = 0; i < 7; i++) {
      this.add.rectangle(30 + i * 55, streetY + 31, 26, 4, 0xffe08a).setOrigin(0.5, 0.5);
    }
    // Plaza / field at the south end.
    var f = this.add.graphics();
    f.fillStyle(parseInt((p.plaza || '#5da24a').replace('#', '0x'), 16), 1);
    f.fillRoundedRect(20, 372, 350, 300, 8);
    f.lineStyle(3, 0xffffff, 0.85);
    f.strokeRect(20, 372, 350, 300);
    f.strokeCircle(195, 522, 42);
    f.lineBetween(20, 522, 370, 522);
    this.add.text(195, 700, p.plazaLabel || 'the open ground', {
      fontSize: '11px', color: '#e8f3e2'
    }).setOrigin(0.5, 0.5);
    // Footpath at the south edge.
    this.add.rectangle(0, 726, WORLD_W, WORLD_H - 726, 0xcbb89a).setOrigin(0, 0);
    this.add.text(195, 742, d.name + ' — a district to walk', {
      fontSize: '11px', color: '#6b5a3e'
    }).setOrigin(0.5, 0.5);

    // Emulation: the street's life — signs, lamps, awnings, landmark motion.
    this.paintStreetLife(d);
  };

  /* Emulation: dense-district visuals. Neon shop signs in our own words
     (generic words only, no trademarks), striped awnings, street lamps
     with a warm glow, a vending machine on the shopping streets, and
     the landmark alive — boats bobbing in the harbour, trees swaying in
     the park, butterflies over the meadow, floodlights over the stadium.
     All drawn in code; no copied art. */
  DistrictScene.prototype.paintStreetLife = function (d) {
    var self = this;
    var p = d.paint;
    var streetY = p.streetY || 282;

    // Neon-style shop signs on the building faces (our own words only).
    (p.signs || []).forEach(function (s) {
      var col = s.color || '#ff5a5a';
      // Glow first (behind the text): a soft halo, gently pulsing.
      var halo = self.add.rectangle(s.x, 208, 76, 20, 0xffffff, 0.12).setOrigin(0.5, 0.5);
      self.tweens.add({ targets: halo, alpha: 0.05, duration: 1400, yoyo: true, repeat: -1 });
      var label = self.add.text(s.x, 208, s.text, {
        fontSize: '11px', fontStyle: 'bold', color: col,
        backgroundColor: 'rgba(20,20,30,0.85)', padding: { x: 5, y: 2 }
      }).setOrigin(0.5, 0.5);
      // Striped awning under the sign.
      var aw = self.add.graphics();
      for (var i = 0; i < 5; i++) {
        aw.fillStyle(i % 2 ? 0xffffff : 0x334155, 1);
        aw.fillRect(s.x - 30 + i * 12, 224, 12, 8);
      }
    });

    // Street lamps along the street, warm glow.
    [48, 195, 342].forEach(function (lx) {
      self.add.rectangle(lx, streetY + 12, 3, 22, 0x374151).setOrigin(0.5, 0);
      self.add.circle(lx, streetY + 10, 10, 0xffe08a, 0.25);
      var bulb = self.add.circle(lx, streetY + 10, 4, 0xffe08a);
      self.tweens.add({ targets: bulb, alpha: 0.7, duration: 900 + lx, yoyo: true, repeat: -1 });
    });

    // Vending machine on the shopping streets (stadium / harbour towns).
    if (p.landmark === 'stadium' || p.landmark === 'harbour') {
      var vm = self.add.graphics();
      vm.fillStyle(0xdc2626, 1);
      vm.fillRoundedRect(356, streetY - 34, 26, 40, 3);
      vm.fillStyle(0xbfdbfe, 1);
      vm.fillRoundedRect(360, streetY - 28, 18, 16, 2);
      vm.fillStyle(0xffffff, 1);
      vm.fillRoundedRect(360, streetY - 8, 18, 4, 1);
      self.add.text(369, streetY + 12, 'DRINK', {
        fontSize: '7px', fontStyle: 'bold', color: '#7f1d1d'
      }).setOrigin(0.5, 0.5);
    }

    // The landmark is alive: boats bob, trees sway, butterflies drift,
    // floodlights breathe. Small motion, so the place never sits still.
    if (p.landmark === 'harbour') {
      var boat1 = self.add.graphics();
      boat1.fillStyle(0x78350f, 1);
      boat1.fillRoundedRect(70, 118, 52, 6, 2);
      boat1.fillStyle(0xf8fafc, 1);
      boat1.fillTriangle(96, 92, 86, 118, 106, 118);
      self.tweens.add({ targets: boat1, y: 3, duration: 1800, yoyo: true, repeat: -1 });
      var boat2 = self.add.graphics();
      boat2.fillStyle(0x78350f, 1);
      boat2.fillRoundedRect(200, 128, 52, 6, 2);
      boat2.fillStyle(0xf8fafc, 1);
      boat2.fillTriangle(226, 102, 216, 128, 236, 128);
      self.tweens.add({ targets: boat2, y: -3, duration: 2200, yoyo: true, repeat: -1 });
    } else if (p.landmark === 'park') {
      [150, 230, 300].forEach(function (tx, i) {
        var tree = self.add.graphics();
        tree.fillStyle(0x166534, 1);
        tree.fillCircle(tx, 92, 14);
        self.tweens.add({ targets: tree, angle: i % 2 ? 2 : -2, duration: 2600 + i * 400, yoyo: true, repeat: -1 });
      });
    } else if (p.landmark === 'meadow') {
      [[90, 100], [150, 98], [120, 112]].forEach(function (pt, i) {
        var b = self.add.circle(pt[0], pt[1], 3, i === 1 ? 0xffffff : 0xfde68a);
        self.tweens.add({ targets: b, x: pt[0] + 24, y: pt[1] - 10, duration: 3000 + i * 700, yoyo: true, repeat: -1 });
      });
    } else if (p.landmark === 'stadium') {
      var glow = self.add.circle(195, 100, 60, 0xfff7cc, 0.10);
      self.tweens.add({ targets: glow, alpha: 0.18, duration: 2000, yoyo: true, repeat: -1 });
    }
  };

  DistrictScene.prototype.paintLandmark = function (kind, label) {
    var g = this.add.graphics();
    if (kind === 'stadium') {
      g.fillStyle(0x8fa3b8, 1);
      g.fillRoundedRect(45, 62, 300, 78, 10);
      g.fillStyle(0x6b7f95, 1);
      g.fillRoundedRect(45, 62, 300, 16, { tl: 10, tr: 10, bl: 0, br: 0 });
      g.fillStyle(0xe8eef2, 1);
      for (var i = 0; i < 9; i++) { g.fillRoundedRect(62 + i * 31, 92, 18, 22, 3); }
      g.fillStyle(0x3f6d4e, 1);
      g.fillRoundedRect(95, 118, 200, 22, 4);
      g.lineStyle(2, 0xffffff, 0.9);
      g.strokeCircle(195, 129, 8);
    } else if (kind === 'harbour') {
      g.fillStyle(0x3b82f6, 1);
      g.fillRoundedRect(45, 62, 300, 78, 10);
      g.fillStyle(0x93c5fd, 1);
      for (var i = 0; i < 5; i++) { g.fillRoundedRect(60 + i * 58, 84, 44, 4, 2); }
      g.fillStyle(0x78350f, 1);
      for (var s = 0; s < 4; s++) { g.fillRoundedRect(70 + s * 62, 118 + s * 5, 52, 6, 2); }
      g.fillStyle(0xf8fafc, 1);
      g.fillTriangle(150, 92, 140, 108, 160, 108);
      g.fillTriangle(210, 88, 198, 108, 222, 108);
    } else if (kind === 'park') {
      g.fillStyle(0x65a30d, 1);
      g.fillRoundedRect(45, 62, 300, 78, 10);
      g.fillStyle(0x166534, 1);
      g.fillCircle(90, 100, 16); g.fillCircle(150, 88, 20); g.fillCircle(230, 100, 16); g.fillCircle(300, 92, 18);
      g.fillStyle(0x78350f, 1);
      g.fillRoundedRect(84, 112, 6, 18, 2); g.fillRoundedRect(144, 104, 6, 18, 2);
      g.fillStyle(0xfacc15, 1);
      g.fillRoundedRect(60, 128, 270, 5, 2);
    } else { // meadow
      g.fillStyle(0xa3e635, 1);
      g.fillRoundedRect(45, 62, 300, 78, 10);
      g.fillStyle(0x38bdf8, 1);
      g.fillRoundedRect(200, 92, 120, 40, 8);
      g.fillStyle(0xfde68a, 1);
      g.fillCircle(90, 100, 10); g.fillCircle(120, 112, 8); g.fillCircle(150, 98, 9);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(240, 104, 6); g.fillCircle(280, 112, 6);
    }
    this.add.text(195, 46, label, {
      fontSize: '13px', fontStyle: 'bold', color: '#33506b'
    }).setOrigin(0.5, 0.5);
    this.add.text(195, 152, 'present day', {
      fontSize: '10px', color: '#5b7186'
    }).setOrigin(0.5, 0.5);
  };

  DistrictScene.prototype.buildHud = function (d) {
    var self = this;
    var today = new Date();
    this.add.rectangle(0, 0, WORLD_W, 30, 0x000000, 0.25).setOrigin(0, 0);
    this.add.text(10, 8, d.name, { fontSize: '12px', fontStyle: 'bold', color: '#ffffff' });
    // Mini-map (lights up as places are visited and jobs are done).
    this.mapPanel = this.add.rectangle(WORLD_W - 96, 4, 88, 58, 0x000000, 0.45).setOrigin(0, 0);
    this.mapTitle = this.add.text(WORLD_W - 92, 7, 'DISTRICT MAP', { fontSize: '8px', fontStyle: 'bold', color: '#ffffff' });
    this.mapGfx = this.add.graphics();
    this.mapPlayerDot = this.add.circle(0, 0, 3, 0xffffff);
    // Trust hearts + jobs-done counter. The trust line wraps at 270px
    // so long contact lists never run under the district map.
    this.trustText = this.add.text(10, 34, '', { fontSize: '12px', color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.35)', padding: { x: 5, y: 2 }, wordWrap: { width: 270 } });
    this.jobsText = this.add.text(10, 80, '', { fontSize: '12px', color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.35)', padding: { x: 5, y: 2 } });
    // Calendar: today's job + featured contact.
    var daily = dailyContactFor(d, today);
    // Day text sits one row higher than the objective: when it wraps
    // to two lines (long district + contact names) it must not run
    // under the objective bar below it.
    this.dayText = this.add.text(10, WORLD_H - 162, 'Today: ' + dayJobFor(d, today) + ' — ' + daily.name + ' has today\u2019s job.', {
      fontSize: '11px', color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.45)', padding: { x: 6, y: 3 }, wordWrap: { width: 260 }
    });
    this.objective = this.add.text(10, WORLD_H - 118, '', {
      fontSize: '12px', color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.45)', padding: { x: 6, y: 3 }
    });
    this.hint = this.add.text(195, WORLD_H - 96, 'Tap to walk  •  Arrow keys / WASD  •  Tap a person to talk', {
      fontSize: '10px', color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.4)', padding: { x: 6, y: 3 }
    }).setOrigin(0.5, 0.5);
    // Side street button.
    this.sideBtn = this.add.text(WORLD_W - 10, WORLD_H - 140, 'Side street ▸', {
      fontSize: '11px', color: '#ffffff',
      backgroundColor: 'rgba(15,118,110,0.9)', padding: { x: 6, y: 3 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    this.sideBtn.on('pointerdown', function () { self.openSide(); });
    // 2029 — text only, never a scene.
    if (d.future2029) {
      this.futureBtn = this.add.text(WORLD_W - 10, WORLD_H - 168, '2029?', {
        fontSize: '11px', color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.5)', padding: { x: 6, y: 3 }
      }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
      this.futureBtn.on('pointerdown', function () {
        self.showDialogue([{ who: '2029 — a question, in words only', text: d.future2029 }]);
      });
    }
    // Reset (for testing).
    this.resetBtn = this.add.text(WORLD_W - 10, WORLD_H - 96, '↺ reset', {
      fontSize: '10px', color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.5)', padding: { x: 6, y: 3 }
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    this.resetBtn.on('pointerdown', function () {
      self.save.missions = {}; self.save.finds = {}; self.save.trust = {};
      self.save.visited = {}; self.save.sideDone = false;
      self.activeMission = null;
      self.persist();
      self.scene.restart();
    });
  };

  DistrictScene.prototype.drawMap = function () {
    var d = this.district;
    var doneCount = d.contacts.filter(function (c) { return missionStateFor(this.save, c.id).done; }, this).length;
    var lit = doneCount >= d.contacts.length;
    var g = this.mapGfx;
    g.clear();
    this.mapPanel.setFillStyle(lit ? 0x7c5a10 : 0x000000, lit ? 0.75 : 0.45);
    this.mapTitle.setText(lit ? 'DISTRICT MAP  ✦ lit' : 'DISTRICT MAP');
    var i, p;
    for (i = 0; i < d.places.length; i++) {
      p = d.places[i];
      var visited = !!this.save.visited[p.id];
      g.fillStyle((lit || visited) ? 0xfbbf24 : 0x9aa0a6, 1);
      g.fillCircle(312 + i * 18, 40, visited ? 5 : 3);
    }
    g.fillStyle(lit ? 0xfbbf24 : 0x8fa3b8, 1);
    g.fillRect(306, 10, 68, 8);
    g.fillStyle(lit ? 0x4ade80 : 0x5da24a, 1);
    g.fillRect(306, 48, 68, 10);
  };

  DistrictScene.prototype.refreshHud = function () {
    var d = this.district;
    var hearts = d.contacts.map(function (c) {
      return c.name + ' ' + (missionStateFor(this.save, c.id).done ? '♥' : '♡');
    }, this).join('  ');
    this.trustText.setText('Trust: ' + hearts);
    var done = d.contacts.filter(function (c) { return missionStateFor(this.save, c.id).done; }, this).length;
    this.jobsText.setText('Jobs done: ' + done + ' of ' + d.contacts.length +
      (this.save.sideDone ? '  •  Side street played' : ''));
    if (!this.activeMission) {
      this.objective.setText('No job yet — walk to someone and tap them.');
    } else {
      var c = this.contactById(this.activeMission);
      var ms = missionStateFor(this.save, c.id);
      if (ms.done) {
        this.objective.setText(c.mission.title + ' — done. ' + c.mission.done);
      } else {
        var step = c.mission.steps[ms.step];
        this.objective.setText('Job: ' + c.mission.title + ' — step ' + (ms.step + 1) + ' of ' +
          c.mission.steps.length + ': ' + step.label);
      }
    }
    // Contact bubbles follow mission state.
    var self = this;
    d.contacts.forEach(function (c) {
      var ms = missionStateFor(self.save, c.id);
      var o = self.contactObjs[c.id];
      o.bubble.setText(ms.done ? '♥' : '!');
      o.bubble.setColor(ms.done ? '#b91c1c' : '#b45309');
    });
    this.drawMap();
  };

  DistrictScene.prototype.contactById = function (id) {
    var found = null;
    this.district.contacts.forEach(function (c) { if (c.id === id) { found = c; } });
    return found;
  };

  DistrictScene.prototype.currentStep = function () {
    if (!this.activeMission) { return null; }
    var c = this.contactById(this.activeMission);
    if (!c) { return null; }
    var ms = missionStateFor(this.save, c.id);
    return ms.done ? null : c.mission.steps[ms.step];
  };

  DistrictScene.prototype.renderTargets = function () {
    if (this.targetObj) { this.targetObj.destroy(); this.targetObj = null; }
    if (this.targetLabel) { this.targetLabel.destroy(); this.targetLabel = null; }
    var step = this.currentStep();
    if (!step || step.kind !== 'tap') { return; }
    var self = this;
    this.targetObj = drawTarget(this, step.target, step.x, 566);
    this.targetObj.setInteractive(new Phaser.Geom.Circle(0, 0, 24), Phaser.Geom.Circle.Contains);
    this.targetObj.on('pointerdown', function () {
      self.walkTarget = { x: step.x, y: 566 };
    });
    this.tweens.add({ targets: this.targetObj, scale: 1.15, duration: 500, yoyo: true, repeat: -1 });
    this.targetLabel = this.add.text(step.x, 596, step.label, {
      fontSize: '11px', color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.45)', padding: { x: 4, y: 1 }
    }).setOrigin(0.5, 0.5);
  };

  /* ---------- dialogue ---------- */

  DistrictScene.prototype.buildDialogue = function () {
    var self = this;
    this.dialogueBox = this.add.container(10, WORLD_H - 106).setDepth(10).setVisible(false);
    var panel = this.add.rectangle(0, 0, WORLD_W - 20, 96, 0xffffff, 0.97)
      .setOrigin(0, 0).setStrokeStyle(2, 0x22304a);
    this.dialogueName = this.add.text(14, 10, '', { fontSize: '12px', fontStyle: 'bold', color: '#0f766e' });
    this.dialogueBody = this.add.text(14, 30, '', {
      fontSize: '14px', color: '#1f2937', wordWrap: { width: WORLD_W - 48 }
    });
    var next = this.add.text(WORLD_W - 34, 74, 'tap ▸', { fontSize: '11px', color: '#6b7280' });
    this.dialogueBox.add([panel, this.dialogueName, this.dialogueBody, next]);
    this.dialogueBox.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, WORLD_W - 20, 96), Phaser.Geom.Rectangle.Contains
    );
    this.dialogueBox.on('pointerdown', function () { self.advanceDialogue(); });
  };

  DistrictScene.prototype.showDialogue = function (lines, after) {
    this.dialogueLines = lines;
    this.dialogueIndex = 0;
    this.dialogueAfter = after || null;
    this.dialogueOpen = true;
    this.walkTarget = null;
    this.dialogueBox.setVisible(true);
    this.renderDialogueLine();
  };

  DistrictScene.prototype.renderDialogueLine = function () {
    var line = this.dialogueLines[this.dialogueIndex];
    this.dialogueName.setText(line.who);
    this.dialogueBody.setText(line.text);
  };

  DistrictScene.prototype.advanceDialogue = function () {
    this.dialogueIndex += 1;
    if (this.dialogueIndex < this.dialogueLines.length) { this.renderDialogueLine(); return; }
    this.dialogueBox.setVisible(false);
    this.dialogueOpen = false;
    var after = this.dialogueAfter;
    this.dialogueAfter = null;
    if (after) { after(); }
  };

  /* ---------- talking & missions ---------- */

  DistrictScene.prototype.near = function (x, y, range) {
    return Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y) < range;
  };

  DistrictScene.prototype.tryTalk = function (c) {
    if (this.dialogueOpen || this.sideOpen) { return; }
    if (!this.near(c.x, c.y, 80)) {
      this.walkTarget = { x: c.x + 30, y: c.y + 46 };
      this.pendingTalk = c.id;
      return;
    }
    this.talkTo(c);
  };

  DistrictScene.prototype.talkTo = function (c) {
    var self = this;
    var ms = missionStateFor(this.save, c.id);
    if (ms.done) {
      this.showDialogue([{ who: c.name, text: c.mission.done }].concat(
        (c.idleLines || []).map(function (t) { return { who: c.name, text: t }; })
      ));
      return;
    }
    if (this.activeMission && this.activeMission !== c.id) {
      this.showDialogue([{ who: c.name, text: 'Finish the job you are on first — or tap that person again to hear it once more.' }]);
      return;
    }
    this.activeMission = c.id;
    if (ms.step === 0) {
      // Tapping the person IS the talk step: it completes when they speak.
      this.showDialogue(c.mission.introLines, function () {
        var r = advanceMission(c.mission, ms);
        self.save.missions[c.id] = r.state;
        self.persist();
        self.stepStartX = null;
        self.refreshHud();
        self.renderTargets();
        var next = c.mission.steps[r.state.step];
        if (next) { self.showDialogue([{ who: 'Job', text: next.label + ' — ' + next.hint }]); }
      });
    } else {
      var step = c.mission.steps[ms.step];
      this.showDialogue([{ who: c.name, text: step.label + ' — ' + step.hint }]);
    }
    this.refreshHud();
    this.renderTargets();
  };

  DistrictScene.prototype.advanceStep = function () {
    var c = this.contactById(this.activeMission);
    if (!c) { return; }
    var ms = missionStateFor(this.save, c.id);
    var r = advanceMission(c.mission, ms);
    this.save.missions[c.id] = r.state;
    this.stepStartX = null;
    if (r.event === 'completed') {
      this.save.trust[c.id] = 1;
      this.persist();
      this.refreshHud();
      this.renderTargets();
      this.showDialogue([{ who: c.name, text: c.mission.done }]);
      if (this.opts.onMissionDone) { try { this.opts.onMissionDone(c, this.district); } catch (e) {} }
      if (this.opts.onEvent) { try { this.opts.onEvent('mission_done', c.id); } catch (e) {} }
    } else {
      this.persist();
      this.refreshHud();
      this.renderTargets();
      var next = c.mission.steps[r.state.step];
      if (next) { this.showDialogue([{ who: 'Job', text: next.label + ' — ' + next.hint }]); }
    }
  };

  /* ---------- emulation: people popping in and out ---------- */

  // The crowd stand (Chofu only) and the "Snap the ball" button.
  // The crowd are plain figures — no numbers, no names, no faces.
  DistrictScene.prototype.buildEmulation = function (d) {
    var self = this;
    if (!d.crowd) { return; }
    var c = d.crowd;
    // A small stand behind the crowd.
    var stand = this.add.graphics();
    stand.fillStyle(0x64748b, 1);
    stand.fillRoundedRect(c.x - 12, c.y - 14, c.cols * 15 + 24, c.rows * 17 + 20, 4);
    stand.fillStyle(0x475569, 1);
    stand.fillRect(c.x - 12, c.y + c.rows * 17 + 2, c.cols * 15 + 24, 4);
    this.crowdFigs = [];
    var coats = [0xdc2626, 0x2563eb, 0x16a34a, 0xca8a04, 0x7c3aed, 0xdb2777];
    for (var r = 0; r < c.rows; r++) {
      for (var i = 0; i < c.cols; i++) {
        var fig = makeFigure(this, {
          coat: coats[(r * c.cols + i) % coats.length],
          hair: 0x1c1a17
        });
        fig.setPosition(c.x + i * 15, c.y + r * 17);
        fig.setScale(0.7);
        this.crowdFigs.push(fig);
      }
    }
    this.crowdBaseY = this.crowdFigs.map(function (f) { return f.y; });
    // The snap button: tap it and the crowd rises.
    this.snapBtn = this.add.text(WORLD_W - 10, WORLD_H - 196, 'Snap the ball', {
      fontSize: '11px', color: '#ffffff',
      backgroundColor: 'rgba(180,38,38,0.9)', padding: { x: 6, y: 3 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    this.snapBtn.on('pointerdown', function () { self.doSnap(); });
  };

  // The snap: the ball snaps, a runner crosses, the crowd rises and
  // cheers, confetti falls. Visual cheers only — no audio, no numbers.
  DistrictScene.prototype.doSnap = function () {
    var self = this;
    if (!this.crowdFigs || this.snapBusy) { return; }
    this.snapBusy = true;
    // The ball and a plain runner (no number, no name) cross the field.
    var ball = this.add.container(195, 522);
    var bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.fillCircle(0, 0, 8);
    bg.fillStyle(0x7c2d12, 1);
    bg.fillCircle(0, 0, 3);
    ball.add(bg);
    var runner = makeFigure(this, { coat: 0x7c2d12, hair: 0x1c1a17 });
    runner.setPosition(195, 540);
    this.tweens.add({ targets: ball, x: 268, duration: 500 });
    this.tweens.add({ targets: runner, x: 258, duration: 600 });
    // The crowd rises: every figure jumps up and settles.
    this.crowdFigs.forEach(function (fig, i) {
      self.tweens.add({
        targets: fig, y: self.crowdBaseY[i] - 9, duration: 220,
        yoyo: true, repeat: 3, delay: i * 30
      });
    });
    // CHEERS, big, then gone.
    var cheers = this.add.text(195, 470, 'CHEERS!', {
      fontSize: '34px', fontStyle: 'bold', color: '#fbbf24'
    }).setOrigin(0.5, 0.5).setScale(0.5).setDepth(15);
    this.tweens.add({ targets: cheers, scale: 1.15, duration: 350 });
    this.tweens.add({ targets: cheers, alpha: 0, delay: 1400, duration: 500 });
    // Confetti over the field.
    var colours = [0xef4444, 0xf59e0b, 0x22c55e, 0x3b82f6, 0xec4899];
    for (var k = 0; k < 24; k++) {
      var dot = this.add.circle(30 + Math.random() * 330, 380, 3, colours[k % colours.length]);
      this.tweens.add({ targets: dot, y: 560 + Math.random() * 80, alpha: 0, duration: 900 + Math.random() * 700, delay: k * 40 });
    }
    this.time.delayedCall(2200, function () {
      ball.destroy();
      runner.destroy();
      cheers.destroy();
      self.snapBusy = false;
    });
    if (this.opts.onSnap) { try { this.opts.onSnap(this.district); } catch (e) {} }
    if (this.opts.onEvent) { try { this.opts.onEvent('snap_cheers', this.district.id); } catch (e) {} }
  };

  // One NPC pops in: walks the route, pauses to wave / sit / open a
  // shutter / stand, then walks off the edge and disappears.
  DistrictScene.prototype.spawnNpc = function (def) {
    var self = this;
    var fig = makeFigure(this, def.palette);
    var start = def.route[0];
    fig.setPosition(start.x, start.y);
    var label = this.add.text(start.x, start.y + 28, def.name, {
      fontSize: '11px', fontStyle: 'bold', color: '#123f3a',
      backgroundColor: 'rgba(255,255,255,0.8)', padding: { x: 4, y: 1 }
    }).setOrigin(0.5, 0.5);
    var bubble = this.add.text(start.x, start.y - 42, '', {
      fontSize: '16px', fontStyle: 'bold', color: '#b45309',
      backgroundColor: '#fef3c7', padding: { x: 6, y: 1 }
    }).setOrigin(0.5, 0.5).setVisible(false);
    fig.setInteractive(new Phaser.Geom.Rectangle(-20, -42, 40, 64), Phaser.Geom.Rectangle.Contains);
    var npc = {
      def: def, fig: fig, label: label, bubble: bubble,
      wp: 1, waitUntil: 0, actDone: false, leaving: false,
      shutter: null, speed: 55
    };
    fig.on('pointerdown', function () {
      if (self.dialogueOpen || self.sideOpen) { return; }
      self.showDialogue([{ who: def.name, text: def.line }]);
    });
    this.npcs.push(npc);
    return npc;
  };

  DistrictScene.prototype.spawnNpcById = function (id) {
    var found = null;
    (this.district.npcs || []).forEach(function (n) { if (n.id === id) { found = n; } });
    if (!found) { return null; }
    return this.spawnNpc(found);
  };

  // An unnamed walker crosses the street and disappears off the edge.
  DistrictScene.prototype.spawnWalker = function () {
    var coats = [0x475569, 0x7c3aed, 0x0f766e, 0xb45309, 0xbe185d, 0x1d4ed8];
    var dir = Math.random() < 0.5 ? 1 : -1;
    var streetY = (this.district.paint.streetY || 282) + 31;
    var startX = dir === 1 ? -20 : WORLD_W + 20;
    var fig = makeFigure(this, {
      coat: coats[Math.floor(Math.random() * coats.length)],
      hair: 0x1c1a17
    });
    fig.setPosition(startX, streetY);
    this.walkers.push({ fig: fig, dir: dir, speed: 70 });
    return fig;
  };

  // A cat trots across the street and is gone.
  DistrictScene.prototype.spawnCat = function () {
    var streetY = (this.district.paint.streetY || 282) + 31;
    var dir = Math.random() < 0.5 ? 1 : -1;
    var startX = dir === 1 ? -20 : WORLD_W + 20;
    var cat = drawTarget(this, 'cat1', startX, streetY);
    this.cat = { fig: cat, dir: dir, speed: 115 };
    return cat;
  };

  DistrictScene.prototype.npcCount = function () {
    return this.npcs.length;
  };

  DistrictScene.prototype.updateNpcs = function (time, dt) {
    var self = this;
    if (this.dialogueOpen || this.sideOpen) { return; }

    // Scheduler: a roster NPC pops in every 9–16 s (max 2 at once),
    // a walker crosses every 12–20 s, a cat every 20–35 s.
    if ((this.district.npcs || []).length && time > this.npcNextAt && this.npcs.length < 2) {
      var def = this.district.npcs[this.npcIndex % this.district.npcs.length];
      this.npcIndex += 1;
      this.spawnNpc(def);
      this.npcNextAt = time + 9000 + Math.random() * 7000;
    }
    if (time > this.walkerNextAt) {
      this.spawnWalker();
      this.walkerNextAt = time + 12000 + Math.random() * 8000;
    }
    if (time > this.catNextAt) {
      this.spawnCat();
      this.catNextAt = time + 20000 + Math.random() * 15000;
    }

    // Walkers cross and leave.
    this.walkers = this.walkers.filter(function (w) {
      w.fig.x += w.dir * w.speed * dt;
      if (w.fig.x < -30 || w.fig.x > WORLD_W + 30) {
        w.fig.destroy();
        return false;
      }
      return true;
    });

    // The cat trots across and is gone.
    if (this.cat) {
      this.cat.fig.x += this.cat.dir * this.cat.speed * dt;
      if (this.cat.fig.x < -30 || this.cat.fig.x > WORLD_W + 30) {
        this.cat.fig.destroy();
        this.cat = null;
      }
    }

    // Roster NPCs walk their route.
    this.npcs = this.npcs.filter(function (npc) {
      var route = npc.def.route;
      var target = route[npc.wp];
      if (!target) {
        // Route done: stand up and walk off the nearest edge and disappear.
        npc.fig.setScale(1, 1);
        var edgeX = npc.fig.x < WORLD_W / 2 ? -30 : WORLD_W + 30;
        var dx = edgeX - npc.fig.x;
        var step = 55 * dt * (dx > 0 ? 1 : -1);
        npc.fig.x += Math.abs(step) > Math.abs(dx) ? dx : step;
        npc.label.setPosition(npc.fig.x, npc.fig.y + 28);
        npc.bubble.setPosition(npc.fig.x, npc.fig.y - 42);
        if (Math.abs(npc.fig.x - edgeX) < 2) {
          npc.fig.destroy(); npc.label.destroy(); npc.bubble.destroy();
          if (npc.shutter) { npc.shutter.destroy(); }
          return false;
        }
        return true;
      }
      // Pausing at a waypoint.
      if (npc.waitUntil && time < npc.waitUntil) { return true; }
      if (npc.waitUntil && time >= npc.waitUntil) {
        npc.waitUntil = 0;
        npc.fig.setScale(1, 1); // stand back up after sitting
        if (npc.shutter) {
          var sh = npc.shutter; npc.shutter = null;
          self.tweens.add({ targets: sh, y: 0, duration: 600, onComplete: function () { sh.destroy(); } });
        }
        npc.wp += 1;
        npc.actDone = false;
        return true;
      }
      var ddx = target.x - npc.fig.x;
      var ddy = target.y - npc.fig.y;
      var dist = Math.hypot(ddx, ddy);
      if (dist < 4) {
        // Arrived: act, then wait if the waypoint says so.
        if (!npc.actDone) {
          npc.actDone = true;
          if (target.act === 'wave') {
            npc.bubble.setText('!').setVisible(true);
            self.tweens.add({ targets: npc.fig, y: npc.fig.y - 6, duration: 220, yoyo: true, repeat: 3 });
            self.time.delayedCall(1500, function () { npc.bubble.setVisible(false); });
          } else if (target.act === 'sit') {
            npc.fig.setScale(1, 0.85); // sits down for the pause
          } else if (target.act === 'shutter') {
            // A shutter slides up over the shop front while they work.
            var sh = self.add.graphics();
            sh.fillStyle(0x9ca3af, 1);
            sh.fillRect(npc.fig.x - 22, target.y - 52, 44, 34);
            sh.lineStyle(1, 0x6b7280, 1);
            for (var i = 0; i < 4; i++) { sh.lineBetween(npc.fig.x - 22, target.y - 44 + i * 8, npc.fig.x + 22, target.y - 44 + i * 8); }
            npc.shutter = sh;
            self.tweens.add({ targets: sh, y: -26, duration: 800 });
          }
        }
        if (target.pause) { npc.waitUntil = time + target.pause * 1000; }
        else { npc.wp += 1; npc.actDone = false; }
        return true;
      }
      var vx = ddx / dist * npc.speed * dt;
      var vy = ddy / dist * npc.speed * dt;
      npc.fig.x += vx;
      npc.fig.y += vy;
      npc.label.setPosition(npc.fig.x, npc.fig.y + 28);
      npc.bubble.setPosition(npc.fig.x, npc.fig.y - 42);
      return true;
    });
  };

  /* ---------- side street ---------- */

  DistrictScene.prototype.openSide = function () {
    var self = this;
    if (this.dialogueOpen) { return; }
    this.sideOpen = true;
    this.walkTarget = null;
    var d = this.district;
    var s = d.side;
    this.sidePanel = this.add.container(0, 0).setDepth(20);
    var panel = this.add.rectangle(0, 0, WORLD_W - 20, 300, 0xffffff, 0.98)
      .setOrigin(0, 0).setStrokeStyle(2, 0x0f766e);
    var title = this.add.text(14, 12, s.title + ' — Imagined, play', {
      fontSize: '14px', fontStyle: 'bold', color: '#0f766e', wordWrap: { width: WORLD_W - 48 }
    });
    var intro = this.add.text(14, 40, s.intro, {
      fontSize: '13px', color: '#1f2937', wordWrap: { width: WORLD_W - 48 }
    });
    this.sidePanel.add([panel, title, intro]);
    this.sidePanel.setPosition(10, 220);
    this.sideChoices = [];
    s.choices.forEach(function (choice, i) {
      var b = self.add.text(14, 110 + i * 36, '▸ ' + choice, {
        fontSize: '13px', color: '#ffffff',
        backgroundColor: '#0f766e', padding: { x: 8, y: 6 }, wordWrap: { width: WORLD_W - 48 }
      }).setInteractive({ useHandCursor: true });
      b.on('pointerdown', function () {
        self.sideChoices.forEach(function (x) { x.disableInteractive(); x.setAlpha(0.5); });
        var r = self.add.text(14, 110 + s.choices.length * 36 + 8, s.result, {
          fontSize: '13px', fontStyle: 'bold', color: '#1f2937', wordWrap: { width: WORLD_W - 48 }
        });
        self.sidePanel.add(r);
        self.save.sideDone = true;
        self.persist();
        self.refreshHud();
      });
      self.sidePanel.add(b);
      self.sideChoices.push(b);
    });
    var exit = this.add.text(WORLD_W - 34, 268, 'Leave the side street ✕', {
      fontSize: '12px', fontStyle: 'bold', color: '#0f766e',
      backgroundColor: '#e6f4f1', padding: { x: 8, y: 6 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    exit.on('pointerdown', function () { self.closeSide(); });
    this.sidePanel.add(exit);
  };

  DistrictScene.prototype.closeSide = function () {
    if (this.sidePanel) { this.sidePanel.destroy(); this.sidePanel = null; }
    this.sideOpen = false;
  };

  /* ---------- update loop ---------- */

  DistrictScene.prototype.update = function (time, delta) {
    var dt = Math.min(delta / 1000, 0.05);
    var px = this.player.x;
    var py = this.player.y;
    var vx = 0, vy = 0;

    if (!this.dialogueOpen && !this.sideOpen) {
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
        if (dist < 6) { this.walkTarget = null; }
        else { vx = dx / dist * PLAYER_SPEED; vy = dy / dist * PLAYER_SPEED; }
      }
      if (Phaser.Input.Keyboard.JustDown(this.keys.E) ||
          Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
        var self = this;
        this.district.contacts.forEach(function (c) {
          if (self.near(c.x, c.y, 80)) { self.talkTo(c); }
        });
      }
    }

    var nx = Phaser.Math.Clamp(px + vx * dt, 12, WORLD_W - 12);
    var ny = Phaser.Math.Clamp(py + vy * dt, 168, WORLD_H - 18);
    if (!this.hitsBuilding(nx, py)) { px = nx; }
    if (!this.hitsBuilding(px, ny)) { py = ny; }
    this.player.setPosition(px, py);
    this.playerName.setPosition(px, Math.min(py + 28, WORLD_H - 14));

    // Buildings fade as you walk toward the landmark (north).
    var t = Phaser.Math.Clamp((py - 170) / (790 - 170), 0, 1);
    if (this.buildingGroup) { this.buildingGroup.setAlpha(0.25 + 0.75 * t); }

    // Arrived at a contact after tapping them from afar.
    if (this.pendingTalk && !this.dialogueOpen && !this.sideOpen) {
      var c = this.contactById(this.pendingTalk);
      if (c && this.near(c.x, c.y, 80)) {
        this.pendingTalk = null;
        this.walkTarget = null;
        this.talkTo(c);
      }
    }

    // Mission step checks: tap steps complete by arriving at the target;
    // go steps complete by arriving at the step's x.
    var step = this.currentStep();
    if (step && !this.dialogueOpen && !this.sideOpen) {
      if (step.kind === 'tap') {
        if (Phaser.Math.Distance.Between(px, py, step.x, 566) < 42) {
          this.advanceStep();
        }
      } else if (step.kind === 'go') {
        if (this.stepStartX === null) { this.stepStartX = px; }
        var d = Math.abs(px - step.x);
        var travelled = Math.abs(px - this.stepStartX);
        var farStart = Math.abs(step.x - this.stepStartX) > 200;
        if (d < 120 && (travelled > 150 || !farStart)) { this.advanceStep(); }
      }
    }

    // Mini-map player dot + visited places.
    var self2 = this;
    this.mapPlayerDot.setPosition(
      WORLD_W - 96 + 6 + (px / WORLD_W) * 76,
      4 + 4 + (py / WORLD_H) * 50
    );
    var changed = false;
    this.district.places.forEach(function (p) {
      if (Math.abs(px - p.x) < 150 && !self2.save.visited[p.id]) {
        self2.save.visited[p.id] = true; changed = true;
      }
    });
    if (changed) { this.persist(); this.drawMap(); }

    // Target glow when near.
    if (this.targetObj && step && step.kind === 'tap') {
      this.targetObj.setAlpha(Math.abs(px - step.x) < 160 ? 1 : 0.55);
    }

    // Emulation: people popping in and out, walkers, the cat.
    this.updateNpcs(time, dt);
  };

  DistrictScene.prototype.hitsBuilding = function (x, y) {
    for (var i = 0; i < this.buildingRects.length; i++) {
      var r = this.buildingRects[i];
      if (x > r.x - 8 && x < r.x + r.w + 8 && y > r.y - 6 && y < r.y + r.h + 6) { return true; }
    }
    return false;
  };

  } // end Phaser guard

  /* ---------- boot ---------- */

  function createGame(district, opts) {
    opts = opts || {};
    // opts.parent: the container element id (default 'game', as in the
    // standalone launchers). The live app passes 'phaser-game'.
    // opts.onMissionDone(contact, district): a substory mission finished.
    // opts.onSnap(district): the Chofu crowd cheered at the snap.
    // opts.onEvent(event, detail): any emulation event, for the page log.
    var parentId = opts.parent || 'game';
    var errs = validateDistrict(district);
    if (errs.length) {
      var el = document.getElementById(parentId);
      if (el) {
        el.innerHTML = '<p style="color:#fff;padding:24px;font-family:sans-serif">District data did not validate:<br>' +
          errs.map(function (e) { return '• ' + e; }).join('<br>') + '</p>';
      }
      throw new Error('District data invalid: ' + errs.join('; '));
    }
    if (typeof Phaser === 'undefined') {
      var el2 = document.getElementById(parentId);
      if (el2) {
        el2.innerHTML = '<p style="color:#fff;padding:24px;font-family:sans-serif">' +
          'Phaser failed to load. Check that phaser.min.js sits next to index.html.</p>';
      }
      throw new Error('Phaser not loaded');
    }
    var scene = new DistrictScene(district, opts);
    return new Phaser.Game({
      type: Phaser.AUTO,
      parent: parentId,
      width: WORLD_W,
      height: WORLD_H,
      backgroundColor: '#9db98a',
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: scene
    });
  }

  var api = {
    SAVE_KEY: SAVE_KEY,
    validateDistrict: validateDistrict,
    dayJobFor: dayJobFor,
    dailyContactFor: dailyContactFor,
    dayOfYear: dayOfYear,
    todayKey: todayKey,
    advanceMission: advanceMission,
    defaultDistrictSave: defaultDistrictSave,
    loadSave: loadSave,
    writeSave: writeSave,
    districtSave: districtSave,
    missionStateFor: missionStateFor,
    createGame: createGame,
    WORLD_W: WORLD_W,
    WORLD_H: WORLD_H
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  root.RT = api;
})(typeof window !== 'undefined' ? window : globalThis);
