import { Component, OnInit, ViewChild} from '@angular/core';
import { RhiPipe } from 'src/app/shared/rhi.pipe';
import { RhcritPipe } from 'src/app/shared/rhcrit.pipe';
import { HttpService } from '../shared/http.service';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions} from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { AbsHumPipe } from '../shared/ah.pipe';


@Component({
  selector: 'app-latest',
  templateUrl: './time-history.component.html',
  styleUrls: ['./time-history.component.css']
})

export class TimeHistoryComponent implements OnInit {

  // public sensorData = [];
  // public printData = [];

  private chartQuantities = {
    house: [
      { quantity: 'temp', sensors: [{name: 'Living Room'}, {name: 'dallasOutside'}] }
    ],
    garage: [
      { quantity: 'temp', sensors: [{name: 'dallasStoreRoom'}, {name: 'dallasOutside'}] },
      { quantity: 'rh', sensors: [{name: 'ahtStoreRoom'}] },
      { quantity: 'ah', sensors: [{name:'ahtStoreRoom'}] },
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
    'Living Room': 'rgba(255, 100, 100, 0.5)',
  }

  private zone: string;

  public chartData: ChartDataSets[] = [];
  public chartLabels: Label[] = [];
  public chartOptions: ChartOptions = {};
  public chartColors: Color[] = [];
  public chartLegend = true;

  constructor(
    public rhi: RhiPipe,
    public rhCrit: RhcritPipe,
    public ah: AbsHumPipe,
    private http: HttpService,
    private route: ActivatedRoute
  ) {  }

  async ngOnInit() {

    // let urlParams = await this.getParams();

    this.route.params.subscribe( async (urlParams) => {

      this.zone = urlParams.zone;

      for (const cq of this.chartQuantities[this.zone]) {
        cq.xAxisLabel = 'Date';
        cq.yAxisLabel = this.yAxisLabels[cq.quantity]
        for (const sensor of cq.sensors) {
          const dataBuff = await this.getSensorData(sensor.name, urlParams.startDate, urlParams.endDate);
          sensor.data = this.getTimeHistory(dataBuff, cq.quantity);
          sensor.colour = this.chartLineRGBA[sensor.name];
        }
      }

      console.log(this.chartQuantities[this.zone])
      this.updateChart();

    })
  }


  getSensorData(sname: string, sd: string, ed: string) {
    return new Promise<any>( (res, rej) => {
      this.http.getLatestSensorData(sname, sd, ed).subscribe(
        (response) => {
          res(response);
        }
      );
    });
  }



  updateChart() {

    /*
      Note that we are using legcay versions of chart.js and ng2-charts that are
      compatible with Angular v8
    */

    this.chartQuantities[this.zone].forEach(chart => {

      this.chartData[chart.quantity] = chart.sensors.map( (sensor) => ({
          data:  sensor.data,
          showLine: true,
          borderWidth: 3,
          lineTension: 0,
          pointRadius: 0,
          borderColor: this.chartLineRGBA[sensor.name],
          pointBackgroundColor: this.chartLineRGBA[sensor.name],
          backgroundColor: this.chartLineRGBA[sensor.name],
          fill: false,
          label: sensor.name
        })
      )

      this.chartOptions[chart.quantity] = {
        title: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time'
          }, {
            scaleLabel: {
              display: true,
              lineHeight: 1,
              padding: 4,
              fontSize: 12
            },
            ticks: {
              fontSize: 10
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: chart.yAxisLabel,
              lineHeight: 1,
              padding: 4,
              fontSize: 12
            },
            ticks: {
              fontSize: 10
            }
          }]
        },
        tooltips: {
          intersect: true
        }
      };

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




