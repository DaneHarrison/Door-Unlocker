import logic from '../../logic/logicInstace.js'
import express from 'express';


let userRoutes = express.Router()

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