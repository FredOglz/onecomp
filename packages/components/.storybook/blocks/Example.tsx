// Un exemple de la doc : le rendu, puis son code en React, Angular et HTML.
import { Canvas } from '@storybook/addon-docs/blocks';
import { StoryCode } from './CodeTabs';

export function Example({ of }: { of: unknown }) {
  return (
    <div className="onec-example">
      <Canvas of={of as never} sourceState="none" />
      <StoryCode of={of} />
    </div>
  );
}
