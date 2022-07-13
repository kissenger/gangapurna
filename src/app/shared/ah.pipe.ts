import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ah'
})

export class AbsHumPipe implements PipeTransform {

  transform(rh: number, T: number): number {

    // https://www.hatchability.com/Vaisala.pdf
    const A = 6.116441;
    const m = 7.591386;
    const Tn = 240.7263;
    const C = 2.16679;

    let Pws = A * Math.pow(10, m * T / (T + Tn));
    let Pw = Pws * rh / 100;

    return C * Pw / T;

  }


}
