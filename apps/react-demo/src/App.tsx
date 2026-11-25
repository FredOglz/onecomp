import { useState, type FormEvent } from 'react';
import { OnecButton, OnecIcon } from '@onec/react';

type Brand = 'b2c' | 'b2b';
type Scheme = 'light' | 'dark';

const colors = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error', 'info'] as const;
const variants = ['contained', 'outlined', 'ghost'] as const;

export function App() {
  const [brand, setBrand] = useState<Brand>('b2c');
  const [scheme, setScheme] = useState<Scheme>('light');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(true);
    setResult('');
    setTimeout(() => {
      setSaving(false);
      setResult(`Envoyé : ${[...data].map(([k, v]) => `${k}=${v}`).join(', ')}`);
    }, 1200);
  };

  return (
    <main className="page" data-brand={brand} data-theme={scheme}>
      <header className="toolbar">
        <h1>onec · React</h1>
        <OnecButton
          variant="outlined"
          color="neutral"
          size="small"
          onClick={() => setBrand(brand === 'b2c' ? 'b2b' : 'b2c')}
        >
          Marque : {brand.toUpperCase()}
        </OnecButton>
        <OnecButton
          variant="outlined"
          color="neutral"
          size="small"
          onClick={() => setScheme(scheme === 'light' ? 'dark' : 'light')}
        >
          Schéma : {scheme === 'light' ? 'clair' : 'sombre'}
        </OnecButton>
      </header>

      <section>
        <h2>Variantes et couleurs</h2>
        <div className="grid">
          {variants.map((variant) =>
            colors.map((color) => (
              <OnecButton key={`${variant}-${color}`} variant={variant} color={color}>
                {color}
              </OnecButton>
            )),
          )}
        </div>
      </section>

      <section>
        <h2>Formulaire</h2>
        <form className="form" onSubmit={onSubmit}>
          <label>
            Immatriculation <input name="plate" defaultValue="AB-123-CD" />
          </label>
          <OnecButton type="submit" name="action" value="save" loading={saving}>
            <OnecIcon slot="icon-start" name="check" />
            Enregistrer
          </OnecButton>
          <OnecButton type="reset" variant="ghost" color="neutral">
            Annuler
          </OnecButton>
        </form>
        <p role="status">{result}</p>
      </section>
    </main>
  );
}
