// /*
//     Server setup and request handling - redirects to authetication, authorization and logic as required
// */
// const {ServerLogic} = require('./ServerLogic');
// const {AuthSetup} = require('./Security/AuthSetup');
// const {Session} = require('./Security/Session');
// const auth = require('./Security/Auth');

// const express = require('express');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const passport = require('passport');
// const path = require('path');
// var https = require('https');
// var fs = require('fs');
// need to load .env

import 'dotenv/config'

export default class Server { 
    constructor() {
        this._server = express();
        this._server.use(express.static('../Client'));
        
        //this._server.use(cookieParser(cookieSecret));
        //this._server.use(bodyParser.json());
        //this._server.use(passport.initialize());
        //this._server.use('/auth', auth);

        this._server = https.createServer(httpsOptions, this._server).listen(config.port);

        // load routes
        // load logic
        // pass a reader in -> pass in stop here
        // create task queue
    }
    
    stop() {
        this._https.close();
    } 
}