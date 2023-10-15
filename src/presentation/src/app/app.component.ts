import { Component } from '@angular/core';
import Cookie from 'js-cookie'


@Component({
    selector: 'app',
    template: `
        <div *ngIf="role == undefined; else doorUnlocker">
            <login-view></login-view>
        </div>

        <ng-template #doorUnlocker>
            <div *ngIf="role != 'admin'; else adminAndUserViews">
                <user-view></user-view>
            </div>

            <ng-template #adminAndUserViews>
                <router-outlet></router-outlet> 
                <div class='tabs'>
                    <a routerLink='' class="button-link" [routerLinkActive]="['is-active']" [routerLinkActiveOptions]="{ exact: true }">User</a>
                    <a routerLink='/admin' class="button-link" [routerLinkActive]="['is-active']" [routerLinkActiveOptions]="{ exact: true }">Admin</a>
                </div>
            </ng-template>            
        </ng-template>
    `,
    styleUrls: ['app.scss'] 
})

export class AppComponent {
    role: string | undefined

    constructor() {
        this.role = Cookie.get('role');
    }
}