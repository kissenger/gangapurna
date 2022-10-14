import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LatestComponent } from './latest/latest.component';
import { TimeHistoryComponent } from './time-history/time-history.component';
import { RedirectComponent } from './redirect/redirect.component';

const routes: Routes = [
  { path: '', redirectTo: '/time-history', pathMatch: 'full' },
  // { path: 'latest/:nReadings', component: LatestComponent },
  // { path: 'latest', redirectTo: '/latest/36' },
  { path: 'time-history', component: RedirectComponent },
  { path: 'time-history/:zone', component: RedirectComponent },
  { path: 'time-history/:zone/:startDate/:endDate', component: TimeHistoryComponent },
  // { path: 'time-history', redirectTo: `/time-history/hello` },
  // { path: `house-history/:startDate/:${todaysDate}`, component: HouseHistoryComponent },
  // { path: 'house-history/:startDate', redirectTo: `/house-history/2022-04-12/${todaysDate}` }
];



@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
