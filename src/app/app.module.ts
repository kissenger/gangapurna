import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgChartsModule, NgChartsConfiguration  } from 'ng2-charts';

import { HttpClientModule } from '@angular/common/http';
import {APP_BASE_HREF} from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RedirectComponent } from './redirect/redirect.component';
import { TimeHistoryComponent } from './time-history/time-history.component';
import { HttpService } from './shared/http.service';
import { RhcritPipe } from './shared/rhcrit.pipe';
import { RhiPipe } from './shared/rhi.pipe';
import { AbsHumPipe } from './shared/ah.pipe';
import { MixRatioPipe } from './shared/mr.pipe';
import { DewPointPipe } from './shared/dp.pipe';
import { RhCorrectedPipe } from './shared/rhCorrected.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RedirectComponent,
    RhcritPipe,
    RhiPipe,
    MixRatioPipe,
    AbsHumPipe,
    DewPointPipe,
    TimeHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [
    HttpService,
    RhcritPipe,
    RhiPipe,
    MixRatioPipe,
    DewPointPipe,
    AbsHumPipe,
    RhCorrectedPipe,
    { provide: NgChartsConfiguration, useValue: { generateColors: false }},
    { provide: APP_BASE_HREF, useValue: "/iot" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
