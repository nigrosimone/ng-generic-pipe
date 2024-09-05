import { NgModule } from '@angular/core';
import { NgGenericPipe } from './ng-generic-pipe.pipe';

@NgModule({
  imports: [NgGenericPipe],
  exports: [NgGenericPipe]
})
export class NgGenericPipeModule {

}
