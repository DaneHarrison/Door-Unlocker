import {sessionManager} from '../security/sessionManager.js';
import {authorizer} from '../security/authorizer.js';
import {logic} from '../../logic/logic.js'
import express from 'express';
import 'dotenv/config'

const adminRoutes = express.Router()
adminRoutes.use(sessionManager.load, authorizer.setAdminLvl, authorizer.verifyAccess, sessionManager.update)


adminRoutes.get('/getFriends/', async (req, res) => {
    console.log(req.sessionID)
    let listOfFriends = await logic.getFriendDetails(req.userID, req.authorized); 

    res.send(JSON.stringify(listOfFriends));
});

adminRoutes.post('/modAccess/', async(req, res) => { 
    console.log(req.sessionID)
    let success = await logic.modUserAccess(req.userID, req.authorized, req.body.userID)

    res.sendStatus(200);
});

adminRoutes.post('/add/', async(req, res) => {
    let success = await logic.addUser(req.userID, req.authorized, req.body.name, req.body.email)
    
    res.sendStatus(200);
});

adminRoutes.post('/delete/', async(req, res) => { 
    let success = await logic.deleteUser(req.userID, req.authorized, req.body.userID)
    
    res.sendStatus(200);
});


export default adminRoutes;