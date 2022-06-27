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

  gotoHistoryChart() {
    this.router.navigate(['/time-history/432']);
  }

}

