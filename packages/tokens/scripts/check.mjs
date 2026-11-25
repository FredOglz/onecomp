// Contrôles bloquants des tokens : convention de nommage et contrastes AA dans les 4 thèmes.
// Voir docs/adr/0003-tokens-et-themes.md et docs/contracts/button.md (section 7).
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { wcagContrast, parse, formatHex } from 'culori';

const errors = [];

// 1. Nommage : chaque segment en minuscules, chiffres et tirets.
const SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
async function* jsonFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* jsonFiles(p);
    else if (e.name.endsWith('.json')) yield p;
  }
}
function walkNames(node, path, file) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (!SEGMENT.test(key))
      errors.push(`Nom hors convention : ${[...path, key].join('.')} (${file})`);
    if (value && typeof value === 'object') walkNames(value, [...path, key], file);
  }
}
for await (const file of jsonFiles('src'))
  walkNames(JSON.parse(await readFile(file, 'utf8')), [], file);

// 2. Contrastes, sur les valeurs résolues de chaque combinaison.
const TEXT_MIN = 4.5;
const UI_MIN = 3;
const VARIANTS = ['contained', 'outlined', 'ghost'];
const COLORS = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'];
const STATES = ['default', 'hover', 'active'];

// Une couleur transparente ou semi-transparente est composée sur la surface.
function over(color, surface) {
  const c = parse(color);
  const s = parse(surface);
  const a = c.alpha ?? 1;
  return formatHex({
    mode: 'rgb',
    r: c.r * a + s.r * (1 - a),
    g: c.g * a + s.g * (1 - a),
    b: c.b * a + s.b * (1 - a),
  });
}

const rows = [];
for (const theme of ['b2c-light', 'b2c-dark', 'b2b-light', 'b2b-dark']) {
  const t = JSON.parse(await readFile(`dist/json/${theme}.json`, 'utf8'));
  const surface = t.color.surface.default;
  const check = (label, fg, bg, min) => {
    const ratio = wcagContrast(fg, bg);
    const ok = ratio >= min;
    rows.push(
      `| ${theme} | ${label} | ${fg} | ${bg} | ${ratio.toFixed(2)} | ${min} | ${ok ? 'oui' : '**non**'} |`,
    );
    if (!ok) errors.push(`Contraste ${ratio.toFixed(2)} < ${min} : ${theme} ${label}`);
  };
  for (const v of VARIANTS)
    for (const c of COLORS) {
      const tok = t.button[v][c];
      for (const s of STATES)
        check(
          `button ${v} ${c} ${s} : texte`,
          tok.foreground[s],
          over(tok.background[s], surface),
          TEXT_MIN,
        );
      if (v === 'outlined')
        check(`button ${v} ${c} : bordure`, over(tok.border.default, surface), surface, UI_MIN);
    }
  check('anneau de focus', t.button['focus-ring'].color, surface, UI_MIN);
}

const report = [
  '# Rapport de contrastes',
  '',
  `${rows.length} contrôles, ${errors.filter((e) => e.startsWith('Contraste')).length} en échec.`,
  '',
  '| Thème | Contrôle | Avant-plan | Fond | Ratio | Minimum | OK |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  ...rows,
  '',
].join('\n');
await writeFile('dist/contrast-report.md', report);

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} erreur(s). Détail : dist/contrast-report.md`);
  process.exit(1);
}
console.log(`Nommage OK, ${rows.length} contrastes AA OK. Détail : dist/contrast-report.md`);
