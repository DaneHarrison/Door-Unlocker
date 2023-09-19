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
import fs from 'fs';
import express from 'express';
import 'dotenv/config' //this can be deleted later
import https from 'https';
import path from 'path'
//const process = require('process');

export default class Server { 
    constructor(routes) {
        this._server = express();
        // this._server.use(passport.initialize());
        // this._server.use(express.static('../Client'));

        // for(let route of routes) {
        //     this._server.use('/', route);
        // }

        this._server.get('/', (req, res) => {
            console.log('good')
            res.sendFile(path.join(process.cwd() + '/presentation/webpage.html'));
        });
    }
    

    start() {
        let httpsParams = this._loadHTTPSParams()
        
        this._server = https.createServer(httpsParams, this._server).listen(process.env.PORT);
        console.log(`[SUCCESS] secure server live at ${process.env.PORT}`)
    }

    close() {
        this._server.close();
        console.log('server is closed')
    } 

    _loadHTTPSParams() {
        let keyFile = process.cwd() + process.env.SSL_KEY_FILE
        let certFile = process.cwd() + process.env.SSL_CERT_FILE

        if (!fs.existsSync(keyFile) || !fs.existsSync(certFile)) {
            console.log(`[ERROR] SSL configration files missing please run:
                openssl req -newkey rsa:2048 -new -nodes -x509 -days 365 -keyout .${process.env.SSL_KEY_FILE} -out .${process.env.SSL_CERT_FILE}`
            )
            
            process.exit()
        }

        return {
            key: fs.readFileSync(keyFile),
            cert: fs.readFileSync(certFile)
        }   
    }
}