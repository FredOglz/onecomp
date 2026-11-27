// Blocs de la section « Design tokens » : tout est lu dans @onec/tokens, rien n'est recopié à la main.
// Sources DTCG (src/) pour les références, sorties résolues (dist/json) pour les valeurs par thème.
import { useState, type CSSProperties, type ReactNode } from 'react';
import primitives from '@onec/tokens/src/primitives.json';
import semantic from '@onec/tokens/src/semantic.json';
import brandB2c from '@onec/tokens/src/brand/b2c.json';
import brandB2b from '@onec/tokens/src/brand/b2b.json';
import schemeLight from '@onec/tokens/src/scheme/light.json';
import schemeDark from '@onec/tokens/src/scheme/dark.json';
import button from '@onec/tokens/src/components/button.json';
import b2cLight from '@onec/tokens/json/b2c-light';
import b2cDark from '@onec/tokens/json/b2c-dark';
import b2bLight from '@onec/tokens/json/b2b-light';
import b2bDark from '@onec/tokens/json/b2b-dark';

type Tree = { [key: string]: unknown };
type Token = { path: string; ref: string; type?: string; description?: string };

/** Aplati un arbre DTCG en liste de tokens, dans l'ordre des sources. */
function flatten(tree: Tree, path: string[] = [], type?: string, out: Token[] = []): Token[] {
  const t = (tree.$type as string) ?? type;
  if ('$value' in tree) {
    out.push({
      path: path.join('.'),
      ref: String(tree.$value),
      type: t,
      description: tree.$description as string | undefined,
    });
    return out;
  }
  for (const [k, v] of Object.entries(tree))
    if (!k.startsWith('$') && v && typeof v === 'object') flatten(v as Tree, [...path, k], t, out);
  return out;
}

export const THEMES = [
  { id: 'b2c-light', label: 'B2C · clair', brand: 'b2c', scheme: 'light', data: b2cLight },
  { id: 'b2c-dark', label: 'B2C · sombre', brand: 'b2c', scheme: 'dark', data: b2cDark },
  { id: 'b2b-light', label: 'B2B · clair', brand: 'b2b', scheme: 'light', data: b2bLight },
  { id: 'b2b-dark', label: 'B2B · sombre', brand: 'b2b', scheme: 'dark', data: b2bDark },
] as const;

/** Valeur résolue d'un chemin dans un thème. */
function resolve(data: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((node, k) => (node as Tree | undefined)?.[k], data);
}

const format = (v: unknown) => (Array.isArray(v) ? v.join(', ') : String(v ?? '—'));

/** Nom de la custom property CSS générée (préfixe onec, chemin en kebab). */
export const cssVar = (path: string) => `--onec-${path.replaceAll('.', '-')}`;
/** Nom de la variable Figma (le chemin, séparé par des barres obliques). */
export const figmaVar = (path: string) => path.replaceAll('.', '/');
/** Référence DTCG {a.b.c} lisible : la custom property visée. */
const refLabel = (ref: string) => (ref.startsWith('{') ? cssVar(ref.slice(1, -1)) : ref);

const isColor = (v: unknown) => typeof v === 'string' && /^#[0-9a-f]{6,8}$/i.test(v);

