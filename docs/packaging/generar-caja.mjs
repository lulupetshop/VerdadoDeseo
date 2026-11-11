// Genera el estuche del mazo: las caras sueltas, el plano de troquel y los datos para la vista 3D.
// Todo en milímetros y con el texto convertido a trazos.
//
// Uso, desde una carpeta con las dependencias instaladas:
//   npm i opentype.js @fontsource/cormorant-garamond @fontsource/manrope
//   node generar-caja.mjs <carpeta-de-salida>
//
// Las medidas (W, H, D) son interiores más holgura y hay que confirmarlas con la imprenta:
// dependen del gramaje de las cartas y del cartón del estuche.

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const require = createRequire(join(process.cwd(), 'x.js'));
const opentype = require('opentype.js');
const font = (pkg, file) => {
  const dir = dirname(require.resolve(`@fontsource/${pkg}/package.json`));
  const b = readFileSync(join(dir, 'files', file));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const SERIF = font('cormorant-garamond', 'cormorant-garamond-latin-600-normal.woff');
const ITALIC = font('cormorant-garamond', 'cormorant-garamond-latin-600-italic.woff');
const SANS = font('manrope', 'manrope-latin-500-normal.woff');
const BOLD = font('manrope', 'manrope-latin-800-normal.woff');

// ---------- Medidas (mm) ----------
const W = 65, H = 90, D = 20;      // ancho, alto y fondo del estuche: cartas de 63 × 88, mazo de 60
const GLUE = 14, TUCK = 15, BLEED = 3, NOTCH = 7;   // NOTCH: radio de la muesca para el pulgar
const BLACK = '#0d0709', WINE = '#8c1c3a', GOLD = '#e3b465', CREAM = '#f6eadb', MUTED = '#b9a79c';

// ---------- Texto a trazos ----------
const n = v => String(Math.round(v * 1000) / 1000);
const cmd = c => c.type === 'Z' ? 'Z' : c.type + [c.x1, c.y1, c.x2, c.y2, c.x, c.y].filter(v => v !== undefined).map(n).join(' ');
function run(f, s, size, gap, each) {
  let x = 0, prev = null;
  for (const ch of s) {
    const g = f.charToGlyph(ch);
    if (prev) { const k = f.getKerningValue(prev, g); if (Number.isFinite(k)) x += k * size / f.unitsPerEm; x += gap; }
    if (each) each(g, x);
    x += g.advanceWidth * size / f.unitsPerEm; prev = g;
  }
  return x;
}
const width = (f, s, size, gap = 0) => run(f, s, size, gap);
// align: 0 izquierda, .5 centro, 1 derecha
function text(f, s, size, x, y, fill, { gap = 0, align = .5 } = {}) {
  const x0 = x - width(f, s, size, gap) * align; let d = '';
  run(f, s, size, gap, (g, dx) => { d += g.getPath(x0 + dx, y, size).commands.map(cmd).join(''); });
  return `<path fill="${fill}" d="${d}"/>`;
}
const fit = (f, s, w) => w / width(f, s, 1);
function wrap(f, s, size, maxW) {
  const lines = []; let line = '';
  for (const w of s.split(' ')) { const t = line ? line + ' ' + w : w; if (line && width(f, t, size) > maxW) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line);
  return lines;
}
const block = (f, s, size, x, y, lh, maxW, fill, opt) => {
  const lines = wrap(f, s, size, maxW);
  return { svg: lines.map((l, i) => text(f, l, size, x, y + i * lh, fill, opt)).join(''), end: y + lines.length * lh };
};

// ---------- Piezas ----------
const frame = (w, h, m = 3.2) => `<rect x="${m}" y="${m}" width="${w - 2 * m}" height="${h - 2 * m}" fill="none" stroke="${GOLD}" stroke-width=".25"/>`;
const rule = (cx, y, half = 11) => `<path d="M${cx - half} ${y}H${cx - 2.2}M${cx + 2.2} ${y}H${cx + half}" stroke="${GOLD}" stroke-width=".2" fill="none"/>` +
  `<path d="M${cx} ${y - 1.1}L${cx + 1.1} ${y}L${cx} ${y + 1.1}L${cx - 1.1} ${y}Z" fill="none" stroke="${GOLD}" stroke-width=".2"/>`;
function medallion(cx, cy, r) {
  let rays = '';
  for (let i = 0; i < 36; i++) {
    const a = i * Math.PI / 18, r1 = r + 1.6, r2 = r + (i % 2 ? 3.4 : 5.2);
    rays += `M${n(cx + Math.cos(a) * r1)} ${n(cy + Math.sin(a) * r1)}L${n(cx + Math.cos(a) * r2)} ${n(cy + Math.sin(a) * r2)}`;
  }
  const size = r * 1.05;
  return `<path d="${rays}" stroke="${GOLD}" stroke-width=".18" opacity=".8" fill="none"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${WINE}" stroke="${GOLD}" stroke-width=".35"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r - .9}" fill="none" stroke="${GOLD}" stroke-width=".12"/>` +
    text(ITALIC, 'V·D', size, cx, cy + size * .3, GOLD);
}
// "Verdad o Deseo" en una línea, mezclando redonda y cursiva
function wordmark(size, cx, y) {
  const parts = [[SERIF, 'Verdad', CREAM], [ITALIC, ' o ', GOLD], [ITALIC, 'Deseo', GOLD]];
  let x = cx - parts.reduce((a, [f, s]) => a + width(f, s, size), 0) / 2, out = '';
  for (const [f, s, fill] of parts) { out += text(f, s, size, x, y, fill, { align: 0 }); x += width(f, s, size); }
  return out;
}

// ---------- Caras (cada una en su propio sistema, con origen arriba a la izquierda) ----------
const FACES = {
  frente: { w: W, h: H, draw() {
    const cx = W / 2, s1 = fit(SERIF, 'Verdad', 45), s2 = fit(ITALIC, 'Deseo', 45);
    // el marco esquiva la muesca del pulgar con un arco
    const m = 3.2, r = NOTCH + 2.2, dx = Math.sqrt(r * r - m * m);
    return `<path d="M${m} ${m}H${n(cx - dx)}A${r} ${r} 0 0 0 ${n(cx + dx)} ${m}H${W - m}V${H - m}H${m}Z" fill="none" stroke="${GOLD}" stroke-width=".25"/>` +
      text(SANS, 'UN JUEGO PARA DOS', 2.3, cx, 13.4, GOLD, { gap: .95 }) + rule(cx, 16.8) +
      text(SERIF, 'Verdad', s1, cx, 31.6, CREAM) +
      text(ITALIC, 'o', s2 * .62, cx, 38, GOLD) +
      text(ITALIC, 'Deseo', s2, cx, 50.2, GOLD) +
      medallion(cx, 65.4, 8) +
      text(SANS, 'Preguntas y desafíos para parejas', 2.5, cx, 80.2, CREAM) +
      text(SANS, '60 CARTAS  ·  +18', 1.9, cx, 84.3, GOLD, { gap: .7 });
  } },
  dorso: { w: W, h: H, draw() {
    const cx = W / 2, L = 8.5, maxW = W - 17; let out = frame(W, H), y;
    out += text(SANS, 'VERDAD O DESEO', 2.3, cx, 13.4, GOLD, { gap: .95 }) + rule(cx, 16.8);
    const intro = block(ITALIC, 'Cartas de preguntas y retos para jugar en pareja.', 4.7, cx, 24.2, 5.2, maxW, CREAM);
    out += intro.svg; y = intro.end + 2.4;
    for (const [t, d] of [['1 · SUAVE', 'Preguntas para conocerse y reírse un rato.'], ['2 · INTENSO', 'Confesiones y retos con contacto.'],
      ['3 · EXPLÍCITO', 'Sexo directo. Acuerden una palabra de seguridad antes de empezar.']]) {
      out += text(BOLD, t, 1.95, L, y, GOLD, { gap: .5, align: 0 });
      const b = block(SANS, d, 2.25, L, y + 3.5, 3.3, maxW, CREAM, { align: 0 }); out += b.svg; y = b.end + 3.1;
    }
    out += rule(cx, y - .8); y += 4.4;
    const nota = block(ITALIC, 'Cualquiera puede pasar una carta. Nadie hace nada que no quiera.', 3.5, cx, y, 4, maxW, MUTED); out += nota.svg;
    return out + text(SANS, '60 CARTAS  ·  PARA 2  ·  +18', 1.9, cx, 84.3, GOLD, { gap: .7 });
  } },
  // Los laterales se dibujan acostados (H × D) y después se giran
  'lateral-derecho': { w: D, h: H, draw() {
    return `<g transform="translate(${D} 0) rotate(90)">` + wordmark(8.2, H / 2, D / 2 + 2.6) + '</g>';
  } },
  'lateral-izquierdo': { w: D, h: H, draw() {
    return `<g transform="translate(0 ${H}) rotate(-90)">` + text(SANS, 'SUAVE   ·   INTENSO   ·   EXPLÍCITO', 2.4, H / 2, D / 2 + .85, GOLD, { gap: 1 }) + '</g>';
  } },
  'tapa-superior': { w: W, h: D, draw() {
    return `<path d="M9 ${D / 2}H${W / 2 - 9}M${W / 2 + 9} ${D / 2}H${W - 9}" stroke="${GOLD}" stroke-width=".2"/>` + text(ITALIC, 'V·D', 9.5, W / 2, D / 2 + 2.9, GOLD);
  } },
  'tapa-inferior': { w: W, h: D, draw() {
    return text(SANS, 'UN JUEGO PARA DOS', 2.2, W / 2, D / 2 - .9, GOLD, { gap: .95 }) + text(SANS, '60 CARTAS  ·  +18', 1.8, W / 2, D / 2 + 3.4, MUTED, { gap: .7 });
  } }
};

const svg = (w, h, body, vb = `0 0 ${w} ${h}`) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}mm" height="${h}mm">\n${body}\n</svg>\n`;

