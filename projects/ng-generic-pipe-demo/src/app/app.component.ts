import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgGenericPipe } from 'projects/ng-generic-pipe/src/public-api';
import { Observable, of } from 'rxjs';


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  template: `<main>
  <!-- testFromPipe has a third parameter name for trigger pipe refresh -->
  PIPE: {{ "arg1" | ngGenericPipe: testFromPipe:'arg2':name }}<br /><br />
  <!-- wrong way for call a function nto html just for test the result -->
  HTML: {{ testFromHtml("arg1", "arg2") }}<br /><br />
  <button (click)="triggerCD(false)">test</button>
  <button (click)="triggerCD(true)">test2</button>
  <br /><br />
  PIPE: {{ '0' | ngGenericPipe: testAsync | async }}<br /><br />
</main>
`,
  standalone: true,
  imports: [NgGenericPipe, CommonModule]
})
export class AppComponent {

  public name: number | null = null;

  constructor() {
    this.triggerCD(false);
  }

  test(a: string, b: string): string {
    // test multiple arguments and this scope works
    return `a:${a}; b:${b}; name:${this.name};`;
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
    this.name = new Date().getMinutes();
    if( force ){
      this.name++;
    }
  }

  testAsync(a: string): Observable<string> {
    return of(a);
  }
}
