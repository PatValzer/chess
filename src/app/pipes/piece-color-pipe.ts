import { inject, Pipe, PipeTransform } from '@angular/core';
import { COLORS } from '../chessboard/COLORS';
import { ChessboardService } from '../services/chessboard.service';
import { CellService } from '../services/cell.service';

@Pipe({
  name: 'pieceColorPipe',
  pure: false
})
export class PieceColorPipe implements PipeTransform {
  chessBoardService = inject(ChessboardService)

  transform(value: COLORS | undefined): string {
    return value == 'w' ? this.chessBoardService.whitePieceColor() : this.chessBoardService.blackPieceColor()
  }

}

@Pipe({
  name: 'cellColorPipe',
  pure: false
})
export class CellColorPipe implements PipeTransform {
  cellService = inject(CellService)



  transform(value: COLORS | undefined, opacity: number = 1): string {
    const hexColor = value == 'w' ? this.cellService.whiteCellColor() : this.cellService.blackCellColor()
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return hexColor;
    const { r, g, b } = rgb;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
      hex = hex.split('').map((x) => x + x).join('');
    }

    if (hex.length !== 6) {
      return null;
    }

    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }
}


