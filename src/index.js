import SessionManager from './api/security/sessionManager'
import Authenticator from './api/security/authenticator'
import Authorizer from './api/security/authorizer'
import AdminRoutes from './api/routes/admin';
import UserRoutes from './api/routes/user';
import AuthRoutes from './api/routes/auth';
import Server from './api/server';
import readline from 'node:readline'


// Loads the middleware for their respective routers
let sessionManager = new SessionManager()
let authorizer = new Authorizer()
new Authenticator(sessionManager)

UserRoutes.use(sessionManager.load, authorizer.setAllowedLvl, authorizer.verifyAccess, sessionManager.update)
AdminRoutes.use(sessionManager.load, authorizer.setAdminLvl, authorizer.verifyAccess, sessionManager.update)


// Loads server and enables cli input
let server = new Server([AuthRoutes, UserRoutes, AdminRoutes])
let cli = readline.createInterface({      
    input: process.stdin,
    output: process.stdout,
    terminal: false
})


// Processes requests and cli input
server.start()
cli.on('line', (input) => { 
    if(input == 'close') {
        console.log('Preparing for shutdown...')
        sessionManager.clearAllSession()
        server.close()
        cli.close()
        
        console.log('[SUCCESS] Safe to exit!')
    }
});