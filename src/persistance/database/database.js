import DBQueue from './dbQueue.js';


class Database {
    DEPLOYMENT_QUEUE_LENGTH = 20 // How many messages there should be per worker before adding another
    CLIENT_TIMEOUT = 180000 // 3 minutes in milliseconds
    MAX_CLIENTS = 10
    
    constructor() {
        this._queue = new DBQueue();
        this._killTimer = null;
    }


    _killWorker() {
        this._queue.runTask(null)
    }

    async queueRequest(query) {
        this._maintainWorkers()

        return await this._queue.runTask(query)
    }

    _maintainWorkers() {
        let workerCount = this._queue.currWorkerCount
        let taskCount = this._queue.taskCount
        let numChanges
        
        if(taskCount > workerCount * Database.DEPLOYMENT_QUEUE_LENGTH && workerCount < Database.MAX_CLIENTS) {
            numChanges = this._queue.increaseNumWorkers()

            for(let i = 0; i < numChanges; i++) {
                this._queue.spawnWorker()
            }
        }
        else if(!this._killTimer && this._readyToCut()) {
            this._killTimer = this._createTimeout()
        }
    }

    _createTimeout() {
        return setTimeout(() => {
            let numChanges

            if(this._readyToCut()) {
                numChanges = this._queue.cutNumWorkers()

                for(let i = 0; i < numChanges; i++) {
                    this._killWorker()
                }
            }

            this._killTimer = null
        }, Database.CLIENT_TIMEOUT)
    }

    _readyToCut() {
        return this._queue.taskCount < 0.5 * this._queue.currWorkerCount * Database.DEPLOYMENT_QUEUE_LENGTH
    }
}


export const db = new Database();