import pgnode from 'pg'
import 'dotenv/config'


export default class DBQueue {
    constructor(numWorkers = 1) {
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
            await task(conn)    // execute task that we get back with the given connection
        }

        this._currNumWorkers -= 1; 
        conn.end();
    }

    _deployClient() {
        return new pgnode.Client({
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

    runTask(query) {
        return new Promise((resolve, reject) => {            
            let taskWrapper = async (conn) => {
                return conn.query(query).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    console.error('[ERROR] Promise rejected with: ', error);
                    reject(error);
                });
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