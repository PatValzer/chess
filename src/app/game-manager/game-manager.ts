import { Component, effect, inject, input, signal, ViewChild } from '@angular/core';
import { GameManagerService } from '../services/game-manager-service';
import { EatenPiecesComponent } from "./controls/eaten-pieces/eaten-pieces";
import { PgnReader as PgnReaderComponent } from "./controls/pgn-reader/pgn-reader";
import { GameMoves as GameMovesComponent } from "./controls/game-moves/game-moves";
import { MatTabsModule } from '@angular/material/tabs';
import { GamesLibrary as GamesLibraryComponent } from "./controls/games-library/games-library";
import { GameNavigator as GameNavigatorComponent } from "./controls/game-navigator/game-navigator";
import { GameAnalysis as GameAnalysisComponent } from "./controls/game-analysis/game-analysis";

import { OpeningService } from '../services/opening-service';
import { BreakpointService } from '../services/breakpoint-service';
import { CountdownService } from '../services/countdown-service';
import { CountDownComponent } from "./controls/count-down/count-down";
import { CellColorPipe } from "../pipes/piece-color-pipe";

@Component({
  selector: 'app-game-manager',
  imports: [
    EatenPiecesComponent,
    PgnReaderComponent,
    GameMovesComponent,
    GamesLibraryComponent,
    GameNavigatorComponent,
    GameAnalysisComponent,
    MatTabsModule,
    CountDownComponent,
    CellColorPipe
  ],
  templateUrl: './game-manager.html',
  styleUrl: './game-manager.scss'
})

export class GameManager {

  eatenPiecesColorShown = signal<'w' | 'b'>('w')
  resetGame = input.required<number>()

  showPgn: boolean = false;


  breakpointService = inject(BreakpointService)
  gameManagerService = inject(GameManagerService)
  countDownService = inject(CountdownService)
  openingService = inject(OpeningService)

  constructor() {
    effect(
      () => {
        if (this.resetGame()) {
          this.gameManagerService.reset()
        }
      }
    )

    effect(
      () => {
        const currentTurn = this.gameManagerService.currentTurn();
        if (this.gameManagerService.currentMoveIndex() > 0 && !this.gameManagerService.reviewMode()) {
          this.eatenPiecesColorShown.set(this.gameManagerService.currentTurn())
        }
      }
    )
  }
}
