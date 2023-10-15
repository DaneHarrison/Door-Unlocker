import { DataService } from '../../classes/data-service.service';
import { Component } from '@angular/core';

@Component({
    selector: 'login-view',
    template: `
        <div class="main">
            <p class="sign" align="center">Door Unlocker</p>
            <input class="un " type="text" align="center" placeholder="Please enter your email" id='email'>
            <a class="submit" (click)="requestLink()">Request Link</a>
            <p align="center">{{this.statusMsg}}</p>
        </div>
    `,
    styleUrls: ['./login-view.component.scss']
})

export class LoginViewComponent {
    statusMsg: string;

    constructor(private dataService: DataService) {
        this.statusMsg = '';
    }
    

    requestLink() {
        let emailInput = document.getElementById('email') as HTMLInputElement;
        
        if(emailInput && emailInput.value) {
            this.dataService.requestlogin(emailInput.value);
            this.statusMsg = `Sent, please check your inbox!`;
            emailInput.value = '';
            
            setTimeout(() => {
                this.statusMsg = '';
            }, 2000);
        }
    }
}
