// Crée les archives npm de chaque paquet dans release/ (voir ADR 0004).
// Les dépendances workspace:* sont remplacées par la version commune.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const out = join(root, 'release');
const tmp = join(root, 'release', '.tmp');
rmSync(out, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

// Le paquet Angular se publie depuis le dossier produit par ng-packagr.
const packages = {
  tokens: 'packages/tokens',
  icons: 'packages/icons',
  components: 'packages/components',
  react: 'packages/react',
  angular: 'packages/angular/dist',
};

for (const [name, dir] of Object.entries(packages)) {
  const src = join(root, dir);
  const pkg = JSON.parse(readFileSync(join(src, 'package.json'), 'utf8'));
  if (pkg.version !== version)
    throw new Error(`${pkg.name} est en ${pkg.version}, attendu ${version}`);
  const work = join(tmp, name);
  cpSync(src, work, {
    recursive: true,
    filter: (p) =>
      !p.includes('node_modules') && !p.includes('.stencil') && !p.includes('storybook-static'),
  });
  for (const field of ['dependencies', 'peerDependencies', 'devDependencies']) {
    for (const [dep, range] of Object.entries(pkg[field] ?? {})) {
      if (range.startsWith('workspace:')) pkg[field][dep] = version;
    }
  }
  delete pkg.devDependencies;
  writeFileSync(join(work, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
  const file = execFileSync('npm', ['pack', '--silent', '--pack-destination', out], {
    cwd: work,
    encoding: 'utf8',
  }).trim();
  console.log(`${pkg.name}@${version} → release/${file}`);
}
rmSync(tmp, { recursive: true, force: true });
