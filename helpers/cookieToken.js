const getJwtToken = require("./getJwtToken");

const cookieToken = (data, res) => {
    const token = getJwtToken(data);
    const options = {
        expires: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        data
    });
}

module.exports = cookieToken;