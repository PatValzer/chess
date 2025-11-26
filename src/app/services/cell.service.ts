import { Injectable, signal } from '@angular/core';
import { COLORS } from '../chessboard/COLORS';

@Injectable({
  providedIn: 'root',
})
export class CellService {
  readonly whiteCellColor = signal<string>("#fbf5de")
  readonly blackCellColor = signal<string>("#600")

  setChessboardCellsColor(colorFrom: COLORS, colorDestination: string) {
    if (colorFrom == "w") {
      this.whiteCellColor.set(colorDestination)
    } else {
      this.blackCellColor.set(colorDestination)
    }
  }
}
