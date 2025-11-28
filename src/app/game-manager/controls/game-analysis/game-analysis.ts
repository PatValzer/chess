import { Component, computed, effect, inject, Signal } from '@angular/core';
import { StockfishService } from '../../../services/stockfish-service';

import { PositionAnalysis, WinProbabilityBar } from "../win-probability-bar/win-probability-bar";
import { GameManagerService } from '../../../services/game-manager-service';

@Component({
  selector: 'app-game-analysis',
  imports: [WinProbabilityBar],
  templateUrl: './game-analysis.html',
  styleUrl: './game-analysis.scss'
})
export class GameAnalysis {
  // Inject Stockfish chess engine service
  stockfish = inject(StockfishService)
  gameManagerService = inject(GameManagerService)

  constructor() {


  }

  // Computed signal for position analysis based on Stockfish results

  positionAnalysis: Signal<PositionAnalysis> = computed(
    () => {
      let result = this.stockfish.result();
      return {
        whiteWinProbability: (result.drawProbability / 2) / 1000 + result.whiteWinProbability / 1000,
        drawProbability: 0,
        blackWinProbability: (result.drawProbability / 2) / 1000 + result.blackWinProbability / 1000
      }
    }
  )

}
