const router = require("express").Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");

// @route   GET api/login
// @desc    Get information of Authenticated User
// @access  Private

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json([{ msg: "Server Error" }]);
    }
});

// @route   POST api/login
// @desc    Authenticate the user and return token
// @access  Public

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "No such user exists" }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                errors: [{ msg: "Password do not Match. Try Again." }],
            });
        }

        const { id, user_type } = user;
        const payload = {
            user: {
                id,
                user_type,
            },
        };
        jwt.sign(
            payload,
            config.get("jwtSecretKey"),
            {
                expiresIn: 360000,
            },
            (err, token) => {
                if (err) throw err;
                return res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        return res.status(500).json([{ msg: "Server Error" }]);
    }
});
module.exports = router;
