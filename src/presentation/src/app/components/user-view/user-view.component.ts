import { ColorPkrModalComponent } from './color-pkr-modal/color-pkr-modal.component';
import { DataService } from '../../classes/data-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import Cookie from 'js-cookie';


@Component({
    selector: 'user-view',
    template: `
        <div class='container alignTxt'>
            <div *ngIf="role == 'allowed' || role == 'admin'; else notAllowedView">    
                <h1>Access Granted!</h1>
                <button class="loginBtn" (click)="openModal()">Unlock</button>
            </div>

            <ng-template #notAllowedView>
                <h1>Access Denied</h1>
                <p>Please get ahold of me if you'd like to change that</p>
            </ng-template>

            <button class='logoutBtn' (click)="logout()">logout</button>

        </div>
    `,
    styleUrls: ['./user-view.component.scss']
})

export class UserViewComponent {
    role: string | undefined;

    constructor(private dataService: DataService, private dialog: MatDialog) {
        this.role = Cookie.get('role');
    }


    openModal() {
        this.dataService.prepareUnlock().subscribe(() => {
            this.dialog.open(ColorPkrModalComponent);
        });
    }

    logout() {
        this.dataService.logout();
    }
}
