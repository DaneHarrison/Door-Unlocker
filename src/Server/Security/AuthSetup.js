const {DBAdapter} = require('../DBAdapter');
const Puid = require('puid');
const GoogleLogIn = require('passport-google-oauth20').Strategy;
const Passport = require('passport');
const Keys = require('../Config/Keys');
const home = require('../Config/Addresses').server;


class AuthSetup {

    constructor() {
        this._adapter = new DBAdapter();
        this._idHandler = new Puid();
        this._googleSetup();
    }

    _googleSetup() {
        Passport.use(
            new GoogleLogIn({
                callbackURL: home.address + '/auth/google/redirect',
                clientID: Keys.google.clientID,
                clientSecret: Keys.google.clientSecret,
            }, async (accessToken, refreshToken, email, done) => {
                let user = [{'sessionID': '','isValid': ''}];
                let userEmail = email._json.email;
                let unique = false;
                
                do {
                    user.sessionID = this._idHandler.generate() + Math.random().toString(20).substr(2, 6);
                    unique = await this._adapter.checkDB({args: ['isUnique', 'SessionID', user.sessionID]});
                } while(!unique);

                let userExists = await this._adapter.checkDB({args: ['authenticate', userEmail, user.sessionID]});
                user.isValid = userExists[0] == 'True';

                return done(null, user);
            })
        );
    }
}

module.exports = {
    AuthSetup
}