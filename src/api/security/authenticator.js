import {sessionManager} from './sessionManager.js';
import nodemailer from 'nodemailer';
import 'dotenv/config';


class Authenticator {
    constructor() {
        this._emailer = nodemailer.createTransport({
            service: process.env.EMAIL_VENDOR,
            auth: {
                user: String(process.env.EMAIL),
                pass: String(process.env.EMAIL_PWD)
            }
        });        
    }


    async addSession(req, res, next) {
        req.sessionID = sessionManager.createToken();
        req.successful = await sessionManager.createSession(req.body.email, req.sessionID);

        next();
    }

    setup(req, res, next) {
        req.sessionID = req.params.token;

        next();
    }

    emailAccessLink(path, recipient, sessionID) {
        let email = {
            from: process.env.EMAIL,
            to: recipient,
            subject: 'access link',
            text: 'Hello!\n' + 
            'Please use the link below to access the Door-Unlocker service, however, note that it will only be valid for a short time [5 minutes]\n\n' + 
            `Link: ${process.env.ADDRESS}:${process.env.PORT}${path}${sessionID}/\n\n` +  
            'Hope you have a great rest of your day! :)'
        };

        this._emailer.sendMail(email);
    }
}


export const authenticator = new Authenticator();