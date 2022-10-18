import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeHistoryComponent } from './time-history/time-history.component';
import { RedirectComponent } from './redirect/redirect.component';

const routes: Routes = [
  { path: '', redirectTo: '/time-history', pathMatch: 'full' },
  { path: 'time-history', component: RedirectComponent },
  { path: 'time-history/:zone', component: RedirectComponent },
  { path: 'time-history/:zone/:startDate/:endDate', component: TimeHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
