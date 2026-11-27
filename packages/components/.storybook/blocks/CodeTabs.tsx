// Bloc de code à onglets React / Angular / HTML. Le choix est mémorisé (localStorage)
// et partagé par tous les blocs de la page et des pages suivantes.
import { useContext, useEffect, useId, useState, type KeyboardEvent } from 'react';
import { DocsContext, Source, useOf } from '@storybook/addon-docs/blocks';
import { STORY_ARGS_UPDATED } from 'storybook/internal/core-events';
import { buttonCode, type ButtonSpec, type CodeOverride, type Lang } from './code';

export const LANGS: { id: Lang; label: string; language: string }[] = [
  { id: 'react', label: 'React', language: 'tsx' },
  { id: 'angular', label: 'Angular', language: 'typescript' },
  { id: 'html', label: 'HTML', language: 'html' },
];

const STORAGE_KEY = 'onec-docs-lang';
const EVENT = 'onec-docs-lang';
const DEFAULT_LANG: Lang = 'react';

function readLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (LANGS.some((l) => l.id === v)) return v as Lang;
  } catch {
    /* stockage indisponible : valeur par défaut */
  }
  return DEFAULT_LANG;
}

/** Langage choisi, synchronisé entre tous les blocs ouverts. */
export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>(readLang);
  useEffect(() => {
    const sync = () => setLangState(readLang());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  const setLang = (l: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* rien à mémoriser */
    }
    setLangState(l);
    window.dispatchEvent(new Event(EVENT));
  };
  return [lang, setLang];
}

type CodeTabsProps = {
  /** Extrait par langage ; un langage absent n'a pas d'onglet. */
  code: CodeOverride;
};

export function CodeTabs({ code }: CodeTabsProps) {
  const [lang, setLang] = useLang();
  const id = useId();
  const available = LANGS.filter((l) => code[l.id]);
  const current = available.find((l) => l.id === lang) ?? available[0];
  if (!current) return null;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = available.indexOf(current);
    const next =
      e.key === 'ArrowRight'
        ? available[(i + 1) % available.length]
        : e.key === 'ArrowLeft'
          ? available[(i - 1 + available.length) % available.length]
          : undefined;
    if (!next) return;
    e.preventDefault();
    setLang(next.id);
    document.getElementById(`${id}-${next.id}`)?.focus();
  };

  return (
    <div className="onec-code-tabs">
      <div
        role="tablist"
        aria-label="Langage du code"
        className="onec-code-tabs__list"
        onKeyDown={onKeyDown}
      >
        {available.map((l) => (
          <button
            key={l.id}
            id={`${id}-${l.id}`}
            type="button"
            role="tab"
            aria-selected={l.id === current.id}
            aria-controls={`${id}-panel`}
            tabIndex={l.id === current.id ? 0 : -1}
            className="onec-code-tabs__tab"
            onClick={() => setLang(l.id)}
          >
            {l.label}
          </button>
        ))}
        <span className="onec-code-tabs__hint">Choix mémorisé pour toutes les pages</span>
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${current.id}`}>
        <Source code={code[current.id]!} language={current.language as never} dark />
      </div>
    </div>
  );
}

/** Paramètres lus sur une story : `parameters.onec`. */
export type OnecParameters = {
  /** Boutons montrés dans le code, calculés à partir des args (les contrôles mettent le code à jour). */
  examples?: ButtonSpec[] | ((args: Record<string, unknown>) => ButtonSpec[]);
  /** Code écrit à la main, prioritaire sur `examples`. */
  code?: CodeOverride;
};

/** Code d'une story, mis à jour quand on change ses contrôles. */
export function StoryCode({ of }: { of: unknown }) {
  const context = useContext(DocsContext);
  const { story } = useOf(of as never, ['story']) as {
    story: { id: string; parameters: { onec?: OnecParameters } };
  };
  const [args, setArgs] = useState<Record<string, unknown>>(
    () => context.getStoryContext(story as never).args,
  );

  useEffect(() => {
    const onUpdate = ({
      storyId,
      args: next,
    }: {
      storyId: string;
      args: Record<string, unknown>;
    }) => {
      if (storyId === story.id) setArgs(next);
    };
    context.channel.on(STORY_ARGS_UPDATED, onUpdate);
    return () => context.channel.off(STORY_ARGS_UPDATED, onUpdate);
  }, [context, story.id]);

  const onec = story.parameters.onec ?? {};
  const examples = typeof onec.examples === 'function' ? onec.examples(args) : onec.examples;
  const code = { ...(examples ? buttonCode(examples) : {}), ...onec.code };
  return <CodeTabs code={code} />;
}
