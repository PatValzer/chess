import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

/**
 * Standalone color picker dialog.
 * - standalone: true so it can be used without adding to NgModule (Angular v14+).
 * - Imports MatDialogModule / MatButtonModule so template directives work even without module changes.
 *
 * Suggestions:
 * - Add keyboard navigation and focus management for accessibility.
 * - Replace the palette with a full color picker if desired.
 */
@Component({
  selector: 'app-color-picker-dialog',
  imports: [MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './color-picker-dialog.html',
  styleUrls: ['./color-picker-dialog.scss']
})
export class ColorPickerDialogComponent {
  palette: string[];
  current: string;


  constructor(
    public dialogRef: MatDialogRef<ColorPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentColor?: string, title?: string }
  ) {
    this.current = data?.currentColor ?? '';
    this.palette = [this.current, '#f0d9b5', '#b58863', '#ffffff', '#000000', '#e6e6e6', '#cccccc', '#333333'];
  }

  select(color: string) {
    console.log(color)
    this.dialogRef.close(color);
  }

  cancel() {
    this.dialogRef.close();
  }
}