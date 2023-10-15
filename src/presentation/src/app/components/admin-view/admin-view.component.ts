import { DataService } from '../../classes/data-service.service';
import { Friend } from 'src/app/classes/friend';
import { Component } from '@angular/core';


@Component({
    selector: 'admin-view',
    template: `
        <div class='scrollbox hideScrollBar'>
            <div *ngFor="let friend of friends">
                <listed-user [friend]='friend' (modEvent)='modAccess(friend.friendID, friend.accessLvl)' (delEvent)='deleteFriend(friend.friendID)'></listed-user>
            </div>
        </div>

        <div class='addUserSection'>
            <input type="text" id="nameInput" placeholder="Enter a name" class='inputField'>
            <input type="text" id="emailInput" placeholder="Enter an email" class='inputField'>
            <button class='inputFieldBtn' (click)="addFriend()">Add Friend</button>
        </div>
    `,
    styleUrls: ['./admin-view.component.scss']
})

export class AdminViewComponent {    
    friends: Friend[];

    constructor(private dataService: DataService) {
        this.friends = []

        this.getFriends()
    }


    getFriends() {
        this.friends = []
        this.dataService.getFriends().subscribe((response: any) => {
            for(let line of response) {
                this.friends.push(new Friend(line.friend_id, line.friend_name, line.access_lvl, 'March'))
            }
  
            Friend.sortFriends(this.friends)
        })
    }

    modAccess(userID: number, currAccess: string) {
        if(currAccess == 'allowed' || currAccess == 'not allowed') {
            this.dataService.modAccess(userID).subscribe(() => {
                this.getFriends();
            });
        }
    }

    addFriend() {
        let nameInput = document.getElementById('nameInput') as HTMLInputElement;
        let emailInput = document.getElementById('emailInput') as HTMLInputElement;

        if(nameInput && nameInput.value && emailInput && emailInput.value) {
            this.friends = []
            this.dataService.addFriend(nameInput.value, emailInput.value).subscribe(() => {
                this.getFriends();
            });

            nameInput.value = ''
            emailInput.value = ''
        }
    }

    deleteFriend(userID: number) {
        this.dataService.deleteFriend(userID).subscribe(() => {
            this.getFriends();
        });
    }
}