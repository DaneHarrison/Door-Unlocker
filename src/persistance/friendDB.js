import {db} from './database/dbInstance.js';
import LogDB from './logDB.js';


export default class FriendDB {
    constructor() {
        this._logDB = new LogDB('friendDB.js')
        this._timer = new Date()
    }

    
    async modUserAccess(targetID, newAccessLvl) {
        let successful = false
        let results = null
        let query = {
            name: 'modUserAccess',
            text: 'UPDATE friends SET access_lvl = $1 WHERE friend_id = $2',
            values: [newAccessLvl, targetID]
        }

        let start = this._timer.getTime()

        try {
            results = await db.queueRequest(query) 
            successful = results.rowCount && results.rowCount == 1
        }
        catch(error) {
            this._logDB.recordError(error, 'modUserAccess')
        }

        this._logDB.recordQuery(query.text, query.values, this._timer.getTime() - start)

        return successful
    }

    async createUser(name, email) {
        let successful = false
        let results = null
        let query = {
            name: 'createUser',
            text: 'INSERT INTO friends (friend_name, email) VALUES ($1, $2)',
            values: [name, email]
        }

        let start = this._timer.getTime()

        try {
            results = await db.queueRequest(query) 
            successful = results.rowCount && results.rowCount == 1
        }
        catch(error) {
            this._logDB.recordError(error, 'createUser')
        }

        this._logDB.recordQuery(query.text, query.values, this._timer.getTime() - start)

        return successful
    }

    async getFriendDetails() {
        let results = null
        let query = {
            name: 'getFriendDetails',
            text: 'SELECT friend_id, friend_name, access_lvl FROM public.friends'
        }

        let start = this._timer.getTime()

        try {
            results = await db.queueRequest(query) 
            results = results.rows
        }
        catch(error) {
            this._logDB.recordError(error, 'getFriendDetails')
        }

        this._logDB.recordQuery(query.text, null, this._timer.getTime() - start)

        return results
    }
}