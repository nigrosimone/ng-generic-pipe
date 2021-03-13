# NgGenericPipe [![Build Status](https://travis-ci.org/nigrosimone/ng-generic-pipe.svg?branch=master)](https://travis-ci.com/github/nigrosimone/ng-generic-pipe) [![Coverage Status](https://coveralls.io/repos/github/nigrosimone/ng-generic-pipe/badge.svg?branch=master)](https://coveralls.io/github/nigrosimone/ng-generic-pipe?branch=master) [![NPM version](https://img.shields.io/npm/v/ng-generic-pipe.svg)](https://www.npmjs.com/package/ng-generic-pipe)

Generic pipe for Angular application.

## Description

Sometime there is a need to use a component method into component template. Angular best practice says do not use method into html temlate, eg. `{{ myMethod(2) }}`. With NgGenericPipe you can use all your component methods as pure pipe with component scope, eg: `{{ 2 | ngGenericPipe: myMethod }} }}`.

See the [stackblitz demo](https://stackblitz.com/edit/demo-ng-generic-pipe?file=src%2Fapp%2Fapp.component.ts).

## Features

✅ More than 90% unit tested<br>
✅ Use all your component methods as pure pipe with component scope<br>

## Get Started

*Step 1*: intall `ng-generic-pipe`

```bash
npm i ng-generic-pipe
```

*Step 2*: Import `NgGenericPipeModule` into your app module, eg.:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgGenericPipeModule } from 'ng-generic-pipe';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgGenericPipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  ],
})
export class AppModule { }
```

*Step 3*: Use `ngGenericPipe` into your html template, eg.:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  {template: `<div>{{ 'Simone' | ngGenericPipe: sayHello }}</div>`}
})
export class AppComponent {
    sayHello(name: sting): number {
      return `Hello! I'm ${name}.`; 
    }
}
```

## Examples

Below there are some examples of use case.

### Example: Call component method with component scope

You can can call from template a componet method `test(x: number)` and access to the componet scope (`this`), eg.:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  {template: '<div>{{ 3 | ngGenericPipe: test }}</div>'}
})
export class AppComponent {

    public y: number = 2;

    test(x: number): number {
      return x * this.y; 
    }
}
```

### Example: Call component method with component scope and multiple parameters

You can can call from template a componet method `test(x: number, z: number)` and access to the componet scope (`this`), eg.:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  {template: '<div>{{ 3 | ngGenericPipe: test:3 }}</div>'}
})
export class AppComponent {

    public y: number = 2;

    test(x: number, z: number): number {
      return x * this.y * z; 
    }
}
```

### Example: Call component method with component scope and no parameters

You can can call from template a componet method `test()` and access to the componet scope (`this`), eg.:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  {template: '<div>{{ undefined | ngGenericPipe: test }}</div>'}
})
export class AppComponent {

    public y: number = 2;

    test(): number {
      return this.y; 
    }
}
```

### Example: Call component method with component scope and force change detection

You can can call from template a componet method `test()` and access to the componet scope (`this`), eg.:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  {template: `
    <div>{{ undefined | ngGenericPipe: test:i }}</div>
    <button (click)="onUpdate()">Update</button>
  `}
})
export class AppComponent {

    public y: number = Date.now();
    public i: number = 0;

    test(): number {
      return this.y; 
    }

    onUpdate(){
      this.i++;
    }
}
```

## Support

This is an open-source project. Star this [repository](https://github.com/nigrosimone/ng-generic-pipe), if you like it, or even [donate](https://www.paypal.com/paypalme/snwp). Thank you so much!
