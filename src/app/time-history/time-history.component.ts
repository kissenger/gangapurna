import { Component, OnInit, ViewChild} from '@angular/core';
import { RhiPipe } from 'src/app/shared/rhi.pipe';
import { RhcritPipe } from 'src/app/shared/rhcrit.pipe';
import { HttpService } from '../shared/http.service';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions} from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { AbsHumPipe } from '../shared/ah.pipe';
import { MixRatioPipe } from '../shared/mr.pipe';
import { DewPointPipe } from '../shared/dp.pipe';


@Component({
  selector: 'app-latest',
  templateUrl: './time-history.component.html',
  styleUrls: ['./time-history.component.css']
})

export class TimeHistoryComponent implements OnInit {

  public sensorData = [];
  public printData = [];
  private sensors = ['ahtInside', 'ahtOutside', 'bmpOutside'];
  private yLabel = {rh: 'RH [%]', ah: 'Abs H [g/m^3]', press: 'P [Pa]', temp: 'T [degC]', rhi: 'RHi [-]', mr: 'Mix Ratio [g/kg]'};
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
    private route: ActivatedRoute,
    private dp: DewPointPipe
  ) {  }

  async ngOnInit() {

    let nReadings = await this.getParams();

    for (let i = 0; i < this.sensors.length; i++) {
      let newData = await this.getSensorData(this.sensors[i], nReadings);
      this.sensorData.push(newData);
    }

    this.updateChart();
  }

  getSensorData(sname: string, n: number) {
    return new Promise<any>( (res, rej) => {
      this.http.getLatestSensorData(sname, n).subscribe(
        (response) => {
          res(response);
        }
      );
    });
  }

  getParams() {
    return new Promise<any>( (res, rej) => {
      this.route.params.subscribe( (params) => res(params.nReadings));
    });
  }



  updateChart() {

    /*
      Note that we are using legcay versions of chart.js and ng2-charts that are
      compatible with Angular v8
    */

    ['rhi', 'temp', 'rh', 'ah', 'dp'].forEach(param => {

      this.chartData[param] = [{
        data:  this.getTimeHistory(this.sensorData[0], param),
        showLine: true,
        borderWidth: 3,
        lineTension: 0,
        pointRadius: 0,
        borderColor: 'rgba(255,100,100,0.5)',
        pointBackgroundColor: 'rgba(255,100,100,0.5)',
        backgroundColor: 'rgba(255,100,100,0.5)',
        fill: false,
        label: 'ahtInside'
      }, {
        data:  this.getTimeHistory(this.sensorData[1], param),
        showLine: true,
        borderWidth: 3,
        lineTension: 0,
        pointRadius: 0,
        borderColor: 'rgba(100,100,255,0.5)',
        pointBackgroundColor: 'rgba(100,100,255,0.5)',
        backgroundColor: 'rgba(100,100,255,0.5)',
        fill: false,
        label: 'ahtOutside'
      }];

    });

    this.chartData['press'] = [{
      data:  this.getTimeHistory(this.sensorData[2], 'press'),
      showLine: true,
      borderWidth: 3,
      lineTension: 0,
      pointRadius: 0,
      borderColor: 'rgba(100,100,255,0.5)',
      pointBackgroundColor: 'rgba(100,100,255,0.5)',
      backgroundColor: 'rgba(100,100,255,0.5)',
      fill: false,
      label: 'bmp180'
    }];

    console.log(this.chartData);

    ['rhi', 'temp', 'rh', 'press', 'ah', 'dp'].forEach(param => {

      this.chartOptions[param] = {
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
              labelString: this.yLabel[param],
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

  };


  getTimeHistory(sensorDataArray, param) {

    // TODO: should use map for this?

    let data = [];
    for (let i = 0; i < sensorDataArray.length; i++) {
      if (param === "rhi") {
        data.push({x:sensorDataArray[i].time, y: this.rhi.transform(sensorDataArray[i].rh, sensorDataArray[i].temp)});
      } else if (param === "temp") {
        data.push({x:sensorDataArray[i].time, y: sensorDataArray[i].temp});
      } else if (param === "rh") {
        data.push({x:sensorDataArray[i].time, y: sensorDataArray[i].rh});
      } else if (param == "press") {
        data.push({x:sensorDataArray[i].time, y: sensorDataArray[i].press});
      } else if (param == "ah") {
        data.push({x:sensorDataArray[i].time, y: this.ah.transform(sensorDataArray[i].rh, sensorDataArray[i].temp)});
      } else if (param == "dp") {
        data.push({x:sensorDataArray[i].time, y: this.dp.transform(sensorDataArray[i].rh, sensorDataArray[i].temp)});
      }
    }
    return data;
  }



  }




