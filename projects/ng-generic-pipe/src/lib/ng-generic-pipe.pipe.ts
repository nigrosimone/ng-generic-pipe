import { ChangeDetectorRef, EmbeddedViewRef, Type } from '@angular/core';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngGenericPipe',
  pure: true
})
export class NgGenericPipe implements PipeTransform {
  private context: any;

  constructor(cdRef: ChangeDetectorRef) {
    // retrive component instance (this is a workaround)
    this.context = (cdRef as EmbeddedViewRef<Type<any>>).context;
  }

  public transform(
    headArgument: any,
    fnReference: any,
    ...tailArguments: any[]
  ): any {
    return fnReference.apply(this.context, [headArgument, ...tailArguments]);
  }
}
