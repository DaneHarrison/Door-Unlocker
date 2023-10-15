import {sessionManager} from '../security/sessionManager.js';
import {authorizer} from '../security/authorizer.js';
import {logic} from '../../logic/logic.js'
import express from 'express';

const userRoutes = express.Router()
userRoutes.use(sessionManager.load, authorizer.setAllowedLvl, authorizer.verifyAccess, sessionManager.update)


userRoutes.get('/unlock/prep/', async (req, res) => {
    // await this._logic.prepUnlock(req.signedCookies['SessionID']);
    // res.send(JSON.stringify(this._mode));
    res.send();
});

userRoutes.post('/unlock/attempt/', (req, res) => {
    // this._logic.attemptUnlock(req.signedCookies['SessionID'], req.body.passcode);
    res.send();
});


export default userRoutes;