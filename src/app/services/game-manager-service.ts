// Angular and chess.js imports for chess logic, UI, and engine integration
import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { Chess, Move } from 'chess.js';
import { ChessboardService } from './chessboard.service';
import { COLORS } from '../chessboard/COLORS';
import { StockfishService } from './stockfish-service';
import { OpeningService } from './opening-service';
import { Square } from '../chessboard/models/Square';
import { Piece } from '../chessboard/models/Piece';
import { PromotionDialog } from '../chessboard/controls/promotion-dialog/promotion-dialog';
import { PopupDialogService } from './popup-dialog-service';
import { NextMove } from '../game-manager/controls/games-library/games-library';
import { Opening } from '../game-manager/models/Opening';
import { CountdownService } from './countdown-service';


@Injectable({
  providedIn: 'root'
})
// Main service for managing chess game state, moves, and engine integration
export class GameManagerService {


  mainChessBoard = true
  // Inject Stockfish chess engine service
  private stockfish = inject(StockfishService)
  private chessboardService = inject(ChessboardService)
  private openingService = inject(OpeningService)
  private popupDialogService = inject(PopupDialogService)
  private countDownService = inject(CountdownService)

  // Tracks the current move index for navigation
  currentMoveIndex = signal(0);
  moves = signal<Move[]>([]);
  enablePcPlayer = signal(false);

  // Chess.js instance for board state
  chess = new Chess()

  currentTurn = computed<COLORS>(
    () => {
      if (this.currentMoveIndex() > 0)
        return this.chess.turn() as COLORS
      return 'w'
    }
  )

  // bookOpening(nextMove: NextMove): Opening {
  //   // const chess = new Chess()
  //   // chess.load(this.chess.fen())
  //   // chess.move(nextMove.san!)

  //   const result = this.openingService
  //     .openings()
  //     .find(
  //       s => s.eco == nextMove.opening?.eco && s.name == nextMove.opening.name
  //     )
  //     // .sort((a, b) => a.moves.length < b.moves.length ? -1 : 1)[0]
  //   //console.log(moveNumber, result, chess.fen())
  //   return result!
  // }

  private currentOpening = computed(
    () => {
      if (this.currentMoveIndex() > 0 && this.mainChessBoard) {
        const openings = untracked(() => this.openingService.openings())
        if (openings.length > 0) {
          const positionFEN = this.chess.fen()
          return openings.filter(s => s.fen == positionFEN)[0]
        }
      }
      return null
    }
  )

  private gameFinished = computed<string | null>(
    () => {
      if (this.currentMoveIndex() >= 0) {
        if (this.chess.isDraw()) {
          if (this.chess.isStalemate()) {
            return "Game over: Stalemate (Draw)"
          }
          if (this.chess.isThreefoldRepetition()) {
            return "Game over: Threefold Repetition (Draw)"
          }
          if (this.chess.isInsufficientMaterial()) {
            return "Game over: Insufficient Material (Draw)"
          }
        }
        if (this.chess.isCheckmate()) {
          const winner: string = this.chess.turn() === 'w' ? 'Black' : 'White';
          return `Game over: Checkmate! ${winner} wins.`;
        }
      }
      return null
    }
  )

  private currentOpeningChangeEffect = effect(
    () => {
      const newOpening = this.currentOpening()
      if (newOpening) {
        this.openingService.currentOpening.update(s => s = newOpening)
      }
    }
  )

  private displayFenPositionEffect = effect(
    () => {
      if (this.gameFinished())
        alert(this.gameFinished())

      if (this.currentMoveIndex() >= 0) {
        this.chessboardService.displayFenPosition(this.chess.fen())
      }
    }
  )

  private stockFishEffect = effect(
    () => {
      if (this.currentMoveIndex() >= 0 && !this.gameFinished()) {
        this.stockfish.currentTurn.set(this.currentTurn())
        this.stockfish.setPosition(this.chess.fen());
        //this.stockfish.go(this.currentTurn() == 'w' ? 1 : 15); // Depth 15 analysis
        this.stockfish.go(15); // Depth 15 analysis
      }
    }
  )

  private isPromotion(selectedPieceSquare: Square, destinationCell: Square) {
    if (selectedPieceSquare.piece()?.pieceSymbol == 'p') {
      if (destinationCell.coordinates.row == 1 || destinationCell.coordinates.row == 8)
        return true
    }
    return false
  }

