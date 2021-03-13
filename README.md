# NgGenericPipe [![Build Status](https://travis-ci.org/nigrosimone/ng-generic-pipe.svg?branch=master)](https://travis-ci.com/github/nigrosimone/ng-generic-pipe) [![Coverage Status](https://coveralls.io/repos/github/nigrosimone/ng-generic-pipe/badge.svg?branch=master)](https://coveralls.io/github/nigrosimone/ng-generic-pipe?branch=master) [![NPM version](https://img.shields.io/npm/v/ng-generic-pipe.svg)](https://www.npmjs.com/package/ng-generic-pipe)

Cache for HTTP requests in Angular application.

## Description

Sometime there is a need to cache the HTTP requests so that browser doesn’t have to hit server to fetch same data when same service is invoked serially or in parallel. `NgGenericPipe` intercept all request are made, try to retrieve a cached instance of the response and then return the cached response or send the request to the backend. Once the operation has completed cache the response.

See the [stackblitz demo](https://stackblitz.com/edit/demo-ng-generic-pipe?file=src%2Fapp%2Fapp.component.ts).

## Features

✅ HTTP caching<br>
✅ Handles simultaneous/parallel requests<br>
✅ Automatic garbage collector of cache<br>
✅ More than 90% unit tested<br>
✅ Custom cache storage<br>

## Get Started

*Step 1*: intall `ng-generic-pipe`

```bash
npm i ng-generic-pipe
```

*Step 2*: Import `NgGenericPipeModule` into your app module, eg.:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgGenericPipeModule } from 'ng-generic-pipe';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgGenericPipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  ],
})
export class AppModule { }
```

if you want configure `NgGenericPipeModule`, you can pass a configuration to the module, eg.:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgGenericPipeModule, NgGenericPipeConfig } from 'ng-generic-pipe';

// your config...
const NgGenericPipeConfig: NgGenericPipeConfig = {
  lifetime: 1000 * 10 // cache expire after 10 seconds
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgGenericPipeModule.forRoot(NgGenericPipeConfig),
  ],
  providers: [],
  bootstrap: [AppComponent],
  ],
})
export class AppModule { }
```

## Config

This is all the configuration interface, see below for the detail of each config.

```ts
// all configuration are optionally
export interface NgGenericPipeConfig {
  lifetime?: number;
  allowedMethod?: string[];
  cacheStrategy?: NgGenericPipeStrategy;
  store?: NgGenericPipeStorageInterface;
  isExpired?: (entry: NgGenericPipeEntry) => boolean | undefined;
  isValid?: (entry: NgGenericPipeEntry) => boolean | undefined;
  isCacheable?: (req: HttpRequest<any>) => boolean | undefined;
  getKey?: (req: HttpRequest<any>) => string | undefined;
}
```

### lifetime (number - default: 3.600.000)
Number of millisecond that a response is stored in the cache. 
You can set specific "lifetime" for each request by add the header `X-ng-generic-pipe-LIFETIME` (see example below).

### allowedMethod (string[] - default: ['GET'])
Array of allowed HTTP methods to cache. 
You can allow multiple methods, eg.: `['GET', 'POST', 'PUT', 'DELETE', 'HEAD']` or 
allow all methods by: `['ALL']`. If `allowedMethod` is an empty array (`[]`), no response are cached.
*Warning!* `NgGenericPipe` use the full url (url with query parameters) as unique key for the cached response,
this is correct for the `GET` request but is _potentially_ wrong for other type of request (eg. `POST`, `PUT`). 
You can set a different "key" by customizing the `getKey` config method (see `getKey` section).

### cacheStrategy (enum NgGenericPipeStrategy - default: NgGenericPipeStrategy.ALLOW_ALL)
Set the cache strategy, possible strategies are:
- `NgGenericPipeStrategy.ALLOW_ALL`: All request are cacheable if HTTP method is into `allowedMethod`;
- `NgGenericPipeStrategy.DISALLOW_ALL`: Only the request with `X-ng-generic-pipe-ALLOW-CACHE` header are cacheable if HTTP method is into `allowedMethod`;

### store (class of NgGenericPipeStorageInterface - default: NgGenericPipeMemoryStorage)
Set the cache store. You can imlement your custom store by implement the `NgGenericPipeStorageInterface` interface, eg.:

