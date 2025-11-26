import { Component, inject, input } from '@angular/core';
import { GameManagerService } from '../../../services/game-manager-service';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-game-moves',
  imports: [MatButton, MatInputModule, TextFieldModule],
  templateUrl: './game-moves.html',
  styleUrl: './game-moves.scss'
})
export class GameMoves {
  gameManagerService = inject(GameManagerService)
  horizontal = input<boolean>(false); // default = false
}
