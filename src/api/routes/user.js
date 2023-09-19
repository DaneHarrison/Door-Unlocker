import express from 'express';


let userRoutes = express.Router()
// userRoutes.use((req, res, next) => {
//     console.log('Time: ', Date.now())
//     next()
// }) this._sesh.verify


userRoutes.get('/unlock/prep', async (req, res) => {
    // await this._logic.prepUnlock(req.signedCookies['SessionID']);
    // res.send(JSON.stringify(this._mode));
    res.send();
});

userRoutes.post('/unlock/attempt', (req, res) => {
    // this._logic.attemptUnlock(req.signedCookies['SessionID'], req.body.passcode);
    res.send();
});


export default userRoutes;