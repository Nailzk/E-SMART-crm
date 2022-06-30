import { Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HttpRepository, IBaseItem, IPaginationResponse } from 'communication';
import { finalize } from 'rxjs';
import * as _ from 'underscore';
import { LoadingComponent } from './loading.component';

@UntilDestroy()
@Component({ template: '' })
export class FormsComponent<T extends IBaseItem> extends LoadingComponent<T> implements OnInit {
  form: FormGroup;

  errors: any = {};
  protected errorMessages: any = {};
  protected formErrors: any = {};

  constructor(
    @Inject(HttpRepository) protected _repository?: HttpRepository<T>,
    @Optional() @Inject(Injector) protected _injector?: Injector,
  ) {
    super();
  }

  public get loading(): boolean {
    return this.isLoading;
  }

  protected get formValues(): any {
    return this.form.value;
  }

  ngOnInit() {
    super.ngOnInit();

    this.form = this.createForm();

    this._subscribeOnFormChanges();

    if (!this.autoLoadConfig) return;

    if (this.autoLoadConfig.onInit) this.loadData();
    if (this.autoLoadConfig.onParamsChanges) this.loadOnParamsChanges();
    if (this.autoLoadConfig.onQueryChanges) this.loadOnQueryParamsChanges();
  }

  public validateForm(): void {
    this.form.updateValueAndValidity();
  }

  public patchForm(controls: { [key: string]: any }) {
    this.form.patchValue(controls);
  }

  protected createForm(): FormGroup {
    return new FormGroup({});
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

  private _subscribeOnFormChanges() {
    this.form.valueChanges.subscribe((val) => {
      this._handleFormErrors();
    });
  }

  private _handleFormErrors() {
    const controls = this.form.controls;

    Object.keys(controls).forEach((val) => {
      const errors = controls[val].errors;

      if (!_.isEmpty(errors) && errors) {
        Object.keys(errors).forEach((error) => {
          this.formErrors[val] = { [error]: error };
        });
      }
    });

    this._setErrorMessages();
  }

  private _setErrorMessages() {
    const formErrors = this.formErrors;

    Object.keys(formErrors).forEach((val) => {
      if (_.isObject(formErrors[val])) {
        const controlMessages = this.errorMessages[val];
        this.errors = {};

        if (!controlMessages) this.errors[val] = 'error';
        else {
          const nestedField = (Object.values(formErrors[val]) as string[])[0] || 'error';

          const error = controlMessages[nestedField] ?? 'error';
          this.errors[val] = error;
        }
      }
    });
  }
}
