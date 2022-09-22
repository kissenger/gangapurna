import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dp'
})

export class DewPointPipe implements PipeTransform {

  transform(rh: number, t: number): number {

    // from: https://bmcnoldy.rsmas.miami.edu/Humidity.html
    return 243.04 * (Math.log(rh / 100)+( (17.625 * t) / (243.04 + t))) / (17.625 - Math.log(rh/100) - ( (17.625 * t) / (243.04 + t) ) );

  }


}
