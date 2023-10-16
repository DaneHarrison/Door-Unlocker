import {db} from './database/database.js';


export default class LogDB {
    constructor(filename) {
        this._filename = filename;
    }


    recordQuery(recorded_query, params, duration) {
        let query = {
            name: 'recordQuery',
            text: 'INSERT INTO query_logs (query, params, duration) VALUES ($1, $2, $3)',
            values: [recorded_query, params, duration]
        };

        db.queueRequest(query);
    }

    recordAction(user_id, action_occured, success, details) {
        let query = {
            name: 'recordAction',
            text: 'INSERT INTO action_logs (user_id, action_occured, success, details) VALUES ($1, $2, $3, $4)',
            values: [user_id, action_occured, success, details]
        };

        db.queueRequest(query);
    }

    recordError(msg, func_occured) {
        let query = {
            name: 'recordError',
            text: 'INSERT INTO error_logs (msg, file_occured, func_occured) VALUES ($1, $2, $3)',
            values: [msg, this._filename, func_occured]
        };

        db.queueRequest(query); 
    }
}