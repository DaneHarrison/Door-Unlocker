import express from 'express';


let adminRoutes = express.Router()
// adminRoutes.use((req, res, next) => {
//     console.log('Time: ', Date.now())
//     next()
// }) this._sesh.restrict, this._sesh.verify,


adminRoutes.get('/fetchList/', async(req, res) => {
    res.send()
    // let listOfFriends = await this._logic.getListOfFriends();
    // res.send(JSON.stringify(listOfFriends));
});

adminRoutes.post('/modify/admin', async(req, res) => { 
    // if(req.body.role == 'notAllowed' || req.body.role == 'allowed') {
    //     this._logic.modUserPerms(req.signedCookies['SessionID'], req.body.name, req.body.role);
    // }
    // else {
    //     this._logic.lockAccount(req.signedCookies['SessionID'], 'User attempted to use unauthorized commands');
    // }
    res.send();
});

adminRoutes.post('/add/', async(req, res) => {
    // this._logic.createUser(req.signedCookies['SessionID'], req.body.name, req.body.email);
    res.send();
});

adminRoutes.post('/delete/', async(req, res) => { 
    // this._logic.deleteUser(req.body.name);
    res.send();
});


export default adminRoutes;