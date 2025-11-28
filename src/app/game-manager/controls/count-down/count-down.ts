import { Component, computed, effect, inject, input } from '@angular/core';
import { CountdownService } from '../../../services/countdown-service';
import { GameManagerService } from '../../../services/game-manager-service';

@Component({
  selector: 'app-count-down',
  imports: [],
  templateUrl: './count-down.html',
  styleUrl: './count-down.scss',
})
export class CountDown {
  countDownColor = input.required<'w' | 'b'>()

  readonly gameManagerService = inject(GameManagerService);
  private readonly countdownService = inject(CountdownService);

  readonly whiteMs = this.countdownService.timeWhite;
  readonly blackMs = this.countdownService.timeBlack;

  readonly whiteTimeFormatted = computed(() => this.format(this.whiteMs()));
  readonly blackTimeFormatted = computed(() => this.format(this.blackMs()));

  start() {
    this.countdownService.start();
  }

  stop() {
    this.countdownService.stop();
  }

  switch = effect(
    () => {
      this.countdownService.activePlayer.update(s => this.gameManagerService.currentTurn());
    }
  )

  reset() {
    this.countdownService.reset();
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
