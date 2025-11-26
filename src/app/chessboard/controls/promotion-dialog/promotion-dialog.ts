import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ColorPickerDialogComponent } from '../../../shared/color-picker-dialog';
import { PieceComponent } from "../piece/piece";
import { Piece } from '../../models/Piece';
import { COLORS } from '../../COLORS';
import { PieceSymbol } from 'chess.js';

@Component({
  selector: 'app-promotion-dialog',
  imports: [PieceComponent, MatDialogModule],
  templateUrl: './promotion-dialog.html',
  styleUrl: './promotion-dialog.scss',
})
export class PromotionDialog {
  closeDialog(piece: Piece) {
    this.dialogRef.close(piece);
  }
  constructor(
    public dialogRef: MatDialogRef<PromotionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { currentColor: COLORS, title?: string }
  ) {
    const color = this.data.currentColor
    const pieces: PieceSymbol[] = ['b', 'n', 'r', 'q']
    this.pieces = pieces.map((pieceSymbol) => new Piece(color, pieceSymbol))
  }

  pieces: Piece[] = []


}
