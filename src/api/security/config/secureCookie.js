const secureCookie = {
    maxAge: process.env.COOKIE_EXPIREY,
    domain: process.env.ADDRESS, 
    httpOnly: true,
    signed: true,
    secure: true
}

export default secureCookie;