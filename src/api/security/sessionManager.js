import SessionDB from '../../persistance/sessionDB.js';
import secureConfig from './config/secureCookie.js';
import puid from 'puid';

export default class SessionManager {
    constructor() {
        this._sessionDB = new SessionDB()
        this._idGenerator = new puid()
        this._idsInUse = []
    }


    load(req, res, next) {
        let sessionID = req.signedCookies['sessionID'];

        if(!sessionID || !this._loadFromSession(req, sessionID)) 
            res.redirect('/login/');

        next()
    }

    async update(req, res, next) {
        let oldSessionID = req.signedCookies['sessionID']
        let newSessionID = this._createToken()

        this._idsInUse.splice(this._idsInUse.indexOf(oldSessionID))
        await this._sessionDB.updateSession(oldSessionID, newSessionID)
        
        res.cookie('sessionID', newSessionID, secureConfig);
        res.cookie('accessLvl', req.accessLvl);

        next()
    }

    async addSession(email) {
        let sessionID = this._createToken()
        let accessLvl = await this._sessionDB.createSession(sessionID, email)

        return {
            'sessionID': sessionID,
            'accessLvl': accessLvl
        }
    }

    clearAllSession() {
        this._sessionDB.clearAllSessions()
        console.log('\t- cleared user sessions')
    }

    async _loadFromSession(req, sessionID) {
        let userInfo = await this._sessionDB.loadSession(sessionID)
        let validUser = false

        if(userInfo) {
            validUser = true
            req.userID = userInfo.friend_id
            req.accessLvl = userInfo.accessLvl
        }

        return validUser
    }

    _createToken() {
        let newSessionID = null

        do {
            newSessionID = this._idGenerator.generate()
        } while(this._idsInUse.includes(newSessionID))

        this._idsInUse.push(newSessionID)

        return newSessionID
    }
}