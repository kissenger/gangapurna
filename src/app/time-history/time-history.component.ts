import { Component, OnInit, ViewChild} from '@angular/core';
import { RhiPipe } from 'src/app/shared/rhi.pipe';
import { RhcritPipe } from 'src/app/shared/rhcrit.pipe';
import { HttpService } from '../shared/http.service';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions} from 'chart.js';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-latest',
  templateUrl: './time-history.component.html',
  styleUrls: ['./time-history.component.css']
})

export class TimeHistoryComponent implements OnInit {

  public sensorData = [];
  public printData = [];
  private sensors = ['ahtInside', 'ahtOutside'];
  public chartData: ChartDataSets[] = [];
  public chartLabels: Label[] = [];
  public chartOptions: ChartOptions = {};
  public chartColors: Color[] = [];
  public chartLegend = true;

  constructor(
    public rhi: RhiPipe,
    public rhCrit: RhcritPipe,
    private http: HttpService,
    private route: ActivatedRoute,
  ) {  }

  async ngOnInit() {

    let nReadings = await this.getParams();
    console.log(nReadings);

    for (let i = 0; i < this.sensors.length; i++) {
      let newData = await this.getSensorData(this.sensors[i], nReadings);
      this.sensorData.push(newData);
    }

    console.log(this.sensorData)


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


    this.chartData =[ {
      data:  this.getTimeHistory(this.sensorData[0]),
      showLine: true,
      borderWidth: 5,
      lineTension: 0,
      pointRadius: 0,
      borderColor: 'rgba(255,100,100,0.5)',
      backgroundColor: 'rgba(255,100,100,0.5)',
      fill: false,
      label: 'ahtInside'
    }, {
      data:  this.getTimeHistory(this.sensorData[1]),
      showLine: true,
      borderWidth: 5,
      lineTension: 0,
      pointRadius: 0,
      borderColor: 'rgba(100,100,255,0.5)',
      backgroundColor: 'rgba(100,100,255,0.5)',
      fill: false,
      label: 'ahtOutside'
    } ];



    this.chartOptions = {
      title: {
        display: false
      },
      scales: {
        xAxes: [{
          type: 'time'
        }, {
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
      },
    };
  };


  getTimeHistory(sensorDataArray) {

    let data = [];
    for (let i = 0; i < sensorDataArray.length; i++) {
      data.push({x:sensorDataArray[i].time, y: sensorDataArray[i].temp})
    }
    console.log(data)
    return data;
  }



  }




