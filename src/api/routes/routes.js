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