# Apps de démo

Deux applications qui consomment les paquets `@onec/*` comme le ferait un projet tiers. Elles montrent la même page : les 21 combinaisons variante × couleur, un sélecteur de marque et de schéma, et un formulaire (soumission avec `name`/`value`, chargement, réinitialisation).

| App            | Stack                              | Lancer                                   |
| -------------- | ---------------------------------- | ---------------------------------------- |
| `react-demo`   | React 19, Vite                     | `pnpm --filter @onec/react-demo dev`     |
| `angular-demo` | Angular 22 (standalone, sans zone) | `pnpm --filter @onec/angular-demo start` |

Lancer d'abord `pnpm build` à la racine pour générer les paquets. Pour l'instant les apps lisent les paquets du workspace ; à partir de la première release (P8), elles installeront les archives publiées (ADR 0004).
