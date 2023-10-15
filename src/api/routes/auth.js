import {sessionManager} from '../security/sessionManager.js';
import {authenticator} from '../security/authenticator.js';
import express from 'express';

const authRoutes = express.Router()

authRoutes.post('/login/requestToken/', authenticator.addSession, async (req, res) => { //    
    if(req.successful) 
        authenticator.emailAccessLink('/login/loadToken/', req.body.email, req.sessionID)

    res.sendStatus(200)  
})

authRoutes.get('/login/loadToken/:token/', authenticator.setup, sessionManager.load, sessionManager.update, (req, res) => {
    res.redirect('/');
})

authRoutes.get('/logout/', sessionManager.load, sessionManager.deleteSession, (req, res) => {  //delete session
    res.clearCookie('sessionID');
    res.clearCookie('role');
    res.redirect('/');
});


export default authRoutes;