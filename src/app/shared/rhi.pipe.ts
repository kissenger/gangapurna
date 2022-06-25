import { Pipe, PipeTransform } from '@angular/core';
import { RhcritPipe} from 'src/app/shared/rhcrit.pipe';

@Pipe({
  name: 'rhi'
})

export class RhiPipe implements PipeTransform {

  constructor(
    private rhCrit: RhcritPipe
  ) {}

  transform(rh: number, t: number): number {
    return rh / this.rhCrit.transform(t);
  }


}
