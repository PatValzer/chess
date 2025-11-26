// Component for individual chessboard cell UI and logic
import { Component, computed, inject, input, InputSignal, Signal, untracked } from '@angular/core';
import { ChessboardService } from '../../../services/chessboard.service';
import { GameManagerService } from '../../../services/game-manager-service';
import { Square } from '../../models/Square';
import { PieceTypePipe } from "../../pipes/piece-type-pipe";
import { CellColorPipe } from "../../pipes/piece-color-pipe";
import { PieceComponent } from "../piece/piece";
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerDialogComponent } from '../../../shared/color-picker-dialog';
import { PromotionDialog } from '../promotion-dialog/promotion-dialog';
import { Move } from 'chess.js';
import { Piece } from '../../models/Piece';
import { CdkDrag, CdkDragDrop, CdkDragStart, DragDropModule } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-cell',
  imports: [CellColorPipe, PieceComponent, DragDropModule],
  templateUrl: './cell.html',
  styleUrl: './cell.scss'
})
export class CellComponent {

  onDragStart($event: CdkDragStart<Square>) {
    this.chessboardService.selectedPieceSquare.update(s => $event.source.data)
  }

  // Inject services for board and game management
  chessboardService = inject(ChessboardService)
  private gameManagerService = inject(GameManagerService)


  selectedPiece = computed(
    () => this.selectedSquare()?.piece()
  )

  selectedSquare = computed(
    () => this.chessboardService.selectedPieceSquare()
  )

  // Signal for the cell's Square data
  cell: InputSignal<Square> = input.required()


  cellClick($event: PointerEvent) {


    if (this.selectedSquare() && !this.selectedSquare()?.coordinates.equals(this.cell().coordinates)) {
      const selectedSquare = this.selectedSquare as Signal<Square>
      if (this.availableDestination()) {
        this.gameManagerService.movePiece(selectedSquare(), this.cell())
      }
      else
        this.chessboardService.selectedPieceSquare.set(null)
    }
    else
      if (this.cell().piece()) {
        this.chessboardService.selectedPieceSquare.set(this.cell())
        console.log("selected piecesquare", new PieceTypePipe().transform(this.selectedPiece()?.pieceSymbol), this.selectedPiece()?.pieceColor)
      }

  }




  /**
   * Computed property to check if this cell is selected
   * Suggestion: Use for highlighting selected cell in UI
   */
  selected = computed(() => {
    if (this.selectedSquare() != null) {
      let isCellPieceSelected = this.cell().coordinates.equals(this.selectedSquare()?.coordinates)
      return isCellPieceSelected
    }
    return false
  });

  lastMove = computed(
    () => {
      const currentMoveIndex = this.gameManagerService.currentMoveIndex()
      if (currentMoveIndex > 0) {
        const moves = untracked(() => this.gameManagerService.moves())
        return moves[currentMoveIndex - 1]
      }
      return null
    }
  )

  lastMoveFrom = computed(() => {
    const lastMove = this.lastMove()
    const cell = untracked(() => this.cell())
    return lastMove?.from == cell.coordinates.toString()
  });

  lastMoveTo = computed(() => {
    const lastMove = this.lastMove()
    const cell = untracked(() => this.cell())
    return lastMove?.to == cell.coordinates.toString()
  });

  /**
   * Computed property to check if this cell is a valid destination for the selected piece
   * Suggestion: Use for highlighting available moves
   */
  availableDestination = computed(() => {
    const isAllowedCell = this.gameManagerService.allowedDestinationCellsForSelectedPiece().find(s => s.coordinates.equals(this.cell().coordinates))
    return isAllowedCell != null
  });

  opacity = computed(() => {
    if (this.availableDestination()) {
      return this.cell().displayColor == 'w' ? 0.7 : 0.8
    }

    if (this.lastMoveFrom() || this.lastMoveTo()) {
      return 0.6
    }
    return this.cell().displayColor == 'w' ? 1 : 0.7
  });


  boxShadow = computed(() => {
    const baseStyle = 'inset 0 0 0 '
    let baseWidth = 1
    let color = 'black'

    if (this.lastMoveFrom() || this.lastMoveTo()) {
      baseWidth = 3
      color = 'green'
    }

    if (this.availableDestination()) {
      baseWidth = 3
      color = 'red'
    }


    return baseStyle + baseWidth + "px " + color
  });





}



