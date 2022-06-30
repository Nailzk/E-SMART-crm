import { ModuleWithProviders, NgModule } from '@angular/core';
import { ProductsRepository } from '../public-api';

@NgModule({})
export class RepositoriesModule {
  static forRoot(): ModuleWithProviders<RepositoriesModule> {
    return {
      ngModule: RepositoriesModule,
      providers: [ProductsRepository],
    };
  }
}
