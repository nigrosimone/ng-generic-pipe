import { ChangeDetectorRef, Component, Input, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { NgGenericPipe, NgGenericPipeModule } from '../public-api';

describe('NgGenericPipe: Pipe', () => {
  it('should works with deep scope', () => {
    @Component({
      selector: 'test-component-deep',
      template: '{{ name }}',
    })
    class TestComponentDeepComponent {
      @Input() name = 0;
    }
    @Component({
      template: '<test-component-deep [name]="3 | ngGenericPipe: test"><test-component-deep>',
      imports: [TestComponentDeepComponent, NgGenericPipe],
    })
    class TestComponent {
      public y = 2;
      test(x: number): number {
        return x * this.y;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('6');
  });

  it('should works with ngModule', () => {
    @Component({
      template: '{{ 3 | ngGenericPipe: test }}',
      imports: [NgGenericPipeModule],
    })
    class TestComponent {
      public y = 2;
      test(x: number): number {
        return x * this.y;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('6');
  });

  it('test basic function arg with and scope', () => {
    @Component({
      template: '{{ 3 | ngGenericPipe: test }}',
      imports: [NgGenericPipe],
    })
    class TestComponent {
      public y = 2;
      test(x: number): number {
        return x * this.y;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('6');
  });

  it('test basic function with arg', () => {
    @Component({
      template: '{{ 3 | ngGenericPipe: test:3 }}',
      imports: [NgGenericPipe],
    })
    class TestComponent {
      public y = 2;
      test(x: number, z: number): number {
        return x * this.y * z;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('18');
  });

  it('test basic function with additional arg', () => {
    @Component({
      template: '{{ 3 | ngGenericPipe: test:3:time }}',
      imports: [NgGenericPipe],
    })
    class TestComponent {
      public y = 2;
      public time = 1_700_000_000_000;
      test(x: number, z: number): number {
        return x * this.y * z;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('18');
  });

  it('test basic function without arg', () => {
    @Component({
      template: '{{ undefined | ngGenericPipe: test }}',
      imports: [NgGenericPipe],
    })
    class TestComponent {
      public y = 2;
      test(): number {
        return this.y;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('2');
  });

  it('forwards every tail argument, in order', () => {
    const seen: unknown[] = [];

    @Component({
      template: '{{ 1 | ngGenericPipe: collect:2:3:4 }}',
      imports: [NgGenericPipe],
    })
    class TestComponent {
      collect(...args: number[]): string {
        seen.push(...args);
        return args.join('-');
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    expect(seen).toEqual([1, 2, 3, 4]);
    expect(fixture.nativeElement.textContent).toContain('1-2-3-4');
  });

  it('is pure: it is not re-evaluated while its arguments are stable', () => {
    let calls = 0;

    @Component({
      template: '{{ value() | ngGenericPipe: count }} {{ unrelated() }}',
      imports: [NgGenericPipe],
    })
    class TestComponent {
      readonly value = signal(1);
      readonly unrelated = signal(0);
      count(x: number): number {
        calls++;
        return x;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(calls).toBe(1);

    fixture.componentInstance.unrelated.set(1);
    fixture.detectChanges();
    expect(calls).toBe(1);

    fixture.componentInstance.value.set(2);
    fixture.detectChanges();
    expect(calls).toBe(2);
  });

  it('re-evaluates when a tail argument changes, even if the head does not', () => {
    @Component({
      template: '{{ 3 | ngGenericPipe: multiply:factor() }}',
      imports: [NgGenericPipe],
    })
    class TestComponent {
      readonly factor = signal(2);
      multiply(x: number, by: number): number {
        return x * by;
      }
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('6');

    fixture.componentInstance.factor.set(3);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('9');
  });

  it('supports a method returning an observable, piped through async', () => {
    @Component({
      template: '{{ "hi" | ngGenericPipe: echo | async }}',
      imports: [NgGenericPipe, AsyncPipe],
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
        <span>{{ item | ngGenericPipe: scaled }}</span>
      }`,
      imports: [NgGenericPipe],
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

  it('rejects a non-function with a message naming the pipe', () => {
    const pipe = new NgGenericPipe({} as ChangeDetectorRef);

    expect(() => pipe.transform(1, 'nope' as unknown as () => void)).toThrow(
      'ngGenericPipe: fnReference must be a function',
    );
  });
});
