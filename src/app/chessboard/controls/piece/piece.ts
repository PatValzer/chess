import { Component, computed, inject, input, InputSignal } from '@angular/core';
import { PieceTypePipe } from '../../../pipes/piece-type-pipe';
import { PieceColorPipe } from '../../../pipes/piece-color-pipe';
import { Piece } from '../../models/Piece';
import { ChessboardService } from '../../../services/chessboard.service';
import { PieceImageUrlPipe } from '../../../pipes/piece-image-url-pipe';
import { PieceService } from '../../../services/piece-service';

@Component({
  selector: 'app-piece',
  imports: [PieceColorPipe, PieceImageUrlPipe],
  templateUrl: './piece.html',
  styleUrl: './piece.scss',
})
export class PieceComponent {
  pieceService = inject(PieceService);
  chessboardService = inject(ChessboardService);
  piece: InputSignal<Piece> = input.required();
  selected: InputSignal<boolean> = input.required();
}
