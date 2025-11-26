import { COLORS } from '../COLORS';


type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export class Piece {

  constructor(
    public pieceColor: COLORS,
    public pieceSymbol: PieceSymbol ) {
  }
}
