/*
    Server setup and request handling - redirects to authetication, authorization and logic as required
*/
const {ServerLogic} = require('./ServerLogic');
const {AuthSetup} = require('./Security/AuthSetup');
const {Session} = require('./Security/Session');
const auth = require('./Security/Auth');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');
var https = require('https');
var fs = require('fs');


class Server { 

    constructor(cookieSecret) {
        this._server = express();
        this._server.use(express.static('../Client'));
        this._server.use(cookieParser(cookieSecret));
        this._server.use(bodyParser.json());
        this._server.use(passport.initialize());
        this._server.use('/auth', auth);

        this._auth = new AuthSetup();
        this._logic = new ServerLogic();
        this._sesh = new Session();
        this._sysEmail;
        this._mode;
        this._https;
    }
    
/*
    Basic server commands   
*/
    start(config) {
        this._sysEmail = config.serverEmail;
        this._mode = config.serverMode;
        
        this._connect();
        this._prepUnlock();
        this._attemptUnlock();
        this._getListOfFriends();
        this._modPermsAsAdmin();
        this._addNewFriend();
        this._deleteUser();
        this._modPermsAsOwner();
        this._mailRecords();


        let httpsOptions =  {
            key: fs.readFileSync(__dirname + '/Config/SSL/key.pem'),
            cert: fs.readFileSync(__dirname + '/Config/SSL/cert.pem')
        }
        
        this._https = https.createServer(httpsOptions, this._server).listen(config.port);
    }

    stop() {
        this._https.close();
    }


/*
    Requests
*/  
    _connect() {
        this._server.get('/', this._sesh.assignRole, this._sesh.newToken, (req, res) => {
            res.sendFile(path.join(__dirname + '/../Client/webpage.html'));
        });
    }

    _prepUnlock() {
        this._server.get('/unlock/prep', this._sesh.verify, async(req, res) => {
            await this._logic.prepUnlock(req.signedCookies['SessionID']);
            res.send(JSON.stringify(this._mode));    
        });
    }

    _attemptUnlock() {
        this._server.post('/unlock/attempt', this._sesh.verify, (req, res) => {
            this._logic.attemptUnlock(req.signedCookies['SessionID'], req.body.passcode);
            res.send();
        });
    }

    _getListOfFriends() {
        this._server.get('/fetchList/', this._sesh.restrict, this._sesh.verify, async(req, res) => {
            let listOfFriends = await this._logic.getListOfFriends();
            res.send(JSON.stringify(listOfFriends));
        });
    }

    _modPermsAsAdmin() {
        this._server.post('/modify/admin', this._sesh.restrict, this._sesh.verify, (req, res) => { 
            if(req.body.role == 'notAllowed' || req.body.role == 'allowed') {
                this._logic.modUserPerms(req.signedCookies['SessionID'], req.body.name, req.body.role);
            }
            else {
                this._logic.lockAccount(req.signedCookies['SessionID'], 'User attempted to use unauthorized commands');
            }
            res.send();
        });
    }
    
    _addNewFriend() {
        this._server.post('/add/', this._sesh.restrict, this._sesh.verify, (req, res) => {
            this._logic.createUser(req.signedCookies['SessionID'], req.body.name, req.body.email);
            res.send();
        });
    }

    _deleteUser() {
        this._server.post('/delete/', this._sesh.restrict, this._sesh.verify, (req, res) => { 
            this._logic.deleteUser(req.body.name);
            res.send();
        });
    }

    _modPermsAsOwner() {
        this._server.post('/modify/owner', this._sesh.ownerOnly, this._sesh.verify, (req, res) => { 
            this._logic.modUserPerms(req.signedCookies['SessionID'], req.body.name, req.body.role);
            res.send();
        });
    }

    _mailRecords() {
        this._server.post('/send/records', this._sesh.ownerOnly, this._sesh.verify, (req, res) => {
            this._logic.emailLogs(this._sysEmail);
        });
    }
}

module.exports = {
    Server
}