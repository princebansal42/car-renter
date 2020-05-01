const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const { registerController } = require("../../controllers");

// @route  GET api/register
// @desc   Get ALl users
// @access Public

router.get("/", registerController.getUserList);

// @route POST api/register
// @desc Register User
// @access Public

router.post("/", registerController.register);

module.exports = router;
