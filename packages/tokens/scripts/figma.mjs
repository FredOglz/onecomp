// Prépare l'export des tokens vers les variables Figma (P7, ADR 0003).
// Écrit dist/figma/variables.json : 4 collections, leurs modes et chaque variable avec,
// par mode, soit une valeur brute, soit un alias vers une autre variable.
// Ce fichier est lu par le script d'import exécuté dans Figma (via le MCP) : rien n'est écrit dans Figma ici.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = async (f) => JSON.parse(await readFile(join(root, 'src', f), 'utf8'));

// Aplati un arbre DTCG : { 'color.palette.purple.50': { value, type, description } }
function flatten(tree, path = [], type, out = {}) {
  const t = tree.$type ?? type;
  if ('$value' in tree) {
    out[path.join('.')] = { value: tree.$value, type: t, description: tree.$description };
    return out;
  }
  for (const [k, v] of Object.entries(tree))
    if (!k.startsWith('$')) flatten(v, [...path, k], t, out);
  return out;
}

const sources = {
  primitives: flatten(await read('primitives.json')),
  semantic: flatten(await read('semantic.json')),
  b2c: flatten(await read('brand/b2c.json')),
  b2b: flatten(await read('brand/b2b.json')),
  light: flatten(await read('scheme/light.json')),
  dark: flatten(await read('scheme/dark.json')),
  button: flatten(await read('components/button.json')),
};

// Collections et modes (ADR 0003). Les sémantiques non thémés (tailles, espacements de contrôle)
// rejoignent Scheme avec la même valeur dans les deux modes, pour garder 4 collections.
const collections = [
  { name: 'Primitives', modes: { Default: sources.primitives } },
  { name: 'Brand', modes: { B2C: sources.b2c, B2B: sources.b2b } },
  {
    name: 'Scheme',
    modes: {
      Light: { ...sources.semantic, ...sources.light },
      Dark: { ...sources.semantic, ...sources.dark },
    },
  },
  { name: 'Components', modes: { Default: sources.button } },
];

const figmaName = (path) => path.replaceAll('.', '/');
const typeMap = {
  color: 'COLOR',
  dimension: 'FLOAT',
  number: 'FLOAT',
  fontWeight: 'FLOAT',
  fontFamily: 'STRING',
};

// Où vit chaque chemin : pour résoudre un alias vers sa collection.
const owner = {};
for (const c of collections)
  for (const tokens of Object.values(c.modes))
    for (const p of Object.keys(tokens)) owner[p] ??= c.name;

function convert(value, type) {
  const ref = typeof value === 'string' && value.match(/^\{(.+)\}$/);
  if (ref) {
    if (!owner[ref[1]]) throw new Error(`Alias introuvable : ${ref[1]}`);
    return { alias: figmaName(ref[1]), collection: owner[ref[1]] };
  }
  if (type === 'color') {
    const h = value.replace('#', '');
    const n = (i) => Math.round((parseInt(h.slice(i, i + 2), 16) / 255) * 1000) / 1000;
    return { value: { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 } };
  }
  if (type === 'dimension') {
    const m = String(value).match(/^(-?[\d.]+)(px|rem)?$/);
    if (!m) throw new Error(`Dimension illisible : ${value}`);
    return { value: Number(m[1]) * (m[2] === 'rem' ? 16 : 1) };
  }
  if (type === 'fontFamily') return { value: Array.isArray(value) ? value[0] : value };
  return { value: Number(value) };
}

// Portée des variables dans Figma (où elles sont proposées).
function scopes(path, type) {
  if (type === 'fontFamily') return ['FONT_FAMILY'];
  if (type === 'fontWeight') return ['FONT_WEIGHT'];
  if (path.includes('line-height')) return ['LINE_HEIGHT'];
  if (path.includes('font-size') || path.startsWith('font.size')) return ['FONT_SIZE'];
  if (type === 'color') {
    if (/(background|fill|surface)/.test(path)) return ['FRAME_FILL', 'SHAPE_FILL'];
    if (/(foreground|text|on-fill)/.test(path)) return ['TEXT_FILL', 'SHAPE_FILL'];
    if (/(border|ring)/.test(path)) return ['STROKE_COLOR'];
    return ['ALL_FILLS', 'STROKE_COLOR'];
  }
  if (/radius/.test(path)) return ['CORNER_RADIUS'];
  if (/border-width|ring\.(width|offset)|focus-ring\.(width|offset)/.test(path))
    return ['STROKE_FLOAT'];
  if (/(height|size\.)/.test(path)) return ['WIDTH_HEIGHT'];
  if (/(space|padding|gap)/.test(path)) return ['GAP'];
  return ['ALL_SCOPES'];
}

const out = { version: 1, collections: [] };
let count = 0;
for (const c of collections) {
  const modeNames = Object.keys(c.modes);
  const paths = [...new Set(modeNames.flatMap((m) => Object.keys(c.modes[m])))].filter(
    (p) => owner[p] === c.name,
  );
  const variables = paths.map((p) => {
    const first = modeNames.map((m) => c.modes[m][p]).find(Boolean);
    const type = first.type;
    if (!typeMap[type]) throw new Error(`Type non géré : ${type} (${p})`);
    const values = Object.fromEntries(
      modeNames.map((m) => [m, convert((c.modes[m][p] ?? first).value, type)]),
    );
    return {
      name: figmaName(p),
      type: typeMap[type],
      scopes: scopes(p, type),
      codeSyntax: `var(--onec-${p.replaceAll('.', '-')})`,
      ...(first.description ? { description: first.description } : {}),
      values,
    };
  });
  count += variables.length;
  out.collections.push({ name: c.name, modes: modeNames, variables });
}

await mkdir(join(root, 'dist/figma'), { recursive: true });
await writeFile(join(root, 'dist/figma/variables.json'), JSON.stringify(out, null, 2) + '\n');
console.log(
  `dist/figma/variables.json : ${count} variables (${out.collections.map((c) => `${c.name} ${c.variables.length}`).join(', ')})`,
);
