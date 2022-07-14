import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ah'
})

export class AbsHumPipe implements PipeTransform {

  transform(rh: number, t: number): number {

    // Returns Absolute Humidity in g/m^3 from RH and temperature in degC
    // https://www.hatchability.com/Vaisala.pdf
    // Careful with Temperature units in the above - T is sometimes degC and sometimes K
    const A = 6.116441;
    const m = 7.591386;
    const Tn = 240.7263;  // Kelvin
    const C = 2.16679;    // gK/J

    let T = t + 273.15;                                   // Kelvin
    let Pws = A * Math.pow(10, m * t / (t + Tn)) * 100;   // Pa
    let Pw = Pws * rh / 100;                              // Pa

    return C * Pw / T;

  }


}
