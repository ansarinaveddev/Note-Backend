const jwt = require('jsonwebtoken');

const getJwtToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "2d"
    })
}

module.exports = getJwtToken;