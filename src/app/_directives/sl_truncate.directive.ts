import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sltruncate'
})
export class SlTruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 25, completeWords: boolean = false, ellipsis: string = '...') {
    if (value.length < limit) {
      return `${value.substr(0, limit)}`;
    }

    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return `${value.substr(0, limit)}${ellipsis}`;
  }
}
