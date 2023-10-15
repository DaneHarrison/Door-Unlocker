import axios from 'axios';


export default class Arduino { 
    constructor(addr) {
        this._addr = addr;
    }


    _send(options) {
        try {
            axios(options)
        }
        catch(error) {
            console.log(error)
        }
    }

    prepare(mode, prepWork) {
        let options = {
            method: 'post',
            proxy: false,
            url: this._addr,
            data: {
                cmd: mode,
                prepWork: prepWork
            }
        }

        this._send(options)
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

        this._send(options)
    }
}