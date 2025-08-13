import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgGenericPipe, NgGenericPipeModule } from '../public-api';

describe('NgGenericPipe: Pipe', () => {
    it('should works with deep scope', () => {
        @Component({
            // eslint-disable-next-line @angular-eslint/component-selector
            selector: 'test-component-deep',
            template: '{{ name }}'
        })
        class TestComponentDeepComponent {
            @Input() name = 0;
        }
        @Component({
            template: '<test-component-deep [name]="3 | ngGenericPipe: test"><test-component-deep>', 
            imports: [TestComponentDeepComponent, NgGenericPipe]
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
            template: '{{ 3 | ngGenericPipe: test }}', imports: [NgGenericPipeModule]
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
            template: '{{ 3 | ngGenericPipe: test }}', imports: [NgGenericPipe]
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
            template: '{{ 3 | ngGenericPipe: test:3 }}', imports: [NgGenericPipe]
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
            template: '{{ 3 | ngGenericPipe: test:3:time }}', imports: [NgGenericPipe]
        })
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
        @Component({
            template: '{{ undefined | ngGenericPipe: test }}', imports: [NgGenericPipe]
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
});
