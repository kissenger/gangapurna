import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LatestComponent } from './latest/latest.component';
import { TimeHistoryComponent } from './time-history/time-history.component';


const routes: Routes = [
  { path: 'latest/:nReadings', component: LatestComponent },
  { path: 'latest', redirectTo: '/latest/1' },
  { path: 'time-history/:nReadings', component: TimeHistoryComponent },
  { path: 'time-history', redirectTo: '/time-history/144' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
