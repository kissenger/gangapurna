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

@NgModule({
  declarations: [
    AppComponent,
    LatestComponent,
    RhcritPipe,
    RhiPipe,
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
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
