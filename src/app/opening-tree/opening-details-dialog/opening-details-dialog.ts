import { Component, computed, effect, inject, Inject, signal, WritableSignal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Opening } from '../../game-manager/models/Opening';
import { Chessboard } from "../../chessboard/chessboard";
import { GameManagerService } from '../../services/game-manager-service';
import { ChessboardService } from '../../services/chessboard.service';
import { GameNavigator } from "../../game-manager/controls/game-navigator/game-navigator";
import { GameMoves } from "../../game-manager/controls/game-moves/game-moves";
import { MatButtonModule } from '@angular/material/button';
import { OpeningService } from '../../services/opening-service';
import { OpenAIService } from '../../services/openai.service';

@Component({
  selector: 'app-opening-details-dialog',
  imports: [MatDialogModule, Chessboard, GameNavigator, GameMoves, MatButtonModule],
  templateUrl: './opening-details-dialog.html',
  styleUrl: './opening-details-dialog.scss',
  providers: [GameManagerService, ChessboardService]
})
export class OpeningDetailsDialog {

  cleanExplanation = computed(
    () => {
      return this.aiOpeningExplanationHtml().replace("```html", "").replace("```", "")
    }
  )

  aiOpeningExplanationHtml = signal('')

  openAiService = inject(OpenAIService)

  get opening() { return this.data.opening }

  constructor(
    public dialogRef: MatDialogRef<OpeningDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { opening: Opening, title?: string },
  ) {
    this.gameManagerService.mainChessBoard = false
    this.opening.moves.forEach(move => {
      this.gameManagerService.move(move)
    });
    if (localStorage.getItem(this.opening.pgn) != null) {
      this.aiOpeningExplanationHtml.update(s => localStorage.getItem(this.opening.pgn)!)
    }
    else {
      this.openAiService.chat("this is the opening pgn i want you to analyze: " + this.opening.pgn).subscribe(
        (result) => {
          let response = result.choices?.[0]?.message?.content || 'No response';
          this.aiOpeningExplanationHtml.update(s => response)
          localStorage.setItem(this.opening.pgn, response)
        }
      )
    }
  }

  gameManagerService = inject(GameManagerService)


  loadGame() {
    this.dialogRef.close(true);

  }
}
