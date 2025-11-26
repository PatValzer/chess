import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { GameManagerService } from '../../../services/game-manager-service';
import { HttpClient } from '@angular/common/http';
import { PositionAnalysis, WinProbabilityBar } from "../win-probability-bar/win-probability-bar";
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { OpeningService } from '../../../services/opening-service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PopupDialogService } from '../../../services/popup-dialog-service';
import { OpeningDetailsDialog } from '../../../opening-tree/opening-details-dialog/opening-details-dialog';
import { Opening } from '../../models/Opening';
import { Chess } from 'chess.js';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap, finalize, catchError, of } from 'rxjs';

// Define Opening type if not imported from elsewhere


export class Games {
  white: number = 0
  black: number = 0
  draws: number = 0
}

// Define NextMove type if not imported from elsewhere
export class NextMove extends Games {
  san?: string; // Standard Algebraic Notation for the move
  uci?: string;
  opening?: Opening | null;

};

export class GameExplorer extends Games {
  opening?: Opening
  moves: NextMove[] = []

}

@Component({
  selector: 'app-games-library',
  templateUrl: './games-library.html',
  styleUrl: './games-library.scss',
  imports: [WinProbabilityBar, MatButtonModule, MatIcon, MatTooltipModule]
})
export class GamesLibrary {
  showOpeningDetails(opening: Opening) {
    console.log(opening, this.gameExplorer()?.moves)
    const data = {
      opening: opening,
      title: opening.name + " details"
    }
    this.popupDialogService.startDialog(
      OpeningDetailsDialog,
      data,
      (loadOpeningInChessBoard: boolean) => {
        if (loadOpeningInChessBoard) {
          this.gameManagerService.reset()
          opening.moves.forEach(
            (move) => {
              this.gameManagerService.move(move)
            }
          )
        }
      }
    )


  }
  popupDialogService = inject(PopupDialogService)
  gameManagerService = inject(GameManagerService)
  httpClient = inject(HttpClient)

  /** Return normalized display probabilities */
  display: Signal<PositionAnalysis> = computed(
    () => {
      return this.getPositionAnalysis(this.gameExplorer());
    }
  )

  loadingGames = signal(false)




  gameExplorer: WritableSignal<GameExplorer | null> = signal(null)


  retrieveGamesFromLichessEffect = effect(
    () => {
      if (this.gameManagerService.currentMoveIndex() >= 0) {
        this.loadingGames.update(s => true)
        this.gameExplorer.set(null)

        this.httpClient.get<GameExplorer>('https://explorer.lichess.ovh/lichess?fen=' + this.gameManagerService.chess.fen() + '&moves=15&topGames=5').
          subscribe(
            (gameExplorer) => {
              if (gameExplorer) {
                gameExplorer.moves.forEach(
                  (nextMove) => {
                    const chess = new Chess()
                    this.gameManagerService.moves().forEach
                      (
                        (move, index) => {
                          if (index < this.gameManagerService.currentMoveIndex())
                            chess.move(move)
                        }
                      )
                    chess.move(nextMove.san!)
                    nextMove.opening = this.openingService.bookOpening(chess.fen())
                  }
                )
              }
              this.gameExplorer.update(games => gameExplorer)
              this.loadingGames.update(s => false)
            }
          )





        // this.httpClient
        //   .get('https://explorer.lichess.ovh/lichess?fen=' + this.gameManagerService.chess.fen() + '&moves=15&topGames=5')
        //   .subscribe(
        //     games => {
        //       const gameExplorer = games as GameExplorer
        //       gameExplorer.moves.forEach(
        //         (nextMove) => {
        //           const chess = new Chess()
        //           this.gameManagerService.moves().forEach
        //             (
        //               (move, index) => {
        //                 if (index < this.gameManagerService.currentMoveIndex())
        //                   chess.move(move)
        //               }
        //             )
        //           chess.move(nextMove.san!)
        //           nextMove.opening = this.openingService.bookOpening(chess.fen())
        //         }
        //       )
        //       this.gameExplorer.update(games => gameExplorer)

        //       this.loadingGames.update(s => false)
        //     }
        //   )
      }
    }
  )
  openingService = inject(OpeningService)



  getPositionAnalysis(games?: Games | null) {
    const w = Math.max(0, games?.white ?? 0);
    const d = Math.max(0, games?.draws ?? 0);
    const b = Math.max(0, games?.black ?? 0);
    const s = w + d + b || 1;
    return { whiteWinProbability: w / s, drawProbability: d / s, blackWinProbability: b / s };
  }

  doMove(move: NextMove) {

    if (move.san) {
      this.gameManagerService.move(move.san)
    }
  }

}
