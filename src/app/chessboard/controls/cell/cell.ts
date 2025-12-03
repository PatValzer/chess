// Component for individual chessboard cell UI and logic
import { Component, computed, inject, input, InputSignal, Signal, untracked } from '@angular/core';
import { ChessboardService } from '../../../services/chessboard.service';
import { GameManagerService } from '../../../services/game-manager-service';
import { Square } from '../../models/Square';
import { CellColorPipe, PieceColorPipe } from '../../../pipes/piece-color-pipe';
import { PieceComponent } from '../piece/piece';
import { CdkDragDrop, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { PieceTypePipe } from '../../../pipes/piece-type-pipe';

@Component({
  selector: 'app-cell',
  imports: [CellColorPipe, PieceComponent, DragDropModule, PieceTypePipe, PieceColorPipe],
  templateUrl: './cell.html',
  styleUrl: './cell.scss',
})
export class CellComponent {
  // Inject services for board and game management
  private chessboardService = inject(ChessboardService);
  private gameManagerService = inject(GameManagerService);

  // Signal for the cell's Square data
  cell: InputSignal<Square> = input.required();

  selectedPiece = computed(() => this.selectedSquare()?.piece());

  selectedSquare = computed(() => this.chessboardService.selectedSquare());

  opacity = computed(() => {
    if (this.availableDestination()) {
      return this.cell().displayColor == 'w' ? 0.7 : 0.8;
    }

    if (this.lastMoveFrom() || this.lastMoveTo()) {
      return 0.6;
    }
    return this.cell().displayColor == 'w' ? 1 : 0.7;
  });

  boxShadow = computed(() => {
    const baseStyle = 'inset 0 0 0 ';
    let baseWidth = 1;
    let color = 'black';

    if (this.lastMoveFrom() || this.lastMoveTo()) {
      baseWidth = 3;
      color = 'green';
    }

    if (this.availableDestination()) {
      baseWidth = 3;
      color = 'red';
    }

    return baseStyle + baseWidth + 'px ' + color;
  });

  allDropListIds = computed(() => {
    const result = this.chessboardService.cells
      .flat()
      .map((cell) => `cell-${cell().coordinates.toString()}`);
    return result;
  });
  previewSize: number = 0;

  drop($event: CdkDragDrop<Square, Square, Square>) {
    const pieceCell = $event.item.data;
    const destinationeCell = $event.container.data;
    this.gameManagerService.movePiece(pieceCell, destinationeCell);
  }

  private lastMove = computed(() => {
    const currentMoveIndex = this.gameManagerService.currentMoveIndex();
    if (currentMoveIndex > 0) {
      const moves = untracked(() => this.gameManagerService.moves());
      return moves[currentMoveIndex - 1];
    }
    return null;
  });

  private lastMoveFrom = computed(() => {
    const lastMove = this.lastMove();
    const cell = untracked(() => this.cell());
    return lastMove?.from == cell.coordinates.toString();
  });

  private lastMoveTo = computed(() => {
    const lastMove = this.lastMove();
    const cell = untracked(() => this.cell());
    return lastMove?.to == cell.coordinates.toString();
  });

  /**
   * Computed property to check if this cell is a valid destination for the selected piece
   * Suggestion: Use for highlighting available moves
   */
  private availableDestination = computed(() => {
    const isAllowedCell = this.gameManagerService
      .allowedDestinationCellsForSelectedPiece()
      .find((s) => s.coordinates.equals(this.cell().coordinates));
    return isAllowedCell != null;
  });

  onDragStart($event: CdkDragStart<Square>) {
    this.chessboardService.selectedSquare.update((s) => $event.source.data);
    const el = $event.source.element.nativeElement as HTMLElement;
    this.previewSize = el.clientWidth;
    console.log('Drag started, preview size:', this.previewSize);
  }

  cellClick($event: PointerEvent) {
    if (
      this.selectedSquare() &&
      !this.selectedSquare()?.coordinates.equals(this.cell().coordinates)
    ) {
      const selectedSquare = this.selectedSquare as Signal<Square>;
      if (this.availableDestination()) {
        this.gameManagerService.movePiece(selectedSquare(), this.cell());
      } else this.chessboardService.selectedSquare.set(null);
    } else if (this.cell().piece()) {
      this.chessboardService.selectedSquare.set(this.cell());
    }
  }
}
