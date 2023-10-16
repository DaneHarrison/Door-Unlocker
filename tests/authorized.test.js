import { authorizer } from '../src/api/security/authorizer.js';


let mockReq = {};
let mockRes = {};
let mockNext = jest.fn();

describe('Authorizer Class', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set allowed access level', () => {
        authorizer.setAllowedLvl(mockReq, mockRes, mockNext);
        expect(mockReq.reqAccessLvl).toBe('allowed');
        expect(mockNext).toHaveBeenCalled();
    });

    it('should set admin access level', () => {
        authorizer.setAdminLvl(mockReq, mockRes, mockNext);
        expect(mockReq.reqAccessLvl).toBe('admin');
        expect(mockNext).toHaveBeenCalled();
    });

    it('should verify access with authorized access level', () => {
        mockReq.accessLvl = 'admin';
        mockReq.reqAccessLvl = 'allowed';

        authorizer.verifyAccess(mockReq, mockRes, mockNext);

        expect(mockReq.authorized).toBe(true);
        expect(mockNext).toHaveBeenCalled();
    });

    it('should verify access with unauthorized access level', () => {
        mockReq.accessLvl = 'user';
        mockReq.reqAccessLvl = 'admin';

        authorizer.verifyAccess(mockReq, mockRes, mockNext);

        expect(mockReq.authorized).toBe(false);
        expect(mockNext).toHaveBeenCalled();
    });
});
