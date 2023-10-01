import SessionManager from './api/security/sessionManager.js';
import Authenticator from './api/security/authenticator.js';
import Authorizer from './api/security/authorizer.js';
import AdminRoutes from './api/routes/admin.js';
import UserRoutes from './api/routes/user.js';
import AuthRoutes from './api/routes/auth.js';
import Server from './api/server.js';
import readline from 'node:readline';
import 'dotenv/config'


// Loads middleware onto their respective routers
let sessionManager = new SessionManager()
let authorizer = new Authorizer()
new Authenticator(sessionManager)

//UserRoutes.use(sessionManager.load, authorizer.setAllowedLvl, authorizer.verifyAccess, sessionManager.update)
AdminRoutes.use(sessionManager.load, authorizer.setAdminLvl, authorizer.verifyAccess, sessionManager.update)


// Load server and enable cli input
let server = new Server([AuthRoutes, UserRoutes, AdminRoutes])
let cli = readline.createInterface({      
    input: process.stdin,
    output: process.stdout,
    terminal: false
})


// Process server requests and cli input until shutdown
server.start()
cli.on('line', (input) => { 
    if(input == 'close') {
        console.log('Preparing for shutdown...')
        //sessionManager.clearAllSession()
        server.close()
        cli.close()
        
        console.log('[SUCCESS] Exiting safely!')
    }
});