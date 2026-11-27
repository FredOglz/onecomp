// Génère les extraits de code d'un ou plusieurs boutons pour les trois cibles : React, Angular, HTML.
// Les stories décrivent leurs exemples (parameters.docs.examples) ; ce module les traduit.

export type Lang = 'react' | 'angular' | 'html';

export type ButtonSpec = {
  label?: string;
  variant?: string;
  color?: string;
  size?: string;
  type?: string;
  disabled?: boolean;
  loading?: boolean;
  iconStart?: string;
  iconEnd?: string;
  name?: string;
  value?: string;
};

/** Code écrit à la main, quand la génération ne suffit pas (formulaire, logique). */
export type CodeOverride = Partial<Record<Lang, string>>;

const DEFAULTS: Record<string, string> = {
  variant: 'contained',
  color: 'primary',
  size: 'medium',
  type: 'button',
};

const STRING_PROPS = ['variant', 'color', 'size', 'type', 'name', 'value'] as const;

/** Propriétés à écrire : seules celles qui diffèrent de la valeur par défaut. */
function props(b: ButtonSpec) {
  const strings = STRING_PROPS.filter((k) => b[k] && b[k] !== DEFAULTS[k]).map(
    (k) => [k, b[k] as string] as const,
  );
  const booleans = (['disabled', 'loading'] as const).filter((k) => b[k]);
  return { strings, booleans };
}

const indent = (text: string, n: number) =>
  text
    .split('\n')
    .map((l) => (l ? ' '.repeat(n) + l : l))
    .join('\n');

function reactButton(b: ButtonSpec, handler: boolean) {
  const { strings, booleans } = props(b);
  const attrs = [
    ...strings.map(([k, v]) => `${k}="${v}"`),
    ...booleans,
    ...(handler ? ['onClick={handleClick}'] : []),
  ];
  const open = `<OnecButton${attrs.length ? ' ' + attrs.join(' ') : ''}>`;
  const body = [
    b.iconStart && `  <OnecIcon slot="icon-start" name="${b.iconStart}" />`,
    `  ${b.label ?? ''}`,
    b.iconEnd && `  <OnecIcon slot="icon-end" name="${b.iconEnd}" />`,
  ].filter(Boolean);
  return [open, ...body, '</OnecButton>'].join('\n');
}

function angularButton(b: ButtonSpec, handler: boolean) {
  const { strings, booleans } = props(b);
  const attrs = [
    ...strings.map(([k, v]) => `${k}="${v}"`),
    // Liaison explicite : un attribut nu vaudrait "" pour une entrée booléenne en templates stricts.
    ...booleans.map((k) => `[${k}]="true"`),
    ...(handler ? ['(click)="onClick()"'] : []),
  ];
  const open = `<onec-button${attrs.length ? ' ' + attrs.join(' ') : ''}>`;
  const body = [
    b.iconStart && `  <onec-icon slot="icon-start" name="${b.iconStart}"></onec-icon>`,
    `  ${b.label ?? ''}`,
    b.iconEnd && `  <onec-icon slot="icon-end" name="${b.iconEnd}"></onec-icon>`,
  ].filter(Boolean);
  return [open, ...body, '</onec-button>'].join('\n');
}

function htmlButton(b: ButtonSpec) {
  const { strings, booleans } = props(b);
  const attrs = [...strings.map(([k, v]) => `${k}="${v}"`), ...booleans];
  const open = `<onec-button${attrs.length ? ' ' + attrs.join(' ') : ''}>`;
  const body = [
    b.iconStart && `  <onec-icon slot="icon-start" name="${b.iconStart}"></onec-icon>`,
    `  ${b.label ?? ''}`,
    b.iconEnd && `  <onec-icon slot="icon-end" name="${b.iconEnd}"></onec-icon>`,
  ].filter(Boolean);
  return [open, ...body, '</onec-button>'].join('\n');
}

const usesIcon = (buttons: ButtonSpec[]) => buttons.some((b) => b.iconStart || b.iconEnd);

/** Les trois extraits pour une liste de boutons. Un bouton seul reçoit un gestionnaire de clic. */
export function buttonCode(buttons: ButtonSpec[]): Record<Lang, string> {
  const handler = buttons.length === 1;
  const imports = usesIcon(buttons) ? 'OnecButton, OnecIcon' : 'OnecButton';

  const reactJsx = buttons.map((b) => reactButton(b, handler)).join('\n');
  const reactBody = buttons.length > 1 ? `<>\n${indent(reactJsx, 2)}\n</>` : reactJsx;
  const react = [
    `import { ${imports} } from '@onec/react';`,
    '',
    'export function Example() {',
    ...(handler ? ["  const handleClick = () => console.log('clic');", ''] : []),
    '  return (',
    indent(reactBody, 4),
    '  );',
    '}',
  ].join('\n');

  const template = buttons.map((b) => angularButton(b, handler)).join('\n');
  const angular = [
    "import { Component } from '@angular/core';",
    `import { ${imports} } from '@onec/angular';`,
    '',
    '@Component({',
    "  selector: 'app-example',",
    `  imports: [${imports}],`,
    '  template: `',
    indent(template, 4),
    '  `,',
    '})',
    handler
      ? "export class Example {\n  onClick() {\n    console.log('clic');\n  }\n}"
      : 'export class Example {}',
  ].join('\n');

  const html = buttons.map(htmlButton).join('\n');

  return { react, angular, html };
}
