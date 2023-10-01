import DBQueue from './dbQueue.js';


export default class Database {
    DEPLOYMENT_QUEUE_LENGTH = 10
    CLIENT_TIMEOUT = 180000 // 3 minutes in milliseconds
    MAX_CLIENTS = 10
    
    constructor() {
        this._queue = new DBQueue();
        this._killTimer = null;
    }


    get numPending() {
        return this._queue.numTasks
    }

    async queueRequest(request) { //this part is responsible for managing new requets -> check num workers is atleast 1
        //get request and convert to a function to run for workers that simply require the connection

        return await this.runTask(request)
    }

    _maintainWorkers() {
        //also check that no more than 5 are waiting
            //queue
        //create clients dynamically
        //get next from queue
        //do when timeout cut connections in half unless only 1 prefer even numbers when pool reaches empty
    }
}