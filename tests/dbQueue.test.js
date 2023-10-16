import DBQueue from '../src/persistance/database/dbQueue.js';


// Mock the 'pg' library to avoid real database connections in tests
jest.mock('pg', () => {
    return {
        Client: jest.fn(() => ({
            connect: jest.fn(),
            end: jest.fn(),
            query: jest.fn(() => {
                return true
            }
            ),
        })),
    };
});

describe('DBQueue Class', () => {
    let dbQueue;

    beforeEach(() => {
        dbQueue = new DBQueue(1);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should increase the number of workers', () => {
        let increment = dbQueue.increaseNumWorkers(1);
        expect(increment).toBe(1);

        expect(dbQueue._currNumWorkers == 1)
        dbQueue.spawnWorker()
        expect(dbQueue._currNumWorkers == 2)

    });

    it('should cut the number of workers', () => {
        let cut = dbQueue.cutNumWorkers(2);
        expect(cut).toBe(0);

        expect(dbQueue._currNumWorkers == 1)
        expect(dbQueue.runTask(null) == null)
        expect(dbQueue._currNumWorkers == 0)
    });
});
