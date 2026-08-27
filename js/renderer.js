'use strict';
/* =====================================================
   ESCAPE FROM NEW YORK – Renderer
   All canvas-drawing helpers: pixel-art scenes, HUD,
   menus, quiz, snake segments, enemies, food
   ===================================================== */

/* ── helpers ──────────────────────────────────────── */
function px(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function textLine(ctx, text, x, y, color, size, align) {
    ctx.save();
    size = Math.max(size || 14, 16);
    ctx.fillStyle    = color || '#00ff00';
    ctx.font         = size + 'px "Courier New", monospace';
    ctx.textAlign    = align || 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
    ctx.restore();
}

function glowText(ctx, text, x, y, color, size, align, glowColor) {
    ctx.save();
    size = Math.max(size || 14, 16);
    ctx.font         = size + 'px "Courier New", monospace';
    ctx.textAlign    = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor  = glowColor || color || '#00ff00';
    ctx.shadowBlur   = 12;
    ctx.fillStyle    = color || '#00ff00';
    ctx.fillText(text, x, y);
    ctx.restore();
}

/* wrap text to fit within maxWidth, returns array of lines */
function wrapText(ctx, text, maxWidth, size) {
    size = Math.max(size || 14, 16);
    const words = text.split(' ');
    const lines = [];
    let line    = '';
    ctx.font = size + 'px "Courier New", monospace';
    for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines;
}

/* ── TITLE SCREEN ────────────────────────────────── */
function drawTitle(ctx, W, H, tick) {
    /* dark bg */
    px(ctx, 0, 0, W, H, '#000');

    /* star field */
    ctx.save();
    for (let i = 0; i < 80; i++) {
        const sx = ((i * 137 + 17) % W);
        const sy = ((i * 251 + 31) % (H - 60));
        const bright = (Math.sin(tick * 1.5 + i) * 0.5 + 0.5);
        ctx.fillStyle = `rgba(255,255,255,${bright * 0.6})`;
        ctx.fillRect(sx, sy, 1, 1);
    }
    ctx.restore();

    /* silhouette city skyline */
    const skyline = [
        [0,380,40,120], [40,340,30,160], [70,350,25,150], [95,360,20,140],
        [115,320,35,180],[150,370,25,130],[175,300,40,200],[215,345,30,155],
        [245,355,25,145],[270,310,45,190],[315,380,20,120],[335,330,35,170],
        [370,360,20,140],[390,320,40,180],[430,350,25,150],[455,370,30,130],
        [485,300,45,200],[530,345,25,155],[555,360,20,140],[575,330,25,170]
    ];
    ctx.fillStyle = '#050510';
    for (const [bx,by,bw,bh] of skyline) {
        ctx.fillRect(bx, by, bw, bh);
    }
    /* windows (flicker) */
    ctx.fillStyle = '#ffee88';
    for (let i = 0; i < 120; i++) {
        const bx = skyline[i % skyline.length][0];
        const bw = skyline[i % skyline.length][2];
        const by = skyline[i % skyline.length][1];
        const bh = skyline[i % skyline.length][3];
        if (Math.sin(tick * 0.8 + i * 3.7) > 0.6) {
            const wx = bx + 3 + (i * 7) % (bw - 8);
            const wy = by + 5 + (i * 11) % (bh - 10);
            ctx.fillRect(wx, wy, 4, 4);
        }
    }

    /* wall across bottom */
    px(ctx, 0, H - 60, W, 60, '#111');
    px(ctx, 0, H - 60, W, 3, '#333');
    /* prison fence spikes */
    for (let i = 0; i < W; i += 20) {
        px(ctx, i + 8, H - 76, 4, 16, '#222');
        px(ctx, i + 8, H - 80, 2, 6, '#333');
    }

    /* title text */
    glowText(ctx, 'ESCAPE FROM', W/2, 100, '#ff4400', 28, 'center', '#ff2200');
    glowText(ctx, 'NEW YORK', W/2, 140, '#ff4400', 36, 'center', '#ff2200');

    /* subtitle */
    glowText(ctx, '— T H E   G A M E —', W/2, 195, '#888800', 16, 'center', '#555500');

    /* press start blink */
    if (Math.floor(tick * 1.5) % 2 === 0) {
        glowText(ctx, 'PRESS  ENTER / A  TO  START', W/2, 280, '#00ff00', 15, 'center', '#00aa00');
    }

    /* hi-score */
    const hi = parseInt(localStorage.getItem('efny_hi') || '0');
    textLine(ctx, 'HI-SCORE: ' + String(hi).padStart(7, '0'), W/2 - 80, 320, '#ffff00', 13);

    /* credits */
    textLine(ctx, 'BASED ON THE 1981 FILM BY JOHN CARPENTER', W/2, 460, '#444', 11, 'center');
    textLine(ctx, 'ARROW KEYS / WASD  ·  ENTER / A = CONFIRM', W/2, 476, '#333', 11, 'center');

    /* scanlines */
    ctx.save();
    for (let y = 0; y < H; y += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, y, W, 1);
    }
    ctx.restore();
}

