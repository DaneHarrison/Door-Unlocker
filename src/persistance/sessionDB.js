import {db} from './database/database.js';
import LogDB from './logDB.js';


export default class SessionDB {
    constructor() {
        this._logDB = new LogDB('sessionDB.js')
        this._timer = new Date()
    }


    async loadSession(session_id) {
        let results
        let query = {
            name: 'loadSession',
            text: 'SELECT friend_id, access_lvl FROM public.sessions WHERE session_id = $1',
            values: [String(session_id)]
        }

        try {
            results = await db.queueRequest(query)
            results = results.rows[0]
        }
        catch(error) {
            this._logDB.recordError(error, 'loadSession')
            console.error('[ERROR]: ', error)
            results = null
        }

        return results
    }

    async createSession(email, session_id) {
        let results
        let query = {
            name: 'createSession',
            text: `INSERT INTO public.sessions (session_id, friend_id, access_lvl) VALUES($1, 
                (SELECT friend_id FROM friends WHERE email = $2),
                (SELECT access_lvl FROM friends WHERE email = $2));`,
            values: [session_id, email]
        }

        try {
            results = await db.queueRequest(query) 
            results = true
        }
        catch(error) {
            this._logDB.recordError(error, 'createSession')
            console.error('[ERROR]: ', error)
            results = null
        }

        return results
    }

    async updateSession(prev_session_id, new_session_id) {
        let result
        let query = {
            name: 'updateSession',
            text: 'UPDATE public.sessions SET session_id = $1 WHERE session_id = $2',
            values: [new_session_id, prev_session_id]
        }

        try {
            await db.queueRequest(query) 
            result = true
        }
        catch(error) {
            this._logDB.recordError(error, 'updateSession')
            console.log('[ERROR]: ', error)
            results = null
        }
    }

    deleteSession(session_id) {
        let query = {
            name: 'deleteSession',
            text: 'DELETE FROM public.sessions WHERE session_id = $1',
            values: [session_id]
        }

        try {
            db.queueRequest(query) 
        }
        catch(error) {
            this._logDB.recordError(error, 'deleteSession')
            console.error('[ERROR]: ', error)
        }
    }

    async clearAllSessions() {
        let result
        let query = {
            text: 'DELETE FROM  public.sessions'
        }

        try {
            await db.queueRequest(query) 
            result = true
        }
        catch(error) {
            this._logDB.recordError(error, 'clearAllSessions')
            console.error('[ERROR]: ', error)
            result = null
        }

        return result
    }
}