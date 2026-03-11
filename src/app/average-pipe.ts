import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'average'
})
export class AveragePipe implements PipeTransform {

  transform(value: string | undefined): string{
    return value ? value.slice(1) : '';
  }
}
