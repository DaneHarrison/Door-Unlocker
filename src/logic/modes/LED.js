/*
    If LED mode is chosen, the pattern logic is maintained here
*/
class LED {

    constructor(dbAdapter) {
        //In order they are: purple, green, blue, orangey-pink, red, black, yellow
        this.rgbColours = ['102:51:153', '137:209:254', '26:148:49', '255:131:98', '128:0:0', '0:0:0', '255:229:124'];                       
        this.pattern = null;
        this.user = null;

        this._adapter = dbAdapter;
    }

/*
    Modifies state variables
*/
    async createPattern(user) {
        let name = await this._adapter.checkDB({args: ['getName', user]});
        let sequence = [];
        let length = 5;

        if(name != 'Donna'){
            for(let i = 0; i < length; i++) {
                sequence[i] = this.rgbColours[Math.floor(Math.random() * this.rgbColours.length)];
            }
        }
        else {  //Donna only wants orangey-pink, green, blue
            for(let i = 0; i < length; i++) {
                sequence[i] = this.rgbColours[Math.floor(Math.random() * 3) + 1];
            }
        }

        this.user = user;
        this.pattern = sequence;
    }

    reset() {
        this.user = null;
        this.pattern = null;
    }

/*
    Reads state variables
*/
    getPattern() {
        return this.pattern;
    }

    patternMatches(user, indexPattern) {
        let pattern = [];
        
        for(let i = 0; i < this.pattern.length; i++) {
            pattern[i] = this.rgbColours[indexPattern[i]];
        }

        return this.user == user && this.pattern == pattern;
    }
}

module.exports = {
    LED
}