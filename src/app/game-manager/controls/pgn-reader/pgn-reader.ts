import { Component, inject } from '@angular/core';
import { GameManagerService } from '../../../services/game-manager-service';
import { PgnService } from '../../../services/pgn-service';

@Component({
  selector: 'app-pgn-reader',
  templateUrl: './pgn-reader.html',
  styleUrl: './pgn-reader.scss'
})
export class PgnReader {
  gameManagerService = inject(GameManagerService)
  pgnService = inject(PgnService) 
}
