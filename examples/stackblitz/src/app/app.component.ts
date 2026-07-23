import { Component, signal } from '@angular/core';
import { NgGenericPipe } from 'ng-generic-pipe';

@Component({
  selector: 'app-root',
  imports: [NgGenericPipe],
  template: `
    <!-- calling greet(name()) directly would re-run on every change detection;
         through the pipe it is memoized, and this still points at the component -->
    <p>{{ name() | ngGenericPipe: greet }}</p>

    <button (click)="name.set('Mario')">rename</button>
  `,
})
export class AppComponent {
  readonly name = signal('Simone');
  private readonly greeting = 'Hello';

  greet(who: string): string {
    return this.greeting + '! I am ' + who + '.';
  }
}
