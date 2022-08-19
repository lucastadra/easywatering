/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { NgApexchartsModule } from 'ng-apexcharts';

/* Components */
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HarvestIrrigatorsComponent } from './pages/harvest/harvest-irrigators/harvest-irrigators.component';
import { IrrigatorsDataComponent } from './pages/harvest/harvest-irrigators/irrigators-data/irrigators-data.component';
import { IrrigatorsChartsComponent } from './pages/harvest/harvest-irrigators/irrigators-data/irrigators-charts/irrigators-charts.component';


/* Providers */
import { httpInterceptorProviders } from './helpers/http.interceptor';
import { AuthGuardService as AuthGuard } from './guards/auth/auth-guard.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    HarvestIrrigatorsComponent,
    IrrigatorsDataComponent,
    IrrigatorsChartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgApexchartsModule,
  ],
  providers: [httpInterceptorProviders, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
