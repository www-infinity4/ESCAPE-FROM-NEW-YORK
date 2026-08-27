'use strict';
/* =====================================================
   ESCAPE FROM NEW YORK – Game Logic
   State machine, snake mechanics, enemy AI, input
   ===================================================== */

/* ── CONSTANTS ────────────────────────────────────── */
const CW        = 600;   /* canvas width  */
const CH        = 500;   /* canvas height */
const HUD_H     = 58;    /* HUD height    */
const CELL      = 20;    /* grid cell px  */
const OX        = 0;     /* grid x offset */
const OY        = HUD_H; /* grid y offset */
const GRID_W    = Math.floor(CW / CELL);              /* 30 */
const GRID_H    = Math.floor((CH - HUD_H) / CELL);   /* 22 */

const DIR = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 };

const STATE = {
    TITLE:          'TITLE',
    SCENE_INTRO:    'SCENE_INTRO',
    QUIZ:           'QUIZ',
    QUIZ_RESULT:    'QUIZ_RESULT',
    SNAKE:          'SNAKE',
    LEVEL_COMPLETE: 'LEVEL_COMPLETE',
    GAME_OVER:      'GAME_OVER',
    VICTORY:        'VICTORY'
};

const QUIZ_TIME   = 15;   /* seconds per question          */
const SNAKE_TIME  = 90;   /* seconds for snake phase       */
const FOOD_TARGET = 8;    /* food items to collect per lvl */
const TOTAL_LVLS  = 10;

/* ── ENEMY SNAKE ──────────────────────────────────── */
class EnemySnake {
    constructor(x, y, level) {
        this.body   = Array.from({ length: 3 }, (_, i) => ({ x: x - i, y }));
        this.dir    = DIR.RIGHT;
        this.alive  = true;
        this.health = Math.floor((level - 1) / 3) + 1; /* 1–4 hp */
        this.moveInterval = Math.max(60, 200 - level * 8); /* ms; faster each level */
        this.lastMove     = 0;
        this.flashTimer   = 0;
    }

    step(playerHead, now, levelId) {
        if (!this.alive || now - this.lastMove < this.moveInterval) return;
        this.lastMove = now;

        const head = this.body[0];
        /* 65 % chance to chase player, 35 % random */
        if (Math.random() < 0.65) {
            const dx = playerHead.x - head.x;
            const dy = playerHead.y - head.y;
            if (Math.abs(dx) >= Math.abs(dy)) {
                this.dir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
            } else {
                this.dir = dy > 0 ? DIR.DOWN : DIR.UP;
            }
        } else {
            this.dir = Math.floor(Math.random() * 4);
        }

        let nx = head.x + [0, 1, 0, -1][this.dir];
        let ny = head.y + [-1, 0, 1, 0][this.dir];
        /* clamp to grid */
        nx = Math.max(0, Math.min(GRID_W - 1, nx));
        ny = Math.max(0, Math.min(GRID_H - 1, ny));

        this.body.unshift({ x: nx, y: ny });
        this.body.pop();
    }

    hit() {
        this.health -= 1;
        this.flashTimer = 0.3;
        if (this.health <= 0) this.alive = false;
    }
}

