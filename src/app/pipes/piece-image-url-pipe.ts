import { inject, Pipe, PipeTransform } from '@angular/core';
import { Piece } from '../chessboard/models/Piece';
import { ChessboardService } from '../services/chessboard.service';
import { PieceService } from '../services/piece-service';

@Pipe({
  name: 'pieceImageUrl',
  pure: false,
})
export class PieceImageUrlPipe implements PipeTransform {
  pieceService = inject(PieceService);

  transform(value: Piece): string {
    return `assets/pieces/${this.pieceService.selectedPieceSet()}/${value.pieceColor}-${value.pieceSymbol}.png`;
  }
}
