// Liens internes entre pages de doc (le manager Storybook change de page sans recharger).
import { useContext, type MouseEvent, type ReactNode } from 'react';
import { DocsContext } from '@storybook/addon-docs/blocks';
import { NAVIGATE_URL } from 'storybook/internal/core-events';

/** `path` : chemin Storybook, par exemple `/docs/design-tokens-couleurs--documentation`. */
export function DocLink({
  path,
  className,
  children,
}: {
  path: string;
  className?: string;
  children: ReactNode;
}) {
  const context = useContext(DocsContext);
  const onClick = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    context.channel.emit(NAVIGATE_URL, `?path=${path}`);
  };
  return (
    <a className={className} href={`./?path=${path}`} target="_top" onClick={onClick}>
      {children}
    </a>
  );
}

type Profile = { path: string; title: string; text: string };

/** Cartes d'entrée par profil. */
export function Profiles({ items }: { items: Profile[] }) {
  return (
    <nav className="onec-profiles" aria-label="Parcours">
      {items.map((p) => (
        <DocLink key={p.path} path={p.path} className="onec-profile">
          <strong>{p.title}</strong>
          <span>{p.text}</span>
        </DocLink>
      ))}
    </nav>
  );
}
