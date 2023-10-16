import { DataService } from '../../../classes/data-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';


@Component({
  selector: 'color-pkr-modal',
  template: `
    <div class="fillScreen">
      <h1 align='center'>Please select the colours you see in order to gain entry!</h1>

      <div class="wrapBtns">
        <button class="largeColorSquare purple" (click)="addToCombo(0)"> Purple </button>
        <button class="largeColorSquare green" (click)="addToCombo(1)"> Green </button>
        <button class="largeColorSquare blue" (click)="addToCombo(2)"> Blue </button>
        <button class="largeColorSquare orangeyPink" (click)="addToCombo(3)"> Orangey-Pink </button>
        <button class="largeColorSquare red" (click)="addToCombo(4)"> Red </button>
        <button class="largeColorSquare black" (click)="addToCombo(5)"> Black </button>
        <button class="largeColorSquare yellow" (click)="addToCombo(6)"> Yellow </button>
      </div>

      <div class='lower'>
        <h2>Your input:</h2>
        <div class='wrapInput'>
          <div *ngFor="let colorNum of combo" >
            <div class='input' [ngClass]="colors[colorNum]"></div>
          </div>
        </div>
      </div>

      <button class="closeBtn" (click)="closeModal()">Close</button>
      <button class="submitBtn" (click)="submit()">Submit</button>
    </div>
  `,
  styleUrls: ['./color-pkr-modal.component.scss']
})

export class ColorPkrModalComponent {
  combo: number[];
  colors = [
    'purple',
    'green',
    'blue',
    'orangeyPink',
    'red',
    'black',
    'yellow'
  ];

  constructor(private dataService: DataService, private dialogRef: MatDialogRef<ColorPkrModalComponent>) {
    this.dialogRef.disableClose = false;
    this.combo = [];
  }


  closeModal() {
    this.dialogRef.close();
    this.combo = [];
  }

  addToCombo(color: number) {
    this.combo.push(color);
  }

  submit() {
    this.dialogRef.close();
    this.dataService.attemptUnlock(this.combo);
    
    this.combo = [];
  }
}