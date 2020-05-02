const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { carController } = require("../../controllers");
// @route  GET api/cars
// @desc   Get all cars
// @access Public

router.get("/", carController.getAllCars);

// @route  POST api/cars
// @desc   Add a Car
// @access Private

router.post("/", auth, carController.addCar);

// @route   DELETE api/cars/:id
// @desc    Delete a Car
// @access  Private

router.delete("/:car_id", auth, carController.deleteCar);

// @route   PUT api/cars/:id
// @desc    Edit a Car
// @access  Private

router.put("/:car_id", auth, carController.editCar);

// @route   GET api/cars/fitler
// @desc    Filter Cars
// @access  Public
router.get("/filter", carController.filterCars);
module.exports = router;
