#!/usr/bin/env node
// Gera ícones PNG a partir do public/icon.svg.
//
// Uso:
//   npm install --no-save sharp
//   node scripts/generate-icons.mjs
//
// Outputs em public/:
//   - icon-192.png            (192x192, ícone padrão)
//   - icon-512.png            (512x512, splash + Play Store)
//   - icon-512-maskable.png   (512x512 com padding pra "safe zone" Android)
//   - apple-touch-icon.png    (180x180, iOS)
//   - favicon-32.png, favicon-16.png

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Falta a dependência "sharp". Rode:\n  npm install --no-save sharp');
  process.exit(1);
}

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'public', 'icon.svg');
const OUT = path.join(ROOT, 'public');

const svg = await readFile(SRC);

const targets = [
  { name: 'icon-192.png',          size: 192, mode: 'normal' },
  { name: 'icon-512.png',          size: 512, mode: 'normal' },
  { name: 'icon-512-maskable.png', size: 512, mode: 'maskable' },
  { name: 'apple-touch-icon.png',  size: 180, mode: 'normal' },
  { name: 'favicon-32.png',        size: 32,  mode: 'normal' },
  { name: 'favicon-16.png',        size: 16,  mode: 'normal' },
];

for (const t of targets) {
  // Maskable precisa de "safe zone" — Android pode recortar até 20% das bordas.
  // Renderiza menor + padding sólido (background do brand).
  const innerSize = t.mode === 'maskable' ? Math.round(t.size * 0.66) : t.size;
  const pad = Math.round((t.size - innerSize) / 2);
  const rendered = await sharp(svg, { density: 512 })
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  let img = sharp({
    create: {
      width: t.size, height: t.size, channels: 4,
      background: t.mode === 'maskable' ? { r: 26, g: 107, b: 115 } : { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite([{ input: rendered, top: pad, left: pad }]).png();

  const buf = await img.toBuffer();
  await writeFile(path.join(OUT, t.name), buf);
  console.log('✓', t.name, `(${t.size}×${t.size}, ${t.mode})`);
}

// Favicon multi-tamanho (.ico) — opcional, browsers modernos pegam o SVG
console.log('\nÍcones gerados em public/. Atualize o manifest se mudar nomes.');
