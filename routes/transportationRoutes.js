const express = require("express");
const transportationRouter = express.Router();
const {
    addTransportation,
    getAllTransportation,
    getTransportationById,
    updateTransportation,
    deleteTransportation,
} = require("../controllers/transportationController.js");

// Create a new transportation record
transportationRouter.post("/add-transport", addTransportation);

// Get all transportation records with optional filtering and pagination
transportationRouter.get("/all-transport", getAllTransportation);

// Get a single transportation record by ID
transportationRouter.get("/get-transport/:id", getTransportationById);

// Update an existing transportation record by ID
transportationRouter.put("/update-transport/:id", updateTransportation);

// Delete a transportation record by ID
transportationRouter.delete("/delete-transport/:id", deleteTransportation);

module.exports = transportationRouter;
