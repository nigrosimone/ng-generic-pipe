import { ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgGenericDirective, NgGenericPipe } from '../public-api';

/**
 * `transform` is driven by three conditional types — `First`, `OmitFirstArg` and
 * `TailArguments` — which is where this library is genuinely fragile: a change in
 * how TypeScript resolves conditional or variadic tuple types would silently
 * loosen the signature without breaking a single runtime test. These assertions
 * are checked when the specs are compiled, so a regression fails the run before
 * any test executes.
 */

describe('type surface', () => {
  const pipe = new NgGenericPipe({} as ChangeDetectorRef);

  it('derives the return type from the method, not from the head argument', () => {
    expectTypeOf(pipe.transform(1, (x: number) => x * 2)).toEqualTypeOf<number>();
    expectTypeOf(pipe.transform(1, (_x: number) => 'text')).toEqualTypeOf<string>();
    expectTypeOf(pipe.transform(1, (_x: number) => ({ ok: true }))).toEqualTypeOf<{
      ok: boolean;
    }>();
  });

  it('keeps a generic-looking return type intact', () => {
    expectTypeOf(pipe.transform('a', (x: string) => of(x))).toEqualTypeOf<Observable<string>>();
    expectTypeOf(pipe.transform('a', (x: string) => Promise.resolve(x))).toEqualTypeOf<
      Promise<string>
    >();
  });

  it('types the head argument as the first parameter of the method', () => {
    const _method = (x: number, y: string) => `${x}${y}`;

    expectTypeOf(pipe.transform<never, typeof _method>)
      .parameter(0)
      .toEqualTypeOf<number>();
  });

  it('types the tail as the remaining parameters of the method', () => {
    const method = (x: number, y: string, z: boolean) => `${x}${y}${z}`;

    // the tail keeps `y` and `z` in order, then stays open for the extra
    // refresh-token arguments the pipe accepts to defeat its own purity
    const tail: Parameters<typeof pipe.transform<never, typeof method>> = [1, method, 'a', true];
    expectTypeOf(tail[2]).toEqualTypeOf<string>();
    expectTypeOf(tail[3]).toEqualTypeOf<boolean>();
  });

  it('accepts a method taking no argument at all', () => {
    expectTypeOf(pipe.transform(undefined, () => 42)).toEqualTypeOf<number>();
  });

  it('accepts trailing refresh tokens beyond the method signature', () => {
    const method = (x: number) => x;

    // `time` exists only to change the pipe's argument identity and force a re-run
    expectTypeOf(pipe.transform(1, method, Date.now())).toEqualTypeOf<number>();
  });

  it('does not collapse the result to any or unknown', () => {
    expectTypeOf(pipe.transform(1, (x: number) => x)).not.toBeAny();
    expectTypeOf(pipe.transform(1, (x: number) => x)).not.toBeUnknown();
  });

  it('types the directive input as the method it will bind', () => {
    type Method = (x: number) => string;

    expectTypeOf<NgGenericDirective<Method>['ngGenericPipeMethod']>().toEqualTypeOf<Method>();
    // the context guard is what makes `let g` in the template carry the method type
    expectTypeOf(
      NgGenericDirective.ngTemplateContextGuard<Method>,
    ).returns.toEqualTypeOf<boolean>();
  });
});
