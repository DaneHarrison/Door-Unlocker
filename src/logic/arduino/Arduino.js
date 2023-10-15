import axios from 'axios';


export default class Arduino { 
    constructor(addr) {
        this._addr = addr;
    }


    prepare(mode, prepWork) {
        let options = {
            method: 'post',
            proxy: false,
            url: this._addr,
            data: {
                cmd: `prep:${mode}`,
                prepWork: prepWork
            }
        }

        axios(options).catch((error) => {
            console.log(error)
        })
    }

    unlock() {
        let options = {
            method: 'post',
            proxy: false,
            url: this._addr,
            data: {
                cmd: 'unlock'
            }
        }

        axios(options).catch((error) => {
            console.log(error)
        })
    }
}