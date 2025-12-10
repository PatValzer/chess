import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ChessboardService } from '../../services/chessboard.service';
import { CellService } from '../../services/cell.service';
import { ColorPickerDialogComponent } from '../color-picker-dialog';
import { COLORS } from '../../chessboard/COLORS';

@Component({
    selector: 'app-options',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './options.html',
    styleUrl: './options.scss'
})
export class OptionsComponent {
    private dialog = inject(MatDialog);
    chessboardService = inject(ChessboardService);
    cellService = inject(CellService);

    openColorPicker(type: 'cell' | 'piece', color: COLORS) {
        let currentColor = '';
        let title = '';

        if (type === 'cell') {
            currentColor = color === 'w' ? this.cellService.whiteCellColor() : this.cellService.blackCellColor();
            title = (color === 'w' ? 'White' : 'Black') + ' Cell Color';
        } else {
            currentColor = color === 'w' ? this.chessboardService.whitePieceColor() : this.chessboardService.blackPieceColor();
            title = (color === 'w' ? 'White' : 'Black') + ' Piece Color';
        }

        const dialogRef = this.dialog.open(ColorPickerDialogComponent, {
            data: { currentColor, title }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (type === 'cell') {
                    this.cellService.setChessboardCellsColor(color, result);
                } else {
                    this.chessboardService.setPiecesColor(color, result);
                }
            }
        });
    }

    resetDefaults() {
        this.cellService.whiteCellColor.set("#fbf5de");
        this.cellService.blackCellColor.set("#600");
        this.chessboardService.whitePieceColor.set('#FFFFFF');
        this.chessboardService.blackPieceColor.set('rgb(90 90 90)');
    }
}
