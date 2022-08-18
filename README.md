# NgGenericPipe [![Build Status](https://travis-ci.org/nigrosimone/ng-generic-pipe.svg?branch=master)](https://travis-ci.com/github/nigrosimone/ng-generic-pipe) [![Coverage Status](https://coveralls.io/repos/github/nigrosimone/ng-generic-pipe/badge.svg?branch=master)](https://coveralls.io/github/nigrosimone/ng-generic-pipe?branch=master) [![NPM version](https://img.shields.io/npm/v/ng-generic-pipe.svg)](https://www.npmjs.com/package/ng-generic-pipe)

Generic pipe for Angular application for use a component method into component template.

## Description

Sometime there is a need to use a component method into component template. Angular best practice says do not use method into html temlate, eg. `{{ myMethod(2) }}`. With NgGenericPipe you can use all your public component methods as pure pipe with the component scope (`this`), eg: `{{ 2 | ngGenericPipe: myMethod }} }}`.

See the [stackblitz demo](https://stackblitz.com/edit/demo-ng-generic-pipe?file=src%2Fapp%2Fapp.component.ts).

## Features

✅ More than 90% unit tested<br>
✅ Use all your component methods as pure pipe with component scope<br>
✅ Strong type check<br>

## Get Started

*Step 1*: install `ng-generic-pipe`

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
  template: `<div>{{ 'Simone' | ngGenericPipe: sayHello }}</div>`
})
export class AppComponent {
    sayHello(name: string): string {
      return `Hello! I'm ${name}.`; 
    }
}
```

## API

`ngGenericPipe` need to pipe on a value. The value become the first argument of the funtion called by `ngGenericPipe`, eg.:

```
'Hello world!' | ngGenericPipe: writeMessage
```

is translated into:

```ts
writeMessage('Hello world!')
```

You can pass, multiple parameter in this way, eg.:

```
'Hello world!' | ngGenericPipe: writeMessage:'Simone'
```

is translated into:

```ts
writeMessage('Hello world!', 'Simone')
```

and with more parameters, eg.:

```
'Hello world!' | ngGenericPipe: writeMessage:'Simone':'Foo':'Bar':'Baz'
```

is translated into:

```ts
writeMessage('Hello world!', 'Simone', 'Foo', 'Bar', 'Baz')
```

Because `ngGenericPipe` is a pure pipe, the method is memoized. This means that the pipe transform the html only if an argument change. You can force the change by passing and aditional parameter that change when you need a repaint (see the example below "Call component method with component scope and force change detection
").

## Strong type check

`ngGenericPipe` has strong type checking

![alt text](https://raw.githubusercontent.com/nigrosimone/ng-generic-pipe/master/help.gif)

## Examples

Below there are some examples of use case.

### Example: Call component method with component scope

You can call from template a componet method `test(x: number)` and access to the componet scope (`this`), eg.:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div>{{ 3 | ngGenericPipe: test }}</div>'
})
export class AppComponent {

    public y: number = 2;

    test(x: number): number {
      return x * this.y; 
    }
}
```

### Example: Call component method with component scope and multiple parameters

You can call from template a componet method `test(x: number, z: number)` and access to the componet scope (`this`), eg.:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div>{{ 3 | ngGenericPipe: test:3 }}</div>'
})
export class AppComponent {

    public y: number = 2;

    test(x: number, z: number): number {
      return x * this.y * z; 
    }
}
```

### Example: Call component method with component scope and no parameters

You can call from template a componet method `test()` and access to the componet scope (`this`), eg.:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div>{{ undefined | ngGenericPipe: test }}</div>'
})
export class AppComponent {

    public y: number = 2;

    test(): number {
      return this.y; 
    }
}
```

### Example: Call component method with component scope and force change detection

You can call from template a componet method `test()` and access to the componet scope (`this`), eg.:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>{{ undefined | ngGenericPipe: test:i }}</div>
    <button (click)="onUpdate()">Update</button>
  `
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

### Example: Call observable component's method

You can call from template a component's method `testAsync()` that return observable, eg.:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>{{ 'hello!' | ngGenericPipe: testAsync | async }}</div>
  `
})
export class AppComponent {

    testAsync(value: string): Observable<string> {
      return of(value);
    }

}
```

## Support

This is an open-source project. Star this [repository](https://github.com/nigrosimone/ng-generic-pipe), if you like it, or even [donate](https://www.paypal.com/paypalme/snwp). Thank you so much!

## My other libraries

I have published some other Angular libraries, take a look:

 - [NgSimpleState: Simple state management in Angular with only Services and RxJS](https://www.npmjs.com/package/ng-simple-state)
 - [NgHttpCaching: Cache for HTTP requests in Angular application](https://www.npmjs.com/package/ng-http-caching)
 - [NgLet: Structural directive for sharing data as local variable into html component template](https://www.npmjs.com/package/ng-let)
 - [NgForTrackByProperty: Angular global trackBy property directive with strict type checking](https://www.npmjs.com/package/ng-for-track-by-property)
