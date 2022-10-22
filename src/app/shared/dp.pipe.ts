import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dp'
})

export class DewPointPipe implements PipeTransform {

  transform(rh: number, t: number): number {

    // from: https://bmcnoldy.rsmas.miami.edu/Humidity.html
    const lnRH = Math.log(rh / 100);
    // console.log(lnRH)
    // return 50;
    return 243.04 * (lnRH + ( (17.625 * t) / (243.04 + t))) / (17.625 - lnRH - ( (17.625 * t) / (243.04 + t) ) );
  }


}
