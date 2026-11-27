// Liens vers le fichier Figma one-comp, la bibliothèque alimentée depuis le code (P7).
// Plan Figma Pro : pas de Code Connect. Le lien code ↔ maquette passe par le panneau « Design »
// de Storybook (@storybook/addon-designs) et par les liens « Ouvrir dans Figma » des pages de doc.

export const FIGMA_FILE = 'https://www.figma.com/design/GXm5ZhXEjKeUpMraLaz49L/one-comp';

/** Nœuds utiles du fichier. À mettre à jour si les cadres sont recréés dans Figma. */
export const FIGMA_NODES = {
  cover: '24:1214',
  buttonPresentation: '20:431',
  buttonThemes: '21:80',
  buttonComponent: '21:840',
  buttonComponentSet: '16:2529',
  buttonDefault: '15:43',
  icons: '13:2',
} as const;

export type FigmaNode = keyof typeof FIGMA_NODES;

/** URL d'un nœud du fichier (le « : » de l'identifiant devient « - » dans l'URL). */
export const figmaUrl = (node?: FigmaNode) =>
  node ? `${FIGMA_FILE}?node-id=${FIGMA_NODES[node].replace(':', '-')}` : FIGMA_FILE;

/** Paramètre `design` de @storybook/addon-designs pour un nœud. */
export const figmaDesign = (node: FigmaNode) => ({ type: 'figma', url: figmaUrl(node) });
