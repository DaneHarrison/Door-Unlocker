import { Component } from '@angular/core';
import Cookie from 'js-cookie'


@Component({
    selector: 'user-view',
    template: `
        <div class='container alignTxt'>
            <div *ngIf="role == 'allowed' || role == 'admin'; else notAllowedView">    
                <h1>Access Granted!</h1>
                <button class="loginBtn">Unlock</button>
            </div>

            <ng-template #notAllowedView>
                <h1>Access Denied</h1>
                <p>Please get ahold of me if you'd like to change that</p>
            </ng-template>

            <button class='logoutBtn'>logout</button>

        </div>
    `,
    styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent {
    role = Cookie.get('role');
}
