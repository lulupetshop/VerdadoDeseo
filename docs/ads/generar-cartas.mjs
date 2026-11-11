// Genera las cartas de nivel 3 en SVG para anuncios, con el texto convertido a trazos
// (no hace falta tener las tipografías instaladas para abrirlas).
//
// Uso, desde una carpeta con las dependencias instaladas:
//   npm i opentype.js @fontsource/cormorant-garamond @fontsource/manrope
//   node generar-cartas.mjs <carpeta-de-salida>
//
// Por cada carta salen dos archivos:
//   -completa.svg   el texto entero, para tacharlo a mano
//   -censurada.svg  una barra bordó en lugar de cada palabra explícita (la palabra no queda en el archivo)
//
// Con "imprenta" como segundo argumento salen en cambio el dorso y una carta de muestra por nivel,
// en milímetros (63 × 88) y con 3 mm de sangrado por lado:
//   node generar-cartas.mjs <carpeta-de-salida> imprenta

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
const SERIF = font('cormorant-garamond', 'cormorant-garamond-latin-600-italic.woff');
const BOLD = font('manrope', 'manrope-latin-800-normal.woff');
const BODY = font('manrope', 'manrope-latin-400-normal.woff');

// Las palabras entre llaves son las explícitas, igual que en la landing.
const CARDS = [
  { k: 'D', t: '{Chupale} la {pija} sin usar las manos hasta que te pida que pares.' },
  { k: 'D', t: '{Chupale} la {concha} hasta que {acabe}.' },
  { k: 'D', t: '{Cogé} en la posición que elija tu pareja, sin cambiar hasta {acabar}.' },
  { k: 'D', t: '{Tocate} delante de tu pareja, mirándola a los ojos, hasta {acabar}.' },
  { k: 'D', t: 'Hagan un {69} durante tres minutos. Pierde quien pare primero.' },
  { k: 'D', t: '{Acabá} donde tu pareja te diga.' },
  { k: 'D', t: 'Atale las manos y hacé con su cuerpo lo que quieras durante cinco minutos.' },
  { k: 'V', t: '¿Qué es lo más sucio que querés que te haga y nunca me pediste?' },
  { k: 'V', t: '¿Probarías por el {culo}? ¿Dando o recibiendo?' },
  { k: 'V', t: '¿Cómo te gusta que te {chupe}? Explicalo con detalle.' }
];
// Una carta por nivel, como muestra del frente para la imprenta
const SAMPLES = [
  { l: 1, k: 'V', t: '¿Qué fue lo primero que te gustó de mi cuerpo?' },
  { l: 2, k: 'D', t: 'Vendale los ojos y hacele adivinar qué le das a probar.' },
  { l: 3, k: 'D', t: 'Atale las manos y hacé con su cuerpo lo que quieras durante cinco minutos.' }
];
const NAMES = { 1: 'SUAVE', 2: 'INTENSO', 3: 'EXPLÍCITO' };
const FOOT = { V: 'Responde quien sacó la carta.', D: 'Se cumple o se negocia. Siempre se puede pasar.' };

const W = 1024, H = 1430, PAD = 100, MAXW = W - PAD * 2;
const BORDO = '#8c1c3a', INK = '#23140d', MUTED = '#6d5a5a', PAPER = '#f7dfe0', CREAM = '#f6eadb', GOLD = '#e3b465';
const r = n => Math.round(n * 100) / 100;
// Se arma letra por letra para controlar el kerning y el redondeo.
function run(f, s, size, each) {
  let x = 0, prev = null;
  for (const ch of s) {
    const g = f.charToGlyph(ch);
    if (prev) { const k = f.getKerningValue(prev, g); if (Number.isFinite(k)) x += k * size / f.unitsPerEm; }
    if (each) each(g, x);
    x += g.advanceWidth * size / f.unitsPerEm; prev = g;
  }
  return x;
}
const width = (f, s, size) => run(f, s, size);
// toPathData() de opentype.js también devuelve NaN al redondear algunos valores: se escribe a mano.
const n = v => String(Math.round(v * 100) / 100);
const cmd = c => c.type === 'Z' ? 'Z' : c.type + [c.x1, c.y1, c.x2, c.y2, c.x, c.y].filter(v => v !== undefined).map(n).join(' ');
const path = (f, s, x, y, size) => { let d = ''; run(f, s, size, (g, dx) => { d += g.getPath(x + dx, y, size).commands.map(cmd).join(''); }); return d; };

// Texto con espaciado entre letras (encabezado)
function spaced(f, s, x, y, size, gap) {
  let d = '';
  for (const ch of s) { d += path(f, ch, x, y, size); x += width(f, ch, size) + gap; }
  return d;
}

function wrap(f, words, size, plain = w => w) {
  const sp = width(f, ' ', size), lines = []; let line = [], lw = 0;
  for (const w of words) {
    const ww = width(f, plain(w), size);
    if (line.length && lw + sp + ww > MAXW) { lines.push(line); line = []; lw = 0; }
    lw += (line.length ? sp : 0) + ww; line.push(w);
  }
  if (line.length) lines.push(line);
  return lines;
}

