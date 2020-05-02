const jwt = require("jsonwebtoken");

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
    const jwtSecretKey = process.env.JWT_SEC;
    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        req.user = decoded.user;
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