```ts
import { NgGenericPipeConfig, NgGenericPipeStorageInterface } from 'ng-generic-pipe';

class MyCustomStore implements NgGenericPipeStorageInterface {
  // ... your logic
}

const NgGenericPipeConfig: NgGenericPipeConfig = {
  store: new MyCustomStore(),
};
```

### isExpired (function - default see NgGenericPipeService.isExpired());
If this function return `true` the request is expired and a new request is send to backend, if return `false` isn't expired. 
If the result is `undefined`, the normal behaviour is provided.
Example of customization:

```ts
import { NgGenericPipeConfig, NgGenericPipeEntry } from 'ng-generic-pipe';

const NgGenericPipeConfig: NgGenericPipeConfig = {
  isExpired: (entry: NgGenericPipeEntry): boolean | undefined => {
      // In this example a special API endpoint (/my-endpoint) send into the body response
      // an expireAt Date property. Only for this endpoit the expiration is provided by expireAt value.
      // For all the other endpoint normal behaviour is provided.
      if( entry.request.urlWithParams.indexOf('/my-endpoint') !== -1 ){
        return entry.response.body.expireAt.getTime() > Date.now();
      }
      // by returning "undefined" normal "ng-generic-pipe" workflow is applied
      return undefined;
    },
};
```

### isValid (function - default see NgGenericPipeService.isValid());
If this function return `true` the cache entry is valid and can be strored, if return `false` isn't valid. 
If the result is `undefined`, the normal behaviour is provided.
Example of customization:

```ts
import { NgGenericPipeConfig, NgGenericPipeEntry } from 'ng-generic-pipe';

const NgGenericPipeConfig: NgGenericPipeConfig = {
  isValid: (entry: NgGenericPipeEntry): boolean | undefined => {
      // In this example only response with status code 200 can be stored into the cache
      return entry.response.status === 200;
    },
};
```

### isCacheable (function - default see NgGenericPipeService.isCacheable());
If this function return `true` the request is cacheable, if return `false` isn't cacheable. 
If the result is `undefined`, the normal behaviour is provided.
Example of customization:

```ts
import { NgGenericPipeConfig } from 'ng-generic-pipe';

const NgGenericPipeConfig: NgGenericPipeConfig = {
  isCacheable: (req: HttpRequest<any>): boolean | undefined => {
      // In this example the /my-endpoint isn't cacheable.
      // For all the other endpoint normal behaviour is provided.
      if( req.urlWithParams.indexOf('/my-endpoint') !== -1 ){
        return false;
      }
      // by returning "undefined" normal "ng-generic-pipe" workflow is applied
      return undefined;
    },
};
```


### getKey (function - default see NgGenericPipeService.getKey());
This function return the unique key (`string`) for store the response into the cache. 
If the result is `undefined`, the normal behaviour is provided.
Example of customization:

```ts
import { NgGenericPipeConfig } from 'ng-generic-pipe';
import * as hash from 'object-hash';  // install object-hash with: npm i object-hash

const hashOptions = {
  algorithm: 'md5',
  encoding: 'hex'
};

const NgGenericPipeConfig: NgGenericPipeConfig = {
  allowedMethod: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
  getKey: (req: HttpRequest<any>): string | undefined => {
    // In this example the full request is hashed for provide an unique key for the cache.
    // This is important if you want support method like POST or PUT.
    return req.method + '@' + req.urlWithParams + '@' + hash(req.params, hashOptions) + '@' + hash(req.body, hashOptions);
  },
};
```

## Headers

`NgGenericPipe` use some custom headers for customize the caching behaviour.
The supported headers are exported from the enum `NgGenericPipeHeaders`:

```ts
export enum NgGenericPipeHeaders {
  ALLOW_CACHE = 'X-ng-generic-pipe-ALLOW-CACHE',
  DISALLOW_CACHE = 'X-ng-generic-pipe-DISALLOW-CACHE',
  LIFETIME = 'X-ng-generic-pipe-LIFETIME',
  TAG = 'X-ng-generic-pipe-TAG',
}
```

All those headers are removed before send the request to the backend.

### X-ng-generic-pipe-ALLOW-CACHE (string: any value);

If you have choose the `DISALLOW_ALL` cache strategy, you can mark specific request as cacheable by adding the header `X-ng-generic-pipe-ALLOW-CACHE`, eg.:

```ts
this.http.get('https://my-json-server.typicode.com/typicode/demo/db', {
  headers: {
    [NgGenericPipeHeaders.ALLOW_ALL]: '1',
  }
}).subscribe(e => console.log);
```