// Devuelve el interior de la carta (sin fondo) y el color del papel. inset: distancia del filete al borde.
function card({ k, t, l = 3 }, censor, inset = 26) {
  const plain = w => w.replace(/[{}]/g, '');
  const words = t.split(' ');
  let size = 92, lines;
  do { lines = wrap(SERIF, words, size, plain); size -= 4; } while (lines.length * size * 1.2 > H * .52 && size > 52);
  size += 4;
  const lh = size * 1.18, top = H / 2 - (lines.length * lh) / 2 - 10, sp = width(SERIF, ' ', size);
  let text = '', bars = '';
  lines.forEach((line, i) => {
    let x = PAD; const y = top + i * lh + size * .82;
    for (const w of line) {
      const m = w.match(/^(.*?)\{([^}]+)\}(.*)$/);
      if (!m) { text += path(SERIF, w, x, y, size); x += width(SERIF, w, size) + sp; continue; }
      const [, pre, exp, post] = m;
      text += path(SERIF, pre, x, y, size); x += width(SERIF, pre, size);
      const ew = width(SERIF, exp, size);
      if (censor) bars += `<rect x="${r(x - 2)}" y="${r(y - size * .62)}" width="${r(ew + 3)}" height="${r(size * .74)}" rx="6"/>`;
      else text += path(SERIF, exp, x, y, size);
      x += ew;
      text += path(SERIF, post, x, y, size); x += width(SERIF, post, size) + sp;
    }
  });
  const head = spaced(BOLD, `${k === 'V' ? 'VERDAD' : 'DESEO'} · ${NAMES[l]}`, PAD, 140, 34, 6);
  const foot = wrap(BODY, FOOT[k].split(' '), 34).map((l, i, a) => path(BODY, l.join(' '), PAD, H - 110 - (a.length - i) * 46 + 30, 34)).join('');
  return { paper: l === 3 ? PAPER : CREAM, inner: `<rect x="${inset}" y="${inset}" width="${W - 2 * inset}" height="${H - 2 * inset}" rx="22" fill="none" stroke="${BORDO}" stroke-width="7"/>
<path fill="${BORDO}" d="${head}"/>
<path fill="${INK}" d="${text}"/>${bars ? `\n<g fill="${BORDO}">${bars}</g>` : ''}
<path fill="${MUTED}" d="${foot}"/>` };
}

// Dorso: solo el monograma sobre bordó liso, sin marco ni trama.
function back() {
  const size = 250, s = 'V·D';
  return { paper: BORDO, inner: `<path fill="${GOLD}" d="${path(SERIF, s, W / 2 - width(SERIF, s, size) / 2, H / 2 + size * .3, size)}"/>` };
}

// Para pantalla: en píxeles y con las puntas redondeadas
const screen = ({ paper, inner }, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<title>Verdad o Deseo · ${title}</title>
<rect width="${W}" height="${H}" rx="44" fill="${paper}"/>
${inner}
</svg>
`;
// Para imprenta: en milímetros, con sangrado y sin puntas (las redondea el troquel)
const MM_W = 63, MM_H = 88, BLEED = 3;
const print = ({ paper, inner }, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-BLEED} ${-BLEED} ${MM_W + 2 * BLEED} ${MM_H + 2 * BLEED}" width="${MM_W + 2 * BLEED}mm" height="${MM_H + 2 * BLEED}mm">
<title>Verdad o Deseo · ${title} · ${MM_W} × ${MM_H} mm + ${BLEED} mm de sangrado</title>
<rect x="${-BLEED}" y="${-BLEED}" width="${MM_W + 2 * BLEED}" height="${MM_H + 2 * BLEED}" fill="${paper}"/>
<g transform="scale(${MM_W / W})">
${inner}
</g>
</svg>
`;

const out = process.argv[2] || 'cartas';
mkdirSync(out, { recursive: true });
if (process.argv[3] === 'imprenta') {
  const INSET = Math.round(3 * W / MM_W);   // el filete a 3 mm del corte
  writeFileSync(join(out, 'carta-dorso.svg'), print(back(), 'dorso de la carta'));
  for (const c of SAMPLES) writeFileSync(join(out, `carta-frente-nivel-${c.l}.svg`), print(card(c, false, INSET), `frente de muestra, nivel ${c.l}`));
} else {
  CARDS.forEach((c, i) => {
    const n = String(i + 1).padStart(2, '0');
    writeFileSync(join(out, `nivel-3-${n}-completa.svg`), screen(card(c, false), 'carta de nivel 3'));
    if (/\{/.test(c.t)) writeFileSync(join(out, `nivel-3-${n}-censurada.svg`), screen(card(c, true), 'carta de nivel 3 (censurada)'));
  });
  writeFileSync(join(out, 'dorso.svg'), screen(back(), 'dorso de la carta'));
}
console.log(`Listo: ${out}`);
