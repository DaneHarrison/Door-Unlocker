class Requests {

    async prepUnlock() {
        let options = {
            method: 'get',
            url: '/unlock/prep/',
            responseType: 'json'
        }
        
        let mode = await comeInside.utils.getFromServer(options);

        if(mode == 'led') {
            comeInside.UI.user.loadColourMode();
        }
        
        comeInside.UI.ctrl.loadLogin();
    }

    async attemptUnlock() {
        let options = {
            method: 'post',
            url: '/unlock/attempt/',
            data: {
                pattern: comeInside.UI.user.passcode
            }
        }

        comeInside.utils.postToServer(options);
        window.location.reload();
    }

    modifyAccess(toModify, newRole) {
        let user = document.getElementById(toModify).cells.item(0).innerHTML;
        let role = comeInside.utils.getRole();
        
        let options = {
            method: 'post',
            url: '/modify/' + role,
            data: {
                name: user,
                role: newRole
            }
        }
        
        comeInside.utils.postToServer(options);
        window.location.reload();
    }
    
    async addPerson(nameInput, emailInput) {
        let name = document.getElementById(nameInput);
        let email = document.getElementById(emailInput);

        if(name.value != '' && email.value != '') {
            let options = {
                method: 'post',
                url: '/add/',
                data: {
                    'name': name.value,
                    'email': email.value
                }
            }
    
            comeInside.utils.postToServer(options);
            setTimeout(() => { window.location.reload(); }, 750);  //this is here because it was reloading the page b4 server was updated
        }
    }
    
    deletePerson(toDelete) {
        let user = document.getElementById(toDelete).cells.item(0).innerHTML;
        let options = {
            method: 'post',
            url: '/delete/',
            data: {
                name: user
            }
        }
    
        comeInside.utils.postToServer(options);
        window.location.reload();
    }

    requestLogs() {
        let options = {
            method: 'post',
            url: 'send/records'
        }

        comeInside.utils.postToServer(options);
        window.location.reload();
    }
}

module.exports = {
    Requests
}