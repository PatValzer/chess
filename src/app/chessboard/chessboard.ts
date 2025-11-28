// Chessboard component for rendering and managing the board UI
import { Component, computed, effect, inject, input, OnInit, Signal } from '@angular/core';
import { CellComponent } from "./controls/cell/cell";
import { ChessboardService } from '../services/chessboard.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Square } from './models/Square';
import { GameManagerService } from '../services/game-manager-service';

@Component({
  selector: 'app-chessboard',
  imports: [CellComponent, DragDropModule],
  templateUrl: './chessboard.html',
  styleUrl: './chessboard.scss',

})
export class Chessboard {

  drop($event: CdkDragDrop<Square, Square, Square>) {
    const pieceCell = $event.item.data
    const destinationeCell = $event.container.data
    this.gameManagerService.movePiece(pieceCell, destinationeCell)

  }
  // Injects the service that manages board state and cell logic
  chessboardService = inject(ChessboardService)
  gameManagerService = inject(GameManagerService)

  cellSize = input<'s' | 'b'>('b')

  allDropListIds = computed(
    () => {
      const result = this.chessboardService.cells
        .flat()
        .map(
          (cell) => `cell-${cell().coordinates.toString()}`
        );
      console.log("allDropListIds", result)
      return result
    }

  )

}
