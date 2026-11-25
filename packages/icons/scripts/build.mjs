// Génère dist/index.js (ESM) et dist/index.cjs (pour Jest) : une table nom → contenu SVG (sans la balise <svg>), lue par <onec-icon>.
// Toutes les icônes partagent la même grille : viewBox 0 0 24 24, trait currentColor, épaisseur 2.
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svgDir = join(root, 'svg');
const files = (await readdir(svgDir)).filter((f) => f.endsWith('.svg')).sort();

const icons = {};
for (const file of files) {
  const svg = (await readFile(join(svgDir, file), 'utf8')).trim();
  const match = svg.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
  if (!match) throw new Error(`${file} : SVG illisible`);
  if (!/viewBox="0 0 24 24"/.test(match[1]))
    throw new Error(`${file} : la grille doit être 24 × 24`);
  if (!/stroke="currentColor"/.test(match[1]))
    throw new Error(`${file} : le trait doit être currentColor`);
  // Balises fermées explicitement : innerHTML hors contexte SVG ne comprend pas « /> ».
  icons[file.slice(0, -4)] = match[2].replace(/<([a-z]+)\b([^>]*?)\s*\/>/g, '<$1$2></$1>');
}

const names = Object.keys(icons);
await mkdir(join(root, 'dist'), { recursive: true });
await writeFile(
  join(root, 'dist/index.js'),
  `// Généré par scripts/build.mjs : ne pas modifier.\nexport const icons = ${JSON.stringify(icons, null, 2)};\n\nexport const iconNames = Object.keys(icons);\n`,
);
await writeFile(
  join(root, 'dist/index.cjs'),
  `// Généré par scripts/build.mjs : ne pas modifier.\nconst icons = ${JSON.stringify(icons, null, 2)};\n\nmodule.exports = { icons, iconNames: Object.keys(icons) };\n`,
);
await writeFile(
  join(root, 'dist/index.d.ts'),
  `// Généré par scripts/build.mjs : ne pas modifier.\nexport type IconName =\n${names.map((n) => `  | '${n}'`).join('\n')};\n\nexport declare const icons: Record<IconName, string>;\nexport declare const iconNames: IconName[];\n`,
);
console.log(`dist/index.js : ${names.length} icônes`);
