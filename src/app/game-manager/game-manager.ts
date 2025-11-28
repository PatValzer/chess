import { Component, effect, inject, input, signal, ViewChild } from '@angular/core';
import { GameManagerService } from '../services/game-manager-service';
import { EatenPiecesComponent } from "./controls/eaten-pieces/eaten-pieces";
import { PgnReader as PgnReaderComponent } from "./controls/pgn-reader/pgn-reader";
import { GameMoves as GameMovesComponent } from "./controls/game-moves/game-moves";
import { CountdownComponent, CountdownConfig, CountdownModule } from 'ngx-countdown';
import { MatTabsModule } from '@angular/material/tabs';
import { GamesLibrary as GamesLibraryComponent } from "./controls/games-library/games-library";
import { GameNavigator as GameNavigatorComponent } from "./controls/game-navigator/game-navigator";
import { GameAnalysis as GameAnalysisComponent } from "./controls/game-analysis/game-analysis";

import { OpeningService } from '../services/opening-service';
import { BreakpointService } from '../services/breakpoint-service';
import { CountdownService } from '../services/countdown-service';
import { CountDown } from "./controls/count-down/count-down";

@Component({
  selector: 'app-game-manager',
  imports: [
    EatenPiecesComponent,
    PgnReaderComponent,
    GameMovesComponent,
    GamesLibraryComponent,
    GameNavigatorComponent,
    GameAnalysisComponent,
    CountdownModule,
    MatTabsModule,
    CountDown
],
  templateUrl: './game-manager.html',
  styleUrl: './game-manager.scss'
})

export class GameManager {

  resetGame = input.required<number>()

  @ViewChild('wcd') private whiteCountdown!: CountdownComponent;
  @ViewChild('bcd') private blackCountdown!: CountdownComponent;

  showPgn: boolean = false;
  config: CountdownConfig = { leftTime: 300, demand: true };
  
  breakpointService = inject(BreakpointService)
  gameManagerService = inject(GameManagerService)
  openingService = inject(OpeningService)

  constructor() {
    effect(
      () => {
        if (this.resetGame()) {
          this.gameManagerService.reset()
          this.resetCountdowns()
        }
      }
    )

    effect(
      () => {
        const currentTurn = this.gameManagerService.currentTurn();
        if (this.gameManagerService.currentMoveIndex() > 0 && !this.gameManagerService.reviewMode()) {
          if (currentTurn == 'w') {
            this.whiteCountdown.begin()
            this.blackCountdown.pause()
          } else {
            this.whiteCountdown.pause()
            this.blackCountdown.begin()
          }
        }
      }
    )
  }

  resetCountdowns() {
    this.whiteCountdown.restart()
    this.blackCountdown.restart()
    this.whiteCountdown.pause()
    this.blackCountdown.pause()
  }
}
