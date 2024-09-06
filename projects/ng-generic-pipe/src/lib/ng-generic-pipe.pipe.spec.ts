import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgGenericPipe, NgGenericPipeModule } from '../public-api';

describe('NgGenericPipe: Component', () => {
    it('should works with ngModule', () => {
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
        @Component({ template: '{{ 3 | ngGenericPipe: test }}', standalone: true, imports: [NgGenericPipe] })
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
        @Component({ template: '{{ 3 | ngGenericPipe: test:3 }}', standalone: true, imports: [NgGenericPipe] })
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
        @Component({ template: '{{ 3 | ngGenericPipe: test:3:time }}', standalone: true, imports: [NgGenericPipe] })
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
        @Component({ template: '{{ undefined | ngGenericPipe: test }}', standalone: true, imports: [NgGenericPipe] })
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
