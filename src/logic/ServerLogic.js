
const {Arduino} = require('./Arduino');
const {LED} = require('./Modes/LED');


class ServerLogic { // do a singleton here and connect it to index

    constructor(transactions, logs) {
        this._mode = new ModeFactory();
        this._arduino = new Arduino();
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
}

module.exports = {
    ServerLogic
}