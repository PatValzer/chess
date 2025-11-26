import { Component, computed, inject, input, InputSignal } from '@angular/core';
import { PieceTypePipe } from "../../pipes/piece-type-pipe";
import { PieceColorPipe } from "../../pipes/piece-color-pipe";
import { Piece } from '../../models/Piece';
import { ChessboardService } from '../../../services/chessboard.service';

@Component({
  selector: 'app-piece',
  imports: [PieceTypePipe, PieceColorPipe],
  templateUrl: './piece.html',
  styleUrl: './piece.scss',
})
export class PieceComponent {
  chessboardService = inject(ChessboardService)
  piece: InputSignal<Piece> = input.required()  
  selected : InputSignal<boolean> = input.required()

}
