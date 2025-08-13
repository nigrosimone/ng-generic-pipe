import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NgGenericPipe, NgGenericDirective } from 'projects/ng-generic-pipe/src/public-api';
import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  template: `<main>
    <input [(ngModel)]="arg1" > <input [(ngModel)]="arg2" ><br /><br />
  <!-- testFromPipe has a third parameter name for trigger pipe refresh -->
  PIPE: {{ arg1() | ngGenericPipe: testFromPipe:arg2():name() }}<br /><br />
  DIRECTIVE: <ng-content *ngGenericPipe="let fn; method: testFromDirective">{{ fn(arg1(), arg2()) }}</ng-content>
  <!-- wrong way for call a function into html just for test the result -->
  HTML: {{ testFromHtml(arg1(), arg2()) }}<br /><br />
  <button (click)="triggerCD(false)">update</button>
  <button (click)="triggerCD(true)">force update</button>
  <br /><br />
  PIPE async: {{ arg1() | ngGenericPipe: testAsync | async }}<br /><br />
  DIRECTIVE async: <ng-content *ngGenericPipe="let fn; method: testAsync">{{ fn(arg1()) | async }}</ng-content><br /><br />
  HTML async: {{ testAsync(arg1()) | async }}<br /><br />
</main>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgGenericPipe, NgGenericDirective, AsyncPipe, FormsModule]
})
export class AppComponent {

  public readonly name = signal(0);
  public readonly arg1 = model('arg1');
  public readonly arg2 = model('arg2');

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

  testFromDirective(a: string, b: string): string {
    console.log('DIRECTIVE');
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
