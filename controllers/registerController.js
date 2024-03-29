const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

// @route  GET api/register
// @desc   Get ALl users
// @access Public

const getUserList = async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
    }
};

// @route POST api/register
// @desc Register User
// @access Public

const register = async (req, res) => {
    const { name, email, password, user_type, address, phone } = req.body;

    try {
        // Check if user already exist
        const user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "User already exists" }] });
        }

        const newUser = new User({
            name,
            email,
            password,
            user_type,
            address,
            phone,
        });

        // Encrypt Password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        newUser.password = hash;

        await newUser.save();
        const payload = {
            user: {
                id: newUser.id,
                user_type: newUser.user_type,
            },
        };

        // return jsonwebtoken
        const jwtSecretKey = process.env.JWT_SEC;
        jwt.sign(payload, jwtSecretKey, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            return res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        // 500 - Server Error
        return res.status(500).json([{ msg: "Server Error" }]);
    }
};

module.exports = {
    getUserList,
    register,
};
