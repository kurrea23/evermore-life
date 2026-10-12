import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';

// Optional first argument: absolute path to an installed sharp module.
const require = createRequire(import.meta.url);
const sharp = require(process.argv[2] || 'sharp');
const root = fileURLToPath(new URL('../../', import.meta.url));
const kit = path.join(root, '04_content_narrative/evermore_life_brand_kit');
const out = path.join(root, '04_content_narrative/virtual-office');
const colors = JSON.parse(readFileSync(path.join(kit, 'brand-tokens.json'))).colors;
const logo = readFileSync(path.join(kit, 'evermore-logo-gold-transparent.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="navy" x2="1" y2="1"><stop stop-color="${colors.heritageNavy}"/><stop offset=".6" stop-color="${colors.evermoreNavy}"/><stop offset="1" stop-color="#070d29"/></linearGradient>
    <linearGradient id="gold"><stop stop-color="${colors.legacyGold}"/><stop offset=".5" stop-color="${colors.warmGold}"/><stop offset="1" stop-color="${colors.legacyGold}"/></linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#navy)"/>
  <path d="M0 1000 L920 0 M0 1048 L968 0 M0 1080 L1000 0" fill="none" stroke="${colors.legacyGold}" stroke-opacity=".045" stroke-width="2"/>
  <path d="M0 43 H500 M43 0 V260" stroke="${colors.legacyGold}" stroke-opacity=".27"/>
  <rect x="1360" y="766" width="480" height="234" rx="5" fill="${colors.evermoreNavy}" stroke="url(#gold)" stroke-width="2"/>
  <rect x="1370" y="776" width="460" height="214" rx="2" fill="none" stroke="${colors.legacyGold}" stroke-opacity=".22"/>
  <image x="1392" y="795" width="416" height="176" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${logo}"/>
</svg>`;
writeFileSync(path.join(out, 'evermore-zoom-background.svg'), svg);
await sharp(Buffer.from(svg)).removeAlpha().png().toFile(path.join(out, 'evermore-zoom-background-1920x1080.png'));
console.log('Built Evermore Zoom background: 1920×1080 RGB PNG and editable SVG.');
