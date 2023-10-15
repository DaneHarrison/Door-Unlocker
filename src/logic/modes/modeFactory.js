import LED from './led.js';


export default class ModeFactory {
    init(selector) {
        switch(selector) {
            case 'LED':
                return new LED();
                
            default:
                console.log('[ERROR] please set an unlocking method in docker/.env')
                process.exit()
        }
    }
}