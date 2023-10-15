import AuthRoutes from './api/routes/auth.js';
import UserRoutes from './api/routes/user.js';
import AdminRoutes from './api/routes/admin.js';
import Server from './api/server.js';
import readline from 'node:readline';
import 'dotenv/config'


// Load server and enable cli input
let server = new Server([AuthRoutes, UserRoutes, AdminRoutes])
let cli = readline.createInterface({      
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

// Process server requests and cli input until shutdown
server.start()
cli.on('line', async (input) => { 
    if(input == 'close') {
        console.log('Preparing for shutdown...')
        await sessionManager.clearAllSession()
        server.close()
        cli.close()
        
        console.log('[SUCCESS] Exiting safely!')
    }
});