import { Friend } from '../../../classes/friend';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'listed-user',
    template: `
        <div class='listEntry'> 
            <button class='modBtn spreadDetails' [ngClass]="{'not allowed': 'notAllowedColor', 'allowed' : 'allowedColor', 'admin' : 'adminColor'}[friend.accessLvl]">
                <h3 class='giveMoreSpace'>{{friend.name}}</h3>
                <h3 class='smallerTxt'>{{friend.accessLvl}}</h3>
                <h3 class='smallerTxt'>{{friend.lastAccessed}}</h3>
            </button>

            <span [ngClass]="{'not allowed': 'notAllowedColor', 'allowed' : 'allowedColor', 'admin' : 'adminColor'}[friend.accessLvl]">
                <button class='deleteBtn' [ngClass]="{'hidden' : friend.accessLvl == 'admin'}">X</button>
            </span>
        </div>
    `,
    styleUrls: ['./listed-user.component.scss']
})
export class ListedUserComponent {
    @Input() friend: Friend = {'friendID': -1, 'name': 'null', 'accessLvl': 'admin', 'lastAccessed': 'null'};
}
