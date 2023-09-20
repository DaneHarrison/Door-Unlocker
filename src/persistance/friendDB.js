import db from './database/dbInstance';

export default class FriendDB {
    modUserAccess(targetID, newAccessLvl) {
        let query = {
            text: 'UPDATE friends SET access = $1 WHERE friend_id = $2',
            values: [newAccessLvl, targetID]
        }

        db.queueRequest(query)
    }

    createUser(name, email) { //need to set default access
        let query = {
            text: 'INSERT INTO friends (name, email) VALUES ($1, $2)',
            values: [name, email]
        }

        db.queueRequest(query)
    }

    getFriendDetails() {
        let query = {
            text: 'SELECT friend_id, name, access friends'
        }

        db.queueRequest(query)
    }
}