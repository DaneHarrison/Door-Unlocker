/*
    Starting point for the door unlocker, here the server is setup and the mode is set
*/
const {Server} = require('./Server');
const config = require('./Config/Settings');

let server = new Server(config.cookieSecret);

//Delay so the database can startup
setTimeout(() => { server.start(config.serverOpts); }, 5000);
