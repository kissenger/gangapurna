import { Component, OnInit, ViewChild} from '@angular/core';
import { RhiPipe } from 'src/app/shared/rhi.pipe';
import { RhcritPipe } from 'src/app/shared/rhcrit.pipe';
import { HttpService } from '../shared/http.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-latest',
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.css']
})

export class LatestComponent implements OnInit {

  public sensorData = [];
  public printData = [];
  private rhCritTemps = [0, 2, 2.01, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20 ,22, 23, 24, 40];
  private sensors = ['ahtInside', 'dallasOutside'];

  public chartLegend = true;

  constructor(
    public rhi: RhiPipe,
    public rhCrit: RhcritPipe,
    private http: HttpService,
    private route: ActivatedRoute,
  ) {  }


  async ngOnInit() {


    // let dates = await this.getParams();

    // for (let i = 0; i < this.sensors.length; i++) {
    //   let newData = await this.getSensorData(this.sensors[i], dates.startDate, dates.endDate);
    //   this.sensorData.push(newData);

    //   const sampleTime = new Date(newData[0].time).getTime()/1000/60;
    //   const currentTime = new Date().getTime()/1000/60;
    //   const rhi = this.rhi.transform(newData[0].rh, newData[0].temp);
    //   newData[0].isTimeGood = (currentTime - sampleTime) < 20;
    //   newData[0].rhiStatus = rhi < 1.0 ? 'good' : rhi < 1.03 ? 'ok' : 'bad';
    //   this.printData.push(newData[0]);
    // }

    // console.log(this.printData);

    // this.updateChart();
  }

  // getSensorData(sname: string, sd: string, ed: string) {
  //   return new Promise<any>( (res, rej) => {
  //     this.http.getLatestSensorData(sname, sd, ed).subscribe(
  //       (response) => {
  //         res(response);
  //       }
  //     );
  //   });
  // }
  // getParams() {
  //   return new Promise<any>( (res, rej) => {
  //     this.route.params.subscribe( (params) => res(params.nReadings));
  //   });
  // }

  // updateChart() {

  //   /*
  //     Note that we are using legcay versions of chart.js and ng2-charts that are
  //     compatible with Angular v8
  //   */


  //   this.chartData =[ {
  //     data:  this.rhCritTemps.map(t => ({x: t, y: this.rhCrit.transform(t)}) ),
  //     showLine: true,
  //     borderWidth: 5,
  //     lineTension: 0,
  //     pointRadius: 0,
  //     borderColor: 'rgba(0,0,0,0.4)',
  //     backgroundColor: 'rgba(0,0,0,0.4)',
  //     fill: false,
  //     label: 'RHcrit'
  //   }, {
  //     // latest data point for sensor 1
  //     data: [ {x: this.sensorData[0][0].temp, y: this.sensorData[0][0].rh}],
  //     radius: 5,
  //     pointBorderColor: 'rgba(0,0,0,0.8)',
  //     pointBackgroundColor: 'rgba(255,100,100,1)',
  //     borderColor: 'rgba(255,100,100,1)',
  //     backgroundColor: 'rgba(255,100,100,1)',
  //     label: this.sensorData[0][0].sensor_name + '_now'
  //   }, {
  //     // all points for sensor 1
  //     data: this.getData(this.sensorData[0]).reverse(),
  //     showLine: true,
  //     fill: false,
  //     radius: 0,
  //     borderWidth: 2,
  //     borderColor: 'rgba(255,100,100,0.3)',
  //     label: this.sensorData[0][0].sensor_name + "_history"
  //   }, {
  //     // latest data point for sensor 2
  //     data: [ {x: this.sensorData[1][0].temp, y: this.sensorData[1][0].rh}],
  //     radius: 5,
  //     pointBorderWidth: 1,
  //     pointBorderColor: 'rgba(0,0,0,1)',
  //     pointBackgroundColor: 'rgba(100,100,255,1)',
  //     borderColor: 'rgba(100,100,255,1)',
  //     backgroundColor: 'rgba(100,100,255,1)',
  //     label: this.sensorData[1][0].sensor_name + '_now'
  //   }, {
  //     // all points for sensor 2
  //     data: this.getData(this.sensorData[1]).reverse(),
  //     showLine: true,
  //     fill: false,
  //     radius: 0,
  //     borderColor: 'rgba(100,100,255,0.3)',
  //     label: this.sensorData[1][0].sensor_name + '_history'
  //   }
  // ]


  //   // for (let i = 0; i < this.sensorData[0].length; i++) {
  //   //   let opacity = 1.0 - (1 / nReadings) * i;
  //   //   this.chartData.push({
  //   //     data: [{x:this.sensorData[0][i].temp, y: this.sensorData[0][i].rh}],
  //   //     radius: 5,
  //   //     borderColor: `rgba(100,100,255,${opacity})`,
  //   //     pointBackgroundColor: `rgba(100,100,255,${opacity})`,
  //   //     backgroundColor: `rgba(100,100,255,${opacity})`,
  //   //     label: i == 0 ? this.sensorData[0][1].sensor_name : '',
  //   //   });
  //   // }




  //   this.chartOptions = {
  //     title: {
  //       display: false
  //     },
  //     scales: {
  //       xAxes: [{
  //         scaleLabel: {
  //           display: true,
  //           labelString: 'degC',
  //           lineHeight: 1,
  //           padding: 4,
  //           fontSize: 12
  //         },
  //         ticks: {
  //           fontSize: 10
  //         }
  //       }],
  //       yAxes: [{
  //         scaleLabel: {
  //           display: true,
  //           labelString: '%RH',
  //           lineHeight: 1,
  //           padding: 4,
  //           fontSize: 12
  //         },
  //         ticks: {
  //           fontSize: 10
  //         }
  //       }]
  //     },
  //     tooltips: {
  //       intersect: true
  //     },
  //   };
  // };


  // getData(sensorDataArray) {
  //   let data = [];
  //   for (let i = 0; i < sensorDataArray.length; i++) {
  //     data.push({x:sensorDataArray[i].temp, y: sensorDataArray[i].rh})
  //   }
  //   return data;
  // }



  }


