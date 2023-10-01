export default class DBQueue {
    constructor(numWorkers = 2) {
        this._numWorkers = numWorkers
        this._currNumWorkers = 0;
        this._tasks = []
        this._workers = []

        for(let i = 0; i < this._numWorkers; i++) {
            this.spawnWorker()
        }
    }


    get numTasks() {
        return this._tasks.length;
    }

    get currNumWorkers() {
        return this._currNumWorkers;
    }

    async spawnWorker() {
        let task, conn;

        this._currNumWorkers += 1;
        while(this._currNumWorkers <= this._numWorkers) { 
            try {
                conn = this._deployClient
                task = await this.getNextTask();
                await task(conn);
            }
            catch(error) {
                console.log(error)
            }
        }

        this._currNumWorkers -= 1; 
        conn.end();
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

    async getNextTask() {
        return new Promise((resolve) => {
            if(this._tasks.length !== 0) {
                return resolve(this._tasks.shift())
            } 

            this._workers.push(resolve)
        })
    }

    runTask(task) {
        return new Promise((resolve, reject) => {
            let taskWrapper = async (client) => {
                let taskPromise = task(client)

                taskPromise.then(resolve, reject)

                return taskPromise
            }

            if(this._workers.length !== 0) {
                let worker = this._workers.shift()
                worker(taskWrapper)
            }
            else {
                this._tasks.push(taskWrapper)
            }
        })
    }
}