const jwt = require('jsonwebtoken')
require('dotenv').config()

const key = process.env.SECRET_KEY

const tokenVerify = (req, res, next) => {
    const token = req.headers['auth-token'];

    if(!token) {
        return res.status(401).json({
            message: 'Acceso denegado'
        })
    }

    try {
        jwt.verify(token, key, (err, decoded) => {
            if(err) {
                return res.status(401).json({
                    err
                })
            }
            req.user = decoded
            next()
        })
    } catch (error) {
        
    }
}

module.exports = tokenVerify