const jwt = require('jsonwebtoken');
const JWT_SECRET = "abscdg134##@"

function authenticate(req, res, next) {
    const token = req.headers.token;

    const decodedData = jwt.verify(token, JWT_SECRET);

    if (decodedData) {
        req.userId = decodedData.id;
        next()
    } else {
        res.status(403).send({
            message: "not found"
        })
    }

}

module.exports = {
    authenticate,
    JWT_SECRET
}