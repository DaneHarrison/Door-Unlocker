import db from './database/dbInstance';

export default class SessionDB {
    loadSession(sessionID) {
        let query = {
            text: 'SELECT friend_id, role FROM sessions WHERE session_id = $1',
            values: [sessionID],
        }

        db.queueRequest(query)
    }

    createSession(sessionID, email) {
        let query = {
            text: 'INSERT INTO sessions (session_id, friend_id, role) VALUES($1, (SELECT friend_id, role FROM friends WHERE email = $2))',
            values: [sessionID, email]
        }

        db.queueRequest(query)
    }

    updateSession(prevSessionID, newSessionID) {
        let query = {
            text: 'UPDATE sessions SET session_id = $1 WHERE session_id = $2',
            values: [prevSessionID, newSessionID]
        }

        db.queueRequest(query)
    }

    deleteSession(sessionID) {
        let query = {
            text: 'DELETE * sessions WHERE session_id = $1',
            values: [sessionID]
        }

        db.queueRequest(query)
    }

    clearAllSessions() {
        let query = {
            text: 'DELETE * sessions'
        }

        db.queueRequest(query)
    }
}