### X-ng-generic-pipe-DISALLOW-CACHE (string: any value);

You can disallow specific request by add the header `X-ng-generic-pipe-DISALLOW-CACHE`, eg.:

```ts
this.http.get('https://my-json-server.typicode.com/typicode/demo/db', {
  headers: { 
    [NgGenericPipeHeaders.DISALLOW_CACHE]: '1',
  }
}).subscribe(e => console.log);
```

### X-ng-generic-pipe-LIFETIME (string: number of millisecond);

You can set specific lifetime for request by add the header `X-ng-generic-pipe-LIFETIME` with a string value as the number of millisecond, eg.:

```ts
this.http.get('https://my-json-server.typicode.com/typicode/demo/db', {
  headers: {
    [NgGenericPipeHeaders.LIFETIME]: (1000 * 60 * 60 * 24 * 365).toString(), // one year
  }
}).subscribe(e => console.log);
```

### X-ng-generic-pipe-TAG (string: tag name);

You can tag multiple request by adding special header `X-ng-generic-pipe-TAG` with the same tag and 
using `NgGenericPipeService.clearCacheByTag(tag: syting)` for delete all the tagged request. Eg.:

```ts
this.http.get('https://my-json-server.typicode.com/typicode/demo/db?id=1', {
  headers: {
    [NgGenericPipeHeaders.TAG]: 'foo',
  }
}).subscribe(e => console.log);
```

## Cache service

You can inject into your component the `NgGenericPipeService` that expose some utils methods:

```ts
export class NgGenericPipeService {

  /**
   * Return the config
   */
  getConfig(): NgGenericPipeConfig;

  /**
   * Return the queue map
   */
  getQueue(): Map<string, Observable<HttpEvent<any>>>;

  /**
   * Return the cache store
   */
  getStore(): NgGenericPipeStorageInterface;

  /**
   * Return response from cache
   */
  getFromCache(req: HttpRequest<any>): HttpResponse<any> | undefined;

  /**
   * Add response to cache
   */
  addToCache(req: HttpRequest<any>, res: HttpResponse<any>): boolean;

  /**
   * Delete response from cache
   */
  deleteFromCache(req: HttpRequest<any>): boolean;

  /**
   * Clear the cache
   */
  clearCache(): void;

  /**
   * Clear the cache by key
   */
  clearCacheByKey(key: string): boolean;

  /**
   * Clear the cache by regex
   */
  clearCacheByRegex(regex: RegExp): void;

  /**
   * Clear the cache by TAG
   */
  clearCacheByTag(tag: string): void;

  /**
   * Run garbage collector (delete expired cache entry)
   */
  runGc(): void;

  /**
   * Return true if cache entry is expired
   */
  isExpired(entry: NgGenericPipeEntry): boolean;

  /**
   * Return true if cache entry is valid for store in the cache
   */
  isValid(entry: NgGenericPipeEntry): boolean;

  /**
   * Return true if the request is cacheable
   */
  isCacheable(req: HttpRequest<any>): boolean;

  /**
   * Return the cache key
   */
  getKey(req: HttpRequest<any>): string;

  /**
   * Return observable from cache
   */
  getFromQueue(req: HttpRequest<any>): Observable<HttpEvent<any>> | undefined;

  /**
   * Add observable to cache
   */
  addToQueue(req: HttpRequest<any>, obs: Observable<HttpEvent<any>>): void;

  /**
   * Delete observable from cache
   */
  deleteFromQueue(req: HttpRequest<any>): boolean;

}
```

## Examples

Below there are some examples of use case.

### Example: exclude specific request from cache

You can disallow specific request by add the header `X-ng-generic-pipe-DISALLOW-CACHE`, eg.:

```ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NgGenericPipeHeaders } from 'ng-generic-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // This request will never cache.
    // Note: all the "special" headers in NgGenericPipeHeaders are removed before send the request to the backend.
    this.http.get('https://my-json-server.typicode.com/typicode/demo/db', {
      headers: {
         [NgGenericPipeHeaders.DISALLOW_CACHE]: '1',
      }
    }).subscribe(e => console.log);
  }
}
```

### Example: set specific lifetime for request

You can set specific lifetime for request by add the header `X-ng-generic-pipe-LIFETIME` with a string value as the number of millisecond, eg.:

```ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NgGenericPipeHeaders } from 'ng-generic-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // This request will expire from 365 days.
    // Note: all the "special" headers in NgGenericPipeHeaders are removed before send the request to the backend.
    this.http.get('https://my-json-server.typicode.com/typicode/demo/db', {
      headers: {
         [NgGenericPipeHeaders.LIFETIME]: (1000 * 60 * 60 * 24 * 365).toString(),
      }
    }).subscribe(e => console.log);
  }
}
```

### Example: mark specific request as cacheable (if cache strategy is DISALLOW_ALL)

If you have choose the `DISALLOW_ALL` cache strategy, you can mark specific request as cacheable by adding the header `X-ng-generic-pipe-ALLOW-CACHE`, eg.:

```ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NgGenericPipeHeaders } from 'ng-generic-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // This request is marked as cacheable (this is necessary only if cache strategy is DISALLOW_ALL)
    // Note: all the "special" headers in NgGenericPipeHeaders are removed before send the request to the backend.
    this.http.get('https://my-json-server.typicode.com/typicode/demo/db', {
      headers: {
         [NgGenericPipeHeaders.ALLOW_ALL]: '1',
      }
    }).subscribe(e => console.log);
  }
}
```

### Example: clear/flush all the cache

If user switch the account (logout/login) or the application language, maybe ca be necessary clear all the cache, eg.:

```ts
import { Component } from '@angular/core';
import { NgGenericPipeService } from 'ng-generic-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private NgGenericPipeService: NgGenericPipeService) {}

  clearCache(): void {
    // Clear all the cache
    this.NgGenericPipeService.clearCache();
  }
}
```

### Example: clear/flush specific cache entry

If you want delete some cache entry, eg.:

```ts
import { Component } from '@angular/core';
import { NgGenericPipeService } from 'ng-generic-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private NgGenericPipeService: NgGenericPipeService) {}

  clearCache(key: string): boolean {
    // Clear the cache for the provided key
    return this.NgGenericPipeService.clearCacheByKey(key);
  }
}
```

### Example: clear/flush specific cache entry by RegEx

If you want delete some cache entry by RegEx, eg.:

```ts
import { Component } from '@angular/core';
import { NgGenericPipeService } from 'ng-generic-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private NgGenericPipeService: NgGenericPipeService) {}

  clearCacheByRegex(regEx: RegExp): void {
    // Clear the cache for the key that match regex
    this.NgGenericPipeService.clearCacheByRegex(regEx);
  }
}
```

### Example: TAG request and clear/flush specific cache entry by TAG

You can tag multiple request by adding special header `X-ng-generic-pipe-TAG` with the same tag and 
using `NgGenericPipeService.clearCacheByTag(tag: syting)` for delete all the tagged request. Eg.:

```ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NgGenericPipeService } from 'ng-generic-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private NgGenericPipeService: NgGenericPipeService) {}

  ngOnInit(): void {
    // This request is tagged with "foo" keyword. You can tag multiple requests with the same tag and 
    // using NgGenericPipeService.clearCacheByTag("foo") for delete all the tagged request.
    this.http.get('https://my-json-server.typicode.com/typicode/demo/db?id=1', {
      headers: {
         [NgGenericPipeHeaders.TAG]: 'foo',
      }
    }).subscribe(e => console.log);

    // This request is also tagged with "foo" keyword, and has another tag "baz".
    // You can add multiple tags comma separated.
    this.http.get('https://my-json-server.typicode.com/typicode/demo/db?id=2', {
      headers: {
         [NgGenericPipeHeaders.TAG]: 'foo,baz',
      }
    }).subscribe(e => console.log);
  }

  clearCacheForFoo(): void {
    // Clear the cache for all the entry have the tag 'foo'
    this.NgGenericPipeService.clearCacheByTag('foo');
  }
}
```

## Alternatives

Aren't you satisfied? there are some valid alternatives:

 - [@ngneat/cashew](https://www.npmjs.com/package/@ngneat/cashew)
 - [p3x-angular-http-cache-interceptor](https://www.npmjs.com/package/p3x-angular-http-cache-interceptor)
 - [@d4h/angular-http-cache](https://www.npmjs.com/package/@d4h/angular-http-cache)


## Support

This is an open-source project. Star this [repository](https://github.com/nigrosimone/ng-generic-pipe), if you like it, or even [donate](https://www.paypal.com/paypalme/snwp). Thank you so much!
