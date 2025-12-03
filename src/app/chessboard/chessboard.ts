// Chessboard component for rendering and managing the board UI
import { Component, computed, effect, inject, input, OnInit, Signal } from '@angular/core';
import { CellComponent } from "./controls/cell/cell";
import { ChessboardService } from '../services/chessboard.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Square } from './models/Square';
import { GameManagerService } from '../services/game-manager-service';
import { CellColorPipe } from "../pipes/piece-color-pipe";

@Component({
  selector: 'app-chessboard',
  imports: [CellComponent, DragDropModule, CellColorPipe],
  templateUrl: './chessboard.html',
  styleUrl: './chessboard.scss',

})
export class Chessboard {


  // Injects the service that manages board state and cell logic
  chessboardService = inject(ChessboardService)
  gameManagerService = inject(GameManagerService)

  cellSize = input<'s' | 'b'>('b')



  

}
