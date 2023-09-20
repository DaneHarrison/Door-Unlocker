import Access from'../api/security/accessLevels'
import ModeFactory from './modes/modeFactory';
import Arduino from './arduino/Arduino';
import FriendDB from '../persistance/friendDB';
import LogDB from '../persistance/logDB';


export default class ServerLogic { //eventually should cache friends
    constructor() {
        this._mode = new ModeFactory();
        this._arduino = new Arduino();

        this._friendDB = new FriendDB()
        this._logDB = new LogDB()
    }


    _lockAccount(user) {
        this._friendDB
        this._logDB
    }

    async prepUnlock(user, authorized) {
        let successful = authorized && this._mode.prepare(user)

        if(!authorized) 
            this._lockAccount(user)

        this._logDB
    }

    async attemptUnlock(user, authorized, inputPattern) {
        let successful = authorized && this._mode.determineEntry(user, inputPattern)

        if(!authorized) 
            this._lockAccount(user)
        else if(successful) 
            this._arduino.unlock();

        this._logDB
    }

    modUserAccess(user, authorized, targetName, newAccessLvl) {
        let successful = authorized && this._friendDB

        if(!authorized) 
            this._lockAccount(user)

        this._logDB
    }

    createUser(user, authorized, name, email) {
        let successful = authorized && this._friendDB

        if(!authorized) 
            this._lockAccount(user)

        this._logDB
    }
    
    deleteUser(user, authorized, name) {
        let successful = authorized && this._friendDB

        if(!authorized) 
            this._lockAccount(user)

        this._logDB
    }

    getFriendDetails(authorized) {
        if(!authorized) 
            this._lockAccount(user)

        return this._friendDB
    }
}