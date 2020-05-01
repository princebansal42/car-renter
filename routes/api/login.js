const router = require("express").Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const { loginController } = require("../../controllers");
// @route   GET api/login
// @desc    Get information of Authenticated User
// @access  Private

router.get("/", auth, loginController.loadUser);

// @route   POST api/login
// @desc    Authenticate the user and return token
// @access  Public

router.post("/", loginController.login);
module.exports = router;
