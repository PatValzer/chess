import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GameManagerService } from '../services/game-manager-service';
import { ChessboardService } from '../services/chessboard.service';
import { ColorPickerDialogComponent } from '../shared/color-picker-dialog';
import { OpeningService } from '../services/opening-service';
import { PopupDialogService } from '../services/popup-dialog-service';
import { OpeningDetailsDialog } from '../opening-tree/opening-details-dialog/opening-details-dialog';
import { OpenAIService } from '../services/openai.service';
import { CellColorPipe } from '../pipes/piece-color-pipe';
import { Piece } from 'chess.js';
import { BreakpointService } from '../services/breakpoint-service';
import { COLORS } from '../chessboard/COLORS';

import { OptionsComponent } from './options/options';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-chess-toolbar',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatMenuModule,
    CellColorPipe,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './chess-toolbar.html',
  styleUrl: './chess-toolbar.scss',
})
export class ChessToolbar {
  openAiService = inject(OpenAIService);
  openingService = inject(OpeningService);
  gameManagerService = inject(GameManagerService);
  chessboardService = inject(ChessboardService);
  popupDialogService = inject(PopupDialogService);
  breakpointService = inject(BreakpointService);
  dialog = inject(MatDialog);

  openOptions() {
    this.dialog.open(OptionsComponent);
  }

  chess = computed(() => {
    return this.gameManagerService.chess;
  });

  currentOpening = computed(this.openingService.currentOpening);

  setApiKey($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    const apiKey = inputElement.value;
    this.openAiService.apiKey.set(apiKey);
  }

  showOpeningDetails() {
    const data = {
      opening: this.currentOpening(),
      title: this.currentOpening()?.name + ' details',
    };
    this.popupDialogService.startDialog(
      OpeningDetailsDialog,
      data,
      (loadOpeningInChessBoard: boolean) => {
        if (loadOpeningInChessBoard) {
          this.gameManagerService.reset();
          this.currentOpening()?.moves.forEach((move) => {
            this.gameManagerService.move(move);
          });
        }
      },
    );
  }

  exportFen() {
    const fen = this.gameManagerService.chess.fen();
    alert(fen);
  }

  toggleEnablePcPlayer(color: string) {
    color == 'w'
      ? this.gameManagerService.whitePcPlayerEnabled.set(
          !this.gameManagerService.whitePcPlayerEnabled(),
        )
      : this.gameManagerService.blackPcPlayerEnabled.set(
          !this.gameManagerService.blackPcPlayerEnabled(),
        );
  }

  importFen = output<string>();
  toggleMoveList = output<boolean>();
  resetGame = output<boolean>();
  hint = output<void>();
  requestDraw = output<void>();
  resign = output<void>();

  // local UI state
  moreOpen = false;

  // Methods to trigger outputs
  flipBoard() {
    this.chessboardService.flipBoard();
  }

  emitImportFen(fen: string) {
    if (fen) this.importFen.emit(fen.trim());
  }
  emitToggleMoveList(show: boolean) {
    this.toggleMoveList.emit(show);
  }
  emitToggleResetGame(visible: boolean) {
    this.resetGame.emit(visible);
  }
  emitHint() {
    this.hint.emit();
  }
  emitRequestDraw() {
    this.requestDraw.emit();
  }
  emitResign() {
    this.resign.emit();
  }
}
