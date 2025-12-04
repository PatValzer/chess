// Chessboard component for rendering and managing the board UI
import { Component, computed, effect, inject, input, OnInit, Signal } from '@angular/core';
import { CellComponent } from "./controls/cell/cell";
import { ChessboardService } from '../services/chessboard.service';
import { GameManagerService } from '../services/game-manager-service';

@Component({
  selector: 'app-chessboard',
  imports: [CellComponent],
  templateUrl: './chessboard.html',
  styleUrl: './chessboard.scss',

})
export class Chessboard {


  // Injects the service that manages board state and cell logic
  chessboardService = inject(ChessboardService)
  gameManagerService = inject(GameManagerService)

  cellSize = input<'s' | 'b'>('b')



  

}
