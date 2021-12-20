import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgGenericPipe } from './ng-generic-pipe.pipe';
import { NgGenericPipeModule } from './ng-generic-pipe.module';

@Component({ template: '<div>{{ 3 | ngGenericPipe: test }}</div>' })
class TestOneComponent {
    public y = 2;
    test(x: number): number {
        return x * this.y;
    }
}
describe('NgGenericPipe into component TestComponentOne', () => {

    let fixture: ComponentFixture<TestOneComponent>;
    let debugElement: DebugElement;
    let element: HTMLElement;
    let div: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestOneComponent],
            imports: [NgGenericPipeModule]
        });
        fixture = TestBed.createComponent(TestOneComponent);
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

@Component({ template: '<div>{{ 3 | ngGenericPipe: test:3 }}</div>' })
class TestTwoComponent {
    public y = 2;
    test(x: number, z: number): number {
        return x * this.y * z;
    }
}
describe('NgGenericPipe into component TestComponentTwo', () => {

    let fixture: ComponentFixture<TestTwoComponent>;

    let debugElement: DebugElement;
    let element: HTMLElement;
    let div: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestTwoComponent],
            imports: [NgGenericPipeModule]
        });
        fixture = TestBed.createComponent(TestTwoComponent);
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

@Component({ template: '<div>{{ 3 | ngGenericPipe: test:3:time }}</div>' })
class TestThreeComponent {
    public y = 2;
    public time: number = Date.now();
    test(x: number, z: number): number {
        return x * this.y * z;
    }
}
describe('NgGenericPipe into component TestComponentThree', () => {

    let fixture: ComponentFixture<TestThreeComponent>;

    let debugElement: DebugElement;
    let element: HTMLElement;
    let div: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestThreeComponent],
            imports: [NgGenericPipeModule]
        });
        fixture = TestBed.createComponent(TestThreeComponent);
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

@Component({ template: '<div>{{ undefined | ngGenericPipe: test }}</div>' })
class TestFourComponent {
    public y = 2;
    test(): number {
        return this.y;
    }
}
describe('NgGenericPipe into component TestComponentFour', () => {

    let fixture: ComponentFixture<TestFourComponent>;

    let debugElement: DebugElement;
    let element: HTMLElement;
    let div: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestFourComponent],
            imports: [NgGenericPipeModule]
        });
        fixture = TestBed.createComponent(TestFourComponent);
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
        const fn = (x: number) => {
            return x * y;
        };
        expect(pipe.transform(2, fn)).toBe(4);
    });

    it('test basic function with arg and additional arg', () => {
        const fn = (x: number) => {
            return x * 3;
        };
        expect(pipe.transform(2, fn, [1])).toBe(6);
    });
});
