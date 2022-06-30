import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBaseItem } from '../../../communication';
import { IAutoLoadConfig } from './interface';
import { ItemsBuilder } from './items-builder';

@Component({ template: '' })
export class LoadingComponent<T extends IBaseItem> implements OnInit {
  public autoLoadConfig: IAutoLoadConfig = {
    onInit: true,
    onParamsChanges: false,
    onQueryChanges: false,
  };

  protected isLoading = false;
  protected skip = 0;

  protected builder = new ItemsBuilder<T>();

  private _route: ActivatedRoute;
  private _router: Router;

  get items(): T[] {
    return this.builder.items;
  }

  get item(): T {
    return this.builder.item;
  }

  protected get defaultLimit(): number {
    return 10;
  }

  protected get router(): Router {
    if (!this._router) {
      throw new Error(`Provide injector for Router ${this.constructor.name}`);
    }

    return this._router;
  }

  protected get notifier(): Router {
    if (!this._router) {
      throw new Error(`Provide injector for Notifier ${this.constructor.name}`);
    }

    return this._router;
  }

  protected get route(): ActivatedRoute {
    if (!this._route) {
      throw new Error(`Provide injector for Route ${this.constructor.name}`);
    }

    return this._route;
  }

  constructor(@Optional() @Inject(Injector) protected _injector?: Injector) {}

  ngOnInit(): void {
    this._initDeps();
  }

  protected showLoading() {
    return () => (this.isLoading = !this.isLoading);
  }

  protected showError(message: any): void {
    let error = message;

    if (message?.error?.error) {
      error = message.error.error;
    }

    console.error(message);
  }

  protected showSuccess(message: string): void {
    console.log(message);
  }

  private _initDeps(): void {
    if (this._injector) {
      this._route = this._injector.get(ActivatedRoute);
      this._router = this._injector.get(Router);
    }
  }
}
