import { ColumnLetter, RowNumber } from "../../services/chessboard.service";

export class Coordinates {
  constructor(
    public column?: ColumnLetter,
    public row?: RowNumber
  ) {
  }

  public toString = (): string => {
    return `${this.column}${this.row}`;
  }

  public equals = (other: Coordinates | null | undefined): boolean => {
    return other != null && this.row === other?.row && this.column === other.column;
  }
}
