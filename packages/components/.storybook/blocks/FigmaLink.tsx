// Lien « Ouvrir dans Figma » vers un nœud du fichier one-comp.
import type { ReactNode } from 'react';
import { figmaUrl, type FigmaNode } from '../figma';

type Props = { node?: FigmaNode; children?: ReactNode };

export function FigmaLink({ node, children = 'Ouvrir dans Figma' }: Props) {
  return (
    <a className="onec-figma-link" href={figmaUrl(node)} target="_blank" rel="noreferrer">
      <svg aria-hidden="true" width="12" height="18" viewBox="0 0 38 57">
        <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
        <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
        <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
        <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
        <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
      </svg>
      {children}
      <span className="onec-visually-hidden"> (nouvel onglet)</span>
    </a>
  );
}

/** Bandeau en tête de page : liens vers la maquette, le contrat et le code. */
export function SourceLinks({
  figma,
  links = [],
}: {
  figma?: FigmaNode;
  links?: { label: string; href: string }[];
}) {
  return (
    <div className="onec-source-links">
      <FigmaLink node={figma} />
      {links.map((l) => (
        <a
          key={l.href}
          className="onec-source-links__link"
          href={l.href}
          target="_blank"
          rel="noreferrer"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
