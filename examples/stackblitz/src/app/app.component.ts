import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgGenericPipe } from 'ng-generic-pipe';

@Component({
  selector: 'app-root',
  imports: [NgGenericPipe, FormsModule],
  template: `
    <label for="name">Change name:</label>
    <input
      type="text"
      id="name"
      [ngModel]="name()"
      (ngModelChange)="name.set($event)"
      style="width:50px"
    />
    &nbsp;
    <hr />
    <!-- calling greet(name()) directly would re-run on every change detection;
         through the pipe it is memoized, and this still points at the component -->
    <p>{{ name() | ngGenericPipe: greet }}</p>
  `,
})
export class AppComponent {
  readonly name = model('Simone');
  private readonly greeting = 'Hello';

  greet(who: string): string {
    return `${this.greeting}! I am ${who}.`;
  }
}
