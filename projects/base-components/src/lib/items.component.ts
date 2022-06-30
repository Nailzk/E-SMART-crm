import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HttpRepository, IBaseItem, IPaginationResponse } from 'communication';
import { finalize } from 'rxjs';
import { LoadingComponent } from './loading.component';

@UntilDestroy()
@Component({ template: '' })
export class ItemsComponent<T extends IBaseItem> extends LoadingComponent<T> implements OnInit {
  constructor(
    @Inject(HttpRepository) protected _repository?: HttpRepository<T>,
    @Optional() @Inject(Injector) protected _injector?: Injector,
  ) {
    super(_injector);
  }

  public get loading(): boolean {
    return this.isLoading;
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.autoLoadConfig) return;

    if (this.autoLoadConfig.onInit) this.loadData();
    if (this.autoLoadConfig.onParamsChanges) this.loadOnParamsChanges();
    if (this.autoLoadConfig.onQueryChanges) this.loadOnQueryParamsChanges();
  }

  protected loadData(params?: any) {
    const limit = params?.limit ? params.limit : this.defaultLimit;
    const skip = this.skip;

    const loading = this.showLoading();

    this._repository
      ?.getItems({ ...params, limit, skip })
      .pipe(
        untilDestroyed(this),
        finalize(() => loading()),
      )
      .subscribe(
        (res: IPaginationResponse<any>) => {
          const data = res.data ?? [];
          this.builder.replaceItems(data);
        },
        (err) => this.showError(err),
      );
  }

  protected loadMore(): void {
    this.skip += this.defaultLimit;
    this.loadData();
  }

  protected refresh(): void {
    this.skip = 0;
    this.loadData();
  }

  protected loadOnParamsChanges(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      this.loadData(params);
    });
  }

  protected loadOnQueryParamsChanges(): void {
    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      this.loadData(params);
    });
  }
}
