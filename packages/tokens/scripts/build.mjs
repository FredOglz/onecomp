// Génère les sorties des tokens à partir des sources DTCG de src/.
// Voir docs/adr/0003-tokens-et-themes.md.
import StyleDictionary from 'style-dictionary';
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';

const PREFIX = 'onec';
const BRANDS = ['b2c', 'b2b'];
const SCHEMES = ['light', 'dark'];
const BASE = ['src/primitives.json', 'src/semantic.json'];
const COMPONENTS = ['src/components/*.json'];
const brandFile = (b) => `src/brand/${b}.json`;
const schemeFile = (s) => `src/scheme/${s}.json`;
const fromFile = (path) => (token) => token.filePath.endsWith(path.replace('src/', ''));

const log = { verbosity: 'silent', warnings: 'disabled' };

await rm('dist', { recursive: true, force: true });
await mkdir('dist/css', { recursive: true });

// 1. CSS : un fichier, des blocs par sélecteur, références conservées en var().
//    Les attributs data-brand et data-theme se posent ensemble sur le même élément.
const cssBlocks = [
  {
    selector: ':root',
    source: [...BASE],
    include: [],
    filter: (t) => fromFile('primitives.json')(t) || fromFile('semantic.json')(t),
    comment: 'Primitives et sémantiques indépendants du thème',
  },
  ...BRANDS.map((b) => ({
    selector: b === 'b2c' ? ':root, [data-brand="b2c"]' : `[data-brand="${b}"]`,
    source: [brandFile(b)],
    include: [...BASE],
    filter: fromFile(`brand/${b}.json`),
    comment: `Marque ${b.toUpperCase()}`,
  })),
  ...SCHEMES.map((s) => ({
    selector: s === 'light' ? ':root, [data-theme="light"]' : `[data-theme="${s}"]`,
    source: [schemeFile(s)],
    include: [...BASE, brandFile('b2c')],
    filter: fromFile(`scheme/${s}.json`),
    comment: `Schéma ${s}`,
  })),
  {
    selector: ':root, [data-brand], [data-theme]',
    source: COMPONENTS,
    include: [...BASE, brandFile('b2c'), schemeFile('light')],
    filter: (t) => t.filePath.includes('/components/'),
    comment: 'Tokens composant, recalculés sur chaque élément thémé',
  },
];

let css = `/* Généré par @onec/tokens. Ne pas modifier à la main. */\n`;
for (const [i, block] of cssBlocks.entries()) {
  const sd = new StyleDictionary({
    source: block.source,
    include: block.include,
    log,
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: PREFIX,
        buildPath: 'dist/.tmp/',
        files: [
          {
            destination: `${i}.css`,
            format: 'css/variables',
            filter: block.filter,
            options: { selector: block.selector, outputReferences: true, showFileHeader: false },
          },
        ],
      },
    },
  });
  await sd.buildAllPlatforms();
  css += `\n/* ${block.comment} */\n` + (await readFile(`dist/.tmp/${i}.css`, 'utf8'));
}
await writeFile('dist/css/tokens.css', css);

// 2. Une sortie résolue par combinaison marque × schéma : JSON (doc, agents, export Figma, contrôles) et SCSS.
for (const b of BRANDS) {
  for (const s of SCHEMES) {
    const name = `${b}-${s}`;
    const sd = new StyleDictionary({
      source: [...BASE, brandFile(b), schemeFile(s), ...COMPONENTS],
      log,
      platforms: {
        json: {
          transformGroup: 'js',
          buildPath: 'dist/json/',
          files: [{ destination: `${name}.json`, format: 'json/nested' }],
        },
        scss: {
          transformGroup: 'scss',
          prefix: PREFIX,
          buildPath: 'dist/scss/',
          files: [{ destination: `_${name}.scss`, format: 'scss/variables' }],
        },
      },
    });
    await sd.buildAllPlatforms();
  }
}
await rm('dist/.tmp', { recursive: true, force: true });
console.log('Tokens générés dans dist/ (css, json, scss).');
