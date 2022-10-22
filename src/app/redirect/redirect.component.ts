import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})

export class RedirectComponent implements OnInit {

  private defaultDate = function(dateShift: number) {
    const nowDate: Date = new Date();
    const newDate = new Date(nowDate.setDate(nowDate.getDate() + dateShift));
    return newDate.toISOString().split('T')[0];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {

    const startDate = this.defaultDate(-1);
    const endDate = this.defaultDate(1);

    this.route.params.subscribe( async (urlParams) => {
      console.log(urlParams);


      if ( !urlParams.zone || !['garage', 'house', 'outside', 'shtTest'].includes(urlParams.zone))  {
        // if zone is not defined or of unexpected value, redirect to default path
        this.router.navigate([`/time-history/house/${startDate}/${endDate}`]);
      } else {
        // if zone is defined but dates arent, then define them
        this.router.navigate([`/time-history/${urlParams.zone}/${startDate}/${endDate}`]);
      }
    })



  }





}

