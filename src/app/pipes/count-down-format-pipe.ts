import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countDownFormatPipe',
})
export class CountDownFormatPipePipe implements PipeTransform {

  transform(ms: number): string {
    return this.format(ms);
  }

  private format(ms: number): string {
    const h = Math.floor(ms / 3600000);
    if (h > 0) {
      const min = Math.floor((ms % 3600000) / 60000);
      const sec = Math.floor((ms % 60000) / 1000);
      return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
}
