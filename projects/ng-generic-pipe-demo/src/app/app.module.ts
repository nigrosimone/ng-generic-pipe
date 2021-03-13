import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgGenericPipeModule } from '../../../ng-generic-pipe/src/lib/ng-generic-pipe.module';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgGenericPipeModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
