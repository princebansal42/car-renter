const express = require("express");
const router = express.Router();
const Car = require("../../models/Car");
const Booking = require("../../models/Booking");
const { bookingController } = require("../../controllers");
const auth = require("../../middleware/auth");

// @route  GET api/bookings
// @desc   Get all bookings
// @access Private

router.get("/", auth, bookingController.getAllBookings);

// @route  POST api/bookings
// @desc   Add a Booking
// @access Private

router.post("/", auth, bookingController.addBooking);

// @route   DELETE api/bookins/:id
// @desc    Delete a booking
// @access  Private

router.delete("/:booking_id", auth, bookingController.deleteBooking);

// @route   PUT api/bookings/:id
// @desc    Edit a Booking
// @access  Private

router.put("/:booking_id", auth, bookingController.editBooking);
module.exports = router;
