import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mr'
})

export class MixRatioPipe implements PipeTransform {

  transform(Ptot: number, rh: number, t: number): number {

    // Returns Mixing Ratio in g/kg from ambient pressurein Pa, temperature and RH
    // https://www.hatchability.com/Vaisala.pdf
    // Units are a nightmare in this ref, with hPa and Pa being interchanged so be careful
    const A = 6.116441;
    const m = 7.591386;
    const Tn = 240.7263;  // Kelvin
    // const C = 2.16679;    // gK/J
    const B = 621.9907;   // g/kg

    // let T = t + 273.15;                                   // Kelvin
    let Pws = A * Math.pow(10, m * t / (t + Tn)) * 100;   // Pa
    let Pw = Pws * rh / 100;                              // Pa
console.log(Ptot);
    return B * Pw / (Ptot - Pw);

  }


}
