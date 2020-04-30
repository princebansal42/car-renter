const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        car_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true,
        },
        issue_date: {
            type: Date,
            required: true,
        },
        return_date: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
