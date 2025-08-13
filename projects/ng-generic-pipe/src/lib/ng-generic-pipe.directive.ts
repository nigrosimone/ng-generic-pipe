/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmbeddedViewRef, Directive, TemplateRef, ViewContainerRef, Input, ChangeDetectorRef, Type } from '@angular/core';

interface NgGenericContext<T> {
  ngGenericPipe: T;
  $implicit: T;
}

/**
 * Generic directive for Angular application for use a component method into component template.
 *
 * ### Usage
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { NgGenericDirective } from 'ng-generic-pipe';
 * 
 * @Component({
 *   selector: 'app-root',
 *   template: `<div *ngGenericPipe="let fn; method: sayHello">{{ fn('Simone') }}</div>`,
 *   imports: [NgGenericDirective],
 * })
 * export class AppComponent {
 *   sayHello(name: string): string {
 *     return `Hello! I'm ${name}.`; 
 *   }
 * }
 * ```
 */
@Directive({
  selector: '[ngGenericPipe]',
  standalone: true
})
export class NgGenericDirective<T> {

  private readonly context: NgGenericContext<T | null> = { ngGenericPipe: null, $implicit: null };
  private lastFn: T | null = null;

  /**
   * Generic directive for Angular application for use a component method into component template.
   *
   * ### Usage
   *
   * ```ts
   * import { Component } from '@angular/core';
   * import { NgGenericDirective } from 'ng-generic-pipe';
   * 
   * @Component({
   *   selector: 'app-root',
   *   template: `<div *ngGenericPipe="let fn; method: sayHello">{{ fn('Simone') }}</div>`,
   *   imports: [NgGenericDirective],
   * })
   * export class AppComponent {
   *   sayHello(name: string): string {
   *     return `Hello! I'm ${name}.`; 
   *   }
   * }
   * ```
   */
  @Input({ required: true })
  set ngGenericPipeMethod(value: T) {
    if (typeof value !== 'function') {
      throw new Error('ngGenericPipe: method must be a function');
    }
    if (this.lastFn !== value) {
      this.lastFn = value;
      this.context.$implicit = this.context.ngGenericPipe = value.bind((this.cdRef as EmbeddedViewRef<Type<unknown>>).context);
    }
  }

  // Fix for https://github.com/nigrosimone/ng-generic-pipe/issues/2 see:
  // - https://github.com/angular/angular/issues/59868#issuecomment-2640722684
  // - https://github.com/angular/angular/issues/50952
  // private cdRef = inject(ChangeDetectorRef);
  // eslint-disable-next-line @angular-eslint/prefer-inject, @angular-eslint/prefer-inject
  constructor(private cdRef: ChangeDetectorRef, viewContainer: ViewContainerRef, templateRef: TemplateRef<NgGenericContext<T>>) {
    viewContainer.createEmbeddedView(templateRef, this.context);
  }

  /** 
   * @internal 
   * Directives that behave like *ngIf can declare that they want the same treatment by including a 
   * static member marker that is a signal to the template compiler to treat them like *ngIf.
   * 
   * @see https://v17.angular.io/guide/aot-compiler#custom-ngif-like-directives
   */
  public static ngGenericPipeUseIfTypeGuard: void;

  /**
   * Assert the correct type of the expression bound to the `ngGenericPipe` input within the template.
   *
   * The presence of this static field is a signal to the Ivy template type check compiler that
   * when the `ngGenericPipe` structural directive renders its template, the type of the expression bound
   * to `ngGenericPipe` should be narrowed in some way. For `ngGenericPipe`, the binding expression itself is used to
   * narrow its type, which allows the strictNullChecks feature of TypeScript to work with `ngGenericPipe`.
   * 
   * @see https://angular.dev/guide/directives/structural-directives#typing-the-directives-context
   */
  static ngTemplateGuard_ngGenericPipe: 'binding';

  /**
   * Asserts the correct type of the context for the template that `ngGenericPipe` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `ngGenericPipe` structural directive renders its template with a specific context type.
   * 
   * @see https://angular.dev/guide/directives/structural-directives#typing-the-directives-context
   */
  static ngTemplateContextGuard<T>(_dir: NgGenericDirective<T>, _ctx: unknown): _ctx is NgGenericContext<T> {
    return true;
  }
}