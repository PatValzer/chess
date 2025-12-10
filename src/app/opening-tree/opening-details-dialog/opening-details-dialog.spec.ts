import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningDetailsDialog } from './opening-details-dialog';
import { provideZonelessChangeDetection } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpenAIService } from '../../services/openai.service';
import { GameManagerService } from '../../services/game-manager-service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('OpeningDetailsDialog', () => {
  let component: OpeningDetailsDialog;
  let fixture: ComponentFixture<OpeningDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeningDetailsDialog],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { opening: { moves: [], pgn: '1. e4' } } },
        { provide: OpenAIService, useValue: { chat: () => of({ choices: [] }) } },
        { provide: GameManagerService, useValue: { currentTurn: signal('w'), move: () => { }, mainChessBoard: true } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OpeningDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
