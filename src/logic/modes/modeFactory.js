import LED from './led.js';

export default class ModeFactory {
    setup(selector) {
        switch(selector) {
            case 'led':
                return new LED();
            default:
                console.log('[ERROR] please set an unlocking method in docker/.env')
                process.exit()
        }
    }
}