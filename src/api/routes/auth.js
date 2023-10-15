import {sessionManager} from '../security/sessionManager.js';
import {authenticator} from '../security/authenticator.js';
import express from 'express';

const authRoutes = express.Router();


authRoutes.post('/login/requestToken/', authenticator.addSession, async (req, res) => {   
    switch(req.successful) {
        case true:
            authenticator.emailAccessLink('/login/loadToken/', req.body.email, req.sessionID);
            res.sendStatus(200);
            break;
        
        case false:
            res.status(401).send('[ERROR] this email is not registered, please contact your system maintainer');
            break;
    }
})

authRoutes.get('/login/loadToken/:token/', authenticator.setup, sessionManager.load, sessionManager.update, (req, res) => {
    switch(req.successful) {
        case true:
            res.redirect('/');
            break;
        
        case false:
            res.status(401).send('[ERROR] could not locate session, either it expired or was already used');
            break;
    }
    
})

authRoutes.get('/logout/', sessionManager.load, sessionManager.deleteSession, (req, res) => {
    switch(req.successful) {
        case true:
            res.clearCookie('sessionID');
            res.clearCookie('role');
            res.redirect('/');
            break
        
        case false:
            res.status(401).send('[ERROR] session expired');
            break;
    }
});


export default authRoutes;