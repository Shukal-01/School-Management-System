const Transportation = require("../models/transportation.js");

// 📌 Add a new transportation record
const addTransportation = async (req, res) => {
    try {
        const { routeName, driverName, vehicleNumber, licenseNumber, phoneNumber } = req.body;

        const newTransportation = new Transportation({
            routeName,
            driverName,
            vehicleNumber,
            licenseNumber,
            phoneNumber,
        });

        await newTransportation.save();

        res.status(201).json({
            success: true,
            message: "Transportation added successfully",
            data: newTransportation,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllTransportation = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            routeName,
            driverName,
            vehicleNumber,
            search,
            phoneNumber
        } = req.query;

        const query = {};

        // 🎯 Filters
        if (routeName) {
            query.routeName = { $regex: routeName, $options: "i" };
        }

        if (driverName) {
            query.driverName = { $regex: driverName, $options: "i" };
        }

        if (vehicleNumber) {
            query.vehicleNumber = { $regex: vehicleNumber, $options: "i" };
        }

        if (phoneNumber) {
            query.phoneNumber = { $regex: phoneNumber, $options: "i" };
        }
        
        // 🔍 Global search
        if (search) {
            query.$or = [
                { routeName: { $regex: search, $options: "i" } },
                { driverName: { $regex: search, $options: "i" } },
                { vehicleNumber: { $regex: search, $options: "i" } },
                { licenseNumber: { $regex: search, $options: "i" } },
                { phoneNumber: { $regex: search, $options: "i" } },
            ];
        }

        const transportations = await Transportation.find(query)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Transportation.countDocuments(query);

        res.status(200).json({
            success: true,
            data: transportations,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// 📌 Get transportation by ID
const getTransportationById = async (req, res) => {
    try {
        const transportation = await Transportation.findById(req.params.id);
        if (!transportation) {
            return res.status(404).json({ success: false, message: "Transportation not found" });
        }
        res.status(200).json({ success: true, data: transportation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Update transportation
const updateTransportation = async (req, res) => {
    try {
        const { routeName, driverName, vehicleNumber, licenseNumber, phoneNumber } = req.body;

        const updatedTransportation = await Transportation.findByIdAndUpdate(
            req.params.id,
            { routeName, driverName, vehicleNumber, licenseNumber, phoneNumber },
            { new: true }
        );

        if (!updatedTransportation) {
            return res.status(404).json({ success: false, message: "Transportation not found" });
        }

        res.status(200).json({
            success: true,
            message: "Transportation updated successfully",
            data: updatedTransportation,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📌 Delete transportation
const deleteTransportation = async (req, res) => {
    try {
        const deletedTransportation = await Transportation.findByIdAndDelete(req.params.id);
        if (!deletedTransportation) {
            return res.status(404).json({ success: false, message: "Transportation not found" });
        }
        res.status(200).json({ success: true, message: "Transportation deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addTransportation,
    getAllTransportation,
    getTransportationById,
    updateTransportation,
    deleteTransportation,
};
