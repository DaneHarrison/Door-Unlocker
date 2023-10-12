import {db} from './database/dbInstance.js';
import LogDB from './logDB.js';


export default class SessionDB {
    constructor() {
        this._logDB = new LogDB('sessionDB.js')
        this._timer = new Date()
    }


    async loadSession(session_id) {
        let results = null
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
            console.log('[ERROR]: ' + error)
        }

        return results
    }

    createSession(session_id, email) {
        let query = {
            name: 'createSession',
            text: `INSERT INTO public.sessions (session_id, friend_id, access_lvl) VALUES($1, (SELECT friend_id, access_lvl FROM friends WHERE email = $2));
                   SELECT access_lvl from friends WHERE email = $2`,
            values: [session_id, email]
        }

        try {
            db.queueRequest(query) 
        }
        catch(error) {
            this._logDB.recordError(error, 'createSession')
            console.log('[ERROR]: ' + error)
        }
    }

    async updateSession(prev_session_id, new_session_id) {
        // let query = {
        //     name: 'updateSession',
        //     text: 'UPDATE public.sessions SET session_id = $1 WHERE session_id = $2',
        //     values: [prev_session_id, new_session_id]
        // }

        // try {
        //     await db.queueRequest(query) 
        // }
        // catch(error) {
        //     this._logDB.recordError(error, 'updateSession')
        // }
    }

    deleteSession(session_id) {
        let query = {
            name: 'deleteSession',
            text: 'DELETE * public.sessions WHERE session_id = $1',
            values: [session_id]
        }

        try {
            db.queueRequest(query) 
        }
        catch(error) {
            this._logDB.recordError(error, 'deleteSession')
            console.log('[ERROR]: ' + error)
        }
    }

    async clearAllSessions() {
        let query = {
            text: 'DELETE * public.sessions'
        }

        try {
            await db.queueRequest(query) 
        }
        catch(error) {
            this._logDB.recordError(error, 'clearAllSessions')
            console.log('[ERROR]: ' + error)
        }
    }
}