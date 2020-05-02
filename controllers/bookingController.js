const Car = require("../models/Car");
const Booking = require("../models/Booking");

const auth = require("../middleware/auth");

// @route  GET api/bookings
// @desc   Get all bookings
// @access Private

const getAllBookings = async (req, res) => {
    const { id } = req.user;
    try {
        const bookings = await Booking.find({ customer_id: id });
        return res.json(bookings);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json([{ msg: "Server Error" }]);
    }
};

// @route  POST api/bookings
// @desc   Add a Booking
// @access Private

const addBooking = async (req, res) => {
    const { id, user_type } = req.user;
    const { car_id, issue_date, return_date } = req.body;
    if (issue_date > return_date) {
        return res
            .status(403)
            .json([{ msg: "Issue date should be greater than return date" }]);
    }
    try {
        const car = await Car.findById(car_id);
        if (!car) return res.status(404).json([{ msg: "Car not found" }]);
        let bookings = await Booking.find({
            car_id,
            $and: [
                { issue_date: { $gte: issue_date } },
                { return_date: { $lte: return_date } },
            ],
        });
        if (bookings.length > 0)
            return res
                .status(403)
                .json([{ msg: "Booking cannot be done. Slots Full" }]);
        car.booked = true;
        car.num_bookings += 1;
        let booking = new Booking({
            customer_id: id,
            car_id,
            issue_date,
            return_date,
        });
        await car.save();
        booking = await booking.save();
        return res.json(booking);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json([{ msg: "Server Error" }]);
    }
};

// @route   DELETE api/bookins/:id
// @desc    Delete a booking
// @access  Private

const deleteBooking = async (req, res) => {
    const { id, user_type } = req.user;
    try {
        const booking = await Booking.findById(req.params.booking_id);

        if (!booking)
            return res.status(404).json([{ msg: "Booking not found" }]);

        if (booking.customer_id.toString() !== id) {
            return res.status(401).json({ msg: "User not authorized" });
        }
        const car = await Car.findById(booking.car_id);
        car.num_bookings -= 1;
        if (car.num_bookings === 0) car.booked = false;
        await car.save();
        await booking.remove();
        res.json({ msg: "Booking removed" });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Booking not found" });
        }
        res.status(500).send("Server Error");
    }
};

// @route   PUT api/bookings/:id
// @desc    Edit a Booking
// @access  Private

const editBooking = async (req, res) => {
    const { id, user_type } = req.user;

    try {
        let booking = await Booking.findById(req.params.booking_id);

        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }
        const { issue_date, return_date } = req.body;
        let bookings = await Booking.find({
            car_id: booking.car_id,
            $and: [
                { issue_date: { $gte: issue_date } },
                { return_date: { $lte: return_date } },
            ],
        });
        if (bookings.length > 0)
            return res
                .status(403)
                .json([{ msg: "Booking cannot be Changed. Slots Full" }]);
        booking.issue_date = issue_date;
        booking.return_date = return_date;

        booking = await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Booking not found" });
        }
        res.status(500).send("Server Error");
    }
};
module.exports = {
    getAllBookings,
    addBooking,
    deleteBooking,
    editBooking,
};
