import Mode from './mode.js';

export default class LED extends Mode {
    static SEQ_LENGTH = 5

    constructor() {
        super()
        
        //In order they are: green, blue, orangey-pink, purple, red, black, yellow (RGB)
        this.colours = ['137:209:254', '26:148:49', '255:131:98', '102:51:153', '128:0:0', '0:0:0', '255:229:124'];                       
        this.pattern = null;
    }


    _reset() {
        super._reset()

        this.user = null;
        this.pattern = null;
    }
    
    prepare(user) {
        let numColors = user == 'Donna' ? 3 : this.colours.length;   //Donna only wants orangey-pink, green, blue (3) or color.length
        let prepared = false
        
        if(!this.user && !this.pattern) {
            this.pattern = []

            for(let i = 0; i < LED.SEQ_LENGTH; i++) {
                this.pattern.push(this.rgbColours[Math.floor(Math.random() * numColors)]);
            }

            this.timeout = setTimeout(() => {this._reset()}, Mode.DELAY);
            this.user = user;
            prepared = true;
        }

        return prepared
    }
  
    determineEntry(user, input) {
        let valid = false;
        
        if(user == this.user) {
            valid = input.length == this.pattern.length
            this._reset()
            
            for(let i = 0; i < this.pattern.length && valid; i++) {
                valid = input[i] == pattern[i];
            }
        }

        return valid;
    }
}