import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgGenericDirective } from '../public-api';

describe('NgGenericPipe: directive', () => {
    it('should works with scope and multiple usage', () => {
        @Component({
            template: `<ng-content *ngGenericPipe="let g; method: test">{{ g(1, 3) + g(2, 2) + g(3, 1) }}</ng-content>`, 
            imports: [NgGenericDirective]
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
});
