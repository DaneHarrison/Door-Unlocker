import SessionDB from '../../persistance/sessionDB.js';
import secureConfig from './config/secureCookie.js';
import puid from 'puid';

export default class SessionManager {
    constructor() {
        this._sessionDB = new SessionDB()
        this._idGenerator = new puid()
        this._idsInUse = []
    }


    load = async (req, res, next) => {
        //let sessionID = req.signedCookies['sessionID'];
        let sessionID = 1
        let validUser = await this._loadFromSession(req, sessionID)

        
        
        if(!sessionID || !validUser) 
            res.redirect('/login/');
        else 
            next()
    }

    update = async (req, res, next) => {
        let oldSessionID = req.signedCookies['sessionID']
        let newSessionID = this._createToken()

        this._idsInUse.splice(this._idsInUse.indexOf(oldSessionID))
        await this._sessionDB.updateSession(oldSessionID, newSessionID)
        

        // console.log(res.locals.userID)
        // console.log(res.locals)
        // res.cookie('sessionID', newSessionID, secureConfig);
        // res.cookie('accessLvl', req.accessLvl);

        next()
    }

    persist(req, res, next) {
        req.app.locals.sessions.push({'sessionID': 1, 'userID': req.userID, 'authorized': req.authorized})

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
            req.accessLvl = userInfo.access_lvl
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