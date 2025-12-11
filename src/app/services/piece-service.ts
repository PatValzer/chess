import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PieceService {
  pieceSets = signal<string[]>(['greenpieces', 'cburnett']);

  selectedPieceSet = signal<string>(
    localStorage.getItem('selectedPieceSet')?.toString() || 'cburnett',
  );

  selectedSetChanged = effect(() => {
    localStorage.setItem('selectedPieceSet', this.selectedPieceSet());
  });
}
