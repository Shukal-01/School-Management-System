const mongoose = require("mongoose");

const transportationSchema = new mongoose.Schema(
    {
        routeName: { type: String, required: true },
        driverName: { type: String, required: true },
        vehicleNumber: { type: String, required: true },
        licenseNumber: { type: String, required: true },
        phoneNumber: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transportation", transportationSchema);