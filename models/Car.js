const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
    {
        vehicle_number: {
            type: String,
            unique: true,
            required: true,
            dropDups: true,
        },
        car_model: {
            type: String,
            trim: true,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        rent_per_day: {
            type: Number,
            required: true,
        },
        booked: {
            type: Boolean,
            default: false,
            required: true,
        },
        num_bookings: {
            type: Number,
            default: 0,
            required: true,
        },
    },
    { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
