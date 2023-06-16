const Router = require('express').Router();
const Passport = require('passport');
const home = require('../Config/Addresses').server;


/*
    Login and logout
*/
Router.get('/login', (req, res) => {
    res.redirect('/auth/google');
    res.send();
});

Router.get('/logout', (req, res) => {
    res.clearCookie('role');
    res.clearCookie('SessionID');
    res.redirect('/auth/login');
    res.send();
});


/*
    Google authentication
*/
Router.get('/google', Passport.authenticate('google', {
    session: false,
    scope: ['email']
}));

Router.get('/google/redirect', Passport.authenticate('google', {session: false}), async (req, res) => {
    if(req.user.isValid) {
        res.cookie('SessionID', req.user.sessionID, {signed: true, expires: new Date(Date.now + 900000)});
    }

    res.redirect(home.address);
});


module.exports = Router;