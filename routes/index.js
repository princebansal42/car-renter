const router = reqire("express").Router();
const login = require("./api/login");
const register = require("./api/register");

router.use("/api/login", login);
router.use("/api/register", register);

module.exports = router;
