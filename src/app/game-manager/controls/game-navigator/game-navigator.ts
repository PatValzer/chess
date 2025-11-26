import { Component, inject } from '@angular/core';
import { GameManagerService } from '../../../services/game-manager-service';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-game-navigator',
  imports: [MatInputModule, MatButton, MatIconModule],
  templateUrl: './game-navigator.html',
  styleUrl: './game-navigator.scss'
})
export class GameNavigator {
  gameManagerService = inject(GameManagerService)
}
