const express = require("express");
const router = express.Router();
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
