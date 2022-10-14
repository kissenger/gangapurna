import { Component, OnInit, ViewChild} from '@angular/core';
import { RhiPipe } from 'src/app/shared/rhi.pipe';
import { RhcritPipe } from 'src/app/shared/rhcrit.pipe';
import { HttpService } from '../shared/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbsHumPipe } from '../shared/ah.pipe';

// import * as ChartJS from 'chart.js';
import { Chart, ChartConfiguration, ChartEvent, ChartType, ChartOptions, ChartData, TimeScale } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';
// import { Chart } from 'chart.js';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-latest',
  templateUrl: './time-history.component.html',
  styleUrls: ['./time-history.component.css']
})

export class TimeHistoryComponent implements OnInit {

  // public sensorData = [];
  // public printData = [];



  public chartQuantities = {
    house: [
      {
        quantity: 'temp',
        sensors: [
          {name: 'Living Room'},
          {name: 'dallasOutside'},
          {name: 'Hall'},
          {name: 'Hall Radiator'},
          {name: 'Kitchen'},
          {name: 'Gordons Office'},
          {name: 'dallasStoreRoom'}
        ]
      }
    ],
    garage: [
      { quantity: 'temp', sensors: [{name: 'dallasStoreRoom'}, {name: 'dallasOutside'}] },
      { quantity: 'rh', sensors: [{name: 'ahtStoreRoom'}] },
      { quantity: 'ah', sensors: [{name:'ahtStoreRoom'}] },
      { quantity: 'rhi', sensors: [{name:'ahtStoreRoom'}] },
      { quantity: 'press', sensors: [{name:'bmpStoreRoom'}] },
    ]
  };

  private yAxisLabels = {
    rh: 'Rel Hmty [%]',
    ah: 'Abs Hmty [g/m^3]',
    temp: 'T [' + String.fromCharCode(176) + 'C]',
    rhi: 'Rel Hmty Idx [-]',
    press: 'P (@ sea level) [Pa]'
  };

  chartLineRGBA= {
    'dallasStoreRoom': 'rgba(255, 100, 100, 0.5)',
    'dallasOutside': 'rgba(100, 100, 255, 0.5)',
    'ahtStoreRoom': 'rgba(255, 100, 100, 0.5)',
    'bmpStoreRoom': 'rgba(255, 100, 100, 0.5)',
    'Living Room': 'rgba(150, 100, 255, 0.5)',
    'Kitchen': 'rgba(255, 100, 255, 0.5)',
    'Hall': 'rgba(100, 255, 100, 0.5)',
    'Hall Radiator': 'rgba(100, 150, 100, 0.5)',
    'Gordons Office': 'rgba(100, 50, 100, 0.5)'
  }

  private chartTimeSpan: number;
  private interval;
  public zone: string;
  public chartData: { [key: string]: ChartData } = {};
  public chartOptions: { [key: string]: ChartOptions} = {};
  private startDate: string;
  private endDate: string;
  private REFRESH_INTERVAL = 15 * 60 * 1000;

  constructor(
    public rhi: RhiPipe,
    public rhCrit: RhcritPipe,
    public ah: AbsHumPipe,
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {

    this.route.params.subscribe( async (urlParams) => {
      this.zone = urlParams.zone;
      this.chartTimeSpan = Math.floor((Date.parse(urlParams.endDate) - Date.parse(urlParams.startDate)) / 86400000);
      this.startDate = urlParams.startDate;
      this.endDate = urlParams.endDate;
      await this.getChartQuantities();
      this.updateChart();
    })

    this.interval = setInterval( async () => {
      await this.getChartQuantities();
      this.updateChart();
   }, this.REFRESH_INTERVAL);

  }




  updateChart() {

    /*
      Note that we are using legcay versions of chart.js and ng2-charts that are
      compatible with Angular v8
    */


    this.chartQuantities[this.zone].forEach(chart => {

      console.log(chart.quantity);

      this.chartData[chart.quantity] =  <ChartConfiguration['data']> {
        datasets: chart.sensors.map( s => ({
          type: 'line',
          data: s.data,
          label: s.name,
          pointRadius: this.chartTimeSpan <= 1.5 ? 1 : 0,
          pointBackgroundColor: 'rgba(255,255,255,1)',
          backgroundColor: this.chartLineRGBA[s.name],
          borderColor: this.chartLineRGBA[s.name],
          borderWidth: 3,
          tension: 0.5
        }))
      }

      this.chartOptions[chart.quantity] = {
        // maintainAspectRatio: true,
        // responsive: true,
        // aspectRatio: 0.5,  // this doesnt work - AR is controlled by height and width tags on canvas in html
        scales: {
          x: {
            type: 'time',
            // time: {
            //   unit: 'day',
            // }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: chart.yAxisLabel
            }
          }
        }
      }

    });

    // console.log(this.chartData);
    // console.log(this.chartOptions);

  }

  async getChartQuantities() {
    return new Promise<void>( async (res, rej) => {
      for (const cq of this.chartQuantities[this.zone]) {
        cq.xAxisLabel = 'Date';
        cq.yAxisLabel = this.yAxisLabels[cq.quantity]
        for (const sensor of cq.sensors) {
          const dataBuff = await this.getSensorData(sensor.name, this.startDate, this.endDate);
          sensor.data = this.getTimeHistory(dataBuff, cq.quantity);
          sensor.colour = this.chartLineRGBA[sensor.name];
          const lastTime = new Date(sensor.data[0].x);
          sensor.lastTimestampFormatted = lastTime.toLocaleString();
          sensor.isTimeGood = new Date().getTime()/1000/60 - lastTime.getTime()/1000/60 < 20;
          sensor.lastReading = sensor.data[0].y;
          sensor.minReading = Math.min(...sensor.data.map( d => d.y ));
          sensor.maxReading = Math.max(...sensor.data.map( d => d.y ));
        }
      }
      res();
    })
  }



  getSensorData(sname: string, sd: string, ed: string) {
    return new Promise<any>( (res, rej) => {
      // console.log(sname, sd, ed)
      this.http.getLatestSensorData(sname, sd, ed).subscribe( (response) => {
          res(response);
        }
      );
    });
  }


  getTimeHistory(sensorDataArray, param) {

    switch (param) {
      case 'temp':  return sensorDataArray.map( (d) => (  {x: d.time, y: d.temp}  ));
      case 'press': return sensorDataArray.map( (d) => (  {x: d.time, y: d.press} ));
      case 'rh':    return sensorDataArray.map( (d) => (  {x: d.time, y: d.rh}    ));
      case 'rhi':   return sensorDataArray.map( (d) => (  {x: d.time, y: this.rhi.transform(d.rh, d.temp)} ));
      case 'ah':    return sensorDataArray.map( (d) => (  {x: d.time, y: this.ah.transform( d.rh, d.temp)}  ));
    }
  }





}




