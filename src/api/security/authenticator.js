import {Strategy as GoogleLogIn} from 'passport-google-oauth20';
import Passport from "passport";


export default class Authenticator {
    constructor(sessionManager) {
        this._sessionManager = sessionManager
        this._googleSetup();
    }


    _googleSetup() {
        let user = null;

        Passport.use(
            new GoogleLogIn({
                callbackURL: process.env.ADDRESS,
                clientID: process.env.GOOGLE_AUTH_ID,
                clientSecret: process.env.GOOGLE_AUTH_SECRET
            }, async (accessToken, refreshToken, email, done) => {
                user =  await this._sessionManager.addSession(email._json.email)

                return done(null, user);
            })
        );
    }
}