import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgGenericPipe } from 'projects/ng-generic-pipe/src/public-api';
import { Observable, of } from 'rxjs';


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  template: `<main>
  <!-- testFromPipe has a third parameter name for trigger pipe refresh -->
  PIPE: {{ "arg1" | ngGenericPipe: testFromPipe:'arg2':name() }}<br /><br />
  <!-- wrong way for call a function into html just for test the result -->
  HTML: {{ testFromHtml("arg1", "arg2") }}<br /><br />
  <button (click)="triggerCD(false)">update</button>
  <button (click)="triggerCD(true)">force update</button>
  <br /><br />
  PIPE: {{ '0' | ngGenericPipe: testAsync | async }}<br /><br />
</main>
`,
  standalone: true,
  imports: [NgGenericPipe, CommonModule]
})
export class AppComponent {

  public name = signal(0);

  constructor() {
    this.triggerCD(false);
  }

  test(a: string, b: string): string {
    // test multiple arguments and this scope works
    return `a:${a}; b:${b}; name:${this.name()};`;
  }

  testFromHtml(a: string, b: string): string {
    console.log('FUNCTION');
    return this.test(a, b);
  }

  testFromPipe(a: string, b: string): string {
    console.log('PIPE');
    return this.test(a, b);
  }

  triggerCD(force: boolean): void {
    if (force) {
      this.name.update(val => val + 1);
    } else {
      this.name.set(new Date().getMinutes());
    }
  }

  testAsync(a: string): Observable<string> {
    return of(a);
  }
}
