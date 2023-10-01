import Access from'../api/security/config/accessLevels.js';
import ModeFactory from './modes/modeFactory.js';
import Arduino from './arduino/Arduino.js';
import LogDB from '../persistance/logDB.js';
import FriendDB from '../persistance/friendDB.js';


export default class ServerLogic { //eventually should cache friends
    constructor() {
        this._mode = new ModeFactory();
        this._arduino = new Arduino();

        this._logDB = new LogDB('logic.js')
        this._friendDB = new FriendDB()
    }


    _lockAccount(user) {
        let successful = this._friendDB.modUserAccess(user, Access.LOCKED)
        let details = successful ? null : 'query failed'
        
        this._logDB.recordAction(user, 'lockAccount', successful, details)
        
        return 'not authorized'
    }

    async prepUnlock(user, authorized) {
        let successful = authorized && this._mode.prepare(user)
        let details = null

        try {
            if(!authorized) 
                details = this._lockAccount(user)
            else if(!successful) 
                details = 'mechanism already in use'
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
                details = this._lockAccount(user)
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

    modUserAccess(user, authorized, targetID, newAccessLvl) {
        let successful = authorized && this._friendDB(targetID, newAccessLvl)

        if(!authorized) 
            details = this._lockAccount(user)
        else if(!successful) 
            details = 'query failed'

        this._logDB.recordAction(user, `modUserAccess - targetID:${targetID} newAccessLvl:${newAccessLvl}`, successful, details)
    }

    createUser(user, authorized, name, email) {
        let successful = authorized && this._friendDB(name, email)
        let details = null

        if(!authorized) 
            details = this._lockAccount(user)
        else if(!successful) 
            details = 'query failed'

        this._logDB.recordAction(user, `createUser - name:${name} email:${email}`, successful, details)
    }

    getFriendDetails(authorized) {
        let results = null
        let details = null

        if(!authorized) 
            details = this._lockAccount(user)
        else {
            results = this._friendDB.getFriendDetails()

            if(results)
                details ='query failed'
        } 

        this._logDB.recordAction(user, 'getFriendDetails', results != null, details)

        return this._friendDB
    }
}