import SessionDB from '../../persistance/sessionDB.js';
import {secure, expires} from './config/secureCookie.js';
import puid from 'puid';
import 'dotenv/config';


class SessionManager {
    constructor() {
        this._sessionDB = new SessionDB();
        this._idGenerator = new puid();
        this._currSessions = [];
    }


    load = async (req, res, next) => {
        let userInfo;

        if(!req.sessionID) {
            req.sessionID = req.signedCookies['sessionID'];
        }

        userInfo = await this._sessionDB.loadSession(req.sessionID);
        if(userInfo) {
            req.successful = true;
            req.userID = userInfo.friend_id;
            req.accessLvl = userInfo.access_lvl;
        }

        next();
    }

    update = async (req, res, next) => {
        let oldSessionID = req.sessionID;
        let newSessionID = this.createToken();
        
        if(req.successful) {
            this._dropSessionFromMem(oldSessionID);
            await this._sessionDB.updateSession(oldSessionID, newSessionID);
            req.sessionID = newSessionID;

            res.cookie('sessionID', newSessionID, secure);
            res.cookie('role', req.accessLvl, expires);
        } 

        next();
    }

    _dropSessionFromMem(oldSessionID) {
        let session = this._currSessions.find((session) => session.id == oldSessionID);
        
        if(session) {
            clearTimeout(session.timeout);
            this._currSessions.splice(this._currSessions.indexOf(session));
        } 
    }

    createToken() {
        let newSessionID = null;

        do {
            newSessionID = this._idGenerator.generate();
        } while(this._currSessions.includes(newSessionID))
        
        this._currSessions.push({'id': newSessionID, 'timeout': setTimeout(() => {
                this._sessionDB.deleteSession(newSessionID);
                this._currSessions.splice(this._currSessions.indexOf(newSessionID));
            }, process.env.EXPIREY)
        })

        return newSessionID
    }

    createSession = async (email, sessionID) => {
        return await this._sessionDB.createSession(email, sessionID);
    }

    deleteSession = async (req, res, next) => {
        this._sessionDB.deleteSession(req.sessionID);

        next();
    }

    clearAllSession = async () =>  {
        for(session of this._currSessions) {
            clearTimeout(session.timeout);
        }

        await this._sessionDB.clearAllSessions();
    }
}


export const sessionManager = new SessionManager();