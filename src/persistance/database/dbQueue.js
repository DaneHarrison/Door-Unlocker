import pgnode from 'pg'


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
        conn = this._deployClient()
        await conn.connect()

        while(this._currNumWorkers <= this._numWorkers) { 
            task = await this.getNextTask();
            await task(conn); // execute task that we get back with the given connection
        }

        this._currNumWorkers -= 1; 
        conn.end();
    }

    _deployClient() {
        return new pgnode.Client({
            database: 'postgres',
            host: 'localhost',
            port: 5432,
            user: 'user',
            password: 'password'
            // database: String(process.env.DB),
            // host: String(process.env.DB_HOST),
            // port: process.env.DB_PORT,
            // user: String(process.env.DB_USER),
            // password: String(process.env.DB_PWD)
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

    runTask(query) {
        let taskPromise

        return new Promise((resolve, reject) => {            
            let taskWrapper = async (conn) => {
                taskPromise = conn.query(query)
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