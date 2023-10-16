import LED from '../src/logic/modes/LED.js';


describe('LED Class', () => {
    let led;

    beforeEach(() => {
        led = new LED();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it('should have a sequence length of 5', () => {
        expect(LED.SEQ_LENGTH).toBe(5);
    });

    it('should initialize with the correct colors and null pattern', () => {
        expect(led.colours).toEqual(['137:209:254', '26:148:49', '255:131:98', '102:51:153', '128:0:0', '0:0:0', '255:229:124']);
        expect(led.pattern).toBeNull();
    });

    it('should reset the LED instance when calling _reset', () => {
        led._reset();
        expect(led.user).toBeNull();
        expect(led.pattern).toBeNull();
    });

    it('should prepare a pattern for the user', () => {
        let user = 'John';
        let pattern = led.prepare(user);

        expect(pattern).not.toBeNull();
        expect(pattern).toHaveLength(LED.SEQ_LENGTH);
        expect(led.user).toBe(user);
        expect(led.pattern).toEqual(pattern);
    });

    it('should only allow correct entries for the user', () => {
        let user = 'Donna';
        let pattern = led.prepare(user);
        let correctEntry = pattern.slice(); // Copy the pattern
        let wrongEntry = pattern.slice();
        wrongEntry[0] = '0:0:0'; // Make the first entry wrong

        // Correct entry
        expect(led.determineEntry(user, correctEntry)).toBe(true);

        // Wrong entry
        expect(led.determineEntry(user, wrongEntry)).toBe(false);

        // Entry with the wrong user
        expect(led.determineEntry('John', correctEntry)).toBe(false);
    });

    it('should reset after determining a correct entry', () => {
        let user = 'Donna';
        let pattern = led.prepare(user);

        // Correct entry
        expect(led.determineEntry(user, pattern)).toBe(true);

        // After a correct entry, the LED instance should be reset
        expect(led.user).toBeNull();
        expect(led.pattern).toBeNull();
    });

    it('should not determine entry for an incorrect length of input', () => {
        let user = 'Donna';
        let pattern = led.prepare(user);

        // Incorrect entry length
        let incompleteEntry = pattern.slice(0, LED.SEQ_LENGTH - 1);
        expect(led.determineEntry(user, incompleteEntry)).toBe(false);
    });
});