// ---------- Troquel ----------
// De izquierda a derecha: solapa de pegado | frente | lateral derecho | dorso | lateral izquierdo.
// Las tapas y sus solapas salen del dorso; las aletas guardapolvo, de los laterales.
function troquel() {
  const x1 = GLUE, x2 = x1 + W, x3 = x2 + D, x4 = x3 + W, x5 = x4 + D;      // pliegues verticales
  const y1 = TUCK, y2 = y1 + D, y3 = y2 + H, y4 = y3 + D, y5 = y4 + TUCK;   // pliegues horizontales
  const cx = (x1 + x2) / 2, R = NOTCH;
  const flap = (xa, xb, y, dir) => { const t = y + dir * (D - 2), m = y + dir * (D - 7);      // aleta guardapolvo
    return dir < 0 ? `L${xa + .5} ${y}L${xa + .5} ${m}L${xa + 3} ${t}L${xb - 3} ${t}L${xb - .5} ${m}L${xb - .5} ${y}`
      : `L${xb - .5} ${y}L${xb - .5} ${m}L${xb - 3} ${t}L${xa + 3} ${t}L${xa + .5} ${m}L${xa + .5} ${y}`; };
  const cut = `M${x1} ${y2}L${cx - R} ${y2}A${R} ${R} 0 0 0 ${cx + R} ${y2}L${x2} ${y2}` +            // borde del frente con la muesca
    flap(x2, x3, y2, -1) + `L${x3} ${y2}L${x3} ${y1}L${x3 + 2} ${y1 - 11}L${x3 + 5} 0L${x4 - 5} 0L${x4 - 2} ${y1 - 11}L${x4} ${y1}L${x4} ${y2}` +
    flap(x4, x5, y2, -1) + `L${x5} ${y2}L${x5} ${y3}` + flap(x4, x5, y3, 1) +
    `L${x4} ${y3}L${x4} ${y4}L${x4 - 2} ${y4 + 11}L${x4 - 5} ${y5}L${x3 + 5} ${y5}L${x3 + 2} ${y4 + 11}L${x3} ${y4}L${x3} ${y3}` +
    flap(x2, x3, y3, 1) + `L${x2} ${y3}L${x1} ${y3}L${x1} ${y3 - 2}L0 ${y3 - 8}L0 ${y2 + 8}L${x1} ${y2 + 2}Z`;
  const fold = `M${x1} ${y2}V${y3}M${x2} ${y2}V${y3}M${x3} ${y2}V${y3}M${x4} ${y2}V${y3}` +
    `M${x2} ${y2}H${x5}M${x2} ${y3}H${x5}M${x3} ${y1}H${x4}M${x3} ${y4}H${x4}`;
  const at = (name, x, y, extra = '') => `<g transform="translate(${x} ${y})${extra}">${FACES[name].draw()}</g>`;
  const art = `<g id="arte">\n<rect x="${-BLEED}" y="${-BLEED}" width="${x5 + 2 * BLEED}" height="${y5 + 2 * BLEED}" fill="${BLACK}"/>\n` +
    at('frente', x1, y2) + '\n' + at('lateral-derecho', x2, y2) + '\n' + at('dorso', x3, y2) + '\n' + at('lateral-izquierdo', x4, y2) + '\n' +
    at('tapa-superior', x3, y1, ` rotate(180 ${W / 2} ${D / 2})`) + '\n' + at('tapa-inferior', x3, y3) + '\n</g>';
  const lines = `<g id="troquel" fill="none" stroke-width=".25">\n<path id="corte" d="${cut}" stroke="#ff00ff"/>\n<path id="pliegue" d="${fold}" stroke="#00e5ff" stroke-dasharray="1.5 1"/>\n</g>`;
  const vb = `${-BLEED - 4} ${-BLEED - 4} ${x5 + 2 * BLEED + 8} ${y5 + 2 * BLEED + 8}`;
  return svg(x5 + 2 * BLEED + 8, y5 + 2 * BLEED + 8, `<title>Verdad o Deseo · estuche, plano de troquel (${W} × ${H} × ${D} mm)</title>\n<rect x="${-BLEED - 4}" y="${-BLEED - 4}" width="100%" height="100%" fill="#fff"/>\n${art}\n${lines}`, vb);
}

const out = process.argv[2] || 'caja';
mkdirSync(out, { recursive: true });
for (const [name, f] of Object.entries(FACES))
  writeFileSync(join(out, `${name}.svg`), svg(f.w, f.h, `<title>Verdad o Deseo · estuche, ${name.replace('-', ' ')}</title>\n<rect width="${f.w}" height="${f.h}" fill="${BLACK}"/>\n${f.draw()}`));
writeFileSync(join(out, 'troquel.svg'), troquel());
console.log(`Listo: ${out} (${W} × ${H} × ${D} mm)`);
