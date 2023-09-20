const LOCKED = 'locked'
const NOT_ALLOWED = 'not allowed'
const ALLOWED = 'allowed'
const ADMIN = 'admin'

function numericizeAccess(access) {
    switch (access) {
        case 'locked':
            return 0;
        case 'not allowed':
            return 1;
        case 'allowed':
            return 2;
        case 'admin':
            return 3;
    }
}


export default {
    LOCKED,
    NOT_ALLOWED,
    ALLOWED,
    ADMIN,
    numericizeAccess,
};