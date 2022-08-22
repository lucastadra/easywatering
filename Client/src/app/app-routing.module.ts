import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HarvestIrrigatorsComponent } from './pages/harvest/harvest-irrigators/harvest-irrigators.component';
import { IrrigatorsDataComponent } from './pages/harvest/harvest-irrigators/irrigators-data/irrigators-data.component';
import { IrrigatorsChartsComponent } from './pages/harvest/harvest-irrigators/irrigators-data/irrigators-charts/irrigators-charts.component';
import { HarvestRegisterComponent } from './pages/harvest/harvest-register/harvest-register.component';
import { HarvestEditComponent } from './pages/harvest/harvest-edit/harvest-edit.component';
import { IrrigatorsRegisterComponent } from './pages/harvest/harvest-irrigators/irrigators-register/irrigators-register.component';

import { 
  AuthGuardService as AuthGuard 
} from './guards/auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'harvest/irrigators', component: HarvestIrrigatorsComponent, canActivate: [AuthGuard] },
  { path: 'harvest/register', component: HarvestRegisterComponent, canActivate: [AuthGuard] },
  { path: 'harvest/edit', component: HarvestEditComponent, canActivate: [AuthGuard] },
  { path: 'harvest/irrigators/irrigators-data', component: IrrigatorsDataComponent, canActivate: [AuthGuard]},
  { path: 'harvest/irrigators/irrigators-register', component: IrrigatorsRegisterComponent, canActivate: [AuthGuard]},
  { path: 'harvest/irrigators/irrigators-data/irrigators-charts', component: IrrigatorsChartsComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
