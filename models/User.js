const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        user_type: {
            type: String,
            get: (v) => v.toLowerCase(),
            set: (v) => v.toLowerCase(),
            enum: ["admin", "customer"],
            required: true,
        },
        address: {
            type: String,
            trim: true,
            required: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
