export default class Database {
    IDLE_KILL = 5
    QUEUE_LENGTH_b4_DEPLOYMENT
    NEW_CLIENT_DELAY = 5
    MAX_CLIENTS = 5
    
    constructor() {
        this._queue = PriorityQueue()
        this._pool = []
    }


    _deployClient() {
        return client = new Client({
            database: process.env.DB,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PWD
        })
    }

    get numPending() {
        return this._queue.length
    }

    queueRequest() {

    }
    //queue
    //create clients dynamically
    //get next from queue
    //do when timeout cut connections in half unless only 1 prefer even numbers when pool reaches empty
}