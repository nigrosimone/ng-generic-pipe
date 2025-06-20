/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, EmbeddedViewRef, Type, Pipe, PipeTransform } from '@angular/core';

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
type First<T> = T extends [infer U, ...any[]] ? U : any;
type TailArguments<F> = [..._: Parameters<OmitFirstArg<F>>, ...args: any[]];

@Pipe({
  name: 'ngGenericPipe',
  pure: true,
  standalone: true
})
export class NgGenericPipe implements PipeTransform {

  // Fix for https://github.com/nigrosimone/ng-generic-pipe/issues/2 see:
  // - https://github.com/angular/angular/issues/59868#issuecomment-2640722684
  // - https://github.com/angular/angular/issues/50952
  // private cdRef = inject(ChangeDetectorRef);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public transform<T, K extends (...args: any[]) => ReturnType<K>>(
    headArgument: First<Parameters<K>>,
    fnReference: K,
    ...tailArguments: TailArguments<K>
  ): ReturnType<K> {
    return fnReference.apply((this.cdRef as EmbeddedViewRef<Type<unknown>>).context, [headArgument, ...tailArguments]);
  }
}

/** 
 * @deprecated import the standalone NgGenericPipe
 */
export const NgGenericPipeModule = NgGenericPipe;