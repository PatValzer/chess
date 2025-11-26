import { signal, WritableSignal } from '@angular/core';
import { COLORS } from '../COLORS';
import { Coordinates } from './Coordinates';
import { Piece } from './Piece';
import { RowNumber, ColumnLetter } from '../../services/chessboard.service';



export class Square {
  public piece: WritableSignal<Piece | null> = signal(null);
  public displayColor: COLORS
  public coordinates: Coordinates

  constructor(
    column: ColumnLetter,
    row: RowNumber
  ) {

    this.coordinates = new Coordinates(column, row)
    const evenColumn = column === 'b' || column === 'd' || column === 'f' || column === 'h';
    const evenRow = ((row ?? 0) % 2) === 0;
    const color = (evenColumn && evenRow) || (!evenColumn && !evenRow) ? 'w' : 'b';
    this.displayColor = color;
  }

}
