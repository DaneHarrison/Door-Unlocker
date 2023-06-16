const axios = require('axios').default;
const Cookies = require('js-cookie');

class Utils {

    getRole() {
        return Cookies.get('role');
    }

    getSessionID() {    //do we ever even use this????
        return Cookies.get('SessionID');
    }

    async getFromServer(config) {
        let data = new Promise((resolve) => {
            axios(config).then(function(response){
                return resolve(response.data);
            })
        });
 
        return data;
    }

    postToServer(config) {
        axios(config)
    }

    getObjLength(object) {
        let length = 0;

        for(let key in object) {
            if(object.hasOwnProperty(key)) {
                length++;
            }
        }

        return length;
    }
}

module.exports = {
    Utils
}