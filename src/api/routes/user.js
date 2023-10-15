import {sessionManager} from '../security/sessionManager.js';
import {authorizer} from '../security/authorizer.js';
import {logic} from '../../logic/logic.js'
import express from 'express';

const userRoutes = express.Router()
userRoutes.use(sessionManager.load, authorizer.setAllowedLvl, authorizer.verifyAccess, sessionManager.update)


userRoutes.get('/unlock/prep/', async (req, res) => {
    await logic.prepUnlock(req.userID, req.authorized);

    res.sendStatus(200);
});

userRoutes.post('/unlock/attempt/', async (req, res) => {
    await logic.attemptUnlock(req.userID, req.authorized, req.body.passcode);
    res.sendStatus(200);
});


export default userRoutes;