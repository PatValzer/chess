import { Component, computed, inject, input, InputSignal, untracked } from '@angular/core';
import { ColorPickerDialogComponent } from '../../../shared/color-picker-dialog';
import { GameManagerService } from '../../../services/game-manager-service';
import { COLORS } from '../../../chessboard/COLORS';
import { CellColorPipe } from "../../../pipes/piece-color-pipe";
import { CellService } from '../../../services/cell.service';
import { Piece } from '../../../chessboard/models/Piece';
import { PieceSymbol } from 'chess.js';
import { PopupDialogService } from '../../../services/popup-dialog-service';
import { PieceComponent } from "../../../chessboard/controls/piece/piece";


@Component({
  selector: 'app-eaten-pieces',
  templateUrl: './eaten-pieces.html',
  styleUrls: ['./eaten-pieces.scss'],
  imports: [CellColorPipe, PieceComponent]
})
export class EatenPiecesComponent {
  private cellService = inject(CellService)
  private gameManagerService = inject(GameManagerService)
  private popupDialogService = inject(PopupDialogService)

  color: InputSignal<COLORS> = input.required()

  chess = computed(
    () => this.gameManagerService.chess
  )

  private allEatenPieces = computed(
    () => {
      if (this.gameManagerService.currentMoveIndex() > 0) {
        const capturedPieces: Piece[] = [];
        return untracked(
          () => {
            const captured = this.chess().history({ verbose: true }).filter(s => s.captured);
            captured.forEach(
              (captureMove) => {
                let getPiece = () => {
                  // Determine color of captured piece (opposite of mover)
                  const color = captureMove.color == 'w' ? 'b' : 'w';
                  const p = new Piece(color, captureMove.captured as PieceSymbol);
                  return p;
                };
                const piece = getPiece();
                capturedPieces.push(piece);
              }
            );
            return capturedPieces;
          }
        )
      }
      return []

    }
  )


  eatenPieces = computed(
    () => {
      return this.allEatenPieces().filter(s => s.pieceColor != this.color())
    }
  )



  /**
   * Open the standalone dialog and apply the chosen color.
   * - Uses GameManagerService.setChessboardWhiteColor(color) if available.
   * - Otherwise falls back to setting public property chessboardWhiteColor.
   *
   * Suggestion: add an explicit setter on GameManagerService to avoid brittle property writes.
   */
  openColorChooser() {
    const data = {
      currentColor: this.color() == "w" ? this.cellService.whiteCellColor() : this.cellService.blackCellColor(),
      title: "Choose " + (this.color() == 'w' ? "white" : 'black') + " cell color"
    }
    this.popupDialogService.startDialog<ColorPickerDialogComponent, string>(
      ColorPickerDialogComponent,
      data,
      (color) => {
        this.cellService.setChessboardCellsColor(this.color(), color)
      }
    )


  }
}