  reviewMode = computed(
    () => {
      return this.currentMoveIndex() < this.moves().length
    }
  )

  allowedDestinationCellsForSelectedPiece = computed(
    () => {
      const selectedPieceSquare = this.chessboardService.selectedPieceSquare()
      if (selectedPieceSquare != null) {
        const selectedPieceCoordinates = selectedPieceSquare?.coordinates.toString()
        const allowedMoves = this.chess.moves({ verbose: true, square: selectedPieceCoordinates as any })
        const fromTO = allowedMoves.map(s => s.to)
        const allowedCells = this.chessboardService.cells.flatMap(s => s).filter(s => fromTO.join('').includes(s().coordinates.toString())).map(s => s())
        return allowedCells;
      }
      return []
    }
  )

  // possibleMoves = computed(
  //   () => {
  //     const currentTurn = this.currentTurn()
  //     const allowedMoves = this.chess.moves({ verbose: true })
  //     // this.openingService.openingTree().  
  //     console.log(allowedMoves)
  //     return allowedMoves
  //   }
  // )


  movePiece(selectedPieceSquare: Square, destinationCell: Square) {
    if (!this.reviewMode()) {
      const selectedPieceCoordinates = selectedPieceSquare.coordinates
      const destinationCellCoordinates = destinationCell.coordinates

      const move = {
        from: selectedPieceCoordinates.toString(),
        to: destinationCellCoordinates.toString()
      } as Move

      if (this.isPromotion(selectedPieceSquare, destinationCell)) {
        const data = {
          currentColor: "w",
          title: "Choose piece"
        }
        this.popupDialogService.startDialog<PromotionDialog, Piece>(
          PromotionDialog,
          data,
          (piece) => {
            move.promotion = piece.pieceSymbol
            this.move(move)
          }
        )
      }
      else {
        this.move(move)
      }
    }
    this.chessboardService.selectedPieceSquare.set(null)
  }

  /**
   * Reset the game to the initial position
   */
  reset() {
    this.chess.reset();
    this.moves.set([]);
    this.currentMoveIndex.set(0);
    this.openingService.currentOpening.update(s => null)
    this.countDownService.reset();
    // this.co
  }







  /**
   * Go to a specific move index in the game history
   * @param index - Move index to go to
   */
  goToMove(index: number) {
    this.chess.reset(); // reset to starting position

    for (let i = 0; i <= index; i++) {
      this.chess.move(this.moves()[i]);
    }
    this.currentMoveIndex.set(index + 1)
  }



  /**
   * Undo the last move and update state
   */
  prevMove() {
    if (this.currentMoveIndex() > 0) {
      this.goToMove(this.currentMoveIndex() - 2)
    }
  }

  /**
   * Advance to the next move in the move list
   */
  nextMove() {
    if (this.currentMoveIndex() < this.moves().length) {
      this.goToMove(this.currentMoveIndex())
    }
  }

  undoMove() {
    const move = this.chess.undo()
    console.log("Undo move " + move?.lan)
    this.currentMoveIndex.set(this.currentMoveIndex() - 1)
    this.moves.set(this.chess.history({ verbose: true }))
  }


  move(
    moveCoordinates: string |
    {
      from: string;
      to: string;
      promotion?: string;
    }
  ) {
    const currentTurn = this.currentTurn()
    if (this.chess.turn() == currentTurn) {
      const legalMoves = this.chess.moves({ verbose: true });
      let destinationMoves = typeof moveCoordinates === 'string' ?
        legalMoves.filter(m => m.lan === moveCoordinates || m.san == moveCoordinates) :
        legalMoves.filter(
          m => m.from === moveCoordinates.from && m.to === moveCoordinates.to
        );
      const isValid = destinationMoves.length > 0

      // console.log("Legal moves:", legalMoves)
      console.log(moveCoordinates, isValid ? '✅' : '❌', this.chess.turn())

      if (isValid) {

        if (destinationMoves.length == 1) {
          this.chess.move(destinationMoves[0])
        }
        else {
          if (typeof moveCoordinates !== 'string') {
            const move = destinationMoves.find(s => s.promotion == (moveCoordinates as Move).promotion)
            this.chess.move(move as Move)
          }

        }
        this.moves.set(this.chess.history({ verbose: true }))
        this.chessboardService.selectedPieceSquare.set(null);
        this.currentMoveIndex.set(this.currentMoveIndex() + 1)
      }
    }
  }

}

