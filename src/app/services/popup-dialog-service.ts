import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class PopupDialogService {
  private dialog = inject(MatDialog)

  startDialog<T, D>(component: ComponentType<T>, data?: {}, closeFunction?: (item: D) => void) {

    const dialogRef = this.dialog.open(component, {
      width: 'auto',
      data: data,
    });

    dialogRef.afterClosed().subscribe((piece?: D) => {
      if (!piece || !closeFunction) return;
      closeFunction(piece)
    });
  }
}
