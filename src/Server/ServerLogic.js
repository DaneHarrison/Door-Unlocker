/*
    Logic for server requests and startup
*/
const {DBAdapter} = require('./DBAdapter');
const {Arduino} = require('./Arduino');
const {LED} = require('./Modes/LED');
const readline = require('readline');
const nodemailer = require('nodemailer');


class ServerLogic {

    constructor() {
        this._adapter = new DBAdapter();
        this._arduino = new Arduino();
        this._led = new LED(this._adapter);
    }


/*
    Startup logic - not currently in use because of docker
*/
async setOwner() {
    let ownerExists = await this._adapter.checkDB({args: ['checkForOwner']});
    
    if(!ownerExists[0]) {
        let input = readline.createInterface({input: process.stdin, output: process.stdout});
        let owner = [{'Name': '', 'Email': ''}];
        let confirmedByUser = false;

        while(!confirmedByUser) {
            owner.Name = await this._getInput(input, 'What is your name?');
            owner.Email = await this._getInput(input, 'What is your email?'); 
            confirmedByUser = await this.checkInput(input, owner);
        }

        input.close();
    }
}

async checkInput(input, owner) {
    let uniqueName = await this._adapter.checkDB({args: ['isUnique', 'name', owner.Name]});
    let uniqueEmail = await this._adapter.checkDB({args: ['isUnique', 'email', owner.Email]});
    let valid = false;

    if(uniqueName && uniqueEmail) {
        let response = await this._getInput(input, `Name: ${owner.Name} and email: ${owner.Email} Is this valid?  T/F`);

        if(response == 'T' || response == 't' || response == 'True', response = 'TRUE', response = 'true') {
            this._adapter.updateDB({args: ['addUser', owner.Email, owner.Name, 'owner']});
            valid = true;
        }
    }

    return valid;
}

_getInput(input, query) {    
    return new Promise(resolve => input.question(query, answer => {
        resolve(answer);
    }));
}


/*
    Request logic
*/
    async prepUnlock(user) {
        this._adapter.updateDB({args: ['saveEvent', user, null, 'Prepping door unlock']});

        //if(!this._led.getPattern()) {
            await this._led.createPattern(user);
            console.log(this._led.getPattern());
            await this._arduino.newSeq(this._led.getPattern());
        //}
        
        setTimeout(() => {this._led.reset()}, 60000);
    }

    async attemptUnlock(id, indexPattern) {
        // if(this._led.patternMatches(id, indexPattern)) {
            await this._arduino.unlock();
        //     this._adapter.updateDB({args: ['saveEvent', id, null, 'Unlocking door']});
        // }
        // this._led.reset();
    }
    
    deleteUser(name) {
        this._adapter.updateDB({args: ['deleteUser', name]});
    }

    modUserPerms(id, name, newRole) {
        let event = 'Unknown role';

        if(newRole == 'notAllowed') {
            event = 'Revoking user access';
        }
        else if(newRole == 'allowed') {
            event = 'Granting user access';
        }
        else if(newRole == 'admin') {
            event = 'Making user an admin';
        }

        this._adapter.updateDB({args: ['modifyRole', name, newRole]});
        this._adapter.updateDB({args: ['saveEvent', id, name, event]});
    }

    async lockAccount(id, event) {
        let usersName = await adapter.checkDB({args: ['getName', id]});
        adapter.updateDB({args: ['modifyRole', usersName[0], 'Locked']});
        adapter.updateDB({args: ['saveEvent', 'System', usersName[0], event]});
    }

    async createUser(id, name, email) {
        let uniqueName = await this._adapter.checkDB({args: ['isUnique', 'name', name]});
        let uniqueEmail = await this._adapter.checkDB({args: ['isUnique', 'email', email]});

        if(uniqueName[0] == 'True' && uniqueEmail[0] == 'True') {
            this._adapter.updateDB({args: ['addUser', email, name, 'allowed']});
            this._adapter.updateDB({args: ['saveEvent', id, name, 'Adding user']});
        }
    }

    async getListOfFriends() {
        let friends = await this._adapter.checkDB({args: ['getEveryonesInfo']});
        let listOfFriends = {};

        for(let i = 0; i < friends.length - 1; i++) {
            let details = friends[i].split(' ');
            listOfFriends[i] = {'name': details[0], 'role': details[1], 'lastAccessed': details[2]};
        }

        return listOfFriends
    }

    async emailLogs(emailInfo) {
        let friendLogs = await this._adapter.checkDB({args: ['getLogs', 'Friends']});
        let historyLogs = await this._adapter.checkDB({args: ['getLogs', 'History']});
        let owner = await this._adapter.checkDB({args: ['checkForOwner']});
        let logs = this._formatLogs(friendLogs, historyLogs);
        let date = new Date().toLocaleString();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailInfo.email,
                pass: emailInfo.password
            }
        });
          
        let mailOptions = {
            from: emailInfo.email,
            to: owner[0],
            subject: 'Database backup: ' + date,
            text: logs
        };
          
        transporter.sendMail(mailOptions, function(error) {
            if (error) {
                console.log(error);
            } 
        });
    }

    _formatLogs(friendLogs, historyLogs) {
        let logs = 'Friends:\n';
        for(let i = 0; i < friendLogs.length - 1; i++) {
            logs += friendLogs[i] + '\n';
        }

        logs += '\nHistory:\n';
        for(let i = 0; i < historyLogs.length - 1; i++) {
            logs += historyLogs[i] + '\n';
        }

        return logs;
    }
}

module.exports = {
    ServerLogic
}