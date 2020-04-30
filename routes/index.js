const router = require("express").Router();
const login = require("./api/login");
const register = require("./api/register");
const cars = require("./api/cars");
const bookings = require("./api/bookings");

router.use("/api/login", login);
router.use("/api/register", register);
router.use("/api/cars", cars);
router.use("/api/bookings", bookings);
module.exports = router;
