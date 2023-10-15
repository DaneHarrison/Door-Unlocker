import 'dotenv/config'

export const secure = {
    maxAge: process.env.COOKIE_EXPIREY,
    httpOnly: true,
    signed: true,
    secure: true
}

export const expires = {
    maxAge: process.env.COOKIE_EXPIREY
}