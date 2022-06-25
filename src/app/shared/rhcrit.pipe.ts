import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rhCrit'
})

export class RhcritPipe implements PipeTransform {

  transform(t: number): number {

    if (t <= 2) return 100;
    if (t >= 24) return 65;

    const A = 0.0168;
    const B = -1.5741;
    const C = 93.137;
    return A * t * t + B * t + C;

  }


}
