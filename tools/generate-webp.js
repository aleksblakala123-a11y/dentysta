#!/usr/bin/env node
/**
 * Generuje responsywne warianty WebP (400/800/1200/1600px szerokości) dla obrazów
 * z assets/img/, zapisując je do assets/img/opt/.
 *
 * Nie powieksza obrazow - jesli oryginal jest wezszy niz dana szerokosc docelowa,
 * ten wariant jest pomijany.
 *
 * Wymaga pakietu "sharp" (nie jest czescia repo - doinstaluj lokalnie przed uzyciem):
 *   npm install sharp --no-save
 *
 * Uzycie:
 *   node tools/generate-webp.js
 *
 * Liste plikow wejsciowych i docelowa jakosc mozna zmienic ponizej.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'assets', 'img');
const OUT_DIR = path.join(PROJECT_ROOT, 'assets', 'img', 'opt');
const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 82;

// Pliki do przetworzenia - obrazy faktycznie uzywane w index/about/service/blog.html
// (w <img src> oraz jako tlo w assets/css/amico.css). Aktualizuj przy dodawaniu nowych zdjec.
const FILES = [
  '69e041cad257c10b1176cd81_success-item-image-1.webp',
  '69e041cb0a159b45d163a9ea_success-item-image-2.webp',
  'gen_about-hero-image.jpg',
  'gen_blog-image-1.jpg',
  'gen_blog-image-2.jpg',
  'gen_blog-image-3.jpg',
  'gen_blog-image-4.jpg',
  'gen_blog-image-5.jpg',
  'gen_blog-image-6.jpg',
  'gen_dentist-examining-patients-teeth-close-up_1.jpg',
  'gen_hero-2.jpg',
  'gen_hero-3.jpg',
  'gen_hero-4.jpg',
  'gen_home-value-image.jpg',
  'gen_our-story-image-1.jpg',
  'gen_our-story-image-2.jpg',
  'gen_our-story-image-3.jpg',
  'gen_our-story-image-4.jpg',
  'gen_our-story-image-5.jpg',
  'gen_service-thumbnail-image.jpg',
  'gen_service-thumbnail-image-2.jpg',
  'gen_service-thumbnail-image-3.jpg',
  'gen_service-thumbnail-image-4.jpg',
  'gen_story-image-1.jpg',
  'gen_story-image-2.jpg',
  'gen_story-image-3.jpg',
  'gen_story-image-4.jpg',
  'gen_story-image-5.jpg',
  'gen_team-bg.jpg',
  'gen_testimonial-bg.jpg',
  // gen_team-image-2..6.jpg usuniete z listy: karty zespolu na index.html/about.html
  // nie pokazuja juz zdjec, tylko placeholder z inicjalami (zob. .team-avatar_placeholder
  // w assets/css/amico.css) - te pliki nie sa nigdzie wczytywane.
];

function outName(baseName, width) {
  const ext = path.extname(baseName);
  const stem = path.basename(baseName, ext);
  return `${stem}-${width}w.webp`;
}

async function run() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0;
  let skippedUpscale = 0;

  for (const file of FILES) {
    const srcPath = path.join(SRC_DIR, file);
    if (!fs.existsSync(srcPath)) {
      console.warn(`POMINIETO (brak pliku): ${file}`);
      continue;
    }
    const meta = await sharp(srcPath).metadata();
    const naturalWidth = meta.width;

    for (const w of WIDTHS) {
      if (w > naturalWidth) {
        skippedUpscale++;
        continue; // nie powiekszaj
      }
      const outPath = path.join(OUT_DIR, outName(file, w));
      await sharp(srcPath)
        .resize({ width: w })
        .webp({ quality: QUALITY })
        .toFile(outPath);
      generated++;
      console.log(`OK  ${file} (${naturalWidth}px) -> ${path.basename(outPath)}`);
    }
  }

  console.log(`\nGotowe: ${generated} plikow wygenerowanych, ${skippedUpscale} wariantow pominietych (powiekszalyby oryginal).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
