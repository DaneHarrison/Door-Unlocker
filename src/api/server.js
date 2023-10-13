import fs from 'fs';
import express from 'express';
import https from 'https';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';


export default class Server {
    constructor(routes) {
        this._server = express();

        this._server.use(express.static(process.cwd()+ '/presentation/'));
        this._server.use(cookieParser(process.env.COOKIE_SECRET));
        this._server.use(passport.initialize());
        this._server.use(bodyParser.json());
        this._server.locals.sessions = []
        
        for(let route of routes) {
            this._server.use('/', route);
        }

        this._server.get('/', (req, res) => {
            res.sendFile(path.join(process.cwd() + '/presentation/webpage.html'));
        });
    }
    

    start() {
        let httpsParams = this._loadHTTPSParams()
        
        this._server = https.createServer(httpsParams, this._server).listen(process.env.PORT);
        console.log(`[SUCCESS] HTTPS server live at ${process.env.ADDRESS}:${process.env.PORT}`)
    }

    close() {
        this._server.close();
        //this.clearSessions();
        console.log('\t- shut down here')
    } 

    _loadHTTPSParams() {
        let keyFile = process.cwd() + process.env.SSL_KEY_FILE
        let certFile = process.cwd() + process.env.SSL_CERT_FILE

        if(!fs.existsSync(keyFile) || !fs.existsSync(certFile)) {
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