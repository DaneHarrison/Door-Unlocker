// /*
//     Responsible for sending/recieving data to/from arduino
// */
// const arduino = require('./Config/Addresses').arduino;
// const axios = require('axios');

// // can make this an observer?
// export default class Arduino { 

// /*
//     Core function; all others rely on this.  Sends a post request to arduino
// */
//     _postToServer(config) {
//         axios(config)
//     }


// /*
//     Availible requests
// */
//     async newSeq(pattern) {
//         let options = {
//             method: 'post',
//             proxy: false,
//             url: arduino.address,
//             data: {
//                 cmd: 'newSeq',
//                 pattern: pattern
//             }
//         }

//         this._postToServer(options);
//     }

//     async unlock() {
//         let options = {
//             method: 'post',
//             proxy: false,
//             url: arduino.address,
//             data: {
//                 cmd: 'unlock',
//                 nounce: this._nounce
//             }
//         }

//         this._postToServer(options);
//     }
// }