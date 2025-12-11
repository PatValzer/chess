import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-piece-set-preview-component',
  imports: [],
  templateUrl: './piece-set-preview-component.html',
  styleUrl: './piece-set-preview-component.scss',
})
export class PieceSetPreviewComponent {
  piecesToFind = ['b', 'k', 'n', 'p', 'q', 'r'];
  colors = ['b', 'w'];
  pieceSet = input.required<string>();

  pieces = computed(() => {
    const pieces: string[] = [];
    this.colors.forEach((color) => {
      this.piecesToFind.forEach((piece) => pieces.push(`${color}-${piece}.png`));
    });
    return pieces;
  });
}
