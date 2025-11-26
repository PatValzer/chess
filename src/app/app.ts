// Root Angular component for the chess app UI
import { Component, inject, signal } from '@angular/core';
import { Chessboard } from "./chessboard/chessboard";
import { GameManager } from "./game-manager/game-manager";
import { GameManagerService } from './services/game-manager-service';
import { ChessboardService } from './services/chessboard.service';
import { ChessToolbar } from "./chess-toolbar/chess-toolbar";
import { OpeningTreeComponent } from "./opening-tree/opening-tree";
import { OpeningService } from './services/opening-service';

@Component({
  selector: 'app-root',
  imports: [Chessboard, GameManager, ChessToolbar, OpeningTreeComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [GameManagerService, ChessboardService]
})
export class App {
  restart(reset: boolean) {
    this.resetGame.update(s => s + 1)
  }

  // App title signal for reactive UI
  protected readonly title = signal('chess');

  // Suggestion: Add logic for switching player color and persisting user preferences
  openingService = inject(OpeningService)
  chessboardService = inject(ChessboardService)
  gameManagerService = inject(GameManagerService)
  resetGame = signal(0)


}
