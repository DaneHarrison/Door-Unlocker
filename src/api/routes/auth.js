import secureConfig from '../security/config/secureCookie.js';
import Passport from 'passport';
import express from 'express';


let authRoutes = express.Router()

authRoutes.get('/login/', Passport.authenticate('google', {
    session: false,
    scope: ['email']
}));

authRoutes.get('/login/redirect/', Passport.authenticate('google', {session: false}), (req, res) => {
    if(req.user.sessionID && req.user.accessLvl) {
        res.cookie('sessionID', req.user.sessionID, secureConfig);
        res.cookie('accessLvl', req.accessLvl);
    }

    res.redirect('/');
})

authRoutes.get('/logout', (req, res) => {
    res.clearCookie('accessLvl');
    res.clearCookie('sessionID');
    res.redirect('/auth/login/');
    res.send();
});


export default authRoutes;