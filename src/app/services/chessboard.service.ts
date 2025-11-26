// Service for managing chessboard state, cells, and player pieces
import { Injectable, signal, ViewContainerRef, WritableSignal } from '@angular/core';
import { Square } from '../chessboard/models/Square';
import { Piece } from '../chessboard/models/Piece';
import { COLORS } from '../chessboard/COLORS';
import { PieceSymbol } from 'chess.js';


export type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type ColumnLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'

@Injectable({
  providedIn: 'root'
})
export class ChessboardService {

  cells: WritableSignal<Square>[][] = []
  selectedPieceSquare = signal<Square | null>(null);

  readonly whitePieceColor = signal<string>("#FFFFFF")
  readonly blackPieceColor = signal<string>("rgb(90 90 90)")

  // Board columns and rows
  columns: ColumnLetter[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']


  constructor() {
    this.inizializeChessboard()
  }


  displayFenPosition(fen: string) {
    if (this.cells.length) {
      this.parseFEN(fen)
    }
  }


  setPiecesColor(colorFrom: COLORS, colorDestination: string) {
    if (colorFrom == "w") {
      this.whitePieceColor.set(colorDestination)
    } else {
      this.blackPieceColor.set(colorDestination)
    }
  }


  private rows: RowNumber[] = [1, 2, 3, 4, 5, 6, 7, 8,]


  /**
   * Parse a FEN string into an array of 64 cells with piece info.
   */
  private parseFEN(fen: string) {
    const [boardPart] = fen.split(" ");
    const rows = boardPart.split("/");

    for (let r = 0; r < 8; r++) {
      const row = rows[r];
      let fileIndex = 0;
      for (const char of row) {

        if (Number.isInteger(Number(char))) {
          // Empty squares
          const emptyCount = Number(char);
          for (let i = 0; i < emptyCount; i++) {
            const cell = this.cells[r][fileIndex]
            cell.update(
              (square) => {
                square.piece.set(null)
                return square
              }
            )
            fileIndex++;

          }
        } else {
          // Piece
          const cell = this.cells[r][fileIndex]
          cell.update(
            (square) => {
              square.piece.set(
                new Piece(
                  char === char.toUpperCase() ? "w" : "b",
                  char.toLowerCase() as PieceSymbol,
                )
              )
              return square
            }
          )
          fileIndex++;
        }
      }
    }

  }


  /**
   * Create cell signals for each board position
   * Suggestion: Optimize for performance by using a matrix instead of flat array
   */
  private inizializeChessboard() {
    this.rows.reverse().forEach(
      (row, rowIndex) => {
        this.cells[rowIndex] = []
        this.columns.forEach(
          (column) => {
            let cell = signal(new Square(column, row))
            this.cells[rowIndex].push(cell)

          }
        )
      }
    )
  }

}
