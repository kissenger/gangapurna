import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule, ThemeService } from 'ng2-charts';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LatestComponent } from './latest/latest.component';
import { TimeHistoryComponent } from './time-history/time-history.component';
import { HttpService } from './shared/http.service';
import { RhcritPipe } from './shared/rhcrit.pipe';
import { RhiPipe } from './shared/rhi.pipe';
import { AbsHumPipe } from './shared/ah.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LatestComponent,
    RhcritPipe,
    RhiPipe,
    AbsHumPipe,
    TimeHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    HttpService,
    RhcritPipe,
    RhiPipe,
    AbsHumPipe,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
