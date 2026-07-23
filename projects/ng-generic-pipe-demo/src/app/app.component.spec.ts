import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the same result through the pipe, the directive and a plain call', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    const expected = `a:arg1; b:arg2; name:${fixture.componentInstance.name()};`;

    expect(text).toContain(`PIPE: ${expected}`);
    expect(text).toContain(`DIRECTIVE: ${expected}`);
    expect(text).toContain(`HTML: ${expected}`);
  });

  it('force update bumps the name, plain update snaps it to the current minute', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const before = fixture.componentInstance.name();
    fixture.componentInstance.triggerCD(true);
    expect(fixture.componentInstance.name()).toBe(before + 1);

    fixture.componentInstance.triggerCD(false);
    expect(fixture.componentInstance.name()).toBe(new Date().getMinutes());
  });
});
