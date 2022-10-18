import { Component, OnInit, OnDestroy} from '@angular/core';
import { RhiPipe } from 'src/app/shared/rhi.pipe';
import { RhcritPipe } from 'src/app/shared/rhcrit.pipe';
import { HttpService } from '../shared/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbsHumPipe } from '../shared/ah.pipe';

import { ChartType, ChartOptions, ChartData } from 'chart.js';
import 'chartjs-adapter-moment'; // this is needed by cgartjs - documentation is not very clear

@Component({
  selector: 'app-latest',
  templateUrl: './time-history.component.html',
  styleUrls: ['./time-history.component.css']
})

export class TimeHistoryComponent implements OnInit {

  // for rhi chart
  private rhiCritXvalues = [0, 2, 2.01, 4, 6, 8, 10, 12, 14, 16, 18, 20 ,22, 24, 40];
  private rhCritCurve = this.rhiCritXvalues.map(t => ({x: t, y: this.rhCrit.transform(t)}) );
  private axisLabels = {
    rh: 'Rel Hmty [%]',
    ah: 'Abs Hmty [g/m^3]',
    temp: 'T [' + String.fromCharCode(176) + 'C]',
    rhi: 'Rel Hmty Idx [-]',
    press: 'P (@ sea level) [Pa]',
    time: 'Time'
  };

  private defaults = {
    lineColour: 'rgba(500, 50, 100, 0.5)',
    lineTension: 0.2,
    lineWidth: 3,
    pointColour: 'rgba(500, 50, 100, 0.5)',
    pointLineWidth: 2,
    pointRadius: 0,
    pointStyle: 'circle'
  }

  // define charts for each 'zone'
  public defineCharts = {
    house: [
      {
        xAxis: 'time',
        yAxis: 'temp',
        series: [
          {sensor: 'Living Room',     lineColour: 'rgba(50, 50, 50, 0.5)'},
          {sensor: 'dallasOutside',   lineColour: 'rgba(50, 50, 255, 0.5)'},
          {sensor: 'Hall',            lineColour: 'rgba(50, 50, 100, 0.5)'},
          {sensor: 'Hall Radiator',   lineColour: 'rgba(50, 100, 50, 0.5)'},
          {sensor: 'Kitchen',         lineColour: 'rgba(50, 100, 100, 0.5)'},
          {sensor: 'Gordons Office',  lineColour: 'rgba(100, 50, 50, 0.5)'},
          {sensor: 'dallasStoreRoom', lineColour: 'rgba(100, 100, 50, 0.5)'}
        ]
      }
    ],
    garage: [
      {
        xAxis: 'temp',
        yAxis: 'rh',
        series: [
          { sensor: 'ahtStoreRoom', lastPointOnly: true, pointRadius: 3, pointColour: 'rgba(50, 50, 100, 1)', lineColour: 'rgba(50, 50, 100, 0.5)' },
          { sensor: 'rhCritCurve', data: this.rhCritCurve, lineColour: 'rgba(50, 150, 100, 0.5)', lineTension: 0 }
        ]
      }, {
         xAxis: 'time',
         yAxis: 'temp',
         series: [
          { sensor: 'dallasStoreRoom', lineColour: 'rgba(100, 100, 50, 0.5)'},
          { sensor: 'dallasOutside', lineColour: 'rgba(50, 50, 255, 0.5)'}
        ]
      }, {
        xAxis: 'time',
        yAxis: 'rh',
        series: [
          { sensor: 'ahtStoreRoom', lineColour: 'rgba(150, 50, 100, 0.5)'}
        ]
      }, {
        xAxis: 'time',
        yAxis: 'ah',
        series: [
          { sensor:'ahtStoreRoom', lineColour: 'rgba(150, 150, 100, 0.5)'}
        ]
      }, {
        xAxis: 'time',
        yAxis: 'rhi',
        series: [
          {sensor:'ahtStoreRoom', lineColour: 'rgba(150, 255, 100, 0.5)'}
        ]
      }, {
        xAxis: 'time',
        yAxis: 'press',
        series: [
          {sensor:'bmpStoreRoom', lineColour: 'rgba(50, 50, 255, 0.5)'}
        ]
      }
    ],
    outside: [
      {
        xAxis: 'time',
        yAxis: 'press',
        series: [
          {sensor:'bmpStoreRoom', lineColour: 'rgba(255, 50, 255, 0.5)'}
        ]
      }, {
        xAxis: 'time',
        yAxis: 'temp',
        series: [
          {sensor: 'dallasOutside', lineColour: 'rgba(50, 50, 255, 0.5)'}
        ]
      }
    ]
  };


