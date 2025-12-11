import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsComponent } from './options';
import { MatDialog } from '@angular/material/dialog';
import { ChessboardService } from '../../services/chessboard.service';
import { CellService } from '../../services/cell.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('OptionsComponent', () => {
    let component: OptionsComponent;
    let fixture: ComponentFixture<OptionsComponent>;
    let mockDialog: jasmine.SpyObj<MatDialog>;
    let mockChessboardService: any;
    let mockCellService: any;

    beforeEach(async () => {
        mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

        mockChessboardService = {
            whitePieceColor: signal('#FFFFFF'),
            blackPieceColor: signal('#000000'),
            setPiecesColor: jasmine.createSpy('setPiecesColor')
        };

        mockCellService = {
            whiteCellColor: signal('#f0d9b5'),
            blackCellColor: signal('#b58863'),
            setChessboardCellsColor: jasmine.createSpy('setChessboardCellsColor')
        };

        await TestBed.configureTestingModule({
            imports: [OptionsComponent, NoopAnimationsModule],
            providers: [
                { provide: ChessboardService, useValue: mockChessboardService },
                { provide: CellService, useValue: mockCellService }
            ]
        })
            .overrideProvider(MatDialog, { useValue: mockDialog })
            .compileComponents();

        fixture = TestBed.createComponent(OptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open color picker dialog for cell', () => {
        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        dialogRefSpy.afterClosed.and.returnValue(of('#666666'));
        mockDialog.open.and.returnValue(dialogRefSpy);

        component.openColorPicker('cell', 'w');

        expect(mockDialog.open).toHaveBeenCalled();
        expect(mockCellService.setChessboardCellsColor).toHaveBeenCalledWith('w', '#666666');
    });

    it('should open color picker dialog for piece', () => {
        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        dialogRefSpy.afterClosed.and.returnValue(of('#333333'));
        mockDialog.open.and.returnValue(dialogRefSpy);

        component.openColorPicker('piece', 'b');

        expect(mockDialog.open).toHaveBeenCalled();
        expect(mockChessboardService.setPiecesColor).toHaveBeenCalledWith('b', '#333333');
    });

    it('should reset defaults', () => {
        component.resetDefaults();
        expect(mockCellService.whiteCellColor()).toBe("#fbf5de");
    });
});
