import db from './database/dbInstance';
import LogDB from './logDB';


export default class SessionDB {
    constructor() {
        this._logDB = new LogDB(__filename.split(/[\\/]/).pop())
        this._timer = new Date()
    }


    async loadSession(session_id) {
        let results = null
        let query = {
            name: 'loadSession',
            text: 'SELECT friend_id, access_lvl FROM sessions WHERE session_id = $1',
            values: [session_id]
        }

        try {
            results = await db.queueRequest(query)[0]
        }
        catch(error) {
            recordError(error, 'loadSession')
        }

        return results
    }

    createSession(session_id, email) {
        let query = {
            name: 'createSession',
            text: `INSERT INTO sessions (session_id, friend_id, access_lvl) VALUES($1, (SELECT friend_id, access_lvl FROM friends WHERE email = $2));
                   SELECT access_lvl from friends WHERE email = $2`,
            values: [session_id, email]
        }

        try {
            db.queueRequest(query) 
        }
        catch(error) {
            recordError(error, 'createSession')
        }
    }

    async updateSession(prev_session_id, new_session_id) {
        let query = {
            name: 'updateSession',
            text: 'UPDATE sessions SET session_id = $1 WHERE session_id = $2',
            values: [prev_session_id, new_session_id]
        }

        try {
            await db.queueRequest(query) 
        }
        catch(error) {
            recordError(error, 'updateSession')
        }
    }

    deleteSession(session_id) {
        let query = {
            name: 'deleteSession',
            text: 'DELETE * sessions WHERE session_id = $1',
            values: [session_id]
        }

        try {
            db.queueRequest(query) 
        }
        catch(error) {
            recordError(error, 'deleteSession')
        }
    }

    async clearAllSessions() {
        let query = {
            text: 'DELETE * sessions'
        }

        try {
            await db.queueRequest(query) 
        }
        catch(error) {
            recordError(error, 'clearAllSessions')
        }
    }
}