import { Component, computed, effect, inject, input } from '@angular/core';
import { CountdownService } from '../../../services/countdown-service';
import { GameManagerService } from '../../../services/game-manager-service';
import { CellColorPipe, PieceColorPipe } from "../../../pipes/piece-color-pipe";
import { CountDownFormatPipePipe } from "../../../pipes/count-down-format-pipe";

@Component({
  selector: 'app-count-down',
  imports: [CellColorPipe, PieceColorPipe, CountDownFormatPipePipe],
  templateUrl: './count-down.html',
  styleUrl: './count-down.scss',
})
export class CountDownComponent {
  countDownColor = input.required<'w' | 'b'>()

  readonly gameManagerService = inject(GameManagerService);
  private readonly countdownService = inject(CountdownService);

  readonly whiteMs = this.countdownService.timeWhite;
  readonly blackMs = this.countdownService.timeBlack;


  stop() {
    this.countdownService.stop();
  }

  switch = effect(
    () => {
      if (this.gameManagerService.currentMoveIndex() > 0 && !this.gameManagerService.reviewMode()) {
        this.countdownService.start();
        this.countdownService.activePlayer.update(s => this.gameManagerService.currentTurn());
      }
    }
  )

  reset() {
    this.countdownService.reset();
  }


}
