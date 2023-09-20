export default class Mode {
    static DELAY = 90000   // 1.5 minute (in miliseconds)

    constructor() {
        if (this.constructor == Mode) {
            throw new Error("Mode is an abstract class and can't be instantiated.");
        }

        this.user = null;
        this.timeout = null;
    }
  
    
    prepare() {
        throw new Error("Method 'prepare()' must be implemented.");
    }
  
    determineEntry() {
        throw new Error("Method 'determineEntry()' must be implemented.");
    }
}