function Swatch({ color, size = 32 }: { color: string; size?: number }) {
  return (
    <span
      className="onec-swatch"
      style={{ '--swatch': color, width: size, height: size } as CSSProperties}
      aria-hidden="true"
    />
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="onec-token-code">{children}</code>;
}

// ——— Couleurs ————————————————————————————————————————————————

/** Les palettes primitives, palier par palier. */
export function Palettes() {
  const palettes = (
    primitives as Tree & { color: { palette: Record<string, Record<string, { $value: string }>> } }
  ).color.palette;
  return (
    <div className="onec-palettes">
      {Object.entries(palettes).map(([name, steps]) => (
        <div key={name} className="onec-palette">
          <div className="onec-palette__name">
            <strong>{name}</strong>
            <Code>{cssVar(`color.palette.${name}.*`)}</Code>
          </div>
          <div className="onec-palette__steps">
            {Object.entries(steps)
              .filter(([k]) => !k.startsWith('$'))
              .map(([step, t]) => (
                <div
                  key={step}
                  className="onec-palette__step"
                  title={cssVar(`color.palette.${name}.${step}`)}
                >
                  <span className="onec-palette__chip" style={{ background: t.$value }} />
                  <span className="onec-palette__label">{step}</span>
                  <span className="onec-palette__hex">{t.$value}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Quelle palette porte primary et secondary dans chaque marque. */
export function BrandMap() {
  const brands = { B2C: brandB2c, B2B: brandB2b };
  // '{color.palette.purple.600}' → 'purple'
  const paletteOf = (b: Tree, role: string) =>
    String((((b.brand as Tree)[role] as Tree)['600'] as Tree).$value).split('.')[2];
  return (
    <table className="onec-token-table">
      <thead>
        <tr>
          <th>Marque</th>
          <th>
            <Code>brand.primary</Code>
          </th>
          <th>
            <Code>brand.secondary</Code>
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(brands).map(([label, b]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            {['primary', 'secondary'].map((role) => {
              const steps = ((b as Tree).brand as Tree)[role] as Record<string, { $value: string }>;
              const theme = THEMES.find((t) => t.brand === label.toLowerCase())!;
              return (
                <td key={role}>
                  <div className="onec-brand-strip">
                    {Object.keys(steps)
                      .filter((k) => !k.startsWith('$'))
                      .map((k) => (
                        <span
                          key={k}
                          style={{ background: String(resolve(theme.data, `brand.${role}.${k}`)) }}
                          title={`${k}`}
                        />
                      ))}
                  </div>
                  palette <strong>{paletteOf(b as Tree, role)}</strong>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Table générique : un token par ligne, sa valeur dans les 4 thèmes. */
function ThemedTable({ tokens, refs }: { tokens: Token[]; refs?: (t: Token) => ReactNode }) {
  return (
    <div className="onec-token-table-wrap">
      <table className="onec-token-table">
        <thead>
          <tr>
            <th>Token</th>
            {refs && <th>Pointe vers</th>}
            {THEMES.map((t) => (
              <th key={t.id}>{t.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map((tok) => (
            <tr key={tok.path}>
              <td>
                <Code>{cssVar(tok.path)}</Code>
                <span className="onec-token-figma" title="Variable Figma">
                  {figmaVar(tok.path)}
                </span>
              </td>
              {refs && <td className="onec-token-ref">{refs(tok)}</td>}
              {THEMES.map((t) => {
                const v = resolve(t.data, tok.path);
                return (
                  <td key={t.id}>
                    {isColor(v) ? (
                      <span className="onec-token-value">
                        <Swatch color={String(v)} size={20} />
                        {String(v)}
                      </span>
                    ) : (
                      format(v)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const schemeTokens = (prefix?: string) =>
  flatten(schemeLight as Tree).filter((t) => (prefix ? t.path.startsWith(prefix) : true));

const schemeRef = (tok: Token) => {
  const light = flatten(schemeLight as Tree).find((t) => t.path === tok.path)?.ref ?? '';
  const dark = flatten(schemeDark as Tree).find((t) => t.path === tok.path)?.ref ?? '';
  return (
    <>
      <span>clair : {refLabel(light)}</span>
      <span>sombre : {refLabel(dark)}</span>
    </>
  );
};

/** Couleurs sémantiques de base : surface, texte, désactivé, focus. */
export function SemanticColors() {
  return (
    <ThemedTable
      tokens={schemeTokens().filter((t) => !t.path.startsWith('color.action'))}
      refs={schemeRef}
    />
  );
}

/** Les 7 rôles d'action, présentés en échantillons par thème. */
export function ActionRoles() {
  const roles = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'];
  return (
    <div className="onec-roles">
      {THEMES.map((theme) => (
        <div
          key={theme.id}
          className="onec-roles__theme"
          style={{ background: String(resolve(theme.data, 'color.surface.default')) }}
        >
          <p
            className="onec-roles__title"
            style={{ color: String(resolve(theme.data, 'color.text.default')) }}
          >
            {theme.label}
          </p>
          {roles.map((role) => {
            const v = (k: string) => String(resolve(theme.data, `color.action.${role}.${k}`));
            return (
              <div key={role} className="onec-roles__row">
                <span
                  className="onec-roles__fill"
                  style={{ background: v('fill'), color: v('on-fill') }}
                >
                  {role}
                </span>
                <span
                  className="onec-roles__outline"
                  style={{
                    borderColor: v('border'),
                    color: v('text'),
                    background: v('tint-hover'),
                  }}
                >
                  texte
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Détail des tokens d'un rôle d'action. */
export function ActionTokens() {
  const [role, setRole] = useState('primary');
  const roles = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'];
  return (
    <>
      <Filter label="Rôle" value={role} options={roles} onChange={setRole} />
      <ThemedTable tokens={schemeTokens(`color.action.${role}.`)} refs={schemeRef} />
    </>
  );
}

// ——— Typographie, espacements, dimensions ——————————————————————

const primitiveTokens = (prefix: string) =>
  flatten(primitives as Tree).filter((t) => t.path.startsWith(prefix));
const light = THEMES[0].data;

export function Typography() {
  const sizes = primitiveTokens('font.size.');
  const weights = primitiveTokens('font.weight.');
  const family = format(resolve(light, 'font.family.sans'));
  return (
    <>
      <p>
        Famille : <Code>{cssVar('font.family.sans')}</Code> = {family}
      </p>
      <table className="onec-token-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Valeur</th>
            <th>Exemple</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((t) => (
            <tr key={t.path}>
              <td>
                <Code>{cssVar(t.path)}</Code>
              </td>
              <td>
                {t.ref} ({parseFloat(t.ref) * 16} px)
              </td>
              <td style={{ fontFamily: family, fontSize: t.ref }}>Enregistrer le véhicule</td>
            </tr>
          ))}
          {weights.map((t) => (
            <tr key={t.path}>
              <td>
                <Code>{cssVar(t.path)}</Code>
              </td>
              <td>{t.ref}</td>
              <td style={{ fontFamily: family, fontWeight: Number(t.ref) }}>
                Enregistrer le véhicule
              </td>
            </tr>
          ))}
          {primitiveTokens('font.line-height.').map((t) => (
            <tr key={t.path}>
              <td>
                <Code>{cssVar(t.path)}</Code>
              </td>
              <td>{t.ref}</td>
              <td>Interlignage sans unité : multiplié par la taille du texte</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/** Une échelle de dimensions primitives (espacements, rayons, épaisseurs). */
export function Scale({ prefix, kind }: { prefix: string; kind: 'space' | 'radius' | 'border' }) {
  return (
    <table className="onec-token-table">
      <thead>
        <tr>
          <th>Token</th>
          <th>Valeur</th>
          <th>Aperçu</th>
        </tr>
      </thead>
      <tbody>
        {primitiveTokens(prefix).map((t) => {
          const v = String(resolve(light, t.path));
          const preview =
            kind === 'space' ? (
              <span className="onec-scale-bar" style={{ width: v }} />
            ) : kind === 'radius' ? (
              <span className="onec-scale-radius" style={{ borderRadius: v }} />
            ) : (
              <span className="onec-scale-border" style={{ borderTopWidth: v }} />
            );
          return (
            <tr key={t.path}>
              <td>
                <Code>{cssVar(t.path)}</Code>
              </td>
              <td>{v}</td>
              <td>{preview}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Sémantiques indépendants du thème : tailles de contrôle, espacements internes, focus… */
export function SemanticDimensions() {
  const tokens = flatten(semantic as Tree).filter((t) => t.type !== 'color');
  return (
    <table className="onec-token-table">
      <thead>
        <tr>
          <th>Token</th>
          <th>Pointe vers</th>
          <th>Valeur</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((t) => (
          <tr key={t.path}>
            <td>
              <Code>{cssVar(t.path)}</Code>
              <span className="onec-token-figma">{figmaVar(t.path)}</span>
            </td>
            <td className="onec-token-ref">{refLabel(t.ref)}</td>
            <td>{format(resolve(light, t.path))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ——— Composant ——————————————————————————————————————————————

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="onec-token-filter">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Tokens du Button : dimensions et typographie, puis couleurs filtrées par variante et couleur. */
export function ButtonTokens({ group }: { group: 'dimensions' | 'colors' }) {
  const [variant, setVariant] = useState('contained');
  const [color, setColor] = useState('primary');
  const all = flatten(button as Tree);
  const refs = (t: Token) => refLabel(t.ref);
  if (group === 'dimensions')
    return <ThemedTable tokens={all.filter((t) => t.type !== 'color')} refs={refs} />;
  return (
    <>
      <div className="onec-token-filters">
        <Filter
          label="Variante"
          value={variant}
          options={['contained', 'outlined', 'ghost']}
          onChange={setVariant}
        />
        <Filter
          label="Couleur"
          value={color}
          options={['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info']}
          onChange={setColor}
        />
      </div>
      <ThemedTable
        tokens={all.filter(
          (t) =>
            t.path.startsWith(`button.${variant}.${color}.`) ||
            t.path.startsWith('button.focus-ring.color'),
        )}
        refs={refs}
      />
    </>
  );
}

/** Nombre de tokens par niveau, pour la vue d'ensemble. */
export function TokenCounts() {
  const rows = [
    ['Primitives', 'primitives.json', flatten(primitives as Tree).length, 'Primitives', 'Default'],
    ['Marque', 'brand/{b2c,b2b}.json', flatten(brandB2c as Tree).length, 'Brand', 'B2C · B2B'],
    [
      'Sémantiques',
      'semantic.json + scheme/{light,dark}.json',
      flatten(semantic as Tree).length + flatten(schemeLight as Tree).length,
      'Scheme',
      'Light · Dark',
    ],
    [
      'Composant',
      'components/button.json',
      flatten(button as Tree).length,
      'Components',
      'Default',
    ],
  ];
  return (
    <table className="onec-token-table">
      <thead>
        <tr>
          <th>Niveau</th>
          <th>Fichier source</th>
          <th>Tokens</th>
          <th>Collection Figma</th>
          <th>Modes Figma</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([level, file, count, collection, modes]) => (
          <tr key={level as string}>
            <th scope="row">{level}</th>
            <td>
              <Code>{file}</Code>
            </td>
            <td>{count}</td>
            <td>{collection}</td>
            <td>{modes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
