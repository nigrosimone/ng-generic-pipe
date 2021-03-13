import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgGenericPipe } from './ng-generic-pipe.pipe';

@NgModule({
  declarations: [NgGenericPipe],
  imports: [],
  exports: [NgGenericPipe],
})
export class NgGenericPipeModule {
  static forRoot(): ModuleWithProviders<NgGenericPipeModule> {
    return {
      ngModule: NgGenericPipeModule
    };
  }
}
