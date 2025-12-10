import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerDialogComponent } from './color-picker-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ColorPickerDialogComponent', () => {
    let component: ColorPickerDialogComponent;
    let fixture: ComponentFixture<ColorPickerDialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ColorPickerDialogComponent>>;

    beforeEach(async () => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [ColorPickerDialogComponent, NoopAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: MAT_DIALOG_DATA, useValue: { currentColor: '#ffffff', title: 'Test Title' } }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ColorPickerDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with data', () => {
        expect(component.current).toBe('#ffffff');
        expect(component.data.title).toBe('Test Title');
    });

    it('should close with selected color on select', () => {
        const color = '#000000';
        component.select(color);
        expect(dialogRefSpy.close).toHaveBeenCalledWith(color);
    });

    it('should close without value on cancel', () => {
        component.cancel();
        expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
});
