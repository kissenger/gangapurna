import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rhCorrected'
})

export class RhCorrectedPipe implements PipeTransform {

  transform(rh_t2: number, t_t2: number, t_t1: number): number {

    // given temp at time 1, and rh and temp and time 2, return rh at time 1
    // eqns from https://bmcnoldy.rsmas.miami.edu/Humidity.html

    const lnRH = Math.log(rh_t2 / 100);
    const dp = 243.04 * (lnRH + ( (17.625 * t_t2) / (243.04 + t_t2))) / (17.625 - lnRH - ( (17.625 * t_t2) / (243.04 + t_t2) ) );
    return 100 * ( Math.exp( (17.625 * dp) / (243.04+dp) ) / Math.exp( (17.625 * t_t1) / (243.04 + t_t1) ) );


  }


}
