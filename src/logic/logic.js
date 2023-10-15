import Access from'../api/security/config/accessLevels.js';
import ModeFactory from './modes/modeFactory.js';
import Arduino from './arduino/Arduino.js';
import LogDB from '../persistance/logDB.js';
import FriendDB from '../persistance/friendDB.js';
import 'dotenv/config'


class Logic {
    constructor() {
        this._mode = new ModeFactory().init(process.env.MECH_MODE);
        this._arduino = new Arduino(process.env.MECH_ADDR);

        this._logDB = new LogDB('logic.js')
        this._friendDB = new FriendDB()
    }


    async _lockAccount(user) {
        let successful = await this._friendDB.modUserAccess(user, Access.LOCKED)
        let details = successful ? null : 'query failed'
        
        this._logDB.recordAction(user, 'lockAccount', successful, details)
        
        return 'not authorized'
    }

    async prepUnlock(user, authorized) {
        let prepWork = this._mode.prepare(user)
        let successful = authorized && prepWork != null
        let details = null

        try {
            if(!authorized) 
                details = await this._lockAccount(user)
            else if(!successful) 
                details = 'mechanism already in use'
            else 
                this._arduino.prepare(process.env.MECH_MODE, prepWork)
        }
        catch(error) {
            details = 'error occured'
            this._logDB.recordError(error, 'prepUnlock')
        }

        this._logDB.recordAction(user, 'prepUnlock', successful, details)
    }

    async attemptUnlock(user, authorized, inputPattern) {
        let successful = authorized && this._mode.determineEntry(user, inputPattern)
        let details = null

        try {
            if(!authorized) 
                details = await this._lockAccount(user)
            else if(!successful) 
                details = 'incorrect input'
            else
                this._arduino.unlock();
        }
        catch(error) {
            details = 'error occured'
            this._logDB.recordError(error, 'attemptUnlock')
        }
            
        this._logDB.recordAction(user, 'attemptUnlock', successful, details)
    }

    async modUserAccess(user, authorized, targetID) {
        let targetsRole = await this._friendDB.getFriendsRole(targetID);
        let successful, modTo;
        let details = null

        switch(targetsRole) {
            case 'not allowed':
                modTo = 'allowed'
                break
                
            case 'allowed':
                modTo = 'not allowed'
                break
        }

        successful = authorized && modTo && await this._friendDB.modUserAccess(targetID, modTo)

        if(!authorized || !modTo) 
            details = await this._lockAccount(user)
        else if(!successful) 
            details = 'query failed'

        this._logDB.recordAction(user, `modUserAccess - targetID: ${targetID} newAccessLvl: ${modTo}`, successful, details)
    }

    async addUser(user, authorized, name, email) {
        let successful = authorized && await this._friendDB.createUser(name, email)
        let details = null

        if(!authorized) 
            details = await this._lockAccount(user)
        else if(!successful) 
            details = 'query failed'

        this._logDB.recordAction(user, `createUser - name: ${name} email: ${email}`, successful, details)
    }

    async deleteUser(user, authorized, userID) {
        let successful = authorized && await this._friendDB.deleteUser(userID)
        let details = null

        if(!authorized) 
            details = await this._lockAccount(user)
        else if(!successful) 
            details = 'query failed'

        this._logDB.recordAction(user, `deleteUser - userID: ${userID}`, successful, details)
    }

    async getFriendDetails(user, authorized) {
        let results = null
        let details = null

        if(!authorized) 
            details = this._lockAccount(user)
        else {
            results = await this._friendDB.getFriendDetails()

            if(results)
                details ='query failed'
        } 

        this._logDB.recordAction(user, 'getFriendDetails', results != null, details)

        return results
    }
}


export const logic = new Logic()