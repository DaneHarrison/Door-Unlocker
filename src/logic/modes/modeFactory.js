import LED from './led.js';

export default class ModeFactory {
    setup(selector) {
        switch(selector) {
            case 'led':
                return new LED();
        }
    }
}