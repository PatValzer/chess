// Service for managing chessboard state, cells, and player pieces
import { Injectable, signal, ViewContainerRef, WritableSignal } from '@angular/core';
import { Square } from '../chessboard/models/Square';
import { Piece } from '../chessboard/models/Piece';
import { COLORS } from '../chessboard/COLORS';
import { PieceSymbol } from 'chess.js';
import { Coordinates } from '../chessboard/models/Coordinates';

export type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ColumnLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

@Injectable({
  providedIn: 'root',
})
export class ChessboardService {
  cells: WritableSignal<Square>[][] = [];
  selectedSquare = signal<Square | null>(null);

  readonly whitePieceColor = signal<string>('#FFFFFF');
  readonly blackPieceColor = signal<string>('rgb(90 90 90)');

  // Board columns and rows
  columns: ColumnLetter[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  constructor() {
    this.inizializeChessboard();
  }

  flipBoard() {
    this.columns.reverse();
    this.cells.reverse();
    this.cells.forEach((row) => row.reverse());
  }

  displayFenPosition(fen: string) {
    if (this.cells.length) {
      this.parseFEN(fen);
    }
  }

  setPiecesColor(colorFrom: COLORS, colorDestination: string) {
    if (colorFrom == 'w') {
      this.whitePieceColor.set(colorDestination);
    } else {
      this.blackPieceColor.set(colorDestination);
    }
  }

  private rows: RowNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];

  /**
   * Parse a FEN string into an array of 64 cells with piece info.
   */
  private parseFEN(fen: string) {
    const [boardPart] = fen.split(' ');
    const rows = boardPart.split('/');
    const columns: ColumnLetter[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    for (let r = 0; r < 8; r++) {
      const row = rows[r];
      let fileIndex = 0;

      for (const char of row) {
        if (Number.isInteger(Number(char))) {
          // Empty squares
          const emptyCount = Number(char);
          fileIndex = this.setEmptyCells(emptyCount, columns, fileIndex, r);
        } else {
          // Piece
          const coordinates = new Coordinates(columns[fileIndex], this.rows[r]);
          const pieceColor = char === char.toUpperCase() ? 'w' : 'b';
          const piece = new Piece(pieceColor, char.toLowerCase() as PieceSymbol);

          this.updateCellContent(piece, coordinates);
          fileIndex++;
        }
      }
    }
  }

  private setEmptyCells(emptyCount: number, columns: ColumnLetter[], fileIndex: number, r: number) {
    for (let i = 0; i < emptyCount; i++) {
      const coordinates = new Coordinates(columns[fileIndex], this.rows[r]);
      this.updateCellContent(null, coordinates);
      fileIndex++;
    }
    return fileIndex;
  }

  private updateCellContent(piece: Piece | null, coordinates: Coordinates) {
    const cell = this.cells.flatMap((s) => s).find((s) => s().coordinates.equals(coordinates));

    cell?.update((square) => {
      square.piece.set(piece);
      return square;
    });
  }

  /**
   * Create cell signals for each board position
   * Suggestion: Optimize for performance by using a matrix instead of flat array
   */
  private inizializeChessboard() {
    this.rows.reverse().forEach((row, rowIndex) => {
      this.cells[rowIndex] = [];
      this.columns.forEach((column) => {
        let cell = signal(new Square(column, row));
        this.cells[rowIndex].push(cell);
      });
    });
  }
}
