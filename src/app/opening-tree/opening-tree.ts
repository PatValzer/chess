import { Component, computed, inject, input, InputSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { GameManagerService } from '../services/game-manager-service';
import { OpenAIService } from '../services/openai.service';
import { OpeningTreeNode } from '../game-manager/models/OpeningTreeNode';
import { Opening } from '../game-manager/models/Opening';
import { PopupDialogService } from '../services/popup-dialog-service';
import { OpeningDetailsDialog } from './opening-details-dialog/opening-details-dialog';
import { MatLabel } from '@angular/material/input';
import { OpeningService } from '../services/opening-service';




@Component({
  selector: 'app-opening-tree',
  imports: [MatTreeModule, MatIconModule, MatButtonModule],
  templateUrl: './opening-tree.html',
  styleUrl: './opening-tree.scss',
})
export class OpeningTreeComponent {

  popupDialogService = inject(PopupDialogService)
  gameManagerService = inject(GameManagerService)
  openingService = inject(OpeningService)


  openings: InputSignal<OpeningTreeNode[]> = input.required<OpeningTreeNode[]>();

  showOpeningDetails(opening: OpeningTreeNode) {
    const data = {
      opening: opening.mainLine,
      title: opening.mainLine.name + " details"
    }
    this.popupDialogService.startDialog(
      OpeningDetailsDialog, data,
      (loadOpeningInChessBoard: boolean) => {
        if (loadOpeningInChessBoard) {
          this.gameManagerService.reset()
          opening.mainLine.moves.forEach(
            (move) => {
              this.gameManagerService.move(move)
            }
          )
        }
      })

  }


  readonly childrenAccessor = (node: OpeningTreeNode) => node.children ?? [];

  readonly hasChild = (node: OpeningTreeNode) => !node.isLeaf;




}
