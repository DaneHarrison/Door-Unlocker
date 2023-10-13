import logic from '../../logic/logicInstace.js'
import express from 'express';


let adminRoutes = express.Router()

adminRoutes.get('/fetchList/', async (req, res) => {
    let currSession = req.app.locals.sessions.find((session) => session.sessionID == 1)
    let listOfFriends

    req.app.locals.sessions = req.app.locals.sessions.filter((session) => session != currSession) 
    listOfFriends = await logic.getFriendDetails(currSession.userID, currSession.authorized);

    res.send(JSON.stringify(listOfFriends));
});

adminRoutes.post('/modify/admin/', async(req, res) => { 
    // if(req.body.role == 'notAllowed' || req.body.role == 'allowed') {
    //     this._logic.modUserPerms(req.signedCookies['SessionID'], req.body.name, req.body.role);
    // }
    // else {
    //     this._logic.lockAccount(req.signedCookies['SessionID'], 'User attempted to use unauthorized commands');
    // }
    res.send();
});

adminRoutes.post('/add/', async(req, res) => {
    // this._logic.createUser(req.signedCookies['SessionID'], req.body.name, req.body.email);
    logic.createUser(1, true, req.body.name, req.body.email)
    
    res.sendStatus(200);
});

adminRoutes.post('/delete/', async(req, res) => { 
    // this._logic.deleteUser(req.body.name);
    res.send();
});


export default adminRoutes;