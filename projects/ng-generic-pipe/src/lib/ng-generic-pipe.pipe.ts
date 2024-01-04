/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, EmbeddedViewRef, Type } from '@angular/core';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

type First<T> = T extends [infer U, ...any[]] ? U : any;

type TailArguments<F> = [..._: Parameters<OmitFirstArg<F>>, ...args: any];


@Pipe({
  name: 'ngGenericPipe',
  pure: true
})
export class NgGenericPipe implements PipeTransform {
  private context: any;

  constructor(cdRef: ChangeDetectorRef) {
    // retrieve component instance (this is a workaround)
    this.context = (cdRef as EmbeddedViewRef<Type<any>>).context;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public transform<T, K extends (...args: any) => ReturnType<K>>(
    headArgument: First<Parameters<K>>,
    fnReference: K,
    ...tailArguments: TailArguments<K>
  ): ReturnType<K> {
    return fnReference.apply(this.context, [headArgument, ...tailArguments]);
  }
}
