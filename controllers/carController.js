const Car = require("../models/Car");
const Booking = require("../models/Booking");

// @route  GET api/cars
// @desc   Get all cars
// @access Public

const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        return res.json(cars);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json([{ msg: "Server Error" }]);
    }
};

// @route  POST api/cars
// @desc   Add a Car
// @access Private

const addCar = async (req, res) => {
    // Check if the user adding car is an admin
    const { id, user_type } = req.user;
    console.log(user_type);
    if (user_type !== "admin")
        return res.status(401).json({
            errors: [{ msg: "Not Authorised to Access this area." }],
        });

    const { vehicle_number, car_model, capacity, rent_per_day } = req.body;
    try {
        let car = new Car({
            vehicle_number,
            car_model,
            capacity,
            rent_per_day,
        });
        car = await car.save();
        return res.json(car);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json([{ msg: "Server Error" }]);
    }
};

// @route   DELETE api/cars/:id
// @desc    Delete a Car
// @access  Private

const deleteCar = async (req, res) => {
    // Check if the user deleting car is an admin
    const { id, user_type } = req.user;
    if (user_type !== "admin")
        return res.status(401).json({
            errors: [{ msg: "User not authorized" }],
        });
    try {
        const car = await Car.findById(req.params.car_id);

        if (!car) return res.status(404).json([{ msg: "Car not found" }]);
        if (car.booked)
            return res.status(403).json([{ msg: "Car cannot be deleted" }]);
        await car.remove();
        res.json({ msg: "Car removed" });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json([{ msg: "Car not found" }]);
        }
        res.status(500).json([{ msg: "Server Error" }]);
    }
};

// @route   PUT api/cars/:id
// @desc    Edit a Car
// @access  Private

const editCar = async (req, res) => {
    // Check if the user editing Car is an admin
    const { id, user_type } = req.user;
    if (user_type !== "admin")
        return res.status(401).json({
            errors: [{ msg: "User not authorized" }],
        });
    try {
        let car = await Car.findById(req.params.car_id);

        if (!car) {
            return res.status(404).json([{ msg: "Car not found" }]);
        }
        if (car.booked)
            return res.status(403).json([{ msg: "Car cannot be Edited" }]);
        const { vehicle_number, car_model, capacity, rent_per_day } = req.body;
        car.vehicle_number = vehicle_number;
        car.car_model = car_model;
        car.capacity = capacity;
        car.rent_per_day = rent_per_day;

        car = await car.save();
        res.json(car);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json([{ msg: "Car not found" }]);
        }
        res.status(500).json([{ msg: "Server Error" }]);
    }
};

// @route   GET api/cars/fitler
// @desc    Filter Cars
// @access  Public
const filterCars = async (req, res) => {
    const {
        car_model,
        capacity,
        rent_per_day,
        issue_date,
        return_date,
    } = req.query;
    const query = {};
    if (car_model) query.car_model = car_model;
    if (capacity) query.capacity = { $gte: capacity };
    if (rent_per_day) query.rent_per_day = { $lte: rent_per_day };
    try {
        let cars = await Car.find({ query });
        if (issue_date && return_date) {
            cars = cars.filter(async (car) => {
                let bookings = await Booking.find({
                    car_id: car.id,
                    $and: [
                        { issue_date: { $gte: issue_date } },
                        { return_date: { $lte: return_date } },
                    ],
                });
                return bookings.length > 0;
            });
        }
        return res.json(cars);
    } catch (err) {
        console.error(err.message);
        res.status(500).json([{ msg: "Server Error" }]);
    }
};

module.exports = {
    getAllCars,
    addCar,
    deleteCar,
    editCar,
    filterCars,
};
