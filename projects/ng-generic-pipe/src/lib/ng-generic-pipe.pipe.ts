import { ChangeDetectorRef, EmbeddedViewRef, Type, Pipe, PipeTransform } from '@angular/core';

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
type First<T> = T extends [infer U, ...any[]] ? U : any;
type TailArguments<F> = [..._: Parameters<OmitFirstArg<F>>, ...args: any[]];

@Pipe({
  name: 'ngGenericPipe',
  pure: true,
  standalone: true,
})
export class NgGenericPipe implements PipeTransform {
  // Fix for https://github.com/nigrosimone/ng-generic-pipe/issues/2 see:
  // - https://github.com/angular/angular/issues/59868#issuecomment-2640722684
  // - https://github.com/angular/angular/issues/50952
  // `inject(ChangeDetectorRef)` does not hand back the view-bound ref this needs,
  // so constructor injection stays on purpose.
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private cdRef: ChangeDetectorRef) {}

  /**
   * Generic pipe for Angular application for use a component method into component template.
   *
   * ### Usage
   *
   * ```ts
   * import { Component } from '@angular/core';
   * import { NgGenericPipe } from 'ng-generic-pipe';
   *
   * @Component({
   *   selector: 'app-root',
   *   template: `<div>{{ 'Simone' | ngGenericPipe: sayHello }}</div>`,
   *   standalone: true,
   *   imports: [NgGenericPipe],
   * })
   * export class AppComponent {
   *   sayHello(name: string): string {
   *     return `Hello! I'm ${name}.`;
   *   }
   * }
   * ```
   */
  // `T` is unused but part of the published signature, so it stays for compatibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public transform<T, K extends (...args: any[]) => ReturnType<K>>(
    headArgument: First<Parameters<K>>,
    fnReference: K,
    ...tailArguments: TailArguments<K>
  ): ReturnType<K> {
    // without this the template only gets `fnReference.apply is not a function`, which says
    // nothing about where the mistake is; the directive reports the same way
    if (typeof fnReference !== 'function') {
      throw new Error('ngGenericPipe: fnReference must be a function');
    }
    return fnReference.apply((this.cdRef as EmbeddedViewRef<Type<unknown>>).context, [
      headArgument,
      ...tailArguments,
    ]);
  }
}

/**
 * @deprecated import the standalone NgGenericPipe
 */
export const NgGenericPipeModule = NgGenericPipe;
