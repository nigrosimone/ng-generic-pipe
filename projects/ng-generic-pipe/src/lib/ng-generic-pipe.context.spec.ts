import { ChangeDetectorRef, Component, EmbeddedViewRef, Type, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgGenericDirective, NgGenericPipe } from '../public-api';

/**
 * Both the pipe and the directive resolve `this` by reading
 * `(ChangeDetectorRef as EmbeddedViewRef).context`, which is an Angular
 * implementation detail rather than a public contract. It has broken once
 * already — see https://github.com/nigrosimone/ng-generic-pipe/issues/2 and the
 * upstream angular/angular#59868 / #50952.
 *
 * These tests pin the assumption down, so the day Angular changes it the suite
 * says so instead of the users. They also cover the escape hatch that does not
 * depend on the internal at all: handing over an already bound function.
 */

describe('`this` resolution', () => {
  it('the injected ChangeDetectorRef still exposes the component as `context`', () => {
    @Component({ template: '' })
    class TestComponent {
      readonly cdRef = inject(ChangeDetectorRef);
    }

    const fixture = TestBed.createComponent(TestComponent);
    const cdRef = fixture.componentInstance.cdRef as EmbeddedViewRef<Type<unknown>>;

    // the whole library rests on this line holding true
    expect(cdRef.context).toBe(fixture.componentInstance);
  });

  it('the pipe applies the method against whatever `context` yields', () => {
    const context = { factor: 3 };
    const cdRef = { context } as unknown as ChangeDetectorRef;
    const pipe = new NgGenericPipe(cdRef);

    function scaled(this: typeof context, x: number): number {
      return x * this.factor;
    }

    expect(pipe.transform(2, scaled)).toBe(6);
  });

  it('an already bound function ignores the internal entirely', () => {
    @Component({
      template: '{{ 3 | ngGenericPipe: boundScaled }}',
      imports: [NgGenericPipe],
    })
    class TestComponent {
      readonly factor = 10;
      // the escape hatch: binding up front means the pipe never has to find `this`
      readonly boundScaled = this.scaled.bind(this);

      scaled(x: number): number {
        return x * this.factor;
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('30');
  });

  it('an arrow field ignores the internal too, and survives a broken context', () => {
    const cdRef = { context: undefined } as unknown as ChangeDetectorRef;
    const pipe = new NgGenericPipe(cdRef);
    const factor = 10;
    const scaled = (x: number): number => x * factor;

    // an arrow closes over its scope, so a context Angular no longer provides
    // cannot break it
    expect(pipe.transform(3, scaled)).toBe(30);
  });

  it('the directive binds against the same context the pipe uses', () => {
    @Component({
      template: `<ng-content *ngGenericPipe="let g; method: scaled">{{ g(3) }}</ng-content>`,
      imports: [NgGenericDirective],
    })
    class TestComponent {
      readonly factor = 10;
      scaled(x: number): number {
        return x * this.factor;
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('30');
  });

  it('a bound function reaches the directive unchanged', () => {
    @Component({
      template: `<ng-content *ngGenericPipe="let g; method: boundScaled">{{ g(3) }}</ng-content>`,
      imports: [NgGenericDirective],
    })
    class TestComponent {
      readonly factor = 10;
      readonly boundScaled = this.scaled.bind(this);

      scaled(x: number): number {
        return x * this.factor;
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('30');
  });
});
