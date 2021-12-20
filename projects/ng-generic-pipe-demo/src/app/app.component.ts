import { Component } from '@angular/core';


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  public name: number | null = null;

  constructor() {
    this.triggerCD();
  }

  test(a: string, b: string): string {
    // test multiple arguments anch this scope works
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

  triggerCD(): void {
    this.name = new Date().getMinutes();
  }
}
