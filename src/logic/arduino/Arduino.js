import axios from 'axios';


export default class Arduino { 
    constructor(addr) {
        this._addr = addr;
    }


    _sendRequest(options) {
        try {
            axios(options).catch((error) => {});
        }
        catch(error) {
            console.log(error);
        }
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
        };

        this._sendRequest(options);
    }

    unlock() {
        let options = {
            method: 'post',
            proxy: false,
            url: this._addr,
            data: {
                cmd: 'unlock'
            }
        };

        this._sendRequest(options);
    }
}