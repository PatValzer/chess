import { Pipe, PipeTransform } from '@angular/core';
import { PieceSymbol } from 'chess.js';
import { PieceType } from '../chessboard/models/PieceType';

@Pipe({
  name: 'pieceTypePipe'
})
export class PieceTypePipe implements PipeTransform {

  transform(pieceSymbol?: PieceSymbol): PieceType | null {
    switch (pieceSymbol) {
      case 'p': return PieceType.PAWN;
      case 'n': return PieceType.KNIGHT;
      case 'b': return PieceType.BISHOP;
      case 'r': return PieceType.TOWER;
      case 'q': return PieceType.QUEEN;
      case 'k': return PieceType.KING;
      default: return null;
    }
  }

}
