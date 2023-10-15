import {sessionManager} from '../security/sessionManager.js';
import {authorizer} from '../security/authorizer.js';
import {logic} from '../../logic/logic.js'
import express from 'express';

const userRoutes = express.Router()
userRoutes.use(sessionManager.load, authorizer.setAllowedLvl, authorizer.verifyAccess, sessionManager.update)


userRoutes.get('/unlock/prep/', async (req, res) => {
    let results = await logic.prepUnlock(req.userID, req.authorized);

    switch(results) {
        case null:
            res.sendStatus(200)
            break

        case 'not authorized':
            req.successful ? res.status(401).send('[ERROR] Insufficient permission, if this is a mistake please contact your service maintainer')
                : res.status(401).send('[ERROR] session expired')
            break
        
        case 'mechanism already in use':
            res.status(503).send('[ERROR] Mechanism already in use')
            break

        case 'error occured':
            res.status(500).send('[ERROR] Server-side error occured')
            break
    }
});

userRoutes.post('/unlock/attempt/', async (req, res) => {
    let details = await logic.attemptUnlock(req.userID, req.authorized, req.body.passcode);
    
    switch(details) {
        case null:
            res.sendStatus(200)
            break

        case 'not authorized':
            req.successful ? res.status(401).send('[ERROR] Insufficient permission, if this is a mistake please contact your service maintainer')
                : res.status(401).send('[ERROR] session expired')
            break
        
        case 'incorrect input':
            res.status(400).send('[ERROR] Incorrect color combination provided, please try again')
            break

        case 'error occured':
            res.status(500).send('[ERROR] Server-side error occured')
            break
    }
});


export default userRoutes;