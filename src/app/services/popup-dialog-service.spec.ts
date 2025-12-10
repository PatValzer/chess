import { TestBed } from '@angular/core/testing';
import { PopupDialogService } from './popup-dialog-service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Component } from '@angular/core';

@Component({ template: '' })
class TestComponent { }

describe('PopupDialogService', () => {
  let service: PopupDialogService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        PopupDialogService,
        { provide: MatDialog, useValue: dialogSpy }
      ]
    });
    service = TestBed.inject(PopupDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog with correct params', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(null));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    const data = { id: 1 };
    service.startDialog(TestComponent, data);

    expect(dialogSpy.open).toHaveBeenCalledWith(TestComponent, {
      width: 'auto',
      data: data
    });
  });

  it('should call closeFunction when dialog closes with data', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    const resultData = { success: true };
    dialogRefSpy.afterClosed.and.returnValue(of(resultData));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    const closeFn = jasmine.createSpy('closeFn');
    service.startDialog(TestComponent, {}, closeFn);

    expect(closeFn).toHaveBeenCalledWith(resultData);
  });

  it('should NOT call closeFunction when dialog closes without data', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(undefined));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    const closeFn = jasmine.createSpy('closeFn');
    service.startDialog(TestComponent, {}, closeFn);

    expect(closeFn).not.toHaveBeenCalled();
  });
});
