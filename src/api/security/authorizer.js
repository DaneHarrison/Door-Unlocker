import Access from'./config/accessLevels.js';


class Authorizer {
    setAllowedLvl(req, res, next) {
        req.reqAccessLvl = Access.ALLOWED
        
        next()
    }

    setAdminLvl(req, res, next) {
        req.reqAccessLvl = Access.ADMIN

        next()
    }

    verifyAccess(req, res, next) {
        req.authorized = false

        if(req.accessLvl && req.reqAccessLvl)
            req.authorized = Access.numericizeAccess(req.accessLvl) >= Access.numericizeAccess(req.reqAccessLvl)

        next()
    }
}


export const authorizer = new Authorizer();