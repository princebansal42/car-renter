const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    // Get Token from header
    const token = req.header("x-auth-token");

    // Check if not token
    if (!token) {
        return res.status(401).json({
            errors: [
                {
                    msg: "No token, authorization denied",
                },
            ],
        });
    }

    // Verify Token
    try {
        const decoded = jwt.verify(token, config.get("jwtSecretKey"));
        req.user = decoded.user;
        req.user_type = decoded.user_type;
        next();
    } catch (err) {
        return res.status(401).json({
            errors: [
                {
                    msg: "Token is not valid",
                },
            ],
        });
    }
};
