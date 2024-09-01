import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgGenericPipe } from './ng-generic-pipe.pipe';
import { NgGenericPipeModule } from './ng-generic-pipe.module';

describe('NgGenericPipe: Component', () => {
    it('test basic function arg', () => {
        @Component({ template: '{{ 3 | ngGenericPipe: test }}', standalone: true, imports: [NgGenericPipeModule] })
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

    it('test basic function arg', () => {
        @Component({ template: '{{ 3 | ngGenericPipe: test:3 }}', standalone: true, imports: [NgGenericPipeModule] })
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

    it('test basic function arg', () => {
        @Component({ template: '{{ 3 | ngGenericPipe: test:3:time }}', standalone: true, imports: [NgGenericPipeModule] })
        class TestComponent {
            public y = 2;
            public time: number = Date.now();
            test(x: number, z: number): number {
                return x * this.y * z;
            }
        }
        const fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.textContent).toContain('18');
    });

    it('test basic function without arg', () => {
        @Component({ template: '{{ undefined | ngGenericPipe: test }}', standalone: true, imports: [NgGenericPipeModule] })
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
});

describe('NgGenericPipe: Transform method', () => {

    const y = 2;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipe = new NgGenericPipe({ context: this } as any);

    it('test basic function without arg', () => {
        const fn = () => 4;
        expect(pipe.transform(undefined, fn)).toBe(4);
    });

    it('test basic function with arg', () => {
        const fn = (x: number) =>  x * y;
        expect(pipe.transform(2, fn)).toBe(4);
    });

    it('test basic function with arg and additional arg', () => {
        const fn = (x: number) => x * 3;
        expect(pipe.transform(2, fn, [1])).toBe(6);
    });
});
