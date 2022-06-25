import { Component, OnInit, ViewChild} from '@angular/core';
import { RhiPipe } from 'src/app/shared/rhi.pipe';
import { RhcritPipe } from 'src/app/shared/rhcrit.pipe';
import { HttpService } from '../shared/http.service';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions, scaleService } from 'chart.js';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})



export class MainComponent implements OnInit {

  public sensorData = [];
  private rhCritTemps = [0, 2, 2.01, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20 ,22, 23, 24, 40];
  private sensors = ['ahtInside', 'ahtOutside'];
  public chartData: ChartDataSets[] = [];
  public chartLabels: Label[] = [];
  public chartOptions: ChartOptions = {};
  public chartColors: Color[] = [];
  public chartLegend = true;

  constructor(
    public rhi: RhiPipe,
    public rhCrit: RhcritPipe,
    private http: HttpService
  ) {  }


  async ngOnInit() {

    for (let i = 0; i < this.sensors.length; i++) {
      let newData = await this.getSensorData(this.sensors[i]);
      this.sensorData.push(newData);
    }

    this.updateChart();
  }

  getSensorData(sname: string) {
    return new Promise<any>( (res, rej) => {
      this.http.getLatestSensorData(sname).subscribe(
        (response) => {
          res(response);
        }
      );
    });
  }

  updateChart() {

    this.chartData =[ {
      data:  this.rhCritTemps.map(t => ({x: t, y: this.rhCrit.transform(t)}) ),
      showLine: true,
      borderWidth: 5,
      lineTension: 0,
      pointRadius: 0,
      borderColor: 'rgba(0,0,0,0.4)',
      backgroundColor: 'rgba(0,0,0,0.4)',
      fill: false,
      label: 'RHcrit'
    }, {
      data: [ {x: this.sensorData[0].temp, y: this.sensorData[0].rh}],
      radius: 5,
      // borderColor: 'rgb(255,0,0)',
      // borderWidth: 2,
      pointBackgroundColor: 'rgba(255,100,100,0.8)',
      backgroundColor: 'rgba(255,100,100,0.8)',
      label: this.sensorData[0].sensor_name
    }, {
      data: [ {x: this.sensorData[1].temp, y: this.sensorData[1].rh}],
      radius: 5,
      // borderWidth: 50,
      // borderColor: 'rgba(0,255,0,0.5)',
      pointBackgroundColor: 'rgba(100,100,255,0.8)',
      backgroundColor: 'rgba(100,100,255,0.8)',
      label: this.sensorData[1].sensor_name
    }];

    this.chartOptions = {
      title: {
        display: false
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'degC',
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
            labelString: '%RH',
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
  };



  }