/* ── SCENE INTRO ─────────────────────────────────── */
function drawSceneIntro(ctx, W, H, levelData, tick, charCount) {
    const pal = levelData.palette;

    /* sky gradient */
    const grad = ctx.createLinearGradient(0, 0, 0, H * 0.65);
    grad.addColorStop(0, pal.dark);
    grad.addColorStop(1, pal.sky);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H * 0.65);

    /* draw pixel-art scene based on level id */
    drawLevelScene(ctx, W, H, levelData, tick);

    /* semi-transparent text panel */
    px(ctx, 0, H * 0.55, W, H * 0.45, 'rgba(0,0,0,0.82)');
    px(ctx, 0, H * 0.55, W, 2, pal.accent);

    /* level name */
    glowText(ctx, levelData.name, W/2, H * 0.55 + 20, pal.hi, 17, 'center', pal.accent);
    textLine(ctx, levelData.scene, W/2 - ctx.measureText(levelData.scene).width/2 - 1,
             H * 0.55 + 42, '#888', 11);

    /* typewriter synopsis */
    const full   = levelData.synopsis;
    const shown  = full.slice(0, Math.floor(charCount));
    const lines  = shown.split('\n');
    const startY = H * 0.55 + 62;
    lines.forEach((line, i) => {
        textLine(ctx, line, 20, startY + i * 18, '#cccccc', 12);
    });

    /* continue prompt */
    const doneTyping = charCount >= full.length;
    if (doneTyping && Math.floor(tick * 1.5) % 2 === 0) {
        glowText(ctx, '▶  PRESS A / ENTER TO START QUIZ', W/2, H - 18, '#00ff00', 13, 'center', '#003300');
    }
}

/* ── PIXEL-ART SCENE BACKGROUNDS ─────────────────── */
function drawLevelScene(ctx, W, H, levelData, tick) {
    const id  = levelData.id;
    const pal = levelData.palette;
    const SH  = H * 0.6; /* scene height */

    switch (id) {
        case 1: drawScene_Prison(ctx, W, SH, pal, tick); break;
        case 2: drawScene_Crash(ctx, W, SH, pal, tick); break;
        case 3: drawScene_Streets(ctx, W, SH, pal, tick); break;
        case 4: drawScene_Duke(ctx, W, SH, pal, tick); break;
        case 5: drawScene_Underground(ctx, W, SH, pal, tick); break;
        case 6: drawScene_Tower(ctx, W, SH, pal, tick); break;
        case 7: drawScene_Arena(ctx, W, SH, pal, tick); break;
        case 8: drawScene_Chase(ctx, W, SH, pal, tick); break;
        case 9: drawScene_Bridge(ctx, W, SH, pal, tick); break;
        case 10: drawScene_Final(ctx, W, SH, pal, tick); break;
        default: px(ctx, 0, 0, W, SH, pal.sky);
    }
}

