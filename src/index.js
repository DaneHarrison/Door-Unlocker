import AdminRoutes from './api/routes/admin.js';
import UserRoutes from './api/routes/user.js';
import Server from './api/server.js/index.js';
import readline from 'node:readline'


let routes = [UserRoutes, AdminRoutes]
let server = new Server(routes)
let cli = readline.createInterface({      
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

server.start()
cli.on('line', (input) => { 
    if(input == 'close') {
        cli.close()
        server.close()
        console.log('Safe to exit ...')
    }
});