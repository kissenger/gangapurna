import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ah'
})

export class AbsHumPipe implements PipeTransform {

  transform(rh: number, t: number): number {

    // Returns Absolute Humidity in g/m^3 from RH and temperature in degC
    // https://www.hatchability.com/Vaisala.pdf
    // Careful with Temperature units in the above - T is sometimes degC and sometimes K
    // See also https://www.omnicalculator.com/physics/absolute-humidity
    // const A = 6.116441;
    // const m = 7.591386;
    // const Tn = 240.7263;  // K
    const C = 2.16679;    // gK/J
    const C1 = -7.85951783;
    const C2 = 1.84408259;
    const C3 = -11.7866497;
    const C4 = 22.6807411;
    const C5 = -15.9618719;
    const C6 = 1.80122502;
    const Pc = 220640;    // hPa
    const Tc = 647.096;   // K

    let T = t + 273.15;                                   // Kelvin

    const phi = 1 - T / Tc;

    const theta = C1 * phi + C2 * phi**1.5 + C3 * phi**3 + C4 * phi**3.5 + C5 * phi**4 + C6 * phi**7.5;
    const Pws = Pc * Math.exp(Tc * theta / T);
    // let Pws = A * Math.pow(10, m * t / (t + Tn)) * 100;   // Pa
    let Pw = Pws * rh / 100;                              // Pa

    return C * Pw / T;

  }


}
