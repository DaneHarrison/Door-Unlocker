import { Friend } from 'src/app/classes/friend';
import { Component } from '@angular/core';


@Component({
    selector: 'admin-view',
    template: `
        <div class='scrollbox hideScrollBar'>
            <div *ngFor="let friend of friends">
                <listed-user [friend]='friend'></listed-user>
            </div>
        </div>

        <div class='addUserSection'>
            <input type="text" id="nameInput" placeholder="Enter a name" class='inputField'>
            <input type="text" id="emailInput" placeholder="Enter an email" class='inputField'>
            <button class='inputFieldBtn'>Add Friend</button>
        </div>
    `,
    styleUrls: ['./admin-view.component.scss']
})

export class AdminViewComponent {
    friends: Friend[];

    constructor() {
        this.friends = [
            new Friend(1, 'Dane Wanke', 'admin', 'March'),
            new Friend(2, 'User A', 'not allowed', 'March'),
            new Friend(3, 'User Z', 'allowed', 'March'),
            new Friend(4, 'User T', 'not allowed', 'March'),
            new Friend(5, 'User H', 'allowed', 'March')
        ];
        
        this.friends = Friend.sortFriends(this.friends)
    }
}