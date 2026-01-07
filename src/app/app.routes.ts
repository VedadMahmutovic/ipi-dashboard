import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { StatisticsComponent } from './statistics/statistics';
import { HomeComponent } from './public/home/home';
import { authGuard } from './core/auth.guard';
import { guestGuard } from './core/guest.guard';
import { CoursesComponent } from './public/courses/courses';
import { ScheduleComponent } from './public/schedule/schedule';
import { ContactComponent } from './public/contact/contact';
import { FunZoneComponent } from './fun-zone/fun-zone';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },


  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'fun-zone',
    component: FunZoneComponent,
    canActivate: [authGuard]
  },


  { path: '**', redirectTo: '' }
];