/* Scene 1: Prison Island – searchlights, massive wall */
function drawScene_Prison(ctx, W, H, pal, tick) {
    px(ctx, 0, 0, W, H, pal.dark);
    /* moon */
    ctx.save(); ctx.fillStyle = '#ccccdd';
    ctx.beginPath(); ctx.arc(500, 40, 22, 0, Math.PI*2); ctx.fill();
    ctx.restore();
    /* distant city silhouette */
    ctx.fillStyle = '#050518';
    for (let i = 0; i < 20; i++) {
        const bx = i * 32, bw = 24;
        const bh = 60 + (i * 17 % 80);
        ctx.fillRect(bx, H - 100 - bh, bw, bh);
    }
    /* massive wall */
    px(ctx, 0, H - 100, W, 100, '#1a1a2a');
    px(ctx, 0, H - 100, W, 4, '#333');
    /* wall battlements */
    for (let i = 0; i < W; i += 30) {
        px(ctx, i, H - 118, 20, 18, '#222');
    }
    /* searchlights sweep */
    const a1 = Math.sin(tick * 0.7) * 0.5;
    const a2 = Math.sin(tick * 0.5 + 2) * 0.5;
    [{ bx: 80, a: a1 }, { bx: 500, a: a2 }].forEach(({ bx, a }) => {
        ctx.save();
        ctx.translate(bx, H - 98);
        ctx.rotate(a);
        const grad = ctx.createLinearGradient(0, 0, 0, -200);
        grad.addColorStop(0, 'rgba(200,200,255,0.3)');
        grad.addColorStop(1, 'rgba(200,200,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(-60, -200);
        ctx.lineTo(60, -200);
        ctx.lineTo(5, 0);
        ctx.fill();
        ctx.restore();
    });
    /* sign */
    px(ctx, W/2 - 120, H - 90, 240, 32, '#111');
    glowText(ctx, 'MANHATTAN MAX-SECURITY PRISON', W/2, H - 74, '#ff3300', 11, 'center', '#550000');
}

/* Scene 2: Air Force One crash – flames, wreckage */
function drawScene_Crash(ctx, W, H, pal, tick) {
    px(ctx, 0, 0, W, H, '#0d0000');
    /* smoke clouds */
    ctx.save();
    for (let i = 0; i < 6; i++) {
        const cx = 80 + i * 90, cy = 40 + (i % 3) * 20;
        const r  = 35 + (i * 7 % 20);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, 'rgba(60,40,30,0.9)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    /* plane wreckage shapes */
    ctx.fillStyle = '#443333';
    ctx.beginPath(); ctx.moveTo(60, H-60); ctx.lineTo(250, H-120);
    ctx.lineTo(280, H-90); ctx.lineTo(90, H-40); ctx.fill();
    ctx.fillStyle = '#332222';
    ctx.beginPath(); ctx.moveTo(200, H-80); ctx.lineTo(340, H-130);
    ctx.lineTo(360, H-100); ctx.lineTo(220, H-50); ctx.fill();
    /* flames flicker */
    const flames = [[100, H-80],[160, H-70],[230, H-90],[310, H-75],[400, H-65],[460, H-80]];
    flames.forEach(([fx, fy], i) => {
        const h2 = 20 + Math.sin(tick * 6 + i) * 10;
        const grad = ctx.createLinearGradient(fx, fy, fx, fy - h2);
        grad.addColorStop(0, '#ff4400');
        grad.addColorStop(0.5, '#ff8800');
        grad.addColorStop(1, 'rgba(255,200,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(fx - 6, fy - h2, 12, h2);
    });
    /* street / ground */
    px(ctx, 0, H - 50, W, 50, '#1a0000');
    px(ctx, 0, H - 50, W, 2, '#330000');
    /* rubble pixels */
    ctx.fillStyle = '#333';
    for (let i = 0; i < 30; i++) {
        ctx.fillRect(20 + i * 20, H - 50 + (i % 3) * 5, 8 + (i % 5) * 2, 6 + i % 8);
    }
}

/* Scene 3: Dark streets – cab, gang silhouettes */
function drawScene_Streets(ctx, W, H, pal, tick) {
    px(ctx, 0, 0, W, H, '#0a0a0a');
    /* buildings */
    ctx.fillStyle = '#111';
    const b = [[0,200,60,H],[70,160,50,H],[130,180,40,H],[180,140,60,H],
               [250,170,45,H],[305,150,55,H],[370,185,40,H],[420,155,55,H],[485,175,50,H],[545,160,55,H]];
    b.forEach(([bx,by,bw]) => ctx.fillRect(bx, by, bw, H-by));
    /* windows */
    ctx.fillStyle = '#ffee88';
    for (let i = 0; i < 60; i++) {
        const bi = i % b.length;
        if (Math.sin(tick * 0.3 + i * 2.1) > 0.4) {
            const building  = b[bi];
            const windowX   = building[0] + 5 + (i * 7 % (building[2] - 12));
            const windowY   = building[1] + 10 + (i * 11 % (H - building[1] - 30));
            ctx.fillRect(windowX, windowY, 5, 5);
        }
    }
    /* street */
    px(ctx, 0, H-60, W, 60, '#181818');
    px(ctx, 0, H-60, W, 2, '#333');
    /* centre line */
    for (let i = 0; i < W; i += 40) {
        px(ctx, i, H-32, 24, 4, '#444');
    }
    /* taxi cab */
    const tx = 80 + Math.sin(tick * 0.4) * 5;
    px(ctx, tx, H-82, 80, 22, '#cc9900');
    px(ctx, tx+8, H-96, 60, 16, '#aa7700');
    px(ctx, tx+12, H-94, 18, 12, '#334');
    px(ctx, tx+42, H-94, 18, 12, '#334');
    px(ctx, tx+6, H-60, 16, 10, '#222');
    px(ctx, tx+58, H-60, 16, 10, '#222');
    /* christmas lights on cab */
    const cols = ['#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff'];
    for (let i = 0; i < 10; i++) {
        ctx.fillStyle = cols[i % cols.length];
        ctx.fillRect(tx + 4 + i * 7, H - 85, 4, 4);
    }
    /* gang silhouettes */
    [420, 460, 510, 550].forEach((gx, i) => {
        px(ctx, gx, H-100+i%2*4, 14, 40, '#050505');
    });
    /* street lamp */
    px(ctx, 300, H-130, 4, 70, '#222');
    px(ctx, 285, H-130, 34, 4, '#222');
    const lampGrad = ctx.createRadialGradient(302, H-128, 2, 302, H-128, 60);
    lampGrad.addColorStop(0, 'rgba(255,220,100,0.3)');
    lampGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = lampGrad;
    ctx.fillRect(242, H-188, 120, 120);
}

/* Scene 4: Duke's domain – purple throne room */
function drawScene_Duke(ctx, W, H, pal, tick) {
    px(ctx, 0, 0, W, H, '#0d0010');
    /* columns */
    for (let i = 0; i < 5; i++) {
        const cx = 40 + i * 130;
        px(ctx, cx, 0, 24, H-50, '#1a001a');
        px(ctx, cx-4, 0, 32, 16, '#220022');
    }
    /* floor */
    px(ctx, 0, H-50, W, 50, '#110011');
    for (let i = 0; i < W; i += 40) {
        px(ctx, i, H-50, 2, 50, '#1a001a');
    }
    /* throne */
    px(ctx, W/2-40, H-180, 80, 130, '#330033');
    px(ctx, W/2-50, H-120, 100, 20, '#440044');
    px(ctx, W/2-20, H-200, 40, 30, '#550055');
    /* candles / torches */
    const torches = [60, 150, W-150, W-60];
    torches.forEach((tx, i) => {
        px(ctx, tx, H-160, 8, 80, '#222');
        const fh = 16 + Math.sin(tick*5+i)*4;
        const fg = ctx.createLinearGradient(tx+4, H-160, tx+4, H-160-fh);
        fg.addColorStop(0, '#ff6600'); fg.addColorStop(1, 'rgba(255,200,0,0)');
        ctx.fillStyle = fg;
        ctx.fillRect(tx, H-160-fh, 8, fh);
    });
    /* limo grill at bottom */
    px(ctx, W/2-90, H-50, 180, 50, '#1a001a');
    /* chandelier */
    px(ctx, W/2-3, 20, 6, 60, '#330033');
    for (let i = -4; i <= 4; i++) {
        const cdy = 60 + Math.abs(i)*8;
        ctx.fillStyle = Math.floor(tick*3+i) % 2 === 0 ? '#ffcc00' : '#886600';
        ctx.fillRect(W/2+i*14-2, cdy, 5, 8);
    }
}

/* Scene 5: Underground tunnels – pipes, green glow */
function drawScene_Underground(ctx, W, H, pal, tick) {
    px(ctx, 0, 0, W, H, '#000500');
    /* tunnel arch */
    ctx.save();
    ctx.fillStyle = '#001500';
    ctx.beginPath();
    ctx.arc(W/2, H+40, W*0.55, Math.PI, 0, false);
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    ctx.restore();
    /* tunnel walls */
    ctx.fillStyle = '#002200';
    ctx.fillRect(0, 0, 60, H);
    ctx.fillRect(W-60, 0, 60, H);
    /* pipes */
    [[20,0,20,H,'#114411'],[W-40,0,20,H,'#114411'],
     [0,H*0.3,W,16,'#113311'],[0,H*0.6,W,12,'#113311']].forEach(
        ([px2,py2,pw,ph,c]) => { ctx.fillStyle=c; ctx.fillRect(px2,py2,pw,ph); });
    /* dripping water */
    for (let i = 0; i < 8; i++) {
        const dx = 60 + i * 70;
        const dy = H*0.3 + 14 + ((tick*60 + i*30) % (H*0.4));
        ctx.fillStyle = 'rgba(0,200,0,0.5)';
        ctx.fillRect(dx, dy, 2, 8);
    }
    /* green ambient glow patches */
    [[100,H-60],[300,H-40],[500,H-60]].forEach(([gx,gy]) => {
        const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, 80);
        rg.addColorStop(0,'rgba(0,120,0,0.25)'); rg.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle = rg; ctx.fillRect(gx-80, gy-80, 160, 160);
    });
    /* floor */
    px(ctx, 0, H-30, W, 30, '#001100');
    px(ctx, 0, H-30, W, 2, '#003300');
    /* Crazy silhouettes lurking */
    [180, 350, 450].forEach((cx, i) => {
        const bob = Math.sin(tick * 1.5 + i) * 3;
        px(ctx, cx, H-80+bob, 12, 50, '#000800');
    });
}

/* Scene 6: Tower – tall building, climbing silhouette */
function drawScene_Tower(ctx, W, H, pal, tick) {
    px(ctx, 0, 0, W, H, '#050500');
    /* background sky with faint stars */
    for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(255,255,200,${0.3+Math.sin(tick+i)*0.15})`;
        ctx.fillRect((i*137+7)%W, (i*251+3)%(H*0.8), 1, 1);
    }
    /* main tower */
    px(ctx, W/2-50, 0, 100, H-40, '#111100');
    /* tower windows */
    for (let row = 0; row < 12; row++) {
        for (let col = 0; col < 3; col++) {
            const wx = W/2 - 36 + col * 26;
            const wy = 20 + row * 18;
            const lit = Math.sin(tick*0.5+row*1.3+col*2.1) > 0.3;
            ctx.fillStyle = lit ? '#aaaa44' : '#222200';
            ctx.fillRect(wx, wy, 14, 10);
        }
    }
    /* side buildings */
    px(ctx, 0, 60, 70, H-60, '#0a0a00');
    px(ctx, W-70, 80, 70, H-80, '#0a0a00');
    /* climbing figure */
    const climbY = H - 60 - (tick * 12) % (H - 80);
    px(ctx, W/2+2, climbY, 10, 20, '#006600');
    px(ctx, W/2+4, climbY-8, 6, 8, '#005500');
    /* ground */
    px(ctx, 0, H-40, W, 40, '#0d0d00');
    px(ctx, 0, H-40, W, 2, '#333300');
}

/* Scene 7: Arena – pit, torches, crowd silhouettes */
function drawScene_Arena(ctx, W, H, pal, tick) {
    px(ctx, 0, 0, W, H, '#0a0000');
    /* crowd silhouettes at back */
    ctx.fillStyle = '#150000';
    for (let i = 0; i < 30; i++) {
        const hx = i * 21, hy = 30 + (i % 4) * 12;
        const bob = Math.sin(tick * 2 + i) > 0 ? -4 : 0;
        ctx.fillRect(hx, hy + bob, 14, 28);
        ctx.fillRect(hx + 4, hy - 10 + bob, 6, 10);
    }
    /* arena pit */
    px(ctx, 40, H*0.35, W-80, H*0.65-10, '#110000');
    px(ctx, 40, H*0.35, W-80, 4, '#330000');
    /* dirt floor */
    px(ctx, 40, H-50, W-80, 50, '#1a0800');
    /* torches on arena walls */
    [60, W-70].forEach((tx, i) => {
        px(ctx, tx, H*0.4, 8, 60, '#1a0000');
        const fh = 20 + Math.sin(tick*7+i)*6;
        const fg = ctx.createLinearGradient(tx+4, H*0.4, tx+4, H*0.4-fh);
        fg.addColorStop(0, '#ff6600'); fg.addColorStop(1,'rgba(255,200,0,0)');
        ctx.fillStyle = fg; ctx.fillRect(tx, H*0.4-fh, 8, fh);
    });
    /* two fighters */
    px(ctx, W/2-80, H-120, 24, 70, '#002200'); /* Snake */
    px(ctx, W/2+56, H-130, 32, 80, '#220000'); /* Slag (bigger) */
    /* bat swing */
    ctx.save();
    ctx.translate(W/2-56, H-80);
    ctx.rotate(Math.sin(tick*3)*0.6);
    px(ctx, 0, 0, 40, 6, '#553300');
    ctx.restore();
}

/* Scene 8: Night pursuit – headlights, speed blur */
function drawScene_Chase(ctx, W, H, pal, tick) {
    px(ctx, 0, 0, W, H, '#000008');
    /* speed lines */
    ctx.save();
    ctx.strokeStyle = '#001133';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
        const ly = 20 + i * (H / 22);
        const ox = (tick * 300 + i * 47) % (W * 1.5) - W * 0.5;
        ctx.beginPath();
        ctx.moveTo(W/2 - 200 + ox, ly);
        ctx.lineTo(W/2 + 200 + ox, ly);
        ctx.stroke();
    }
    ctx.restore();
    /* city blurs */
    ctx.fillStyle = '#050510';
    for (let i = 0; i < 8; i++) {
        const bx = ((i * 80 + tick * 120) % (W + 60)) - 30;
        ctx.fillRect(bx, 40 + (i % 3) * 30, 20 + i*8, H - 80 - (i%3)*30);
    }
    /* street */
    px(ctx, 0, H-55, W, 55, '#050510');
    px(ctx, 0, H-55, W, 2, '#111');
    /* headlights of lead car */
    const carX = W*0.35;
    const hlGrad = ctx.createRadialGradient(carX, H-40, 5, carX+80, H-40, 120);
    hlGrad.addColorStop(0,'rgba(200,200,255,0.5)');
    hlGrad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = hlGrad; ctx.fillRect(carX, H-120, 240, 80);
    px(ctx, carX-40, H-72, 80, 18, '#111133');
    px(ctx, carX-30, H-84, 62, 14, '#0a0a22');
    /* duke's limo behind – chandeliers */
    const lx = W * 0.65 + Math.sin(tick*2)*3;
    px(ctx, lx, H-68, 120, 16, '#1a0022');
    px(ctx, lx+10, H-78, 100, 12, '#110018');
    for (let ci = 0; ci < 5; ci++) {
        ctx.fillStyle = tick*3 % 2 > 1 ? '#ffcc00' : '#884400';
        ctx.fillRect(lx + 15 + ci * 20, H - 88, 6, 12);
    }
}

/* Scene 9: Bridge – cables, water below */
function drawScene_Bridge(ctx, W, H, pal, tick) {
    px(ctx, 0, 0, W, H, '#040c14');
    /* water shimmer */
    for (let i = 0; i < W; i += 4) {
        const wy = H*0.55 + Math.sin(tick*1.5 + i*0.04) * 6;
        ctx.fillStyle = `rgba(0,80,120,${0.2+Math.sin(tick+i*0.1)*0.1})`;
        ctx.fillRect(i, wy, 4, H*0.45);
    }
    /* water reflection flicks */
    ctx.fillStyle = 'rgba(0,150,200,0.1)';
    for (let i = 0; i < 20; i++) {
        const rx = (i * 37 + tick * 40) % W;
        ctx.fillRect(rx, H*0.55+5, 30, 2);
    }
    /* bridge deck */
    px(ctx, 0, H*0.48, W, 14, '#1a2030');
    px(ctx, 0, H*0.48, W, 2, '#2a3a50');
    /* bridge towers */
    [[100, 0],[W-100, 0]].forEach(([tx]) => {
        px(ctx, tx-10, 0, 20, H*0.5, '#111820');
        px(ctx, tx-30, H*0.15, 60, 10, '#111820');
        px(ctx, tx-30, H*0.30, 60, 8,  '#111820');
    });
    /* suspension cables */
    ctx.save();
    ctx.strokeStyle = '#1a2a40';
    ctx.lineWidth = 2;
    [[100, W-100],[100, W/2],[W/2, W-100]].forEach(([x1,x2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, H*0.02);
        ctx.quadraticCurveTo(W/2, H*0.52, x2, H*0.02);
        ctx.stroke();
    });
    /* vertical hangers */
    ctx.lineWidth = 1;
    for (let i = 0; i < 14; i++) {
        const hx = 100 + i * ((W-200)/13);
        const hy = H*0.52 - Math.pow((i-6.5)/6.5,2)*H*0.48;
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, H*0.48); ctx.stroke();
    }
    ctx.restore();
    /* Snake figure on bridge */
    const sx = W*0.4 + Math.sin(tick)*2;
    px(ctx, sx, H*0.4, 10, 22, '#003300');
    px(ctx, sx+2, H*0.4-8, 6, 8, '#002200');
    /* Duke's limo at back */
    px(ctx, W*0.75, H*0.44, 100, 14, '#1a0022');
    for (let ci = 0; ci < 4; ci++) {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(W*0.75+10+ci*22, H*0.42, 5, 6);
    }
}

/* Scene 10: Final showdown – blood-red sky, dramatic */
function drawScene_Final(ctx, W, H, pal, tick) {
    /* red sky */
    const sky = ctx.createLinearGradient(0, 0, 0, H*0.6);
    sky.addColorStop(0, '#0d0000');
    sky.addColorStop(1, '#330000');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H*0.6);
    /* pulsing red orb / sun */
    const pr = 30 + Math.sin(tick*1.2)*5;
    const pg = ctx.createRadialGradient(W/2, 60, 0, W/2, 60, pr*2);
    pg.addColorStop(0,'rgba(255,60,0,0.8)'); pg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(W/2, 60, pr*2, 0, Math.PI*2); ctx.fill();
    /* silhouetted ruins */
    ctx.fillStyle = '#0d0000';
    [[0,H*0.3,50,H*0.7],[60,H*0.2,40,H*0.8],[110,H*0.25,50,H*0.75],
     [W-60,H*0.28,60,H*0.72],[W-120,H*0.18,50,H*0.82],[W-180,H*0.32,50,H*0.68]].forEach(
        ([bx,by,bw,bh]) => ctx.fillRect(bx, by, bw, bh));
    /* ground */
    px(ctx, 0, H-50, W, 50, '#110000');
    px(ctx, 0, H-50, W, 3, '#330000');
    /* protagonist standing */
    px(ctx, W/2-8, H-130, 16, 80, '#002200');
    px(ctx, W/2-6, H-142, 12, 14, '#001800');
    /* gun arm extended */
    ctx.save();
    ctx.translate(W/2+6, H-110);
    ctx.rotate(-Math.PI/8);
    px(ctx, 0, 0, 30, 5, '#002200');
    ctx.restore();
    /* muzzle flash */
    if (Math.floor(tick*4) % 6 === 0) {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(W/2+34, H-119, 6, 0, Math.PI*2);
        ctx.fill();
    }
    /* enemy ahead */
    px(ctx, W*0.75, H-110, 20, 60, '#1a0000');
    px(ctx, W*0.75+4, H-120, 12, 12, '#110000');
    /* MISSION CRITICAL text */
    glowText(ctx, '★ FINAL LEVEL ★', W/2, H*0.52, '#ff2200', 15, 'center', '#880000');
}

/* ── QUIZ SCREEN ─────────────────────────────────── */
function drawQuiz(ctx, W, H, levelData, qData, state) {
    const { qIndex, qCorrect, qTimer, qSelected, qShowResult, selectedWrong } = state;
    const pal = levelData.palette;

    /* bg */
    px(ctx, 0, 0, W, H, '#050505');
    /* top bar */
    px(ctx, 0, 0, W, 50, '#0a0a0a');
    px(ctx, 0, 50, W, 2, pal.accent);

    /* level name left */
    textLine(ctx, 'LEVEL ' + levelData.id + ': ' + levelData.name, 10, 8, pal.hi, 12);
    /* question count right */
    textLine(ctx, 'Q ' + (qIndex + 1) + '/10', W - 70, 8, '#888', 12);
    /* correct count */
    textLine(ctx, '✓ ' + qCorrect, W - 70, 28, '#00cc00', 12);
    /* lives left (drawn as hearts) */
    textLine(ctx, '♥'.repeat(state.lives), 10, 28, '#cc0000', 14);

    /* timer bar */
    const timerFrac = Math.max(0, qTimer / 15);
    const barW = W - 20;
    px(ctx, 10, 42, barW, 6, '#1a1a1a');
    const barColor = timerFrac > 0.5 ? '#00cc00' : timerFrac > 0.25 ? '#cccc00' : '#cc0000';
    px(ctx, 10, 42, Math.round(barW * timerFrac), 6, barColor);

    /* question text – wrap */
    const qText = qData.q;
    const lines = wrapText(ctx, qText, W - 40, 16);
    lines.forEach((line, i) => {
        glowText(ctx, line, W/2, 90 + i * 24, '#ffffff', 16, 'center', '#333');
    });

    /* answer boxes */
    const labels = ['A', 'B', 'C', 'D'];
    const optColors = ['#0a2a0a', '#0a0a2a', '#2a1a00', '#1a0a2a'];
    const borderColors = ['#006600', '#000088', '#886600', '#550055'];

    qData.opts.forEach((opt, i) => {
        const col    = i % 2;
        const row    = Math.floor(i / 2);
        const bx     = 10 + col * (W/2 - 15);
        const by     = 170 + row * 70;
        const bw     = W/2 - 20;
        const bh     = 58;

        let bg  = optColors[i];
        let bdr = borderColors[i];

        if (qShowResult) {
            if (i === qData.correct)      { bg = '#003300'; bdr = '#00ff00'; }
            else if (i === selectedWrong) { bg = '#330000'; bdr = '#ff0000'; }
        } else if (i === qSelected)       { bg = '#002244'; bdr = '#0088ff'; }

        px(ctx, bx, by, bw, bh, bg);
        ctx.strokeStyle = bdr;
        ctx.lineWidth   = 2;
        ctx.strokeRect(bx, by, bw, bh);

        textLine(ctx, labels[i] + '.', bx + 8, by + 8, bdr, 13);

        /* wrap option text */
        const optLines = wrapText(ctx, opt, bw - 36, 13);
        optLines.forEach((l, li) => {
            textLine(ctx, l, bx + 28, by + 8 + li * 16, '#cccccc', 13);
        });
    });

    /* result feedback */
    if (qShowResult) {
        const correct = (qSelected === qData.correct);
        const msg     = correct ? '✓ CORRECT!' : '✗ WRONG!';
        const col     = correct ? '#00ff00' : '#ff4444';
        glowText(ctx, msg, W/2, 320, col, 20, 'center', col);
        /* hint */
        if (!correct) {
            const hintLines = wrapText(ctx, qData.hint, W - 40, 12);
            hintLines.forEach((l, li) => {
                textLine(ctx, l, W/2 - ctx.measureText(l).width/2, 348 + li * 16, '#888', 12);
            });
        }
    }

    /* score */
    textLine(ctx, 'SCORE: ' + String(state.score).padStart(7, '0'), W/2 - 70, H - 20, '#ffff00', 13);
}

/* ── SNAKE PLAY HUD ──────────────────────────────── */
function drawSnakeHUD(ctx, W, HUD_H, state) {
    px(ctx, 0, 0, W, HUD_H, '#080808');
    px(ctx, 0, HUD_H - 2, W, 2, '#006600');

    textLine(ctx, 'LEVEL ' + state.level, 8, 6, '#ffff00', 13);
    textLine(ctx, 'SCORE: ' + String(state.score).padStart(7,'0'), 8, 24, '#00ff00', 13);
    textLine(ctx, '♥'.repeat(state.lives), W/2 - 30, 6, '#cc0000', 16);
    textLine(ctx, 'FOOD: ' + state.foodCollected + '/' + state.foodTarget, W - 120, 6, '#00cccc', 13);

    /* countdown timer */
    const secs = Math.ceil(state.snakeTimer);
    const tcol  = secs > 30 ? '#00cc00' : secs > 10 ? '#cccc00' : '#ff0000';
    textLine(ctx, 'TIME: ' + String(secs).padStart(3,'0'), W - 120, 24, tcol, 13);
}

/* ── SNAKE / ENEMY / FOOD DRAWING ────────────────── */
function drawSnakeBody(ctx, body, CELL, offsetX, offsetY, levelId) {
    if (!body || body.length === 0) return;
    const hue = ((levelId - 1) * 30) % 360;
    body.forEach((seg, i) => {
        const x = offsetX + seg.x * CELL;
        const y = offsetY + seg.y * CELL;
        if (i === 0) {
            /* head */
            ctx.fillStyle = `hsl(${hue},80%,45%)`;
            ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
            /* eyes */
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 4, y + 4, 3, 3);
            ctx.fillRect(x + CELL - 8, y + 4, 3, 3);
        } else {
            const bright = Math.max(20, 40 - i);
            ctx.fillStyle = `hsl(${hue},70%,${bright}%)`;
            ctx.fillRect(x + 2, y + 2, CELL - 4, CELL - 4);
        }
    });
}

function drawEnemy(ctx, enemy, CELL, offsetX, offsetY) {
    enemy.body.forEach((seg, i) => {
        const x = offsetX + seg.x * CELL;
        const y = offsetY + seg.y * CELL;
        if (i === 0) {
            ctx.fillStyle = '#dd2200';
            ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(x + 3, y + 4, 3, 3);
            ctx.fillRect(x + CELL - 7, y + 4, 3, 3);
        } else {
            const d = Math.max(0, 30 - i * 2);
            ctx.fillStyle = `rgb(${100 + d},${d},0)`;
            ctx.fillRect(x + 2, y + 2, CELL - 4, CELL - 4);
        }
    });
}

function drawFood(ctx, food, CELL, offsetX, offsetY, tick) {
    const x = offsetX + food.x * CELL;
    const y = offsetY + food.y * CELL;
    const pulse = 0.8 + Math.sin(tick * 4) * 0.2;
    ctx.fillStyle = food.bonus ? '#ffcc00' : '#00ffcc';
    ctx.save();
    ctx.translate(x + CELL/2, y + CELL/2);
    ctx.scale(pulse, pulse);
    /* diamond shape */
    ctx.beginPath();
    ctx.moveTo(0, -CELL/2 + 3);
    ctx.lineTo(CELL/2 - 3, 0);
    ctx.lineTo(0, CELL/2 - 3);
    ctx.lineTo(-CELL/2 + 3, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawGridBackground(ctx, W, H, CELL, offsetX, offsetY, pal) {
    px(ctx, offsetX, offsetY, W - offsetX, H - offsetY, pal.dark);
    ctx.strokeStyle = 'rgba(0,100,0,0.08)';
    ctx.lineWidth = 1;
    for (let gx = offsetX; gx <= W; gx += CELL) {
        ctx.beginPath(); ctx.moveTo(gx, offsetY); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (let gy = offsetY; gy <= H; gy += CELL) {
        ctx.beginPath(); ctx.moveTo(offsetX, gy); ctx.lineTo(W, gy); ctx.stroke();
    }
    /* border walls */
    ctx.strokeStyle = '#006600';
    ctx.lineWidth   = 2;
    ctx.strokeRect(offsetX, offsetY, W - offsetX, H - offsetY);
}

/* ── LEVEL COMPLETE ──────────────────────────────── */
function drawLevelComplete(ctx, W, H, state) {
    px(ctx, 0, 0, W, H, '#000');
    glowText(ctx, 'LEVEL ' + state.level + ' COMPLETE!', W/2, 80, '#00ff00', 22, 'center', '#004400');

    const rows = [
        ['QUIZ SCORE',    state.qCorrect + ' / 10 CORRECT'],
        ['SNAKE BONUS',   '+' + state.snakeBonus + ' PTS'],
        ['LEVEL BONUS',   '+1000 PTS'],
        ['TOTAL SCORE',   String(state.score).padStart(7,'0')]
    ];
    rows.forEach(([label, val], i) => {
        const y = 140 + i * 50;
        px(ctx, W/2 - 200, y, 400, 38, '#0a0a0a');
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        ctx.strokeRect(W/2 - 200, y, 400, 38);
        textLine(ctx, label, W/2 - 180, y + 12, '#888', 13);
        textLine(ctx, val, W/2 + 60, y + 12, '#00ff00', 14);
    });

    if (state.level < 10) {
        glowText(ctx, '▶  PRESS A / ENTER  TO  CONTINUE', W/2, 400, '#ffff00', 14, 'center', '#555500');
    } else {
        glowText(ctx, '▶  PRESS A / ENTER  FOR  VICTORY', W/2, 400, '#ff4400', 14, 'center', '#550000');
    }
}

/* ── GAME OVER ───────────────────────────────────── */
function drawGameOver(ctx, W, H, score) {
    px(ctx, 0, 0, W, H, '#000');
    glowText(ctx, 'GAME OVER', W/2, 140, '#ff0000', 36, 'center', '#550000');
    glowText(ctx, 'SNAKE DID NOT ESCAPE', W/2, 200, '#cc2200', 16, 'center', '#440000');
    textLine(ctx, 'FINAL SCORE: ' + String(score).padStart(7,'0'), W/2 - 100, 270, '#ffff00', 16);
    const hi = parseInt(localStorage.getItem('efny_hi') || '0');
    if (score >= hi) {
        glowText(ctx, '★ NEW HIGH SCORE! ★', W/2, 320, '#ffcc00', 17, 'center', '#665500');
    } else {
        textLine(ctx, 'HI-SCORE: ' + String(hi).padStart(7,'0'), W/2 - 85, 320, '#888', 14);
    }
    glowText(ctx, 'PRESS A / ENTER TO TRY AGAIN', W/2, 420, '#00ff00', 14, 'center', '#003300');
}

/* ── VICTORY ─────────────────────────────────────── */
function drawVictory(ctx, W, H, score, tick) {
    px(ctx, 0, 0, W, H, '#000');
    /* animated stars */
    for (let i = 0; i < 60; i++) {
        const sx = (i * 137 + 7) % W;
        const sy = (i * 251 + 3) % H;
        ctx.fillStyle = `rgba(255,220,100,${0.4 + Math.sin(tick*2+i)*0.4})`;
        ctx.fillRect(sx, sy, 2, 2);
    }
    glowText(ctx, 'YOU ESCAPED', W/2, 100, '#ff4400', 30, 'center', '#aa2200');
    glowText(ctx, 'NEW YORK!', W/2, 145, '#ff4400', 36, 'center', '#aa2200');
    glowText(ctx, '"I\'M ALREADY DEAD."', W/2, 210, '#888', 15, 'center', '#333');
    glowText(ctx, '— SNAKE PLISSKEN', W/2, 236, '#555', 13, 'center');

    textLine(ctx, 'FINAL SCORE: ' + String(score).padStart(7,'0'), W/2 - 105, 290, '#ffff00', 16);
    const hi = parseInt(localStorage.getItem('efny_hi') || '0');
    if (score >= hi) {
        glowText(ctx, '★ NEW HIGH SCORE! ★', W/2, 334, '#ffcc00', 17, 'center', '#665500');
    } else {
        textLine(ctx, 'HI-SCORE: ' + String(hi).padStart(7, '0'), W/2 - 85, 334, '#888', 14);
    }

    /* credits */
    const credits = [
        'BASED ON THE 1981 FILM',
        'DIRECTED BY JOHN CARPENTER',
        'STARRING KURT RUSSELL',
        '',
        'PRESS A / ENTER TO PLAY AGAIN'
    ];
    credits.forEach((line, i) => {
        const col = i === credits.length - 1 ? '#00ff00' : '#444';
        const sz  = i === credits.length - 1 ? 14 : 12;
        textLine(ctx, line, W/2, 390 + i * 18, col, sz, 'center');
    });
}

/* ── FLASH / HIT OVERLAY ─────────────────────────── */
function drawFlash(ctx, W, H, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = color;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
}
