import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavBarComponent} from './shared/component/nav-bar/nav-bar.component';
import {HttpApiInterceptor} from './shared/interceptor/HttpApiInterceptor';
import {JwtInterceptor} from './shared/interceptor/JwtInterceptor';
import {AppMaterialModule} from './app-material/app-material.module';
import {UpdateAvatarComponent} from './shared/component/update-avatar/update-avatar.component';
import {LoaderComponent} from './shared/component/loader/loader.component';
import {LoaderInterceptor} from './shared/interceptor/LoaderInterceptor';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ToastrModule} from 'ngx-toastr';
import {ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig} from '@angular/material/dialog';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    UpdateAvatarComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true,
      resetTimeoutOnDuplicate: true,
      preventDuplicates: true,
      positionClass: 'toast-bottom-left',
    }),
    BrowserAnimationsModule,
    LayoutModule,
    AppMaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpApiInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {...new MatDialogConfig(), maxWidth: '100vm', maxHeight: '100vm', panelClass: 'responsive-dialog'} as MatDialogConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
