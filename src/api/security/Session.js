const {DBAdapter} = require('../DBAdapter');
const Puid = require('puid');
const home = require('../Config/Addresses').server;


class Session {

    restrict(req, res, next) {
        req.clearance = 'admin';
        next();
    }

    ownerOnly(req, res, next) {
        req.clearance = 'owner';
        next();
    }

    async assignRole(req, res, next) {
        let adapter = new DBAdapter(); 
        let sessionID = req.signedCookies['SessionID'];
        let role = await adapter.checkDB({args: ['getUserRole', sessionID]});

        if(role[0]) {
            res.cookie('role', role[0], {expires: new Date(Date.now + 888888)});
            return next();
        }

        res.redirect(home.address + '/auth/login');
    }

    async verify(req, res, next) {
        let role = req.cookies['role'];
        let sessionID = req.signedCookies['SessionID'];

        if(role) {
            if(sessionID) {
                let adapter = new DBAdapter();
                let userRole = await adapter.checkDB({args: ['getUserRole', sessionID]});
                let requiredPerms = 1;
                let userPerms = 0;

                if(userRole[0] == 'allowed') {
                    userPerms = 1;
                }
                else if(userRole[0] == 'admin') {
                    userPerms = 2;
                }
                else if(userRole[0] == 'owner') {
                    userPerms = 3;
                }
                
                if(req.clearance == 'admin') {
                    requiredPerms = 2;
                }
                else if(req.clearance == 'owner') {
                    requiredPerms = 3;
                }
                
                if(userPerms >= requiredPerms) {
                    return next();
                }
                else {
                    let usersName = await adapter.checkDB({args: ['getName', sessionID]});
                    adapter.updateDB({args: ['modifyRole', usersName[0], 'Locked']});
                    adapter.updateDB({args: ['saveEvent', 'System', usersName[0], 'User attempted to use unauthorized commands']});
                }
            }
            else {
                let usersName = await adapter.checkDB({args: ['getName', sessionID]});
                adapter.updateDB({args: ['modifyRole', usersName[0], 'Locked']});
                adapter.updateDB({args: ['saveEvent', 'System', usersName[0], 'Cookie authentication failed']});
            }
        }
          
        res.redirect(home.address);
    }

    async newToken(req, res, next) {
        let adapter = new DBAdapter();
        let idHandler = new Puid();
        let oldID = req.signedCookies['SessionID'];
        let newSessionID;
        let isUnique = false;
        
        do {
            newSessionID = idHandler.generate() + Math.random().toString(20).substr(2, 6);
            let uniqueInDB = await adapter.checkDB({args: ['isUnique', 'SessionID', newSessionID]});
            isUnique = uniqueInDB[0] == 'True'
        } while(!isUnique);

        await adapter.updateDB({args: ['saveUserInfo', oldID, 'SessionID', newSessionID]});

        res.cookie('SessionID', newSessionID, {signed: true, expires: new Date(Date.now + 900000)});
        next();
    }
}

module.exports = {
    Session
}