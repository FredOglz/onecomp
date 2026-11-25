import { Component, signal } from '@angular/core';
import { OnecButton, OnecIcon } from '@onec/angular';

@Component({
  selector: 'app-root',
  imports: [OnecButton, OnecIcon],
  templateUrl: './app.html',
})
export class App {
  readonly colors = [
    'primary',
    'secondary',
    'neutral',
    'success',
    'warning',
    'error',
    'info',
  ] as const;
  readonly variants = ['contained', 'outlined', 'ghost'] as const;

  readonly brand = signal<'b2c' | 'b2b'>('b2c');
  readonly scheme = signal<'light' | 'dark'>('light');
  readonly saving = signal(false);
  readonly result = signal('');

  toggleBrand() {
    this.brand.update((b) => (b === 'b2c' ? 'b2b' : 'b2c'));
  }

  toggleScheme() {
    this.scheme.update((s) => (s === 'light' ? 'dark' : 'light'));
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    this.saving.set(true);
    this.result.set('');
    setTimeout(() => {
      this.saving.set(false);
      this.result.set(`Envoyé : ${[...data].map(([k, v]) => `${k}=${v}`).join(', ')}`);
    }, 1200);
  }
}
