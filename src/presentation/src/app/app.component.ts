import { Component } from '@angular/core';
import Cookie from 'js-cookie'


@Component({
    selector: 'app',
    template: `
        <div *ngIf="role == 'admin'; else userViewOnly">
            <router-outlet></router-outlet>          
            <div class='tabs'>
                <a routerLink='' class="button-link" [routerLinkActive]="['is-active']" [routerLinkActiveOptions]="{ exact: true }">User</a>
                <a routerLink='/admin' class="button-link" [routerLinkActive]="['is-active']" [routerLinkActiveOptions]="{ exact: true }">Admin</a>
            </div>
        </div>

        <ng-template #userViewOnly>
            <user-view/>
        </ng-template>
    `,
    styleUrls: ['app.scss'] 
})

export class AppComponent {
    role = Cookie.get('role');
}