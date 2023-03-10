import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {AuthConfig, OAuthModule, OAuthModuleConfig, OAuthStorage} from 'angular-oauth2-oidc';
import {authAppInitializerFactory} from './auth-app-initializer.factory';
import {authConfig} from './auth.config';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';
import {authModuleConfig} from './auth-module-config';

export function storageFactory(): OAuthStorage {
  return localStorage;
}

@NgModule({
  imports: [
    HttpClientModule,
    OAuthModule.forRoot(),
  ],
  providers: [
    AuthService,
    AuthGuard,
  ],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        {provide: APP_INITIALIZER, useFactory: authAppInitializerFactory, deps: [AuthService], multi: true},
        {provide: AuthConfig, useValue: authConfig},
        {provide: OAuthModuleConfig, useValue: authModuleConfig},
        {provide: OAuthStorage, useFactory: storageFactory},
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error('AuthModule is already loaded. Import it in the AppModule only');
    }
  }
}
