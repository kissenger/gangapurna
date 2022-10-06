import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gangapurna';
  constructor(
    public router: Router
  ) {  }

  gotoRhiChart() {
    this.router.navigate(['/latest/36']);
  }

  gotoHistoryChart(zone: string) {
    let endDate: Date = new Date();
    let startDate: Date = new Date();
    // subtract 14days from current date to get start date
    endDate = new Date(startDate.setDate(startDate.getDate() + 1)); // add one to else it will stop at midnight last night
    startDate = new Date(startDate.setDate(startDate.getDate() - 14));

    this.router.navigate([`/time-history/${zone}/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}`]);

  }



}

