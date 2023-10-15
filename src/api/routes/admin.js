import {sessionManager} from '../security/sessionManager.js';
import {authorizer} from '../security/authorizer.js';
import {logic} from '../../logic/logic.js';
import express from 'express';
import 'dotenv/config';

const adminRoutes = express.Router();
adminRoutes.use(sessionManager.load, authorizer.setAdminLvl, authorizer.verifyAccess, sessionManager.update);


adminRoutes.get('/getFriends/', async (req, res) => {
    let response = await logic.getFriendDetails(req.userID, req.authorized); 

    switch(response.details) {
        case null:
            res.status(200).send(JSON.stringify(response.friends));
            break  ;

        case 'not authorized':
            req.successful ? res.status(401).send('[ERROR] Insufficient permission, if this is a mistake please contact your service maintainer')
                : res.status(401).send('[ERROR] session expired');
            break;

        case 'query failed':
            res.status(500).send('[ERROR] Server-side error occured');
            break;
    }
});

adminRoutes.post('/modAccess/', async(req, res) => { 
    let details = await logic.modUserAccess(req.userID, req.authorized, req.body.userID);

    switch(details) {
        case null:
            res.sendStatus(200);
            break;

        case 'users role was nontoggleable':
            res.status(400).send('[ERROR] Invalid request, only the allowed and not allowed roles are toggleable');
            break;
            
        case 'not authorized':
            req.successful ? res.status(401).send('[ERROR] Insufficient permission, if this is a mistake please contact your service maintainer')
                : res.status(401).send('[ERROR] session expired');
            break;
        
        case 'query failed':
            res.status(500).send('[ERROR] Server-side error occured');
            break;
    }
});

adminRoutes.post('/add/', async(req, res) => {
    let details = await logic.addUser(req.userID, req.authorized, req.body.name, req.body.email);
    
    switch(details) {
        case null:
            res.sendStatus(200);
            break;
            
        case 'not authorized':
            req.successful ? res.status(401).send('[ERROR] Insufficient permission, if this is a mistake please contact your service maintainer')
                : res.status(401).send('[ERROR] session expired');
            break;
        
        case 'query failed':
            res.status(500).send('[ERROR] Server-side error occured');
            break;
    }
});

adminRoutes.post('/delete/', async(req, res) => { 
    let details = await logic.deleteUser(req.userID, req.authorized, req.body.userID);
    
    switch(details) {
        case null:
            res.sendStatus(200);
            break;
            
        case 'not authorized':
            req.successful ? res.status(401).send('[ERROR] Insufficient permission, if this is a mistake please contact your service maintainer')
                : res.status(401).send('[ERROR] session expired');
            break;
        
        case 'query failed':
            res.status(500).send('[ERROR] Server-side error occured');
            break;
    }
});


export default adminRoutes;