/* ── MAIN GAME CLASS ──────────────────────────────── */
class EscapeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx    = this.canvas.getContext('2d');
        this.readerHeading = document.getElementById('reader-heading');
        this.readerBody    = document.getElementById('reader-body');
        this.lastReaderKey = '';

        /* --- game state --- */
        this.state  = STATE.TITLE;
        this.level  = 1;
        this.score  = 0;
        this.lives  = 3;
        this.hi     = parseInt(localStorage.getItem('efny_hi') || '0');

        /* --- quiz state --- */
        this.qIndex      = 0;
        this.qCorrect    = 0;
        this.qTimer      = QUIZ_TIME;
        this.qSelected   = -1;
        this.selectedWrong = -1;
        this.qShowResult = false;
        this.qResultTimer= 0;

        /* --- snake state --- */
        this.snakeBody   = [];
        this.snakeDir    = DIR.RIGHT;
        this.pendingDir  = DIR.RIGHT;
        this.enemies     = [];
        this.foods       = [];
        this.snakeTimer  = SNAKE_TIME;
        this.foodCollected = 0;
        this.foodTarget  = FOOD_TARGET;
        this.snakeMoveMs = 200;   /* ms per step; decreases per level */
        this.lastStepMs  = 0;
        this.snakeBonus  = 0;

        /* --- anim --- */
        this.tick      = 0;
        this.lastTime  = 0;
        this.now       = 0;     /* performance.now() */

        /* --- scene intro --- */
        this.charCount   = 0;
        this.introReady  = false;

        /* --- effects --- */
        this.flashTimer  = 0;
        this.flashColor  = '#ffffff';

        this._setupInput();
        this._setupMobileControls();
        requestAnimationFrame((t) => this._loop(t));
    }

    /* ── MAIN LOOP ──────────────────────────────────── */
    _loop(ts) {
        const delta   = Math.min((ts - this.lastTime) / 1000, 0.1);
        this.lastTime = ts;
        this.now      = performance.now();
        this.tick    += delta;

        this._update(delta);
        this._render();

        requestAnimationFrame((t) => this._loop(t));
    }

    /* ── UPDATE ─────────────────────────────────────── */
    _update(dt) {
        if (this.flashTimer > 0) this.flashTimer -= dt;

        switch (this.state) {
            case STATE.TITLE:          this._updateTitle(dt);         break;
            case STATE.SCENE_INTRO:    this._updateSceneIntro(dt);    break;
            case STATE.QUIZ:           this._updateQuiz(dt);          break;
            case STATE.QUIZ_RESULT:    this._updateQuizResult(dt);    break;
            case STATE.SNAKE:          this._updateSnake(dt);         break;
            case STATE.LEVEL_COMPLETE: this._updateLevelComplete(dt); break;
            case STATE.GAME_OVER:      /* input driven */              break;
            case STATE.VICTORY:        /* input driven */              break;
        }
    }

    _updateTitle() { /* waiting for input */ }

    _updateSceneIntro(dt) {
        /* typewriter effect */
        const synopsis = this._currentLevel().synopsis;
        if (this.charCount < synopsis.length) {
            this.charCount += dt * 40; /* ~40 chars/sec */
        } else {
            this.introReady = true;
        }
    }

    _updateQuiz(dt) {
        this.qTimer -= dt;
        if (this.qTimer <= 0) {
            /* time up = wrong */
            this._submitAnswer(-1);
        }
    }

    _updateQuizResult(dt) {
        this.qResultTimer -= dt;
        if (this.qResultTimer <= 0) {
            this.qShowResult = false;
            this.qIndex++;
            if (this.qIndex >= 10) {
                this._startSnakePhase();
            } else {
                this._nextQuestion();
            }
        }
    }

    _updateSnake(dt) {
        this.snakeTimer -= dt;
        if (this.snakeTimer <= 0 || this.foodCollected >= this.foodTarget) {
            this._endSnakePhase(true);
            return;
        }
        /* step snake on interval */
        if (this.now - this.lastStepMs >= this.snakeMoveMs) {
            this.lastStepMs = this.now;
            this._stepSnake();
        }
        /* step enemies */
        for (const e of this.enemies) {
            if (e.alive) {
                const head = this.snakeBody[0];
                e.step(head, this.now, this.level);
                if (e.flashTimer > 0) e.flashTimer -= dt;
            }
        }
        this._checkCollisions();
    }

    _updateLevelComplete(dt) {
        this.flashTimer -= dt; /* reuse timer as pause */
        if (this.flashTimer <= 0 && this._waitingForInput) {
            /* wait for input now */
        }
        this._waitingForInput = true;
    }

    /* ── RENDER ─────────────────────────────────────── */
    _render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, CW, CH);

        switch (this.state) {
            case STATE.TITLE:
                drawTitle(ctx, CW, CH, this.tick);
                break;

            case STATE.SCENE_INTRO:
                drawSceneIntro(ctx, CW, CH, this._currentLevel(), this.tick, this.charCount);
                break;

            case STATE.QUIZ:
            case STATE.QUIZ_RESULT:
                drawQuiz(ctx, CW, CH, this._currentLevel(),
                    this._currentLevel().questions[this.qIndex],
                    {
                        qIndex: this.qIndex,
                        qCorrect: this.qCorrect,
                        qTimer:   this.qTimer,
                        qSelected:    this.qSelected,
                        qShowResult:  this.qShowResult,
                        selectedWrong: this.selectedWrong,
                        lives:  this.lives,
                        score:  this.score
                    });
                break;

            case STATE.SNAKE:
                this._renderSnake();
                break;

            case STATE.LEVEL_COMPLETE:
                drawLevelComplete(ctx, CW, CH, {
                    level:      this.level,
                    qCorrect:   this.qCorrect,
                    snakeBonus: this.snakeBonus,
                    score:      this.score
                });
                break;

            case STATE.GAME_OVER:
                drawGameOver(ctx, CW, CH, this.score);
                break;

            case STATE.VICTORY:
                drawVictory(ctx, CW, CH, this.score, this.tick);
                break;
        }

        /* screen flash overlay */
        if (this.flashTimer > 0) {
            drawFlash(ctx, CW, CH, this.flashColor, this.flashTimer * 0.8);
        }

        this._updateReader();
    }

    _escapeReaderText(value) {
        return String(value).replace(/[&<>"']/g, (char) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[char]);
    }

    _updateReader() {
        if (!this.readerHeading || !this.readerBody) return;

        const levelData = this._currentLevel();
        const stats = `<span class="reader-stats">LEVEL ${this.level} · LIVES ${this.lives} · SCORE ${String(this.score).padStart(7, '0')}</span>`;
        let heading = 'ESCAPE FROM NEW YORK';
        let body = 'Tap A to start. Turn the phone sideways for the largest game picture.';

        if (this.state === STATE.SCENE_INTRO) {
            heading = `LEVEL ${this.level}: ${levelData.name}`;
            body = `${stats}${this._escapeReaderText(levelData.scene)}<br>${this._escapeReaderText(levelData.synopsis).replace(/\n/g, '<br>')}<br><strong>Tap A to continue.</strong>`;
        } else if (this.state === STATE.QUIZ || this.state === STATE.QUIZ_RESULT) {
            const question = levelData.questions[this.qIndex];
            heading = `QUESTION ${this.qIndex + 1} OF 10`;
            const answers = question.opts.map((answer, index) =>
                `<span class="reader-answer">${String.fromCharCode(65 + index)}. ${this._escapeReaderText(answer)}</span>`
            ).join('');
            const result = this.qShowResult
                ? `<br><strong>${this.qSelected === question.correct ? 'CORRECT!' : `WRONG. Correct answer: ${String.fromCharCode(65 + question.correct)}.`}</strong>`
                : '';
            body = `${stats}${this._escapeReaderText(question.q)}${answers}${result}`;
        } else if (this.state === STATE.SNAKE) {
            heading = `ACTION: ${levelData.name}`;
            body = `${stats}Use the direction pad. Collect items and avoid enemies. Items: ${this.foodCollected}/${this.foodTarget}.`;
        } else if (this.state === STATE.LEVEL_COMPLETE) {
            heading = `LEVEL ${this.level} COMPLETE`;
            body = `${stats}Quiz: ${this.qCorrect}/10 correct. Tap A to continue.`;
        } else if (this.state === STATE.GAME_OVER) {
            heading = 'GAME OVER';
            body = `${stats}Tap A to try again.`;
        } else if (this.state === STATE.VICTORY) {
            heading = 'NEW YORK ESCAPED';
            body = `${stats}Mission complete. Tap A to play again.`;
        }

        const key = heading + '|' + body;
        if (key !== this.lastReaderKey) {
            this.readerHeading.textContent = heading;
            this.readerBody.innerHTML = body;
            this.lastReaderKey = key;
        }
    }

    _renderSnake() {
        const ctx = this.ctx;
        const pal = this._currentLevel().palette;

        /* grid background */
        drawGridBackground(ctx, CW, CH, CELL, OX, OY, pal);

        /* foods */
        for (const f of this.foods) {
            drawFood(ctx, f, CELL, OX, OY, this.tick);
        }

        /* enemies */
        for (const e of this.enemies) {
            if (e.alive) {
                if (e.flashTimer > 0) {
                    ctx.save();
                    ctx.globalAlpha = 0.5 + Math.sin(this.tick * 20) * 0.5;
                }
                drawEnemy(ctx, e, CELL, OX, OY);
                if (e.flashTimer > 0) ctx.restore();
            }
        }

        /* player snake */
        drawSnakeBody(ctx, this.snakeBody, CELL, OX, OY, this.level);

        /* HUD on top */
        drawSnakeHUD(ctx, CW, HUD_H, {
            level:         this.level,
            score:         this.score,
            lives:         this.lives,
            foodCollected: this.foodCollected,
            foodTarget:    this.foodTarget,
            snakeTimer:    this.snakeTimer
        });

        /* level name watermark */
        ctx.save();
        ctx.globalAlpha  = 0.12;
        ctx.font         = 'bold 18px "Courier New"';
        ctx.fillStyle    = '#00ff00';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(this._currentLevel().name, CW / 2, CH - 4);
        ctx.restore();
    }

    /* ── SNAKE PHASE SETUP ──────────────────────────── */
    _startSnakePhase() {
        const lvl = this._currentLevel();
        /* snake starts at centre, length 5 */
        const sx = Math.floor(GRID_W / 2);
        const sy = Math.floor(GRID_H / 2);
        this.snakeBody = Array.from({ length: 5 }, (_, i) => ({ x: sx - i, y: sy }));
        this.snakeDir  = DIR.RIGHT;
        this.pendingDir = DIR.RIGHT;

        /* difficulty scales per level */
        this.snakeMoveMs  = Math.max(90, 220 - this.level * 12);
        this.snakeTimer   = SNAKE_TIME;
        this.foodCollected = 0;
        this.foodTarget   = FOOD_TARGET;
        this.snakeBonus   = 0;

        /* spawn enemies based on level config */
        this.enemies = [];
        const eCfg   = lvl.enemy;
        for (let i = 0; i < eCfg.count; i++) {
            let ex, ey;
            do {
                ex = Math.floor(Math.random() * GRID_W);
                ey = Math.floor(Math.random() * GRID_H);
            } while (this._distToSnake(ex, ey) < 8);
            const e = new EnemySnake(ex, ey, this.level);
            e.moveInterval = eCfg.speed;
            this.enemies.push(e);
        }

        /* spawn initial food */
        this.foods = [];
        for (let i = 0; i < 5; i++) this._spawnFood();

        /* quiz bonus: extra food pre-spawned for good quiz performance */
        const bonus = Math.floor(this.qCorrect / 3); /* 0-3 bonus */
        for (let i = 0; i < bonus; i++) this._spawnFood(true);

        this.lastStepMs = this.now;
        this.state = STATE.SNAKE;
    }

    _spawnFood(bonus) {
        let fx, fy, tries = 0;
        do {
            fx = Math.floor(Math.random() * GRID_W);
            fy = Math.floor(Math.random() * GRID_H);
            tries++;
        } while (tries < 50 && (
            this._snakeAt(fx, fy) ||
            this.foods.some(f => f.x === fx && f.y === fy)
        ));
        this.foods.push({ x: fx, y: fy, bonus: !!bonus });
    }

    /* ── SNAKE STEP ─────────────────────────────────── */
    _stepSnake() {
        this.snakeDir = this.pendingDir;
        const head    = this.snakeBody[0];
        const nx      = head.x + [0, 1, 0, -1][this.snakeDir];
        const ny      = head.y + [-1, 0, 1, 0][this.snakeDir];

        /* wall collision */
        if (nx < 0 || nx >= GRID_W || ny < 0 || ny >= GRID_H) {
            this._snakeDie();
            return;
        }

        /* self collision */
        if (this._snakeAt(nx, ny)) {
            this._snakeDie();
            return;
        }

        this.snakeBody.unshift({ x: nx, y: ny });

        /* food check */
        const fi = this.foods.findIndex(f => f.x === nx && f.y === ny);
        if (fi !== -1) {
            const f = this.foods.splice(fi, 1)[0];
            this.foodCollected++;
            const pts = f.bonus ? 150 : 50;
            this.score += pts;
            this.snakeBonus += pts;
            this._flash('#00ff00', 0.2);
            /* grow – don't pop tail */
            if (this.foods.length < 4) this._spawnFood();
        } else {
            this.snakeBody.pop();
        }
    }

    _snakeDie() {
        this.lives--;
        this._flash('#ff0000', 0.4);
        if (this.lives <= 0) {
            this._endSnakePhase(false);
        } else {
            /* respawn snake at centre */
            const sx = Math.floor(GRID_W / 2);
            const sy = Math.floor(GRID_H / 2);
            this.snakeBody = Array.from({ length: 5 }, (_, i) => ({ x: sx - i, y: sy }));
            this.snakeDir  = DIR.RIGHT;
            this.pendingDir = DIR.RIGHT;
        }
    }

    /* ── COLLISION CHECKS ───────────────────────────── */
    _checkCollisions() {
        if (this.snakeBody.length === 0) return;
        const head = this.snakeBody[0];

        for (const e of this.enemies) {
            if (!e.alive) continue;
            /* player head hits enemy head or body */
            if (e.body.some(s => s.x === head.x && s.y === head.y)) {
                e.hit();
                if (e.alive) {
                    this._snakeDie();
                } else {
                    /* enemy killed */
                    this.score += 200 + this.level * 20;
                    this.snakeBonus += 200;
                    this._flash('#ffcc00', 0.25);
                    /* respawn enemy at edge */
                    const ne = new EnemySnake(
                        Math.random() < 0.5 ? 0 : GRID_W - 1,
                        Math.floor(Math.random() * GRID_H),
                        this.level
                    );
                    ne.moveInterval = this._currentLevel().enemy.speed;
                    /* replace dead enemy */
                    const idx = this.enemies.indexOf(e);
                    this.enemies[idx] = ne;
                }
                return;
            }
        }
    }

    /* ── END SNAKE PHASE ────────────────────────────── */
    _endSnakePhase(won) {
        if (!won) {
            this._saveHi();
            this.state = STATE.GAME_OVER;
            return;
        }
        this.score += 1000; /* level clear bonus */
        this._waitingForInput = false;
        this.flashTimer = 0.5;
        this.state = STATE.LEVEL_COMPLETE;
    }

    /* ── QUIZ LOGIC ─────────────────────────────────── */
    _nextQuestion() {
        this.qTimer    = QUIZ_TIME;
        this.qSelected = -1;
        this.selectedWrong = -1;
        this.qShowResult = false;
        this.state = STATE.QUIZ;
    }

    _submitAnswer(idx) {
        const q = this._currentLevel().questions[this.qIndex];
        this.qSelected = idx;
        const correct  = (idx === q.correct);

        if (correct) {
            this.qCorrect++;
            this.score   += 100;
            this.selectedWrong = -1;
            this._flash('#00ff00', 0.3);
        } else {
            this.lives   = Math.max(0, this.lives - 1);
            this.selectedWrong = idx;
            this._flash('#ff0000', 0.35);
            if (this.lives <= 0) {
                this._saveHi();
                this.state = STATE.GAME_OVER;
                return;
            }
        }
        this.qShowResult  = true;
        this.qResultTimer = 1.8; /* seconds to show result */
        this.state = STATE.QUIZ_RESULT;
    }

    /* ── TRANSITIONS ────────────────────────────────── */
    _startLevel(lvl) {
        this.level     = lvl;
        this.qIndex    = 0;
        this.qCorrect  = 0;
        this.qTimer    = QUIZ_TIME;
        this.qSelected = -1;
        this.selectedWrong = -1;
        this.qShowResult = false;
        this.charCount   = 0;
        this.introReady  = false;
        this.state       = STATE.SCENE_INTRO;
    }

    _startGame() {
        this.level  = 1;
        this.score  = 0;
        this.lives  = 3;
        this._startLevel(1);
    }

    /* ── INPUT HANDLER ──────────────────────────────── */
    _handleDir(dir) {
        if (this.state === STATE.SNAKE) {
            /* prevent 180-degree reversal */
            const opp = [2, 3, 0, 1]; /* opposite dirs */
            if (dir !== opp[this.snakeDir]) {
                this.pendingDir = dir;
            }
        }
        if (this.state === STATE.QUIZ || this.state === STATE.QUIZ_RESULT) {
            /* Arrow keys navigate answer options */
            const map = {
                [DIR.UP]:    -2,
                [DIR.DOWN]:  2,
                [DIR.LEFT]:  -1,
                [DIR.RIGHT]: 1
            };
            let next = (this.qSelected === -1 ? 0 : this.qSelected) + (map[dir] || 0);
            next = Math.max(0, Math.min(3, next));
            if (this.state === STATE.QUIZ) this.qSelected = next;
        }
    }

    _handleAction(btn) {
        switch (this.state) {
            case STATE.TITLE:
                this._startGame();
                break;

            case STATE.SCENE_INTRO:
                if (this.introReady) {
                    this._nextQuestion();
                } else {
                    /* skip typewriter */
                    this.charCount   = this._currentLevel().synopsis.length + 1;
                    this.introReady  = true;
                }
                break;

            case STATE.QUIZ:
                if (this.qSelected >= 0) {
                    this._submitAnswer(this.qSelected);
                } else {
                    /* default to first option if none selected */
                    this.qSelected = 0;
                }
                break;

            case STATE.QUIZ_RESULT:
                /* speed through result */
                this.qResultTimer = 0.01;
                break;

            case STATE.LEVEL_COMPLETE:
                if (this._waitingForInput) {
                    if (this.level >= TOTAL_LVLS) {
                        this._saveHi();
                        this.state = STATE.VICTORY;
                    } else {
                        this._startLevel(this.level + 1);
                    }
                }
                break;

            case STATE.GAME_OVER:
            case STATE.VICTORY:
                this._startGame();
                break;
        }
    }

    _handleAnswerKey(idx) {
        if (this.state !== STATE.QUIZ) return;
        this.qSelected = idx;
        this._submitAnswer(idx);
    }

    _handleCanvasClick(x, y) {
        if (this.state === STATE.QUIZ) {
            /* detect which answer box was clicked */
            const opts = this._currentLevel().questions[this.qIndex].opts;
            opts.forEach((_, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const bx  = 10 + col * (CW/2 - 15);
                const by  = 170 + row * 70;
                const bw  = CW/2 - 20;
                const bh  = 58;
                if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) {
                    this.qSelected = i;
                    this._submitAnswer(i);
                }
            });
        } else {
            this._handleAction('A');
        }
    }

    /* ── INPUT SETUP ────────────────────────────────── */
    /* Called once from the constructor. Exactly one EscapeGame instance is
       created (via the window load handler below), so these listeners are
       registered only once for the lifetime of the page. */
    _setupInput() {
        document.addEventListener('keydown', (e) => {
            const noScroll = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '];
            if (noScroll.includes(e.key)) e.preventDefault();

            switch (e.key) {
                case 'ArrowUp':    case 'w': case 'W': this._handleDir(DIR.UP);    break;
                case 'ArrowDown':  case 's': case 'S': this._handleDir(DIR.DOWN);  break;
                case 'ArrowLeft':  case 'a': case 'A': this._handleDir(DIR.LEFT);  break;
                case 'ArrowRight': case 'd': case 'D': this._handleDir(DIR.RIGHT); break;
                case ' ': case 'Enter': this._handleAction('A'); break;
                case 'Escape': case 'p': case 'P':     this._handleAction('START');break;
                case '1': this._handleAnswerKey(0); break;
                case '2': this._handleAnswerKey(1); break;
                case '3': this._handleAnswerKey(2); break;
                case '4': this._handleAnswerKey(3); break;
            }
        });

        this.canvas.addEventListener('click', (e) => {
            const r  = this.canvas.getBoundingClientRect();
            const sx = CW / r.width;
            const sy = CH / r.height;
            this._handleCanvasClick(
                (e.clientX - r.left) * sx,
                (e.clientY - r.top)  * sy
            );
        });

        /* Touch swipe for snake direction */
        let tx0 = 0, ty0 = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            tx0 = e.touches[0].clientX;
            ty0 = e.touches[0].clientY;
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const dx = e.changedTouches[0].clientX - tx0;
            const dy = e.changedTouches[0].clientY - ty0;
            const ad = Math.abs(dx), bd = Math.abs(dy);

            if (ad < 10 && bd < 10) {
                /* tap */
                const r  = this.canvas.getBoundingClientRect();
                const sx = CW / r.width;
                const sy = CH / r.height;
                this._handleCanvasClick(
                    (e.changedTouches[0].clientX - r.left) * sx,
                    (e.changedTouches[0].clientY - r.top)  * sy
                );
            } else if (ad > bd) {
                this._handleDir(dx > 0 ? DIR.RIGHT : DIR.LEFT);
            } else {
                this._handleDir(dy > 0 ? DIR.DOWN : DIR.UP);
            }
        }, { passive: false });
    }

    _setupMobileControls() {
        const map = {
            'btn-up':    () => this._handleDir(DIR.UP),
            'btn-down':  () => this._handleDir(DIR.DOWN),
            'btn-left':  () => this._handleDir(DIR.LEFT),
            'btn-right': () => this._handleDir(DIR.RIGHT),
            'btn-a':     () => this._handleAction('A'),
            'btn-b':     () => this._handleAction('B'),
            'btn-start': () => this._handleAction('START')
        };
        for (const [id, fn] of Object.entries(map)) {
            const el = document.getElementById(id);
            if (!el) continue;
            el.addEventListener('touchstart', (e) => {
                e.preventDefault();
                fn();
            }, { passive: false });
            el.addEventListener('mousedown', (e) => {
                e.preventDefault();
                fn();
            });
        }
    }

    /* ── HELPERS ────────────────────────────────────── */
    _currentLevel() {
        return GAME_DATA.levels[Math.min(this.level, TOTAL_LVLS) - 1];
    }

    _snakeAt(x, y) {
        return this.snakeBody.some(s => s.x === x && s.y === y);
    }

    _distToSnake(x, y) {
        if (this.snakeBody.length === 0) return 999;
        const h = this.snakeBody[0];
        return Math.abs(h.x - x) + Math.abs(h.y - y);
    }

    _flash(color, dur) {
        this.flashColor = color;
        this.flashTimer = dur;
    }

    _saveHi() {
        if (this.score > this.hi) {
            this.hi = this.score;
            localStorage.setItem('efny_hi', String(this.hi));
        }
    }
}

/* ── BOOT ─────────────────────────────────────────── */
window.addEventListener('load', () => {
    new EscapeGame();
});