  public zone: string;
  public chartType: { [key: string]: ChartType } = {};
  public chartData: { [key: string]: ChartData } = {};
  public chartOpts: { [key: string]: ChartOptions} = {};

  private interval;
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
      this.startDate = urlParams.startDate;
      this.endDate = urlParams.endDate;
      await this.getChartData();
      this.updateChart();
    })

    this.interval = setInterval( async () => {
      await this.getChartData();
      this.updateChart();
   }, this.REFRESH_INTERVAL);

  }


  updateChart() {

    /*
      Note that we are using legcay versions of chart.js and ng2-charts that are
      compatible with Angular v8
    */

    this.defineCharts[this.zone].forEach( (chart, index) => {

      this.chartType[index] = 'line';

      this.chartData[index] = {
        datasets: chart.series.map( series => ({
          data: series.data,
          ...series.styles
        }))
      };

      this.chartOpts[index] = {
        scales: {
          x: {
            type: chart.xAxis === 'time' ? 'time' : 'linear',
            offset: false,
            grid: {
              offset: false
            },
            title: {
              display: chart.xAxis !== 'time',
              text: this.axisLabels[chart.xAxis]
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: this.axisLabels[chart.yAxis]
            }
          }
        }
      }
    })


  }

  async getChartData() {
    return new Promise<void>( async (res, rej) => {
      for (const chart of this.defineCharts[this.zone]) {

        for (const s of chart.series) {
          const dataBuff = await this.getSensorData(s.sensor, this.startDate, this.endDate);
          if (!s.data) {
            s.data = this.getDataArray(dataBuff, chart.xAxis, chart.yAxis);
          }
          const lastTime = new Date(s.data[0].x);
          s.lastTimestampFormatted = lastTime.toLocaleString();
          s.isTimeGood = new Date().getTime()/1000/60 - lastTime.getTime()/1000/60 < 20;
          s.lastReading = s.data[0].y;
          s.minReading = Math.min(...s.data.map( d => d.y ));
          s.maxReading = Math.max(...s.data.map( d => d.y ));

          // Apply styles to the series
          s.styles = {
            label:                s.sensor,
            backgroundColor:      s.lineColour === undefined ? this.defaults.lineColour : s.lineColour,
            borderColor:          s.lineColour === undefined ? this.defaults.lineColour : s.lineColour,
            borderWidth:          s.lineWidth === undefined ? this.defaults.lineWidth : s.lineWidth,
            tension:              s.lineTension === undefined ? this.defaults.lineTension : s.lineTension,
            pointBorderColor:     s.pointColour === undefined ? this.defaults.pointColour : s.pointColour,
            pointBackgroundColor: s.lineColour === undefined ? this.defaults.lineColour : s.lineColour,
            pointBorderWidth:     s.pointLineWidth === undefined ? this.defaults.pointLineWidth : s.pointLineWidth,
            pointStyle:           s.pointStyle === undefined ? this.defaults.pointStyle : s.pointStyle,
            pointRadius:          s.pointRadius === undefined ? this.defaults.pointRadius : s.pointRadius
          }

          if ( s.lastPointOnly ) {
            s.styles.pointRadius = s.data.map( (d, i) => ( i < s.data.length - 1 ? 0 : s.pointRadius));
          }

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


  getDataArray(sensorDataArray, xParam: string, yParam: string) {

    // generic case where all axis have non-derived variables
    if ( ['temp', 'press', 'rh'].includes(yParam) ) {
      return sensorDataArray.map( (d) => (  {x: d[xParam], y: d[yParam]} ));
    }

    // deal with derived properties on the y - which are currently always plotted against time
    if ( yParam === 'rhi' ) {
      return sensorDataArray.map( (d) => (  {x: d.time, y: this.rhi.transform(d.rh, d.temp)} ));
    }

    if ( yParam === 'ah' ) {
      return sensorDataArray.map( (d) => (  {x: d.time, y: this.ah.transform( d.rh, d.temp)}  ));
    }

  }


  OnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }



}





