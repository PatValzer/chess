import { Component, computed, inject, input, InputSignal, untracked } from '@angular/core';
import { GameManagerService } from '../../../services/game-manager-service';
import { COLORS } from '../../../chessboard/COLORS';
import { Piece } from '../../../chessboard/models/Piece';
import { PieceSymbol } from 'chess.js';
import { PieceComponent } from '../../../chessboard/controls/piece/piece';

@Component({
  selector: 'app-eaten-pieces',
  templateUrl: './eaten-pieces.html',
  styleUrls: ['./eaten-pieces.scss'],
  imports: [PieceComponent],
})
export class EatenPiecesComponent {
  private gameManagerService = inject(GameManagerService);
  color: InputSignal<COLORS> = input.required();
  chess = computed(() => this.gameManagerService.chess);

  private allEatenPieces = computed(() => {
    if (this.gameManagerService.currentMoveIndex() > 0) {
      const capturedPieces: Piece[] = [];
      return untracked(() => {
        const captured = this.chess()
          .history({ verbose: true })
          .filter((s) => s.captured);
        captured.forEach((captureMove) => {
          let getPiece = () => {
            // Determine color of captured piece (opposite of mover)
            const color = captureMove.color == 'w' ? 'b' : 'w';
            const p = new Piece(color, captureMove.captured as PieceSymbol);
            return p;
          };
          const piece = getPiece();
          capturedPieces.push(piece);
        });
        return capturedPieces;
      });
    }
    return [];
  });

  eatenPieces = computed(() => {
    return this.allEatenPieces().filter((s) => s.pieceColor != this.color());
  });
}
