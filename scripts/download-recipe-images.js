'use strict';

const fs = require('fs');
const path = require('path');

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!UNSPLASH_ACCESS_KEY) {
  console.error('Error: UNSPLASH_ACCESS_KEY environment variable is required');
  console.error('Usage: UNSPLASH_ACCESS_KEY=your_key node scripts/download-recipe-images.js');
  process.exit(1);
}

const RECIPES_PATH = path.join(__dirname, '..', 'lib', 'recipes-merged.json');
const OUTPUT_DIR   = path.join(__dirname, '..', 'public', 'recipes');

const recipes = JSON.parse(fs.readFileSync(RECIPES_PATH, 'utf8'));

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadBinary(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  const buf = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buf));
}

async function main() {
  let downloaded = 0;
  let skipped = 0;

  for (const recipe of recipes) {
    const destPath = path.join(OUTPUT_DIR, `${recipe.slug}.jpg`);

    if (fs.existsSync(destPath)) {
      console.log(`Skipped: ${recipe.name} (already exists)`);
      skipped++;
      continue;
    }

    try {
      const query = encodeURIComponent(recipe.photoSearch);
      const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`;

      const searchRes = await fetch(apiUrl, {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      });

      if (!searchRes.ok) {
        throw new Error(`API error: ${searchRes.status} ${searchRes.statusText}`);
      }

      const data = await searchRes.json();

      if (!data.results || data.results.length === 0) {
        console.log(`Skipped: ${recipe.name} (no Unsplash results)`);
        skipped++;
      } else {
        const imageUrl = data.results[0].urls.regular;
        await downloadBinary(imageUrl, destPath);
        console.log(`Downloaded: ${recipe.name}`);
        downloaded++;
      }
    } catch (err) {
      console.error(`Error: ${recipe.name} — ${err.message}`);
      skipped++;
    }

    await sleep(1000);
  }

  console.log(`\nDone — ${downloaded} downloaded, ${skipped} skipped`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
