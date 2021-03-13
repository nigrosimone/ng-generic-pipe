import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgGenericPipe } from './ng-generic-pipe.pipe';
import { NgGenericPipeModule } from './ng-generic-pipe.module';

@Component({template: '<div>{{ 3 | ngGenericPipe: test }}</div>'})
class TestComponentOne {
    public y: number = 2;
    test(x: number): number {
        return x * this.y; 
    }
}
describe('NgGenericPipe into component TestComponentOne', () => {

    let fixture: ComponentFixture<TestComponentOne>;
    let debugElement: DebugElement;
    let element: HTMLElement;
    let div: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [ TestComponentOne ],
          imports: [NgGenericPipeModule]
        });
        fixture = TestBed.createComponent(TestComponentOne);
        debugElement = fixture.debugElement;
        element = debugElement.nativeElement;
        div = fixture.nativeElement.querySelector('div');
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('test basic function arg', () => {
        fixture.detectChanges();
        expect(div.textContent).toContain('6');
    });
});

@Component({template: '<div>{{ 3 | ngGenericPipe: test:3 }}</div>'})
class TestComponentTwo {
    public y: number = 2;
    test(x: number, z: number): number {
        return x * this.y * z; 
    }
}
describe('NgGenericPipe into component TestComponentTwo', () => {

    let fixture: ComponentFixture<TestComponentTwo>;

    let debugElement: DebugElement;
    let element: HTMLElement;
    let div: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [ TestComponentTwo ],
          imports: [NgGenericPipeModule]
        });
        fixture = TestBed.createComponent(TestComponentTwo);
        debugElement = fixture.debugElement;
        element = debugElement.nativeElement;
        div = fixture.nativeElement.querySelector('div');
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('test basic function arg', () => {
        fixture.detectChanges();
        expect(div.textContent).toContain('18');
    });
});

@Component({template: '<div>{{ 3 | ngGenericPipe: test:3:time }}</div>'})
class TestComponentThree {
    public y: number = 2;
    public time: number = Date.now();
    test(x: number, z: number): number {
        return x * this.y * z; 
    }
}
describe('NgGenericPipe into component TestComponentThree', () => {

    let fixture: ComponentFixture<TestComponentThree>;

    let debugElement: DebugElement;
    let element: HTMLElement;
    let div: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [ TestComponentThree ],
          imports: [NgGenericPipeModule]
        });
        fixture = TestBed.createComponent(TestComponentThree);
        debugElement = fixture.debugElement;
        element = debugElement.nativeElement;
        div = fixture.nativeElement.querySelector('div');
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('test basic function arg', () => {
        fixture.detectChanges();
        expect(div.textContent).toContain('18');
    });
});

@Component({template: '<div>{{ undefined | ngGenericPipe: test }}</div>'})
class TestComponentFour {
    public y: number = 2;
    test(): number {
        return this.y; 
    }
}
describe('NgGenericPipe into component TestComponentFour', () => {

    let fixture: ComponentFixture<TestComponentFour>;

    let debugElement: DebugElement;
    let element: HTMLElement;
    let div: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [ TestComponentFour ],
          imports: [NgGenericPipeModule]
        });
        fixture = TestBed.createComponent(TestComponentFour);
        debugElement = fixture.debugElement;
        element = debugElement.nativeElement;
        div = fixture.nativeElement.querySelector('div');
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('test basic function without arg', () => {
        fixture.detectChanges();
        expect(div.textContent).toContain('2');
    });
});

describe('NgGenericPipe trasform method', () => {

    const y = 2;
    const pipe = new NgGenericPipe({ context: this } as any);

    it('test basic function without arg', () => {
        const fn = () => {
            return 4;
        };
        expect(pipe.transform(undefined, fn)).toBe(4);
    });

    it('test basic function with arg', () => {
        const fn = (x) => {
            return x * y;
        };
        expect(pipe.transform(2, fn)).toBe(4);
    });

    it('test basic function with arg and additional arg', () => {
        const fn = (x) => {
            return x * 3;
        };
        expect(pipe.transform(2, fn, [1])).toBe(6);
    });
});