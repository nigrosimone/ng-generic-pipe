import { Component, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { NgGenericDirective } from '../public-api';

describe('NgGenericPipe: directive', () => {
  it('should works with scope and multiple usage', () => {
    @Component({
      template: `<ng-content *ngGenericPipe="let g; method: test">{{
        g(1, 3) + g(2, 2) + g(3, 1)
      }}</ng-content>`,
      imports: [NgGenericDirective],
    })
    class TestComponent {
      public y = 2;
      test(x: number, z: number): number {
        return x * this.y * z;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('20');
  });

  it('exposes the bound method both as $implicit and as ngGenericPipe', () => {
    @Component({
      template: `<ng-content *ngGenericPipe="let g; method: double">{{ g(21) }}</ng-content>`,
      imports: [NgGenericDirective],
    })
    class TestComponent {
      public factor = 2;
      double(x: number): number {
        return x * this.factor;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('42');
  });

  it('supports a method returning an observable', () => {
    @Component({
      template: `<ng-content *ngGenericPipe="let g; method: echo">{{
        g('hi') | async
      }}</ng-content>`,
      imports: [NgGenericDirective, AsyncPipe],
    })
    class TestComponent {
      echo(value: string): Observable<string> {
        return of(`${value}!`);
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('hi!');
  });

  it('keeps the component as `this` even from inside an embedded view', () => {
    @Component({
      template: `@for (item of items; track item) {
        <span *ngGenericPipe="let g; method: scaled">{{ g(item) }}</span>
      }`,
      imports: [NgGenericDirective],
    })
    class TestComponent {
      readonly items = [1, 2, 3];
      readonly factor = 10;
      scaled(x: number): number {
        return x * this.factor;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const rendered = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('span'),
      (span) => span.textContent,
    );
    expect(rendered).toEqual(['10', '20', '30']);
  });

  it('rebinds only when the method reference actually changes', () => {
    const bound: unknown[] = [];

    @Component({
      template: `<ng-content *ngGenericPipe="let g; method: method()">{{
        g() + unrelated()
      }}</ng-content>`,
      imports: [NgGenericDirective],
    })
    class TestComponent {
      readonly unrelated = signal(0);
      readonly first = () => 'a';
      readonly second = () => 'b';
      readonly method = signal<() => string>(this.first);
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    bound.push(fixture.nativeElement.textContent);

    // a change detection run that does not touch the method must not rebind
    fixture.componentInstance.unrelated.set(1);
    fixture.detectChanges();
    bound.push(fixture.nativeElement.textContent);

    fixture.componentInstance.method.set(fixture.componentInstance.second);
    fixture.detectChanges();
    bound.push(fixture.nativeElement.textContent);

    expect(bound).toEqual(['a0', 'a1', 'b1']);
  });

  it('throws a clear error when the method is not a function', () => {
    @Component({
      template: `<ng-content *ngGenericPipe="let g; method: notAFunction">{{ g() }}</ng-content>`,
      imports: [NgGenericDirective],
    })
    class TestComponent {
      notAFunction = 'nope' as unknown as () => void;
    }

    const fixture = TestBed.createComponent(TestComponent);
    expect(() => fixture.detectChanges()).toThrow('ngGenericPipe: method must be a function');
  });

  it('ngTemplateContextGuard is a compile-time only assertion that always passes', () => {
    expect(
      NgGenericDirective.ngTemplateContextGuard<() => void>(
        null as unknown as NgGenericDirective<() => void>,
        undefined,
      ),
    ).toBe(true);
  });
});
