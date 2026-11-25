// Copie dans svg/ les icônes Lucide listées dans icons.json, depuis lucide-static (version fixée).
// Les SVG sont normalisés : sans commentaire, sans classe, sur une seule ligne.
import { readFile, writeFile, readdir, unlink, copyFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const lucideDir = dirname(require.resolve('lucide-static/package.json'));
const { version } = JSON.parse(await readFile(join(lucideDir, 'package.json'), 'utf8'));
const { lucide } = JSON.parse(await readFile(join(root, 'icons.json'), 'utf8'));

const svgDir = join(root, 'svg');
const wanted = new Set(lucide.map((name) => `${name}.svg`));

// Retire les icônes Lucide qui ne sont plus listées (les icônes maison commencent par "onec-").
for (const file of await readdir(svgDir)) {
  if (file.endsWith('.svg') && !file.startsWith('onec-') && !wanted.has(file)) {
    await unlink(join(svgDir, file));
    console.log(`retirée  ${file}`);
  }
}

for (const name of lucide) {
  const raw = await readFile(join(lucideDir, 'icons', `${name}.svg`), 'utf8').catch(() => {
    throw new Error(`Icône inconnue dans lucide-static ${version} : ${name}`);
  });
  const svg = raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*class="[^"]*"/, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s*\/>/g, '/>')
    .replace(/<svg ([^>]*?)\s*>/, '<svg $1>')
    .trim();
  await writeFile(join(svgDir, `${name}.svg`), `${svg}\n`);
  console.log(`importée ${name}`);
}

await copyFile(join(lucideDir, 'LICENSE'), join(root, 'LICENSE-lucide'));
console.log(`${lucide.length} icônes depuis lucide-static ${version}`);
